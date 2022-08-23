import React from 'react';
import Navbar from '../Navbar/Navbar';
import LargeWithLogoCentered from '../Footer/Footer';
export default function Layout({ children }) {
  return (
    <div>
      <Navbar></Navbar>
      {children}
      <LargeWithLogoCentered></LargeWithLogoCentered>
    </div>
  );
}
