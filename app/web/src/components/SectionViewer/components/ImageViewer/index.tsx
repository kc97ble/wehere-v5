import Image from "next/image";
import { SectionUnion } from "web/typing/common";
import styles from "./index.module.scss";

type Props = {
  value: Extract<SectionUnion, { type: "IMG1" }>;
};

export default function ImageViewer({ value }: Props) {
  // Early return if no URL is provided
  if (!value.url) {
    return <div className={styles.placeholder}>No image available</div>;
  }

  // No longer using aspect ratio - removing unused variable

  const maxWidth = value.maxWidth ? `${value.maxWidth}px` : "100%";

  // Don't render if we don't have intrinsic dimensions
  if (!value.intrinsicWidth || !value.intrinsicHeight) {
    return <div className={styles.placeholder}>Image dimensions not available</div>;
  }

  return (
    <div className={styles.container} style={{ maxWidth }}>
      <Image
        src={value.url}
        alt="Section image"
        width={value.intrinsicWidth}
        height={value.intrinsicHeight}
        className={styles.image}
        sizes="(max-width: 560px) 100vw, 560px"
        priority={false}
      />
    </div>
  );
}
