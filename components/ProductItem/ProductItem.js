import {
  Box,
  Button,
  chakra,
  Circle,
  Flex,
  Heading,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';
import urlForThumbnail from '../../utils/sanityImageBuilder';
import StarRatings from 'react-star-ratings';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
export default function ProductItem({ product }) {
  const router = useRouter();
  const { state, dispatch } = React.useContext(Store);
  const { cart } = state;
  const [buttonLoading, setButtonLoading] = React.useState(false);
  React.useEffect(() => {
    // console.log(buttonLoading);
    // const toggleButtonLoading = () => {
    //   setButtonLoading(!buttonLoading);
    // };
  }, [buttonLoading]);

  // console.log(cart);

  let productInCart = false;
  for (let item of cart.cartItems) {
    if (item._key === product._id) {
      productInCart = true;
    }
  }

  const addToCartHandler = async (callback) => {
    const existingItem = cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

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
    callback(false);
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

  return (
    <Flex direction="column" shadow="lg" p={1} mb={2} align="space-between">
      <ProductImage
        src={urlForThumbnail(product.image)}
        width={350}
        height={350}
        w="auto"
        h="auto"
        borderWidth={5}
        borderStyle="solid"
        borderColor="gray.800"
        priority
      />

      {/* <Image src={urlForThumbnail(product.image)} alt={product.description} /> */}

      <Flex direction="column" mt="1rem" gap="2">
        <Heading fontSize="1.4rem" align="center" as="h2" fontWeight="600">
          Item - {product.name}
        </Heading>

        <Flex justify="center" align="center" direction="column" gap={3}>
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
        </Flex>
        <Flex align="center" justify="space-evenly" p={3} gap={2}>
          <Button layerStyle="productButton" mr={1}>
            <NextLink href={`/product/${product.slug.current}`} passHref>
              <Link as="a">View Product</Link>
            </NextLink>
          </Button>
          <Button
            disabled={productInCart}
            isLoading={buttonLoading ? true : false}
            loadingText="Adding"
            // colorScheme="teal"
            onClick={() => {
              setButtonLoading(true);
              addToCartHandler(setButtonLoading);
              // setTimeout(() => {
              //   setButtonLoading(false);
              // }, 5000);
            }}
            layerStyle="productButton"
            ml={1}
          >
            {productInCart ? 'In' : 'Add To'} Cart
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
