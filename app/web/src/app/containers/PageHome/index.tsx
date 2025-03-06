import NavBar from "../../components/NavBar";
import SectionHeroLarge from "./components/SectionHeroLarge";
import styles from "./index.module.scss";

export const PageHome = () => {
  return (
    <div className={styles.container}>
      <NavBar zIndex={100} />
      <SectionHeroLarge />
      {/* <ul>
        {Array.from(Array(100), (_, index) => (
          <li key={index}>{index}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default PageHome;
