import headerStyles from "./HeaderLogo.module.css";
import Logo from "./logo.svg";

const HeaderLogo = () => (
  <header>
    <img src={Logo} alt="Logo" className={headerStyles.logo} />
  </header>
);

export default HeaderLogo;
