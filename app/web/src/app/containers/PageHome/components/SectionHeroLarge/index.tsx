import cx from "clsx";
import Image from "next/image";
import React from "react";
import pngCryingBaby57 from "./assets/crying-baby-57.png";
import styles from "./index.module.scss";

type RootProps = {
  className?: string;
  style?: React.CSSProperties;
};

function Root({ className, style }: RootProps) {
  return (
    <div className={cx(styles.Root, className)} style={style}>
      <div className={styles.col1}>
        <div className={styles.figureContainer}>
          <div className={styles.shadow0}></div>
          <div className={styles.shadow1}></div>
          <Image className={styles.figure} src={pngCryingBaby57} alt="" />
        </div>
      </div>
      <div className={styles.col0}>
        {/* TODO: use MF2 */}
        <h2 className={styles.title}>{"Chào mừng bạn đến với WeHere!"}</h2>
        <div className={styles.description}>
          {/* TODO: use MF2 */}
          {
            "WeHere là dự án tâm lý do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức, câu chuyện, sự kiện về sức khỏe tinh thần của người trẻ."
          }
        </div>
        <a className={styles.ctaButton} href="#">
          {/* TODO: use MF2 */}
          {/* TODO: fix href */}
          {"Chat với chúng tôi"}
        </a>
      </div>
    </div>
  );
}

const SectionHeroLarge = Root;

export default SectionHeroLarge;
