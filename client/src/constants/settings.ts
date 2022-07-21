import StellarSdk from "stellar-sdk";

export const TX_HISTORY_LIMIT = 50;
export const TX_HISTORY_MIN_AMOUNT = 0.5;
export const RESET_STORE_ACTION_TYPE = "RESET";
export const FLAGGED_ACCOUNT_STORAGE_ID = "flaggedAcounts";
export const FLAGGED_ACCOUNT_DATE_STORAGE_ID = "flaggedAcountDate";
export const MEMO_REQ_ACCOUNT_STORAGE_ID = "memoRequiredAccounts";
export const MEMO_REQ_ACCOUNT_DATE_STORAGE_ID = "memoRequiredAccountsDate";
export const LOCAL_STORAGE_STELLAR_THEME = "stellarTheme:QadsanTheme";
export const NATIVE_ASSET_CODE = "XLM";
export const QADSAN_ASSET =
  "QADSAN:GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU";

export const CENTUS_ASSET =
  "CENTUS:GCBSY6IJHRG4APD7EYZSULW62U3G2YLIVB3ZEPUO5KYAI7HVEOYFIBRI";

export const CENTUSX_ASSET =
  "CENTUSX:GD7I4VIGF2LJEK6XKZDFLWRT6NFVIXN2CGLVSXEPNWJWTN4QRGX4226Z";

export const QADSAN_ASSET_IN_ARRAY = [
  "QADSAN",
  "GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU",
];
export const CENTUS_ASSET_IN_ARRAY = [
  "CENTUS",
  "GCBSY6IJHRG4APD7EYZSULW62U3G2YLIVB3ZEPUO5KYAI7HVEOYFIBRI",
];
export const CENTUSX_ASSET_IN_ARRAY = [
  "CENTUSX",
  "GD7I4VIGF2LJEK6XKZDFLWRT6NFVIXN2CGLVSXEPNWJWTN4QRGX4226Z",
];
export const WALLET_LOCKER =
  "GD4TAQ3V6KKWA6HGLGL7G7B7PYQI7YCEZMVGNLJ7IN4BSM65BHIVHLSX";

export const STELLAR_EXPERT_URL = "https://stellar.expert/explorer";

interface NetworkItemConfig {
  url: string;
  network: string;
  stellarExpertTxUrl: string;
  stellarExpertAccountUrl: string;
  stellarExpertAssetUrl: string;
  stellarExpertLiquidityPoolUrl: string;
}

interface NetworkConfig {
  url?: string;
  testnet: NetworkItemConfig;
  public: NetworkItemConfig;
}

export const networkConfig: NetworkConfig = {
  testnet: {
    url: "https://horizon-testnet.stellar.org",
    network: StellarSdk.Networks.TESTNET,
    stellarExpertTxUrl: `${STELLAR_EXPERT_URL}/testnet/tx/`,
    stellarExpertAccountUrl: `${STELLAR_EXPERT_URL}/testnet/account/`,
    stellarExpertAssetUrl: `${STELLAR_EXPERT_URL}/testnet/asset/`,
    stellarExpertLiquidityPoolUrl: `${STELLAR_EXPERT_URL}/testnet/liquidity-pool/`,
  },
  public: {
    url: "https://horizon.stellar.org",
    network: StellarSdk.Networks.PUBLIC,
    stellarExpertTxUrl: `${STELLAR_EXPERT_URL}/public/tx/`,
    stellarExpertAccountUrl: `${STELLAR_EXPERT_URL}/public/account/`,
    stellarExpertAssetUrl: `${STELLAR_EXPERT_URL}/public/asset/`,
    stellarExpertLiquidityPoolUrl: `${STELLAR_EXPERT_URL}/public/liquidity-pool/`,
  },
};

export const defaultStellarBipPath = "44'/148'/0'";
