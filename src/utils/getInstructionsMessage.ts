import { AuthType } from "types/types.d";

export const getInstructionsMessage = (type: AuthType) => {
  switch (type) {
    case AuthType.ALBEDO:
      return "Review the transaction on the Albedo popup.";
    case AuthType.LEDGER:
      return "Review the transaction on your Ledger wallet device.";
    case AuthType.FREIGHTER:
      return "Review the transaction on the Freighter popup.";
    case AuthType.TREZOR:
      return "Follow the instructions on the Trezor popup.";
    default:
      return "Follow the instructions in the popup.";
  }
};
