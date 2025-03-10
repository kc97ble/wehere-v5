import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, Select, Space } from "antd";
import cx from "clsx";
import React from "react";
import { SectionUnion } from "web/typing/common";

const { TextArea } = Input;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  initialValue: SectionUnion & { type: "TXT" };
  onSubmit?: (value: SectionUnion) => void;
  onCancel?: () => void;
};

export default function TextEditor({
  className,
  style,
  initialValue,
  onSubmit,
  onCancel,
}: Props) {
  const [as, setAs] = React.useState(initialValue.as);
  const [text, setText] = React.useState(initialValue.text);

  const renderExtra = () => (
    <Space>
      <Button onClick={() => onCancel?.()} icon={<CloseOutlined />}>
        {"Cancel"}
      </Button>
      <Button
        onClick={() => onSubmit?.({ type: "TXT", as, text })}
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
      title={"Text Editor"}
      extra={renderExtra()}
    >
      <Flex vertical gap="middle">
        <Select
          value={as}
          options={[
            { value: "p", label: "Paragraph" },
            { value: "h2", label: "Heading 2" },
          ]}
          onChange={(as) => setAs(as)}
        />
        <TextArea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
          placeholder="Enter your text content here..."
          autoSize={{ minRows: 4, maxRows: 12 }}
          showCount
        />
      </Flex>
    </Card>
  );
}
