import { createContext, useState } from "react";

type Friend = {
  userid: any;
  username: string;
  connected: boolean;
};

type FriendsContextProps = {
  friends: Friend[];
  setFriends: any;
};
type FriendsProviderProps = {
  children: React.ReactNode;
};

export const friendsContext = createContext({} as FriendsContextProps);

export const FriendsProvider = ({ children }: FriendsProviderProps) => {
  const [friends, setFriends] = useState([] as Friend[]);

  return (
    <friendsContext.Provider
      value={{
        friends,
        setFriends,
      }}
    >
      {children}
    </friendsContext.Provider>
  );
};
