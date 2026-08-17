# Quote browser readiness testing — Phase 4B

Status: Active CI expansion
Date introduced: 2026-08-17

## Purpose

Phase 4B completes the quote-photo readiness slice by proving that the final structured submission boundary receives exactly the customer photos that remain selected after removal.

It builds on Phase 4A, which covers browser/client upload acceptance, limits, rejection, removal, persistence and mobile camera input semantics.

## Coverage

The Phase 4B browser journey runs on desktop Chromium and mobile Chromium and verifies that:

- two accepted photos can be selected;
- one selected photo can be removed before submission;
- the quote can proceed through Review and Submit using the existing development-only structured-submission seam;
- the final submission seam is invoked exactly once;
- the structured `files` payload contains exactly one retained file;
- the retained file keeps its filename and MIME type;
- the retained file carries a generated `clientPhotoId` and non-empty base64 payload;
- the removed file is absent from the final structured payload.

## Safety boundary

The test uses the existing development-only final-submission seam introduced for Phase 3. It does not call production HestivaOS, send correspondence, consume the production quote rate limit or create operational records.

No production file-transport semantics are replaced before the structured submission boundary: the real client upload store, removal logic and `StructuredQuoteSubmission` file conversion path are exercised.

## Matrix impact

Phase 4A established 72 browser executions across desktop and mobile Chromium. Phase 4B adds one logical journey across both projects, bringing the expected total to 74 executions.
