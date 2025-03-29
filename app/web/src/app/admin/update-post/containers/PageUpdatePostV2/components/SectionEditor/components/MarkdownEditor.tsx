import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, Space } from "antd";
import React from "react";
import { SectionUnion } from "web/typing/common";

const { TextArea } = Input;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  initialValue: SectionUnion & { type: "MD" };
  onSubmit?: (value: SectionUnion) => void;
  onCancel?: () => void;
};

export default function MarkdownEditor({
  className,
  style,
  initialValue,
  onSubmit,
  onCancel,
}: Props) {
  const [markdown, setMarkdown] = React.useState(initialValue.markdown || "");

  const renderExtra = () => (
    <Space>
      <Button onClick={() => onCancel?.()} icon={<CloseOutlined />}>
        {"Cancel"}
      </Button>
      <Button
        onClick={() => onSubmit?.({ type: "MD", markdown })}
        icon={<SaveOutlined />}
      >
        {"Save"}
      </Button>
    </Space>
  );

  return (
    <Card
      className={className}
      style={style}
      title={"Markdown Editor"}
      extra={renderExtra()}
    >
      <Flex vertical gap="middle">
        <TextArea
          value={markdown}
          onChange={(event) => {
            setMarkdown(event.target.value);
          }}
          placeholder="Enter your markdown content here..."
          autoSize={{ minRows: 10, maxRows: 20 }}
          showCount
        />
      </Flex>
    </Card>
  );
}
