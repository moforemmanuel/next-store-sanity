import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CircularProgress,
  GridItem,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import Layout from '../components/Layout/Layout';
import ProductItem from '../components/ProductItem/ProductItem';
import client from '../utils/sanityClient';

export default function Home({ products, error }) {
  // const [loading, setLoading] = React.useState(true);

  // React.useEffect(() => {
  //   setLoading(false);
  // }, [products]);

  React.useEffect(
    (toast, error) => {
      function displayToast() {
        toast({
          title: 'Error Message',
          status: 'error',
          description: error,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    [error]
  );

  const toast = useToast();

  // if (loading) {
  //   return (
  //     <Layout>
  //       <CircularProgress />
  //     </Layout>
  //   );
  // }

  {
    /* {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert> */
  }

  return (
    <Layout>
      {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
          {products?.map((product) => (
            <GridItem key={product.slug}>
              <ProductItem product={product} />
            </GridItem>
          ))}
        </SimpleGrid>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  let products = [];
  let error = '';
  try {
    products = await client.fetch(`*[_type == "product"]`);
    console.log(products);
  } catch (err) {
    console.log(err);
    error = err.message;
  }

  return {
    props: {
      products: products,
      error,
    },
  };
}
