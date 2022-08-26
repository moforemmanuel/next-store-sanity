import {
  Box,
  Heading,
  Text,
  Link,
  Button,
  SimpleGrid,
  GridItem,
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  chakra,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  Flex,
  Center,
} from '@chakra-ui/react';
import React from 'react';
import Layout from '../components/Layout/Layout';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import NextImage from 'next/image';
import { CloseIcon } from '@chakra-ui/icons';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import FullPageLoader from '../components/fullPageLoader/FullPageLoader';

// import dynamic from 'next/dynamic';

// const CartTable = dynamic(() => import('../components/cartTable/CartTable'), {
//   ssr: false,
// });

function CartScreen() {
  // const [mounted, setMounted] = React.useState(false);
  // React.useEffect(() => {
  //   setMounted(true);
  // }, []);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const router = useRouter();

  const { state, dispatch } = React.useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updatedChartHandler = async (item, quantity) => {
    try {
      const result = await axios.get(`/api/products/${item._key}`);
      const data = await result.data;
      // } catch (err) {
      //   console.log(err.message);
      // }

      if (data.countInStock < quantity) {
        toast('Sorry, the product is out of stock', {
          type: 'error',
        });
        return;
      }

      dispatch({
        type: 'CART_ADD_ITEM',
        payload: {
          _key: item._key,
          name: item.name,
          countInStock: item.countInStock,
          slug: item.slug,
          price: item.price,
          image: item.image,
          quantity,
        },
      });

      toast(`${item.name} updated in the cart`, {
        type: 'success',
      });

      router.push('/cart');
    } catch (err) {
      console.log(err);
      toast(`${err.message}`, {
        type: 'error',
      });
    }
  };

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const ProductImage = chakra(NextImage, {
    baseStyle: {
      maxH: 50,
      maxW: 50,
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
      <Heading mt="4rem" align="center">
        Shopping Cart
      </Heading>
      {cartItems.length === 0 ? (
        <Flex
          // border={'thin solid red'}
          direction="column"
          gap="5"
          justify="center"
          align="center"
          minH="20vh"
        >
          <Text align>Cart is empty</Text>
          <NextLink href="/" passHref>
            <Link>
              <Button>Go Shopping</Button>
            </Link>
          </NextLink>
          {/* <Button w="fit-content">Go Shopping</Button> */}
        </Flex>
      ) : (
        <SimpleGrid
          gap={2}
          columns={[3]}
          // border={'thin solid red'}
        >
          <GridItem
            // key={1}
            colSpan={[3, 2]}
            border={'thin solid gray'}
          >
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Image</Th>
                    <Th>Name</Th>
                    <Th align="right">Quantity</Th>
                    <Th align="right">Price</Th>
                    <Th align="right">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cartItems.map((item) => (
                    <Tr key={item._id}>
                      <Td>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <ProductImage
                              width={50}
                              height={50}
                              w="auto"
                              h="auto"
                              src={item.image}
                            />
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
                        <Select
                          value={item.quantity}
                          onChange={(e) =>
                            updatedChartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                          {/*create array from 0 to countinstock -1 */}
                        </Select>
                      </Td>
                      <Td>
                        <Text>${item.price}</Text>
                      </Td>
                      <Td>
                        <IconButton
                          maxW="fit-content"
                          variant="outline"
                          color="secondary"
                          onClick={() => removeItemHandler(item)}
                          icon={<CloseIcon />}
                        ></IconButton>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </GridItem>
          <GridItem
            // key={2}
            shadow="xl"
            colSpan={[3, 1]}
            border={'thin solid gray'}
          >
            <Flex>
              <List>
                <ListItem>
                  <Heading noOfLines={2} align="center" as="h2" size="lg">
                    Subtotal (
                    {parseInt(
                      cartItems.reduce(
                        (acc, item) => acc + parseInt(item.quantity),
                        0
                      )
                    )}{' '}
                    items) Price : $
                    {cartItems.reduce(
                      (acc, item) =>
                        acc + parseInt(item.quantity) * parseInt(item.price),
                      0
                    )}
                  </Heading>
                </ListItem>
                <ListItem mt={5}>
                  <Center>
                    <Button
                      layerStyle="productButton"
                      align="center"
                      width="90%"
                      onClick={() => router.push('/shipping')}
                    >
                      Checkout
                    </Button>
                  </Center>
                </ListItem>
              </List>
            </Flex>
          </GridItem>
        </SimpleGrid>
      )}
    </Layout>
  );
}

// dynamic export
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
