import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import getClient from '../utils/sanityClient';
import Layout from '../components/Layout/Layout';
import {
  Alert,
  Box,
  CircularProgress,
  Flex,
  GridItem,
  Heading,
  IconButton,
  // option,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import FullPageLoader from '../components/fullPageLoader/FullPageLoader';
// import StarRatings from 'react-star-ratings';
import { CloseIcon } from '@chakra-ui/icons';
import ProductItem from '../components/ProductItem/ProductItem';

export default function SearchScreen() {
  const router = useRouter();

  //define states for categories
  // filters come from ulr, so we use router query
  const {
    category = 'all',
    query = 'all',
    price = 'all',
    rating = 'all',
    sort = 'default',
  } = router.query;

  const [state, setState] = React.useState({
    categories: [],
    products: [],
    error: '',
    loading: true,
  });

  //destruct state
  const { loading, products, error } = state;
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchCategories();

    //filter function
    const fetchData = async () => {
      try {
        let gQuery = '*[_type == "product"'; // no closing ] so that we can apply a filter

        // filter product based on selected category if not all
        if (category !== 'all') {
          // update/concat gQuery
          gQuery += ` && category match "${category}"`;
        }

        if (query !== 'all') {
          gQuery += ` && name match "${query}"`;
        }

        if (price !== 'all') {
          const minPrice = Number(price.split('-')[0]);
          const maxPrice = Number(price.split('-')[1]);
          gQuery += ` && price >= ${minPrice} && price <= ${maxPrice}`;
        }

        if (rating !== 'all') {
          gQuery += ` && rating >= ${Number(rating)}`;
        }

        let order = '';
        if (sort !== 'default') {
          if (sort === 'lowest') order = '| order(price asc)';
          if (sort === 'highest') order = '| order(price desc)';
          if (sort === 'toprated') order = '| order(rating desc)';
        }

        // end of query
        gQuery += `] ${order}`;

        // set loading true while fetching data
        setState({ loading: true });

        const products = await getClient().fetch(gQuery);

        // load products to state
        setState({ products, loading: false });
      } catch (err) {
        console.log('search page: ', err);
        setState({ error: err.message, loading: false });
      }
    };

    fetchData();
  }, [category, price, query, rating, sort]);

  // define filter search used in event handler
  const filterSearch = ({ sort, category, searchQuery, price, rating }) => {
    // get path and query

    const path = router.pathname;
    const { query } = router;

    // if query in the fn parameter object exists, update the router query from the fn param
    if (searchQuery) query.searchQuery = searchQuery;
    if (category) query.category = category;
    if (sort) query.sort = sort;
    if (price) query.price = price;
    if (rating) query.rating = rating;

    //redirect user to the path name and derived query
    router.push({
      pathname: path,
      query: query,
    });
  };

  // handler for defined filter event
  // define the handler, then update the filter for it

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };

  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };

  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };

  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const prices = [
    {
      name: '$1 - $50',
      value: '1-50',
    },
    {
      name: '$51 - $200',
      value: '51-200',
    },
    {
      name: '$201 - $1000',
      value: '201-1000',
    },
  ];

  const ratings = [1, 2, 3, 4, 5];

  if (loading) {
    return <FullPageLoader />;
  }
  return (
    <Layout>
      <SimpleGrid columns={3}>
        <GridItem colSpan={[3, 1]}>
          <Flex direction="column" spacing={5} gap={3}>
            <Stack>
              <Box>
                <Heading>Categories</Heading>
                <Select value={category} onChange={categoryHandler}>
                  <option value="all">All</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </Select>
              </Box>
            </Stack>

            <Stack>
              <Box>
                <Heading>Prices</Heading>
                <Select value={price} onChange={priceHandler}>
                  <option value="all">All</option>
                  {prices &&
                    prices.map((price) => (
                      <option key={price.value} value={price.value}>
                        {price.name}
                      </option>
                    ))}
                </Select>
              </Box>
            </Stack>

            <Stack>
              <Box>
                <Heading>Ratings</Heading>
                <Select value={rating} onChange={ratingHandler} isReadOnly>
                  <option value="all">All</option>
                  {ratings &&
                    ratings.map((rating) => (
                      <option key={rating} value={rating}>
                        {/* <StarRatings
                          rating={rating}
                          starRatedColor="blue"
                          numberOfStars={5}
                          name="rating"
                          starDimension="10px"
                          starSpacing="2px"
                        /> */}
                        {rating}
                      </option>
                    ))}
                </Select>
              </Box>
            </Stack>
          </Flex>
        </GridItem>
        <GridItem
          colSpan={[3, 2]}
          // border={'thin solid red'}
        >
          <Flex direction="column" align="center" justify="space-between">
            <Stack>
              {products && products.length !== 0 ? products.length : 'No'}{' '}
              Results
            </Stack>
            {query !== 'all' && query !== '' && ' : ' + query}
            {price !== 'all' && ' : Price ' + price}
            {rating !== 'all' && ' : Rating ' + rating + ' & up'}
            {(query !== 'all' && query !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <IconButton
                icon={<CloseIcon />}
                onClick={() => router.push('/search')}
              /> // redirect to initial search page if removed filters
            ) : null}

            <Stack>
              <Text>Sort by </Text>
              <Select value={sort} onChange={sortHandler}>
                <option value="default">Default</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="toprated">Customer Reviews</option>
              </Select>
            </Stack>
          </Flex>

          <Flex align="center" justify="center">
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert>{error}</Alert>
            ) : (
              <Wrap align="center" justify="center" spacing={5}>
                {products.map((product) => (
                  <WrapItem key={product.name}>
                    <ProductItem
                      product={product}
                      // addToCartHandler={addToCartHandler}
                    />
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </Flex>
        </GridItem>
      </SimpleGrid>
    </Layout>
  );
}
