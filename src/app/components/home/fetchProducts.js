import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchAllProducts } from "../../../features/products/productsSlice";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";

 async function fetchProducts (){
    const dispatch = useDispatch()
    dispatch(showLoader())
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


