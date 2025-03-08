import NavBar from "../../components/NavBar";
import styles from "./index.module.scss";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <NavBar zIndex={100} />
      {children}
    </div>
  );
}
