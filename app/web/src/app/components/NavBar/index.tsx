"use client";

import React from "react";
import { useIsDeviceWidthLessThan } from "./hooks/useIsDeviceWidthLessThan";
import styles from "./index.module.scss";

type FolderButtonProps = {
  active: boolean;
  href: string;
  children: React.ReactNode;
};

function FolderButton({ active, href, children }: FolderButtonProps) {
  return (
    <li className={`${styles.FolderButton} ${active ? styles.active : ""}`}>
      <a href={href}>{children}</a>
    </li>
  );
}

const Small = () => {
  return <div className={styles.Small}>{/* Small NavBar content */}</div>;
};

const Large = () => {
  return (
    <div className={styles.Large}>
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
};

function Root() {
  const isSmallWidth = useIsDeviceWidthLessThan(576);

  return (
    <div className={styles.Root}>
      {isSmallWidth == null ? null : isSmallWidth ? <Small /> : <Large />}
    </div>
  );
}

const NavBar = Root;

export default NavBar;
