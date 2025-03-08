"use client";

// TODO: let's move this folder back to the parent folder

import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { VscBell, VscMenu } from "react-icons/vsc";
import pngLogo from "web/assets/logo.png";
import { useIsDeviceWidthLessThan } from "./hooks/useIsDeviceWidthLessThan";
import styles from "./index.module.scss";

type FolderButtonProps = {
  active: boolean;
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

function FolderButton({
  active,
  href,
  children,
  style,
  className,
}: FolderButtonProps) {
  return (
    <li
      className={clsx(styles.FolderButton, active && styles.active, className)}
      style={style}
    >
      <a href={href}>{children}</a>
    </li>
  );
}

type SmallProps = {
  style?: React.CSSProperties;
  className?: string;
};

function Small({ style, className }: SmallProps) {
  return (
    <div className={clsx(styles.Small, className)} style={style}>
      <button className={styles.button}>
        <VscMenu />
      </button>
      <div className={styles.title}>{"WeHere"}</div>
      <div className={styles.spacer}></div>
      <button className={styles.button}>
        <VscBell />
      </button>
    </div>
  );
}

type LargeProps = {
  style?: React.CSSProperties;
  className?: string;
};

function Large({ style, className }: LargeProps) {
  return (
    <div className={clsx(styles.Large, className)} style={style}>
      <div className={styles.logoContainer}>
        <Image className={styles.logo} src={pngLogo} alt="" />
      </div>
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
  className?: string;
  zIndex?: number;
};

function Root({ style, className, zIndex }: RootProps) {
  const isSmallWidth = useIsDeviceWidthLessThan(576);

  return (
    <div
      className={clsx(styles.Root, className)}
      style={{
        zIndex,
        ...style,
      }}
    >
      {isSmallWidth == null ? null : isSmallWidth ? <Small /> : <Large />}
    </div>
  );
}

const NavBar = Root;

export default NavBar;
