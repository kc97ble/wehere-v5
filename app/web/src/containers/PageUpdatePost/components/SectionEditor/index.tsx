import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import cx from "clsx";
import React from "react";
import SectionViewer from "web/components/SectionViewer";
import { Section } from "web/typing/common";
import NoneEditor from "./components/NoneEditor";
import TextEditor from "./components/TextEditor";
import styles from "./index.module.scss";
type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Section;
  onChange?: (section: Section) => void;
  onDelete?: () => void;
};

export default function SectionEditor({
  className,
  style,
  value,
  onChange,
  onDelete,
}: Props) {
  const [editing, setEditing] = React.useState(false);

  const renderEditor = () => {
    switch (value.union.type) {
      case "NONE":
        return (
          <NoneEditor
            onSubmit={(union) => {
              setEditing(true);
              onChange?.({ ...value, union });
            }}
            onDelete={() => onDelete?.()}
          />
        );
      case "TXT":
        return (
          <TextEditor
            initialValue={value.union}
            onSubmit={(union) => {
              setEditing(false);
              onChange?.({ ...value, union });
            }}
            onCancel={() => setEditing(false)}
          />
        );
      default:
        return null;
    }
  };

  if (!editing && value.union.type !== "NONE") {
    return (
      <div className={cx(styles.Viewer, className)}>
        <SectionViewer section={value} />
        <div className={styles.overlay}>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx(styles.Editor, className)} style={style}>
      {renderEditor()}
    </div>
  );
}
