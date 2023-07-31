import React, { useEffect, useState } from "react";
import Header from "../header/header";
import ProductsDisplay from "./productsDisplay";
import Footer from "../footer/footer";
import {useSelector, useDispatch} from "react-redux"
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import { fetchAllProducts } from "../../../features/products/productsSlice";

export default function Home() {
    const dispatch = useDispatch();
    const loaderState = useSelector(state => state?.loader?.value)
    console.log(loaderState)

    
    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(showLoader())
            console.log("fetching products")
            try {
                const response = await axios.get("https://admin.tradingmaterials.com/api/get/products", {
                    headers: {
                        "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
                        "Accept": "application/json"
                    }
                })
                if (response?.data?.status) {
                    dispatch(fetchAllProducts(response?.data?.data))
                }
            } catch (err) {
                console.log("err")
            }finally{
              dispatch(hideLoader())
            }
            
        }
    
        fetchProducts().then(()=>{
            
        });
    }, []);

  return (
    <>
      {loaderState && <div className="preloader">
        <div class="loader"></div>
      </div>}
      <Header/>
      <ProductsDisplay/>
      <Footer/>
    </>
  );
}
