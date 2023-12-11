import React, { Suspense, lazy, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import NewPassword from "./app/components/login/reset-password";
import OrderTacker from "./app/components/product/track-order/TrackOrder";
import AutoLogin from "./app/components/home/autoLogin";
import PaymentVerifyStripe from "./app/components/product/checkout/paymentVerifyStripe";
import Orders from "./app/components/protectedRoutes/orders";
import Dashboard from "./app/components/dashboard/Dashboard";
// import ViewOrders from "./app/components/product/orders/viewOrders";
import OrderDashboard from "./app/components/protectedRoutes/dashboard";
import OrderView from "./app/components/protectedRoutes/viewOrders";
// import Payments from "./app/components/payments/Payments";
import PaymentsHistory from "./app/components/protectedRoutes/payments";
import Terms from "./app/components/policies/Terms";
import Privacy from "./app/components/policies/Privacy";
import Refund from "./app/components/policies/Refund";
import PageNotFound from "./app//components/undefinedRoutes/Pagenotfound";
import ShippingPolicy from "./app/components/policies/Shipping";
import LinkExpired from "./app/components/expired/LinkExpired";
import Disclaimer from "./app/components/policies/Disclaimer";
import Return from "./app/components/policies/Return";
import ViewInvoice from "./app/components/invoice/ViewInvoice";
// import InvoiceList from "./app/components/invoice/InvoiceList";
// import Logs from "./app/components/logs/Logs";
import ProtectedLogs from "./app/components/protectedRoutes/logs";
import ProtectedInnvoices from "./app/components/protectedRoutes/invoices";
import PaymentVerifyPhonepe from "./app/components/product/checkout_clone/paymentVerifyPhonepe";
import CodVerify from "./app/components/product/checkout_clone/CodVerify";
import AuthenticatedHome from "./app/components/protectedRoutes/home";
import LoginContactUs from "./app/components/ContactUs/LoginContactUs";
import Contact from "./app/components/ContactUs/Contactus";
 const UserProfile = lazy(()=>import("./app/components/protectedRoutes/profile"))
// import OrderProfile from "./app/components/protectedRoutes/viewOrders";
const OrderProfile = lazy(()=> import("./app/components/protectedRoutes/viewOrders"))
const Home = lazy(() => import("./app/components/home/home"));
// import Home from "./app/components/home/home";
// const About = lazy(() => import("./app/components/about-us/about"));
// import About from "./app/components/about-us/about";
// const Contact = lazy(() => import("./app/components/contact-us/contact"));
// import Contact from "./app/components/contact-us/contact";
const ProductDetails = lazy(() =>
  import("./app/components/product/product-details/productDetail")
);
// import ProductDetails from "./app/components/product/product-details/productDetail";
const AddToCart = lazy(() =>
  import("./app/components/product/cart_clone/addToCart")
);
// import AddToCart from "./app/components/product/cart/addToCart";
const Login = lazy(() => import("./app/components/login/login"));
// import Login from "./app/components/login/login";
// const Register = lazy(() => import("./app/components/register/register"));
// import Register from "./app/components/register/register";
const Checkout = lazy(() =>
  import("./app/components/product/checkout_clone/checkout")
);
// import Checkout from "./app/components/product/checkout/checkout";
const ForgotPassword = lazy(() =>
  import("./app/components/login/forgotPassword")
);
// import ForgotPassword from "./app/components/login/forgotPassword";
const Otp = lazy(() => import("./app/components/login/otp"));
// import Otp from "./app/components/login/otp";
// const Sidebar = lazy(() => import("./app/components/user/sidebar"));
// import Sidebar from "./app/components/user/sidebar";

function App() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
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
            <Route path="/" element={<OrderDashboard />}></Route>
            <Route path="/products" element={<AuthenticatedHome />}></Route>
            {/* <Route path="/about" element={<About />}></Route>*/}
            <Route path="/contactus" element={<Contact />}></Route>
            <Route
              path="/product-detail/:slug/:id"
              element={<ProductDetails />}
            ></Route>
            <Route path="/cart" element={<AddToCart />}></Route>
            <Route path="/login" element={<Login />}></Route>
            {/* <Route path="/signup" element={<Register />}></Route> */}
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
            <Route path="/profile" element={<UserProfile />}></Route>
            <Route
              path="/track-order/:order_id"
              element={<OrderTacker />}
            ></Route>
            <Route
              path="/auto-login/:access_token"
              element={<AutoLogin />}
            ></Route>
            <Route
              path="/view-invoice/:order_id/:pdf_filelink"
              element={<ViewInvoice />}
            ></Route>
            <Route path="/invoices" element={<ProtectedInnvoices />}></Route>
            <Route
              path="/payment-status/:id"
              element={<PaymentVerifyStripe />}
            ></Route>
            <Route
              path="/payment-status/phonepe"
              element={<PaymentVerifyPhonepe />}
            ></Route>
            <Route path="/orders/:client_id" element={<Orders />}></Route>
            <Route path="/logs" element={<ProtectedLogs />}></Route>
            <Route
              path="/view-order/:order_type"
              element={<OrderView />}
            ></Route>
            <Route path="/place-order/:id" element={<CodVerify />}></Route>
            <Route path="/expired" element={<LinkExpired />}></Route>
            <Route path="/dashboard" element={<OrderDashboard />}></Route>
            <Route path="/payments" element={<PaymentsHistory />}></Route>
            <Route path="/terms-and-conditions" element={<Terms />}></Route>
            <Route path="/privacy-policy" element={<Privacy />}></Route>
            <Route path="/refund-policy" element={<Refund />}></Route>
            <Route path="/shipping-policy" element={<ShippingPolicy />}></Route>
            <Route path="/disclaimer-policy" element={<Disclaimer />} />
            <Route path="/return-policy" element={<Return />} />
            <Route path="/contact" element={<LoginContactUs />}></Route>
            <Route path="*" element={<PageNotFound />}></Route>

            {/* malay */}

            <Route path="/ms/products" element={<Home />}></Route>
            {/* <Route path="/ms/about" element={<About />}></Route>
            <Route path="/ms/contact" element={<Contact />}></Route> */}
            <Route
              path="/ms/product-detail/:slug/:id"
              element={<ProductDetails />}
            ></Route>
            <Route path="/ms/cart" element={<AddToCart />}></Route>
            <Route path="/ms/login" element={<Login />}></Route>
            {/* <Route path="/ms/signup" element={<Register />}></Route> */}
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
            <Route path="/ms/profile" element={<OrderProfile />}></Route>
            <Route path="/ms/track-order" element={<OrderTacker />}></Route>
            <Route path="/ms/dashboard" element={<Dashboard />}></Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
