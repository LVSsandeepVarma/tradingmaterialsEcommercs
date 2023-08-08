import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './app/components/home/home';
import About from './app/components/about-us/about';
import Contact from './app/components/contact-us/contact';
import ProductDetails from './app/components/product/product-details/productDetail';
import AddToCart from './app/components/product/cart/addToCart';
import Login from './app/components/login/login';
import Register from './app/components/register/register';
import Checkout from './app/components/product/checkout/checkout';
import ForgotPassword from './app/components/login/forgotPassword';
import Otp from './app/components/login/otp';
import Profile from './app/components/user/profile';
import Sidebar from './app/components/user/sidebar';


function App() {
  return (
    <div className="App custom-scrollbar">
       <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/contact' element={<Contact/>}></Route>
          <Route path='/product-detail/:id' element={<ProductDetails/>}></Route>
          <Route path="/cart" element={<AddToCart/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path="/signup" element={<Register/>}></Route>
          <Route path='/checkout' element={<Checkout/>}></Route>
          <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
          <Route path="/otp" element={<Otp/>}></Route>
          <Route path="/profile" element={<Sidebar/>}></Route>
          {/* malay */}
          <Route path='/ms/' element={<Home/>}></Route>
          <Route path='/ms/about' element={<About/>}></Route>
          <Route path='/ms/contact' element={<Contact/>}></Route>
          <Route path='/ms/product-detail/:id' element={<ProductDetails/>}></Route>
          <Route path="/ms/cart" element={<AddToCart/>}></Route>
          <Route path='/ms/login' element={<Login/>}></Route>
          <Route path="/ms/signup" element={<Register/>}></Route>
          <Route path='/ms/checkout' element={<Checkout/>}></Route>
          <Route path="/ms/forgot-password" element={<ForgotPassword/>}></Route>
          <Route path="/ms/otp" element={<Otp/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
