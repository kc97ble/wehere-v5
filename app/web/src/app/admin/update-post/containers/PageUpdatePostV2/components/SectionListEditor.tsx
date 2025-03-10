import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { Section } from "web/typing/common";
import SectionEditor from "./SectionEditor";

type Props = {
  value: Section[];
  onChange?: (value: Section[]) => void;
};

export default function SectionListEditor({ value, onChange }: Props) {
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
            onChange?.(items);
          }}
          onDelete={() => {
            const items = [...value];
            items.splice(index, 1);
            onChange?.(items);
          }}
          onMove={(destination) => {
            const items = [...value];
            const item = items[index];

            // Remove the item from its current position
            items.splice(index, 1);

            // Insert the item at the new position based on destination
            switch (destination) {
              case "top":
                items.unshift(item);
                break;
              case "up":
                if (index > 0) {
                  items.splice(index - 1, 0, item);
                } else {
                  items.unshift(item);
                }
                break;
              case "down":
                if (index < items.length) {
                  items.splice(index + 1, 0, item);
                } else {
                  items.push(item);
                }
                break;
              case "bottom":
                items.push(item);
                break;
            }

            onChange?.(items);
          }}
          onInsert={(destination) => {
            const items = [...value];
            const newSection: Section = {
              key: Date.now(),
              union: { type: "NONE" },
            };

            if (destination === "above") {
              items.splice(index, 0, newSection);
            } else {
              items.splice(index + 1, 0, newSection);
            }

            onChange?.(items);
          }}
          onDuplicate={() => {
            const items = [...value];
            // Create a deep copy of the section with a new key
            const duplicatedSection = {
              ...JSON.parse(JSON.stringify(section)),
              key: Date.now(),
            };

            // Insert after the current section
            items.splice(index + 1, 0, duplicatedSection);
            onChange?.(items);
          }}
        />
      ))}

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => {
            onChange?.([
              ...value,
              { key: Date.now(), union: { type: "NONE" } },
            ]);
          }}
        >
          {"Add Section"}
        </Button>
      </div>
    </Flex>
  );
}
