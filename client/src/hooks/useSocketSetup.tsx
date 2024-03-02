import { useContext, useEffect } from "react";
import { socket } from "../socket";
import { authContext } from "../contexts/auth.context";
import { friendsContext } from "../contexts/friends.context";

export const useSocketSetup = (setMessages: any) => {
  const { setUser } = useContext(authContext);

  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      setUser({ login: false });
    });
    socket.on("messages", (messages) => {
      setMessages(messages);
    });
    socket.on("dm", (message) => {
      console.log(message);

      setMessages((prev: any[]) => {
        console.log("prev: ", prev);

        return [message, ...prev];
      });
    });

    socket.emit("messages");

    return () => {
      socket.off("connect_error");
      socket.off("messages");
      socket.off("dm");
    };
  }, [setUser]);
};
