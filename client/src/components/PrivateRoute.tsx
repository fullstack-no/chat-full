import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authContext } from "../contexts/auth.context";

export const PrivateRoute = () => {
  const { user } = useContext(authContext);

  const isAuth = user.login;

  return isAuth ? <Outlet /> : <Navigate to="/" />;
};
