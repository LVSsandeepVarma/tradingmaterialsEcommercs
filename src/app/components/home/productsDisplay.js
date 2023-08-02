import React, { useEffect, useState } from "react";
import Countdown from "./countdown";
import { useDispatch, useSelector } from "react-redux";
import {
  filteredProductsByIds,
  updatingProducts,
} from "../../../features/products/productsSlice";
import styled, { keyframes } from 'styled-components';
import {AiFillCloseCircle} from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { loginUser, logoutUser } from "../../../features/login/loginSlice";
import { updatePositions } from "../../../features/positions/positionsSlice";

export default function ProductsDisplay() {
  const products = useSelector((state) => state?.products?.value);
  const loaderState = useSelector(state => state?.loader?.value);
  const isLoggedIn = useSelector(state => state?.login?.value)
  const [megaDealTime, setMegaDealTime] = useState("2023-08-31T00:00:00");
  const [singleProductsCount, setSingleProductsCount] = useState(0);
  const [bundleProductCount, setBundleProductCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState({});
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [subCatProducts, setSubCatProducts] = useState([]);
  const [bundleSubCategoryIDs, setBundleSubCategoryIds] = useState([]);
  const [filteredSubcatProducts, setFilteredSubcatproducts] = useState({});
  const [sorting, setSorting]  =useState("default")
  const [stockCount, setStockCount] = useState("inStock");
  const [isSearchResult, setIsSearchResult] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);
  const [isNoProducts, setIsNoProducts] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [animateProductId, setAnimateProductId] = useState("");
  const [cartPosition, setCartPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const positions = useSelector(state => state?.position?.value)
  console.log(positions, positions?.cartTop, positions?.cartRight)

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoader())
    setAllProducts(products);
    setSubCatProducts(products?.products);
    let totalCount = 0;
    let bundleCount = 0;
    let productsFilter = {};
    products?.sub_categories?.forEach((element) => {
      if (element?.combo === 0) {
        return (totalCount += element?.product_count);
      } else if (element?.combo === 1) {
        return (bundleCount += element?.product_count);
      }
    });
    setBundleProductCount(bundleCount);
    setSingleProductsCount(totalCount);
    console.log(totalCount);

    products?.sub_categories?.map((product, ind) => {
      productsFilter[product] = false;
    });
    productsFilter["all"] = true;

    setFilteredProducts({ ...productsFilter });
    setFilteredSubcatproducts({ ...productsFilter });
    setAllProducts(products?.products);
    dispatch(hideLoader())
    if(localStorage?.getItem("client_token")){
      dispatch(loginUser())
    }else{
      dispatch(logoutUser())
    }
  }, [products]);



  //function for generating random discounted price
  function getRandomNumberWithOffset(number) {
    // Define an array of possible offsets: 5, 10, and 20.
    const offsets = [15, 50, 80];

    // Generate a random index within the valid range of offsets array.
    const randomIndex = Math.floor(Math.random() * offsets.length);

    // Get the random offset based on the selected index.
    const randomOffset = offsets[randomIndex];

    // Add the random offset to the input number.
    const result = parseInt(number) + randomOffset;
    return result;
  }


  //function for review stars
  function ratingStars(number) {
    const elemetns = Array.from({ length: number }, (_, index) => (
      <li key={index}>
        <em className="icon ni ni-star-fill text-yellow"></em>
      </li>
    ));

    return <ul className="d-flex align-items-center">{elemetns}</ul>;
  }


  // function for filtering single products
  function addFilterProducts(subCategoryName, subCategoryId) {
    console.log(subCategoryName, subCategoryId);
    const subIDs = [...subCategoryIds];
    let filterProducts = { ...filteredProducts };
    console.log(subIDs);
    // toggles checked or not
    filterProducts[`${subCategoryName}`] = filterProducts[`${subCategoryName}`]
      ? false
      : true;

    const ind = subIDs.indexOf(subCategoryId);
    if (ind !== -1) {
      subIDs?.splice(ind, 1);
      const fp = filteredProductsByIds(products, subIDs);
      console.log(fp);

      setAllProducts(fp);
    }

    if (filterProducts[subCategoryName]) {
      subIDs.push(subCategoryId);
      // if(subIDs?.includes(0)){
      //   console.log(subIDs)
      //   // setAllProducts(products?.products)
      // }else{
      console.log(subIDs);
      const fp = filteredProductsByIds(products, subIDs);
      console.log(fp);
      setAllProducts(fp);
      // }
    } else {
      // subIDs
      const ind = subIDs.indexOf(subCategoryId);
      console.log(ind);
      if (ind !== -1) {
        subIDs?.splice(ind, 1);
        const fp = filteredProductsByIds(products, subIDs);
        console.log(fp);

        setAllProducts(fp);
      }
    }

    setSubCategoryIds([...subIDs]);

    // checks if all the filter options are false
    if (Object.values(filterProducts).every((value) => value === false)) {
      filterProducts["all"] = true;
      setSubCategoryIds([]);
      setAllProducts(products?.products);
    } else if (filterProducts["all"]) {
      filterProducts["all"] = false;

      const fp = filteredProductsByIds(products, subIDs);
      console.log(fp);
      setSubCategoryIds(subIDs);
      setAllProducts(fp);
      console.log(subIDs, subCategoryId);
    }
    if (subCategoryName === "all") {
      const keys = Object.keys(filterProducts);
      // Iterate through the keys and set all values to false except for the "all" key
      keys.forEach((key) => {
        filterProducts[key] = key === "all" ? true : false;
      });
      setSubCategoryIds([]);
      setAllProducts(products?.products);

      // const allProducts = products
    }
    setFilteredProducts({ ...filterProducts });
  }

  // filtering buldle products
  function filtersubcatProducts(subCategoryName, subCategoryId) {
    console.log(subCategoryName, subCategoryId);
    const subIDs = [...bundleSubCategoryIDs];
    let filterProducts = { ...filteredSubcatProducts };
    console.log(subIDs);
    // toggles checked or not
    filterProducts[`${subCategoryName}`] = filterProducts[`${subCategoryName}`]
      ? false
      : true;

    const ind = subIDs.indexOf(subCategoryId);
    if (ind !== -1) {
      subIDs?.splice(ind, 1);
      const fp = filteredProductsByIds(products, subIDs);
      console.log(fp);

      setSubCatProducts(fp);
    }

    if (filterProducts[subCategoryName]) {
      subIDs.push(subCategoryId);
      // if(subIDs?.includes(0)){
      //   console.log(subIDs)
      //   // setAllProducts(products?.products)
      // }else{
      console.log(subIDs);
      const fp = filteredProductsByIds(products, subIDs);
      console.log(fp);
      setSubCatProducts(fp);
      // }
    } else {
      // subIDs
      const ind = subIDs.indexOf(subCategoryId);
      console.log(ind);
      if (ind !== -1) {
        subIDs?.splice(ind, 1);
        const fp = filteredProductsByIds(products, subIDs);
        console.log(fp);

        setSubCatProducts(fp);
      }
    }

    setBundleSubCategoryIds([...subIDs]);

    // checks if all the filter options are false
    if (Object.values(filterProducts).every((value) => value === false)) {
      filterProducts["all"] = true;
      setBundleSubCategoryIds([]);
      setSubCatProducts(products?.products);
    } else if (filterProducts["all"]) {
      filterProducts["all"] = false;

      const fp = filteredProductsByIds(products, subIDs);
      console.log(fp);
      setBundleSubCategoryIds(subIDs);
      setSubCatProducts(fp);
      console.log(subIDs, subCategoryId);
    }
    if (subCategoryName === "all") {
      const keys = Object.keys(filterProducts);
      // Iterate through the keys and set all values to false except for the "all" key
      keys.forEach((key) => {
        filterProducts[key] = key === "all" ? true : false;
      });
      setBundleSubCategoryIds([]);
      setSubCatProducts(products?.products);

      // const allProducts = products
    }
    setFilteredSubcatproducts({ ...filterProducts });
  }


//function for handling filtering based on in stock or out stock
  function filterstockProducts(){
    let currentActiveCheckbox
    if(stockCount === "inStock"){
      setStockCount("outStock")
      currentActiveCheckbox= "outStock"
    }else{
      setStockCount("inStock")
      currentActiveCheckbox = "inStock"
    }

    const completeProducts = products?.products
    console.log(completeProducts, typeof(completeProducts))
    const res = currentActiveCheckbox === "inStock" ?  completeProducts?.filter(product => product?.stock?.stock > 0): completeProducts?.filter(product => product?.stock?.stock === 0)
    setAllProducts(res)
    console.log(res)

  }
// function for handling products search
  function handlesearchProducts(e){
    
      const searchText = e.target.value
      if(searchText?.length >0){
        setIsSearchResult(true)
      }else{
        setIsSearchResult(false)
      }
      const completeProducts = products?.products
      const timeInterval = setTimeout(()=>{
        dispatch(showLoader())
        const res  = completeProducts?.filter(product => product?.name?.toLowerCase()?.includes(searchText?.toLowerCase()))
        console.log(res)
        setResultsCount(res?.length)
        setAllProducts(res)
        if(res?.length ===0){
          setIsNoProducts(true)
        }else{
          setIsNoProducts(false)
        }
        dispatch(hideLoader())
      }, 1000)

      // return clearInterval(timeInterval)
  }


  //pending 

  function handleSortingProducts(value){
    const combinedProducts = [...products?.products]
    console.log(combinedProducts[0], typeof(combinedProducts))

    // const res = combinedProducts?.sort((a, b) => new Date(a.added_at) - new Date(b.added_at));

// console.log(res);
// Output: Sorted array in ascending order based on 'created_at'

// Sort in descending order based on the 'created_at' property
const res = combinedProducts?.sort((b, a) => new Date(a.added_at) - new Date(b.added_at));
setAllProducts(res)
console.log(res);
  }

  const dynamicAnimation = keyframes`
  from {
    position: absolute;
    transform: translate(587px , -676px) scale(5);
  },
  to {
   
    transform: translate(1547px, 18px) scale(1);
  }
`;

const AnimatedDiv = styled.div`
animation: ${dynamicAnimation} 4s ease-in-out infinite `


  // function for handling add to cart animation 
  function handleAddToCart(productId){
    setAnimateProductId(productId)
  }

  const handleCartPosition = (event) => {
    const cartButtonRect = document?.getElementById(`img-4`)?.getBoundingClientRect();

    const top = cartButtonRect?.top ;
    const right = cartButtonRect?.left;
    dispatch(updatePositions({cartTop: positions?.cartTop, cartRight: positions?.cartRight, productTop : top, productRight: right}))

    // Animate the product's movement towards the cart button
    setCartPosition({ top: `${top}px`, right: `${right}px` });
  };

  return (
    <>
    {loaderState && (
            <div className="preloader !bg-[rgba(0,0,0,0.5)]">
              <div className="loader" ></div>
            </div>
          )}
          {showPopup && (
        <div className="com">
          <span className="  fixed  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-[100] ">
            <AiFillCloseCircle
              className="text-red-500 text-3xl cursor-pointer"
              onClick={() => setShowPopup(false)}
            />
            <a href="/login">
              <img onClick={()=>navigate("/login")} src="/assets/images/banner-cart.jpg" alt="" />
            </a>
          </span>
        </div>
      )}
      <div className="nk-pages">
        <section className="nk-banner nk-banner-shop">
          <div className="container">
            <div className="nk-banner-wrap">
              <div className="nk-banner-content position-relative">
                <div className="row align-items-center justify-content-around">
                  <div className="col-xl-5">
                    <div className="nk-frame text-center mb-7 mb-xl-0">
                      <img
                        src="images/shop/banner-cover.png"
                        alt="banner-cover"
                        data-aos="zoom-in"
                      />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="text-center text-xl-start">
                      <div className="mb-5">
                        <h1 className="text-capitalize display-6 mb-2">
                          MEGA DEAL
                        </h1>
                        <p className="m-0 text-gray-800">
                          {" "}
                          Hurry and get discounts on selected products up to 60%{" "}
                        </p>
                      </div>
                      <Countdown targetDate={megaDealTime} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="nk-section nk-section-products">
          <div className="container">
            <div className="nk-section-content">
              <div className="row">
                <div className="col-lg-3">
                  <div className="nk-section-content-sidebar">
                    <div className="mb-4">
                      <form data-action="#">
                        <div className="form-group nk-newsletter-three">
                          <div className="form-control-wrap">
                            <div className="icon">
                              <em className="icon ni ni-search"></em>
                            </div>
                            <input
                              type="search"
                              name="search"
                              className="form-control py-2 ps-7 border"
                              placeholder="search for trading products"
                              required
                              onChange={handlesearchProducts}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="d-flex flex-column gap-5">
                      <div>
                        <h6 className="mb-3">Trading Materials</h6>
                        <ul className="d-flex gy-4 flex-column">
                          <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="category"
                                id="all-category"
                                onChange={() => addFilterProducts("all", 0)}
                                checked={filteredProducts["all"]}
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <label
                                  className="form-check-label fs-14 text-gray-1200"
                                  for="all-category"
                                >
                                  All Trading Materials
                                </label>
                                <span className="fs-14 text-gray-1200">
                                  {singleProductsCount}
                                </span>
                              </div>
                            </div>
                          </li>
                          {products?.sub_categories?.map((product, ind) => (
                            <>
                              {product?.combo == 0 && (
                                <li key={`single-${ind}`}>
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="category"
                                      id="tablet"
                                      onChange={() =>
                                        addFilterProducts(
                                          product?.name,
                                          product?.id
                                        )
                                      }
                                      checked={filteredProducts[product?.name]}
                                    />
                                    <div className="d-flex w-100 align-items-center justify-content-between">
                                      <label
                                        className="form-check-label fs-14 text-gray-1200"
                                        for="tablet"
                                      >
                                        {product?.name}
                                      </label>
                                      <span className="fs-14 text-gray-1200">
                                        {product?.product_count}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="mb-3">Bundles</h6>
                        <ul className="d-flex gy-4 flex-column">
                          <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="brand"
                                id="themenio"
                                onChange={() => filtersubcatProducts("all", 0)}
                                checked={filteredSubcatProducts["all"]}
                              />
                              <label
                                className="form-check-label fs-14 text-gray-1200"
                                for="themenio"
                              >
                                {" "}
                                All Trading Materials Pack on Shop{" "}
                              </label>
                              {/* <span className="fs-14 text-gray-1200">
                                  {bundleProductCount}
                                </span> */}
                            </div>
                          </li>
                          {products?.sub_categories?.map((product, ind) => (
                            <>
                              {product?.combo == 1 && (
                                <li key={`combo-${ind}`}>
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="category"
                                      id="tablet"
                                      onClick={() => {
                                        filtersubcatProducts(
                                          product?.name,
                                          product?.id
                                        );
                                      }}
                                      checked={
                                        filteredSubcatProducts[product?.name]
                                      }
                                    />
                                    <div className="d-flex w-100 align-items-center justify-content-between">
                                      <label
                                        className="form-check-label fs-14 text-gray-1200"
                                        for="tablet"
                                      >
                                        {product?.name}
                                      </label>
                                      <span className="fs-14 text-gray-1200">
                                        {product?.product_count}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="mb-3">Stock Status</h6>
                        <ul className="d-flex gy-4 flex-column">
                          <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="stock"
                                id="in-stock"
                                onChange={filterstockProducts}
                                
                                checked = {stockCount === "inStock" ? true : false}
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <label
                                  className="form-check-label fs-14 text-gray-1200"
                                  for="in-stock"
                                >
                                  In Stock
                                </label>
                                <span className="fs-14 text-gray-1200">
                                  {products?.inStock}
                                </span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="stock"
                                id="out-stock"
                                onChange={filterstockProducts}
                                checked = {stockCount === "outStock" ? true : false}
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <label
                                  className="form-check-label fs-14 text-gray-1200"
                                  for="out-stock"
                                >
                                  Out Of Stock
                                </label>
                                <span className="fs-14 text-gray-1200">
                                  {products?.outStock}
                                </span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="nk-section-content-products">
                    <div className="row justify-content-between align-items-center pb-5">
                      <div className="col-sm-6">
                        {isSearchResult && <h6 className="fs-16 fw-normal">
                          Showing  {resultsCount} results
                        </h6>}
                      </div>
                      <div className="col-sm-4 col-md-3 col-xl-2">
                        <div className="nk-dropdown py-1 ps-2 pe-1 border rounded">
                          <input
                            type="checkbox"
                            className="nk-dropdown-field"
                            id="nk-sorting"
                            hidden
                          />
                          <label for="nk-sorting" className="nk-dropdown-menu">
                            <ul
                              className="nk-dropdown-filter"
                              role="listbox"
                              tabindex="-1"
                            >
                              <li
                                className="nk-dropdown-filter-selected"
                                aria-selected="true"
                              >
                                <span className="fs-14 text-gray-1200">
                                  Default Sorting
                                </span>
                              </li>
                              <li>
                                <ul className="nk-dropdown-select">
                                  <li
                                    className="nk-dropdown-select-option py-2"
                                    role="option"
                                  >
                                    <span className="fs-14 text-gray-1200" onClick={()=>{handleSortingProducts("Popular")}}>
                                      Popular
                                    </span>
                                  </li>
                                  <li
                                    className="nk-dropdown-select-option py-2"
                                    role="option"
                                  >
                                    <span className="fs-14 text-gray-1200" onClick={()=>{handleSortingProducts("Popular")}}>
                                      Newest
                                    </span>
                                  </li>
                                  <li
                                    className="nk-dropdown-select-option py-2"
                                    role="option"
                                  >
                                    <span className="fs-14 text-gray-1200" onClick={()=>{handleSortingProducts("Popular")}}>
                                      Oldest
                                    </span>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row gy-5">
                      {isNoProducts && <p className="font-bold">No products to Display</p>}
                      {(products !== {} && !isNoProducts)&&
                        allProducts?.map((product, ind) => {
                          if (product?.combo === 0 || product?.combo === 1 || isSearchResult) {
                            return (
                              <div className="col-md-6 col-xl-4" id={`img-${product?.id}`}>
                                <div className="nk-card overflow-hidden rounded-3 h-100 border" >
                                  <div className="nk-card-img">
                                    <a href={`/product-detail/${product?.id}`}>
                                      <img
                                      
                                        src={product?.img_1}
                                        alt="product-image"
                                        className="w-100"
                                      />
                                    </a>
                                  </div>
                                  <div className="nk-card-info bg-white p-4">
                                    {/* <a
                              href="/"
                              className="d-inline-block mb-1 line-clamp-1 h5"
                            >
                               {product?.name}
                            </a> */}
                                    <a
                                      href={`/product-detail/${product?.id}`}
                                      className="d-inline-block mb-1 line-clamp-1 h5"
                                    >
                                      {product?.name}
                                      <br />
                                      <span className="text-xs !mt-1">
                                        <p
                                        onClick={()=>{
                                          navigate(`/product-detail/${product?.id}`);
                                          dispatch(showLoader())}}
                                          className="!mt-5 text-gray-700"
                                          dangerouslySetInnerHTML={{
                                            __html: product?.description,
                                          }}
                                        />
                                      </span>
                                    </a>
                                    <div className="d-flex align-items-center mb-2 gap-1">
                                      {ratingStars(product?.rating)}

                                      <span className="fs-14 text-gray-800">
                                        {" "}
                                        (7 Reviews){" "}
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-start">
                                      {product?.prices?.map((price, ind) => (
                                        <p className="fs-18 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                                          {price?.USD && 
                                            `$${Number.parseFloat(
                                              price?.USD
                                            ).toFixed(2)}`}
                                          {price?.USD && (
                                            <del className="text-gray-800 !ml-2">
                                              $
                                              {getRandomNumberWithOffset(
                                                Number.parseFloat(
                                                  price?.USD
                                                ).toFixed(2)
                                              )}
                                            </del>
                                          )}
                                        </p>
                                      ))}

                                      {/* product animation starts */}
                                      {/* {animateProductId === product?.id && (
                                        <AnimatedDiv>

  {/* Render the animated product image */}
  {/* <img
    src={product?.img_1}
    alt="Animated Product"
    className="w-24 h-24 object-contain"
    // style={{transition: "transform 0.3s ease-out infinite"}}
  /> */}
{/* </AnimatedDiv> */}

      {/* )} */}
                                      {/* product animation ends */}

                                      <button className="p-0 border-0 outline-none bg-transparent text-primary !content-right w-full text-right" onClick={(event)=>{
                                        return isLoggedIn ? (handleAddToCart(product?.id),handleCartPosition(event)) : setShowPopup(true)
                                      }}>
                                        <em className="icon ni ni-cart text-3xl" onClick={(event)=>{
                                        return isLoggedIn ? (handleAddToCart(product?.id),handleCartPosition(event)) : setShowPopup(true)
                                      }} ></em>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="nk-section  pt-lg-0">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="nk-section-head">
                  <h2 className="nk-section-title">Trading Bundles</h2>
                </div>
              </div>
            </div>
            <div className="row gy-5 justify-center">
              {subCatProducts?.length !== 0 &&
                subCatProducts?.map((product, indx) => {
                  if (product?.combo) {
                    return (
                      // product?.getproducts?.map((comboProduct, n)=>(
                      <div
                        className="col-xl-4 col-lg-4 col-md-6"
                        data-aos="fade-up"
                        data-aos-delay="0"
                      >
                        <div className="nk-card overflow-hidden rounded-3 border h-100" >
                          <div className="nk-card-img">
                            <a href={`/product-detail/${product?.id}`}>
                              <img
                                src={product?.img_1}
                                alt="product-image"
                                className="w-100"
                              />
                            </a>
                          </div>
                          <div className="nk-card-info bg-white p-4">
                            <a
                               href={`/product-detail/${product?.id}`}
                              className="d-inline-block mb-1 line-clamp-1 h5"
                            >
                              {product?.name}
                              <br />
                              <span className="text-xs">
                                <p onClick={()=>{
                                  navigate(`/product-detail/${product?.id}`);
                                  dispatch(showLoader())}}
                                  dangerouslySetInnerHTML={{
                                    __html: product?.description,
                                  }}
                                />
                              </span>
                            </a>
                            <div className="d-flex align-items-center mb-2 gap-1">
                              {ratingStars(5)}
                              <span className="fs-14 text-gray-800">
                                {" "}
                                (7 Reviews){" "}
                              </span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                            {product?.prices?.map((price, ind) => (
                                        <p className="fs-18 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                                          {price?.USD && 
                                            `$${Number.parseFloat(
                                              price?.USD
                                            ).toFixed(2)}`}
                                          {price?.USD && (
                                            <del className="text-gray-800 !ml-2">
                                              $
                                              {getRandomNumberWithOffset(
                                                Number.parseFloat(
                                                  price?.USD
                                                ).toFixed(2)
                                              )}
                                            </del>
                                          )}
                                        </p>
                                      ))}
                              <button className="p-0 border-0 outline-none bg-transparent text-primary !content-right w-full text-right" onClick={()=>{
                                        return isLoggedIn ? navigate("/cart") : setShowPopup(true)
                                      }}>
                                        <em className="icon ni ni-cart text-3xl" onClick={()=>{
                                        return isLoggedIn ? navigate("/cart") : setShowPopup(true)
                                      }} ></em>
                                      </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      // ))
                    );
                  }
                })}
            </div>
          </div>
        </section>

        <section className="nk-section nk-cta-section">
          <div className="container">
            <div
              className="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="row g-gs align-items-center">
                <div className="col-lg-8">
                  <div className="media-group flex-column flex-lg-row align-items-center">
                    <div className="media media-lg media-circle media-middle text-bg-white text-primary mb-2 mb-lg-0 me-lg-2">
                      <em className="icon ni ni-chat-fill"></em>
                    </div>
                    <div className="text-center text-lg-start">
                      <h3 className="text-capitalize m-0">
                        Chat with our support team!
                      </h3>
                      <p className="fs-16 opacity-75">
                        Get in touch with our support team if you still can’t
                        find your answer.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                  <a href="/" className="btn btn-white fw-semiBold">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="nk-sticky-badge">
        <ul>
            <li><a href="/" className="nk-sticky-badge-icon nk-sticky-badge-home" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="nk-tooltip" data-bs-title="View Demo"><em class="icon ni ni-home-fill"></em></a></li>
            <li><a onClick={()=>navigate("/cart")} className="nk-sticky-badge-icon nk-sticky-badge-purchase" id="cart-button"  data-bs-toggle="tooltip" data-bs-custom-class="nk-tooltip" data-bs-title="Purchase Now" aria-label="Purchase Now"><em class="icon ni ni-cart-fill"></em></a></li>
        </ul>
    </div>
    </>
  );
}
