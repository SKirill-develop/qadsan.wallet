import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Layout } from "@stellar/design-system";

import { store } from "config/store";
import { Network } from "components/Network";
import { PrivateRoute } from "components/PrivateRoute";
import { Header } from "components/Header/Header";
import { Footer } from "components/Footer/Footer";

import { Dashboard } from "pages/Dashboard/Dashboard";
import { BuySellPage } from "pages/BuySellPage/BuySellPage";
import { Landing } from "pages/Landing/Landing";
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
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/buy-sell"
              element={
                <PrivateRoute>
                  <BuySellPage />
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
