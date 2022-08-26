import {
  Box,
  Flex,
  FormControl,
  Heading,
  Radio,
  RadioGroup,
  Text,
  Stack,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/checkoutWizard/CheckoutWizard';
import Form from '../components/Form/Form';
import FullPageLoader from '../components/fullPageLoader/FullPageLoader';
import Layout from '../components/Layout/Layout';
import { Store } from '../utils/Store';
import shipping from './shipping';

export default function PaymentScreen() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const { state, dispatch } = React.useContext(Store);

  const {
    cart: { shippingAddress },
  } = state;

  React.useEffect(() => {
    setLoading(false);

    if (!shippingAddress) {
      router.push('/shipping');
      toast.error('Please you need to select a payment method');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, [router, shippingAddress]);

  const boxBgColor = useColorModeValue('white', 'gray.700');
  const flexBgColor = useColorModeValue('gray.50', 'gray.800');

  const submitHandler = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error('Payment method is required');
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/place-order');
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }
  return (
    <Layout>
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <Form onSubmit={submitHandler}>
        <Flex
          minH={'20vh'}
          align={'center'}
          justify={'center'}
          bg={flexBgColor}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'}>
                Payment Method
              </Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                please enter your payment details
              </Text>
            </Stack>
            <Box rounded={'lg'} bg={boxBgColor} boxShadow={'lg'} p={8}>
              <Stack spacing={4}>
                <Stack direction={['column', 'row']}>
                  <Box>
                    <FormControl>
                      <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <Stack direction="column">
                          <Radio value="paypal">Paypal</Radio>
                          <Radio value="stripe">Stripe</Radio>
                          <Radio value="cash">Cash</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Stack>
                <Stack spacing={10} pt={2}>
                  <Button
                    // isLoading={}
                    onClick={() => router.push('/shipping')}
                    type="submit"
                    loadingText="Submitting"
                    size="lg"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Continue
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Form>
    </Layout>
  );
}
