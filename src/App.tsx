import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Layout } from "@stellar/design-system";

import { store } from "config/store";
import { Network } from "components/Network";
import { PrivateRoute } from "components/PrivateRoute";
import { Header } from "components/Header/Header";
import { Footer } from "components/Footer/Footer";

import { Dashboard } from "pages/Stellar/Dashboard/Dashboard";
import { BuySellPage } from "pages/Stellar/BuySellPage/BuySellPage";
import { BuySellBinancePage } from "pages/Binance/BuySellBinancePage/BuySellBinancePage";
import { Landing } from "pages/Landing/Landing";

import { BinanceDashboard } from "pages/Binance/Dashboard/BinanceDashboard";
import { NotFound } from "pages/NotFound";

import "styles.scss";

export const App = () => (
  <Provider store={store}>
    <Router>
      <Network>
        <Header />
        <Layout.Content>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/stellar/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/stellar/buy-sell"
              element={
                <PrivateRoute>
                  <BuySellPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/binance/buy-sell"
              element={
                <PrivateRoute>
                  <BuySellBinancePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/binance/dashboard"
              element={
                <PrivateRoute>
                  <BinanceDashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout.Content>
        <Footer />
      </Network>
    </Router>
  </Provider>
);
