import headerStyles from "./HeaderLogo.module.css";
import Logo from "./MainLogos.png";

const HeaderLogo = () => (
    <img src={Logo} alt="Logo" className={headerStyles.logo} />
);

export default HeaderLogo;
