import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts, filteredProductsByIds } from "../../../features/products/productsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { loginUser, logoutUser } from "../../../features/login/loginSlice";
import { updatePositions } from "../../../features/positions/positionsSlice";
import axios from "axios";
import { updateUsers } from "../../../features/users/userSlice";
import { updateCart } from "../../../features/cartItems/cartSlice";
import {
  updateCartCount,
  updateWishListCount,
} from "../../../features/cartWish/focusedCount";
// import GitHubForkRibbon from "react-github-fork-ribbon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { FaRegHeart } from "react-icons/fa";
import { Box, Divider, Skeleton } from "@mui/material";
import AddToFav from "../modals/addToFav";
import CryptoJS from "crypto-js";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SessionExpired from "../modals/sessionExpired";
import Dashboard from "../commonDashboard/Dashboard";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import { Dropdown } from "react-bootstrap";

export default function ProductsDisplay() {
  const { t } = useTranslation();
  const products = useSelector((state) => state?.products?.value);
  const loaderState = useSelector((state) => state?.loader?.value);
  const isLoggedIn = useSelector((state) => state?.login?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  const subId = useSelector((state) => state?.subId?.value);
  const userData = useSelector((state) => state?.user?.value);
  const [showWishlistRemoveMsg, setShowWishlistRemoveMsg] = useState(false);
  const [singleProductsCount, setSingleProductsCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [bundleProductCount, setBundleProductCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState({});
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [subCatProducts, setSubCatProducts] = useState([]);
  const [bundleSubCategoryIDs, setBundleSubCategoryIds] = useState([]);
  const [filteredSubcatProducts, setFilteredSubcatproducts] = useState({});
  const [sorting, setSorting] = useState("Newest");
  const [stockCount, setStockCount] = useState("inStock");
  const [isSearchResult, setIsSearchResult] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);
  const [isNoProducts, setIsNoProducts] = useState(false);
  const [showPlaceHolderLoader, setShowPlaceHolderLoader] = useState(false);
  const [addedToFavImg, setAddedToFavImg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [animateProductId, setAnimateProductId] = useState("");
  const [filteredResult, setFilteredResult] = useState(false);
  const [filteredBundleResult, setFilteredBundleResults] = useState(false);
  const [showSessionExppiry, setShowSessionExpiry] = useState(false);
  const [currentUserlang, setCurrentUserLang] = useState(
    localStorage.getItem("i18nextLng")
  );

  const location = useLocation();
  const navigate = useNavigate();
  const positions = useSelector((state) => state?.position?.value);
  console.log(positions, positions?.cartTop, positions?.cartRight);
  const dispatch = useDispatch();
  console.log(location?.search);

  useEffect(() => {
    setCurrentUserLang(localStorage.getItem("i18nextLng"));
  }, [userLang]);

  useEffect(() => {
    setCurrentUserLang(localStorage.getItem("i18nextLng"));
  }, [userLang]);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (location.search === "?login") {
      navigate(`/login`);
    }
  }, [location, window]);

  const getUserInfo = async () => {
    try {
      dispatch(showLoader());
      setShowWishlistRemoveMsg(false);
      const response = await axios.get(
        "https://admin.tradingmaterials.com/api/client/get-user-info",
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        console.log(response?.data);
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        dispatch(updateCartCount(response?.data?.data?.client?.cart_count));
        dispatch(
          updateWishListCount(response?.data?.data?.client?.wishlist_count)
        );
      } else {
        console.log(response?.data);

        dispatch(logoutUser());
        localStorage.removeItem("client_token");
        // setShowSessionExpiry(true)
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    setShowPlaceHolderLoader(true);
    setAllProducts(products);
    console.log("inside 2");
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

    products?.sub_categories?.map((product) => {
      console.log(product);
      productsFilter[product?.name] = false;
    });
    productsFilter["all"] = true;
    console.log(productsFilter);
    setFilteredProducts({ ...productsFilter });
    setFilteredSubcatproducts({ ...productsFilter });
    setAllProducts(products?.products);
    setFilteredResult(false);
    if (localStorage?.getItem("client_token")) {
      dispatch(loginUser());
    } else {
      dispatch(logoutUser());
    }
    setShowPlaceHolderLoader(false);
    
  }, [products]);

  useEffect(() => {
    fetchProducts()
  },[])

  //useEffect for filtering products from the header (global scope)
  useEffect(() => {
    setSubCategoryIds([]);
    if (subId?.id) {
      console.log("inside");
      setSubCategoryIds([subId?.id]);
      if (subId?.type === "single") {
        addFilterProducts(subId?.name, subId?.id);
      } else if (subId?.type === "combo") {
        filtersubcatProducts(subId?.name, subId?.id);
      }
    }
  }, [subId, products]);

  //function for review stars
  function ratingStars(number) {
    const elemetns = Array.from({ length: 5 }, (_, index) => (
      <>
        {index + 1 <= number && (
          <li key={index}>
            <em className="icon ni ni-star-fill text-yellow"></em>
          </li>
        )}
        {index + 1 > number &&
          (index + 1 - number !== 0 && index + 1 - number < 1 ? (
            <li key={index}>
              <em className="icon ni ni-star-half-fill text-yellow"></em>
            </li>
          ) : (
            <li key={index}>
              <em className="icon ni ni-star-fill text-gray-700 "></em>
            </li>
          ))}
      </>
    ));

    return <ul className="d-flex align-items-center">{elemetns}</ul>;
  }

  // sorting products based on prices
    const fetchProducts = async () => {
      // Fetch the data from the API.
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
        response.data.data.products.sort((a, b) => {
          // Convert prices to numbers and compare them
          const priceA = a.prices[0].INR;
          const priceB = b.prices[0].INR;
          return parseInt(priceA) - parseInt(priceB);
        });

        dispatch(fetchAllProducts(response.data.data));
        return response.data.data;
      } catch (err) {
        console.log(err);
      }
    };

  // function for filtering single products
  function addFilterProducts(subCategoryName, subCategoryId) {
    setStockCount("inStock");
    setFilteredResult(true);
    setShowPlaceHolderLoader(true);
    console.log(subCategoryName, subCategoryId, subCategoryIds, subId);
    const subIDs = [...subCategoryIds];
    let filterProducts = { ...filteredProducts };
    console.log(subIDs, filterProducts, subId?.name);

    // toggles checked or not
    filterProducts[`${subCategoryName}`] = filterProducts[`${subCategoryName}`]
      ? false
      : true;

    const ind = subIDs.indexOf(subCategoryId);
    console.log(ind);
    if (ind !== -1) {
      subIDs?.splice(ind, 1);
      const fp = filteredProductsByIds(products, subIDs);
      console.log(fp);

      setAllProducts(fp);
    }

    if (filterProducts[subCategoryName]) {
      console.log(subCategoryName, filterProducts);
      subIDs.push(subCategoryId);

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
    console.log(filterProducts);
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
    console.log(filterProducts);
    console.log(subCategoryName);
    if (subCategoryName === "all") {
      const keys = Object.keys(filterProducts);
      // Iterate through the keys and set all values to false except for the "all" key
      keys.forEach((key) => {
        filterProducts[key] = key === "all" ? true : false;
      });
      setSubCategoryIds([]);
      setFilteredResult(false);
      setAllProducts(products?.products);
    }
    console.log(filterProducts);
    setFilteredProducts({ ...filterProducts });
    setShowPlaceHolderLoader(false);
  }

  // filtering buldle products
  function filtersubcatProducts(subCategoryName, subCategoryId) {
    setStockCount("inStock");
    setFilteredBundleResults(true);
    setFilteredResult(false);
    setShowPlaceHolderLoader(true);
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

      console.log(subIDs);
      const fp = filteredProductsByIds(products, subIDs);
      console.log(fp);
      setSubCatProducts(fp);
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
      setFilteredBundleResults(false);
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
      setFilteredBundleResults(false);
      setBundleSubCategoryIds([]);
      setSubCatProducts(products?.products);

      // const allProducts = products
    }
    setFilteredSubcatproducts({ ...filterProducts });
    navigate(`${userLang}/products/#trading_bundles`);
    setShowPlaceHolderLoader(false);
  }

  //function for handling filtering based on in stock or out stock
  function filterstockProducts() {
    filtersubcatProducts("all", 0);
    addFilterProducts("all", 0);
    let currentActiveCheckbox;
    if (stockCount === "inStock") {
      setStockCount("outStock");
      currentActiveCheckbox = "outStock";
    } else {
      setStockCount("inStock");
      currentActiveCheckbox = "inStock";
    }

    const completeProducts = products?.products;
    const outOfStockBundleProducts = products?.sub_categories;
    console.log(completeProducts, typeof completeProducts);
    const res =
      currentActiveCheckbox === "inStock"
        ? completeProducts?.filter((product) => product?.stock?.stock > 0)
        : completeProducts?.filter((product) => product?.stock?.stock == "0");
    // const result =
    //   currentActiveCheckbox === "inStock"
    //     ? outOfStockBundleProducts?.filter(
    //         (product) => product?.combo == 1 && product?.product_count > 0
    //       )
    //     : outOfStockBundleProducts?.filter(
    //         (product) => product?.combo == 1
    //       );
    setAllProducts(res);
    const bundleRes =
      currentActiveCheckbox === "inStock"
        ? outOfStockBundleProducts?.filter(
            (product) => product?.stock?.stock != "0" && product?.combo == "1"
          )
        : outOfStockBundleProducts?.filter(
            (product) => product?.stock?.stock == "0" && product?.combo == "1"
          );
    setSubCatProducts(bundleRes);

    console.log(res);
  }
  // function for handling products search
  function handlesearchProducts(e) {
    const searchText = e.target.value;
    if (searchText?.length > 0) {
      setShowPlaceHolderLoader(true);
      setIsSearchResult(true);
    } else {
      setIsSearchResult(false);
    }
    const completeProducts = products?.products;
    setTimeout(() => {
      const res = completeProducts?.filter((product) =>
        product?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
      );
      console.log(res);
      setResultsCount(res?.length);
      setAllProducts(res);
      if (res?.length === 0) {
        setIsNoProducts(true);
      } else {
        setIsNoProducts(false);
      }
      setShowPlaceHolderLoader(false);
      navigate("#search_results");
    }, 500);
  }

  function handleSortingProducts(value) {
    setSorting(value);
    // eslint-disable-next-line no-unsafe-optional-chaining
    const combinedProducts = [...products?.products];
    console.log(combinedProducts[0], typeof combinedProducts);
    console.log(combinedProducts, value, "comb-prods");

    // const res = combinedProducts?.sort((a, b) => new Date(a.added_at) - new Date(b.added_at));

    // console.log(res);
    // Output: Sorted array in ascending order based on 'created_at'

    // Sort in descending order based on the 'created_at' property
    if (value === "Oldest") {
      setShowPlaceHolderLoader(true);
      const res = combinedProducts?.sort(
        (b, a) => new Date(a.added_at) - new Date(b.added_at)
      );
      setAllProducts(res);
      console.log(res, "comb-prods");
    } else if (value === "Newest") {
      const res = combinedProducts?.sort(
        (b, a) => new Date(b.added_at) - new Date(a.added_at)
      );
      setAllProducts(res);
      console.log(res);
    }
    setShowPlaceHolderLoader(false);
  }

  async function handleAddToWishList(id, productImg) {
    console.log(id);
    setShowWishlistRemoveMsg(false);
    try {
      dispatch(showLoader());
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/product/add-to-wishlist",
        {
          product_id: id,
          client_id: userData?.client?.id,
        },
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        setAddedToFavImg(productImg);
        setShowModal(true);
        setModalMessage("Added to your wishlist successfully");
        dispatch(updateWishListCount(response?.data?.data?.wishlist_count));
        getUserInfo();
      }
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message?.includes("Token")) {
        localStorage.removeItem("client_token");
        dispatch(logoutUser());
        setShowSessionExpiry(true);
      }
    } finally {
      dispatch(hideLoader());
    }
  }

  // function for handling add to cart animation
  async function handleAddToCart(productId, productImg) {
    try {
      // setAnimateProductId(productId);
      dispatch(showLoader());
      const response = await axios?.post(
        "https://admin.tradingmaterials.com/api/client/product/add-to-cart",
        {
          product_id: productId,
          qty: 1,
          client_id: userData?.client?.id,
        },
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        setAddedToFavImg(productImg);
        setShowModal(true);
        setModalMessage("Added to your Cart successfully");
        dispatch(updateWishListCount(response?.data?.data?.wishlist_count));
        dispatch(updateCart(response?.data?.data?.cart_details));
        dispatch(updateCartCount(response?.data?.data?.cart_count));
        getUserInfo(productId);
        if (userData?.client?.wishlist?.length > 0) {
          const ids = userData?.client?.wishlist?.map(
            (item) => item?.product_id
          );
          const isPresent = ids?.includes(productId);
          console.log(isPresent, ids, productId, "prest");
          if (isPresent) {
            dispatch(
              updateWishListCount(userData?.client?.wishlist?.length - 1)
            );
            setShowWishlistRemoveMsg(true);
          } else {
            setShowWishlistRemoveMsg(false);
          }
        }
      }
    } catch (err) {
      if (err?.response?.data?.message?.includes("Token")) {
        localStorage.removeItem("client_token");
        dispatch(logoutUser());
        setShowSessionExpiry(true);
      }
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  }

  const handleCartPosition = () => {
    const cartButtonRect = document
      ?.getElementById(`img-4`)
      ?.getBoundingClientRect();
    const top = cartButtonRect?.top;
    const right = cartButtonRect?.left;
    dispatch(
      updatePositions({
        cartTop: positions?.cartTop,
        cartRight: positions?.cartRight,
        productTop: top,
        productRight: right,
      })
    );
  };
  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
    setAddedToFavImg("");
  };

  function handleSessionExpiryClose() {
    setShowSessionExpiry(false);
    navigate("/login");
  }

  // const handleChange = (event) => {
  //   handleSortingProducts(event.target.value);
  // };

  return (
    <>
      <SessionExpired
        open={showSessionExppiry}
        handleClose={handleSessionExpiryClose}
      />

      {loaderState && (
        <div className="preloader !backdrop-blur-[1px] ">
          <div className="loader"></div>
        </div>
      )}
      {isLoggedIn && <Dashboard />}
      {addedToFavImg !== "" && (
        <AddToFav
          showModal={showModal}
          closeModal={closeModal}
          modalMessage={modalMessage}
          addedToFavImg={addedToFavImg}
          wishMsg={showWishlistRemoveMsg}
        />
      )}
      {}
      <div className={`nk-pages ${isLoggedIn ? "" : "mt-8"}`}>
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
                              <em className="icon ni ni-search cursor-pointer"></em>
                            </div>
                            <input
                              type="search"
                              name="search"
                              className="form-control  !py-2 !ps-10 border"
                              placeholder={t("product_search")}
                              onChange={handlesearchProducts}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="d-flex flex-column gap-5">
                      <div>
                        <h6 className="mb-3 text-xl !font-bold text-left ">
                          {t("Trading_Materials")}
                        </h6>
                        <ul className="d-flex gy-4 flex-column !text-left">
                          <li>
                            <div className="form-check d-flex align-items-center cursor-pointer">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="category"
                                id="all-category"
                                onChange={() =>
                                  addFilterProducts("all", 0, false)
                                }
                                checked={filteredProducts["all"]}
                              />
                              <div
                                className="d-flex w-100 align-items-center justify-content-between cursor-pointer"
                                onClick={() =>
                                  addFilterProducts("all", 0, false)
                                }
                              >
                                <label
                                  className="form-check-label fs-14 text-gray-1200 cursor-pointer"
                                  onClick={() =>
                                    addFilterProducts("all", 0, false)
                                  }
                                  htmlFor="all-category"
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
                                      onClick={() =>
                                        addFilterProducts(
                                          product?.name,
                                          product?.id,
                                          false
                                        )
                                      }
                                      checked={filteredProducts[product?.name]}
                                    />
                                    <div className="d-flex w-100 align-items-center justify-content-between">
                                      <label
                                        className="form-check-label fs-14 text-gray-1200 cursor-pointer"
                                        onClick={() =>
                                          addFilterProducts(
                                            product?.name,
                                            product?.id,
                                            false
                                          )
                                        }
                                        // for="tablet"
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
                        <h6 className="mb-3 text-xl !font-bold text-left ">
                          {t("Bundles")}
                        </h6>
                        <ul className="d-flex gy-4 flex-column">
                          <li>
                            <div
                              className="form-check d-flex align-items-center cursor-pointer"
                              onClick={() => filtersubcatProducts("all", 0)}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="brand"
                                id="themenio"
                                onChange={() => filtersubcatProducts("all", 0)}
                                checked={filteredSubcatProducts["all"]}
                              />
                              <div
                                className="d-flex w-100 align-items-center justify-content-between"
                                onClick={() => filtersubcatProducts("all", 0)}
                              >
                                <label
                                  className="form-check-label fs-14 text-gray-1200 cursor-pointer"
                                  // for="themenio"
                                  onClick={() => filteredSubcatProducts["all"]}
                                >
                                  {" "}
                                  All Trading Materials Pack on Shop{" "}
                                </label>
                                <span className="fs-14 text-gray-1200">
                                  {bundleProductCount}
                                </span>
                              </div>
                            </div>
                          </li>
                          {products?.sub_categories?.map((product, ind) => (
                            <>
                              {product?.combo == 1 && (
                                <li id="bundles" key={`combo-${ind}`}>
                                  <div className="form-check d-flex align-items-center cursor-pointer">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="category"
                                      id="bundle-combo"
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
                                    <div
                                      className="d-flex w-100 align-items-center justify-content-between "
                                      onClick={() => {
                                        filtersubcatProducts(
                                          product?.name,
                                          product?.id
                                        );
                                      }}
                                    >
                                      <label
                                        className="form-check-label fs-14 text-gray-1200 cursor-pointer"
                                        // for="tablet"
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
                        <h6 className="mb-3 text-xl !font-bold text-left ">
                          {t("stock_status")}
                        </h6>
                        <ul className="d-flex gy-4 flex-column">
                          <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="stock"
                                id="in-stock"
                                onChange={() => filterstockProducts("inStock")}
                                checked={
                                  stockCount === "inStock" ? true : false
                                }
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <label
                                  className="form-check-label fs-14 text-gray-1200 cursor-pointer"
                                  htmlFor="in-stock"
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
                                onChange={() => filterstockProducts("outStock")}
                                checked={
                                  stockCount === "outStock" ? true : false
                                }
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between ">
                                <label
                                  className="form-check-label fs-14 text-gray-1200 cursor-pointer"
                                  htmlFor="out-stock"
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
                <Divider className="my-2 md:hidden" />
                <div className="col-lg-9" id="search_results">
                  <div className="nk-section-content-products" id="products">
                    <div className="row justify-content-between align-items-center pb-5">
                      <div className="col-sm-6">
                        {!isSearchResult && (
                          <p className="text-left text-xl font-semibold text-black">
                            Our Products
                          </p>
                        )}
                        {isSearchResult && (
                          <h6 className="fs-16 fw-normal !text-left">
                            Showing {resultsCount} results
                          </h6>
                        )}
                      </div>
                      <div className="col-sm-4 col-md-3 col-xl-2">
                        <div className="nk-dropdown py-1 ps-2 pe-1">
                          <Dropdown className="border rounded-sm">
                            <Dropdown.Toggle
                              variant="outline"
                              className="w-full text-start flex"
                              // displayEmpty
                              defaultValue={sorting}
                            >
                              {sorting}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                value={"Popular"}
                                onClick={() => handleSortingProducts("Popular")}
                              >
                                Popular
                              </Dropdown.Item>
                              <Dropdown.Item
                                value={"Newest"}
                                onClick={() => handleSortingProducts("Newest")}
                              >
                                Newest
                              </Dropdown.Item>
                              <Dropdown.Item
                                value={"Oldest"}
                                onClick={() => handleSortingProducts("Oldest")}
                              >
                                Oldest
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                    {isNoProducts ||
                      (!products?.products?.length && (
                        <>
                          <div className="row gy-5 " data-aos-delay="0">
                            <div className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]">
                              <Box sx={{ pt: 0.5 }}>
                                <div className="nk-card overflow-hidden rounded-3 h-100 border text-left">
                                  <Skeleton
                                    animation="wave"
                                    variant="rectangular"
                                    className="!w-full !h-[250px] sm:!h-[300px] "
                                    width="100%"
                                  />
                                  {/* <Skeleton animation="wave" /> */}
                                  <Skeleton
                                    animation="wave"
                                    width="80%"
                                    className="!mt-[2.5vh]"
                                  />
                                  <div className="flex !mt-[2.5vh]">
                                    <Skeleton
                                      animation="wave"
                                      width="30%"
                                      className="mr-3"
                                    />
                                    <Skeleton animation="wave" width="20%" />
                                  </div>
                                  <div className="flex mt-2 mb-2  !w-full">
                                    <Skeleton
                                      className="mr-2"
                                      animation="wave"
                                      width="50%"
                                    />
                                    <Skeleton
                                      className="mr-2"
                                      animation="wave"
                                      width="50%"
                                    />
                                    <div className="flex !justify-end !w-full">
                                      <Skeleton
                                        animation="wave"
                                        width="20%"
                                        className="mr-2 ml-4"
                                      />
                                      <Skeleton animation="wave" width="20%" />
                                    </div>
                                  </div>
                                </div>
                              </Box>
                            </div>
                            <div className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]">
                              <Box sx={{ pt: 0.5 }}>
                                <div className="nk-card overflow-hidden rounded-3 h-100 border text-left">
                                  <Skeleton
                                    animation="wave"
                                    variant="rectangular"
                                    className="!w-full !h-[250px] sm:!h-[300px] "
                                    width="100%"
                                  />
                                  {/* <Skeleton animation="wave" /> */}
                                  <Skeleton
                                    animation="wave"
                                    width="80%"
                                    className="!mt-[2.5vh]"
                                  />
                                  <div className="flex !mt-[2.5vh]">
                                    <Skeleton
                                      animation="wave"
                                      width="30%"
                                      className="mr-3"
                                    />
                                    <Skeleton animation="wave" width="20%" />
                                  </div>
                                  <div className="flex mt-2 mb-2  !w-full">
                                    <Skeleton
                                      className="mr-2"
                                      animation="wave"
                                      width="50%"
                                    />
                                    <Skeleton
                                      className="mr-2"
                                      animation="wave"
                                      width="50%"
                                    />
                                    <div className="flex !justify-end !w-full">
                                      <Skeleton
                                        animation="wave"
                                        width="20%"
                                        className="mr-2 ml-4"
                                      />
                                      <Skeleton animation="wave" width="20%" />
                                    </div>
                                  </div>
                                </div>
                              </Box>
                            </div>
                            <div className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]">
                              <Box sx={{ pt: 0.5 }}>
                                <div className="nk-card overflow-hidden rounded-3 h-100 border text-left">
                                  <Skeleton
                                    animation="wave"
                                    variant="rectangular"
                                    className="!w-full !h-[250px] sm:!h-[300px] "
                                    width="100%"
                                  />
                                  <Skeleton
                                    animation="wave"
                                    width="80%"
                                    className="!mt-[2.5vh]"
                                  />
                                  <div className="flex !mt-[2.5vh]">
                                    <Skeleton
                                      animation="wave"
                                      width="30%"
                                      className="mr-3"
                                    />
                                    <Skeleton animation="wave" width="20%" />
                                  </div>
                                  <div className="flex mt-2 mb-2  !w-full">
                                    <Skeleton
                                      className="mr-2"
                                      animation="wave"
                                      width="50%"
                                    />
                                    <Skeleton
                                      className="mr-2"
                                      animation="wave"
                                      width="50%"
                                    />
                                    <div className="flex !justify-end !w-full">
                                      <Skeleton
                                        animation="wave"
                                        width="20%"
                                        className="mr-2 ml-4"
                                      />
                                      <Skeleton animation="wave" width="20%" />
                                    </div>
                                  </div>
                                </div>
                              </Box>
                            </div>
                          </div>
                        </>
                      ))}
                    <div className="row gy-5">
                      {loaderState && isNoProducts && (
                        <>
                          <div className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]">
                            <Box sx={{ pt: 0.5 }}>
                              <div className="nk-card overflow-hidden rounded-3 h-100 border text-left">
                                <Skeleton
                                  animation="wave"
                                  variant="rectangular"
                                  className="!w-full !h-[250px] sm:!h-[300px] "
                                  width="100%"
                                />
                                {/* <Skeleton animation="wave" /> */}
                                <Skeleton
                                  animation="wave"
                                  width="80%"
                                  className="!mt-[2.5vh]"
                                />
                                <div className="flex !mt-[2.5vh]">
                                  <Skeleton
                                    animation="wave"
                                    width="30%"
                                    className="mr-3"
                                  />
                                  <Skeleton animation="wave" width="20%" />
                                </div>
                                <div className="flex mt-2 mb-2  !w-full">
                                  <Skeleton
                                    className="mr-2"
                                    animation="wave"
                                    width="50%"
                                  />
                                  <Skeleton
                                    className="mr-2"
                                    animation="wave"
                                    width="50%"
                                  />
                                  <div className="flex !justify-end !w-full">
                                    <Skeleton
                                      animation="wave"
                                      width="20%"
                                      className="mr-2 ml-4"
                                    />
                                    <Skeleton animation="wave" width="20%" />
                                  </div>
                                </div>
                              </div>
                            </Box>
                          </div>
                          <div className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]">
                            <Box sx={{ pt: 0.5 }}>
                              <div className="nk-card overflow-hidden rounded-3 h-100 border text-left">
                                <Skeleton
                                  animation="wave"
                                  variant="rectangular"
                                  className="!w-full !h-[250px] sm:!h-[300px] "
                                  width="100%"
                                />
                                {/* <Skeleton animation="wave" /> */}
                                <Skeleton
                                  animation="wave"
                                  width="80%"
                                  className="!mt-[2.5vh]"
                                />
                                <div className="flex !mt-[2.5vh]">
                                  <Skeleton
                                    animation="wave"
                                    width="30%"
                                    className="mr-3"
                                  />
                                  <Skeleton animation="wave" width="20%" />
                                </div>
                                <div className="flex mt-2 mb-2  !w-full">
                                  <Skeleton
                                    className="mr-2"
                                    animation="wave"
                                    width="50%"
                                  />
                                  <Skeleton
                                    className="mr-2"
                                    animation="wave"
                                    width="50%"
                                  />
                                  <div className="flex !justify-end !w-full">
                                    <Skeleton
                                      animation="wave"
                                      width="20%"
                                      className="mr-2 ml-4"
                                    />
                                    <Skeleton animation="wave" width="20%" />
                                  </div>
                                </div>
                              </div>
                            </Box>
                          </div>
                          <div className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]">
                            <Box sx={{ pt: 0.5 }}>
                              <div className="nk-card overflow-hidden rounded-3 h-100 border text-left">
                                <Skeleton
                                  animation="wave"
                                  variant="rectangular"
                                  className="!w-full !h-[250px] sm:!h-[300px] "
                                  width="100%"
                                />
                                {/* <Skeleton animation="wave" /> */}
                                <Skeleton
                                  animation="wave"
                                  width="80%"
                                  className="!mt-[2.5vh]"
                                />
                                <div className="flex !mt-[2.5vh]">
                                  <Skeleton
                                    animation="wave"
                                    width="30%"
                                    className="mr-3"
                                  />
                                  <Skeleton animation="wave" width="20%" />
                                </div>
                                <div className="flex mt-2 mb-2  !w-full">
                                  <Skeleton
                                    className="mr-2"
                                    animation="wave"
                                    width="50%"
                                  />
                                  <Skeleton
                                    className="mr-2"
                                    animation="wave"
                                    width="50%"
                                  />
                                  <div className="flex !justify-end !w-full">
                                    <Skeleton
                                      animation="wave"
                                      width="20%"
                                      className="mr-2 ml-4"
                                    />
                                    <Skeleton animation="wave" width="20%" />
                                  </div>
                                </div>
                              </div>
                            </Box>
                          </div>
                        </>
                      )}
                      {isNoProducts ||
                        (allProducts?.length === 0 && (
                          <p className="font-bold">No products to Display</p>
                        ))}
                      {isSearchResult && resultsCount === 0 && (
                        <p className="font-bold">No products to Display</p>
                      )}
                      {!isNoProducts &&
                        allProducts?.map((product) => {
                          if (
                            (product?.combo == 0 &&
                              (product?.stock?.stock != "0" ||
                                filteredResult ||
                                stockCount == "outStock")) ||
                            // product?.combo === 1 ||
                            isSearchResult
                          ) {
                            return (
                              <>
                                {/* placeholder laoder */}
                                {(showPlaceHolderLoader === true ||
                                  showLoader === true) && (
                                  <div className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]">
                                    <Box sx={{ pt: 0.5 }}>
                                      <div className="nk-card overflow-hidden rounded-3 h-100 border text-left ">
                                        <Skeleton
                                          animation="wave"
                                          variant="rectangular"
                                          className="!w-full !h-[250px] sm:!h-[300px] "
                                          width="100%"
                                        />
                                        {/* <Skeleton animation="wave" /> */}
                                        <Skeleton
                                          animation="wave"
                                          width="80%"
                                          className="!mt-[2.5vh]"
                                        />
                                        <div className="flex !mt-[2.5vh]">
                                          <Skeleton
                                            animation="wave"
                                            width="30%"
                                            className="mr-3"
                                          />
                                          <Skeleton
                                            animation="wave"
                                            width="20%"
                                          />
                                        </div>
                                        <div className="flex mt-2 mb-2  !w-full">
                                          <Skeleton
                                            className="mr-2"
                                            animation="wave"
                                            width="50%"
                                          />
                                          <Skeleton
                                            className="mr-2"
                                            animation="wave"
                                            width="50%"
                                          />
                                          <div className="flex !justify-end !w-full">
                                            <Skeleton
                                              animation="wave"
                                              width="20%"
                                              className="mr-2 ml-4"
                                            />
                                            <Skeleton
                                              animation="wave"
                                              width="20%"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </Box>
                                  </div>
                                )}
                                {showPlaceHolderLoader === false && (
                                  <div
                                    className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px] group hover:drop-shadow-lg"
                                    id={`img-${product?.id}`}
                                  >
                                    <div className="nk-card overflow-hidden rounded-3  border text-left ">
                                      <div
                                        className={`nk-card-img border rounded-md p-3   relative`}
                                      >
                                        <a
                                          href={`${userLang}/product-detail/${
                                            product?.slug
                                          }/${CryptoJS?.AES?.encrypt(
                                            `${product?.id}`,
                                            "trading_materials"
                                          )
                                            ?.toString()
                                            .replace(/\//g, "_")
                                            .replace(/\+/g, "-")}`}
                                        >
                                          <img
                                            src={product?.img_1}
                                            alt="product-image"
                                            className=" !w-full group-hover:scale-105 transition duration-500 rounded-md backdrop-blur-xl bg-white/10"
                                          />
                                        </a>
                                      </div>
                                      <div className="nk-card-info bg-white p-4 pt-1">
                                        <a
                                          href={`${userLang}/product-detail/${
                                            product?.slug
                                          }/${CryptoJS?.AES?.encrypt(
                                            `${product?.id}`,
                                            "trading_materials"
                                          )
                                            ?.toString()
                                            .replace(/\//g, "_")
                                            .replace(/\+/g, "-")}`}
                                          className="d-inline-block text-black !text-sm antialiased"
                                          style={{
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            width: "95%",
                                          }}
                                        >
                                          {product?.name}
                                          {/* <br />
                                          <span className="text-xs !mt-1">
                                            <p
                                              onClick={() => {
                                                navigate(
                                                  `${userLang}/product-detail/${
                                                    product?.slug
                                                  }/${CryptoJS?.AES?.encrypt(
                                                    `${product?.id}`,
                                                    "trading_materials"
                                                  )
                                                    ?.toString()
                                                    .replace(/\//g, "_")
                                                    .replace(/\+/g, "-")}`
                                                );
                                                dispatch(showLoader());
                                              }}
                                              className="!mt-5 text-gray-700  truncate"
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  product?.description?.length >
                                                  55
                                                    ? `${product?.description?.slice(
                                                        0,
                                                        55
                                                      )}...`
                                                    : product?.description,
                                              }}
                                            />
                                          </span> */}
                                        </a>
                                        <div className="d-flex align-items-center gap-1">
                                          {ratingStars(product?.rating)}

                                          <span className="fs-14 text-gray-800">
                                            {" "}
                                            ({
                                              product?.total_reviews
                                            } Reviews){" "}
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-start mb-2 ">
                                          {product?.prices?.map((price) => (
                                            <>
                                              {currentUserlang === "en" &&
                                                price?.INR && (
                                                  <p
                                                    className={`fs-16 m-0 text-gray-1200 text-start fw-bold !mr-2  !w-full`}
                                                  >
                                                    {currentUserlang === "en"
                                                      ? price?.INR && (
                                                          <sub
                                                            style={{
                                                              verticalAlign:
                                                                "super",
                                                            }}
                                                          >
                                                            ₹
                                                          </sub>
                                                        )
                                                      : price?.USD && (
                                                          <sub
                                                            style={{
                                                              verticalAlign:
                                                                "super",
                                                            }}
                                                          >
                                                            $
                                                          </sub>
                                                        )}

                                                    {currentUserlang === "en"
                                                      ? price?.INR && (
                                                          <>
                                                            {
                                                              (
                                                                Number.parseFloat(
                                                                  price?.INR
                                                                )?.toFixed(2) +
                                                                ""
                                                              )?.split(".")[0]
                                                            }
                                                            .
                                                            {
                                                              (
                                                                Number.parseFloat(
                                                                  price?.INR
                                                                )?.toFixed(2) +
                                                                ""
                                                              )?.split(".")[1]
                                                            }
                                                          </>
                                                        )
                                                      : price?.USD &&
                                                        `${Number.parseFloat(
                                                          price?.USD
                                                        )}`}

                                                    {currentUserlang === "en" &&
                                                    product?.discount > 0
                                                      ? price?.INR &&
                                                        product?.discount >
                                                          0 && (
                                                          <>
                                                            <del className="text-gray-800 !ml-2">
                                                              {currentUserlang ===
                                                              "en"
                                                                ? price?.INR && (
                                                                    <sub
                                                                      style={{
                                                                        verticalAlign:
                                                                          "super",
                                                                      }}
                                                                    >
                                                                      ₹
                                                                    </sub>
                                                                  )
                                                                : price?.USD && (
                                                                    <sub
                                                                      style={{
                                                                        verticalAlign:
                                                                          "super",
                                                                      }}
                                                                    >
                                                                      $
                                                                    </sub>
                                                                  )}
                                                              {
                                                                (
                                                                  parseFloat(
                                                                    price?.INR *
                                                                      (100 /
                                                                        (100 -
                                                                          product?.discount))
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )
                                                                  .toString()
                                                                  .split(".")[0]
                                                              }
                                                              .
                                                              {
                                                                (
                                                                  parseFloat(
                                                                    price?.INR *
                                                                      (100 /
                                                                        (100 -
                                                                          product?.discount))
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )
                                                                  .toString()
                                                                  .split(".")[1]
                                                              }
                                                            </del>
                                                          </>
                                                        )
                                                      : price?.USD &&
                                                        product?.discount >
                                                          0 && (
                                                          <>
                                                            <del className="text-gray-800 block !ml-2">
                                                              {currentUserlang ===
                                                              "en"
                                                                ? price?.INR && (
                                                                    <sub
                                                                      style={{
                                                                        verticalAlign:
                                                                          "super",
                                                                      }}
                                                                    >
                                                                      ₹
                                                                    </sub>
                                                                  )
                                                                : price?.USD && (
                                                                    <sub
                                                                      style={{
                                                                        verticalAlign:
                                                                          "super",
                                                                      }}
                                                                    >
                                                                      $
                                                                    </sub>
                                                                  )}
                                                              {
                                                                (
                                                                  parseFloat(
                                                                    price?.INR *
                                                                      (100 /
                                                                        (100 -
                                                                          product?.discount))
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )
                                                                  .toString()
                                                                  .split(".")[0]
                                                              }
                                                              .
                                                              {
                                                                (
                                                                  parseFloat(
                                                                    price?.INR *
                                                                      (100 /
                                                                        (100 -
                                                                          product?.discount))
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )
                                                                  .toString()
                                                                  .split(".")[1]
                                                              }
                                                            </del>
                                                          </>
                                                        )}
                                                  </p>
                                                )}
                                              {currentUserlang !== "en" &&
                                                price?.USD && (
                                                  <p
                                                    className={`fs-16 m-0 text-gray-1200 text-start fw-bold !mr-2  !w-full`}
                                                  >
                                                    {currentUserlang === "en"
                                                      ? price?.INR && (
                                                          <sub
                                                            style={{
                                                              verticalAlign:
                                                                "super",
                                                            }}
                                                          >
                                                            ₹
                                                          </sub>
                                                        )
                                                      : price?.USD && (
                                                          <sub
                                                            style={{
                                                              verticalAlign:
                                                                "super",
                                                            }}
                                                          >
                                                            $
                                                          </sub>
                                                        )}

                                                    {currentUserlang === "en"
                                                      ? price?.INR && (
                                                          <>
                                                            {
                                                              (
                                                                parseFloat(
                                                                  price?.INR
                                                                )?.toFixed(2) +
                                                                ""
                                                              )
                                                                .toString()
                                                                .split(".")[0]
                                                            }
                                                            .
                                                            {
                                                              (
                                                                parseFloat(
                                                                  price?.INR
                                                                )?.toFixed(2) +
                                                                ""
                                                              )
                                                                .toString()
                                                                .split(".")[1]
                                                            }
                                                          </>
                                                        )
                                                      : price?.USD && (
                                                          <>
                                                            {
                                                              (
                                                                parseFloat(
                                                                  price?.USD
                                                                )?.toFixed(2) +
                                                                ""
                                                              )
                                                                .toString()
                                                                .split(".")[0]
                                                            }
                                                            .
                                                            {
                                                              (
                                                                parseFloat(
                                                                  price?.USD
                                                                )?.toFixed(2) +
                                                                ""
                                                              )
                                                                .toString()
                                                                .split(".")[1]
                                                            }
                                                          </>
                                                        )}

                                                    {currentUserlang === "en" &&
                                                    product?.discount > 0
                                                      ? price?.INR &&
                                                        product?.discount >
                                                          0 && (
                                                          <>
                                                            <del className="text-gray-800 !ml-2">
                                                              {currentUserlang ===
                                                              "en"
                                                                ? price?.INR && (
                                                                    <sub
                                                                      style={{
                                                                        verticalAlign:
                                                                          "super",
                                                                      }}
                                                                    >
                                                                      ₹
                                                                    </sub>
                                                                  )
                                                                : price?.USD && (
                                                                    <sub
                                                                      style={{
                                                                        verticalAlign:
                                                                          "super",
                                                                      }}
                                                                    >
                                                                      $
                                                                    </sub>
                                                                  )}
                                                              {
                                                                (
                                                                  parseFloat(
                                                                    price?.INR *
                                                                      (100 /
                                                                        (100 -
                                                                          product?.discount))
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )
                                                                  .toString()
                                                                  .split(".")[0]
                                                              }
                                                              {/* <sub
                                                                style={{
                                                                  verticalAlign:
                                                                    "super",
                                                                }}
                                                              > */}
                                                              .
                                                              {
                                                                (
                                                                  parseFloat(
                                                                    price?.INR *
                                                                      (100 /
                                                                        (100 -
                                                                          product?.discount))
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )
                                                                  .toString()
                                                                  .split(".")[1]
                                                              }
                                                              {/* </sub> */}
                                                            </del>
                                                          </>
                                                        )
                                                      : price?.USD &&
                                                        product?.discount >
                                                          0 && (
                                                          <>
                                                            <del className="text-gray-800 !ml-2">
                                                              {currentUserlang ===
                                                              "en"
                                                                ? price?.INR && (
                                                                    <sub
                                                                      style={{
                                                                        verticalAlign:
                                                                          "super",
                                                                      }}
                                                                    >
                                                                      ₹
                                                                    </sub>
                                                                  )
                                                                : price?.USD && (
                                                                    <sub
                                                                      style={{
                                                                        verticalAlign:
                                                                          "super",
                                                                      }}
                                                                    >
                                                                      $
                                                                    </sub>
                                                                  )}
                                                              {
                                                                (
                                                                  parseFloat(
                                                                    price?.USD *
                                                                      (100 /
                                                                        (100 -
                                                                          product?.discount))
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )
                                                                  .toString()
                                                                  .split(".")[0]
                                                              }
                                                              {/* <sub
                                                                style={{
                                                                  verticalAlign:
                                                                    "super",
                                                                }}
                                                              > */}
                                                              .
                                                              {
                                                                (
                                                                  parseFloat(
                                                                    price?.INR *
                                                                      (100 /
                                                                        (100 -
                                                                          product?.discount))
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )
                                                                  .toString()
                                                                  .split(".")[1]
                                                              }
                                                              {/* </sub> */}
                                                            </del>
                                                          </>
                                                        )}
                                                  </p>
                                                )}
                                            </>
                                          ))}
                                          <div className="flex justify-start items-center">
                                            <button
                                              className="p-0 !flex !flex-row	 border-0 outline-none bg-transparent text-primary !content-center  !text-right"
                                              style={{
                                                display: "flex",
                                                justifyContent: "end",
                                                marginRight: "5px",
                                              }}
                                              onClick={() => {
                                                isLoggedIn
                                                  ? handleAddToWishList(
                                                      product?.id,
                                                      product?.img_1
                                                    )
                                                  : dispatch(
                                                      usersignupinModal({
                                                        showSignupModal: false,
                                                        showLoginModal: true,
                                                        showforgotPasswordModal: false,
                                                        showOtpModal: false,
                                                        showNewPasswordModal: false,
                                                      })
                                                    );
                                              }}
                                            >
                                              <FaRegHeart size={18} />
                                            </button>

                                            <button
                                              className="p-0 border-0 outline-none bg-transparent text-primary !content-right text-right  group-hover:animate-shake"
                                              onClick={(event) => {
                                                return isLoggedIn
                                                  ? (handleAddToCart(
                                                      product?.id,
                                                      product?.img_1
                                                    ),
                                                    handleCartPosition(event))
                                                  : dispatch(
                                                      usersignupinModal({
                                                        showSignupModal: false,
                                                        showLoginModal: true,
                                                        showforgotPasswordModal: false,
                                                        showOtpModal: false,
                                                        showNewPasswordModal: false,
                                                      })
                                                    );
                                              }}
                                            >
                                              {animateProductId ===
                                              product?.id ? (
                                                <img
                                                  src="/images/addedtocart.gif"
                                                  className="max-w-[45px]"
                                                />
                                              ) : (
                                                <em className="icon ni ni-cart text-2xl "></em>
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      {product?.discount > 0 && (
                                        <div className="flex justify-end items-end ">
                                          <div
                                            className="flex absolute items-center justify-center img-box !drop-shadow-lg

"
                                          >
                                            <img
                                              src="/images/sale-2.webp"
                                              alt="ffer_label"
                                              width={65}
                                              className="drop-shadow-lg"
                                            ></img>
                                            <label className="absolute !font-bold text-white !text-xs right-1">
                                              {product?.discount}%
                                            </label>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </>
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
              <div className="col-12" id="trading_bundles">
                <div className="nk-section-head">
                  <h2 className="nk-section-title !text-start !font-bold">
                    {t("trading_bundles")}
                  </h2>
                </div>
              </div>
            </div>
            <div className="row gy-5 justify-between ">
              {/* overflow-auto !max-h-[354px] sm:!max-h-[500px] lg:!max-h-[670px] */}
              {subCatProducts?.length === 0 && (
                <p className="font-bold">No products to Display</p>
              )}
              {subCatProducts?.length !== 0 &&
                subCatProducts?.map((product) => {
                  if (
                    product?.combo &&
                    (product?.stock?.stock != "0" || filteredBundleResult)
                  ) {
                    return (
                      <>
                        {(showPlaceHolderLoader === true ||
                          showLoader === true) && (
                          <div className="col-xl-4 col-lg-4 col-md-6 !pb-[27px]">
                            <Box sx={{ pt: 0.5 }}>
                              <div className="nk-card overflow-hidden rounded-3 h-100 border text-left">
                                <Skeleton
                                  animation="wave"
                                  variant="rectangular"
                                  className="w-100 h-100 sm:!h-[350px] "
                                />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" width="60%" />
                                <Skeleton animation="wave" width="30%" />
                                <Skeleton animation="wave" width="30%" />
                              </div>
                            </Box>
                          </div>
                        )}
                        {showPlaceHolderLoader === false && (
                          <div
                            className="col-xl-4 col-lg-4 col-md-6 !pb-[27px] group hover:drop-shadow-xl"
                            data-aos="fade-up"
                            data-aos-delay="100"
                          >
                            <div className="nk-card overflow-hidden rounded-3 border h-100 text-left">
                              <div className="nk-card-img relative">
                                <a
                                  href={`${userLang}/product-detail/${
                                    product?.slug
                                  }/${CryptoJS?.AES?.encrypt(
                                    `${product?.id}`,
                                    "trading_materials"
                                  )
                                    ?.toString()
                                    .replace(/\//g, "_")
                                    .replace(/\+/g, "-")}`}
                                >
                                  <img
                                    src={product?.img_1}
                                    alt="product-image"
                                    className="w-100 group-hover:scale-105 p-3 rounded-md transition duration-500"
                                    // loading="lazy"
                                  />
                                </a>
                              </div>
                              <div className="nk-card-info bg-white p-4 pt-1">
                                <a
                                  href={`${userLang}/product-detail/${
                                    product?.slug
                                  }/${CryptoJS?.AES?.encrypt(
                                    `${product?.id}`,
                                    "trading_materials"
                                  )
                                    ?.toString()
                                    .replace(/\//g, "_")
                                    .replace(/\+/g, "-")}`}
                                  className="d-inline-block text-black text-sm subpixel-antialiased"
                                  style={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    width: "95%",
                                  }}
                                >
                                  {product?.name}
                                </a>
                                <div className="d-flex align-items-center mb-2 gap-1">
                                  {ratingStars(product?.rating)}
                                  <span className="fs-14 text-gray-800">
                                    {" "}
                                    {product?.total_reviews} Reviews{" "}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  {product?.prices?.map((price) => (
                                    <>
                                      {currentUserlang === "en" &&
                                        price?.INR && (
                                          <p
                                            className={`fs-16 m-0 text-gray-1200 text-start fw-bold !mr-2  !w-full`}
                                          >
                                            {currentUserlang === "en"
                                              ? price?.INR && (
                                                  <sub
                                                    style={{
                                                      verticalAlign: "super",
                                                    }}
                                                  >
                                                    ₹
                                                  </sub>
                                                )
                                              : price?.USD && (
                                                  <sub
                                                    style={{
                                                      verticalAlign: "super",
                                                    }}
                                                  >
                                                    $
                                                  </sub>
                                                )}

                                            {currentUserlang === "en"
                                              ? price?.INR && (
                                                  <>
                                                    {
                                                      (
                                                        Number.parseFloat(
                                                          price?.INR
                                                        )?.toFixed(2) + ""
                                                      )?.split(".")[0]
                                                    }
                                                    {/* <sub
                                                      style={{
                                                        verticalAlign: "super",
                                                      }}
                                                    > */}
                                                    .
                                                    {
                                                      (
                                                        Number.parseFloat(
                                                          price?.INR
                                                        )?.toFixed(2) + ""
                                                      )?.split(".")[1]
                                                    }
                                                    {/* </sub> */}
                                                  </>
                                                )
                                              : price?.USD &&
                                                `${Number.parseFloat(
                                                  price?.USD
                                                )}`}

                                            {currentUserlang === "en" &&
                                            product?.discount > 0
                                              ? price?.INR &&
                                                product?.discount > 0 && (
                                                  <>
                                                    <del className="text-gray-800 !ml-2">
                                                      {currentUserlang === "en"
                                                        ? price?.INR && (
                                                            <sub
                                                              style={{
                                                                verticalAlign:
                                                                  "super",
                                                              }}
                                                            >
                                                              ₹
                                                            </sub>
                                                          )
                                                        : price?.USD && (
                                                            <sub
                                                              style={{
                                                                verticalAlign:
                                                                  "super",
                                                              }}
                                                            >
                                                              $
                                                            </sub>
                                                          )}
                                                      {
                                                        (
                                                          parseFloat(
                                                            price?.INR *
                                                              (100 /
                                                                (100 -
                                                                  product?.discount))
                                                          )?.toFixed(2) + ""
                                                        )
                                                          .toString()
                                                          .split(".")[0]
                                                      }
                                                      {/* <sub
                                                        style={{
                                                          verticalAlign:
                                                            "super",
                                                        }}
                                                      > */}
                                                      .
                                                      {
                                                        (
                                                          parseFloat(
                                                            price?.INR *
                                                              (100 /
                                                                (100 -
                                                                  product?.discount))
                                                          )?.toFixed(2) + ""
                                                        )
                                                          .toString()
                                                          .split(".")[1]
                                                      }
                                                      {/* </sub> */}
                                                    </del>
                                                  </>
                                                )
                                              : price?.USD &&
                                                product?.discount > 0 && (
                                                  <>
                                                    <del className="text-gray-800 block !ml-2">
                                                      {currentUserlang === "en"
                                                        ? price?.INR && (
                                                            <sub
                                                              style={{
                                                                verticalAlign:
                                                                  "super",
                                                              }}
                                                            >
                                                              ₹
                                                            </sub>
                                                          )
                                                        : price?.USD && (
                                                            <sub
                                                              style={{
                                                                verticalAlign:
                                                                  "super",
                                                              }}
                                                            >
                                                              $
                                                            </sub>
                                                          )}
                                                      {
                                                        (
                                                          parseFloat(
                                                            price?.INR *
                                                              (100 /
                                                                (100 -
                                                                  product?.discount))
                                                          )?.toFixed(2) + ""
                                                        )
                                                          .toString()
                                                          .split(".")[0]
                                                      }
                                                      {/* <sub
                                                        style={{
                                                          verticalAlign:
                                                            "super",
                                                        }}
                                                      > */}
                                                      .
                                                      {
                                                        (
                                                          parseFloat(
                                                            price?.INR *
                                                              (100 /
                                                                (100 -
                                                                  product?.discount))
                                                          )?.toFixed(2) + ""
                                                        )
                                                          .toString()
                                                          .split(".")[1]
                                                      }
                                                      {/* </sub> */}
                                                    </del>
                                                  </>
                                                )}
                                          </p>
                                        )}
                                      {currentUserlang !== "en" &&
                                        price?.USD && (
                                          <p
                                            className={`fs-16 m-0 text-gray-1200 text-start fw-bold !mr-2  !w-full`}
                                          >
                                            {currentUserlang === "en"
                                              ? price?.INR && (
                                                  <sub
                                                    style={{
                                                      verticalAlign: "super",
                                                    }}
                                                  >
                                                    ₹
                                                  </sub>
                                                )
                                              : price?.USD && (
                                                  <sub
                                                    style={{
                                                      verticalAlign: "super",
                                                    }}
                                                  >
                                                    $
                                                  </sub>
                                                )}

                                            {currentUserlang === "en"
                                              ? price?.INR && (
                                                  <>
                                                    {
                                                      (
                                                        parseFloat(
                                                          price?.INR
                                                        )?.toFixed(2) + ""
                                                      )
                                                        .toString()
                                                        .split(".")[0]
                                                    }
                                                    {/* <sub
                                                      style={{
                                                        verticalAlign: "super",
                                                      }}
                                                    > */}
                                                    .
                                                    {
                                                      (
                                                        parseFloat(
                                                          price?.INR
                                                        )?.toFixed(2) + ""
                                                      )
                                                        .toString()
                                                        .split(".")[1]
                                                    }
                                                    {/* </sub> */}
                                                  </>
                                                )
                                              : price?.USD && (
                                                  <>
                                                    {
                                                      (
                                                        parseFloat(
                                                          price?.USD
                                                        )?.toFixed(2) + ""
                                                      )
                                                        .toString()
                                                        .split(".")[0]
                                                    }
                                                    {/* <sub
                                                      style={{
                                                        verticalAlign: "super",
                                                      }}
                                                    > */}
                                                    .
                                                    {
                                                      (
                                                        parseFloat(
                                                          price?.USD
                                                        )?.toFixed(2) + ""
                                                      )
                                                        .toString()
                                                        .split(".")[1]
                                                    }
                                                    {/* </sub> */}
                                                  </>
                                                )}

                                            {currentUserlang === "en" &&
                                            product?.discount > 0
                                              ? price?.INR &&
                                                product?.discount > 0 && (
                                                  <>
                                                    <del className="text-gray-800 !ml-2">
                                                      {currentUserlang === "en"
                                                        ? price?.INR && (
                                                            <sub
                                                              style={{
                                                                verticalAlign:
                                                                  "super",
                                                              }}
                                                            >
                                                              ₹
                                                            </sub>
                                                          )
                                                        : price?.USD && (
                                                            <sub
                                                              style={{
                                                                verticalAlign:
                                                                  "super",
                                                              }}
                                                            >
                                                              $
                                                            </sub>
                                                          )}
                                                      {
                                                        (
                                                          parseFloat(
                                                            price?.INR *
                                                              (100 /
                                                                (100 -
                                                                  product?.discount))
                                                          )?.toFixed(2) + ""
                                                        )
                                                          .toString()
                                                          .split(".")[0]
                                                      }
                                                      {/* <sub
                                                        style={{
                                                          verticalAlign:
                                                            "super",
                                                        }}
                                                      > */}
                                                      .
                                                      {
                                                        (
                                                          parseFloat(
                                                            price?.INR *
                                                              (100 /
                                                                (100 -
                                                                  product?.discount))
                                                          )?.toFixed(2) + ""
                                                        )
                                                          .toString()
                                                          .split(".")[1]
                                                      }
                                                      {/* </sub> */}
                                                    </del>
                                                  </>
                                                )
                                              : price?.USD &&
                                                product?.discount > 0 && (
                                                  <>
                                                    <del className="text-gray-800 !ml-2">
                                                      {currentUserlang === "en"
                                                        ? price?.INR && (
                                                            <sub
                                                              style={{
                                                                verticalAlign:
                                                                  "super",
                                                              }}
                                                            >
                                                              ₹
                                                            </sub>
                                                          )
                                                        : price?.USD && (
                                                            <sub
                                                              style={{
                                                                verticalAlign:
                                                                  "super",
                                                              }}
                                                            >
                                                              $
                                                            </sub>
                                                          )}
                                                      {
                                                        (
                                                          parseFloat(
                                                            price?.USD *
                                                              (100 /
                                                                product?.discount)
                                                          )?.toFixed(2) + ""
                                                        )
                                                          .toString()
                                                          .split(".")[0]
                                                      }
                                                      {/* <sub
                                                        style={{
                                                          verticalAlign:
                                                            "super",
                                                        }}
                                                      > */}
                                                      .
                                                      {
                                                        (
                                                          parseFloat(
                                                            price?.INR *
                                                              (100 /
                                                                (100 -
                                                                  product?.discount))
                                                          )?.toFixed(2) + ""
                                                        )
                                                          .toString()
                                                          .split(".")[1]
                                                      }
                                                      {/* </sub> */}
                                                    </del>
                                                  </>
                                                )}
                                          </p>
                                        )}
                                    </>
                                  ))}
                                  <button
                                    className="p-0 !flex !flex-row	 border-0 outline-none bg-transparent text-primary !content-center w-full !text-right"
                                    style={{
                                      display: "flex",
                                      justifyContent: "end",
                                      marginRight: "5px",
                                    }}
                                    onClick={() => {
                                      isLoggedIn
                                        ? handleAddToWishList(
                                            product?.id,
                                            product?.img_1
                                          )
                                        : dispatch(
                                            usersignupinModal({
                                              showSignupModal: false,
                                              showLoginModal: true,
                                              showforgotPasswordModal: false,
                                              showOtpModal: false,
                                              showNewPasswordModal: false,
                                            })
                                          );
                                    }}
                                  >
                                    <FaRegHeart size={18} />
                                  </button>
                                  <button
                                    className="p-0 border-0 outline-none bg-transparent text-primary !content-right text-right group-hover:animate-shake"
                                    onClick={(event) => {
                                      return isLoggedIn
                                        ? (handleAddToCart(
                                            product?.id,
                                            product?.img_1
                                          ),
                                          handleCartPosition(event))
                                        : dispatch(
                                            usersignupinModal({
                                              showSignupModal: false,
                                              showLoginModal: true,
                                              showforgotPasswordModal: false,
                                              showOtpModal: false,
                                              showNewPasswordModal: false,
                                            })
                                          );
                                    }}
                                  >
                                    {animateProductId === product?.id ? (
                                      <img
                                        src="/images/addedtocart.gif"
                                        className="max-w-[45px]"
                                      />
                                    ) : (
                                      <em className="icon ni ni-cart text-2xl"></em>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                            {product?.discount > 0 && (
                              <div className="flex justify-end items-end ">
                                <div
                                  className="flex absolute items-center justify-center img-box !drop-shadow-lg

"
                                >
                                  <img
                                    src="/images/sale-2.webp"
                                    alt="ffer_label"
                                    width={65}
                                    className="drop-shadow-lg"
                                  ></img>
                                  <label className="absolute !font-bold text-white !text-xs right-1">
                                    {product?.discount}%
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    );
                  }
                })}
            </div>
          </div>
        </section>
        <section className="nk-section-testimonials pt-lg-3 pb-lg-6">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="nk-section-head text-center">
                  <h2 className="nk-section-title !font-bold">
                    {t("Stories_From_Our_Customers")}
                  </h2>
                  <p className="nk-section-text">{t("stories_desc")}</p>
                  <div className="flex w-full justify-center">
                    <img
                      src="/images/shop/trust-icon.webp"
                      alt="rating_starts"
                    ></img>
                  </div>
                </div>
              </div>
            </div>

            <Swiper
              slidesPerView={2}
              spaceBetween={30}
              dots={true}
              speed={1500}
              loop={true}
              autoplay={true}
              // navigation={true}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                720: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
                2048: {
                  slidesPerView: 2,
                  spaceBetween: 50,
                },
              }}
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination, Navigation, Autoplay]}
              className="swiper swiper-init nk-swiper nk-swiper-s4 pt-5 pt-lg-0"
              data-autoplay="true"
              data-space-between="30"
            >
              <SwiperSlide className="swiper-slide h-auto">
                <div className="nk-testimonial-card-2 nk-testimonial-card-s3 ">
                  <div className="nk-testimonial-content ">
                    <div>
                      <ul className="d-flex aling-items-center gap-1 mb-2">
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="mb-2 !font-bold text-left !text-xl">
                        Chadha Acharya
                      </h5>
                      <p className="fs-14 line-clamp-6 text-left">
                        &quot;Thanks to Trading Materials for providing
                        high-quality complete trading materials! Ordering was a
                        breeze, and the payment process was simple and
                        efficient. They delivered the product in record time,
                        exceeding my expectations. I&apos;m highly satisfied
                        with their service and products.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide h-auto">
                <div className="nk-testimonial-card-2 nk-testimonial-card-s3 shadow-none">
                  <div className="nk-testimonial-content">
                    <div>
                      <ul className="d-flex aling-items-center gap-1 mb-2">
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="mb-2 !font-bold text-left !text-xl">
                        Barman Agarwal
                      </h5>
                      <p className="fs-14 line-clamp-6 text-left">
                        &quot;I highly recommend Trading Materials for traders.
                        They have all your trading requirements conveniently
                        available in one place. Their fastest delivery service
                        impresses everyone, and I can attest to the reliability
                        of their speedy shipping. You can trust them with a 100%
                        guarantee for product quality.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide h-auto">
                <div className="nk-testimonial-card-2 nk-testimonial-card-s3 shadow-none">
                  <div className="nk-testimonial-content">
                    <div>
                      <ul className="d-flex aling-items-center gap-1 mb-2">
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                      </ul>
                    </div>

                    <h5 className="mb-2 !font-bold text-left !text-xl">
                      Aadarsh Chopra
                    </h5>
                    <p className="fs-14 line-clamp-6 text-left">
                      &quot;Trading Materials has been a game-changer for my
                      trading journey. I appreciate their commitment to quality
                      and convenience. With easy ordering, secure payments, and
                      lightning-fast delivery, they&apos;ve made trading
                      materials accessible and hassle-free. I wouldn&apos;t
                      hesitate to recommend them to fellow traders.&quot;
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide h-auto">
                <div className="nk-testimonial-card-2 nk-testimonial-card-s3 shadow-none">
                  <div className="nk-testimonial-content">
                    <div>
                      <ul className="d-flex aling-items-center gap-1 mb-2">
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                        <li className="text-green-2">
                          <em className="icon ni ni-star-fill"></em>
                        </li>
                      </ul>
                    </div>
                    <h5 className="mb-2 !font-bold text-left !text-xl">
                      Rahul Nambiar
                    </h5>
                    <p className="fs-14 text-left">
                      &quot;Trading Materials is the go-to source for traders
                      seeking top-notch trading resources. Their dedication to
                      fast and reliable deliveries ensures you get what you need
                      when you need it. Rest assured, their products are of the
                      highest quality, and I couldn&apos;t be happier with my
                      experience. A trusted partner in the world of
                      trading.&quot;
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section className="nk-section nk-cta-section nk-section-content-1">
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
                      <h3 className="text-capitalize m-0 !text-3xl !font-bold">
                        {t("Chat_With_Our_Support_Team")}
                      </h3>
                      <p className="fs-16 opacity-75 !text-lg mt-1">
                        {t("chat_team_desc")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                  <a
                    href={`https://tradingmaterials.com/contact`}
                    className="btn btn-white fw-semiBold"
                  >
                    {t("Contact_support")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <div className="nk-sticky-badge cursor-pointer">
        <ul>
          <li>
            <a
              href={`${userLang}/`}
              className="nk-sticky-badge-icon nk-sticky-badge-home"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-custom-className="nk-tooltip"
              data-bs-title="View Demo"
            >
              <em className="icon ni ni-home-fill"></em>
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                isLoggedIn ? navigate(`${userLang}/cart`) : navigate(`/login`)
              }
              className="nk-sticky-badge-icon nk-sticky-badge-purchase"
              id="cart-button"
              data-bs-toggle="tooltip"
              data-bs-custom-className="nk-tooltip"
              data-bs-title="Purchase Now"
              aria-label="Purchase Now"
            >
              <em className="icon ni ni-cart-fill"></em>
            </a>
          </li>
        </ul>
      </div> */}
    </>
  );
}
