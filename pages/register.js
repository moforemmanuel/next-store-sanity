import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  // HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import Form from '../components/Form/Form';
import NextLink from 'next/link';
import Layout from '../components/Layout/Layout';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
// import client from '../utils/sanityClient';
import getError from '../utils/error';
import FullPageLoader from '../components/fullPageLoader/FullPageLoader';

function RegisterScreen() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = React.useContext(Store);
  const { userInfo } = state;

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  // redirect if user logged in already
  React.useEffect(() => {
    if (userInfo) {
      router.push(redirect || '/');
    }
  }, [router, userInfo, redirect]);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const checkUser = async (email) => {
  //   // const {document} = context;
  //   const data = await client.fetch(
  //     `*[_type == "user" && email == $email][0]`,
  //     {
  //       email: email,
  //     }
  //   );

  //   console.log('data: ', data);
  //   return data ? true : false;
  // };

  const submitHandler = async ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }) => {
    if (password !== confirmPassword) {
      toast("Passwords don't match", {
        type: 'error',
      });
      return;
    }

    // const emailExists = await checkUser(email);
    // if (emailExists) {
    //   toast('A user with that email already exists', {
    //     type: 'error',
    //   });
    //   return;
    // }

    try {
      const { data } = await axios.post('/api/users/register', {
        firstName,
        lastName,
        email,
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
      toast.success(`Welcome aboard ${data.firstName}`);
    } catch (err) {
      toast(getError(err), {
        type: 'error',
      });
    }
  };

  const flexBgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <Layout>
      <Form onSubmit={handleSubmit(submitHandler)} noValidate>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={flexBgColor}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'}>
                Sign up
              </Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                to enjoy all of our cool features ✌️
              </Text>
            </Stack>
            <Box rounded={'lg'} bg={boxBgColor} boxShadow={'lg'} p={8}>
              <Stack spacing={4}>
                <Stack direction={['column', 'row']}>
                  <Box>
                    <Controller
                      name="firstName"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <FormControl
                          variant="floating"
                          id="firstName"
                          isRequired
                          isInvalid={errors.firstName}
                          {...field}
                        >
                          <FormLabel htmlFor="firstName">First Name</FormLabel>
                          <Input type="text" />
                          <FormErrorMessage>
                            {errors.firstName &&
                              (errors.firstName.type == 'minLength'
                                ? 'First Name should be atleast 2 characters'
                                : 'First Name is required')}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    ></Controller>
                  </Box>

                  <Box>
                    <Controller
                      name="lastName"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: false,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <FormControl
                          id="lastName"
                          isInvalid={errors.lastName}
                          {...field}
                        >
                          <FormLabel htmlFor="lastName">Last Name</FormLabel>
                          <Input type="text" />
                          <FormErrorMessage>
                            {errors.lastName &&
                              (errors.lastName.type == 'minLength'
                                ? 'Last Name should be atleast 2 characters'
                                : '')}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    ></Controller>
                  </Box>
                </Stack>

                <Box>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                      pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    }}
                    render={({ field }) => (
                      <FormControl
                        id="email"
                        isInvalid={errors.email}
                        isRequired
                        {...field}
                      >
                        <FormLabel htmlFor="email">Email address</FormLabel>
                        <Input type="email" />
                        {/* <FormHelperText>Helper Text</FormHelperText> */}
                        {/* <FormError /> */}
                        {/* <FormErrorIcon /> */}
                        <FormErrorMessage>
                          {errors.email && errors.email.type == 'pattern'
                            ? 'Invalid Email'
                            : 'Email is required'}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  ></Controller>
                </Box>

                <Box>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                      minLength: 6,
                    }}
                    render={({ field }) => (
                      <FormControl
                        id="password"
                        isInvalid={errors.password}
                        isRequired
                        {...field}
                      >
                        <FormLabel htmlFor="password">Password</FormLabel>
                        {/* <Input type="password" /> */}
                        <InputGroup>
                          <Input type={showPassword ? 'text' : 'password'} />
                          <InputRightElement h={'full'}>
                            <Button
                              variant={'ghost'}
                              onClick={() =>
                                setShowPassword((showPassword) => !showPassword)
                              }
                            >
                              {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>

                        <FormErrorMessage>
                          {errors.password &&
                          errors.password.type == 'minLength'
                            ? 'Password but be atleast 6 characters long'
                            : 'Password is required'}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  ></Controller>
                </Box>

                <Box>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                      minLength: 6,
                    }}
                    render={({ field }) => (
                      <FormControl
                        id="confirmPassword"
                        isInvalid={errors.confirmPassword}
                        isRequired
                        {...field}
                      >
                        <FormLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FormLabel>
                        {/* <Input type="password" /> */}
                        <InputGroup>
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                          />
                          <InputRightElement h={'full'}>
                            <Button
                              variant={'ghost'}
                              onClick={() =>
                                setShowConfirmPassword(
                                  (showConfirmPassword) => !showConfirmPassword
                                )
                              }
                            >
                              {showConfirmPassword ? (
                                <ViewIcon />
                              ) : (
                                <ViewOffIcon />
                              )}
                            </Button>
                          </InputRightElement>
                        </InputGroup>

                        <FormErrorMessage>
                          {errors.confirmPassword &&
                          errors.confirmPassword.type == 'minLength'
                            ? 'Confirmation Password must be atleast 6 characters long'
                            : 'Confirmation Password is required'}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  ></Controller>
                </Box>
                <Stack spacing={10} pt={2}>
                  <Button
                    isLoading={isSubmitting}
                    type="submit"
                    loadingText="Submitting"
                    size="lg"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Sign up
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    Already a user?{' '}
                    <NextLink
                      href={`/login?redirect=${redirect || '/'}`}
                      passHref
                    >
                      <Link color={'blue.400'}>Login</Link>
                    </NextLink>
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(RegisterScreen), { ssr: false });
