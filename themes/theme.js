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
    colorScheme: 'teal',
    color: 'Alpha.200',
    // outlineColor: 'gray.500',
    borderColor: 'gray.500',
    borderStyle: 'solid',
    borderWidth: 'medium',
    // border: 'none',
    transition: 'all 0.7s',
    borderRadius: '.1rem',
    rounded: '1rem',
    variant: 'outline',
    '&:hover': {
      backgroundColor: 'gray.500',
      color: 'white',
      outline: 'none',
      transform: 'scale(1.1)',
    },
    '&:focus': {
      backgroundColor: 'transparent',
      colorScheme: 'teal',
      color: 'Alpha.200',
      // outlineColor: 'gray.500',
      borderColor: 'gray.500',
      borderStyle: 'solid',
      borderWidth: 'medium',
      // border: 'none',
      transition: 'all 0.7s',
      borderRadius: '.1rem',
      rounded: '1rem',
      variant: 'outline',
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
