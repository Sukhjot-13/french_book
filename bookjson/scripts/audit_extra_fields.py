#!/usr/bin/env python3
"""
Audit script: Compare all existing JSON data files against LEGACY_COMBINED_SCHEMA.json.

This script scans JSON data files and identifies fields populated in the JSON files
that are NOT represented in the applicable legacy schema (chapter, glossary, verb tables, answer key).

Important constraints:
- Do not modify source JSON.
- Do not normalize anything.
- Do not map fields or merge duplicates.
- Do not redesign schema or use AI inference.
- Preserve full nested paths (e.g. verbs[].infinitive, verbs[].study.learning_priority).
- Resolve all $ref references.
- Respect additionalProperties: false.
- Unclassified files are routed to an unclassified_files list.
"""

import argparse
import glob
import json
import os
import sys
from collections import defaultdict
from typing import Any, Dict, List, Optional, Set, Tuple


SCHEMA_TYPE_MAP = {
    "chapter": "chapter_schema",
    "glossary": "glossary_schema",
    "verb tables": "verb_tables_schema",
    "answer key": "answer_key_schema",
}


def get_json_type(val: Any) -> str:
    """Return JSON schema type for a python value."""
    if val is None:
        return "null"
    elif isinstance(val, bool):
        return "boolean"
    elif isinstance(val, int):
        return "integer"
    elif isinstance(val, float):
        return "number"
    elif isinstance(val, str):
        return "string"
    elif isinstance(val, list):
        return "array"
    elif isinstance(val, dict):
        return "object"
    return type(val).__name__


def make_sample_value(val: Any, max_len: int = 200) -> Any:
    """Prepare a clean sample value, truncating long strings or complex nested structures if needed."""
    if val is None or isinstance(val, (int, float, bool)):
        return val
    if isinstance(val, str):
        if len(val) > max_len:
            return val[:max_len] + "..."
        return val
    if isinstance(val, (dict, list)):
        try:
            dumped = json.dumps(val, ensure_ascii=False)
            if len(dumped) > max_len:
                return dumped[:max_len] + "..."
            return val
        except Exception:
            return str(val)[:max_len]
    return str(val)[:max_len]


class LegacySchemaAuditor:
    def __init__(self, combined_schema_path: str):
        self.combined_schema_path = combined_schema_path
        with open(combined_schema_path, "r", encoding="utf-8") as f:
            self.root_doc = json.load(f)

        self.root_defs = self.root_doc.get("$defs", {})
        self.sub_schemas = {}
        for friendly_name, def_key in SCHEMA_TYPE_MAP.items():
            if def_key in self.root_defs:
                self.sub_schemas[friendly_name] = self.root_defs[def_key]
            else:
                raise KeyError(f"Schema definition '{def_key}' not found in root $defs")

    def resolve_schema(self, schema_node: Any, local_defs: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve all $ref references recursively until a concrete schema object is reached."""
        visited = set()
        while isinstance(schema_node, dict) and "$ref" in schema_node:
            ref = schema_node["$ref"]
            if ref in visited:
                raise RecursionError(f"Circular $ref detected: {ref}")
            visited.add(ref)

            if ref.startswith("#/$defs/"):
                target = ref[len("#/$defs/"):]
                if target in local_defs:
                    schema_node = local_defs[target]
                elif target in self.root_defs:
                    schema_node = self.root_defs[target]
                else:
                    raise KeyError(f"Unable to resolve reference '{ref}' in local or root $defs")
            else:
                raise NotImplementedError(f"Unsupported $ref URI format: {ref}")

        if not isinstance(schema_node, dict):
            return {}
        return schema_node

    def classify_file(self, data: Any, filename: str) -> Optional[str]:
        """
        Determine which legacy schema applies:
        - chapter
        - glossary
        - verb tables
        - answer key
        Returns None if classification cannot be determined confidently.
        """
        if not isinstance(data, dict):
            return None

        # 1. Chapter schema check
        # Chapters have a "chapter" object (e.g., {"id": ..., "chapter_number": ...})
        if "chapter" in data and isinstance(data["chapter"], dict):
            if any(k in data["chapter"] for k in ("id", "chapter_number", "chapter_title", "source_pages")):
                return "chapter"

        # 2. Source-type based check
        source_type = data.get("source_type")
        if source_type == "glossary":
            return "glossary"
        if source_type == "verb_tables":
            return "verb tables"
        if source_type == "answer_key":
            return "answer key"

        # 3. Structural fallback checks if source_type is omitted or unusual
        if "direction" in data and "entries" in data and isinstance(data["entries"], list):
            return "glossary"
        if "tables" in data and "rows" in data and isinstance(data["tables"], list):
            return "verb tables"
        if "exercises" in data and isinstance(data["exercises"], list):
            # Check if elements look like answer key exercises (having answers array)
            if any("answers" in ex for ex in data["exercises"] if isinstance(ex, dict)):
                return "answer key"

        return None

    def find_extra_fields_in_node(
        self,
        data: Any,
        schema_node: Any,
        local_defs: Dict[str, Any],
        current_path: str = "",
    ) -> List[Tuple[str, str, Any]]:
        """
        Recursively inspects every populated field in data and compares against the schema.
        Returns a list of (field_path, observed_type, sample_value) for any extra field.
        """
        resolved_sch = self.resolve_schema(schema_node, local_defs)
        extra_fields = []

        if isinstance(data, dict):
            # Schema for an object
            allowed_props = resolved_sch.get("properties", {}) if isinstance(resolved_sch, dict) else {}

            for key, val in data.items():
                field_path = f"{current_path}.{key}" if current_path else key
                val_type = get_json_type(val)

                if key not in allowed_props:
                    # Found an extra field
                    extra_fields.append((field_path, val_type, val))
                    # Recurse into children of unexpected field as well, to capture deep extra structure
                    if isinstance(val, (dict, list)):
                        extra_fields.extend(
                            self.find_extra_fields_in_node(val, {}, local_defs, field_path)
                        )
                else:
                    # Field is allowed; recurse to check its value structure
                    prop_sch = resolved_sch["properties"][key]
                    extra_fields.extend(
                        self.find_extra_fields_in_node(val, prop_sch, local_defs, field_path)
                    )

        elif isinstance(data, list):
            # Schema for an array
            items_sch = resolved_sch.get("items", {}) if isinstance(resolved_sch, dict) else {}
            array_path = f"{current_path}[]"

            for item in data:
                if isinstance(item, (dict, list)):
                    extra_fields.extend(
                        self.find_extra_fields_in_node(item, items_sch, local_defs, array_path)
                    )

        return extra_fields

    def audit_file(self, file_path: str) -> Dict[str, Any]:
        """Audit a single JSON file."""
        rel_path = os.path.relpath(file_path)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            return {
                "file": rel_path,
                "status": "error",
                "error": f"Failed to parse JSON: {e}",
            }

        schema_type = self.classify_file(data, os.path.basename(file_path))
        if schema_type is None:
            return {
                "file": rel_path,
                "status": "unclassified",
                "reason": "Could not confidently determine legacy schema type (no chapter, glossary, verb_tables, or answer_key signature)",
            }

        schema_def = self.sub_schemas[schema_type]
        local_defs = schema_def.get("$defs", {})

        raw_extras = self.find_extra_fields_in_node(data, schema_def, local_defs, current_path="")

        return {
            "file": rel_path,
            "status": "ok",
            "schema_type": schema_type,
            "extra_fields": raw_extras,
        }


def collect_json_files(scan_dirs: List[str], exclude_dirs: Set[str]) -> List[str]:
    """Find all .json files in specified directories, excluding schema and audit folders."""
    found_files = []
    for d in scan_dirs:
        if os.path.isfile(d) and d.endswith(".json"):
            found_files.append(os.path.abspath(d))
            continue
        for root, dirs, files in os.walk(d):
            # Exclude specified directory basenames
            dirs[:] = [sub for sub in dirs if sub not in exclude_dirs and not sub.startswith(".")]
            for f in files:
                if f.endswith(".json") and not f.startswith("."):
                    abs_p = os.path.abspath(os.path.join(root, f))
                    found_files.append(abs_p)
    return sorted(set(found_files))


def run_audit(
    schema_path: str,
    scan_paths: List[str],
    output_dir: str,
) -> Tuple[Dict[str, Any], str]:
    """Execute the audit and produce JSON and Markdown reports."""
    os.makedirs(output_dir, exist_ok=True)
    auditor = LegacySchemaAuditor(schema_path)

    exclude_dirs = {"schema", "audit", ".git", ".gemini", "node_modules", "scripts"}
    json_files = collect_json_files(scan_paths, exclude_dirs)

    # Filter out the schema file itself if captured
    schema_abs = os.path.abspath(schema_path)
    json_files = [f for f in json_files if f != schema_abs]

    files_checked = len(json_files)
    files_with_extras = set()
    unclassified_files = []
    malformed_files = []

    # Map: (schema_type, field_path) -> { "count": int, "files": set, "samples": list, "types": set }
    aggregated_extras: Dict[Tuple[str, str], Dict[str, Any]] = defaultdict(
        lambda: {"count": 0, "files": set(), "samples": [], "types": set()}
    )

    total_extra_occurrences = 0

    for file_path in json_files:
        result = auditor.audit_file(file_path)
        rel_file = result["file"]

        if result["status"] == "error":
            malformed_files.append({"file": rel_file, "error": result["error"]})
            continue

        if result["status"] == "unclassified":
            unclassified_files.append({"file": rel_file, "reason": result["reason"]})
            continue

        schema_type = result["schema_type"]
        extras = result["extra_fields"]

        if extras:
            files_with_extras.add(rel_file)

        for field_path, val_type, raw_val in extras:
            total_extra_occurrences += 1
            key = (schema_type, field_path)
            entry = aggregated_extras[key]
            entry["count"] += 1
            entry["files"].add(rel_file)
            entry["types"].add(val_type)

            sample = make_sample_value(raw_val)
            if sample not in entry["samples"] and len(entry["samples"]) < 5:
                entry["samples"].append(sample)

    # Format extra_fields array according to user specification
    extra_fields_list = []
    for (schema_type, field_path), info in sorted(aggregated_extras.items(), key=lambda x: (x[0][0], x[0][1])):
        extra_fields_list.append({
            "schema_type": schema_type,
            "field_path": field_path,
            "occurrence_count": info["count"],
            "files": sorted(list(info["files"])),
            "sample_values": info["samples"],
            "observed_types": sorted(list(info["types"])),
        })

    json_report = {
        "summary": {
            "json_files_checked": files_checked,
            "files_with_extra_fields": len(files_with_extras),
            "unique_extra_field_paths": len(extra_fields_list),
            "total_extra_field_occurrences": total_extra_occurrences,
            "unclassified_files_count": len(unclassified_files),
            "malformed_files_count": len(malformed_files),
        },
        "unclassified_files": unclassified_files,
        "malformed_files": malformed_files,
        "extra_fields": extra_fields_list,
    }

    # Generate Markdown report
    md_lines = [
        "# Extra Fields Audit Report",
        "",
        "This report compares all inspected JSON data files against `LEGACY_COMBINED_SCHEMA.json` to identify populated fields that are not defined in the applicable legacy extraction schema.",
        "",
        "## Summary",
        "",
        f"- **Total JSON Files Checked**: {files_checked}",
        f"- **Files with Extra Fields**: {len(files_with_extras)}",
        f"- **Unique Extra Field Paths**: {len(extra_fields_list)}",
        f"- **Total Extra Field Occurrences**: {total_extra_occurrences}",
        f"- **Unclassified Files**: {len(unclassified_files)}",
        f"- **Malformed/Unreadable Files**: {len(malformed_files)}",
        "",
    ]

    if unclassified_files:
        md_lines.extend([
            "## Unclassified Files",
            "",
            "The following files could not be classified into any legacy schema type with high confidence:",
            "",
            "| File | Reason |",
            "| --- | --- |",
        ])
        for uf in unclassified_files:
            md_lines.append(f"| `{uf['file']}` | {uf['reason']} |")
        md_lines.append("")

    if malformed_files:
        md_lines.extend([
            "## Malformed Files",
            "",
            "| File | Error |",
            "| --- | --- |",
        ])
        for mf in malformed_files:
            md_lines.append(f"| `{mf['file']}` | {mf['error']} |")
        md_lines.append("")

    md_lines.extend([
        "## Files Containing Extra Fields",
        "",
    ])

    if not files_with_extras:
        md_lines.append("No files contain extra fields. All inspected JSON data strictly adheres to the properties defined in `LEGACY_COMBINED_SCHEMA.json`.")
        md_lines.append("")
    else:
        for fw in sorted(files_with_extras):
            md_lines.append(f"- `{fw}`")
        md_lines.append("")

    md_lines.extend([
        "## Unique Extra Fields Detail",
        "",
    ])

    if not extra_fields_list:
        md_lines.append("✅ **Zero extra fields found.** Every populated field across all checked JSON files is defined in the legacy schemas.")
        md_lines.append("")
    else:
        md_lines.extend([
            "| Schema Type | Field Path | Occurrences | Observed Types | Files | Sample Values |",
            "| --- | --- | --- | --- | --- | --- |",
        ])
        for ef in extra_fields_list:
            files_str = "<br>".join(f"`{f}`" for f in ef["files"][:5])
            if len(ef["files"]) > 5:
                files_str += f"<br>... (+{len(ef['files']) - 5} more)"

            samples_str = "<br>".join(f"`{json.dumps(s, ensure_ascii=False)}`" for s in ef["sample_values"][:3])
            types_str = ", ".join(ef["observed_types"])

            md_lines.append(
                f"| {ef['schema_type']} | `{ef['field_path']}` | {ef['occurrence_count']} | {types_str} | {files_str} | {samples_str} |"
            )
        md_lines.append("")

    md_report = "\n".join(md_lines)

    # Write output files
    json_path = os.path.join(output_dir, "EXTRA_FIELDS_REPORT.json")
    md_path = os.path.join(output_dir, "EXTRA_FIELDS_REPORT.md")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_report, f, indent=2, ensure_ascii=False)

    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_report)

    return json_report, md_report


def main():
    parser = argparse.ArgumentParser(
        description="Audit existing JSON data files against LEGACY_COMBINED_SCHEMA.json for extra/unexpected fields."
    )
    parser.add_argument(
        "--schema",
        default="schema/LEGACY_COMBINED_SCHEMA.json",
        help="Path to LEGACY_COMBINED_SCHEMA.json (default: schema/LEGACY_COMBINED_SCHEMA.json)",
    )
    parser.add_argument(
        "--data-dirs",
        nargs="*",
        default=["json1"],
        help="Directories or files to scan for JSON data (default: json1)",
    )
    parser.add_argument(
        "--output-dir",
        default="audit",
        help="Directory to write EXTRA_FIELDS_REPORT.json and EXTRA_FIELDS_REPORT.md (default: audit)",
    )

    args = parser.parse_args()

    if not os.path.isfile(args.schema):
        print(f"Error: Schema file not found: {args.schema}", file=sys.stderr)
        sys.exit(1)

    print(f"Loading schema from: {args.schema}")
    print(f"Scanning data folders: {args.data_dirs}")
    print(f"Output directory: {args.output_dir}")

    json_report, _ = run_audit(
        schema_path=args.schema,
        scan_paths=args.data_dirs,
        output_dir=args.output_dir,
    )

    summary = json_report["summary"]
    print("\n--- Audit Completed ---")
    print(f"JSON Files Checked: {summary['json_files_checked']}")
    print(f"Files with Extra Fields: {summary['files_with_extra_fields']}")
    print(f"Unique Extra Field Paths: {summary['unique_extra_field_paths']}")
    print(f"Total Extra Field Occurrences: {summary['total_extra_field_occurrences']}")
    print(f"Unclassified Files: {summary['unclassified_files_count']}")
    print(f"Reports written to: {args.output_dir}/EXTRA_FIELDS_REPORT.json and .md")


if __name__ == "__main__":
    main()
