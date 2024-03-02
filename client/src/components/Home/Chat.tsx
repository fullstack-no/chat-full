import { TabPanel, TabPanels, Text, VStack } from "@chakra-ui/react";
import { ReactNode, useContext, useEffect, useRef } from "react";
import { friendsContext } from "../../contexts/friends.context";
import { messagesContext } from "./Home";
import { ChatBox } from "./ChatBox";

type ChatProps = {
  friendIndex: number;
};

export const Chat = ({ friendIndex }: ChatProps) => {
  const { friends, setFriends } = useContext(friendsContext);
  const { messages } = useContext(messagesContext);
  const scrollRef = useRef(null as unknown as HTMLDivElement);

  const userid = friends[friendIndex]?.userid;

  useEffect(() => {
    console.log("scroll");

    scrollRef.current?.scrollIntoView();
  });

  return friends.length ? (
    <VStack h="100%" justify="end">
      <TabPanels overflowY="auto">
        {friends.map((friend, idx) => (
          <VStack as={TabPanel} key={idx} flexDirection={"column-reverse"}>
            <div ref={scrollRef} />
            {messages
              .filter(
                (message: any) =>
                  message.to === friend.userid || message.from === friend.userid
              )
              .map((msg, idx) => (
                <Text
                  key={idx}
                  fontSize={"lg"}
                  borderRadius={"0.6rem"}
                  bg={msg.from === friend.userid ? "blue.100" : "gray.100"}
                  color={"gray.900"}
                  py={1}
                  px={3}
                  alignSelf={
                    msg.from === friend.userid ? "flex-start" : "flex-end"
                  }
                  maxW={"45%"}
                  minH={"27px"}
                  boxSizing="content-box"
                >
                  {msg.content}
                </Text>
              ))}
          </VStack>
        ))}
      </TabPanels>
      <ChatBox userid={userid} />
    </VStack>
  ) : (
    <VStack pt={5} textAlign="center">
      <TabPanels>
        <Text>No Friend :( Click add friend to start chatting </Text>
      </TabPanels>
    </VStack>
  );
};
