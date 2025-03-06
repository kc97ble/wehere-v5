import SectionFooter from "./components/SectionFooter";
import SectionHeroLarge from "./components/SectionHeroLarge";
import styles from "./index.module.scss";

export const PageHome = () => {
  return (
    <div className={styles.container}>
      <SectionHeroLarge />
      <SectionFooter />
    </div>
  );
};

export default PageHome;
