"use client";

import { useField } from "uniforms";
import { Section } from "../../../../typing/common";

interface SectionListFieldProps {
  name: string;
  value?: Section[];
}

export default function SectionListField(props: SectionListFieldProps) {
  const [fieldProps, context] = useField(props.name, props);
  const { onChange, value } = fieldProps;

  if (value == null) {
    return null;
  }

  return (
    <div>
      <ul>
        {value.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          onChange([...value, { union: { type: "NONE" } }]);
        }}
      >
        {"Add"}
      </button>
    </div>
  );
}
