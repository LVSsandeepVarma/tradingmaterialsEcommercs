import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Helmet } from "react-helmet";
import PrismaZoom from "react-prismazoom";
import Footer from "../../footer/footer";
import {
  hideLoader,
  showLoader,
} from "../../../../features/loader/loaderSlice";
import Header from "../../header/header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllProducts } from "../../../../features/products/productsSlice";
import { updateUsers } from "../../../../features/users/userSlice";
import { updateCart } from "../../../../features/cartItems/cartSlice";
import {
  notifications,
  updateNotifications,
} from "../../../../features/notifications/notificationSlice";
import {
  updateCartCount,
  updateWishListCount,
} from "../../../../features/cartWish/focusedCount";
import { showPopup } from "../../../../features/popups/popusSlice";
// import Swiper from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import CryptoJS from "crypto-js";
import { Avatar, Button, Divider, Skeleton } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ReviewDialog from "../../modals/reviewDialog";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// import { delay } from "@reduxjs/toolkit/dist/utils";

export default function ProductDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state?.products?.value);
  const cartProducts = useSelector((state) => state?.cart?.value);
  const clientType = useSelector((state) => state?.clientType?.value);
  const loaderState = useSelector((state) => state?.loader?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  const isLoggedIn = useSelector((state) => state?.login?.value);
  const [animateProductId, setAnimateProductId] = useState("");
  const [tabValue, setTabValue] = React.useState(1);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openHelpfulDialog, setOpenHelpfulDialog] = useState(false)
  const [product, setProduct] = useState({});
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [subCatProducts, setSubCatProducts] = useState([]);
  const [qunatity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [dialogType, setDialogType] = useState("helpful");
  const [apiError, setApiError] = useState([])
    const [apiSuccess, setApiSuccess] = useState("")
    const [reviewIdErr, setReviewIdErr] = useState("")
  const [currentUserlang, setCurrentUserLang] = useState(
    localStorage.getItem("i18nextLng")
  );
  const [reviewId, setReviewId] = useState("");
  const [previewImage, setPreviewImage] = useState("/images/logo");
  let count = 0;
  console.log(cartProducts, params);

  useEffect(() => {
    const timoeOut = setTimeout(() => {
      setAnimateProductId("");
    }, 3000);

    return () => {
      clearTimeout(timoeOut);
    };
  }, [animateProductId]);

  useEffect(() => {
    setCurrentUserLang(localStorage.getItem("i18nextLng"));
  }, [userLang]);

  const getUserInfo = async () => {
    try {
      const url =
        clientType === "client"
          ? "https://admin.tradingmaterials.com/api/get-user-info"
          : "https://admin.tradingmaterials.com/api/lead/get-user-info";
      const headerData =
        clientType === "client"
          ? {
              headers: {
                Authorization: `Bearer ` + localStorage.getItem("client_token"),
                Accept: "application/json",
              },
            }
          : {
              headers: {
                "access-token": localStorage.getItem("client_token"),
                Accept: "application/json",
              },
            };

      const response = await axios.get(url, headerData);
      if (response?.data?.status) {
        console.log(response?.data);
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        navigate("/cart");
      } else {
        console.log(response?.data);
        if (localStorage.getItem("client_token")) {
          dispatch(
            updateNotifications({
              type: "warning",
              message: response?.data?.message,
            })
          );
        } else {
          dispatch(showPopup());
        }

        // navigate("/login")
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

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
              <em class="icon ni ni-star-half-fill text-yellow"></em>
            </li>
          ) : (
            <li key={index}>
              <em className="icon ni ni-star-fill text-gray-700 "></em>
            </li>
          ))}
        {/* <em class="icon ni ni-star-half-fill"></em> */}
      </>
    ));

    return <ul className="d-flex align-items-center">{elemetns}</ul>;
  }

  console.log(products);

  const { id } = useParams();
  const decryptedId = CryptoJS.AES.decrypt(
    id.replace(/_/g, "/").replace(/-/g, "+"),
    "trading_materials"
  ).toString(CryptoJS.enc.Utf8);
  console.log(decryptedId);

  async function fetchProductdetails() {
    console.log(id);
    try {
      dispatch(showLoader());
      const response = await axios.get(
        `https://admin.tradingmaterials.com/api/get/products-details?product_id=${decryptedId}`,
        {
          headers: {
            "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        setProduct(response?.data?.data);
        setPreviewImage(response?.data?.data?.product?.img_1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  }
  useEffect(() => {
    // fetchProducts();

    setSubCatProducts(products?.products);
    fetchProductdetails();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      dispatch(showLoader());
      try {
        const response = await axios.get(
          "https://admin.tradingmaterials.com/api/get/products",
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          dispatch(fetchAllProducts(response?.data?.data));
          setSubCatProducts(response?.data?.data?.products);
        }
      } catch (err) {
        console.log("err");
      } finally {
        dispatch(hideLoader());
      }
    }

    fetchProducts();
  }, []);

  // function for handling add to cart animation
  async function handleAddToCart(productId) {
    // setAnimateProductId(productId)
    try {
      // dispatch(showLoader());
      setAnimateProductId(productId);
      const response = await axios?.post(
        "https://admin.tradingmaterials.com/api/lead/product/add-to-cart",
        {
          product_id: productId,
          qty: qunatity,
        },
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        dispatch(
          updateNotifications({
            type: "success",
            message: "Added to cart successfully",
          })
        );
        dispatch(updateCart(response?.data?.data?.cart_details));
        dispatch(updateCartCount(response?.data?.data?.cart_count));
        // getUserInfo();
      }
    } catch (err) {
      console.log(err);
    }
    // finally {
    // dispatch(hideLoader());
    // }
  }

  async function handleAddToWishList(id) {
    console.log(id);
    try {
      dispatch(showLoader());
      const url =
        clientType === "client"
          ? "https://admin.tradingmaterials.com/api/product/add-to-wishlist"
          : "https://admin.tradingmaterials.com/api/lead/product/add-to-wishlist";
      const headerData =
        clientType === "client"
          ? {
              headers: {
                Authorization: `Bearer ` + localStorage.getItem("client_token"),
                Accept: "application/json",
              },
            }
          : {
              headers: {
                "access-token": localStorage.getItem("client_token"),
                Accept: "application/json",
              },
            };
      const response = await axios.post(
        url,
        {
          product_id: id,
        },
        headerData
      );
      if (response?.data?.status) {
        dispatch(
          updateNotifications({
            type: "success",
            message: "Added to wishlist successfully",
          })
        );
        // dispatch(updateWis(response?.data?.data?.cart_details));
        dispatch(updateWishListCount(response?.data?.data?.wishlist_count));
        getUserInfo();
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  }

  // function to close review Dialog

  function handleCloseReviewDialog() {
    setOpenReviewDialog(false);
  }
function handleHelpfulDialog() {
    setOpenHelpfulDialog(false);
  }

  async function reviewHelpfulReport(id) {
    console.log(id)
    setApiError([]);
    setReviewIdErr("")
      try {
        dispatch(showLoader());

        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/lead/product/review-report",
          {
            review_id: id,
            type: "helpfull",
          },
          {
            headers: {
              "access-token": localStorage.getItem("client_token"),
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          setOpenHelpfulDialog(true)
          setTimeout(() => {
            setOpenHelpfulDialog(false)
          }, 5000);
        }
      } catch (err) {
        console.log(err);
        if (err?.response?.data?.errors) {
          setReviewIdErr(err?.response?.data?.errors["review_id"]);
        } else {
          setApiError([err?.response?.data?.message]);
          setTimeout(()=>{
              setApiError([])
          }, 5000)
        }
      } finally {
        dispatch(hideLoader());
    }
  }

  return (
    <>
      <Helmet>
        <meta property="og:image" content="/images/tm-logo-1.png" />
        <meta property="og:name" content="trading product"/>
        <meta property="og:description" content="trading desc"/>
      </Helmet>
      {openReviewDialog && (
        <ReviewDialog
          open={openReviewDialog}
          handleClose={handleCloseReviewDialog}
          type={dialogType}
          reviewId = {reviewId}
        />
      )}

{openHelpfulDialog && (
        <ReviewDialog
          open={openHelpfulDialog}
          handleClose={handleHelpfulDialog}
          type={dialogType}
          reviewId = {reviewId}
        />
      )}
      
      <div className="nk-body">
        <div className="nk-body-root">
          {loaderState && (
            <div className="preloader !backdrop-blur-[1px]">
              <div className="loader"></div>
            </div>
          )}
          <Header />
          <main className="nk-pages">
            <section className="nk-section nk-section-product-details pb-lg-7 pt-120 pt-lg-180">
              <div className="container">
                <div className="nk-section-content">
                  <div className="row gy-5 gy-md-7 gy-lg-0 justify-content-lg-between">
                    <div className="col-lg-6">
                      <Swiper
                        style={{
                          "--swiper-navigation-color": "#fff",
                          "--swiper-pagination-color": "#fff",
                        }}
                        loop={true}
                        spaceBetween={10}
                        speed={3000}
                        // navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        autoplay={{
                          autoplay: {
                            delay: 9000,
                          },
                        }}
                        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                        className="mySwiper2"
                      >
                        <div className="swiper-slide">
                          {product?.product?.img_1 !== null && (
                            <SwiperSlide>
                              {loaderState && (
                                <Skeleton
                                  animation="wave"
                                  variant="rectangular"
                                  style={{
                                    aspectRatio: 1,
                                    objectFit: "fill",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                />
                              )}
                              {
                                !loaderState && (
                                  <PrismaZoom
                                    allowZoom={true}
                                    allowPan={true}
                                    maxZoom={5}
                                    minZoom={1}
                                    allowWheel={true}
                                  >
                                    <img
                                      src={
                                        product?.product?.img_1 !== null &&
                                        product?.product?.img_1
                                      }
                                      loading="lazy"
                                      style={{
                                        aspectRatio: 1,
                                        objectFit: "fill",
                                        width: "100%",
                                        height: "100%",
                                        maxWidth: "100% !important",
                                        minHeight: "100% !important",
                                      }}
                                    />
                                  </PrismaZoom>
                                )
                                // <img
                                //   src={
                                //     product?.product?.img_1 === null
                                //       ? "/images/shop/slider-cover-1.jpg"
                                //       : product?.product?.img_1
                                //   }
                                //   style={{
                                //     aspectRatio: 1,
                                //     objectFit: "fill",
                                //     width: "100%",
                                //   }}
                                //   alt="product-images"
                                // />
                              }
                            </SwiperSlide>
                          )}
                        </div>
                        {product?.product?.img_2 !== null && (
                          <SwiperSlide>
                            <PrismaZoom
                              allowZoom={true}
                              allowPan={true}
                              maxZoom={5}
                              minZoom={1}
                            >
                              <img
                                src={
                                  product?.product?.img_2 !== null &&
                                  product?.product?.img_2
                                }
                                loading="lazy"
                                style={{
                                  aspectRatio: 1,
                                  objectFit: "fill",
                                  width: "100%",
                                  height: "100%",
                                  maxWidth: "100% !important",
                                  minHeight: "100% !important",
                                }}
                              />
                            </PrismaZoom>
                          </SwiperSlide>
                        )}
                        {product?.product?.img_3 !== null && (
                          <SwiperSlide>
                            <PrismaZoom
                              allowZoom={true}
                              allowPan={true}
                              maxZoom={5}
                              minZoom={1}
                            >
                              <img
                                src={
                                  product?.product?.img_3 !== null &&
                                  product?.product?.img_3
                                }
                                loading="lazy"
                                style={{
                                  aspectRatio: 1,
                                  objectFit: "fill",
                                  width: "100%",
                                  height: "100%",
                                  maxWidth: "100% !important",
                                  minHeight: "100% !important",
                                }}
                              />
                            </PrismaZoom>
                          </SwiperSlide>
                        )}
                        {product?.product?.img_4 !== null && (
                          <SwiperSlide>
                            <PrismaZoom
                              allowZoom={true}
                              allowPan={true}
                              maxZoom={5}
                              minZoom={1}
                            >
                              <img
                                src={
                                  product?.product?.img_4 !== null &&
                                  product?.product?.img_4
                                }
                                loading="lazy"
                                style={{
                                  aspectRatio: 1,
                                  objectFit: "fill",
                                  width: "100%",
                                  height: "100%",
                                  maxWidth: "100% !important",
                                  minHeight: "100% !important",
                                }}
                              />
                            </PrismaZoom>
                          </SwiperSlide>
                        )}
                        {product?.product?.img_5 !== null && (
                          <SwiperSlide>
                            <PrismaZoom
                              allowZoom={true}
                              allowPan={true}
                              maxZoom={5}
                              minZoom={1}
                            >
                              <img
                                src={
                                  product?.product?.img_5 !== null &&
                                  product?.product?.img_5
                                }
                                loading="lazy"
                                style={{
                                  aspectRatio: 1,
                                  objectFit: "fill",
                                  width: "100%",
                                  height: "100%",
                                  maxWidth: "100% !important",
                                  minHeight: "100% !important",
                                }}
                              />
                            </PrismaZoom>
                          </SwiperSlide>
                        )}

                        {/* <SwiperSlide>
                          <img
                            src={
                              product?.product?.img_4 === null
                                ? "/images/shop/slider-cover-4.jpg"
                                : product?.product?.img_4
                            }
                            style={{aspectRatio:1, objectFit: "fill"}}
                            alt="product-images"
                          />
                        </SwiperSlide>
                        <SwiperSlide>
                          <img
                            src={
                              product?.product?.img_5 === null
                                ? "/images/shop/slider-cover-5.jpg"
                                : product?.product?.img_5
                            }
                            style={{aspectRatio:1, objectFit: "fill"}}
                            alt="product-images"
                          />
                        </SwiperSlide> */}
                      </Swiper>
                      <Swiper
                        onSwiper={setThumbsSwiper}
                        loop={true}
                        spaceBetween={10}
                        slidesPerView={4}
                        speed={5000}
                        autoplay={{
                          autoplay: {
                            delay: 1000,
                          },
                        }}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                        className="swiper product-slider-sm mt-5"
                      >
                        {product?.product?.img_1 !== null && (
                          <SwiperSlide>
                            {loaderState && (
                              <Skeleton
                                animation="wave"
                                variant="rectangular"
                                style={{
                                  aspectRatio: 1,
                                  objectFit: "fill",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            )}
                            {!loaderState && (
                              <img
                                className="w-100"
                                src={
                                  product?.product?.img_1 !== null &&
                                  product?.product?.img_1
                                }
                                loading="lazy"
                                style={{ aspectRatio: 1, objectFit: "fill" }}
                                alt="product-images"
                              />
                            )}
                          </SwiperSlide>
                        )}
                        {product?.product?.img_2 !== null && (
                          <SwiperSlide>
                            {loaderState && (
                              <Skeleton
                                animation="wave"
                                variant="rectangular"
                                style={{
                                  aspectRatio: 1,
                                  objectFit: "fill",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            )}
                            {!loaderState && (
                              <img
                                className="w-100"
                                src={
                                  product?.product?.img_2 !== null &&
                                  product?.product?.img_2
                                }
                                loading="lazy"
                                style={{ aspectRatio: 1, objectFit: "fill" }}
                                alt="product-images"
                              />
                            )}
                          </SwiperSlide>
                        )}
                        {product?.product?.img_3 !== null && (
                          <SwiperSlide>
                            {loaderState && (
                              <Skeleton
                                animation="wave"
                                variant="rectangular"
                                style={{
                                  aspectRatio: 1,
                                  objectFit: "fill",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            )}
                            {!loaderState && (
                              <img
                                className="w-100"
                                src={
                                  product?.product?.img_3 !== null &&
                                  product?.product?.img_3
                                }
                                loading="lazy"
                                style={{ aspectRatio: 1, objectFit: "fill" }}
                                alt="product-images"
                                width={"100%"}
                                height={"100%"}
                              />
                            )}
                          </SwiperSlide>
                        )}
                        {product?.product?.img_4 !== null && (
                          <SwiperSlide>
                            {loaderState && (
                              <Skeleton
                                animation="wave"
                                variant="rectangular"
                                style={{
                                  aspectRatio: 1,
                                  objectFit: "fill",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            )}
                            {!loaderState && (
                              <img
                                className="w-100"
                                src={
                                  product?.product?.img_4 !== null &&
                                  product?.product?.img_4
                                }
                                loading="lazy"
                                style={{ aspectRatio: 1, objectFit: "fill" }}
                                alt="product-images"
                              />
                            )}
                          </SwiperSlide>
                        )}
                        {product?.product?.img_5 !== null && (
                          <SwiperSlide>
                            {loaderState && (
                              <Skeleton
                                animation="wave"
                                variant="rectangular"
                                style={{
                                  aspectRatio: 1,
                                  objectFit: "fill",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            )}
                            {!loaderState && (
                              <img
                                className="w-100"
                                src={
                                  product?.product?.img_5 !== null &&
                                  product?.product?.img_5
                                }
                                loading="lazy"
                                style={{ aspectRatio: 1, objectFit: "fill" }}
                                alt="product-images"
                                width={"100%"}
                                height={"100%"}
                              />
                            )}
                          </SwiperSlide>
                        )}

                        {/* <SwiperSlide>
                          <img
                          className="w-100"
                            src={
                              product?.product?.img_4 === null
                                ? "/images/shop/slider-cover-4.jpg"
                                : product?.product?.img_4
                            }
                            style={{aspectRatio:1, objectFit: "fill"}}
                            alt="product-images"
                          />
                        </SwiperSlide>
                        <SwiperSlide>
                          <img
                          className="w-100"
                            src={
                              product?.product?.img_5 === null
                                ? "/images/shop/slider-cover-5.jpg"
                                : product?.product?.img_5
                            }
                            style={{aspectRatio:1, objectFit: "fill"}}
                            alt="product-images"
                            height={100}
                          />
                        </SwiperSlide> */}
                      </Swiper>
                    </div>
                    <div className="col-lg-6 col-xl-5">
                      <div>
                        <div>
                          <div className="pb-3 border-bottom !text-left ">
                            <div className="fs-14 mb-1 text-black text-uppercase  font-semibold">
                              {product?.product?.category}
                            </div>
                            <h3 className="text-gray-1200 fw-bold h3">
                              {product?.product?.name}
                            </h3>
                          </div>
                          <div className="d-flex gap-4  pt-1">
                            <div className="d-flex gap-1">
                              {ratingStars(product?.rating)}
                              
                              <a className="fs-14 text-gray-800 cursor-pointer hover:!text-red-800 hover:font-semibold" href="#product_reviews" onClick={()=>setTabValue(2)} >
                                {" "}
                                ({product?.product?.total_reviews} Reviews){" "}
                              </a>
                            </div>
                            <a href="#" className="d-flex    text-gray-1200">
                              <em className="icon ni ni-edit-alt text-gray-800"></em>
                              <span className="fs-14 ms-1">Write A Review</span>
                            </a>
                          </div>
                        </div>
                        <div className="nk-product-specification py-5 !text-left ">
                          <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                              __html: product?.product?.description,
                            }}
                          />
                          <div className="nk-product-specification-content">
                            <h6 className="fs-16 m-0 w-50 !font-bold">
                              Quantity:
                            </h6>
                            <div className="w-50">
                              <div id="counter" className="nk-counter">
                                <button
                                  id="decrement"
                                  onClick={() => {
                                    setQuantity(
                                      qunatity > 2 ? qunatity - 1 : 1
                                    );
                                  }}
                                >
                                  -
                                </button>
                                <span id="count">{qunatity}</span>
                                <button
                                  id="increment"
                                  onClick={() => {
                                    setQuantity(qunatity + 1);
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="position-relative overflow-hidden bg-blue-300 rounded p-4">
                          <div className="flex justify-between">
                            <h4 className="mb-4 !text-2xl !font-bold !text-left">
                              {product?.product?.prices?.map((price, ind) => (
                                <p className=" m-0 text-gray-1200 text-start !text-xl !font-bold !mr-2 ">
                                  {currentUserlang === "en"
                                    ? price?.INR &&
                                      `₹${Number.parseFloat(price?.INR).toFixed(
                                        2
                                      )}`
                                    : price?.USD &&
                                      `$${Number.parseFloat(price?.USD).toFixed(
                                        2
                                      )}`}
                                </p>
                              ))}
                            </h4>
                            <h4 className="mb-4 flex !text-xl !font-semibold !text-left">
                              Total:&nbsp;
                              {product?.product?.prices?.map((price, ind) => (
                                <p className=" m-0 text-start !text- !font-bold !mr-2 ">
                                  {currentUserlang === "en"
                                    ? price?.INR &&
                                      `₹${Number.parseFloat(
                                        price?.INR * qunatity
                                      ).toFixed(2)}`
                                    : price?.USD &&
                                      `$${Number.parseFloat(
                                        price?.USD * qunatity
                                      ).toFixed(2)}`}
                                </p>
                              ))}
                            </h4>
                          </div>
                          {/* <p className="fs-14 text-gray-1200 !text-left !w-full mb-2">
                            <em className="icon ni ni-plus-circle-fill text-primary me-1 "></em>
                            <span>Add Nio care pius service from $39</span>
                          </p> */}
                          <ul className="d-flex align-items-center gap-2">
                            <li>
                              <button className="btn btn-primary">
                                Buy Now
                              </button>
                            </li>
                            <li>
                              <button
                                className="btn btn-white text-primary"
                                onClick={(event) => {
                                  return isLoggedIn
                                    ? handleAddToCart(product?.product_id)
                                    : dispatch(showPopup());
                                }}
                              >
                                Add To Cart
                              </button>
                            </li>
                          </ul>
                          <div className="d-flex align-items-center gap-1 pt-4">
                            <em className="icon ni ni-heart-fill text-primary "></em>
                            <p
                              className="fs-16 fw-semibold text-gray-1200 cursor-pointer"
                              onClick={() => {
                                isLoggedIn
                                  ? handleAddToWishList(product?.id)
                                  : dispatch(showPopup());
                              }}
                            >
                              {" "}
                              Add to WishList{" "}
                              {/* <span className="fs-14 text-gray-800 fw-normal">
                                (32,145 Adds)
                              </span> */}
                            </p>
                          </div>
                        </div>
                        <div className="pt-5">
                          <p className="fs-14 !text-left">
                            {" "}
                            Must explain to you how all this mistaken idea of
                            denouncing pleasure and praising pain was born and I
                            will give you a complete account of the system, and
                            expound.{" "}
                          </p>
                          <div className="nk-social d-sm-flex align-items-center mt-2 gap-3 pb-2">
                            <h6 className="fs-14 m-0 fw-semibold text-uppercase !leading-loose mb-2  mb-sm-0 ">
                              Share :
                            </h6>
                            <ul>
                              <li>
                                <a
                                  href="#"
                                  className="d-flex align-items-center text-gray-1200"
                                >
                                  <em className="icon ni ni-facebook-f text-primary"></em>
                                  <p className="fs-14 text-nowrap fw-semibold ms-1">
                                    Facebook{" "}
                                    <span className=" fs-14 text-gray-800">
                                      120
                                    </span>
                                  </p>
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  className="d-flex align-items-center text-gray-1200"
                                >
                                  <em className="icon ni ni-twitter text-primary"></em>
                                  <p className="fs-14 text-nowrap fw-semibold ms-1">
                                    Twitter{" "}
                                    <span className=" fs-14 text-gray-800">
                                      60
                                    </span>
                                  </p>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="nk-nav-tabs nav-tabs-s2 py-5 py-lg-7">
                    <ul className="nav nav-tabs" id="product_reviews">
                      <li className="nav-item" onClick={() => setTabValue(1)}>
                        <a
                          href="#"
                          className={`${
                            tabValue === 1 ? "nav-link active" : "nav-link"
                          }`}
                          data-bs-toggle="tab"
                          data-bs-target="#tab-1"
                        >
                          {" "}
                          Product Details{" "}
                        </a>
                      </li>
                      <li className="nav-item" onClick={() => setTabValue(2)}>
                        <a 
                          href="#"
                          className={`${
                            tabValue === 2 ? "nav-link active" : "nav-link"
                          }`}
                          data-bs-toggle="tab"
                          data-bs-target="#tab-2"
                          disabled
                        >
                          {" "}
                          Reviews ({product?.product?.total_reviews}){" "}
                        </a>
                      </li>
                      {/* <li className="nav-item" onClick={() => setTabValue(3)}>
                        <a
                          href="#"
                          className={`${
                            tabValue === 3 ? "nav-link active" : "nav-link"
                          }`}
                          data-bs-toggle="tab"
                          data-bs-target="#tab-3"
                          disabled
                        >
                          {" "}
                          Shipping & Payment{" "}
                        </a>
                      </li> */}
                    </ul>
                    {tabValue === 1 && (
                      <div className="tab-content pt-5" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="tab-1"
                          tabindex="0"
                        >
                          <div>
                            {/* <h5 className="mb-2">Product Description</h5> */}
                            <p
                              className="fs-16 text-gray-1200 text-left"
                              dangerouslySetInnerHTML={{
                                __html: product?.product?.long_desc,
                              }}
                            />
                          </div>
                          <div className="row">
                            <div className="col-lg-10 col-xl-8">
                              <div className="row flex-row-reverse gy-5 gy-md-0">
                                {/* <div className="col-md-6">
                                <div>
                                  <h6 className="mb-3">Care & Instructions</h6>
                                  <p className="fs-16 text-gray-1200">
                                    {" "}
                                    Introducing our premium product, designed to
                                    meet your needs with style and
                                    functionality. Crafted with utmost care and
                                    attention to detail, this product combines
                                    durability and aesthetic appeal.
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <h6 className="mb-3">Item Details</h6>
                                <ul className="d-flex flex-column gap-1">
                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Brand:{" "}
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      Rubberised Material
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Product Code:{" "}
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      Product 20
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Reference:
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      455656ssss562
                                    </p>
                                  </li>

                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Reward Points:
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      Nio Fashion
                                    </p>
                                  </li>

                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Condition:
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      Fress
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Availability:
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      In Stock
                                    </p>
                                  </li>
                                </ul>
                              </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {tabValue === 2 && (
                      <div className="tab-content pt-5"  id="product-reviews">
                        <div className="container   ">
                          <h1 className="!font-bold text-gray-800">
                            {product?.product?.total_reviews === 0 &&
                              "No Reviews for this product."}
                          </h1>
                          {product?.product?.total_reviews > 0 && (
                            <>
                              <div className="text-left">
                                <h1 className="!font-bold text-3xl">
                                  Customer Ratings
                                </h1>
                                <div className="flex items-center">
                                  {ratingStars(product?.rating)}
                                  <small className="ml-2">
                                    Based on {product?.reviews?.length} reviews
                                  </small>
                                </div>
                                <Divider />
                                <div className="max-h-[450px] overflow-y-auto">
                                  {product?.reviews?.map((review, ind) => (
                                    <div className="review mt-2">
                                      <div className="flex items-center">
                                        <Avatar
                                          alt="customer-profile"
                                          src={review?.client?.profile_img}
                                        />
                                        <p className="ml-2 font-bold">
                                          {review?.client?.first_name}{" "}
                                          {review?.client?.last_name}{" "}
                                        </p>
                                      </div>
                                      <div className="flex">
                                        {ratingStars(review?.rating)}
                                        <label className="ml-2 text-sm font-bold !text-black">
                                          {review?.title
                                            ? review?.title
                                            : "title"}
                                        </label>
                                      </div>
                                      <span className="text-sm flex items-center">
                                        Reviewed on{" "}
                                        <b className="ml-2 mr-2">
                                          {new Date(
                                            review?.created_at
                                          ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                          })}
                                        </b>{" "}
                                        |
                                        <span className="!text-xs text-[#c45500] ml-2">
                                          {" "}
                                          <VerifiedUserIcon className="!w-[12px]" />{" "}
                                          Verified Purchase
                                        </span>{" "}
                                      </span>
                                      <div>
                                        <p className="text-black text-clip max-h-[125px] overflow-y-auto max-w-[900px] mb-2">
                                          {review?.description}
                                        </p>
                                        <Button
                                          className="btn-btn-primary mr-2 !text-xs "
                                          size="small"
                                          variant="outlined"
                                          onClick={() => {
                                            if(isLoggedIn){
                                            // setOpenHelpfulDialog(true);
                                            setDialogType("helpful");
                                            setReviewId(review?.id);
                                            reviewHelpfulReport(review?.id)
                                            }else{
                                              dispatch(showPopup())
                                            }
                                          }}
                                        >
                                          Helpful
                                        </Button>{" "}
                                        |{" "}
                                        <span
                                          className="font-bold ml-2 cursor-pointer hover:text-gray-800"
                                          onClick={() => {
                                            if(isLoggedIn){
                                            setOpenReviewDialog(true);
                                            setDialogType("report");
                                            setReviewId(review?.id);
                                            }else{
                                              dispatch(showPopup())
                                            }
                                          }}
                                        >
                                          Report
                                        </span>
                                        {reviewId===review?.id && apiError?.length > 0 &&
                        apiError?.map((err, ind) => {
                          return (
                              <p
                                key={ind}
                                className="text-red-700 !text-xs"
                              >
                                {err}
                              </p>
                          );
                        })}
                        {reviewId===review?.id && reviewIdErr !== "" && <p className="text-red-700 !text-xs " >{reviewIdErr}</p>}
                                      </div>
                                      <div className="!w-fit">
                                        <span className="text-sm">
                                          {" "}
                                          5 people found this helpful{" "}
                                        </span>
                                        <Divider />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
            <section className="nk-section pt-lg-0">
              <div className="container">
                <div className="row">
                  <div className="col-12" id="trading_bundles">
                    <div className="nk-section-head pb-5">
                      <h2 className="nk-section-title !text-left">
                        Trading Bundles
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="row gy-5 justify-between">
                  {subCatProducts?.length !== 0 &&
                    subCatProducts?.map((product, indx) => {
                      console.log(product);
                      if (product?.combo) {
                        return (
                          // product?.getproducts?.map((comboProduct, n)=>(
                          <div
                            className="col-xl-4 col-lg-4 col-md-6"
                            // data-aos="fade-up"
                            // data-aos-delay="100"
                          >
                            <div className="nk-card overflow-hidden rounded-3 border h-100">
                              <div className="nk-card-img">
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
                                    className="w-100"
                                    loading="lazy"
                                  />
                                </a>
                              </div>
                              <div className="nk-card-info bg-white p-4">
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
                                  className="d-inline-block mb-1 line-clamp-1 h5 !font-bold"
                                  style={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    width: "90%",
                                  }}
                                >
                                  {product?.name}
                                  <br />
                                  {/* <span className="text-xs">
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: product?.description,
                                      }}
                                    />
                                  </span> */}
                                </a>
                                <div className="d-flex align-items-center mb-2 gap-1">
                                  {ratingStars(product?.rating)}

                                  <span className="fs-14 text-gray-800">
                                    {" "}
                                    ({product?.total_reviews} Reviews){" "}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center justify-between	mb-2">
                                  {product?.prices?.map((price, ind) => (
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
                                                    <sub
                                                      style={{
                                                        verticalAlign: "super",
                                                      }}
                                                    >
                                                      {
                                                        (
                                                          Number.parseFloat(
                                                            price?.INR
                                                          )?.toFixed(2) + ""
                                                        )?.split(".")[1]
                                                      }
                                                    </sub>
                                                  </>
                                                )
                                              : price?.USD &&
                                                `${Number.parseFloat(
                                                  price?.USD
                                                )}`}

                                            {currentUserlang === "en"
                                              ? price?.INR && (
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
                                                      {getRandomNumberWithOffset(
                                                        price?.INR
                                                      )}
                                                      <sub
                                                        style={{
                                                          verticalAlign:
                                                            "super",
                                                        }}
                                                      >
                                                        00
                                                      </sub>
                                                    </del>
                                                  </>
                                                )
                                              : price?.USD && (
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
                                                      {getRandomNumberWithOffset(
                                                        Number.parseFloat(
                                                          price?.USD
                                                        )?.toFixed(2) +
                                                          ""?.split(".")[0]
                                                      )}
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
                                                        Number.parseFloat(
                                                          price?.INR
                                                        )?.toFixed(2) + ""
                                                      )?.split(".")[0]
                                                    }
                                                    <sub
                                                      style={{
                                                        verticalAlign: "super",
                                                      }}
                                                    >
                                                      {
                                                        (
                                                          Number.parseFloat(
                                                            price?.INR
                                                          )?.toFixed(2) + ""
                                                        )?.split(".")[1]
                                                      }
                                                    </sub>
                                                  </>
                                                )
                                              : price?.USD && (
                                                  <>
                                                    {
                                                      (
                                                        Number.parseFloat(
                                                          price?.USD
                                                        )?.toFixed(2) + ""
                                                      )?.split(".")[0]
                                                    }
                                                    <sub
                                                      style={{
                                                        verticalAlign: "super",
                                                      }}
                                                    >
                                                      {
                                                        (
                                                          Number.parseFloat(
                                                            price?.USD
                                                          )?.toFixed(2) + ""
                                                        )?.split(".")[1]
                                                      }
                                                    </sub>
                                                  </>
                                                )}

                                            {currentUserlang === "en"
                                              ? price?.INR && (
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
                                                      {getRandomNumberWithOffset(
                                                        price?.INR
                                                      )}
                                                      <sub
                                                        style={{
                                                          verticalAlign:
                                                            "super",
                                                        }}
                                                      >
                                                        00
                                                      </sub>
                                                    </del>
                                                  </>
                                                )
                                              : price?.USD && (
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
                                                      {getRandomNumberWithOffset(
                                                        Number.parseFloat(
                                                          price?.USD
                                                        )?.toFixed(2) +
                                                          ""?.split(".")[0]
                                                      )}
                                                    </del>
                                                  </>
                                                )}
                                          </p>
                                        )}
                                    </>
                                  ))}
                                  <button
                                    className="p-0 border-0 outline-none bg-transparent text-primary"
                                    onClick={(event) => {
                                      return isLoggedIn
                                        ? handleAddToCart(product?.id)
                                        : dispatch(showPopup());
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
                            <div className="flex justify-end items-end  !m-0 !p-0 ">
                              <div className="flex absolute items-center justify-center img-box">
                                <img
                                  src="/images/offerLabel2.png"
                                  alt="ffer_label"
                                  width={65}
                                ></img>
                                <label className="absolute !font-bold text-black !text-xs">
                                  25% OFF
                                </label>
                              </div>
                            </div>
                          </div>
                          // ))
                        );
                      }
                      // count= count + 1
                    })}
                </div>
              </div>
            </section>
            <section class="nk-section nk-cta-section nk-section-content-1">
              <div class="container">
                <div
                  class="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7"
                  // data-aos="fade-up"
                  // data-aos-delay="100"
                >
                  <div class="row g-gs align-items-center">
                    <div class="col-lg-8">
                      <div class="media-group flex-column flex-lg-row align-items-center">
                        <div class="media media-lg media-circle media-middle text-bg-white text-primary mb-2 mb-lg-0 me-lg-2">
                          <em class="icon ni ni-chat-fill"></em>
                        </div>
                        <div class="text-center text-lg-start">
                          <h3 class="text-capitalize m-0 !text-3xl !font-bold">
                            {t("Chat_With_Our_Support_Team")}
                          </h3>
                          <p class="fs-16 opacity-75 !text-lg mt-1">
                            {t("chat_team_desc")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 text-center text-lg-end">
                      <a
                        href={`${userLang}/contact`}
                        class="btn btn-white fw-semiBold"
                      >
                        {t("Contact_support")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
      <div className="nk-sticky-badge">
        <ul>
          <li>
            <a
              href="/"
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
                isLoggedIn
                  ? navigate(`${userLang}/cart`)
                  : dispatch(showPopup())
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
      </div>
    </>
  );
}
