import { Navigate, useLocation } from "react-router-dom";
import { useRedux } from "hooks/useRedux";

export const PrivateRoute = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { account } = useRedux("account");
  const { binanceAccount } = useRedux("binanceAccount");
  const { auth } = binanceAccount;
  const { isAuthenticated } = account;
  const location = useLocation();

  return isAuthenticated || auth ? (
    children
  ) : (
    <Navigate
      to={{
        pathname: "/",
        search: location.search,
      }}
    />
  );
};
