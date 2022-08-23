import {
  Box,
  Button,
  chakra,
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

export default function ProductItem({ product }) {
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
      />

      {/* <Image src={urlForThumbnail(product.image)} alt={product.description} /> */}

      <Flex direction="column" mt="1rem" gap="2">
        <Heading fontSize="1.4rem" align="center" as="h2" fontWeight="600">
          Item - {product.name}
        </Heading>
        <Flex align="center" justify="space-evenly" p={3}>
          <Button layerStyle="productButton" mr={1}>
            <NextLink href="" passHref>
              <Link as="a">View Product</Link>
            </NextLink>
          </Button>
          <Button layerStyle="productButton" ml={1}>
            <NextLink href="" passHref>
              <Link as="a">Add To Cart</Link>
            </NextLink>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
