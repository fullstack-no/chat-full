import { Route, Routes } from "react-router-dom";
import { Login } from "./Login/Login";
import { Register } from "./Register/Register";
import { Home } from "./Home/Home";
import { PrivateRoute } from "./PrivateRoute";
import { useContext } from "react";
import { authContext } from "../contexts/auth.context";
import { Text } from "@chakra-ui/react";

export const Views = () => {
  const { user } = useContext(authContext);
  return user.login === undefined ? (
    <Text>Loading...</Text>
  ) : (
    <Routes>
      <Route path="/" Component={Login} />
      <Route path="/register" Component={Register} />
      <Route element={<PrivateRoute />}>
        <Route path="/home" Component={Home} />
      </Route>
    </Routes>
  );
};
