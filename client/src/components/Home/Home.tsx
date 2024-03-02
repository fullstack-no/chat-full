import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { Chat } from "./Chat";
import { Sidebar } from "./Sidebar";
import { FriendsProvider } from "../../contexts/friends.context";
import { useSocketSetup } from "../../hooks/useSocketSetup";
import { createContext, useContext, useState } from "react";

type MessagesContextProps = {
  messages: any[];
  setMessages: any;
};

export const messagesContext = createContext({} as MessagesContextProps);

export const Home = () => {
  const [messages, setMessages] = useState([] as string[]);
  const [friendIndex, setFriendIndex] = useState(0);

  useSocketSetup(setMessages);

  return (
    <FriendsProvider>
      <Grid
        templateColumns={"repeat(10, 1fr)"}
        height="100vh"
        as={Tabs}
        onChange={(index) => setFriendIndex(index as any)}
      >
        <GridItem colSpan={3} borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan={7} maxH={"100vh"}>
          <messagesContext.Provider value={{ messages, setMessages }}>
            <Chat friendIndex={friendIndex} />
          </messagesContext.Provider>
        </GridItem>
      </Grid>
    </FriendsProvider>
  );
};
