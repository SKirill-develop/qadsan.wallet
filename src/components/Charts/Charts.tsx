import { Loader } from "@stellar/design-system";
import { ChartsCore } from './ChartsCore';
import { useRedux } from "hooks/useRedux";
import Grid from '@mui/material/Grid';
import { knownTokens } from "../../utils/knownTokens";
import style from "./Charts.module.css";

export const Charts = () => {

  const { priceAllTokens } = useRedux("priceAllTokens");
  const { prices } = useRedux("prices");

  const findQadsanTokenAggregate = (token: string) => {
    if (prices.status === 'SUCCESS') {
      const Token = prices.Tokens.find(
        (item: { code: string }) => item.code === token);
      if (Token) {
        return (
          Token.aggregate[1].counter_volume * prices.QADSAN.price
        ).toLocaleString('en-US');
      }
    }
    return 0;
  };

  const filterData = (token: any) => {
    const newArray: any = [];
    priceAllTokens.data[token].forEach(
      (item: { cdate: string }) => newArray.push(item.cdate.split(' ')[0]));
    return newArray;
  };

  const filterPrice = (token: any) => {
    const newArray: any = [];
    priceAllTokens.data[token].forEach(
      (item: { price_qadsan: string }) => newArray.push(item.price_qadsan));
    return newArray;
  };

  const checkAssetInfo = (asset: string) => {
    const check = knownTokens.find((item) => item.name === asset);
    if (check) {
      return check.iconLink;
    }
    return '';
  };
  const getLastPrice = (token: string) =>
    priceAllTokens
      .data[token][priceAllTokens.data[token].length - 1]
      .price_qadsan;

  const allTokens = ['ELGOOG', 'LAPYAP', 'EKIN', 'TFOSORCIM', 'ISPEP', 'ASIV', 'MARGELET'];
  const hightTokens = ['KOOBECAF', 'ELPPA', 'ALSET'];

  return (
    <>
      <Grid container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12 }}>
        {allTokens.map(item => (
          <Grid item xs={2} sm={4} md={4} key={item}>
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <div>
                <h6>{item}</h6>
                <div>{getLastPrice(item)} QADSAN</div>
                <div className={style.charts__info__vol}>
                  {prices.status === "SUCCESS" ?
                    <span>
                      vol. ${findQadsanTokenAggregate(item)}
                    </span>
                    :
                    <Loader />
                  }
                </div>
              </div>
              <div>
                <img
                  className="img"
                  src={checkAssetInfo(item)}
                  alt={item}
                />
              </div>
            </Grid>
            <ChartsCore data={filterData(item)} values={filterPrice(item)} />
          </Grid>
        ))}
      </Grid >
      <Grid container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12 }}>
        {hightTokens.map(item => (
          <Grid item xs={2} sm={4} md={4} key={item}>
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <div>
                <h6>{item}</h6>
                <div>{getLastPrice(item)} QADSAN</div>
                <div className={style.charts__info__vol}>
                  {prices.status === "SUCCESS" ?
                    <span>
                      vol. ${findQadsanTokenAggregate(item)}
                    </span>
                    :
                    <Loader />
                  }
                </div>
              </div>
              <div>
                <img
                  className="img"
                  src={checkAssetInfo(item)}
                  alt={item}
                />
              </div>
            </Grid>
            <ChartsCore data={filterData(item)} values={filterPrice(item)} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
