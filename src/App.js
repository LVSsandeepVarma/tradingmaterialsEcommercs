import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewPassword from "./app/components/login/reset-password";
import OrderTacker from "./app/components/product/track-order/TrackOrder";
import AutoLogin from "./app/components/home/autoLogin";
import PaymentVerifyStripe from "./app/components/product/checkout/paymentVerifyStripe";
import Orders from "./app/components/product/orders/orders";
import Dashboard from "./app/components/home/dashboard";
const Home = lazy(() => import("./app/components/home/home"));
// import Home from "./app/components/home/home";
const About = lazy(() => import("./app/components/about-us/about"));
// import About from "./app/components/about-us/about";
const Contact = lazy(() => import("./app/components/contact-us/contact"));
// import Contact from "./app/components/contact-us/contact";
const ProductDetails = lazy(() =>
  import("./app/components/product/product-details/productDetail")
);
// import ProductDetails from "./app/components/product/product-details/productDetail";
const AddToCart = lazy(() => import("./app/components/product/cart/addToCart"));
// import AddToCart from "./app/components/product/cart/addToCart";
const Login = lazy(() => import("./app/components/login/login"));
// import Login from "./app/components/login/login";
const Register = lazy(() => import("./app/components/register/register"));
// import Register from "./app/components/register/register";
const Checkout = lazy(() =>
  import("./app/components/product/checkout/checkout")
);
// import Checkout from "./app/components/product/checkout/checkout";
const ForgotPassword = lazy(() =>
  import("./app/components/login/forgotPassword")
);
// import ForgotPassword from "./app/components/login/forgotPassword";
const Otp = lazy(() => import("./app/components/login/otp"));
// import Otp from "./app/components/login/otp";
const Sidebar = lazy(() => import("./app/components/user/sidebar"));
// import Sidebar from "./app/components/user/sidebar";

function App() {
  return (
    <div className="App custom-scrollbar">
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="preloader !backdrop-blur-[1px] ">
              <div className="loader"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route
              path="/product-detail/:slug/:id"
              element={<ProductDetails />}
            ></Route>
            <Route path="/cart" element={<AddToCart />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Register />}></Route>
            <Route path="/checkout/order_id/:id" element={<Checkout />}></Route>
            <Route
              path="/reset-password/forgot-password"
              element={<ForgotPassword />}
            ></Route>
            <Route path="/reset-password/:hash" element={<Otp />}></Route>
            <Route
              path="/reset-password/new-password"
              element={<NewPassword />}
            ></Route>
            <Route path="/profile" element={<Sidebar />}></Route>
            <Route path="/track-order/:order_id" element={<OrderTacker/>}></Route>
            <Route path="/auto-login/:access_token" element={<AutoLogin/>}></Route>
            <Route path="/payment-status/:id" element={<PaymentVerifyStripe/>}></Route>
            <Route path="/orders/:client_id" element={<Orders/>}></Route>
            <Route path="/dashboard" element={<Dashboard/>}></Route>

            {/* malay */}

            <Route path="/ms/" element={<Home />}></Route>
            <Route path="/ms/about" element={<About />}></Route>
            <Route path="/ms/contact" element={<Contact />}></Route>
            <Route
              path="/ms/product-detail/:slug/:id"
              element={<ProductDetails />}
            ></Route>
            <Route path="/ms/cart" element={<AddToCart />}></Route>
            <Route path="/ms/login" element={<Login />}></Route>
            <Route path="/ms/signup" element={<Register />}></Route>
            <Route
              path="/ms/checkout/order_id/:id"
              element={<Checkout />}
            ></Route>
            <Route
              path="/ms/reset-password/forgot-password"
              element={<ForgotPassword />}
            ></Route>
            <Route path="/ms/reset-password/:hash" element={<Otp />}></Route>
            <Route
              path="/ms/reset-password/new-password"
              element={<NewPassword />}
            ></Route>
            <Route path="/ms/profile" element={<Sidebar />}></Route>
            <Route path="/ms/track-order" element={<OrderTacker/>}></Route>
            <Route path="/ms/dashboard" element={<Dashboard/>}></Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
