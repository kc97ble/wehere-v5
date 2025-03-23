import { CloseOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Space } from "antd";
import cx from "clsx";
import React from "react";
import { RefItem, SectionUnion } from "web/typing/common";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  initialValue: SectionUnion & { type: "REFL" };
  onSubmit?: (value: SectionUnion) => void;
  onCancel?: () => void;
};

export default function RefListEditor({
  className,
  style,
  initialValue,
  onSubmit,
  onCancel,
}: Props) {
  const [title, setTitle] = React.useState(initialValue.title || "");
  const [items, setItems] = React.useState<RefItem[]>(initialValue.items || []);

  const handleAddItem = () => {
    setItems([...items, {}]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof RefItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const renderExtra = () => (
    <Space>
      <Button onClick={() => onCancel?.()} icon={<CloseOutlined />}>
        {"Cancel"}
      </Button>
      <Button
        onClick={() => onSubmit?.({ type: "REFL", title, items })}
        icon={<SaveOutlined />}
      >
        {"Save"}
      </Button>
    </Space>
  );

  return (
    <Card
      className={cx(className)}
      style={style}
      title={"References Editor"}
      extra={renderExtra()}
    >
      <Flex vertical gap="middle">
        <Form layout="vertical">
          <Form.Item label="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="References"
            />
          </Form.Item>

          {items.map((item, index) => (
            <Card
              key={index}
              size="small"
              title={`Reference ${index + 1}`}
              extra={
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(index)}
                  danger
                  type="text"
                />
              }
              style={{ marginBottom: 16 }}
            >
              <Flex vertical gap="small">
                <Form.Item label="Author" style={{ marginBottom: 8 }}>
                  <Input
                    value={item.author || ""}
                    onChange={(e) => handleItemChange(index, "author", e.target.value)}
                    placeholder="Author name"
                  />
                </Form.Item>
                <Form.Item label="Year" style={{ marginBottom: 8 }}>
                  <Input
                    value={item.year || ""}
                    onChange={(e) => handleItemChange(index, "year", e.target.value)}
                    placeholder="Publication year"
                  />
                </Form.Item>
                <Form.Item label="Title" style={{ marginBottom: 8 }}>
                  <Input
                    value={item.title || ""}
                    onChange={(e) => handleItemChange(index, "title", e.target.value)}
                    placeholder="Title of the work"
                  />
                </Form.Item>
                <Form.Item label="URL" style={{ marginBottom: 8 }}>
                  <Input
                    value={item.url || ""}
                    onChange={(e) => handleItemChange(index, "url", e.target.value)}
                    placeholder="https://example.com"
                  />
                </Form.Item>
                <Form.Item label="Publisher" style={{ marginBottom: 8 }}>
                  <Input
                    value={item.publisher || ""}
                    onChange={(e) => handleItemChange(index, "publisher", e.target.value)}
                    placeholder="Publisher name"
                  />
                </Form.Item>
                <Form.Item label="Retrieved On" style={{ marginBottom: 8 }}>
                  <Input
                    value={item.retrievedOn || ""}
                    onChange={(e) => handleItemChange(index, "retrievedOn", e.target.value)}
                    placeholder="Date retrieved"
                  />
                </Form.Item>
                <Form.Item label="Others" style={{ marginBottom: 8 }}>
                  <Input
                    value={item.others || ""}
                    onChange={(e) => handleItemChange(index, "others", e.target.value)}
                    placeholder="Additional information"
                  />
                </Form.Item>
              </Flex>
            </Card>
          ))}

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddItem}
            style={{ width: "100%" }}
          >
            Add Reference
          </Button>
        </Form>
      </Flex>
    </Card>
  );
}