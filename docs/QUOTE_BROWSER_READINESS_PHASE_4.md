# Quote browser readiness testing — Phase 4

Status: Active CI expansion
Date introduced: 2026-08-17

## Purpose

Phase 4 extends the non-destructive GitHub Actions quote-readiness layer into customer photo/file handling on the residential quote journey.

The purpose is to verify the actual browser-visible upload contract and client upload store before adding any further production-boundary file assertions.

## Current upload contract under test

The website client upload store currently enforces:

- maximum 10 selected files;
- maximum 10 MB per file;
- JPEG, PNG, HEIC and HEIF support through MIME type or accepted file extension;
- duplicate suppression based on file name, size and last-modified value;
- explicit per-file removal;
- retained selected-file state while moving forward and back through the quote journey.

The quote UI exposes a gallery picker that accepts multiple image files and a camera-oriented input that accepts images with `capture="environment"` for supported mobile browsers.

## Initial Phase 4 coverage

The first Phase 4 browser slice verifies on desktop Chromium and mobile Chromium that:

- valid gallery images enter visible selected-file state;
- an individual selected image can be removed without removing retained images;
- ten images are accepted and an eleventh is rejected with the customer-facing 10-photo limit message;
- unsupported files are rejected and do not enter selected-file state;
- files larger than 10 MB are rejected and do not enter selected-file state;
- selected photos survive forward navigation to Your Details and back navigation to Photos and Notes;
- the camera input retains image acceptance and environment-capture semantics and can populate the same selected-file state.

These six logical journeys add twelve browser executions across the existing desktop/mobile projects, increasing the expected browser-readiness matrix from 60 to 72 executions.

## Safety boundary

Phase 4 does not submit a real quote, call production HestivaOS, send correspondence, consume production rate limits or create operational records.

The initial slice stops at browser/client upload behavior. A later focused Phase 4 extension may verify that retained files reach the existing development-only structured-submission test seam exactly as selected, but only after the client-side upload matrix is stable.

## Out of scope for this first slice

- production HestivaOS attachment persistence;
- production email attachment delivery;
- exhaustive image-decoder/compression quality validation;
- browser-specific native camera UI beyond the HTML capture contract;
- unsupported file formats outside the existing website policy.
