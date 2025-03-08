import cx from "clsx";
import React from "react";
import { Section } from "web/typing/common";
import TextViewer from "./components/TextViewer";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  section: Section;
};

export default function SectionViewer({ className, style, section }: Props) {
  const renderViewer = () => {
    switch (section.union.type) {
      case "NONE":
        return null;
      case "TXT":
        return <TextViewer value={section.union} />;
      default:
        return <pre>{JSON.stringify(section, null, 2)}</pre>;
    }
  };

  return (
    <div className={cx(styles.container, className)} style={style}>
      {renderViewer()}
    </div>
  );
}
