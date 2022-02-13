import headerStyles from "./HeaderLogo.module.css";
import Logo from "./MainLogos.png";

export const HeaderLogo = () => (
    <a href="/"><img src={Logo} alt="Logo" className={headerStyles.logo} /></a>
);
