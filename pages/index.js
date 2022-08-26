import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  GridItem,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import FullPageLoader from '../components/fullPageLoader/FullPageLoader';
import Layout from '../components/Layout/Layout';
import ProductItem from '../components/ProductItem/ProductItem';
import client from '../utils/sanityClient';
import { Store } from '../utils/Store';

// dynamically import productItem component to avoid ssr mismatch
// const ProductItem = dynamic(
//   () => import('../components/ProductItem/ProductItem'),
//   { ssr: false }
// );

export default function Home({ products, error }) {
  // const { state, dispatch } = React.useContext(Store);
  // const cart = { state };
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  // React.useEffect(
  //   (toast, error) => {
  //     function displayToast() {
  //       toast({
  //         title: 'Error Message',
  //         status: 'error',
  //         description: error,
  //         isClosable: true,
  //         position: 'top-right',
  //       });
  //     }
  //   },
  //   [error]
  // );

  // const toast = useToast();

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

  const onError = () =>
    toast.success(error, {
      autoClose: 1000,
      bodyStyle: {},
    });

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    products && (
      <Layout>
        {error ? (
          <Alert status="error">
            <Button onClick={onError}>View Error</Button>
            <AlertIcon />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
            {products?.map((product) => (
              <GridItem key={product.slug.current}>
                <ProductItem product={product} />
              </GridItem>
            ))}
          </SimpleGrid>
        )}
      </Layout>
    )
  );
}

export async function getStaticProps() {
  let products = [];
  let error = '';
  try {
    products = await client.fetch(`*[_type == "product"]`);
    // console.log(products);
  } catch (err) {
    // console.log(err);
    error = err.message;
  }

  return {
    props: {
      products: products,
      error,
    },
  };
}
