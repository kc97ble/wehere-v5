import { DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { Button, Card, Space } from "antd";
import cx from "clsx";
import React from "react";
import { SectionUnion } from "web/typing/common";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  onSubmit?: (sectionUnion: SectionUnion) => void;
  onDelete?: () => void;
};

export default function NoneEditor({
  className,
  style,
  onSubmit,
  onDelete,
}: Props) {
  const renderExtra = () => (
    <Button danger icon={<DeleteOutlined />} onClick={() => onDelete?.()}>
      {"Delete"}
    </Button>
  );

  return (
    <Card
      className={cx(className)}
      style={style}
      title="Choose a content type"
      extra={renderExtra()}
    >
      <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
        <Button
          type="default"
          icon={<FileTextOutlined />}
          onClick={() => onSubmit?.({ type: "TXT", text: "" })}
          block
        >
          Plain Text
        </Button>
      </Space>
    </Card>
  );
}
