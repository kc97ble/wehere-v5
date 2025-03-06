"use client";

import clsx from "clsx";
import React from "react";
import { useIsDeviceWidthLessThan } from "./hooks/useIsDeviceWidthLessThan";
import styles from "./index.module.scss";

type FolderButtonProps = {
  active: boolean;
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

function FolderButton({ active, href, children, style }: FolderButtonProps) {
  return (
    <li
      className={clsx(styles.FolderButton, active && styles.active)}
      style={style}
    >
      <a href={href}>{children}</a>
    </li>
  );
}

type ComponentProps = {
  style?: React.CSSProperties;
};

function Small({ style }: ComponentProps) {
  return (
    <div className={styles.Small} style={style}>
      {/* Small NavBar content */}
    </div>
  );
}

function Large({ style }: ComponentProps) {
  return (
    <div className={styles.Large} style={style}>
      <ul className={styles.folderSwitcher}>
        <FolderButton active={true} href="#">
          Trang chủ
        </FolderButton>
        <FolderButton active={false} href="#">
          Trạm lắng nghe
        </FolderButton>
        <FolderButton active={false} href="#">
          Bài viết
        </FolderButton>
        <FolderButton active={false} href="#">
          Về chúng tôi
        </FolderButton>
      </ul>
    </div>
  );
}

type RootProps = {
  style?: React.CSSProperties;
};

// TODO: set z-index
function Root({ style }: RootProps) {
  const isSmallWidth = useIsDeviceWidthLessThan(576);

  return (
    <div className={styles.Root} style={style}>
      {isSmallWidth == null ? null : isSmallWidth ? <Small /> : <Large />}
    </div>
  );
}

const NavBar = Root;

export default NavBar;
