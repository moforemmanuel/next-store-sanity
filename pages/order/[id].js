import dynamic from 'next/dynamic';
import React from 'react';
import FullPageLoader from '../../components/fullPageLoader/FullPageLoader';
import Layout from '../../components/Layout/Layout';
import {
  Box,
  Button,
  chakra,
  CircularProgress,
  Flex,
  GridItem,
  Heading,
  HStack,
  Link,
  shouldForwardProp,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import NextImage from 'next/image';
import { Store } from '../../utils/Store';
import getError from '../../utils/error';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }

    case 'FETCH_SUCCESS': {
      return { ...state, loading: false, order: action.payload, error: '' };
    }

    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }

    case 'PAY_REQUEST': {
      return { ...state, loadingPay: true };
    }

    case 'PAY_SUCCESS': {
      return { ...state, loadingPay: false, successPay: true };
    }

    case 'PAY_FAIL': {
      return { ...state, loadingPay: false, errorPay: action.payload };
    }

    case 'PAY_RESET': {
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    }
  }
}
function OrderScreen({ params }) {
  const router = useRouter();
  const { state } = React.useContext(Store);
  const { userInfo } = state;
  const { id: orderId } = params;
  // const [loading, setLoading] = React.useState(true);
  // React.useEffect(() => {
  //   setLoading(false);
  // }, []);

  const [{ loading, error, order, successPay }, dispatch] = React.useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
      successPay: false,
    }
  );

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  React.useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    async function fetchOrder() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        toast.error(error);
      }
    }

    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });

        paypalDispatch({
          type: 'setLoadingStatus',
          value: 'pending',
        });
      };

      loadPaypalScript();
    }
  }, [router, userInfo, orderId, error, order, paypalDispatch, successPay]);

  const ProductImage = chakra(NextImage, {
    baseStyle: {
      maxH: 420,
      maxW: 420,
      borderWidth: '1px',
      borderColor: 'red.500',
      borderStyle: 'solid',
      marginBottom: '1rem',
    },
    shouldForwardProp: (prop) =>
      ['width', 'height', 'src', 'alt'].includes(prop),
  });

  const CustomPayPalButtons = chakra(PayPalButtons, {
    shouldForwardProp: (prop) =>
      [onApprove, onError, createOrder].includes(prop),
  });

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      })
      .catch((err) => {
        toast.error(getError(err));
      });
  }

  function onApprove(data, actions) {
    actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success(`Order ${order._id} paid`);
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  if (loading) {
    return <FullPageLoader />;
  }
  return (
    <Layout>
      <Heading>Order {orderId}</Heading>
      <SimpleGrid spacing={1} columns={3}>
        <GridItem
          gap={3}
          colSpan={[3, 2]}
          // border={'thin solid blue'}
        >
          <Flex
            bg="gray.50"
            direction="column"
            align="center"
            justify="center"
            gap={2}
            shadow="2xl"
            p={1}
          >
            <Box rounded="md" bg="white" shadow="base" w="100%" p={5}>
              <VStack>
                <Box>
                  <Heading as="h2" variant="h2">
                    Shipping Address
                  </Heading>
                </Box>

                <Box>
                  <Box>
                    {shippingAddress.firstName},{shippingAddress.lastName}
                  </Box>
                  {shippingAddress.address}, {shippingAddress.city},
                  {shippingAddress.state},{shippingAddress.country},
                  {shippingAddress.zip}
                </Box>

                <Box>
                  <Heading as="h2" variant="h2">
                    Status{' '}
                  </Heading>
                  {isDelivered
                    ? `Delivered at ${deliveredAt}`
                    : 'Not Delivered'}
                </Box>
              </VStack>
            </Box>

            <Box rounded="md" bg="white" shadow="base" w="100%" p={5}>
              <VStack>
                <Box>
                  <Heading as="h2" variant="h2">
                    Payment Method
                  </Heading>
                </Box>

                <Box>{paymentMethod}</Box>

                <Box>
                  <Heading as="h2" variant="h2">
                    Status{' '}
                  </Heading>
                  {isPaid ? `Paid at ${paidAt}` : 'NotPaid'}
                </Box>
              </VStack>
            </Box>

            <Box rounded="md" bg="white" shadow="base" w="100%" py={5}>
              <VStack>
                <Box>
                  <Heading as="h2" variant="h2">
                    Order Items
                  </Heading>
                </Box>

                <Box>
                  <TableContainer>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Image</Th>
                          <Th>Name</Th>
                          <Th>Quantity</Th>
                          <Th>Price</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {orderItems.map((item) => (
                          <Tr key={item._key}>
                            <Td>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Box>
                                    <ProductImage
                                      width={50}
                                      height={50}
                                      w="auto"
                                      h="auto"
                                      src={item.image}
                                      alt={item.name}
                                    />
                                  </Box>
                                </Link>
                              </NextLink>
                            </Td>
                            <Td>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Text>{item.name}</Text>
                                </Link>
                              </NextLink>
                            </Td>
                            <Td>
                              <Text>{item.quantity}</Text>
                            </Td>
                            <Td>
                              <Text>${item.price}</Text>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </VStack>
            </Box>
          </Flex>
        </GridItem>
        <GridItem bg="gray.50" colSpan={[3, 1]}>
          <Flex
            rounded="md"
            bg="white"
            shadow="base"
            w="100%"
            py={5}
            align="center"
            p={2}
            justify="center"
            direction="column"
          >
            <Box>
              <Heading align="center">Order Summary</Heading>
            </Box>
            <HStack>
              <Box>Items:</Box>
              <Box>
                <Text>${itemsPrice}</Text>
              </Box>
            </HStack>
            <HStack>
              <Box>Shipping:</Box>
              <Box>
                <Text>${shippingPrice}</Text>
              </Box>
            </HStack>
            <HStack>
              <Box>Tax:</Box>
              <Box>
                <Text>${taxPrice}</Text>
              </Box>
            </HStack>
            <HStack>
              <Box>Total:</Box>
              <Box>
                <Text>${totalPrice}</Text>
              </Box>
            </HStack>
            {!isPaid &&
              (isPending ? (
                <CircularProgress />
              ) : (
                <Box>
                  <PayPalButtons
                    // as={Button}
                    createOrder={createOrder}
                    onApprove={onApprove} //successful payment
                    onError={onError} //payment error
                    // isLoading={isPending}
                  ></PayPalButtons>
                </Box>
              ))}
          </Flex>
        </GridItem>
      </SimpleGrid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false });
