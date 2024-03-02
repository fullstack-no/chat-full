import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthProviderProps = {
  children: React.ReactNode;
};
type User = {
  login?: boolean;
  id?: string | number;
  username?: string;
};
type AuthContext = {
  user: User;
  setUser: any;
};

export const authContext = createContext({} as AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState({} as User);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (!data) {
          return;
        }

        setUser(data);
        navigate("/home");
      })
      .catch((error) => {
        setUser({ login: false });
      });
  }, []);

  return (
    <authContext.Provider value={{ user, setUser }}>
      {children}
    </authContext.Provider>
  );
};
