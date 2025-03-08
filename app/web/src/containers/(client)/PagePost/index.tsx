import cx from "clsx";
import React from "react";
import SectionViewer from "web/components/SectionViewer";
import { Section } from "web/typing/common";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  postId: string;
  title: string;
  sections: Section[];
};

export default function PagePost({ className, style, title, sections }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <h1 className={styles.title}>{title}</h1>
      {sections.map((section) => (
        <SectionViewer key={section.key} section={section} />
      ))}
    </div>
  );
}
