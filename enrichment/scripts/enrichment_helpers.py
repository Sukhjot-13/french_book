"""
Enrichment Helpers (enrichment/scripts/enrichment_helpers.py)

Deterministic data loader, natural key matching engine, normalizers, atomic file writers,
backup utilities, and schema validation helpers for L'Étude enrichment pipeline.
"""

import json
import hashlib
import unicodedata
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple, Union
import jsonschema

from enrichment.scripts.enrichment_config import (
    MASTER_DATA_PATH,
    MASTER_SCHEMA_PATH,
    BACKUPS_DIR,
    NATURAL_KEYS,
    FIELD_ALIASES,
)




def load_json(path: Union[str, Path]) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(data: Any, path: Union[str, Path], indent: int = 2) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=indent, ensure_ascii=False)


def load_master_data(path: Optional[Union[str, Path]] = None) -> Dict[str, Any]:
    target = Path(path) if path else MASTER_DATA_PATH
    if not target.exists():
        raise FileNotFoundError(f"Master data file not found at: {target}")
    return load_json(target)


def load_master_schema(path: Optional[Union[str, Path]] = None) -> Dict[str, Any]:
    target = Path(path) if path else MASTER_SCHEMA_PATH
    if not target.exists():
        raise FileNotFoundError(f"Master schema file not found at: {target}")
    return load_json(target)


def calculate_hash(data_or_path: Union[Dict[str, Any], str, Path]) -> str:
    """Calculates SHA-256 hash of a file or JSON-serializable dictionary."""
    if isinstance(data_or_path, (str, Path)) and Path(data_or_path).is_file():
        hasher = hashlib.sha256()
        with open(data_or_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest()
    else:
        serialized = json.dumps(data_or_path, sort_keys=True, ensure_ascii=False).encode("utf-8")
        return hashlib.sha256(serialized).hexdigest()


def normalize_french_text(text: Optional[str]) -> str:
    """Lowercases, removes diacritics, and strips whitespace for matching/deduplication."""
    if not text:
        return ""
    text = unicodedata.normalize("NFD", str(text))
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return text.strip().lower()


def natural_key_to_str(collection: str, key: Union[str, int, Dict[str, Any]]) -> str:
    """Converts any natural key representation (string, int, or dict) into a deterministic canonical string."""
    if isinstance(key, dict):
        # Sort keys deterministically
        parts = [f"{k}={key[k]}" for k in sorted(key.keys())]
        return "::".join(parts)
    return str(key).strip()


def extract_natural_key(collection: str, entity: Dict[str, Any]) -> Union[str, int, Dict[str, Any]]:
    """Extracts the natural key from an entity according to NATURAL_KEYS config."""
    spec = NATURAL_KEYS.get(collection)
    if not spec:
        raise ValueError(f"No natural key specification found for collection: {collection}")
    
    if isinstance(spec, list):
        return {k: entity.get(k) for k in spec}
    return entity.get(spec)


def natural_keys_match(key1: Any, key2: Any) -> bool:
    """Compares two natural keys with defensive normalization."""
    if key1 == key2:
        return True
    if isinstance(key1, dict) and isinstance(key2, dict):
        if set(key1.keys()) != set(key2.keys()):
            return False
        for k in key1:
            val1 = key1[k]
            val2 = key2[k]
            if str(val1).strip().lower() != str(val2).strip().lower():
                return False
        return True
    if isinstance(key1, (str, int)) and isinstance(key2, (str, int)):
        return normalize_french_text(str(key1)) == normalize_french_text(str(key2))
    return False


def build_natural_key_index(dataset: Dict[str, Any], collection: str) -> Dict[str, Tuple[int, Dict[str, Any]]]:
    """
    Builds a lookup index mapping normalized key string -> (index, entity)
    for fast, resilient entity resolution.
    """
    items = dataset.get(collection, [])
    index: Dict[str, Tuple[int, Dict[str, Any]]] = {}
    spec = NATURAL_KEYS.get(collection)
    
    for idx, entity in enumerate(items):
        key = extract_natural_key(collection, entity)
        key_str = natural_key_to_str(collection, key)
        index[key_str.lower()] = (idx, entity)
        
        # Also index single string normalization if key is scalar
        if isinstance(key, (str, int)):
            norm_key = normalize_french_text(str(key))
            if norm_key:
                index[f"__norm__{norm_key}"] = (idx, entity)
                
    return index


def find_entity_by_natural_key(
    dataset: Dict[str, Any],
    collection: str,
    natural_key: Union[str, int, Dict[str, Any]],
    index: Optional[Dict[str, Tuple[int, Dict[str, Any]]]] = None
) -> Tuple[Optional[int], Optional[Dict[str, Any]]]:
    """Finds an entity in the dataset by its natural key."""
    if index is None:
        index = build_natural_key_index(dataset, collection)
        
    key_str = natural_key_to_str(collection, natural_key).lower()
    if key_str in index:
        return index[key_str]
        
    if isinstance(natural_key, (str, int)):
        norm_key = f"__norm__{normalize_french_text(str(natural_key))}"
        if norm_key in index:
            return index[norm_key]
            
    # Fallback to linear search for complex dict keys
    items = dataset.get(collection, [])
    for idx, entity in enumerate(items):
        extracted = extract_natural_key(collection, entity)
        if natural_keys_match(extracted, natural_key):
            return idx, entity
            
    return None, None


def backup_master_data(batch_id: str, source_path: Optional[Union[str, Path]] = None) -> Path:
    """Creates a unique timestamped snapshot of the current enrichment output."""
    src = Path(source_path) if source_path else MASTER_DATA_PATH
    BACKUPS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup_file = BACKUPS_DIR / f"MASTER_DATA_ENRICHED_before_{batch_id}_{timestamp}.json"
    shutil.copy2(src, backup_file)
    return backup_file


def save_master_data_atomically(
    data: Dict[str, Any],
    target_path: Optional[Union[str, Path]] = None
) -> None:
    """Writes updated master data to a .tmp file first, then renames atomically."""
    target = Path(target_path) if target_path else MASTER_DATA_PATH
    tmp_path = target.with_suffix(".tmp.json")
    
    save_json(data, tmp_path, indent=2)
    
    # Atomic rename (POSIX guarantees atomic replace)
    tmp_path.replace(target)


def stable_value_key(value: Any) -> str:
    """Returns a deterministic, accent-insensitive key for scalar or JSON values."""
    if isinstance(value, (dict, list)):
        return json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
    return normalize_french_text(str(value))


def validate_against_master_schema(data: Dict[str, Any], schema_path: Optional[Union[str, Path]] = None) -> List[str]:
    """
    Validates full master dataset against MASTER_SCHEMA.json using jsonschema.
    Returns list of error messages (empty if valid).
    """
    schema = load_master_schema(schema_path)
    validator = jsonschema.Draft202012Validator(schema)
    errors = []
    
    for err in validator.iter_errors(data):
        path = ".".join(str(p) for p in err.path)
        errors.append(f"[{path or 'root'}]: {err.message}")
        if len(errors) >= 25:
            errors.append("... (additional schema errors truncated)")
            break
            
    return errors


def resolve_field_name(field: str) -> str:
    """Normalizes field aliases (e.g. english_meanings -> english)."""
    return FIELD_ALIASES.get(field, field)
