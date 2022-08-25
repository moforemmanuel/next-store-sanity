import { ArrowBackIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  chakra,
  Circle,
  Container,
  Flex,
  Link,
  Heading,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
} from '@chakra-ui/react';
import React from 'react';
import StarRatings, { contextType } from 'react-star-ratings';
import Layout from '../../components/Layout/Layout';
import NextImage from 'next/image';
import NextLink from 'next/link';
import urlForThumbnail from '../../utils/sanityImageBuilder';
import client from '../../utils/sanityClient';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ProductScreen(props) {
  const router = useRouter();
  const { slug, product, error } = props;

  const { state, dispatch } = React.useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existingItem = cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

    // let data;
    try {
      const result = await axios.get(`/api/products/${product._id}`);
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
          _key: product._id,
          name: product.name,
          countInStock: product.countInStock,
          slug: product.slug.current,
          price: product.price,
          image: urlForThumbnail(product.image),
          quantity,
        },
      });

      toast(`${product.name} added to the cart`, {
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

  const ProductImage = chakra(NextImage, {
    baseStyles: {
      minH: 420,
      minW: 420,
    },
    shouldForwardProp: (prop) =>
      ['width', 'height', 'src', 'alt'].includes(prop),
  });

  return (
    <Layout>
      <Container
        // border={'thin solid black'}
        minW="100%"
        maxW="100%"
        p={3}
        m={0}
      >
        <Center>
          <Button
            layerStyle="productButton"
            leftIcon={<ArrowBackIcon fontSize="xl" />}
          >
            <NextLink href="/" passHref>
              <Link>Back to Products</Link>
            </NextLink>
          </Button>
        </Center>

        {error ? (
          <Alert m={5} w="90%" status="error">
            <AlertIcon />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Center>
            {/* <Flex
              border={'thin solid yellow'}
              gap={2}
              m={0}
              mt={3}
              p={0}
              maxW="fit-content"
              // mr={1}
              direction={['column', 'row']}
              justify={{ sm: 'center' }}
              align={{ sm: 'center' }}
              shadow="xl"
            > */}
            <SimpleGrid
              // border={'thin solid pink'}
              w={{ md: '70%' }}
              h="auto"
              columns={[1, 2]}
              mt={3}
              gap={{ base: 4 }}
              shadow="lg"
              p={3}
            >
              <Skeleton isLoaded={product.image ? true : false}>
                <Flex justify="center" m={0}>
                  {/* <Center> */}
                  <ProductImage
                    height={320}
                    width={320}
                    w="auto"
                    h="auto"
                    src={urlForThumbnail(product.image, 2000)}
                    m={0}
                    layout="fill"
                    sx={{
                      height: '200rem',
                    }}
                  />
                  {/* </Center> */}
                </Flex>
              </Skeleton>

              <Flex
                direction="column"
                // w={{ sm: '50%' }}
                h="auto"
                // border={'thin solid blue'}
                justify="space-between"
                gap={2}
              >
                <Skeleton isLoaded>
                  <Heading align="center" mr={5} mt={2}>
                    {product.name}
                  </Heading>
                </Skeleton>
                <Flex
                  justify="center"
                  align="center"
                  direction="column"
                  gap={3}
                >
                  <StarRatings
                    rating={product.rating}
                    starRatedColor="blue"
                    numberOfStars={5}
                    name="rating"
                    starDimension="20px"
                    starSpacing="2px"
                  />
                  <Circle
                    border={'2px solid gray'}
                    p={1}
                    // w="fit-content"
                    // h="max-content"
                    minW="3rem"
                    minH="3rem"
                  >
                    ${product.price}
                  </Circle>
                  <Text
                    color={product.countInStock > 0 ? 'green.300' : 'red.300'}
                    align="center"
                    fontWeight="bold"
                  >
                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </Text>
                </Flex>

                <Skeleton isLoaded>
                  <Text align="center">
                    LoremEiusmod enim quis nisi cupidatat. Dolore dolore
                    reprehenderit culpa sint tempor aute aliqua irure. Tempor
                    velit tempor veniam esse do proident sit officia qui sunt
                    aliqua elit duis qui.
                  </Text>
                </Skeleton>
                <Flex align="center" justify="space-evenly" p={3}>
                  <Button
                    onClick={addToCartHandler}
                    layerStyle="productButton"
                    ml={1}
                  >
                    Add To Cart
                  </Button>
                </Flex>
              </Flex>
            </SimpleGrid>
            {/* </Flex> */}
          </Center>
        )}
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // const slug = { context: { params: { slug } } };
  const slug = context.params.slug;
  console.log(context.params);
  let product = [];
  let error = '';
  try {
    product = await client.fetch(
      `
      *[_type == "product" && slug.current == $slug][0]
      `,
      { slug }
    );
    console.log(product);
  } catch (err) {
    error = err.message;
    console.log(error);
  }
  return {
    props: {
      slug,
      product,
      error,
    },
  };
}
