import { DeleteOutlined, FileTextOutlined, OrderedListOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, Card, Flex } from "antd";
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
      <Flex gap="middle" wrap="wrap">
        <Button
          type="default"
          icon={<FileTextOutlined />}
          onClick={() => onSubmit?.({ type: "TXT", as: "h2", text: "" })}
          block
        >
          {"Heading"}
        </Button>
        <Button
          type="default"
          icon={<FileTextOutlined />}
          onClick={() => onSubmit?.({ type: "TXT", as: "p", text: "" })}
          block
        >
          {"Paragraph"}
        </Button>
        <Button
          type="default"
          icon={<PictureOutlined />}
          onClick={() =>
            onSubmit?.({
              type: "IMG1",
              url: undefined,
              intrinsicWidth: undefined,
              intrinsicHeight: undefined,
              maxWidth: undefined,
            })
          }
          block
        >
          {"Image"}
        </Button>
        <Button
          type="default"
          icon={<OrderedListOutlined />}
          onClick={() => onSubmit?.({ type: "REFL", title: "References", items: [] })}
          block
        >
          {"References"}
        </Button>
      </Flex>
    </Card>
  );
}
