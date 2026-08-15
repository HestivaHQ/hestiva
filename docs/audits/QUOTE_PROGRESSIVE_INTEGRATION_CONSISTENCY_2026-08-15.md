# Quote progressive/integration consistency repair — 15 August 2026

Status: implementation companion for the post-PR #146 quote-flow correction

## Problem found

PR #146 corrected the React `/quote` form, but the older lazy `LiveFormSubmission` enhancement still contained assumptions from the earlier quote model. It could disable later fields until an earlier field had a value, and it still classified Townhouse with Apartment for exact-floor/unit-access handling. The structured Website → HestivaOS mapper also still read the old recurring-notes field for `CUSTOM` frequency and did not transport the new mandatory explanatory answers introduced by PR #146.

This produced three inconsistent layers: the visible React form, the progressive enhancement controller, and the structured HestivaOS payload.

## Correction

- `/quote` now mounts a small synchronous `QuoteProgressionPolicy` alongside the synchronous `StructuredQuoteSubmission` owner. It restores ordinary quote choices after the lazy enhancement layer runs, so an unanswered required field is surfaced by the existing visible Continue-step validation rather than silently making later choices unusable.
- Only the known progressively-disabled quote controls are affected. Submission buttons, file controls, and in-flight submission state are not force-enabled.
- The structured mapper treats Apartment as the only exact-floor/building-access property model. Townhouse is transported using storeys and does not require an apartment-style floor number or elevator/stairs answer.
- The dedicated mandatory `customFrequency` answer now maps to `request.customFrequencyNote`; `recurringNotes` remains a separate visit note.
- Mandatory `Other` property and `Not sure` primary-service explanations are preserved in structured `notes.additionalNotes` for HestivaOS review rather than being dropped.
- The temporary Townhouse display value `3+ storeys` maps conservatively to the contract's `UNKNOWN` storey band while preserving the exact customer wording in `additionalNotes`, avoiding a submission exception or invented exact floor count.

## Submission ownership preserved

PR #144 remains authoritative: `StructuredQuoteSubmission` is still loaded synchronously and owns final residential quote submission. The lazy legacy controller remains responsible for progressive form/contact behaviour only; this repair does not restore the old email-only quote sender as an alternate final path.

The website still fails closed unless HestivaOS acknowledges the structured request and returns the authoritative `quoteReference` before customer/admin confirmation correspondence is sent.

## Cross-system dependency

HestivaOS Contract v2 must accept the corrected Townhouse storey model without inheriting Contract v1's historical Apartment/Townhouse exact-floor requirement. That companion correction is tracked in the HestivaOS quote-ingestion repair branch/PR. Historical v1 compatibility is intentionally not broadened by the website.

## Verification requirements

Before merge:

1. Run the full Hestiva PR Check on the exact final branch head.
2. Confirm mapper regression tests cover Custom frequency, Other/Not-sure explanations, and Townhouse storey transport.
3. Review the final diff to ensure PR #144 final-submission ownership is unchanged.
4. After the website and matching HestivaOS change are deployed, perform a production quote smoke test that receives a real HestivaOS `quoteReference`.
