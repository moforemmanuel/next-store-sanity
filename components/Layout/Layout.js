import React from 'react';
import Navbar from '../Navbar/Navbar';
import LargeWithLogoCentered from '../Footer/Footer';
import { Container } from '@chakra-ui/react';
export default function Layout({ children }) {
  return (
    <Container minW="100%" maxW="100%" w="50%" h="50vh" p={0} m={0}>
      <Navbar></Navbar>
      {children}
      <LargeWithLogoCentered></LargeWithLogoCentered>
    </Container>
  );
}
