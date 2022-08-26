import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

export default function FullPageLoader() {
  return (
    <Flex align="center" justify="center" minH="100vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
}
