import React, { useEffect } from "react";
import Header from "../header/header";
import ProductsDisplay from "./productsDisplay";
import Footer from "../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import "@lottiefiles/lottie-player";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import { fetchAllProducts } from "../../../features/products/productsSlice";

// import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
// import axios from "axios";
// import { fetchAllProducts } from "../../../features/products/productsSlice";

export default function Home() {
  const dispatch = useDispatch();
//   const isLoggedIn = useSelector((state) => state.login?.value);

  const loaderState = useSelector((state) => state?.loader?.value);
  console.log(loaderState);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(showLoader());
      console.log("fetching products");

      try {
        const response = await axios.get(
          "https://admin.tradingmaterials.com/api/get/products",
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
              "access-token": localStorage.getItem("client_token"),
            },
          }
        );
        if (response?.data?.status) {
          dispatch(fetchAllProducts(response?.data?.data));
          const data = response?.data?.data;
          localStorage.setItem("allProducts", JSON.stringify(data));
        }
      } catch (err) {
        console.log("err");
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <ProductsDisplay />
      <Footer />
      {/* {!isLoggedIn && (
        <div className="outer !bg-[#9da1a8]">
          <div className="content animated fadeInLeft">
            <div className="h1text">Get 10% Off on First Order</div>
            <div className="text-input-off">
              <input type="text" id="input1" placeholder="Phone Number!" />
              <label htmlFor="input1">Phone</label>
            </div>

            <div className="buttonss-off">
              <a className="cart-btn" href="#">
                GET OFFER CODE
              </a>
            </div>
          </div>

          <div className="cardss">
            <div className="ilustration">
              <lottie-player
                src="https://assets10.lottiefiles.com/packages/lf20_LrcfNr.json"
                background="white"
                speed="1"
                loop=""
                autoplay=""
              ></lottie-player>
              <span className="imgs">
                <img src="images/offer-box.png" alt="product-image" />
              </span>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
