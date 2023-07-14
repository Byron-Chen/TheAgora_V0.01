import React from 'react';
import { NavComp } from './components/authentication/NavComp';
import { AuthProvider } from './context/AuthContext';
import { AuctionBody } from './components/auctions/Body';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auction from './pages/auction';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
      <NavComp/>
      <Routes>
        <Route exact path='/' element={<AuctionBody/>}/>
        <Route path='/auction' element={<Auction/>} />
      </Routes>
      </AuthProvider>
    </Router>
  
  );
};
