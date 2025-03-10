import cx from "clsx";
import React from "react";
import SectionViewer from "web/components/SectionViewer";
import { Section } from "web/typing/common";
import styles from "./index.module.scss";

// Function to format date in Vietnamese format like "26 tháng 2, 2025 12:30"
const formatDateToVietnamese = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day} tháng ${month}, ${year} ${hours}:${minutes}`;
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  postId: string;
  title: string;
  sections: Section[];
  tags?: string[];
  postedAt?: number;
};

export default function PagePost({ className, style, title, sections, tags = [], postedAt }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      {/* Display tags before title */}
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
      
      <h1 className={styles.title}>{title}</h1>
      
      {/* Display posted datetime in Vietnamese format */}
      {postedAt && (
        <div className={styles.postedAt}>
          {formatDateToVietnamese(new Date(postedAt))}
        </div>
      )}
      
      {sections.map((section) => (
        <SectionViewer key={section.key} section={section} />
      ))}
    </div>
  );
}
