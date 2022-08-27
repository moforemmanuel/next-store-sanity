import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';
import FullPageLoader from '../components/fullPageLoader/FullPageLoader';
import Layout from '../components/Layout/Layout';
import getError from '../utils/error';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }

    case 'FETCH_SUCCESS': {
      return { ...state, loading: false, orders: action.payload, error: '' };
    }

    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }
  }
}

function OrderHistoryScreen() {
  const router = useRouter();
  const { state } = React.useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders }, dispatch] = React.useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });
  React.useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/order-history');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/orders/history/', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchOrders();
  }, [router, userInfo]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (error) {
    return toast.error(error);
  }
  return (
    <Layout>
      <Heading>Order History</Heading>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>DATE</Th>
              <Th>TOTAL</Th>
              <Th>PAID</Th>
              <Th>ACTION</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>{order.createdAt}</Td>
                <Td>${order.totalPrice}</Td>
                <Td>{order.isPaid ? `Paid at ${order.paidAt}` : 'Not Paid'}</Td>
                <Td>
                  <NextLink href={`/order/${order._id}`} passHref>
                    <Button>Details</Button>
                  </NextLink>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(OrderHistoryScreen), {
  ssr: false,
});
