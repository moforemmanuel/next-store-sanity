import '@fontsource/open-sans/700.css';
import '@fontsource/poppins/300.css';

import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../themes/theme';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
