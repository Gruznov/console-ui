import {
  Button,
  FormActions,
  FormField,
  FormGrid,
  Input,
  Select,
  Textarea,
} from "@polyconsole/console-ui";
import type { Meta, StoryObj } from "@storybook/react";

import "./form.css";
import "./token-themes.css";

function ThemeFormPreview({ theme }: { theme: "dark" | "light" }) {
  return (
    <section className="form-story-panel" data-console-theme={theme}>
      <h2>{theme === "light" ? "Light form" : "Dark form"}</h2>
      <FormGrid columns={2}>
        <FormField
          controlId={`${theme}-url`}
          description="Public HTTP(S) URL without credentials."
          label="Start URL"
          wide
        >
          <Input
            id={`${theme}-url`}
            placeholder="https://example.org/archive"
            type="url"
          />
        </FormField>
        <FormField
          controlId={`${theme}-name`}
          label="Display name"
          optional="Optional"
        >
          <Input id={`${theme}-name`} placeholder="Example archive" />
        </FormField>
        <FormField controlId={`${theme}-mode`} label="Archive mode">
          <Select defaultValue="standard" id={`${theme}-mode`}>
            <option value="standard">Standard</option>
            <option value="dark">Dark archive</option>
          </Select>
        </FormField>
        <FormField
          controlId={`${theme}-description`}
          label="Internal description"
          optional="Optional"
          wide
        >
          <Textarea
            id={`${theme}-description`}
            placeholder="Operational context for other administrators"
          />
        </FormField>
        <FormField
          controlId={`${theme}-invalid`}
          error="Use a public URL."
          label="Invalid example"
          wide
        >
          <Input
            aria-describedby={`${theme}-invalid-error`}
            id={`${theme}-invalid`}
            invalid
            value="http://127.0.0.1"
            readOnly
          />
        </FormField>
        <FormField controlId={`${theme}-disabled`} label="Disabled example">
          <Input disabled id={`${theme}-disabled`} value="Managed by policy" />
        </FormField>
      </FormGrid>
      <FormActions>
        <Button variant="secondary">Cancel</Button>
        <Button type="submit">Save resource</Button>
      </FormActions>
    </section>
  );
}

function FormComparison() {
  return (
    <div className="form-story-stack">
      <ThemeFormPreview theme="light" />
      <ThemeFormPreview theme="dark" />
    </div>
  );
}

const meta = {
  title: "Components/Form fields",
  component: FormComparison,
} satisfies Meta<typeof FormComparison>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {};
