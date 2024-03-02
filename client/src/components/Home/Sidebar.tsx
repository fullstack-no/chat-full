import { ChatIcon } from "@chakra-ui/icons";
import {
  Button,
  Circle,
  Divider,
  HStack,
  Heading,
  Tab,
  TabList,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { friendsContext } from "../../contexts/friends.context";
import { AddFriendModal } from "./AddFriendModal";
import { socket } from "../../socket";

export const Sidebar = () => {
  const { friends, setFriends } = useContext(friendsContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    socket.emit("friends", (friends: any) => {
      if (friends) setFriends(friends);
    });

    function listenConnected(connected: boolean, username: string) {
      setFriends((friends: any[]) =>
        friends.map((friend) => {
          if (friend.username === username) friend.connected = connected;
          return friend;
        })
      );
    }

    socket.on("connected", listenConnected);

    return () => {
      socket.off("connected", listenConnected);
    };
  }, []);

  return (
    <>
      <VStack>
        <HStack py={8} justify={"space-evenly"} w="100%">
          <Heading>Add Friend</Heading>
          <Button onClick={onOpen}>
            <ChatIcon />
          </Button>
        </HStack>

        <Divider />
        <VStack w="100%">
          <VStack as={TabList} minW="50%">
            {friends.map((friend, idx) => (
              <HStack as={Tab} key={idx}>
                <Circle
                  size="20px"
                  bg={`${friend.connected ? "green.700" : "red.500"}`}
                />
                <Text>{friend.username}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </VStack>

      <AddFriendModal onClose={onClose} isOpen={isOpen} />
    </>
  );
};
