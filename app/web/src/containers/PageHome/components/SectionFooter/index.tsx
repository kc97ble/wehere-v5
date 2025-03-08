"use client";

import cx from "clsx";
import Image from "next/image";
import React from "react";
import pngLogo from "web/assets/logo.png";
import styles from "./index.module.scss";

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

function FooterLink({ href, children, className }: FooterLinkProps) {
  return (
    <a href={href} className={cx(styles.footerLink, className)}>
      {children}
    </a>
  );
}

type LinkColumnProps = {
  title: string;
  links: Array<{ href: string; label: string }>;
  className?: string;
};

function LinkColumn({ title, links, className }: LinkColumnProps) {
  return (
    <div className={cx(styles.linkColumn, className)}>
      <h3 className={styles.columnTitle}>{title}</h3>
      <div className={styles.links}>
        {links.map((link, index) => (
          <FooterLink key={index} href={link.href}>
            {link.label}
          </FooterLink>
        ))}
      </div>
    </div>
  );
}

type SectionFooterProps = {
  className?: string;
  style?: React.CSSProperties;
};

function SectionFooter({ className, style }: SectionFooterProps) {
  const columns = [
    {
      title: "Về chúng tôi",
      links: [
        { href: "#", label: "Thư viện Dương Liễu" },
        { href: "#", label: "Đội ngũ" },
        { href: "#", label: "Liên hệ" },
      ],
    },
    {
      title: "Dịch vụ",
      links: [
        { href: "#", label: "Trạm lắng nghe" },
        { href: "#", label: "Tài liệu tâm lý" },
        { href: "#", label: "Sự kiện" },
      ],
    },
    {
      title: "Tài nguyên",
      links: [
        { href: "#", label: "Blog" },
        { href: "#", label: "Sách" },
        { href: "#", label: "Podcast" },
      ],
    },
    {
      title: "Hỗ trợ",
      links: [
        { href: "#", label: "FAQs" },
        { href: "#", label: "Điều khoản sử dụng" },
        { href: "#", label: "Chính sách bảo mật" },
      ],
    },
  ];

  return (
    <footer className={cx(styles.root, className)} style={style}>
      <div className={styles.content}>
        <div className={styles.topSection}>
          {columns.map((column, index) => (
            <LinkColumn key={index} title={column.title} links={column.links} />
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.bottomSection}>
          <div className={styles.logoContainer}>
            <Image
              src={pngLogo}
              alt="WeHere Logo"
              className={styles.logo}
              width={120}
              height={48}
            />
          </div>
          <div className={styles.copyright}>
            © 2025 WeHere - Dự án tâm lý của Thư viện Dương Liễu
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SectionFooter;
