import { Layout, TextLink, Icon } from "@stellar/design-system";
import { footerLinks } from "../../utils/FooterLinks";
import styles from "./Footer.module.scss";

export const Footer = () => {

  const important = footerLinks.filter(link => link.type === 'important');
  const base = footerLinks.filter(link => link.type === 'base');
  const about = footerLinks.filter(link => link.type === 'about');


  return (
    <footer className={styles.footer}>
      <Layout.Inset>
        <div className={styles.footer__contain}>
          <div className={styles.footer__list}>
            <h5 className={styles.footer__list__title}>IMPORTANT</h5>
            <ul className={styles.footer__list__container}>
              {important.map(link =>
                <li key={link.id} className={styles.footer__list__item}>
                  <TextLink
                    href={link.link}
                    variant={TextLink.variant.secondary}>
                    {link.name}
                  </TextLink>
                </li>,
              )}
            </ul>
          </div>
          <div className={styles.footer__list}>
            <h5 className={styles.footer__list__title}>KNOWLEDGE BASE</h5>
            <ul className={styles.footer__list__container}>
              {base.map(link =>
                <li key={link.id} className={styles.footer__list__item}>
                  <TextLink
                    href={link.link}
                    variant={TextLink.variant.secondary}
                  >
                    {link.name}
                  </TextLink>
                </li>,
              )}
            </ul>
          </div>
          <div className={styles.footer__list}>
            <h5 className={styles.footer__list__title}>ABOUT</h5>
            <ul className={styles.footer__list__container}>
              {about.map(link =>
                <li key={link.id} className={styles.footer__list__item}>
                  <TextLink
                    href={link.link}
                    variant={TextLink.variant.secondary}
                  >
                    {link.name}
                  </TextLink>
                </li>,
              )}
            </ul>
          </div>
        </div>
      </Layout.Inset>

      <Layout.Inset>
        <div className={styles.footer__company}>
          <TextLink href="https://qadsan.com/wp-content/uploads/2021/07/NEHOC.pdf">
            NEHOC ONLINE BUSINESS GROUP SOCIEDAD DE RESPONSABILIDAD LIMITADA
          </TextLink>
          <p>
            Certificate of registration #3102810771 Costa Rica,
            Guanacaste-Bagaces
          </p>
        </div>
      </Layout.Inset>
      <Layout.Inset>
        <div className={styles.icons}>
          <div className={styles.icons__item}>
            <TextLink
              href="https://t.me/qadsandx"
              variant={TextLink.variant.secondary}
            >
              <Icon.Send />
            </TextLink>
          </div>
          <div className={styles.icons__item}>
            <TextLink
              href="https://github.com/SKirill-develop/qadsan.wallet"
              variant={TextLink.variant.secondary}
            >
              <Icon.Github />
            </TextLink>
          </div>
        </div>
      </Layout.Inset>
    </footer>
  );
};
