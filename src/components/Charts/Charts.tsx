import { ChartsCore } from './ChartsCore';
import { useRedux } from "hooks/useRedux";
import Grid from '@mui/material/Grid';
import { knownTokens } from "../../utils/knownTokens";

export const Charts = () => {

  const { priceAllTokens } = useRedux("priceAllTokens");

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

  return (
    <>
      <Grid container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12 }}>
        <Grid item xs={2} sm={4} md={4}>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>ELGOOG</h6>
              <div>{getLastPrice('ELGOOG')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('ELGOOG')}
                alt='ELGOOG'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('ELGOOG')} values={filterPrice('ELGOOG')} />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>LAPYAP</h6>
              <div>{getLastPrice('LAPYAP')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('LAPYAP')}
                alt='LAPYAP'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('LAPYAP')} values={filterPrice('LAPYAP')} />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>EKIN</h6>
              <div>{getLastPrice('EKIN')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('EKIN')}
                alt='EKIN'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('EKIN')} values={filterPrice('EKIN')} />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>TFOSORCIM</h6>
              <div>{getLastPrice('TFOSORCIM')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('TFOSORCIM')}
                alt='TFOSORCIM'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('TFOSORCIM')} values={filterPrice('TFOSORCIM')} />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>TFOSORCIM</h6>
              <div>{getLastPrice('ISPEP')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('ISPEP')}
                alt='ISPEP'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('ISPEP')} values={filterPrice('ISPEP')} />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>ASIV</h6>
              <div>{getLastPrice('ISPEP')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('ASIV')}
                alt='ASIV'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('ASIV')} values={filterPrice('ASIV')} />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>MARGELET</h6>
              <div>{getLastPrice('ISPEP')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('MARGELET')}
                alt='MARGELET'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('MARGELET')} values={filterPrice('MARGELET')} />
        </Grid>
      </Grid>
      <Grid container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12 }}>
        <Grid item xs={2} sm={4} md={4}>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>KOOBECAF</h6>
              <div>{getLastPrice('KOOBECAF')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('KOOBECAF')}
                alt='KOOBECAF'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('KOOBECAF')} values={filterPrice('KOOBECAF')} />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>ELPPA</h6>
              <div>{getLastPrice('ELPPA')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('ELPPA')}
                alt='ELPPA'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('ELPPA')} values={filterPrice('ELPPA')} />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <div>
              <h6>ALSET</h6>
              <div>{getLastPrice('ALSET')} QADSAN</div>
            </div>
            <div>
              <img
                className="img"
                src={checkAssetInfo('ALSET')}
                alt='ALSET'
              />
            </div>
          </Grid>
          <ChartsCore data={filterData('ALSET')} values={filterPrice('ALSET')} />
        </Grid>
      </Grid>
    </>
  );
};
