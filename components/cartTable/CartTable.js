import { GridItem, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';

export default function CartTable() {
  return (
    <SimpleGrid columns={[3]} border={'thin solid red'}>
      <GridItem colSpan={[3, 2]} border={'thin solid red'}>
        <Text>Hello</Text>
      </GridItem>
      <GridItem border={'thin solid red'}>there</GridItem>
    </SimpleGrid>
  );
}
