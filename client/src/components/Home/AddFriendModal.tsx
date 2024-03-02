import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { socket } from "../../socket";
import { friendsContext } from "../../contexts/friends.context";

type AddFriendModalProps = {
  isOpen: boolean;
  onClose: any;
};

export const AddFriendModal = ({ isOpen, onClose }: AddFriendModalProps) => {
  const [error, setError] = useState("");
  const { setFriends } = useContext(friendsContext);

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().min(3).max(28).required(),
    }),
    onSubmit: (values) => {
      socket.emit(
        "add_friend",
        values.name,
        ({ done, errorMsg, friend }: any) => {
          if (done) {
            setFriends((value: any) => [...value, friend]);
            setError("");
            onClose();
            return;
          }
          setError(errorMsg);
        }
      );
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a Friend</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Heading size="lg" color="red.500" textAlign="center">
              {error}
            </Heading>
            <FormControl>
              <FormLabel>Friend's name</FormLabel>
              <Input
                placeholder="Enter friend's name"
                autoComplete="off"
                {...formik.getFieldProps("name")}
              />
              <Text color="red.500">
                {Boolean(formik.submitCount) && formik.errors.name}
              </Text>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" type="submit">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
