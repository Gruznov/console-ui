# Selection and progress primitives

Status: stable package contract

`ChoiceGroup` and `ChoiceCard` preserve native radio and checkbox semantics
while presenting dense, scan-first choices. `ProgressSteps` presents the known
position in a bounded multi-step flow. All labels, descriptions, values,
validation and state transitions remain product-owned.

```tsx
<ProgressSteps
  label="Resource setup"
  steps={[
    { id: "details", label: "Details", state: "complete" },
    { id: "policy", label: "Policy", state: "current" },
    { id: "review", label: "Review", state: "upcoming" },
  ]}
/>

<ChoiceGroup columns={2} legend="Archive policy">
  <ChoiceCard
    checked={policy === "respect"}
    description="Use the published crawl policy."
    label="Respect robots.txt"
    name="policy"
    onChange={() => setPolicy("respect")}
    value="respect"
  />
</ChoiceGroup>
```

ChoiceCard renders a native input inside its label. It accepts normal native
input attributes and supports both radio and checkbox controls. The input stays
keyboard-focusable even though the card owns the visible focus treatment.

ProgressSteps does not navigate, validate, or decide whether a step is
complete. Products supply stable ids, localized labels and one of `complete`,
`current`, or `upcoming`. Optional descriptions are intended for wider setup
flows and collapse into a vertical list on narrow screens.
