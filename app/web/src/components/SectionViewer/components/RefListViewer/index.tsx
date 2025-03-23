import clsx from "clsx";
import { MessageFormat } from "messageformat";
import React from "react";
import { SectionUnion } from "web/typing/common";
import styles from "./index.module.scss";

const vi = {
  text_retrieved_on: new MessageFormat("vi", `Truy cập ngày {$date}`),
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: SectionUnion & { type: "REFL" };
};

export default function RefListViewer({ className, style, value }: Props) {
  return (
    <div className={clsx(styles.container, className)} style={style}>
      {value.title && <h2 className={styles.refTitle}>{value.title}</h2>}
      <ul className={styles.refList}>
        {value.items.map((item, index) => {
          // Format reference in a standard academic style
          let citation = "";

          if (item.author) {
            citation += item.author;
            if (item.year) citation += ` (${item.year})`;
            citation += ". ";
          }

          if (item.title) {
            citation += `"${item.title}". `;
          }

          if (item.publisher) {
            citation += item.publisher + ". ";
          }

          if (item.retrievedOn) {
            citation += vi.text_retrieved_on.format({ date: item.retrievedOn });
          }
          
          if (item.others) {
            citation += " " + item.others;
          }

          return (
            <li key={index} className={styles.refItem}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {citation || item.url}
                </a>
              ) : (
                citation
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
