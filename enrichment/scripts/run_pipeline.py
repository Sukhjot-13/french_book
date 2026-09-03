"""
Enrichment Pipeline Orchestrator (enrichment/scripts/run_pipeline.py)

Convenience orchestrator automating multi-step workflows:
- 'process-responses': Validates all new GPT JSON returns and generates preview reports for human review.
- 'apply-approved': Stages, validates, and atomically applies all approved patches.
- 'generate-queue': Generates the complete enrichment queue for the entire master dataset.
"""

import sys
import subprocess
import argparse
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PYTHON = sys.executable


def run_process_responses() -> None:
    """Validates all files in responses/ and generates preview diff reports in one step."""
    print("\n🚀 Step 1: Validating all responses in enrichment/manual/responses/ ...")
    ret1 = subprocess.run([PYTHON, str(SCRIPT_DIR / "validate_enrichment_response.py"), "--all"])
    if ret1.returncode != 0:
        print("Validation encountered errors.")
        return

    print("\n🚀 Step 2: Generating diff previews ...")
    ret2 = subprocess.run([PYTHON, str(SCRIPT_DIR / "preview_enrichment.py"), "--all"])
    if ret2.returncode != 0:
        print("Preview generation encountered errors.")
        return

    print("\n🚀 Step 3: Generating clean human-readable preview reports ...")
    subprocess.run([PYTHON, str(SCRIPT_DIR / "generate_enrichment_report.py"), "--mode", "preview"])

    print("\n✅ Responses processed successfully!")
    print("👉 Read the human-readable diff reports in: enrichment/manual/reports/")
    print("👉 To approve patches for application, move or copy them to: enrichment/manual/approved/")


def run_apply_approved(force_validated: bool = False) -> None:
    """Applies approved patches safely with backups and post-apply schema checks."""
    cmd = [PYTHON, str(SCRIPT_DIR / "apply_enrichment.py"), "--all"]
    if force_validated:
        cmd.append("--force-validated")
    subprocess.run(cmd)


def run_generate_queue(reset: bool = False) -> None:
    """Generates all batch TXT prompt files across all 11 enrichable master collections."""
    cmd = [PYTHON, str(SCRIPT_DIR / "make_enrichment_batch.py"), "--all", "--full-queue"]
    if reset:
        cmd.append("--reset")
    subprocess.run(cmd)


def main() -> None:
    parser = argparse.ArgumentParser(description="One-command enrichment pipeline manager.")
    parser.add_argument("action", choices=["process-responses", "apply-approved", "generate-queue"],
                        help="Workflow action to execute.")
    parser.add_argument("--force-validated", action="store_true",
                        help="When applying, allow applying directly from validated/ without copying to approved/.")
    parser.add_argument("--reset", action="store_true",
                        help="When generating queue, reset progress counters and regenerate from scratch.")
    args = parser.parse_args()

    if args.action == "process-responses":
        run_process_responses()
    elif args.action == "apply-approved":
        run_apply_approved(force_validated=args.force_validated)
    elif args.action == "generate-queue":
        run_generate_queue(reset=args.reset)



if __name__ == "__main__":
    main()
