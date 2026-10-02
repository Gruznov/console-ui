# Form primitives

Status: stable package contract

## Purpose

Dense operational consoles repeatedly need the same field anatomy, native
controls, responsive grid and action alignment. `FormField`, `Input`,
`Textarea`, `Select`, `FormGrid` and `FormActions` provide that visual and
accessibility foundation without owning validation, submission, permissions or
domain values.

## Public API

```tsx
import {
  Button,
  FormActions,
  FormField,
  FormGrid,
  Input,
  Select,
  Textarea,
} from "@gruznov/console-ui";

<form onSubmit={save}>
  <FormGrid columns={2}>
    <FormField
      controlId="start-url"
      description="Public HTTP(S) URL without credentials."
      label="Start URL"
      wide
    >
      <Input id="start-url" type="url" required />
    </FormField>
    <FormField controlId="mode" label="Mode">
      <Select id="mode">
        <option value="standard">Standard</option>
      </Select>
    </FormField>
    <FormField controlId="notes" label="Notes" optional="Optional">
      <Textarea id="notes" />
    </FormField>
  </FormGrid>
  <FormActions>
    <Button variant="secondary">Cancel</Button>
    <Button type="submit">Save</Button>
  </FormActions>
</form>;
```

`controlId` binds the visible label and message identifiers to the product's
native control. Consumers set the matching `id` and, when a description or
error is announced, `aria-describedby`. `invalid` on native controls sets both
the visual state and `aria-invalid`. `optional` accepts product-local copy so
the shared package does not impose a language.

## Boundaries

Console UI does not own form state, validation rules, masking, API submission,
authorization, destructive confirmation or product copy. Native inputs remain
the contract so browser autofill, keyboard behavior and constraint validation
keep working.

`FormGrid` is one column by default. The two-column form collapses below the
shared narrow breakpoint, while `wide` fields always span the available grid.
