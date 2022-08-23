import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'system',
};

const fonts = {
  heading: `'Open Sans', sans-serif`,
  body: `'poppins', sans-serif`,
};

const layerStyles = {
  productButton: {
    backgroundColor: 'transparent',
    outlineColor: 'gray.500',
    transition: 'all 1s',
    '&:hover': {
      backgroundColor: 'gray.500',
      color: 'white',
      outline: 'none',
      transform: 'scale(1.1)',
    },
  },
};

const textStyles = {};

const components = {
  Link: {
    baseStyle: {
      '&:hover': { textDecoration: 'none' },
    },
  },
};

const global = () => ({
  a: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

const theme = extendTheme({
  config,
  fonts,
  layerStyles,
  components,
  // styles: {
  //   global,
  // },
});

export default theme;