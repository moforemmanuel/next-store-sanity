import { useRouter } from 'next/router';
import React from 'react';
import { Store } from '../utils/Store';
import { useForm, Controller } from 'react-hook-form';
import Layout from '../components/Layout/Layout';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import Form from '../components/Form/Form';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import axios from 'axios';
import getError from '../utils/error';
import Cookies from 'js-cookie';

function ProfileScreen() {
  const router = useRouter();
  const { state, dispatch } = React.useContext(Store);
  const { userInfo } = state;

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  React.useEffect(() => {
    if (!userInfo) {
      router.push(`/login?redirect=${router.route}`);
      return;
    }

    setValue('firstName', userInfo.firstName);
    setValue('lastName', userInfo.lastName);
    setValue('email', userInfo.email);
  }, [router, setValue, userInfo]);

  const boxBgColor = useColorModeValue('white', 'gray.700');
  const flexBgColor = useColorModeValue('gray.50', 'gray.800');

  async function submitHandler({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }) {
    if (password !== confirmPassword) {
      toast.error('Passwords dont match');
      return;
    }

    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      // update user in store
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getError(err));
    }
  }

  return (
    <Layout>
      <Heading>Profile</Heading>
      <Form onSubmit={handleSubmit(submitHandler)} noValidate>
        <Flex
          minH={'80vh'}
          align={'center'}
          justify={'center'}
          bg={flexBgColor}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'}>
                Shipping Address
              </Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                please enter your shipping details
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
                          <Input {...register('firstName')} type="text" />
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
                          <Input {...register('lastName')} type="text" />
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
                        <Input {...register('email')} type="email" />
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
                      validate: (value) =>
                        value === '' ||
                        value.length > 5 ||
                        'Password length must be atleast 6 chars',
                    }}
                    render={({ field }) => (
                      <FormControl
                        id="password"
                        isInvalid={errors.password}
                        {...field}
                      >
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input type="password" />
                        <FormErrorMessage>
                          {errors.password
                            ? 'Password but be atleast 6 characters long'
                            : ''}
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
                      validate: (value) =>
                        value === '' ||
                        value.length > 5 ||
                        'Password length must be atleast 6 chars',
                    }}
                    render={({ field }) => (
                      <FormControl
                        id="confirmPassword"
                        isInvalid={errors.password}
                        {...field}
                      >
                        <FormLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FormLabel>
                        <Input type="password" />
                        <FormErrorMessage>
                          {errors.password
                            ? 'Confirm Password but be atleast 6 characters long'
                            : ''}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  ></Controller>
                </Box>

                <Stack spacing={10} pt={2}>
                  <Button
                    isLoading={isSubmitting}
                    type="submit"
                    // onClick={() => alert('clicked')}
                    loadingText="Updating"
                    size="lg"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Update
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(ProfileScreen), { ssr: false });
