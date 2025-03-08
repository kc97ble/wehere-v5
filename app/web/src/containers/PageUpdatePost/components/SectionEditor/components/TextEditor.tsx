import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space } from "antd";
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
  const [text, setText] = React.useState(initialValue.text);

  const renderExtra = () => (
    <Space>
      <Button onClick={() => onCancel?.()} icon={<CloseOutlined />}>
        {"Cancel"}
      </Button>
      <Button
        onClick={() => onSubmit?.({ type: "TXT", text })}
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
      <TextArea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
        placeholder="Enter your text content here..."
        autoSize={{ minRows: 4, maxRows: 12 }}
        showCount
      />
    </Card>
  );
}
