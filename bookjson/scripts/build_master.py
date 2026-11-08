#!/usr/bin/env python3
"""
Deterministic Legacy-to-Master Migration & Consolidation Pipeline.

Maps all 31 source JSON files from LEGACY_COMBINED_SCHEMA.json to MASTER_SCHEMA.json,
deduplicating entities safely, merging all subordinate information, and tracking coverage
at the populated leaf value level.

Output files:
- master/master.json
- migration/MIGRATION_CONFLICTS.json
- migration/MIGRATION_COVERAGE.json
- migration/DEDUPLICATION_REPORT.json
- migration/REFERENCE_VALIDATION.json
- migration/MASTER_VALIDATION_REPORT.json
"""

import argparse
import copy
import glob
import json
import os
import re
import sys
from collections import Counter, defaultdict
from typing import Any, Dict, List, Optional, Set, Tuple, Union

try:
    import jsonschema
    from jsonschema import Draft202012Validator
except ImportError:
    print("Error: jsonschema is required. Please install it.")
    sys.exit(1)


# ----------------------------------------------------------------------
# 1. Identity Normalization
# ----------------------------------------------------------------------

def normalize_text_identity(text: Optional[str]) -> str:
    """Safe identity normalization for deduplication matching only.
    Preserves display text, accents, and case where appropriate.
    """
    if not text:
        return ""
    # Normalize unicode apostrophes
    s = text.replace("’", "'").replace("‘", "'").replace("`", "'").replace("´", "'")
    # Collapse multiple whitespace and trim
    s = re.sub(r"\s+", " ", s).strip()
    return s


def normalize_infinitive(infinitive: Optional[str]) -> str:
    """Infinitive identity: trimmed, collapsed spaces, normalized apostrophe, lowercase."""
    s = normalize_text_identity(infinitive)
    return s.lower()


def normalize_sentence(sentence: Optional[str]) -> str:
    """French example sentence identity: trimmed, collapsed spaces, normalized apostrophe, lowercase for matching."""
    s = normalize_text_identity(sentence)
    # Strip terminal punctuation for identity comparison only
    s_clean = re.sub(r"[\.\?!;:]+$", "", s).strip().lower()
    return s_clean or s.lower()


def canonical_tense_name(tense_id: Optional[str], tense_name: Optional[str] = None) -> str:
    """Map legacy tense_id and tense_name to canonical French revision tense name."""
    tid = (tense_id or "").lower().strip()
    tname = (tense_name or "").lower().strip()

    mapping = {
        "tense_present": "présent",
        "tense_present_indicative": "présent",
        "present": "présent",
        "présent": "présent",
        "present indicative": "présent",
        "tense_imparfait": "imparfait",
        "tense_imperfect": "imparfait",
        "imparfait": "imparfait",
        "imperfect": "imparfait",
        "imperfect indicative": "imparfait",
        "tense_passe_compose": "passé composé",
        "tense_passé_composé": "passé composé",
        "passé composé": "passé composé",
        "passe compose": "passé composé",
        "conversational past / present perfect": "passé composé",
        "tense_plus_que_parfait": "plus-que-parfait",
        "plus-que-parfait": "plus-que-parfait",
        "pluperfect": "plus-que-parfait",
        "pluperfect indicative": "plus-que-parfait",
        "tense_futur_simple": "futur simple",
        "tense_future": "futur simple",
        "futur simple": "futur simple",
        "future": "futur simple",
        "simple future": "futur simple",
        "tense_futur_anterieur": "futur antérieur",
        "futur antérieur": "futur antérieur",
        "future perfect": "futur antérieur",
        "tense_futur_proche": "futur proche",
        "futur proche": "futur proche",
        "tense_passe_recent": "passé récent",
        "passé récent": "passé récent",
        "tense_passe_simple": "passé simple",
        "passé simple": "passé simple",
        "historical past": "passé simple",
        "past perfect": "passé antérieur",
        "tense_conditionnel_present": "conditionnel présent",
        "tense_present_conditional": "conditionnel présent",
        "tense_conditional_present": "conditionnel présent",
        "conditionnel présent": "conditionnel présent",
        "present conditional": "conditionnel présent",
        "tense_conditionnel_passe": "conditionnel passé",
        "tense_past_conditional": "conditionnel passé",
        "conditionnel passé": "conditionnel passé",
        "past conditional": "conditionnel passé",
        "tense_present_subjunctive": "subjonctif présent",
        "tense_subjunctive_present": "subjonctif présent",
        "subjonctif présent": "subjonctif présent",
        "present subjunctive": "subjonctif présent",
        "tense_past_subjunctive": "subjonctif passé",
        "subjonctif passé": "subjonctif passé",
        "past subjunctive": "subjonctif passé",
        "imperfect subjunctive": "subjonctif imparfait",
        "pluperfect subjunctive": "subjonctif plus-que-parfait",
        "tense_imperative": "impératif",
        "imperative": "impératif",
        "impératif": "impératif",
        "tense_present_participle": "participe présent",
        "present participle": "participe présent",
        "tense_gerund": "participe présent",
        "tense_perfect_participle": "participe passé composé",
        "perfect participle": "participe passé composé",
        "tense_infinitive_present": "infinitif",
        "tense_infinitif": "infinitif",
        "present infinitive": "infinitif",
        "infinitive": "infinitif",
        "tense_infinitive_past": "infinitif passé",
        "past infinitive": "infinitif passé",
        "tense_passive_present": "présent passif",
        "tense_passive_passe_compose": "passé composé passif",
        "tense_passive_imparfait": "imparfait passif",
        "tense_passive_passe_simple": "passé simple passif",
        "tense_passive_future": "futur simple passif",
        "tense_passive_conditional": "conditionnel présent passif",
    }

    if tid in mapping:
        return mapping[tid]
    if tname in mapping:
        return mapping[tname]
    clean = re.sub(r"^tense_", "", tid).replace("_", " ").strip()
    return clean or tname or "inconnu"


# ----------------------------------------------------------------------
# 2. Trackers: Coverage, Conflicts, Deduplication, References
# ----------------------------------------------------------------------

class CoverageTracker:
    """Tracks populated legacy values and records their disposition."""
    def __init__(self):
        self.counts = Counter({
            "DIRECTLY_MAPPED": 0,
            "MOVED_TO_PROVENANCE": 0,
            "TRANSFORMED": 0,
            "MERGED": 0,
            "MOVED_TO_UNRESOLVED": 0,
            "CONFLICTED": 0,
            "UNACCOUNTED": 0
        })
        self.details = defaultdict(int)
        self.unaccounted_samples = []

    def record(self, action: str, path: str, count: int = 1):
        self.counts[action] += count
        self.details[f"{action}:{path}"] += count

    def record_unaccounted(self, path: str, val: Any):
        self.counts["UNACCOUNTED"] += 1
        if len(self.unaccounted_samples) < 50:
            self.unaccounted_samples.append({"path": path, "sample_value": str(val)[:150]})

    def to_dict(self) -> Dict[str, Any]:
        return {
            "summary": dict(self.counts),
            "unaccounted_count": self.counts["UNACCOUNTED"],
            "unaccounted_samples": self.unaccounted_samples,
            "disposition_by_path": dict(sorted(self.details.items()))
        }


class ConflictTracker:
    """Tracks non-silent data conflicts across sources with rich value provenance."""
    def __init__(self, coverage: Optional['CoverageTracker'] = None):
        self.conflicts: List[Dict[str, Any]] = []
        self.coverage = coverage

    def add(self, conflict_type: str, entity_type: str, entity_key: str, field: str,
            values: List[Any], notes: Optional[str] = None, legacy_path: Optional[str] = None):
        if self.coverage and legacy_path:
            self.coverage.record("CONFLICTED", legacy_path)

        norm_values: List[Dict[str, Any]] = []
        for v in values:
            if isinstance(v, dict) and "value" in v and "sources" in v:
                norm_values.append(v)
            else:
                norm_values.append({"value": v, "sources": []})

        for c in self.conflicts:
            if c["conflict_type"] == conflict_type and c["entity_type"] == entity_type and c["entity_key"] == entity_key and c["field"] == field:
                for nv in norm_values:
                    found = False
                    for ev in c["values"]:
                        if ev["value"] == nv["value"]:
                            ev["sources"] = merge_source_evidence_lists(ev["sources"], nv.get("sources", []))
                            found = True
                            break
                    if not found:
                        c["values"].append(nv)
                return

        self.conflicts.append({
            "conflict_type": conflict_type,
            "entity_type": entity_type,
            "entity_key": entity_key,
            "field": field,
            "values": norm_values,
            "notes": notes
        })

    def to_list(self) -> List[Dict[str, Any]]:
        return self.conflicts


class DeduplicationTracker:
    """Tracks deduplication metrics across all top-level and subordinate entities."""
    def __init__(self):
        self.before_counts = Counter()
        self.after_counts = Counter()
        self.merge_examples = defaultdict(list)

    def record_source(self, entity_type: str, count: int = 1):
        self.before_counts[entity_type] += count

    def record_master(self, entity_type: str, count: int = 1):
        self.after_counts[entity_type] += count

    def add_merge_example(self, entity_type: str, key: str, details: Dict[str, Any]):
        if len(self.merge_examples[entity_type]) < 3:
            self.merge_examples[entity_type].append({"key": key, "details": details})

    def to_dict(self) -> Dict[str, Any]:
        res = {
            "summary": {},
            "merge_examples": dict(self.merge_examples)
        }
        for k in sorted(set(list(self.before_counts.keys()) + list(self.after_counts.keys()))):
            before = self.before_counts[k]
            after = self.after_counts[k]
            merged = max(0, before - after)
            res["summary"][k] = {
                "source_count": before,
                "master_count": after,
                "duplicates_merged": merged
            }
        return res


class ReferenceValidator:
    """Validates natural cross-links against canonical master collections."""
    def __init__(self):
        self.broken_references = []
        self.total_references = Counter()
        self.valid_references = Counter()

    def check(self, source_entity: str, source_key: str, ref_type: str,
              ref_val: Any, target_set: Set[Any]):
        self.total_references[ref_type] += 1
        if ref_val in target_set:
            self.valid_references[ref_type] += 1
        else:
            self.broken_references.append({
                "source_entity": source_entity,
                "source_key": source_key,
                "ref_type": ref_type,
                "referenced_value": ref_val,
                "status": "TARGET_NOT_FOUND"
            })

    def to_dict(self) -> Dict[str, Any]:
        return {
            "total_references_checked": sum(self.total_references.values()),
            "valid_references_count": sum(self.valid_references.values()),
            "broken_references_count": len(self.broken_references),
            "by_type": {
                k: {
                    "total": self.total_references[k],
                    "valid": self.valid_references[k],
                    "broken": self.total_references[k] - self.valid_references[k]
                }
                for k in self.total_references
            },
            "broken_samples": self.broken_references[:100]
        }


# ----------------------------------------------------------------------
# 3. Source Evidence Builder
# ----------------------------------------------------------------------

def clean_source_evidence(ev: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure a sourceEvidence dictionary matches MASTER_SCHEMA $defs/sourceEvidence."""
    allowed_source_types = {
        "chapter", "book", "glossary", "verb_table", "answer_key",
        "ai_enrichment", "user_added", "derived", "other"
    }
    stype = ev.get("source_type") or "chapter"
    if stype not in allowed_source_types:
        stype = "other"

    allowed_columns = {"left", "right", "single", "unknown", None}
    col = ev.get("column")
    if col not in allowed_columns:
        col = None

    allowed_contexts = {
        "explanation", "example", "exercise", "answer_key", "vocabulary",
        "table", "note", "dialogue", "caption", "warning", "contrast",
        "glossary", "other", None
    }
    ctx = ev.get("context_type")
    if ctx not in allowed_contexts:
        ctx = "other" if ctx else None

    allowed_directions = {"fr_en", "en_fr", None}
    direct = ev.get("direction")
    if direct not in allowed_directions:
        direct = None

    allowed_creators = {
        "independent_extraction", "rule_expansion", "mapping_script",
        "ai_enrichment", "manual", "other", None
    }
    cby = ev.get("created_by")
    if cby not in allowed_creators:
        cby = "independent_extraction"

    return {
        "source_type": stype,
        "source_name": ev.get("source_name"),
        "chapter_number": ev.get("chapter_number"),
        "section_title": ev.get("section_title"),
        "page_printed": ev.get("page_printed"),
        "page_pdf": ev.get("page_pdf"),
        "context_type": ctx,
        "exercise_code": ev.get("exercise_code"),
        "question_number": ev.get("question_number"),
        "table_title": ev.get("table_title"),
        "table_type": ev.get("table_type"),
        "row_label": ev.get("row_label"),
        "column": col,
        "direction": direct,
        "source_headword": ev.get("source_headword"),
        "source_target": ev.get("source_target"),
        "source_text": ev.get("source_text"),
        "created_by": cby,
        "notes": ev.get("notes"),
        "derived_from": sorted(list(set(ev.get("derived_from") or []))),
        "source_classifications": sorted(list(set(ev.get("source_classifications") or [])))
    }


def make_evidence_hash(ev: Dict[str, Any]) -> str:
    """Create a hashable representation of sourceEvidence for deduplication."""
    parts = [
        str(ev.get("source_type")),
        str(ev.get("source_name")),
        str(ev.get("chapter_number")),
        str(ev.get("page_printed")),
        str(ev.get("context_type")),
        str(ev.get("exercise_code")),
        str(ev.get("question_number")),
        str(ev.get("source_text")),
        str(ev.get("source_headword"))
    ]
    return "|".join(parts)


def merge_source_evidence_lists(list1: List[Dict[str, Any]], list2: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Union merge sourceEvidence objects by signature."""
    seen = set()
    result = []
    for item in list1 + list2:
        cleaned = clean_source_evidence(item)
        sig = make_evidence_hash(cleaned)
        if sig not in seen:
            seen.add(sig)
            result.append(cleaned)
    return result


def strip_subject_pronoun(form: Optional[str], person_key: str) -> Optional[str]:
    """Deterministic subject pronoun stripping from conjugation forms."""
    if not form or not isinstance(form, str):
        return form
    s = form.strip()
    s_norm = s.replace("’", "'").replace("‘", "'").replace("`", "'")

    if person_key == "je":
        m = re.match(r"^(?:j\s*[']|je\s+)(.*)$", s_norm, re.IGNORECASE)
        if m and m.group(1).strip():
            return m.group(1).strip()
    elif person_key == "tu":
        m = re.match(r"^(?:tu\s+)(.*)$", s_norm, re.IGNORECASE)
        if m and m.group(1).strip():
            return m.group(1).strip()
    elif person_key == "il_elle_on":
        m = re.match(r"^(?:il\s*/\s*elle\s*/\s*on|il\s*/\s*elle|il\s*,\s*elle\s*,\s*on|il\s*/\s*on|elle|il|on)\s+(.*)$", s_norm, re.IGNORECASE)
        if m and m.group(1).strip():
            return m.group(1).strip()
    elif person_key == "nous":
        m = re.match(r"^(?:nous\s+)(.*)$", s_norm, re.IGNORECASE)
        if m and m.group(1).strip():
            return m.group(1).strip()
    elif person_key == "vous":
        m = re.match(r"^(?:vous\s+)(.*)$", s_norm, re.IGNORECASE)
        if m and m.group(1).strip():
            return m.group(1).strip()
    elif person_key == "ils_elles":
        m = re.match(r"^(?:ils\s*/\s*elles|ils\s*,\s*elles|ils|elles)\s+(.*)$", s_norm, re.IGNORECASE)
        if m and m.group(1).strip():
            return m.group(1).strip()
    return s


def default_articles() -> Dict[str, Any]:
    """Default articles representation matching updated MASTER_SCHEMA."""
    return {
        "definite": None,
        "indefinite": None,
        "partitive": None,
        "other": []
    }


def classify_articles(raw_article: Optional[str]) -> Dict[str, Any]:
    """Deterministically map legacy article strings into structured articles object."""
    res = default_articles()
    if not raw_article or not isinstance(raw_article, str):
        return res
    art = raw_article.strip()
    if not art:
        return res
    art_norm = art.replace("’", "'").replace("‘", "'").replace("`", "'")
    lower = art_norm.lower()
    if lower in ["le", "la", "l'", "les", "le/la"]:
        res["definite"] = art
    elif lower in ["un", "une", "un/une", "un / une", "un(e)", "des"]:
        res["indefinite"] = art
    elif lower in ["du", "de la", "de l'"]:
        res["partitive"] = art
    else:
        res["other"].append(art)
    return res


def merge_articles(a1: Dict[str, Any], a2: Dict[str, Any]) -> Dict[str, Any]:
    """Union merge two articles objects."""
    d1 = a1 or default_articles()
    d2 = a2 or default_articles()
    return {
        "definite": d1.get("definite") or d2.get("definite"),
        "indefinite": d1.get("indefinite") or d2.get("indefinite"),
        "partitive": d1.get("partitive") or d2.get("partitive"),
        "other": sorted(list(set((d1.get("other") or []) + (d2.get("other") or []))))
    }


def normalize_present_participle(pp: Optional[str], is_pronominal: bool) -> Optional[str]:
    """Use lexical participle without reflexive pronoun for pronominal verbs."""
    if not pp or not isinstance(pp, str):
        return pp
    s = pp.strip()
    if is_pronominal:
        s_norm = s.replace("’", "'").replace("‘", "'").replace("`", "'")
        m = re.match(r"^(?:se\s+|s\s*['])(.*)$", s_norm, re.IGNORECASE)
        if m and m.group(1).strip():
            return m.group(1).strip()
    return s


def normalize_note_for_comparison(val: Any) -> Any:
    """Ignore differences solely caused by case, whitespace, and terminal punctuation for conflict comparison."""
    if not isinstance(val, str):
        return val
    s = val.strip().lower()
    s = re.sub(r"[.,;:!?]+$", "", s).strip()
    return s


def sense_subordinate_key(s: Dict[str, Any]) -> Tuple:
    """Key for comparing meaningful subordinate information of a vocabulary sense."""
    art = s.get("articles") or {}
    return (
        normalize_text_identity(s.get("english") or ""),
        normalize_note_for_comparison(s.get("note") or ""),
        s.get("gender"),
        s.get("plural"),
        art.get("definite"),
        art.get("indefinite"),
        art.get("partitive"),
        tuple(sorted(art.get("other") or []))
    )


def merge_singleton_value(v1: Any, v2: Any, entity_type: str, entity_key: str, field: str,
                          conflicts: ConflictTracker, s1: List[Any], s2: List[Any],
                          legacy_path: Optional[str] = None) -> Any:
    """Treat null and unknown as missing during singleton merging."""
    is_v1_known = v1 is not None and v1 != "" and v1 != "unknown"
    is_v2_known = v2 is not None and v2 != "" and v2 != "unknown"

    if not is_v1_known and not is_v2_known:
        return v1 if v1 is not None else v2
    if not is_v1_known and is_v2_known:
        return v2
    if is_v1_known and not is_v2_known:
        return v1
    # Both known
    if v1 == v2:
        return v1
    else:
        conflicts.add(
            "DIFFERENT_SINGLETON_VALUES",
            entity_type,
            entity_key,
            field,
            [
                {"value": v1, "sources": s1 or []},
                {"value": v2, "sources": s2 or []}
            ],
            legacy_path=legacy_path
        )
        return v1


def default_study_metadata() -> Dict[str, Any]:
    """Default study metadata structure matching MASTER_SCHEMA."""
    return {
        "learning_priority": None,
        "importance": None,
        "frequency": None,
        "usefulness": None,
        "difficulty": None,
        "frequency_note": None,
        "notes": None
    }


def merge_study_metadata(s1: Optional[Dict[str, Any]], s2: Optional[Dict[str, Any]],
                         conflicts: ConflictTracker, entity_type: str, entity_key: str,
                         s1_sources: Optional[List[Any]] = None, s2_sources: Optional[List[Any]] = None) -> Dict[str, Any]:
    """Conservative merge of study metadata with textual normalization and provenance."""
    res = default_study_metadata()
    if not s1 and not s2:
        return res
    d1 = s1 or {}
    d2 = s2 or {}

    keys = ["learning_priority", "importance", "frequency", "usefulness", "difficulty", "frequency_note", "notes"]
    for k in keys:
        v1 = d1.get(k)
        v2 = d2.get(k)

        is_v1_known = v1 is not None and v1 != "" and v1 != "unknown"
        is_v2_known = v2 is not None and v2 != "" and v2 != "unknown"

        if not is_v1_known and not is_v2_known:
            res[k] = v1 if v1 is not None else v2
        elif not is_v1_known and is_v2_known:
            res[k] = v2
        elif is_v1_known and not is_v2_known:
            res[k] = v1
        else:
            # Both known
            if k in ["frequency_note", "notes"]:
                if normalize_note_for_comparison(v1) == normalize_note_for_comparison(v2):
                    res[k] = v1
                    continue
            if v1 == v2:
                res[k] = v1
            else:
                conflicts.add(
                    "STUDY_METADATA_CONFLICT",
                    entity_type,
                    entity_key,
                    f"study.{k}",
                    [
                        {"value": v1, "sources": s1_sources or []},
                        {"value": v2, "sources": s2_sources or []}
                    ],
                    legacy_path=f"{entity_type}.study.{k}"
                )
                res[k] = v1

    return res


# ----------------------------------------------------------------------
# 4. Global Index of Legacy IDs to Natural Entities (Pass 1)
# ----------------------------------------------------------------------

class LegacyIndex:
    """Pass 1: Builds lookup indices from legacy IDs to natural reference values."""
    def __init__(self):
        self.verbs: Dict[str, str] = {}  # verb_id -> infinitive
        self.tenses: Dict[str, str] = {}  # tense_id -> canonical_tense_name
        self.expressions: Dict[str, str] = {}  # expr_id -> canonical_form
        self.rules: Dict[str, str] = {}  # rule_id -> rule_name
        self.concepts: Dict[str, str] = {}  # concept_id -> name
        self.vocabulary: Dict[str, Dict[str, Any]] = {}  # vocab_id -> {canonical_form, part_of_speech}
        self.sections: Dict[str, str] = {}  # section_id -> title
        self.examples: Dict[str, str] = {}  # example_id -> french_text
        self.exercises: Dict[str, str] = {}  # exercise_id -> exercise_code

    def scan_file(self, doc: Dict[str, Any]):
        for v in doc.get("verbs", []):
            if v.get("id"):
                inf = v.get("infinitive") or v.get("display_form")
                if inf:
                    self.verbs[v["id"]] = normalize_text_identity(inf)
        
        for conj in doc.get("conjugations", []):
            tid = conj.get("tense_id")
            tname = conj.get("tense_name")
            if tid:
                self.tenses[tid] = canonical_tense_name(tid, tname)

        for ex in doc.get("expressions", []):
            if ex.get("id"):
                cform = ex.get("canonical_form") or ex.get("display_form")
                if cform:
                    self.expressions[ex["id"]] = normalize_text_identity(cform)

        for r in doc.get("grammar_rules", []):
            if r.get("id") and r.get("rule_name"):
                self.rules[r["id"]] = normalize_text_identity(r["rule_name"])

        for c in doc.get("concepts", []):
            if c.get("id") and c.get("name"):
                self.concepts[c["id"]] = normalize_text_identity(c["name"])

        for voc in doc.get("vocabulary", []):
            if voc.get("id"):
                cform = voc.get("canonical_form") or voc.get("display_form")
                pos = voc.get("part_of_speech")
                if cform:
                    self.vocabulary[voc["id"]] = {
                        "canonical_form": normalize_text_identity(cform),
                        "part_of_speech": pos
                    }

        for s in doc.get("sections", []):
            if s.get("id") and s.get("title"):
                self.sections[s["id"]] = normalize_text_identity(s["title"])

        for exm in doc.get("examples", []):
            if exm.get("id") and exm.get("french"):
                self.examples[exm["id"]] = normalize_text_identity(exm["french"])

        for exe in doc.get("exercises", []):
            if exe.get("id"):
                code = exe.get("exercise_code") or exe.get("id")
                self.exercises[exe["id"]] = normalize_text_identity(code)

        for entry in doc.get("entries", []):
            eid = entry.get("id")
            if not eid:
                continue
            etype = entry.get("entry_type")
            c_fr = entry.get("canonical_french")
            v_inf = entry.get("verb_infinitive")
            if etype == "verb" and v_inf:
                self.verbs[eid] = normalize_text_identity(v_inf)
            elif entry.get("expression_candidate") or etype in [
                "multiword_expression", "idiom", "collocation", "verb_pattern", "phrase"
            ]:
                if c_fr:
                    self.expressions[eid] = normalize_text_identity(c_fr)
            else:
                if c_fr:
                    self.vocabulary[eid] = {
                        "canonical_form": normalize_text_identity(c_fr),
                        "part_of_speech": entry.get("part_of_speech")
                    }

        for r in doc.get("rows", []):
            rid = r.get("id")
            inf = r.get("infinitive") or r.get("display_form")
            if rid and inf:
                self.verbs[rid] = normalize_text_identity(inf)


# ----------------------------------------------------------------------
# 5. Core Migration Pipeline
# ----------------------------------------------------------------------

class MasterConsolidator:
    """Orchestrates deterministic migration and consolidation of all legacy files."""
    def __init__(self, data_dir: str, schema_dir: str):
        self.data_dir = data_dir
        self.schema_dir = schema_dir

        self.coverage = CoverageTracker()
        self.conflicts = ConflictTracker(coverage=self.coverage)
        self.dedup = DeduplicationTracker()
        self.ref_validator = ReferenceValidator()
        self.index = LegacyIndex()

        self.chapters: Dict[int, Dict[str, Any]] = {}
        self.topics: Dict[str, Dict[str, Any]] = {}
        self.concepts: Dict[str, Dict[str, Any]] = {}
        self.grammar_rules: Dict[str, Dict[str, Any]] = {}
        self.tenses: Dict[str, Dict[str, Any]] = {}
        self.verbs: Dict[str, Dict[str, Any]] = {}
        self.expressions: Dict[str, Dict[str, Any]] = {}
        self.vocabulary: Dict[Tuple[str, Optional[str]], Dict[str, Any]] = {}
        self.examples: Dict[str, Dict[str, Any]] = {}
        self.exercises: Dict[Tuple[Optional[int], str], Dict[str, Any]] = {}
        self.exceptions_and_traps: Dict[Tuple[str, str], Dict[str, Any]] = {}
        self.unresolved_items: List[Dict[str, Any]] = []
        self.source_quality: List[Dict[str, Any]] = []

    def run(self) -> Dict[str, Any]:
        print("Starting deterministic consolidation...")
        files = sorted(glob.glob(os.path.join(self.data_dir, "*.json")))
        print(f"Discovered {len(files)} source files in {self.data_dir}")

        print("Pass 1: Indexing legacy definitions and natural keys...")
        loaded_docs = []
        for fp in files:
            with open(fp, "r", encoding="utf-8") as f:
                doc = json.load(f)
            fname = os.path.basename(fp)
            loaded_docs.append((fname, doc))
            self.index.scan_file(doc)

        print(f"Indexed: {len(self.index.verbs)} verbs, {len(self.index.expressions)} expressions, "
              f"{len(self.index.rules)} rules, {len(self.index.concepts)} concepts, "
              f"{len(self.index.vocabulary)} vocabulary items.")

        print("Pass 2: Migrating and deduplicating entities...")
        for fname, doc in loaded_docs:
            if "chapter" in doc:
                self.migrate_chapter_file(fname, doc)
            elif "tables" in doc:
                self.migrate_verb_table_file(fname, doc)
            elif "exercises" in doc and "chapter" not in doc:
                self.migrate_answer_key_file(fname, doc)
            else:
                self.migrate_glossary_file(fname, doc)

        master_dataset = self.assemble_master()

        print("Pass 3: Validating natural references...")
        self.validate_all_references()

        return master_dataset

    # ------------------------------------------------------------------
    # Chapter Migration
    # ------------------------------------------------------------------

    def migrate_chapter_file(self, fname: str, doc: Dict[str, Any]):
        ch_obj = doc.get("chapter", {})
        ch_num = ch_obj.get("chapter_number")
        if ch_num is None:
            return

        self.coverage.record("DIRECTLY_MAPPED", "chapter.chapter.chapter_number")
        self.coverage.record("DIRECTLY_MAPPED", "chapter.chapter.chapter_title")
        self.coverage.record("DIRECTLY_MAPPED", "chapter.chapter.source_pages")
        if ch_obj.get("notes"):
            self.coverage.record("DIRECTLY_MAPPED", "chapter.chapter.notes")

        if ch_num not in self.chapters:
            self.dedup.record_master("chapters")
            self.chapters[ch_num] = {
                "chapter_number": ch_num,
                "chapter_title": ch_obj.get("chapter_title") or f"Chapter {ch_num}",
                "pages": ch_obj.get("source_pages") or {"printed_start": None, "printed_end": None, "pdf_start": None, "pdf_end": None},
                "sections": [],
                "concepts": [],
                "grammar_rules": [],
                "verbs": [],
                "expressions": [],
                "vocabulary": [],
                "tenses": [],
                "topics": [],
                "notes": ch_obj.get("notes"),
                "sources": []
            }
        self.dedup.record_source("chapters")

        for s in doc.get("sections", []):
            self.coverage.record("DIRECTLY_MAPPED", "chapter.sections[].title")
            sec_pages = {
                "printed_start": s.get("page_printed_start"),
                "printed_end": s.get("page_printed_end"),
                "pdf_start": s.get("page_pdf_start"),
                "pdf_end": s.get("page_pdf_end")
            }
            sec_concepts = [self.index.concepts.get(cid, cid) for cid in s.get("concept_ids", [])]
            sec_sources = []
            for att in s.get("attestations", []):
                self.coverage.record("MOVED_TO_PROVENANCE", "chapter.sections[].attestations")
                sec_sources.append(clean_source_evidence({
                    "source_type": "chapter",
                    "source_name": fname,
                    "chapter_number": ch_num,
                    "section_title": s.get("title"),
                    "page_printed": att.get("page_printed"),
                    "page_pdf": att.get("page_pdf"),
                    "context_type": att.get("context_type") or "explanation",
                    "source_text": att.get("source_text")
                }))

            parent_sec = None
            if s.get("parent_section_id"):
                parent_sec = self.index.sections.get(s["parent_section_id"])

            sec_obj = {
                "title": s.get("title") or "Section",
                "parent_section": parent_sec,
                "order": s.get("order") or 1,
                "pages": sec_pages,
                "related_concepts": sorted(list(set(sec_concepts))),
                "related_grammar_rules": [],
                "related_verbs": [],
                "related_expressions": [],
                "related_vocabulary": [],
                "related_tenses": [],
                "notes": None,
                "sources": sec_sources
            }
            self.chapters[ch_num]["sections"].append(sec_obj)

        conj_by_verb = defaultdict(list)
        for conj in doc.get("conjugations", []):
            self.coverage.record("TRANSFORMED", "chapter.conjugations[]")
            vid = conj.get("verb_id")
            if vid:
                conj_by_verb[vid].append(conj)

        for v in doc.get("verbs", []):
            self.dedup.record_source("verbs")
            self.migrate_verb(v, fname, ch_num, conj_by_verb.get(v.get("id"), []))

        for ex in doc.get("expressions", []):
            self.dedup.record_source("expressions")
            self.migrate_expression(ex, fname, ch_num)

        for voc in doc.get("vocabulary", []):
            self.dedup.record_source("vocabulary")
            self.migrate_vocabulary(voc, fname, ch_num)

        for r in doc.get("grammar_rules", []):
            self.dedup.record_source("grammar_rules")
            self.migrate_grammar_rule(r, fname, ch_num)

        for c in doc.get("concepts", []):
            self.dedup.record_source("concepts")
            self.migrate_concept(c, fname, ch_num)

        for exm in doc.get("examples", []):
            self.dedup.record_source("examples")
            self.migrate_example(exm, fname, ch_num)

        for exe in doc.get("exercises", []):
            self.dedup.record_source("exercises")
            self.migrate_exercise(exe, fname, ch_num)

        for trap in doc.get("exceptions_and_traps", []):
            self.dedup.record_source("exceptions_and_traps")
            self.migrate_exception_trap(trap, fname, ch_num)

        for unc in doc.get("uncertain_candidates", []):
            self.coverage.record("MOVED_TO_UNRESOLVED", "chapter.uncertain_candidates[]")
            unc_sources = []
            for att in unc.get("attestations", []):
                unc_sources.append(clean_source_evidence({
                    "source_type": "chapter",
                    "source_name": fname,
                    "chapter_number": ch_num,
                    "section_title": att.get("section_title"),
                    "page_printed": att.get("page_printed"),
                    "page_pdf": att.get("page_pdf"),
                    "context_type": att.get("context_type") or "exercise",
                    "exercise_code": att.get("exercise_id"),
                    "question_number": att.get("question_number"),
                    "source_text": att.get("source_text")
                }))
            self.unresolved_items.append({
                "candidate_type": unc.get("candidate_type") or "other",
                "raw_text": unc.get("text") or "",
                "normalized_candidate": unc.get("normalized_candidate"),
                "reason_uncertain": unc.get("reason_uncertain") or "Uncertain extraction in chapter.",
                "possible_values": unc.get("possible_existing_ids") or [],
                "notes": None,
                "sources": unc_sources
            })

    # ------------------------------------------------------------------
    # Verb Migration & Merging
    # ------------------------------------------------------------------

    def migrate_verb(self, v: Dict[str, Any], fname: str, ch_num: Optional[int],
                     conj_list: List[Dict[str, Any]], from_verb_table: bool = False, from_glossary: bool = False):
        raw_inf = v.get("infinitive") or v.get("display_form")
        if not raw_inf:
            return
        inf_key = normalize_infinitive(raw_inf)

        raw_aux = v.get("auxiliary")
        aux_val = None
        if raw_aux:
            self.coverage.record("TRANSFORMED", "verb.auxiliary")
            if raw_aux in ["être", "etre"]:
                aux_val = "etre"
            elif raw_aux in ["avoir", "both", "none", "unknown"]:
                aux_val = raw_aux
            else:
                aux_val = "unknown"

        trans_list = []
        raw_trans = v.get("transitivity")
        if isinstance(raw_trans, list):
            self.coverage.record("DIRECTLY_MAPPED", "verb.transitivity")
            for t in raw_trans:
                if t in ["transitive", "intransitive", "ditransitive", "copular", "unknown"]:
                    trans_list.append(t)
        elif isinstance(raw_trans, str) and raw_trans in ["transitive", "intransitive", "ditransitive", "copular", "unknown"]:
            trans_list.append(raw_trans)

        v_sources = []
        src_classifications = []
        for att in v.get("attestations", []):
            self.coverage.record("MOVED_TO_PROVENANCE", "verb.attestations")
            v_sources.append(clean_source_evidence({
                "source_type": "chapter",
                "source_name": fname,
                "chapter_number": ch_num,
                "section_title": att.get("section_title"),
                "page_printed": att.get("page_printed"),
                "page_pdf": att.get("page_pdf"),
                "context_type": att.get("context_type"),
                "source_text": att.get("source_text")
            }))
        for prov in v.get("provenance", []):
            self.coverage.record("MOVED_TO_PROVENANCE", "verb.provenance")
            v_sources.append(clean_source_evidence({
                "source_type": "verb_table" if from_verb_table else "glossary",
                "source_name": fname,
                "page_printed": prov.get("page_printed"),
                "page_pdf": prov.get("page_pdf"),
                "table_title": prov.get("table_id"),
                "row_label": prov.get("row_label"),
                "source_text": prov.get("source_text")
            }))

        vgroup = v.get("verb_group")
        if vgroup not in ["1st_group", "2nd_group", "3rd_group", "defective", "impersonal", "unknown", None]:
            src_classifications.append(f"verb_group:{vgroup}")
            vgroup = "unknown"

        v_stems = []
        if v.get("stem"):
            self.coverage.record("TRANSFORMED", "verb.stem")
            v_stems.append({
                "tense": "présent",
                "persons": ["all"],
                "stem": v["stem"],
                "note": None
            })

        v_senses = []
        for s in v.get("senses", []):
            self.coverage.record("MERGED", "verb.senses")
            eng = s.get("english") or s.get("text")
            if eng:
                v_senses.append({
                    "english": eng,
                    "note": s.get("note"),
                    "gender": None,
                    "articles": None,
                    "plural": None
                })

        rel_exprs = [self.index.expressions.get(eid, eid) for eid in v.get("expression_ids", [])]
        rel_concepts = [self.index.concepts.get(cid, cid) for cid in v.get("concept_ids", [])]

        is_pronominal = bool(v.get("pronominal"))
        raw_pp = v.get("present_participle")
        norm_pp = normalize_present_participle(raw_pp, is_pronominal)

        if inf_key not in self.verbs:
            self.dedup.record_master("verbs")
            self.verbs[inf_key] = {
                "infinitive": raw_inf,
                "display_form": v.get("display_form") or raw_inf,
                "english": copy.deepcopy(v.get("english") or []),
                "senses": v_senses,
                "verb_group": vgroup,
                "regularity": v.get("regularity"),
                "pronominal": v.get("pronominal"),
                "transitivity": sorted(list(set(trans_list))),
                "auxiliary": aux_val,
                "past_participle": v.get("past_participle"),
                "present_participle": norm_pp,
                "stems": v_stems,
                "conjugations": [],
                "related_expressions": sorted(list(set(rel_exprs))),
                "related_concepts": sorted(list(set(rel_concepts))),
                "aliases": sorted(list(set(v.get("aliases") or []))),
                "search_terms": sorted(list(set(v.get("search_terms") or []))),
                "source_classifications": sorted(list(set(src_classifications))),
                "tags": [],
                "study": merge_study_metadata(v.get("study"), None, self.conflicts, "verb", raw_inf, v_sources, None),
                "chapters": [ch_num] if ch_num is not None else [],
                "sources": v_sources,
                "notes": v.get("notes") if isinstance(v.get("notes"), str) else None
            }
        else:
            target = self.verbs[inf_key]
            self.dedup.add_merge_example("verbs", inf_key, {"merged_from": fname})
            target["english"] = sorted(list(set(target["english"] + (v.get("english") or []))))
            target["transitivity"] = sorted(list(set(target["transitivity"] + trans_list)))
            target["aliases"] = sorted(list(set(target["aliases"] + (v.get("aliases") or []))))
            target["search_terms"] = sorted(list(set(target["search_terms"] + (v.get("search_terms") or []))))
            target["related_expressions"] = sorted(list(set(target["related_expressions"] + rel_exprs)))
            target["related_concepts"] = sorted(list(set(target["related_concepts"] + rel_concepts)))
            target["source_classifications"] = sorted(list(set(target["source_classifications"] + src_classifications)))
            target["sources"] = merge_source_evidence_lists(target["sources"], v_sources)
            if ch_num is not None and ch_num not in target["chapters"]:
                target["chapters"].append(ch_num)
                target["chapters"].sort()

            seen_senses = {(s["english"], s["note"]) for s in target["senses"]}
            for s in v_senses:
                k = (s["english"], s["note"])
                if k not in seen_senses:
                    seen_senses.add(k)
                    target["senses"].append(s)

            for field in ["verb_group", "regularity", "pronominal", "past_participle", "present_participle"]:
                new_val = norm_pp if field == "present_participle" else v.get(field)
                old_val = target.get(field)
                target[field] = merge_singleton_value(
                    old_val, new_val, "verb", raw_inf, field, self.conflicts,
                    target["sources"], v_sources, legacy_path=f"verb.{field}"
                )

            target["auxiliary"] = merge_singleton_value(
                target["auxiliary"], aux_val, "verb", raw_inf, "auxiliary", self.conflicts,
                target["sources"], v_sources, legacy_path="verb.auxiliary"
            )

            target["study"] = merge_study_metadata(
                target["study"], v.get("study"), self.conflicts, "verb", raw_inf,
                target["sources"], v_sources
            )

            new_note = v.get("notes") if isinstance(v.get("notes"), str) else None
            if new_note:
                if not target["notes"]:
                    target["notes"] = new_note
                elif new_note not in target["notes"]:
                    target["notes"] += f" ; {new_note}"

        if ch_num is not None and raw_inf not in self.chapters[ch_num]["verbs"]:
            self.chapters[ch_num]["verbs"].append(raw_inf)
            self.chapters[ch_num]["verbs"].sort()

        for conj in conj_list:
            self.merge_conjugation_into_verb(self.verbs[inf_key], conj, fname, ch_num)

    def merge_conjugation_into_verb(self, verb_obj: Dict[str, Any], conj: Dict[str, Any],
                                    fname: str, ch_num: Optional[int]):
        raw_tense = canonical_tense_name(conj.get("tense_id"), conj.get("tense_name"))
        mood = conj.get("mood") or "indicative"

        self.register_tense(raw_tense, mood, ch_num, fname)

        target_conj = None
        for existing in verb_obj["conjugations"]:
            if existing["tense"] == raw_tense and existing["mood"] == mood:
                target_conj = existing
                break

        raw_forms = conj.get("forms") or conj.get("person_forms") or {}
        forms_dict = {
            "je": strip_subject_pronoun(raw_forms.get("je"), "je"),
            "tu": strip_subject_pronoun(raw_forms.get("tu"), "tu"),
            "il_elle_on": strip_subject_pronoun(raw_forms.get("il_elle_on"), "il_elle_on"),
            "nous": strip_subject_pronoun(raw_forms.get("nous"), "nous"),
            "vous": strip_subject_pronoun(raw_forms.get("vous"), "vous"),
            "ils_elles": strip_subject_pronoun(raw_forms.get("ils_elles"), "ils_elles"),
            "imperative_tu": raw_forms.get("imperative_tu") or conj.get("imperative_forms", {}).get("tu"),
            "imperative_nous": raw_forms.get("imperative_nous") or conj.get("imperative_forms", {}).get("nous"),
            "imperative_vous": raw_forms.get("imperative_vous") or conj.get("imperative_forms", {}).get("vous"),
            "impersonal_form": raw_forms.get("impersonal_form") or conj.get("impersonal_form")
        }

        c_stems = []
        if conj.get("stem"):
            c_stems.append({
                "tense": raw_tense,
                "persons": ["all"],
                "stem": conj["stem"],
                "note": None
            })
        c_endings = list(dict.fromkeys(conj.get("endings") or []))

        c_sources = []
        for att in conj.get("attestations", []):
            c_sources.append(clean_source_evidence({
                "source_type": "chapter",
                "source_name": fname,
                "chapter_number": ch_num,
                "section_title": att.get("section_title"),
                "page_printed": att.get("page_printed"),
                "page_pdf": att.get("page_pdf"),
                "context_type": att.get("context_type") or "table",
                "source_text": att.get("source_text")
            }))
        for prov in conj.get("provenance", []):
            c_sources.append(clean_source_evidence({
                "source_type": "verb_table",
                "source_name": fname,
                "page_printed": prov.get("page_printed"),
                "page_pdf": prov.get("page_pdf"),
                "table_title": prov.get("table_id"),
                "row_label": prov.get("row_label"),
                "source_text": prov.get("source_text")
            }))

        raw_notes = conj.get("notes")
        c_notes = []
        if isinstance(raw_notes, list):
            c_notes = list(dict.fromkeys([str(n) for n in raw_notes if n]))
        elif isinstance(raw_notes, str) and raw_notes.strip():
            c_notes = [raw_notes.strip()]

        if not target_conj:
            self.dedup.record_master("conjugations")
            new_conj = {
                "tense": raw_tense,
                "mood": mood,
                "forms": forms_dict,
                "stems": c_stems,
                "endings": c_endings,
                "formation_note": None,
                "irregularities": [],
                "notes": c_notes,
                "sources": c_sources
            }
            verb_obj["conjugations"].append(new_conj)
        else:
            self.dedup.record_source("conjugations")
            self.dedup.add_merge_example("conjugations", f"{verb_obj['infinitive']}@{raw_tense}", {"tense": raw_tense})
            for person in forms_dict:
                v_new = forms_dict[person]
                v_old = target_conj["forms"].get(person)

                is_old_known = v_old is not None and v_old != "" and v_old != "unknown"
                is_new_known = v_new is not None and v_new != "" and v_new != "unknown"

                if not is_old_known and is_new_known:
                    target_conj["forms"][person] = v_new
                elif is_old_known and is_new_known and v_old != v_new:
                    self.conflicts.add(
                        "CONJUGATION_FORM_CONFLICT",
                        "verb_conjugation",
                        f"{verb_obj['infinitive']} [{raw_tense}]",
                        f"forms.{person}",
                        [
                            {"value": v_old, "sources": target_conj["sources"]},
                            {"value": v_new, "sources": c_sources}
                        ],
                        legacy_path="chapter.conjugations[].forms"
                    )

            seen_stems = {(st["tense"], tuple(st["persons"]), st["stem"]) for st in target_conj["stems"]}
            for st in c_stems:
                k = (st["tense"], tuple(st["persons"]), st["stem"])
                if k not in seen_stems:
                    seen_stems.add(k)
                    target_conj["stems"].append(st)

            for end in c_endings:
                if end not in target_conj["endings"]:
                    target_conj["endings"].append(end)

            target_conj["sources"] = merge_source_evidence_lists(target_conj["sources"], c_sources)

            for n in c_notes:
                if n not in target_conj["notes"]:
                    target_conj["notes"].append(n)

    # ------------------------------------------------------------------
    # Tense Registration
    # ------------------------------------------------------------------

    def register_tense(self, tense_name: str, mood: str, ch_num: Optional[int], fname: str):
        if tense_name not in self.tenses:
            self.dedup.record_master("tenses")
            self.tenses[tense_name] = {
                "name": tense_name,
                "english_name": tense_name.capitalize(),
                "mood": mood,
                "formation": None,
                "usage": [],
                "signal_words": [],
                "regular_patterns": [],
                "irregular_stems": [],
                "compound_structure": {
                    "is_compound": False,
                    "auxiliary_tense": None,
                    "participle_rule": None,
                    "agreement_notes": []
                },
                "agreement_rules": [],
                "negative_form": None,
                "interrogative_form": None,
                "affirmative_form": None,
                "common_traps": [],
                "related_tenses": [],
                "related_grammar_rules": [],
                "tags": [],
                "study": default_study_metadata(),
                "chapters": [ch_num] if ch_num is not None else [],
                "sources": [],
                "notes": None
            }
        else:
            t = self.tenses[tense_name]
            if ch_num is not None and ch_num not in t["chapters"]:
                t["chapters"].append(ch_num)
                t["chapters"].sort()

        if ch_num is not None and tense_name not in self.chapters[ch_num]["tenses"]:
            self.chapters[ch_num]["tenses"].append(tense_name)
            self.chapters[ch_num]["tenses"].sort()

    # ------------------------------------------------------------------
    # Expression Migration & Merging
    # ------------------------------------------------------------------

    def migrate_expression(self, ex: Dict[str, Any], fname: str, ch_num: Optional[int]):
        cform = ex.get("canonical_form") or ex.get("display_form") or ex.get("canonical_french")
        if not cform:
            return
        cform = normalize_text_identity(cform)

        raw_type = ex.get("expression_type") or ex.get("entry_type")
        src_classes = []
        valid_types = {
            "construction", "verb_pattern", "collocation", "fixed_expression",
            "idiom", "sentence_starter", "conversation_phrase", "connector",
            "functional_phrase", "formulaic_phrase", "time_expression",
            "quantity_expression", "comparison_structure", "subjunctive_trigger",
            "conditional_trigger", "negative_construction", "question_construction", "other"
        }
        if raw_type in valid_types:
            canonical_type = raw_type
        elif raw_type in ["impersonal_expression", "location_expression", "frequency_expression", "phrase"]:
            src_classes.append(raw_type)
            canonical_type = "other"
        elif raw_type == "conjunction":
            src_classes.append(raw_type)
            canonical_type = "connector"
        else:
            if raw_type:
                src_classes.append(raw_type)
            canonical_type = "other"

        comp_struct = {
            "direct_object": None,
            "indirect_object": None,
            "preposition": None,
            "followed_by": None
        }
        raw_comp = ex.get("complement_structure")
        if isinstance(raw_comp, dict):
            comp_struct["direct_object"] = raw_comp.get("direct_object")
            comp_struct["indirect_object"] = raw_comp.get("indirect_object")
            comp_struct["preposition"] = raw_comp.get("preposition")
            fby = raw_comp.get("followed_by")
            if fby in ["infinitive", "noun", "person", "clause", "adjective", "adverb", "mixed", "none", "unknown", None]:
                comp_struct["followed_by"] = fby
            elif fby:
                src_classes.append(f"followed_by:{fby}")
                comp_struct["followed_by"] = "unknown"

        ex_sources = []
        for att in ex.get("attestations", []):
            ex_sources.append(clean_source_evidence({
                "source_type": "chapter",
                "source_name": fname,
                "chapter_number": ch_num,
                "section_title": att.get("section_title"),
                "page_printed": att.get("page_printed"),
                "page_pdf": att.get("page_pdf"),
                "context_type": att.get("context_type"),
                "source_text": att.get("source_text")
            }))
        for prov in ex.get("provenance", []):
            ex_sources.append(clean_source_evidence({
                "source_type": "glossary",
                "source_name": fname,
                "page_printed": prov.get("page_printed"),
                "page_pdf": prov.get("page_pdf"),
                "column": prov.get("column"),
                "source_text": prov.get("source_text")
            }))

        rel_verbs = [self.index.verbs.get(vid, vid) for vid in ex.get("verb_ids", [])]
        rel_rules = [self.index.rules.get(rid, rid) for rid in ex.get("rule_ids", [])]
        rel_concepts = [self.index.concepts.get(cid, cid) for cid in ex.get("concept_ids", [])]
        rel_vocab = []
        for vcid in ex.get("vocabulary_ids", []):
            if vcid in self.index.vocabulary:
                rel_vocab.append(self.index.vocabulary[vcid])

        slots = []
        for s in ex.get("pattern_slots", []):
            stype = s.get("slot_type")
            if stype not in ["person", "thing", "noun", "verb_infinitive", "clause", "adjective", "adverb", "preposition", "other"]:
                stype = "other"
            slots.append({
                "name": s.get("name") or "slot",
                "display": s.get("display") or "",
                "slot_type": stype,
                "required": bool(s.get("required"))
            })

        if cform not in self.expressions:
            self.dedup.record_master("expressions")
            self.expressions[cform] = {
                "canonical_form": cform,
                "display_form": ex.get("display_form") or cform,
                "english": copy.deepcopy(ex.get("english") or []),
                "expression_type": canonical_type,
                "productive": ex.get("productive"),
                "pattern": ex.get("pattern"),
                "pattern_slots": slots,
                "related_verbs": sorted(list(set(rel_verbs))),
                "related_vocabulary": rel_vocab,
                "related_grammar_rules": sorted(list(set(rel_rules))),
                "related_concepts": sorted(list(set(rel_concepts))),
                "prepositions": sorted(list(set(ex.get("prepositions") or []))),
                "complement_structure": comp_struct,
                "restrictions": sorted(list(set(ex.get("restrictions") or []))),
                "transformations": sorted(list(set(ex.get("transformations") or []))),
                "aliases": sorted(list(set(ex.get("aliases") or []))),
                "search_terms": sorted(list(set(ex.get("search_terms") or []))),
                "collocation_strength": ex.get("collocation_strength") if ex.get("collocation_strength") in ["strong", "common", "possible", "unknown", None] else None,
                "source_classifications": sorted(list(set(src_classes))),
                "tags": [],
                "study": merge_study_metadata(ex.get("study"), None, self.conflicts, "expression", cform, ex_sources, None),
                "chapters": [ch_num] if ch_num is not None else [],
                "sources": ex_sources,
                "notes": ex.get("notes") if isinstance(ex.get("notes"), str) else None
            }
        else:
            target = self.expressions[cform]
            self.dedup.add_merge_example("expressions", cform, {"merged_from": fname})
            target["english"] = sorted(list(set(target["english"] + (ex.get("english") or []))))
            target["related_verbs"] = sorted(list(set(target["related_verbs"] + rel_verbs)))
            target["related_grammar_rules"] = sorted(list(set(target["related_grammar_rules"] + rel_rules)))
            target["related_concepts"] = sorted(list(set(target["related_concepts"] + rel_concepts)))
            target["prepositions"] = sorted(list(set(target["prepositions"] + (ex.get("prepositions") or []))))
            target["restrictions"] = sorted(list(set(target["restrictions"] + (ex.get("restrictions") or []))))
            target["transformations"] = sorted(list(set(target["transformations"] + (ex.get("transformations") or []))))
            target["aliases"] = sorted(list(set(target["aliases"] + (ex.get("aliases") or []))))
            target["search_terms"] = sorted(list(set(target["search_terms"] + (ex.get("search_terms") or []))))
            target["source_classifications"] = sorted(list(set(target["source_classifications"] + src_classes)))
            target["sources"] = merge_source_evidence_lists(target["sources"], ex_sources)
            if ch_num is not None and ch_num not in target["chapters"]:
                target["chapters"].append(ch_num)
                target["chapters"].sort()

            seen_voc = {(v["canonical_form"], v["part_of_speech"]) for v in target["related_vocabulary"]}
            for v in rel_vocab:
                k = (v["canonical_form"], v["part_of_speech"])
                if k not in seen_voc:
                    seen_voc.add(k)
                    target["related_vocabulary"].append(v)

            target["study"] = merge_study_metadata(target["study"], ex.get("study"), self.conflicts, "expression", cform, target["sources"], ex_sources)

        if ch_num is not None and cform not in self.chapters[ch_num]["expressions"]:
            self.chapters[ch_num]["expressions"].append(cform)
            self.chapters[ch_num]["expressions"].sort()

    # ------------------------------------------------------------------
    # Vocabulary Migration & Merging
    # ------------------------------------------------------------------

    def migrate_vocabulary(self, voc: Dict[str, Any], fname: str, ch_num: Optional[int]):
        cform = voc.get("canonical_form") or voc.get("display_form") or voc.get("canonical_french")
        if not cform:
            return
        cform = normalize_text_identity(cform)

        raw_pos = voc.get("part_of_speech") or voc.get("entry_type")
        valid_pos = {
            "noun", "verb", "adjective", "adverb", "pronoun", "determiner",
            "preposition", "conjunction", "interjection", "number", "other", "unknown", None
        }
        src_classes = []
        if raw_pos in valid_pos:
            canonical_pos = raw_pos
        else:
            src_classes.append(f"part_of_speech:{raw_pos}")
            canonical_pos = "other"

        raw_gender = voc.get("gender")
        valid_genders = {"masculine", "feminine", "common", "variable", "none", "unknown", None}
        if raw_gender in valid_genders:
            canonical_gender = raw_gender
        elif raw_gender == "invariable":
            src_classes.append("gender:invariable")
            canonical_gender = None
        else:
            if raw_gender:
                src_classes.append(f"gender:{raw_gender}")
            canonical_gender = "unknown"

        voc_key = (cform, canonical_pos)

        voc_sources = []
        for att in voc.get("attestations", []):
            voc_sources.append(clean_source_evidence({
                "source_type": "chapter",
                "source_name": fname,
                "chapter_number": ch_num,
                "section_title": att.get("section_title"),
                "page_printed": att.get("page_printed"),
                "page_pdf": att.get("page_pdf"),
                "context_type": att.get("context_type"),
                "source_text": att.get("source_text")
            }))
        for prov in voc.get("provenance", []):
            voc_sources.append(clean_source_evidence({
                "source_type": "glossary",
                "source_name": fname,
                "page_printed": prov.get("page_printed"),
                "page_pdf": prov.get("page_pdf"),
                "column": prov.get("column"),
                "source_text": prov.get("source_text")
            }))

        variants = []
        for var in voc.get("variants", []):
            if isinstance(var, str):
                vform = var.strip()
                if vform:
                    variants.append({
                        "form": vform,
                        "variant_type": "other",
                        "note": None
                    })
            elif isinstance(var, dict):
                vtype = var.get("variant_type")
                if vtype not in ["masculine", "feminine", "masculine_before_vowel", "plural", "alternate_spelling", "inflected_form", "other"]:
                    vtype = "other"
                vform = (var.get("form") or "").strip()
                if vform:
                    variants.append({
                        "form": vform,
                        "variant_type": vtype,
                        "note": var.get("note")
                    })

        voc_articles = classify_articles(voc.get("article"))

        senses = []
        raw_senses = voc.get("senses", [])
        if raw_senses:
            for s in raw_senses:
                eng = s.get("english") or s.get("text")
                if eng:
                    s_art = classify_articles(s.get("article")) if s.get("article") else copy.deepcopy(voc_articles)
                    senses.append({
                        "english": eng,
                        "note": s.get("note"),
                        "gender": s.get("gender") or canonical_gender,
                        "articles": s_art,
                        "plural": s.get("plural") or voc.get("plural")
                    })
        elif voc.get("english"):
            for eng in voc["english"]:
                senses.append({
                    "english": eng,
                    "note": None,
                    "gender": canonical_gender,
                    "articles": copy.deepcopy(voc_articles),
                    "plural": voc.get("plural")
                })

        wfamily = []
        for wfid in voc.get("word_family_ids", []):
            if wfid in self.index.vocabulary:
                wfamily.append(self.index.vocabulary[wfid])

        rel_verbs = [self.index.verbs.get(vid, vid) for vid in voc.get("verb_ids", [])]
        rel_exprs = [self.index.expressions.get(eid, eid) for eid in voc.get("expression_ids", [])]
        rel_concepts = [self.index.concepts.get(cid, cid) for cid in voc.get("concept_ids", [])]

        if voc_key not in self.vocabulary:
            self.dedup.record_master("vocabulary")
            self.vocabulary[voc_key] = {
                "canonical_form": cform,
                "display_form": voc.get("display_form") or cform,
                "english": copy.deepcopy(voc.get("english") or []),
                "part_of_speech": canonical_pos,
                "gender": canonical_gender,
                "articles": voc_articles,
                "plural": voc.get("plural"),
                "variants": variants,
                "senses": senses,
                "aliases": sorted(list(set(voc.get("aliases") or []))),
                "search_terms": sorted(list(set(voc.get("search_terms") or []))),
                "word_family": wfamily,
                "related_expressions": sorted(list(set(rel_exprs))),
                "related_verbs": sorted(list(set(rel_verbs))),
                "related_concepts": sorted(list(set(rel_concepts))),
                "source_classifications": sorted(list(set(src_classes))),
                "tags": [],
                "study": merge_study_metadata(voc.get("study"), None, self.conflicts, "vocabulary", cform, voc_sources, None),
                "chapters": [ch_num] if ch_num is not None else [],
                "sources": voc_sources,
                "notes": voc.get("notes") if isinstance(voc.get("notes"), str) else None
            }
        else:
            target = self.vocabulary[voc_key]
            self.dedup.add_merge_example("vocabulary", f"{cform}/{canonical_pos}", {"merged_from": fname})
            target["english"] = sorted(list(set(target["english"] + (voc.get("english") or []))))
            target["aliases"] = sorted(list(set(target["aliases"] + (voc.get("aliases") or []))))
            target["search_terms"] = sorted(list(set(target["search_terms"] + (voc.get("search_terms") or []))))
            target["related_verbs"] = sorted(list(set(target["related_verbs"] + rel_verbs)))
            target["related_expressions"] = sorted(list(set(target["related_expressions"] + rel_exprs)))
            target["related_concepts"] = sorted(list(set(target["related_concepts"] + rel_concepts)))
            target["source_classifications"] = sorted(list(set(target["source_classifications"] + src_classes)))
            target["sources"] = merge_source_evidence_lists(target["sources"], voc_sources)
            if ch_num is not None and ch_num not in target["chapters"]:
                target["chapters"].append(ch_num)
                target["chapters"].sort()

            seen_variants = {(var["form"], var["variant_type"]) for var in target["variants"]}
            for var in variants:
                k = (var["form"], var["variant_type"])
                if k not in seen_variants:
                    seen_variants.add(k)
                    target["variants"].append(var)

            seen_senses = {sense_subordinate_key(s) for s in target["senses"]}
            for s in senses:
                k = sense_subordinate_key(s)
                if k not in seen_senses:
                    seen_senses.add(k)
                    target["senses"].append(s)

            target["articles"] = merge_articles(target["articles"], voc_articles)

            target["gender"] = merge_singleton_value(
                target["gender"], canonical_gender, "vocabulary", cform, "gender",
                self.conflicts, target["sources"], voc_sources, legacy_path="vocabulary.gender"
            )
            target["plural"] = merge_singleton_value(
                target["plural"], voc.get("plural"), "vocabulary", cform, "plural",
                self.conflicts, target["sources"], voc_sources, legacy_path="vocabulary.plural"
            )

            target["study"] = merge_study_metadata(target["study"], voc.get("study"), self.conflicts, "vocabulary", cform, target["sources"], voc_sources)

        voc_ref = {"canonical_form": cform, "part_of_speech": canonical_pos}
        if ch_num is not None:
            seen_c_voc = {(v["canonical_form"], v["part_of_speech"]) for v in self.chapters[ch_num]["vocabulary"]}
            if (cform, canonical_pos) not in seen_c_voc:
                self.chapters[ch_num]["vocabulary"].append(voc_ref)

    # ------------------------------------------------------------------
    # Grammar Rules & Concepts
    # ------------------------------------------------------------------

    def migrate_grammar_rule(self, r: Dict[str, Any], fname: str, ch_num: Optional[int]):
        rname = r.get("rule_name")
        if not rname:
            return
        rname = normalize_text_identity(rname)

        r_sources = []
        for att in r.get("attestations", []):
            r_sources.append(clean_source_evidence({
                "source_type": "chapter",
                "source_name": fname,
                "chapter_number": ch_num,
                "section_title": att.get("section_title"),
                "page_printed": att.get("page_printed"),
                "page_pdf": att.get("page_pdf"),
                "context_type": att.get("context_type"),
                "source_text": att.get("source_text")
            }))

        rel_tenses = [canonical_tense_name(tid) for tid in r.get("tense_ids", [])]
        rel_concepts = [self.index.concepts.get(cid, cid) for cid in r.get("concept_ids", [])]
        rel_exprs = [self.index.expressions.get(eid, eid) for eid in r.get("expression_ids", [])]
        rel_verbs = [self.index.verbs.get(vid, vid) for vid in r.get("verb_ids", [])]

        def to_str_or_none(val: Any) -> Optional[str]:
            if isinstance(val, list):
                s = " ; ".join(str(x) for x in val if x).strip()
                return s or None
            elif isinstance(val, str):
                s = val.strip()
                return s or None
            return None

        wo_val = to_str_or_none(r.get("word_order"))
        neg_val = to_str_or_none(r.get("negative_form"))
        int_val = to_str_or_none(r.get("interrogative_form"))
        aff_val = to_str_or_none(r.get("affirmative_form"))

        if rname not in self.grammar_rules:
            self.dedup.record_master("grammar_rules")
            self.grammar_rules[rname] = {
                "rule_name": rname,
                "summary": r.get("summary") or rname,
                "explanation": r.get("explanation"),
                "formation": r.get("formation"),
                "usage": copy.deepcopy(r.get("usage") or []),
                "restrictions": copy.deepcopy(r.get("restrictions") or []),
                "conditions": copy.deepcopy(r.get("conditions") or []),
                "signal_words": copy.deepcopy(r.get("signal_words") or []),
                "exceptions": copy.deepcopy(r.get("exceptions") or []),
                "agreement_rules": copy.deepcopy(r.get("agreement_rules") or []),
                "word_order": wo_val,
                "negative_form": neg_val,
                "interrogative_form": int_val,
                "affirmative_form": aff_val,
                "transformations": copy.deepcopy(r.get("transformations") or []),
                "contrast_with": copy.deepcopy(r.get("contrast_with") or []),
                "common_traps": copy.deepcopy(r.get("common_traps") or []),
                "related_tenses": sorted(list(set(rel_tenses))),
                "related_concepts": sorted(list(set(rel_concepts))),
                "related_expressions": sorted(list(set(rel_exprs))),
                "related_verbs": sorted(list(set(rel_verbs))),
                "tags": [],
                "study": merge_study_metadata(r.get("study"), None, self.conflicts, "grammar_rule", rname, r_sources, None),
                "chapters": [ch_num] if ch_num is not None else [],
                "sources": r_sources,
                "notes": r.get("notes") if isinstance(r.get("notes"), str) else None
            }
        else:
            target = self.grammar_rules[rname]
            self.dedup.add_merge_example("grammar_rules", rname, {"merged_from": fname})
            target["related_tenses"] = sorted(list(set(target["related_tenses"] + rel_tenses)))
            target["related_concepts"] = sorted(list(set(target["related_concepts"] + rel_concepts)))
            target["related_expressions"] = sorted(list(set(target["related_expressions"] + rel_exprs)))
            target["related_verbs"] = sorted(list(set(target["related_verbs"] + rel_verbs)))
            target["usage"] = sorted(list(set(target["usage"] + (r.get("usage") or []))))
            target["restrictions"] = sorted(list(set(target["restrictions"] + (r.get("restrictions") or []))))
            target["conditions"] = sorted(list(set(target["conditions"] + (r.get("conditions") or []))))
            target["signal_words"] = sorted(list(set(target["signal_words"] + (r.get("signal_words") or []))))
            target["exceptions"] = sorted(list(set(target["exceptions"] + (r.get("exceptions") or []))))
            target["agreement_rules"] = sorted(list(set(target["agreement_rules"] + (r.get("agreement_rules") or []))))
            if not target["word_order"] and wo_val:
                target["word_order"] = wo_val
            if not target["negative_form"] and neg_val:
                target["negative_form"] = neg_val
            if not target["interrogative_form"] and int_val:
                target["interrogative_form"] = int_val
            if not target["affirmative_form"] and aff_val:
                target["affirmative_form"] = aff_val
            target["transformations"] = sorted(list(set(target["transformations"] + (r.get("transformations") or []))))
            target["contrast_with"] = sorted(list(set(target["contrast_with"] + (r.get("contrast_with") or []))))
            target["common_traps"] = sorted(list(set(target["common_traps"] + (r.get("common_traps") or []))))
            target["sources"] = merge_source_evidence_lists(target["sources"], r_sources)
            if ch_num is not None and ch_num not in target["chapters"]:
                target["chapters"].append(ch_num)
                target["chapters"].sort()
            target["study"] = merge_study_metadata(target["study"], r.get("study"), self.conflicts, "grammar_rule", rname, target["sources"], r_sources)

        if ch_num is not None and rname not in self.chapters[ch_num]["grammar_rules"]:
            self.chapters[ch_num]["grammar_rules"].append(rname)
            self.chapters[ch_num]["grammar_rules"].sort()

    def migrate_concept(self, c: Dict[str, Any], fname: str, ch_num: Optional[int]):
        cname = c.get("name")
        if not cname:
            return
        cname = normalize_text_identity(cname)

        c_sources = []
        for att in c.get("attestations", []):
            c_sources.append(clean_source_evidence({
                "source_type": "chapter",
                "source_name": fname,
                "chapter_number": ch_num,
                "section_title": att.get("section_title"),
                "page_printed": att.get("page_printed"),
                "page_pdf": att.get("page_pdf"),
                "context_type": att.get("context_type"),
                "source_text": att.get("source_text")
            }))

        rel_rules = [self.index.rules.get(rid, rid) for rid in c.get("rule_ids", [])]
        rel_verbs = [self.index.verbs.get(vid, vid) for vid in c.get("verb_ids", [])]
        rel_exprs = [self.index.expressions.get(eid, eid) for eid in c.get("expression_ids", [])]
        rel_tenses = [canonical_tense_name(tid) for tid in c.get("tense_ids", [])]
        rel_vocab = []
        for vcid in c.get("vocabulary_ids", []):
            if vcid in self.index.vocabulary:
                rel_vocab.append(self.index.vocabulary[vcid])

        if cname not in self.concepts:
            self.dedup.record_master("concepts")
            self.concepts[cname] = {
                "name": cname,
                "description": c.get("description") or cname,
                "aliases": sorted(list(set(c.get("aliases") or []))),
                "related_grammar_rules": sorted(list(set(rel_rules))),
                "related_verbs": sorted(list(set(rel_verbs))),
                "related_expressions": sorted(list(set(rel_exprs))),
                "related_vocabulary": rel_vocab,
                "related_tenses": sorted(list(set(rel_tenses))),
                "tags": [],
                "study": merge_study_metadata(c.get("study"), None, self.conflicts, "concept", cname, c_sources, None),
                "chapters": [ch_num] if ch_num is not None else [],
                "sources": c_sources,
                "notes": c.get("notes") if isinstance(c.get("notes"), str) else None
            }
        else:
            target = self.concepts[cname]
            self.dedup.add_merge_example("concepts", cname, {"merged_from": fname})
            target["aliases"] = sorted(list(set(target["aliases"] + (c.get("aliases") or []))))
            target["related_grammar_rules"] = sorted(list(set(target["related_grammar_rules"] + rel_rules)))
            target["related_verbs"] = sorted(list(set(target["related_verbs"] + rel_verbs)))
            target["related_expressions"] = sorted(list(set(target["related_expressions"] + rel_exprs)))
            target["related_tenses"] = sorted(list(set(target["related_tenses"] + rel_tenses)))
            target["sources"] = merge_source_evidence_lists(target["sources"], c_sources)
            if ch_num is not None and ch_num not in target["chapters"]:
                target["chapters"].append(ch_num)
                target["chapters"].sort()
            seen_voc = {(v["canonical_form"], v["part_of_speech"]) for v in target["related_vocabulary"]}
            for v in rel_vocab:
                k = (v["canonical_form"], v["part_of_speech"])
                if k not in seen_voc:
                    seen_voc.add(k)
                    target["related_vocabulary"].append(v)
            target["study"] = merge_study_metadata(target["study"], c.get("study"), self.conflicts, "concept", cname, target["sources"], c_sources)

        if ch_num is not None and cname not in self.chapters[ch_num]["concepts"]:
            self.chapters[ch_num]["concepts"].append(cname)
            self.chapters[ch_num]["concepts"].sort()

    # ------------------------------------------------------------------
    # Examples Migration & Merging
    # ------------------------------------------------------------------

    def migrate_example(self, exm: Dict[str, Any], fname: str, ch_num: Optional[int]):
        french_text = exm.get("french")
        if not french_text:
            return
        sentence_key = normalize_sentence(french_text)

        exm_sources = []
        for att in exm.get("attestations", []):
            exm_sources.append(clean_source_evidence({
                "source_type": "chapter",
                "source_name": fname,
                "chapter_number": ch_num,
                "section_title": att.get("section_title"),
                "page_printed": att.get("page_printed"),
                "page_pdf": att.get("page_pdf"),
                "context_type": att.get("context_type") or "example",
                "source_text": att.get("source_text")
            }))

        rel_verbs = [self.index.verbs.get(vid, vid) for vid in exm.get("verb_ids", [])]
        rel_exprs = [self.index.expressions.get(eid, eid) for eid in exm.get("expression_ids", [])]
        rel_rules = [self.index.rules.get(rid, rid) for rid in exm.get("rule_ids", [])]
        rel_tenses = [canonical_tense_name(tid) for tid in exm.get("tense_ids", [])]
        rel_concepts = [self.index.concepts.get(cid, cid) for cid in exm.get("concept_ids", [])]
        rel_vocab = []
        for vcid in exm.get("vocabulary_ids", []):
            if vcid in self.index.vocabulary:
                rel_vocab.append(self.index.vocabulary[vcid])

        focus_spans = []
        for fs in exm.get("focus_spans", []):
            ftype = fs.get("focus_type")
            if ftype not in ["verb", "expression", "vocabulary", "grammar_rule", "tense", "concept", "other"]:
                ftype = "other"
            eid = fs.get("entity_id")
            ename = None
            if eid:
                ename = (self.index.verbs.get(eid) or self.index.expressions.get(eid) or
                         self.index.rules.get(eid) or self.index.concepts.get(eid))
            focus_spans.append({
                "text": fs.get("text") or "",
                "focus_type": ftype,
                "entity_name": ename
            })

        if sentence_key not in self.examples:
            self.dedup.record_master("examples")
            self.examples[sentence_key] = {
                "french": normalize_text_identity(french_text),
                "english": exm.get("english"),
                "related_verbs": sorted(list(set(rel_verbs))),
                "related_expressions": sorted(list(set(rel_exprs))),
                "related_vocabulary": rel_vocab,
                "related_grammar_rules": sorted(list(set(rel_rules))),
                "related_tenses": sorted(list(set(rel_tenses))),
                "related_concepts": sorted(list(set(rel_concepts))),
                "focus_spans": focus_spans,
                "tags": [],
                "chapters": [ch_num] if ch_num is not None else [],
                "notes": exm.get("notes") if isinstance(exm.get("notes"), str) else None,
                "sources": exm_sources
            }
        else:
            target = self.examples[sentence_key]
            self.dedup.add_merge_example("examples", sentence_key[:30], {"merged_from": fname})
            target["related_verbs"] = sorted(list(set(target["related_verbs"] + rel_verbs)))
            target["related_expressions"] = sorted(list(set(target["related_expressions"] + rel_exprs)))
            target["related_grammar_rules"] = sorted(list(set(target["related_grammar_rules"] + rel_rules)))
            target["related_tenses"] = sorted(list(set(target["related_tenses"] + rel_tenses)))
            target["related_concepts"] = sorted(list(set(target["related_concepts"] + rel_concepts)))
            target["sources"] = merge_source_evidence_lists(target["sources"], exm_sources)
            if ch_num is not None and ch_num not in target["chapters"]:
                target["chapters"].append(ch_num)
                target["chapters"].sort()

            seen_voc = {(v["canonical_form"], v["part_of_speech"]) for v in target["related_vocabulary"]}
            for v in rel_vocab:
                k = (v["canonical_form"], v["part_of_speech"])
                if k not in seen_voc:
                    seen_voc.add(k)
                    target["related_vocabulary"].append(v)

            seen_fs = {(f["text"], f["focus_type"], f["entity_name"]) for f in target["focus_spans"]}
            for f in focus_spans:
                k = (f["text"], f["focus_type"], f["entity_name"])
                if k not in seen_fs:
                    seen_fs.add(k)
                    target["focus_spans"].append(f)

            if not target["english"] and exm.get("english"):
                target["english"] = exm["english"]
            elif target["english"] and exm.get("english") and target["english"] != exm["english"]:
                alt_note = f"Alternative translation: '{exm['english']}'"
                if not target["notes"]:
                    target["notes"] = alt_note
                elif alt_note not in target["notes"]:
                    target["notes"] += f" ; {alt_note}"

    # ------------------------------------------------------------------
    # Exercises & Questions Migration
    # ------------------------------------------------------------------

    def migrate_exercise(self, exe: Dict[str, Any], fname: str, ch_num: Optional[int]):
        raw_code = exe.get("exercise_code") or exe.get("id") or "1"
        code = normalize_text_identity(raw_code).replace("·", "-")
        ex_key = (ch_num, code)

        ex_sources = []
        for att in exe.get("attestations", []):
            ex_sources.append(clean_source_evidence({
                "source_type": "chapter",
                "source_name": fname,
                "chapter_number": ch_num,
                "section_title": att.get("section_title"),
                "page_printed": att.get("page_printed"),
                "page_pdf": att.get("page_pdf"),
                "context_type": "exercise",
                "exercise_code": code,
                "source_text": att.get("source_text")
            }))

        questions = []
        for q in exe.get("questions", []):
            q_num = q.get("number") or 1
            q_sources = []
            for att in q.get("attestations", []):
                q_sources.append(clean_source_evidence({
                    "source_type": "chapter",
                    "source_name": fname,
                    "chapter_number": ch_num,
                    "section_title": att.get("section_title"),
                    "page_printed": att.get("page_printed"),
                    "page_pdf": att.get("page_pdf"),
                    "context_type": "exercise",
                    "exercise_code": code,
                    "question_number": q_num,
                    "source_text": att.get("source_text")
                }))

            q_rel_verbs = [self.index.verbs.get(vid, vid) for vid in q.get("verb_ids", [])]
            q_rel_exprs = [self.index.expressions.get(eid, eid) for eid in q.get("expression_ids", [])]
            q_rel_rules = [self.index.rules.get(rid, rid) for rid in q.get("rule_ids", [])]
            q_rel_tenses = [canonical_tense_name(tid) for tid in q.get("tense_ids", [])]
            q_rel_concepts = [self.index.concepts.get(cid, cid) for cid in q.get("concept_ids", [])]
            q_rel_vocab = []
            for vcid in q.get("vocabulary_ids", []):
                if vcid in self.index.vocabulary:
                    q_rel_vocab.append(self.index.vocabulary[vcid])

            answers = []
            if q.get("answer"):
                answers.append({
                    "text": q["answer"],
                    "answer_type": "text",
                    "is_complete": True,
                    "continues_across_pages": False,
                    "notes": None,
                    "sources": q_sources
                })

            questions.append({
                "number": q_num,
                "prompt": q.get("prompt"),
                "answers": answers,
                "open_ended": q.get("open_ended"),
                "related_verbs": sorted(list(set(q_rel_verbs))),
                "related_expressions": sorted(list(set(q_rel_exprs))),
                "related_vocabulary": q_rel_vocab,
                "related_grammar_rules": sorted(list(set(q_rel_rules))),
                "related_tenses": sorted(list(set(q_rel_tenses))),
                "related_concepts": sorted(list(set(q_rel_concepts))),
                "notes": None,
                "sources": q_sources
            })

        rel_verbs = [self.index.verbs.get(vid, vid) for vid in exe.get("verb_ids", [])]
        rel_exprs = [self.index.expressions.get(eid, eid) for eid in exe.get("expression_ids", [])]
        rel_rules = [self.index.rules.get(rid, rid) for rid in exe.get("rule_ids", [])]
        rel_tenses = [canonical_tense_name(tid) for tid in exe.get("tense_ids", [])]
        rel_concepts = [self.index.concepts.get(cid, cid) for cid in exe.get("concept_ids", [])]
        rel_vocab = []
        for vcid in exe.get("vocabulary_ids", []):
            if vcid in self.index.vocabulary:
                rel_vocab.append(self.index.vocabulary[vcid])

        if ex_key not in self.exercises:
            self.dedup.record_master("exercises")
            self.exercises[ex_key] = {
                "chapter_number": ch_num,
                "exercise_code": code,
                "title": exe.get("title"),
                "exercise_type": exe.get("exercise_type"),
                "instructions": exe.get("instructions"),
                "section_title": exe.get("section_title"),
                "pages": {
                    "printed_start": exe.get("page_printed"),
                    "printed_end": exe.get("page_printed"),
                    "pdf_start": exe.get("page_pdf"),
                    "pdf_end": exe.get("page_pdf")
                },
                "questions": questions,
                "related_verbs": sorted(list(set(rel_verbs))),
                "related_expressions": sorted(list(set(rel_exprs))),
                "related_vocabulary": rel_vocab,
                "related_grammar_rules": sorted(list(set(rel_rules))),
                "related_tenses": sorted(list(set(rel_tenses))),
                "related_concepts": sorted(list(set(rel_concepts))),
                "notes": exe.get("notes") if isinstance(exe.get("notes"), str) else None,
                "sources": ex_sources
            }
        else:
            target = self.exercises[ex_key]
            target["sources"] = merge_source_evidence_lists(target["sources"], ex_sources)

    # ------------------------------------------------------------------
    # Exceptions & Traps Migration
    # ------------------------------------------------------------------

    def migrate_exception_trap(self, trap: Dict[str, Any], fname: str, ch_num: Optional[int]):
        title = trap.get("title")
        cat = trap.get("category")
        if not title or not cat:
            return
        title = normalize_text_identity(title)
        valid_cats = {"exception", "contrast", "restriction", "agreement", "spelling", "word_order", "usage", "confusion", "other"}
        if cat not in valid_cats:
            cat = "other"
        trap_key = (title, cat)

        t_sources = []
        for att in trap.get("attestations", []):
            t_sources.append(clean_source_evidence({
                "source_type": "chapter",
                "source_name": fname,
                "chapter_number": ch_num,
                "section_title": att.get("section_title"),
                "page_printed": att.get("page_printed"),
                "page_pdf": att.get("page_pdf"),
                "context_type": att.get("context_type") or "warning",
                "source_text": att.get("source_text")
            }))

        rel_rules = [self.index.rules.get(rid, rid) for rid in trap.get("rule_ids", [])]
        rel_verbs = [self.index.verbs.get(vid, vid) for vid in trap.get("verb_ids", [])]
        rel_exprs = [self.index.expressions.get(eid, eid) for eid in trap.get("expression_ids", [])]
        rel_exm = [self.index.examples.get(eid, eid) for eid in trap.get("example_ids", [])]

        if trap_key not in self.exceptions_and_traps:
            self.dedup.record_master("exceptions_and_traps")
            self.exceptions_and_traps[trap_key] = {
                "title": title,
                "category": cat,
                "description": trap.get("description") or title,
                "correct_form": trap.get("correct_form"),
                "incorrect_form": trap.get("incorrect_form"),
                "related_grammar_rules": sorted(list(set(rel_rules))),
                "related_verbs": sorted(list(set(rel_verbs))),
                "related_expressions": sorted(list(set(rel_exprs))),
                "related_examples": sorted(list(set(rel_exm))),
                "tags": [],
                "study": merge_study_metadata(trap.get("study"), None, self.conflicts, "exception_trap", title),
                "chapters": [ch_num] if ch_num is not None else [],
                "sources": t_sources,
                "notes": trap.get("notes") if isinstance(trap.get("notes"), str) else None
            }
        else:
            target = self.exceptions_and_traps[trap_key]
            self.dedup.add_merge_example("exceptions_and_traps", title, {"merged_from": fname})
            target["related_grammar_rules"] = sorted(list(set(target["related_grammar_rules"] + rel_rules)))
            target["related_verbs"] = sorted(list(set(target["related_verbs"] + rel_verbs)))
            target["related_expressions"] = sorted(list(set(target["related_expressions"] + rel_exprs)))
            target["related_examples"] = sorted(list(set(target["related_examples"] + rel_exm)))
            target["sources"] = merge_source_evidence_lists(target["sources"], t_sources)
            if ch_num is not None and ch_num not in target["chapters"]:
                target["chapters"].append(ch_num)
                target["chapters"].sort()
            target["study"] = merge_study_metadata(target["study"], trap.get("study"), self.conflicts, "exception_trap", title)

    # ------------------------------------------------------------------
    # Verb Table File Migration
    # ------------------------------------------------------------------

    def migrate_verb_table_file(self, fname: str, doc: Dict[str, Any]):
        self.coverage.record("MOVED_TO_PROVENANCE", "verb_table.quality_summary")
        qsum = doc.get("quality_summary") or {}
        tables_meta = []
        for t in doc.get("tables", []):
            self.coverage.record("MOVED_TO_PROVENANCE", "verb_table.tables")
            ttype = t.get("table_type")
            if ttype not in ["principal_parts", "present_indicative", "full_conjugation", "irregular_forms", "mixed", "other", None]:
                ttype = "other"
            tables_meta.append({
                "title": t.get("title") or "Table",
                "table_type": ttype,
                "column_order": t.get("column_order") or [],
                "pages": {
                    "printed_start": t.get("page_printed_start"),
                    "printed_end": t.get("page_printed_end"),
                    "pdf_start": t.get("page_pdf_start"),
                    "pdf_end": t.get("page_pdf_end")
                },
                "notes": t.get("notes")
            })

        self.source_quality.append({
            "schema_version": doc.get("schema_version"),
            "extraction_mode": doc.get("extraction_mode"),
            "source_name": fname,
            "source_type": "verb_table",
            "direction": None,
            "source_pages": doc.get("source_pages"),
            "exercise_codes_seen": None,
            "exercise_codes_emitted": None,
            "answer_identities_seen": None,
            "answers_emitted": None,
            "uncertain_answers": None,
            "multi_page_answers": None,
            "tables_seen": qsum.get("tables_seen"),
            "rows_seen": qsum.get("rows_seen"),
            "rows_emitted": qsum.get("rows_emitted"),
            "entries_emitted": None,
            "uncertain_rows": qsum.get("uncertain_rows"),
            "header_footer_rows_removed": qsum.get("header_footer_rows_removed"),
            "cross_column_fragments_rejected": None,
            "duplicate_rows_collapsed": qsum.get("duplicate_rows_collapsed"),
            "duplicate_answer_identities": None,
            "notes": qsum.get("notes"),
            "tables": tables_meta
        })

        for r in doc.get("rows", []):
            self.coverage.record("MERGED", "verb_table.rows[]")
            raw_inf = r.get("infinitive") or r.get("display_form")
            if not raw_inf:
                continue

            conj_list = []
            pres_ind = r.get("present_indicative")
            if pres_ind:
                conj_list.append({
                    "tense_name": "Présent",
                    "mood": "indicative",
                    "forms": pres_ind,
                    "provenance": r.get("provenance", [])
                })

            for ot in r.get("other_tenses", []):
                conj_list.append({
                    "tense_name": ot.get("tense_name"),
                    "mood": ot.get("mood") or "indicative",
                    "forms": ot.get("person_forms", {}),
                    "imperative_forms": ot.get("imperative_forms", {}),
                    "impersonal_form": ot.get("impersonal_form"),
                    "notes": ot.get("notes"),
                    "provenance": r.get("provenance", [])
                })

            v_dict = {
                "infinitive": raw_inf,
                "display_form": r.get("display_form") or raw_inf,
                "english": r.get("english") or [],
                "auxiliary": r.get("auxiliary"),
                "pronominal": r.get("pronominal"),
                "past_participle": r.get("past_participle"),
                "present_participle": r.get("present_participle"),
                "notes": r.get("notes"),
                "provenance": r.get("provenance", [])
            }
            self.migrate_verb(v_dict, fname, ch_num=None, conj_list=conj_list, from_verb_table=True)

    # ------------------------------------------------------------------
    # Glossary File Migration
    # ------------------------------------------------------------------

    def migrate_glossary_file(self, fname: str, doc: Dict[str, Any]):
        self.coverage.record("MOVED_TO_PROVENANCE", "glossary.quality_summary")
        qsum = doc.get("quality_summary") or {}
        self.source_quality.append({
            "schema_version": doc.get("schema_version"),
            "extraction_mode": doc.get("extraction_mode"),
            "source_name": fname,
            "source_type": "glossary",
            "direction": doc.get("direction"),
            "source_pages": doc.get("source_pages"),
            "exercise_codes_seen": None,
            "exercise_codes_emitted": None,
            "answer_identities_seen": None,
            "answers_emitted": None,
            "uncertain_answers": None,
            "multi_page_answers": None,
            "tables_seen": None,
            "rows_seen": qsum.get("rows_seen"),
            "rows_emitted": None,
            "entries_emitted": qsum.get("entries_emitted"),
            "uncertain_rows": qsum.get("uncertain_rows"),
            "header_footer_rows_removed": qsum.get("header_footer_rows_removed"),
            "cross_column_fragments_rejected": qsum.get("cross_column_fragments_rejected"),
            "duplicate_rows_collapsed": qsum.get("duplicate_rows_collapsed"),
            "duplicate_answer_identities": None,
            "notes": qsum.get("notes"),
            "tables": []
        })

        for entry in doc.get("entries", []):
            self.coverage.record("MERGED", "glossary.entries[]")
            etype = entry.get("entry_type")
            v_inf = entry.get("verb_infinitive")

            if etype == "verb" or v_inf:
                v_dict = {
                    "infinitive": v_inf or entry.get("canonical_french"),
                    "display_form": entry.get("canonical_french") or v_inf,
                    "english": entry.get("english") or [],
                    "pronominal": entry.get("pronominal"),
                    "notes": entry.get("notes"),
                    "senses": entry.get("senses") or [],
                    "provenance": entry.get("provenance") or []
                }
                self.migrate_verb(v_dict, fname, ch_num=None, conj_list=[], from_glossary=True)
            elif entry.get("expression_candidate") or etype in ["multiword_expression", "idiom", "collocation", "verb_pattern", "phrase"]:
                self.migrate_expression(entry, fname, ch_num=None)
            else:
                self.migrate_vocabulary(entry, fname, ch_num=None)

    # ------------------------------------------------------------------
    # Answer Key File Migration
    # ------------------------------------------------------------------

    def migrate_answer_key_file(self, fname: str, doc: Dict[str, Any]):
        self.coverage.record("MOVED_TO_PROVENANCE", "answer_key.quality_summary")
        qsum = doc.get("quality_summary") or {}
        self.source_quality.append({
            "schema_version": doc.get("schema_version"),
            "extraction_mode": doc.get("extraction_mode"),
            "source_name": fname,
            "source_type": "answer_key",
            "direction": None,
            "source_pages": doc.get("source_pages"),
            "exercise_codes_seen": qsum.get("exercise_codes_seen"),
            "exercise_codes_emitted": qsum.get("exercise_codes_emitted"),
            "answer_identities_seen": qsum.get("answer_identities_seen"),
            "answers_emitted": qsum.get("answers_emitted"),
            "uncertain_answers": qsum.get("uncertain_answers"),
            "multi_page_answers": qsum.get("multi_page_answers"),
            "tables_seen": None,
            "rows_seen": None,
            "rows_emitted": None,
            "entries_emitted": None,
            "uncertain_rows": None,
            "header_footer_rows_removed": qsum.get("header_footer_rows_removed"),
            "cross_column_fragments_rejected": None,
            "duplicate_rows_collapsed": None,
            "duplicate_answer_identities": qsum.get("duplicate_answer_identities"),
            "notes": qsum.get("notes"),
            "tables": []
        })

        for ak_ex in doc.get("exercises", []):
            ch_num = ak_ex.get("chapter_number")
            raw_code = ak_ex.get("exercise_code") or "1"
            code = normalize_text_identity(raw_code).replace("·", "-")
            ex_key = (ch_num, code)

            if ex_key not in self.exercises:
                self.dedup.record_master("exercises")
                self.exercises[ex_key] = {
                    "chapter_number": ch_num,
                    "exercise_code": code,
                    "title": ak_ex.get("exercise_title"),
                    "exercise_type": None,
                    "instructions": None,
                    "section_title": None,
                    "pages": {
                        "printed_start": ak_ex.get("source_pages", [{}])[0].get("page_printed") if ak_ex.get("source_pages") else None,
                        "printed_end": ak_ex.get("source_pages", [{}])[-1].get("page_printed") if ak_ex.get("source_pages") else None,
                        "pdf_start": ak_ex.get("source_pages", [{}])[0].get("page_pdf") if ak_ex.get("source_pages") else None,
                        "pdf_end": ak_ex.get("source_pages", [{}])[-1].get("page_pdf") if ak_ex.get("source_pages") else None
                    },
                    "questions": [],
                    "related_verbs": [],
                    "related_expressions": [],
                    "related_vocabulary": [],
                    "related_grammar_rules": [],
                    "related_tenses": [],
                    "related_concepts": [],
                    "notes": ak_ex.get("notes"),
                    "sources": []
                }

            target_ex = self.exercises[ex_key]
            q_by_num = {str(q["number"]): q for q in target_ex["questions"]}

            for ans in ak_ex.get("answers", []):
                self.coverage.record("TRANSFORMED", "answer_key.exercises[].answers[]")
                qnum_str = str(ans.get("question_number") or "1")
                ans_text = ans.get("answer") or ""

                ans_sources = []
                for sp in ans.get("source_pages", []):
                    ans_sources.append(clean_source_evidence({
                        "source_type": "answer_key",
                        "source_name": fname,
                        "chapter_number": ch_num,
                        "page_printed": sp.get("page_printed"),
                        "page_pdf": sp.get("page_pdf"),
                        "context_type": "answer_key",
                        "exercise_code": code,
                        "question_number": qnum_str,
                        "source_text": sp.get("source_text")
                    }))

                atype = ans.get("answer_type")
                if atype not in ["text", "sentence", "word", "phrase", "multiple_values", "numeric", "date_or_year", "other", None]:
                    atype = "other"

                ans_option = {
                    "text": ans_text,
                    "answer_type": atype or "word",
                    "is_complete": bool(ans.get("is_complete", True)),
                    "continues_across_pages": bool(ans.get("continues_across_pages", False)),
                    "notes": ans.get("notes"),
                    "sources": ans_sources
                }

                if qnum_str in q_by_num:
                    q_obj = q_by_num[qnum_str]
                    if not any(a["text"] == ans_text for a in q_obj["answers"]):
                        q_obj["answers"].append(ans_option)
                else:
                    new_q = {
                        "number": int(qnum_str) if qnum_str.isdigit() else qnum_str,
                        "prompt": None,
                        "answers": [ans_option],
                        "open_ended": False,
                        "related_verbs": [],
                        "related_expressions": [],
                        "related_vocabulary": [],
                        "related_grammar_rules": [],
                        "related_tenses": [],
                        "related_concepts": [],
                        "notes": None,
                        "sources": ans_sources
                    }
                    target_ex["questions"].append(new_q)
                    q_by_num[qnum_str] = new_q

    # ------------------------------------------------------------------
    # Assembly & Reference Validation
    # ------------------------------------------------------------------

    def assemble_master(self) -> Dict[str, Any]:
        print("Assembling final master.json dictionary...")
        chapters_list = [self.chapters[k] for k in sorted(self.chapters.keys())]
        topics_list = [self.topics[k] for k in sorted(self.topics.keys())]
        concepts_list = [self.concepts[k] for k in sorted(self.concepts.keys())]
        rules_list = [self.grammar_rules[k] for k in sorted(self.grammar_rules.keys())]
        tenses_list = [self.tenses[k] for k in sorted(self.tenses.keys())]
        verbs_list = [self.verbs[k] for k in sorted(self.verbs.keys())]
        expr_list = [self.expressions[k] for k in sorted(self.expressions.keys())]
        vocab_list = [self.vocabulary[k] for k in sorted(self.vocabulary.keys())]
        example_list = [self.examples[k] for k in sorted(self.examples.keys())]
        
        sorted_ex_keys = sorted(self.exercises.keys(), key=lambda x: (x[0] or 0, str(x[1])))
        exercise_list = [self.exercises[k] for k in sorted_ex_keys]

        traps_list = [self.exceptions_and_traps[k] for k in sorted(self.exceptions_and_traps.keys())]

        master = {
            "schema_version": "1.0.0",
            "dataset_type": "french_revision_master",
            "metadata": {
                "dataset_name": "L'Étude Canonical French Revision Master Dataset",
                "book_title": "Practice Makes Perfect: Complete French Grammar",
                "author": "Annie Heminway",
                "language": "fr",
                "source_language": "fr",
                "target_language": "en",
                "notes": "Consolidated canonical dataset deterministically mapped from legacy chapter, glossary, verb table, and answer key extractions."
            },
            "chapters": chapters_list,
            "topics": topics_list,
            "concepts": concepts_list,
            "grammar_rules": rules_list,
            "tenses": tenses_list,
            "verbs": verbs_list,
            "expressions": expr_list,
            "vocabulary": vocab_list,
            "examples": example_list,
            "exercises": exercise_list,
            "exceptions_and_traps": traps_list,
            "unresolved_items": self.unresolved_items,
            "source_quality": self.source_quality
        }
        return master

    def validate_all_references(self):
        verbs_set = set(self.verbs.keys())
        tenses_set = {t["name"] for t in self.tenses.values()}
        rules_set = set(self.grammar_rules.keys())
        exprs_set = set(self.expressions.keys())
        concepts_set = set(self.concepts.keys())
        vocab_set = set(self.vocabulary.keys())

        for r in self.grammar_rules.values():
            for v in r.get("related_verbs", []):
                self.ref_validator.check("grammar_rule", r["rule_name"], "verb", normalize_infinitive(v), verbs_set)
            for t in r.get("related_tenses", []):
                self.ref_validator.check("grammar_rule", r["rule_name"], "tense", t, tenses_set)
            for e in r.get("related_expressions", []):
                self.ref_validator.check("grammar_rule", r["rule_name"], "expression", e, exprs_set)
            for c in r.get("related_concepts", []):
                self.ref_validator.check("grammar_rule", r["rule_name"], "concept", c, concepts_set)

        for ex in self.expressions.values():
            for v in ex.get("related_verbs", []):
                self.ref_validator.check("expression", ex["canonical_form"], "verb", normalize_infinitive(v), verbs_set)
            for r in ex.get("related_grammar_rules", []):
                self.ref_validator.check("expression", ex["canonical_form"], "grammar_rule", r, rules_set)
            for c in ex.get("related_concepts", []):
                self.ref_validator.check("expression", ex["canonical_form"], "concept", c, concepts_set)
            for voc in ex.get("related_vocabulary", []):
                self.ref_validator.check("expression", ex["canonical_form"], "vocabulary",
                                         (voc["canonical_form"], voc["part_of_speech"]), vocab_set)

        for exm in self.examples.values():
            for v in exm.get("related_verbs", []):
                self.ref_validator.check("example", exm["french"][:30], "verb", normalize_infinitive(v), verbs_set)
            for t in exm.get("related_tenses", []):
                self.ref_validator.check("example", exm["french"][:30], "tense", t, tenses_set)
            for e in exm.get("related_expressions", []):
                self.ref_validator.check("example", exm["french"][:30], "expression", e, exprs_set)
            for r in exm.get("related_grammar_rules", []):
                self.ref_validator.check("example", exm["french"][:30], "grammar_rule", r, rules_set)
            for c in exm.get("related_concepts", []):
                self.ref_validator.check("example", exm["french"][:30], "concept", c, concepts_set)


# ----------------------------------------------------------------------
# 6. Main Runner and Reporting
# ----------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Deterministic legacy-to-master JSON consolidation.")
    parser.add_argument("--data-dir", default="json1", help="Path to directory containing source JSONs.")
    parser.add_argument("--schema-dir", default="schema", help="Path to directory containing schemas.")
    parser.add_argument("--out-master", default="master/master.json", help="Path to output master.json.")
    parser.add_argument("--out-migration", default="migration", help="Directory for migration audit reports.")
    args = parser.parse_args()

    os.makedirs(os.path.dirname(args.out_master), exist_ok=True)
    os.makedirs(args.out_migration, exist_ok=True)

    consolidator = MasterConsolidator(data_dir=args.data_dir, schema_dir=args.schema_dir)
    master_data = consolidator.run()

    # 1. Write master/master.json
    print(f"Writing {args.out_master}...")
    with open(args.out_master, "w", encoding="utf-8") as f:
        json.dump(master_data, f, indent=2, ensure_ascii=False)
    print(f"master.json written successfully ({os.path.getsize(args.out_master):,} bytes).")

    # 2. Validate master.json against schema/MASTER_SCHEMA.json
    master_schema_path = os.path.join(args.schema_dir, "MASTER_SCHEMA.json")
    print(f"Validating {args.out_master} against {master_schema_path}...")
    with open(master_schema_path, "r", encoding="utf-8") as f:
        master_schema = json.load(f)

    validator = Draft202012Validator(master_schema)
    validation_errors = list(validator.iter_errors(master_data))
    is_valid = len(validation_errors) == 0

    validation_report = {
        "valid": is_valid,
        "error_count": len(validation_errors),
        "errors": [
            {
                "path": "/" + "/".join(str(p) for p in e.path),
                "message": e.message,
                "validator": e.validator
            }
            for e in validation_errors
        ],
        "entity_counts": {
            "chapters": len(master_data["chapters"]),
            "topics": len(master_data["topics"]),
            "concepts": len(master_data["concepts"]),
            "grammar_rules": len(master_data["grammar_rules"]),
            "tenses": len(master_data["tenses"]),
            "verbs": len(master_data["verbs"]),
            "expressions": len(master_data["expressions"]),
            "vocabulary": len(master_data["vocabulary"]),
            "examples": len(master_data["examples"]),
            "exercises": len(master_data["exercises"]),
            "exceptions_and_traps": len(master_data["exceptions_and_traps"]),
            "unresolved_items": len(master_data["unresolved_items"]),
            "source_quality": len(master_data["source_quality"])
        }
    }

    # 3. Write migration reports
    val_report_path = os.path.join(args.out_migration, "MASTER_VALIDATION_REPORT.json")
    with open(val_report_path, "w", encoding="utf-8") as f:
        json.dump(validation_report, f, indent=2, ensure_ascii=False)

    conflicts_path = os.path.join(args.out_migration, "MIGRATION_CONFLICTS.json")
    with open(conflicts_path, "w", encoding="utf-8") as f:
        json.dump(consolidator.conflicts.to_list(), f, indent=2, ensure_ascii=False)

    coverage_path = os.path.join(args.out_migration, "MIGRATION_COVERAGE.json")
    with open(coverage_path, "w", encoding="utf-8") as f:
        json.dump(consolidator.coverage.to_dict(), f, indent=2, ensure_ascii=False)

    dedup_path = os.path.join(args.out_migration, "DEDUPLICATION_REPORT.json")
    with open(dedup_path, "w", encoding="utf-8") as f:
        json.dump(consolidator.dedup.to_dict(), f, indent=2, ensure_ascii=False)

    ref_path = os.path.join(args.out_migration, "REFERENCE_VALIDATION.json")
    with open(ref_path, "w", encoding="utf-8") as f:
        json.dump(consolidator.ref_validator.to_dict(), f, indent=2, ensure_ascii=False)

    print("\n=======================================================")
    print("MIGRATION SUMMARY:")
    print(f"  MASTER_SCHEMA VALIDATION: {'PASSED (VALID)' if is_valid else 'FAILED'}")
    print(f"  Validation Errors: {len(validation_errors)}")
    print(f"  Conflicts Recorded: {len(consolidator.conflicts.to_list())}")
    print(f"  Unresolved Items: {len(master_data['unresolved_items'])}")
    print(f"  Unaccounted Legacy Values: {consolidator.coverage.counts['UNACCOUNTED']}")
    print(f"  Broken References: {len(consolidator.ref_validator.broken_references)}")
    print(f"  Entity Counts:")
    for ent, cnt in validation_report["entity_counts"].items():
        print(f"    - {ent:22s}: {cnt}")
    print("=======================================================")

    if not is_valid:
        print("\nValidation Error Details:")
        for err in validation_errors[:10]:
            p_str = "/" + "/".join(str(p) for p in err.path)
            print(f"  Path: {p_str} | Error: {err.message}")
        sys.exit(1)


if __name__ == "__main__":
    main()
