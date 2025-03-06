import NavBar from "../../components/NavBar";
import SectionFooter from "./components/SectionFooter";
import SectionHeroLarge from "./components/SectionHeroLarge";
import styles from "./index.module.scss";

export const PageHome = () => {
  return (
    <div className={styles.container}>
      <NavBar zIndex={100} />
      <SectionHeroLarge />
      <SectionFooter />
    </div>
  );
};

export default PageHome;
