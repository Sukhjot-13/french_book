"""
Enrichment Batch Generator (enrichment/scripts/make_enrichment_batch.py)

Generates self-contained, high-quality prompt batch TXT files for manual GPT upload.
Supports single collection, custom fields, entity filtering, and whole-dataset queue (--all).
Writes to enrichment/manual/batches/ with global sequential naming.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List, Optional, Union

# Ensure repo root and scripts directory are in python path
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT_DIR = Path(__file__).resolve().parent
for p in [str(REPO_ROOT), str(SCRIPT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from enrichment.scripts.enrichment_config import (
    DEFAULT_BATCH_SIZES,
    COLLECTION_ORDER,
    PROTECTED_COLLECTIONS,
    NATURAL_KEYS,
    SAFE_FIELDS,
    HIGH_RISK_FIELDS,
    ALLOWED_OPERATIONS,
    BATCHES_DIR,
    LOGS_DIR,
    BATCH_MANIFEST_FILE,
    PROGRESS_FILE,
)
from enrichment.scripts.enrichment_helpers import (
    load_master_data,
    load_master_schema,
    calculate_hash,
    extract_natural_key,
    natural_key_to_str,
    save_json,
    load_json,
    resolve_field_name,
)




def get_next_global_sequence(manifest: Dict[str, Any]) -> int:
    """Computes the next 1-based global sequence integer across all generated batches."""
    batches = manifest.get("batches", [])
    if not batches:
        return 1
    max_seq = 0
    for b in batches:
        seq = b.get("global_sequence", 0)
        if seq > max_seq:
            max_seq = seq
    return max_seq + 1


def filter_entity_context(collection: str, entity: Dict[str, Any], requested_fields: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Extracts relevant context for an entity to include in the batch prompt.
    Includes natural keys, essential identifiers, current requested fields,
    and compact pedagogical context without dumping huge metadata.
    """
    spec = NATURAL_KEYS.get(collection)
    context: Dict[str, Any] = {}
    
    # Always include natural key fields
    if isinstance(spec, list):
        for k in spec:
            context[k] = entity.get(k)
    elif spec:
        context[spec] = entity.get(spec)
        
    # Standard identity helpers
    for id_key in ["display_form", "name", "title", "rule_name", "chapter_number", "part_of_speech", "mood"]:
        if id_key in entity and id_key not in context:
            context[id_key] = entity.get(id_key)
            
    # Include currently existing values for requested fields or standard fields
    fields_to_include = requested_fields if requested_fields else SAFE_FIELDS.get(collection, [])
    for f in fields_to_include:
        norm_f = resolve_field_name(f)
        if norm_f in entity:
            val = entity.get(norm_f)
            # Truncate very long arrays for prompt brevity
            if isinstance(val, list) and len(val) > 10:
                context[f"existing_{norm_f}"] = val[:10] + [f"... ({len(val) - 10} more items)"]
            else:
                context[f"existing_{norm_f}"] = val
                
    # Helpful collection-specific compact context
    if collection == "verbs":
        if entity.get("verb_group"): context["verb_group"] = entity.get("verb_group")
        if entity.get("auxiliary"): context["auxiliary"] = entity.get("auxiliary")
        if entity.get("stems"): context["stems"] = entity.get("stems")
        if entity.get("related_expressions"): context["related_expressions"] = entity.get("related_expressions")[:5]
    elif collection == "vocabulary":
        if entity.get("gender"): context["gender"] = entity.get("gender")
        if entity.get("articles"): context["articles"] = entity.get("articles")
        if entity.get("word_family"): context["word_family"] = entity.get("word_family")
    elif collection == "expressions":
        if entity.get("pattern"): context["pattern"] = entity.get("pattern")
        if entity.get("expression_type"): context["expression_type"] = entity.get("expression_type")
        if entity.get("prepositions"): context["prepositions"] = entity.get("prepositions")
    elif collection == "grammar_rules":
        if entity.get("summary"): context["summary"] = entity.get("summary")
        if entity.get("formation"): context["formation"] = entity.get("formation")
    elif collection == "tenses":
        if entity.get("mood"): context["mood"] = entity.get("mood")
        if entity.get("english_name"): context["english_name"] = entity.get("english_name")
    elif collection == "exceptions_and_traps":
        if entity.get("correct_form"): context["correct_form"] = entity.get("correct_form")
        if entity.get("incorrect_form"): context["incorrect_form"] = entity.get("incorrect_form")
    elif collection == "exercises":
        if entity.get("exercise_code"): context["exercise_code"] = entity.get("exercise_code")
        if entity.get("instructions"): context["instructions"] = entity.get("instructions")
        if entity.get("questions"): context["questions_count"] = len(entity.get("questions", []))
        
    return context


def get_collection_schema_excerpt(collection: str, requested_fields: List[str]) -> Dict[str, Any]:
    """Returns the natural key and allowed-field schema needed for one AI batch."""
    master_schema = load_master_schema()
    collection_spec = master_schema.get("properties", {}).get(collection, {})
    item_ref = collection_spec.get("items", {}).get("$ref", "")
    definition_name = item_ref.rsplit("/", 1)[-1]
    entity_schema = master_schema.get("$defs", {}).get(definition_name, {})
    properties = entity_schema.get("properties", {})
    natural_key = NATURAL_KEYS.get(collection)
    key_fields = natural_key if isinstance(natural_key, list) else [natural_key]
    included_fields = list(dict.fromkeys([*key_fields, *requested_fields]))
    selected_properties = {field: properties[field] for field in included_fields if field in properties}

    referenced_defs: Dict[str, Any] = {}
    pending: List[Any] = list(selected_properties.values())
    while pending:
        value = pending.pop()
        if isinstance(value, dict):
            ref = value.get("$ref")
            if isinstance(ref, str) and ref.startswith("#/$defs/"):
                name = ref.rsplit("/", 1)[-1]
                definition = master_schema.get("$defs", {}).get(name)
                if definition is not None and name not in referenced_defs:
                    referenced_defs[name] = definition
                    pending.append(definition)
            pending.extend(value.values())
        elif isinstance(value, list):
            pending.extend(value)

    return {
        "collection": collection,
        "natural_key": natural_key,
        "required_fields": entity_schema.get("required", []),
        "allowed_enrichment_fields": requested_fields,
        "properties": selected_properties,
        "$defs": referenced_defs,
    }


def format_batch_prompt(
    batch_id: str,
    collection: str,
    entities_context: List[Dict[str, Any]],
    requested_fields: Optional[List[str]] = None,
    collection_schema: Optional[Dict[str, Any]] = None,
) -> str:
    """Builds the complete self-contained prompt for GPT."""
    allowed_fields = requested_fields if requested_fields else SAFE_FIELDS.get(collection, [])
    response_filename = f"{batch_id}_RESPONSE.json"
    spec = NATURAL_KEYS.get(collection)
    
    if isinstance(spec, list):
        key_example = {k: f"<{k}_value>" for k in spec}
    else:
        key_example = f"<{spec}_value>"
        
    prompt_lines = [
        "================================================================================",
        f"L'ÉTUDE — FRENCH REVISION PLATFORM — MANUAL AI ENRICHMENT BATCH: {batch_id}",
        "================================================================================",
        "",
        "PROJECT CONTEXT & ROLE:",
        "You are an expert French pedagogical lexicographer and grammarian enriching L'Étude,",
        "a high-precision French revision curriculum. You are producing structured patch data.",
        "",
        f"TARGET COLLECTION: {collection}",
        f"TOTAL ENTITIES IN THIS BATCH: {len(entities_context)}",
        f"TARGET ENRICHMENT FIELDS: {', '.join(allowed_fields)}",
        "",
        "CRITICAL RULES & INTEGRITY DIRECTIVES:",
        "1. EXISTING DATA IS AUTHORITATIVE:",
        "   - Existing textbook-derived information must NEVER be removed, deleted, or overwritten.",
        "   - Add only missing, high-value pedagogical information.",
        "2. PATCHES ONLY (NO FULL REPLACEMENTS):",
        "   - Return ONLY the explicit patch operations specified below.",
        "   - Do NOT output rewritten full entities.",
        "3. NATURAL KEYS ONLY (NO ARTIFICIAL IDs):",
        "   - Every patch must identify the entity using its exact natural key as provided below.",
        "4. ALLOWED PATCH OPERATIONS:",
        "   - 'add_unique': Appends unique values to an array (e.g. synonyms, english meanings, tags).",
        "   - 'set_if_empty': Sets a singleton string/value ONLY if currently null or empty.",
        "   - 'add_object_unique': Appends unique structured objects to an array.",
        "5. NO FORCEFUL OR ARTIFICIAL ADDITIONS (DO NOT FORCE CONTENT):",
        "   - Do NOT forcefully add synonyms, examples, or senses if an entity is already complete or adequately represented.",
        "   - Do NOT fabricate obscure, archaic, non-standard, or unnatural French.",
        "   - Only add high-frequency, natural, authentic French usage when genuinely missing.",
        "   - If an entity needs no additions, simply omit it from the 'patches' array.",
        "6. UNCERTAINTY BEHAVIOR:",
        "   - If you are uncertain of a meaning, usage nuance, or classification, DO NOT GUESS.",
        "   - Place speculative items into the top-level 'uncertain_suggestions' array or omit them.",
        "7. ACCURACY & ORTHOGRAPHY:",
        "   - Maintain rigorous French orthography, accents (é, è, ê, ç, etc.), and elision.",
        "8. STRICT OUTPUT FORMAT:",
        f"   - Create one UTF-8 JSON FILE named exactly: {response_filename}",
        "   - Attach that JSON file as your response so it can be downloaded directly.",
        "   - The file must contain only the JSON object; no Markdown or conversational text.",

        "",
        "--------------------------------------------------------------------------------",
        "EXPECTED JSON RESPONSE CONTRACT:",
        "--------------------------------------------------------------------------------",
        json.dumps({
            "batch_id": batch_id,
            "collection": collection,
            "patches": [
                {
                    "entity_key": key_example,
                    "operations": [
                        {
                            "operation": "add_unique",
                            "field": "<field_name>",
                            "values": ["<new_value_1>", "<new_value_2>"]
                        },
                        {
                            "operation": "set_if_empty",
                            "field": "<singleton_field>",
                            "value": "<value>"
                        }
                    ]
                }
            ],
            "uncertain_suggestions": [],
            "batch_summary": "Short 1-2 sentence description of additions made in this batch."
        }, indent=2, ensure_ascii=False),
        "",
        "--------------------------------------------------------------------------------",
        "COLLECTION SCHEMA (REFERENCE ONLY — IT DOES NOT AUTHORIZE EXTRA FIELDS):",
        "--------------------------------------------------------------------------------",
        json.dumps(collection_schema or {}, indent=2, ensure_ascii=False),
        "",
        "--------------------------------------------------------------------------------",
        "ENTITIES TO ENRICH (EXISTING CONTEXT):",
        "--------------------------------------------------------------------------------",
        json.dumps(entities_context, indent=2, ensure_ascii=False),
        "",
        "================================================================================",
        "END OF BATCH PROMPT. PLEASE RETURN THE JSON PATCH OBJECT NOW.",
        "================================================================================"
    ]
    
    return "\n".join(prompt_lines)


def generate_single_batch(
    dataset: Dict[str, Any],
    collection: str,
    entities: List[Dict[str, Any]],
    global_seq: int,
    collection_batch_num: int,
    requested_fields: Optional[List[str]] = None,
    master_hash: str = "",
) -> Dict[str, Any]:
    """Generates one batch TXT file and returns its manifest entry."""
    batch_id = f"{global_seq:03d}_{collection}_batch_{collection_batch_num:03d}"
    txt_filename = f"{batch_id}.txt"
    txt_filepath = BATCHES_DIR / txt_filename
    
    contexts = [filter_entity_context(collection, e, requested_fields) for e in entities]
    allowed_fields = requested_fields if requested_fields else SAFE_FIELDS.get(collection, [])
    collection_schema = get_collection_schema_excerpt(collection, allowed_fields)
    prompt_text = format_batch_prompt(batch_id, collection, contexts, allowed_fields, collection_schema)
    
    BATCHES_DIR.mkdir(parents=True, exist_ok=True)
    with open(txt_filepath, "w", encoding="utf-8") as f:
        f.write(prompt_text)
        
    entity_keys = [natural_key_to_str(collection, extract_natural_key(collection, e)) for e in entities]
    
    manifest_entry = {
        "batch_id": batch_id,
        "global_sequence": global_seq,
        "collection": collection,
        "collection_batch_number": collection_batch_num,
        "batch_size": len(entities),
        "filename": txt_filename,
        "master_hash": master_hash,
        "requested_fields": requested_fields if requested_fields else SAFE_FIELDS.get(collection, []),
        "entity_keys": entity_keys,
        "status": "generated",
    }
    
    return manifest_entry


def run_batch_generation(args: argparse.Namespace) -> None:
    dataset = load_master_data()
    master_hash = calculate_hash(dataset)
    
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    if getattr(args, "reset", False):
        manifest = {"batches": []}
        progress = {}
    else:
        manifest = load_json(BATCH_MANIFEST_FILE) if BATCH_MANIFEST_FILE.exists() else {"batches": []}
        progress = load_json(PROGRESS_FILE) if PROGRESS_FILE.exists() else {}
    
    collections_to_process: List[str] = []

    if args.all:
        collections_to_process = [c for c in COLLECTION_ORDER if c in dataset and c not in PROTECTED_COLLECTIONS]
    elif args.collection:
        coll = args.collection.lower().strip()
        if coll in PROTECTED_COLLECTIONS and not args.force:
            print(f"Error: Collection '{coll}' is protected from automated enrichment.")
            sys.exit(1)
        if coll not in dataset:
            print(f"Error: Collection '{coll}' does not exist in master dataset.")
            sys.exit(1)
        collections_to_process = [coll]
    else:
        print("Error: Specify a collection name or use --all to generate batches for the whole dataset.")
        sys.exit(1)
        
    global_seq = get_next_global_sequence(manifest)
    total_generated = 0
    summary_counts: Dict[str, int] = {}
    
    for coll in collections_to_process:
        items = dataset.get(coll, [])
        if not items:
            continue
            
        batch_size = args.batch_size if args.batch_size else DEFAULT_BATCH_SIZES.get(coll, 20)
        
        # Filter entities if explicit entities requested
        if args.entities:
            target_entities = [
                e for e in items
                if any(k.lower() in natural_key_to_str(coll, extract_natural_key(coll, e)).lower() for k in args.entities)
            ]
        elif args.missing_only:
            # Select entities where at least one requested/safe field is empty or null
            fields_to_check = args.fields if args.fields else SAFE_FIELDS.get(coll, [])
            target_entities = []
            for e in items:
                has_missing = False
                for f in fields_to_check:
                    norm_f = resolve_field_name(f)
                    val = e.get(norm_f)
                    if val is None or val == "" or val == []:
                        has_missing = True
                        break
                if has_missing:
                    target_entities.append(e)
        else:
            start_idx = args.start if args.start is not None else progress.get(coll, {}).get("processed_entities", 0)
            target_entities = items[start_idx:]
            
        if not target_entities:
            print(f"[{coll}] No entities found to batch.")
            continue
            
        coll_batch_num = progress.get(coll, {}).get("last_batch", 0) + 1
        if args.batch_number:
            coll_batch_num = args.batch_number
            
        chunks = [target_entities[i:i + batch_size] for i in range(0, len(target_entities), batch_size)]
        if not args.all and not args.full_queue:
            # Single batch mode if not --all and not --full-queue
            chunks = chunks[:1]
            
        coll_generated = 0
        for chunk in chunks:
            manifest_entry = generate_single_batch(
                dataset=dataset,
                collection=coll,
                entities=chunk,
                global_seq=global_seq,
                collection_batch_num=coll_batch_num,
                requested_fields=args.fields,
                master_hash=master_hash,
            )
            manifest["batches"].append(manifest_entry)
            
            # Update progress
            coll_prog = progress.get(coll, {"last_batch": 0, "processed_entities": 0})
            coll_prog["last_batch"] = coll_batch_num
            coll_prog["processed_entities"] = coll_prog.get("processed_entities", 0) + len(chunk)
            progress[coll] = coll_prog
            
            global_seq += 1
            coll_batch_num += 1
            coll_generated += 1
            total_generated += 1
            
        summary_counts[coll] = coll_generated
        
    # Save manifest and progress
    save_json(manifest, BATCH_MANIFEST_FILE, indent=2)
    save_json(progress, PROGRESS_FILE, indent=2)
    
    print("\n" + "=" * 60)
    print("L'ÉTUDE ENRICHMENT BATCH GENERATION SUMMARY")
    print("=" * 60)
    for coll, count in summary_counts.items():
        print(f"  {coll.ljust(25)}: {count} batch(es) generated")
    print("-" * 60)
    print(f"Total batches generated : {total_generated}")
    print(f"Batches folder          : {BATCHES_DIR}")
    print(f"Manifest logged to      : {BATCH_MANIFEST_FILE}")
    print("=" * 60 + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate manual AI enrichment prompt batch TXT files.")
    parser.add_argument("collection", nargs="?", help="Collection name (verbs, vocabulary, expressions, etc.)")
    parser.add_argument("--all", action="store_true", help="Generate batches for all enrichable collections across the dataset.")
    parser.add_argument("--full-queue", action="store_true", help="Generate all batches for the selected collection until end.")
    parser.add_argument("--batch-size", type=int, help="Override default batch size.")
    parser.add_argument("--batch-number", type=int, help="Specify starting batch number for collection.")
    parser.add_argument("--start", type=int, help="Starting entity offset index.")
    parser.add_argument("--fields", nargs="+", help="Specific target fields to enrich.")
    parser.add_argument("--entities", nargs="+", help="Specific natural key identifiers to include.")
    parser.add_argument("--missing-only", action="store_true", help="Only batch entities missing requested fields.")
    parser.add_argument("--reset", action="store_true", help="Reset batch manifest and progress counters from scratch.")
    parser.add_argument("--force", action="store_true", help="Force generation even for protected collections.")
    
    args = parser.parse_args()

    run_batch_generation(args)


if __name__ == "__main__":
    main()
