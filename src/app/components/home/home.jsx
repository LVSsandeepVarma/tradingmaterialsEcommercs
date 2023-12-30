import React, { useEffect } from "react";
import Header from "../header/header";
import ProductsDisplay from "./productsDisplay";
import Footer from "../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import "@lottiefiles/lottie-player";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import { fetchAllProducts } from "../../../features/products/productsSlice";
// import Box from "../3d/testOne";

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
          response.data.data.products.sort((a, b) => {
            // Convert prices to numbers and compare them
            const priceA = a.prices[0].INR;
            const priceB = b.prices[0].INR;
            return parseInt(priceA) - parseInt(priceB);
          });
          [response.data.data.products[0], response.data.data.products[5]] = [
            response.data.data.products[5],
            response.data.data.products[0],
          ];
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
      {/* <Box /> */}
      <ProductsDisplay />
      <Footer />
    </>
  );
}
