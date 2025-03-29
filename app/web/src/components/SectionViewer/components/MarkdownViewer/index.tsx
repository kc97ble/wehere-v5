import cx from "clsx";
import React from "react";
import ReactMarkdown from "react-markdown";
import { SectionUnion } from "web/typing/common";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: SectionUnion & { type: "MD" };
};

export default function MarkdownViewer({ className, style, value }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <ReactMarkdown>{value.markdown || ""}</ReactMarkdown>
    </div>
  );
}
