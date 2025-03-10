import cx from "clsx";
import React from "react";
import { SectionUnion } from "web/typing/common";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: SectionUnion & { type: "TXT" };
};

export default function TextViewer({ className, style, value }: Props) {
  const Component = value.as || "p";
  return (
    <Component className={cx(styles.container, className)} style={style}>
      {value.text}
    </Component>
  );
}
