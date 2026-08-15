# Quote form validation boundary

Date: 15 August 2026
Status: implementation note

The quote form may require additional explanatory text when a customer selects a catch-all option such as Property type `Other`, Primary service `Not sure`, or Frequency `Custom`. These fields capture customer intent only; they do not create new service policy, pricing, availability promises, or HestivaOS operational rules.

Add-on services remain add-ons and must not appear as a selectable primary service.

Property-layout questions should describe the property itself: Apartments may ask for unit floor/level; Townhouses and Houses use storeys. A Townhouse must not also be treated as an apartment-style unit-floor property.

Client-side validation must produce visible field errors for missing required information rather than relying on downstream selectors becoming unusable. The structured Website → HestivaOS submission boundary remains fail closed and unchanged.
