import React from 'react';
import CheckoutWizard from '../components/checkoutWizard/CheckoutWizard.js';
import Form from '../components/Form/Form.js';
import Layout from '../components/Layout/Layout.js';
import { useForm, Controller } from 'react-hook-form';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useRouter } from 'next/router.js';
import { Store } from '../utils/Store.js';
import dynamic from 'next/dynamic.js';
import Cookies from 'js-cookie';
import FullPageLoader from '../components/fullPageLoader/FullPageLoader.js';

function ShippingScreen() {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const router = useRouter();
  const { state, dispatch } = React.useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [loading, setLoading] = React.useState(true);

  // React.useEffect(() => {
  //   // if (Cookies.get('userInfo')) {
  //   //   setLoading(false);
  //   // }
  //   setLoading(false);
  // }, []);

  React.useEffect(() => {
    setLoading(false);

    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }

    setValue('firstName', shippingAddress.firstName);
    setValue('lastName', shippingAddress.lastName);
    setValue('email', shippingAddress.email);
    setValue('country', shippingAddress.country);
    setValue('state', shippingAddress.state);
    setValue('city', shippingAddress.city);
    setValue('zip', shippingAddress.zip);
    setValue('address', shippingAddress.address);
  }, [router, setValue, shippingAddress, userInfo]);

  const boxBgColor = useColorModeValue('white', 'gray.700');
  const flexBgColor = useColorModeValue('gray.50', 'gray.800');

  const submitHandler = (
    e,
    { firstName, lastName, email, country, state, city, zip, address }
  ) => {
    const details = {
      firstName,
      lastName,
      email,
      country,
      state,
      city,
      zip,
      address,
    };
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: details,
    });

    Cookies.set('shippingAddress', JSON.stringify(details));
    router.push('/payment');
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    userInfo && (
      <Layout>
        <CheckoutWizard activeStep={1}></CheckoutWizard>
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
                            <FormLabel htmlFor="firstName">
                              First Name
                            </FormLabel>
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

                  <Stack direction={['column', 'row']}>
                    <Box>
                      <Controller
                        name="country"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <FormControl
                            variant="floating"
                            id="country"
                            isRequired
                            isInvalid={errors.country}
                            {...field}
                          >
                            <FormLabel htmlFor="country">Country</FormLabel>
                            <Input {...register('country')} type="text" />
                            <FormErrorMessage>
                              {errors.country &&
                                (errors.country.type == 'minLength'
                                  ? 'Country should be atleast 2 characters'
                                  : 'Country is required')}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      ></Controller>
                    </Box>

                    <Box>
                      <Controller
                        name="State"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <FormControl
                            id="state"
                            isRequired
                            isInvalid={errors.state}
                            {...field}
                          >
                            <FormLabel htmlFor="state">State</FormLabel>
                            <Input {...register('state')} type="text" />
                            <FormErrorMessage>
                              {errors.state &&
                                (errors.state.type == 'minLength'
                                  ? 'State should be atleast 2 characters'
                                  : 'State is required')}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      ></Controller>
                    </Box>
                  </Stack>

                  <Stack direction={['column', 'row']}>
                    <Box>
                      <Controller
                        name="city"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <FormControl
                            variant="floating"
                            id="city"
                            isRequired
                            isInvalid={errors.city}
                            {...field}
                          >
                            <FormLabel htmlFor="city">City</FormLabel>
                            <Input {...register('city')} type="text" />
                            <FormErrorMessage>
                              {errors.city &&
                                (errors.city.type == 'minLength'
                                  ? 'City should be atleast 2 characters'
                                  : 'City is required')}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      ></Controller>
                    </Box>

                    <Box>
                      <Controller
                        name="Zip"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <FormControl
                            id="zip"
                            isRequired
                            isInvalid={errors.zip}
                            {...field}
                          >
                            <FormLabel htmlFor="zip">Zip</FormLabel>
                            <Input {...register('zip')} type="text" />
                            <FormErrorMessage>
                              {errors.zip &&
                                (errors.zip.type == 'minLength'
                                  ? 'Zip should be atleast 2 characters'
                                  : 'Zip is required')}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      ></Controller>
                    </Box>
                  </Stack>

                  <Box>
                    <Controller
                      name="Address"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 4,
                      }}
                      render={({ field }) => (
                        <FormControl
                          id="address"
                          isInvalid={errors.address}
                          isRequired
                          {...field}
                        >
                          <FormLabel htmlFor="address">Address</FormLabel>
                          <Input {...register('address')} type="address" />
                          {/* <FormHelperText>Helper Text</FormHelperText> */}
                          {/* <FormError /> */}
                          {/* <FormErrorIcon /> */}
                          <FormErrorMessage>
                            {errors.address &&
                            errors.address.type == 'minLength'
                              ? 'Invalid Address'
                              : 'Address is required'}
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
                      Continue
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Flex>
        </Form>
      </Layout>
    )
  );
}

export default dynamic(Promise.resolve(ShippingScreen), { ssr: false });
