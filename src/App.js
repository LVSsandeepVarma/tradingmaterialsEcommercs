import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './app/components/home/home';
import About from './app/components/about-us/about';
import Contact from './app/components/contact-us/contact';
import ProductDetails from './app/components/product/product-details/productDetail';


function App() {
  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/contact' element={<Contact/>}></Route>
          <Route path='/product-detail' element={<ProductDetails/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
