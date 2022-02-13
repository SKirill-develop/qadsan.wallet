import headerStyles from "./HeaderLogo.module.css";
import Logo from "./MainLogos.png";

export const HeaderLogo = () => (
    <img src={Logo} alt="Logo" className={headerStyles.logo} />
);
