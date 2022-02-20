import { DetailsTooltip } from "@stellar/design-system";
import styles from"./WalletButton.module.scss";

interface WalletButtonProps {
  imageSvg: React.ReactNode;
  infoText: string | React.ReactNode;
  onClick: () => void;
  children: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  imageSvg,
  infoText,
  onClick,
  children,
  ...props
}) => (
  <div className="WalletButton">
    <DetailsTooltip details={infoText}>
      <button className={styles.WalletButton__button} 
        onClick={onClick} {...props}>
        {imageSvg}
        <span className={styles.WalletButton__label}>{children}</span>
      </button>
    </DetailsTooltip>
  </div>
);
