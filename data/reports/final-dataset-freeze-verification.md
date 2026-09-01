# Final Dataset Freeze Verification

- Exercise: **FAIL** — source/final identities reconcile at 1,872/1,872 with 0 missing, unexpected, or duplicate identities and all 68 restored, but `14.1` question 6 contains source-extraneous `U+0002` spill; `1.2`, `14.1`, and `22.3` continuations otherwise match targeted PDF pages.
- Answer provenance: **FAIL** — all 1,872 records have page fields and sampled page transitions are generally correct, but `22.1` answer 9 is truncated to `Ses idées sont`; the printed answer continues on pages 269–270 (PDF 283–284).
- Glossary/vocabulary: **FAIL** — target POS/variants are repaired and `remaining-other-entries.json` has no systematic garbage pattern, but canonical output still contains `de temps en temps from time`, `to have a cold avoir un rhume`, `time de temps en temps`, and `you merci`; the 1,941 denominator is still the two parsed-output array lengths, not independently clean identities.
- Verb tables: **PASS** — 98 source rows are loaded independently and reconciled by exact forms (98/98); page 239 and the six requested verbs correctly preserve past participles plus six present forms, with `book`/`derived_from_book` provenance.
- Validator/idempotence: **FAIL** — validation/regressions pass and the timestamp-stripped canonical SHA-256 matches `174fb7374e2eb0d30c05aa1dece98e8d59ee8e59880542eb8a40c5d9040e6b58`, but the validator checks these garbage patterns only on vocabulary, so the material expression failures pass validation.
- Verdict: **TARGETED_FIX_REQUIRED**

TARGETED_FIX_REQUIRED
