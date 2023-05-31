import React from 'react';
import { NavComp } from './components/authentication/NavComp';
import { AuthProvider } from './context/AuthContext';
import { AuctionBody } from './components/auctions/Body';

export const App = () => {
  return (
  <AuthProvider>
    <NavComp/>
    <AuctionBody/>
  </AuthProvider>
  );
};