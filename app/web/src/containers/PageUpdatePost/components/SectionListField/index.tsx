"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { useField } from "uniforms";
import { Section } from "web/typing/common";
import SectionEditor from "../SectionEditor";

type Props = {
  name: string;
  value?: Section[];
};

export default function SectionListField(props: Props) {
  const [fieldProps, _context] = useField(props.name, props);
  const { onChange, value } = fieldProps;

  if (value == null) {
    return null;
  }

  return (
    <Flex vertical gap="middle">
      {value.map((section, index) => (
        <SectionEditor
          key={section.key}
          value={section}
          onChange={(updatedSection) => {
            const items = [...value];
            items[index] = updatedSection;
            onChange(items);
          }}
          onDelete={() => {
            const items = [...value];
            items.splice(index, 1);
            onChange(items);
          }}
        />
      ))}

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => {
            onChange([...value, { key: Date.now(), union: { type: "NONE" } }]);
          }}
        >
          {"Add Section"}
        </Button>
      </div>
    </Flex>
  );
}
