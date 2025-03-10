import cx from "clsx";
import React from "react";
import styles from "../index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  slotMenu?: React.ReactNode;
};

export default function PreviewWrapper({
  className,
  style,
  children,
  slotMenu,
}: Props) {
  return (
    <div className={cx(styles.PreviewWrapper, className)} style={style}>
      <div className={styles.content}>{children}</div>
      <div className={styles.menuContainer}>
        <div className={styles.menu}>{slotMenu}</div>
      </div>
    </div>
  );
}
