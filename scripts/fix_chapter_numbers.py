import json
from pathlib import Path

CONFIGS = [
    {
        "path": Path("/Users/sukhjot/codes/book/bookdata/json/2.json"),
        "old_num": 13,
        "new_num": 2,
        "old_id": "chapter_13",
        "new_id": "chapter_02",
        "id_sub": None,
    },
    {
        "path": Path("/Users/sukhjot/codes/book/bookdata/json/5.json"),
        "old_num": 43,
        "new_num": 5,
        "old_id": "chapter_43",
        "new_id": "chapter_05",
        "id_sub": ("ch43", "ch05"),
    },
    {
        "path": Path("/Users/sukhjot/codes/book/bookdata/json/6.json"),
        "old_num": 49,
        "new_num": 6,
        "old_id": "chapter_49",
        "new_id": "chapter_06",
        "id_sub": ("ch49", "ch06"),
    },
]

ID_FIELDS = {
    "id",
    "section_id",
    "parent_section_id",
    "exercise_id",
    "question_id",
    "example_id",
    "concept_ids",
    "section_ids",
    "exercise_ids",
}


def transform_data(obj, cfg, stats, key_name=""):
    if isinstance(obj, dict):
        new_dict = {}
        for k, v in obj.items():
            if k == "chapter_number" and v == cfg["old_num"]:
                new_dict[k] = cfg["new_num"]
                stats["chapter_number_count"] += 1
            elif k == "chapter_id" and v == cfg["old_id"]:
                new_dict[k] = cfg["new_id"]
                stats["chapter_id_count"] += 1
            elif k == "id" and v == cfg["old_id"]:
                new_dict[k] = cfg["new_id"]
                stats["chapter_root_id_count"] += 1
            else:
                new_dict[k] = transform_data(v, cfg, stats, k)
        return new_dict
    elif isinstance(obj, list):
        return [transform_data(item, cfg, stats, key_name) for item in obj]
    elif isinstance(obj, str):
        if cfg["id_sub"] and key_name in ID_FIELDS:
            old_prefix, new_prefix = cfg["id_sub"]
            if old_prefix in obj:
                stats["id_prefix_count"] += 1
                return obj.replace(old_prefix, new_prefix)
        return obj
    else:
        return obj


def process_files():
    for cfg in CONFIGS:
        print(f"Processing {cfg['path'].name}...")
        with open(cfg["path"], "r", encoding="utf-8") as f:
            data = json.load(f)

        stats = {
            "chapter_number_count": 0,
            "chapter_id_count": 0,
            "chapter_root_id_count": 0,
            "id_prefix_count": 0,
        }

        updated_data = transform_data(data, cfg, stats)

        with open(cfg["path"], "w", encoding="utf-8") as f:
            json.dump(updated_data, f, ensure_ascii=False, indent=2)
            f.write("\n")

        print(f"  Successfully updated {cfg['path'].name}:")
        print(f"    - chapter_number ({cfg['old_num']} -> {cfg['new_num']}): {stats['chapter_number_count']} occurrences")
        print(f"    - chapter_id ({cfg['old_id']} -> {cfg['new_id']}): {stats['chapter_id_count']} occurrences")
        print(f"    - chapter root id: {stats['chapter_root_id_count']} occurrence")
        print(f"    - ID prefix updates: {stats['id_prefix_count']} occurrences")


if __name__ == "__main__":
    process_files()
