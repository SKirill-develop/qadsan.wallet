import styles from "./HeaderLogo.module.css";
import Logo from "./MainLogos.png";

export const HeaderLogo = () => (
    <img src={Logo} alt="Logo" className={styles.logo} />
);
