import { Button, HStack, Input } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { socket } from "../../socket";
import { useContext } from "react";
import { messagesContext } from "./Home";

type ChatBoxProps = {
  userid: string;
};

export const ChatBox = ({ userid }: ChatBoxProps) => {
  const { setMessages } = useContext(messagesContext);

  const formik = useFormik({
    initialValues: { message: "" },
    onSubmit: (values, helpers) => {
      const message = {
        from: null,
        to: userid,
        content: values.message,
      };

      console.log(message);
      socket.emit("dm", message);
      setMessages((prev: any) => [message, ...prev]);

      helpers.resetForm();
    },
  });
  return (
    <HStack
      as="form"
      w="100%"
      onSubmit={formik.handleSubmit as any}
      pb={4}
      px={4}
    >
      <Input
        placeholder="type message here..."
        autoComplete="off"
        size={"lg"}
        {...formik.getFieldProps("message")}
      />
      <Button type="submit">Send</Button>
    </HStack>
  );
};
