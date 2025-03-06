import NavBar from "../../components/NavBar";
import SectionHeroLarge from "./components/SectionHeroLarge";
import styles from "./index.module.scss";

export const PageHome = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <SectionHeroLarge />
    </div>
  );
};

export default PageHome;
