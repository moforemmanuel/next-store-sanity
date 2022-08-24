import '@fontsource/open-sans/700.css';
import '@fontsource/poppins/300.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../themes/theme';
import { StoreProvider } from '../utils/Store';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      {/* <ToastContainer> */}
      <StoreProvider>
        <ToastContainer theme="colored" />
        <Component {...pageProps} />
      </StoreProvider>
      {/* </ToastContainer> */}
    </ChakraProvider>
  );
}

export default MyApp;
