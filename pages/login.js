import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormHelperText,
  FormErrorMessage,
  FormErrorIcon,
} from '@chakra-ui/react';
import Layout from '../components/Layout/Layout';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Form from '../components/Form/Form';
import NextLink from 'next/link';
import { useFormErrorStyles } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

function LoginScreen() {
  const router = useRouter();
  const { state, dispatch } = React.useContext(Store);
  const { userInfo } = state;

  // redirect if user logged in already
  React.useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, [router, userInfo]);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push('/');
      toast.success(`Welcome back ${data.firstName}`);
    } catch (err) {
      toast(err.message, {
        type: 'error',
      });
    }
  };

  return (
    <Layout>
      <Form
        // border={'thin solid red'}
        onSubmit={handleSubmit(submitHandler)}
        noValidate
      >
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading align="center" fontSize={'4xl'}>
                Sign in to your account
              </Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                to enjoy all of our cool{' '}
                <Link color={'blue.400'}>features</Link> ✌️
              </Text>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}
            >
              <Stack spacing={4}>
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
                        <Input type="password" />
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

                <Stack spacing={10}>
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}
                  >
                    <Checkbox>Remember me</Checkbox>
                    <Link color={'blue.400'}>Forgot password?</Link>
                  </Stack>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    Not a user?{' '}
                    <NextLink href="/register" passHref>
                      <Link color={'blue.400'}>Register</Link>
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

// import Layout from '../components/Layout/Layout';
// import React from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import Form from '../components/Form/Form';
// import {
//   Button,
//   Heading,
//   List,
//   Link,
//   ListItem,
//   Input,
//   Text,
// } from '@chakra-ui/react';
// import NextLink from 'next/link';

// export default function LoginScreen() {
//   // const {
//   //   handleSubmit,
//   //   control,
//   //   formState: { errors },
//   // } = useForm();

//   const submitHandler = async (email, password) => {};
//   return (
//     <Layout>
//       <Form border={'thin solid red'} onSubmit={handleSubmit(submitHandler)}>
//         <Heading align="center">Login</Heading>
//         <List>
//           <ListItem>
//             <Controller
//               name="email"
//               control={control}
//               defaultValue=""
//               rules={{
//                 required: true,
//                 pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
//               }}
//               render={({ field }) => (
//                 // <Text
//                 //   variant="outline"
//                 //   fullWidth
//                 //   id="email"
//                 //   label="Email"
//                 //   inputProps={{ type: 'email' }}
//                 //   error={Boolean(errors.email)}
//                 //   helperText={
//                 //     errors.email
//                 //       ? errors.email.type === 'pattern'
//                 //         ? 'Email is not valid'
//                 //         : 'Email is required'
//                 //       : ''
//                 //   }
//                 //   {...field}
//                 // ></Text>
//               )}
//             ></Controller>
//           </ListItem>

//           <ListItem>
//             <Controller
//               name="password"
//               control={control}
//               defaultValue=""
//               rules={{
//                 required: true,
//                 minLength: 6,
//               }}
//               render={({ field }) => {
//                 <Text
//                   variant="outline"
//                   fullWidth
//                   id="password"
//                   label="Password"
//                   inputProps={{ type: 'password' }}
//                   error={Boolean(errors.password)}
//                   helperText={
//                     errors.password
//                       ? errors.password.type === 'minLength'
//                         ? 'Password length should be more than 5'
//                         : 'Password is required'
//                       : ''
//                   }
//                   {...field}
//                 ></Text>;
//               }}
//             ></Controller>
//           </ListItem>
//           <ListItem>
//             <Button type="submit">Login</Button>
//           </ListItem>
//           <ListItem>
//             Dont have an acc?
//             <NextLink href={'/signup'} passHref>
//               <Link>Register</Link>
//             </NextLink>
//           </ListItem>
//         </List>
//       </Form>
//     </Layout>
//   );
// }

export default dynamic(() => Promise.resolve(LoginScreen), { ssr: false });
