import {
  Alert,
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

  const toast = useToast();

  // if (loading) {
  //   return (
  //     <Layout>
  //       <CircularProgress />
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      {error ? (
        toast({
          title: 'Error Message',
          status: 'error',
          description: error,
          isClosable: true,
          position: 'top-right',
        })
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
    error = err.message;
  }

  return {
    props: {
      products: products,
      error,
    },
  };
}
