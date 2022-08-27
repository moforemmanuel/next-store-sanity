import React from 'react';
import Layout from '../components/Layout/Layout';
import FullPageLoader from '../components/fullPageLoader/FullPageLoader';
import CheckoutWizard from '../components/checkoutWizard/CheckoutWizard';
import {
  Box,
  Button,
  chakra,
  Flex,
  GridItem,
  Heading,
  HStack,
  Link,
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
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { toast } from 'react-toastify';
import getError from '../utils/error';
import axios from 'axios';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';

function PlaceOrderScreen() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [loadingOrder, setLoadingOrder] = React.useState(false);
  const { state, dispatch } = React.useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.456 = 123.46
  const itemsPrice = round2(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  React.useEffect(() => {
    setLoading(false);
    if (!paymentMethod) {
      router.push('/payment');
      toast.error('Please select a payment method');
    }

    if (cartItems.length == 0) {
      router.push('/cart');
    }
  }, [router, paymentMethod, cartItems]);

  const placeOrderHandler = async () => {
    try {
      setLoadingOrder(true);
      const response = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems.map((item) => ({
            ...item,
            countInStock: undefined,
            slug: undefined,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      const orderId = await response.data;
      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartItems');
      setLoadingOrder(false);
      toast.success(`order ${orderId} created`);

      router.push(`/order/${orderId}`);
    } catch (err) {
      setLoadingOrder(false);
      toast.error(getError(err));
    }
  };

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

  if (loading) {
    return <FullPageLoader />;
  }
  return (
    <Layout>
      <CheckoutWizard activeStep={3}></CheckoutWizard>

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
                  <Button onClick={() => router.push('/shipping')}>Edit</Button>
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
                  <Button onClick={() => router.push('/payment')}>Edit</Button>
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
                        {cartItems.map((item) => (
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
                <Box>
                  <Button onClick={() => router.push('/cart')}>Edit</Button>
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
              <Box>Total:</Box>
              <Box>
                <Text>${totalPrice}</Text>
              </Box>
            </HStack>
            <VStack>
              <Box>
                <Button isLoading={loadingOrder} onClick={placeOrderHandler}>
                  Place Order
                </Button>
              </Box>
            </VStack>
          </Flex>
        </GridItem>
      </SimpleGrid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false });
