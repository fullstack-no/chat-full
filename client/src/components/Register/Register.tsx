import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { authContext } from "../../contexts/auth.context";

export const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(authContext);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().min(3).max(20).required(),
      password: Yup.string().min(3).max(20).required(),
    }),

    onSubmit(values, formikHelpers) {
      console.log(values);

      formikHelpers.resetForm();

      fetch(`${process.env.REACT_APP_SERVER_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log("data", data);
          setUser(data);
          navigate("/home");
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  });
  return (
    <VStack
      as="form"
      w={{ base: "90%", md: "500px" }}
      m="auto"
      justify="center"
      h="100vh"
      spacing="1rem"
      onSubmit={formik.handleSubmit as any}
    >
      <Heading>Register</Heading>
      {error && (
        <Alert status="error" justifyContent="center">
          <AlertIcon />
          {error}
        </Alert>
      )}
      <FormControl
        isInvalid={Boolean(formik.touched.username && formik.errors.username)}
      >
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          name="username"
          placeholder="Enter Username"
          autoComplete="off"
          size="lg"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={Boolean(formik.touched.password && formik.errors.password)}
      >
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          name="password"
          placeholder="Enter Password"
          autoComplete="off"
          size="lg"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
      </FormControl>

      <ButtonGroup>
        <Button colorScheme="teal" type="submit">
          Register
        </Button>
        <Button onClick={() => navigate("/login")}>Log In</Button>
      </ButtonGroup>
    </VStack>
  );
};
