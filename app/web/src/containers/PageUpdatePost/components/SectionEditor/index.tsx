import cx from "clsx";
import React from "react";
import { Section } from "web/typing/common";
import NoneEditor from "./components/NoneEditor";
import TextEditor from "./components/TextEditor";
import Viewer from "./containers/Viewer";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Section;
  onChange?: (section: Section) => void;
  onDelete?: () => void;
  onMove?: (destination: "up" | "down" | "top" | "bottom") => void;
  onInsert?: (destination: "above" | "below") => void;
  onDuplicate?: () => void;
};

export default function SectionEditor({
  className,
  style,
  value,
  onChange,
  onDelete,
  onMove,
  onInsert,
  onDuplicate,
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
      <div className={cx(styles.SectionEditor, className)}>
        <Viewer
          value={value}
          onActivateEditor={() => setEditing(true)}
          onChange={onChange}
          onDelete={onDelete}
          onMove={onMove}
          onInsert={onInsert}
          onDuplicate={onDuplicate}
        />
      </div>
    );
  }

  return (
    <div className={cx(styles.SectionEditor, className)} style={style}>
      {renderEditor()}
    </div>
  );
}
