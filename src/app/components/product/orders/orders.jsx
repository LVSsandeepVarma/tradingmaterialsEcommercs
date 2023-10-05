/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Footer from "../../footer/footer";
import Header from "../../header/header";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  hideLoader,
  showLoader,
} from "../../../../features/loader/loaderSlice";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Divider } from "@mui/material";
import { updateNotifications } from "../../../../features/notifications/notificationSlice";
import { updateCart } from "../../../../features/cartItems/cartSlice";
import { updateCartCount, updateWishListCount } from "../../../../features/cartWish/focusedCount";
// import { showPopup } from "../../../../features/popups/popusSlice";
import ShippingAddressModal from "../../modals/address";
import { usersignupinModal } from "../../../../features/signupinModals/signupinSlice";
import AddToFav from "../../modals/addToFav";

export default function Orders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { client_id } = useParams();
  const loaderState = useSelector((state) => state?.loader?.value);
  const products = useSelector((state) => state?.products?.value?.products);
  const userLang = useSelector((state) => state?.lang?.value);
  const isLoggedIn = useSelector((state) => state?.login?.value);
  const [showModal, setShowModal] = useState(false);
  const [orderShippingAddress, setOrderShippingAddress] = useState([]);
  const [addedToFavImg, setAddedToFavImg] = useState("")
  const [showFavModal, setShowFavModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [dateValue, setDateValue] = useState("")
  const [showWishlistRemoveMsg, setShowWishlistRemoveMsg] = useState(false)
  const [currentUserlang, setCurrentUserLang] = useState(
    localStorage.getItem("i18nextLng")
  );
  const userData = useSelector((state) => state?.user?.value)

  const decryptedId = CryptoJS.AES.decrypt(
    client_id.replace(/_/g, "/").replace(/-/g, "+"),
    "order_details"
  ).toString(CryptoJS.enc.Utf8);

  // useEffect(()=>{
  //   dispatch(
  //     usersignupinModal({
  //       showSignupModal: false,
  //       showLoginModal: true,
  //       showforgotPasswordModal: false,
  //       showOtpModal: false,
  //       showNewPasswordModal: false,
  //     })
  //   )
  // },[])

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

  async function handleAddToCart(productId, productImg) {
    try {
      // setAnimateProductId(productId);
      dispatch(showLoader());
      const response = await axios?.post(
        "https://admin.tradingmaterials.com/api/lead/product/add-to-cart",
        {
          product_id: productId,
          qty: 1,
        },
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        setAddedToFavImg(productImg)
        setShowModal(true)
        setModalMessage("Added to your cart successfully")
        // setAnimateProductId(productId);
        // dispatch(
        //   updateNotifications({
        //     type: "success",
        //     message: response?.data?.message,
        //   })
        // );
        dispatch(updateCart(response?.data?.data?.cart_details));
        dispatch(updateCartCount(response?.data?.data?.cart_count));
        if(userData?.client?.wishlist?.length >0){
          const ids = userData?.client?.wishlist?.map(item =>item?.product_id)
          const isPresent = ids?.includes(productId)
          console.log(isPresent,ids,productId,"prest")
          if(isPresent){
            dispatch(updateWishListCount(userData?.client?.wishlist?.length -1))
            setShowWishlistRemoveMsg(true)
          }else{
            setShowWishlistRemoveMsg(false)
          }
        }
        
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  }

  console.log(decryptedId);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(showLoader());
        const token = localStorage.getItem("client_token");
        console.log(token);
        const response = await axios.get(
          "https://admin.tradingmaterials.com/api/lead/product/checkout/order-list",
          {
            headers: {
              "access-token": token,
            },
          }
        );
        if (response?.data?.status) {
          console.log(response?.data);

          const data = response?.data?.data?.order;
          // Sort the array in descending order based on 'created_at'
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          setOrders(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoader());
      }
    };
    fetchOrders();
  }, []);

  const handleViewAddress = (address) => {
    setOrderShippingAddress(address);
    setShowModal(true);
  };

  const handleOrderSearchByNumber = async (order_number) => {
    try {
      dispatch(showLoader());
      if (order_number?.target?.value !== "") {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
      console.log(order_number?.target?.value);
      const filteredOrders = orders?.filter((order) => {
        return order?.order_number == order_number?.target?.value;
      });
      setFilteredOrders(filteredOrders);
      console.log(filteredOrders, "ttttt");
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(()=>{
    handleOrderSearchByDate(new Date().toISOString().slice(0, 10))
    
  },[orders])

  const handleOrderSearchByDate = async (order_date) => {
    try {
      dispatch(showLoader());
      setDateValue(order_date)
      if (order_date !== "") {
        console.log(order_date, "datettt")
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
      console.log(order_date?.replaceAll("-", `/`),orders, "ttttt");
      const date = new Date(order_date);
const formattedDate = `${(date.getMonth()+1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
      const filterOrders = orders?.filter((order) => {
        console.log(
          new Date(order?.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            
            
          }), formattedDate
        , "ttttt");
        return (
          new Date(order?.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }) == formattedDate
        );
      });
      setFilteredOrders(filterOrders);
      console.log(filterOrders, "ttttt");
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

  const closeModal=()=>{
    setShowFavModal(false);
    setModalMessage("")
    setAddedToFavImg("")
  }

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      {addedToFavImg!== "" && 
        <AddToFav showModal={showFavModal} closeModal={closeModal} modalMessage={modalMessage} addedToFavImg={addedToFavImg} showWishlistRemove = {showWishlistRemoveMsg} />
      }
      <ShippingAddressModal
        show={showModal}
        onHide={() => setShowModal(false)}
        type={"view"}
        addressType={"shipping"}
        data={orderShippingAddress[0]}
        // handleFormSubmit={handleFormSubmit}
      />
      <div className="nk-app-root careers">
        <Header />
        <main className="nk-pages">
          <section className="nk-banner nk-banner-career-job-details  bg-gray">
            <div className="nk-banner-wrap pt-120 pt-lg-180 pb-lg-320">
              <div className="container">
                <div className="">
                  <div className="">
                    <div className="!text-left">
                      <a
                        href="/"
                        className="btn-link mb-2 !inline-flex !items-center !text-large !font-semibold !text-left"
                      >
                        <em className="icon ni ni-arrow-left  !inline-flex !items-center !text-large !font-semibold"></em>
                        <span>Back to Home</span>
                      </a>
                      <h1
                        className="mb-3 !font-bold   text-left"
                        style={{ fontSize: "3rem" }}
                      >
                        Your Orders
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="form-group w-[65%]">
                      <div className="form-control-wrap">
                        <div className="icon">
                          <em className="icon ni ni-search cursor-pointer"></em>
                        </div>
                        <input
                          type="search"
                          name="search"
                          className="w-[100%]  form-control  !py-2 !ps-10 border"
                          placeholder="Search your orders with order number"
                          required
                          onChange={handleOrderSearchByNumber}
                        />
                      </div>
                    </div>

                    <div className="form-group w-[35%]">
                      <div className="form-control-wrap">
                        <div className="icon">
                          <em className="icon ni ni-search cursor-pointer"></em>
                        </div>
                        <input
                          type="date"
                          name="search"
                          className="w-[100%]  form-control  !py-2 !ps-10 border"
                          placeholder="Search your orders with order date"
                          value={dateValue}
                          required
                          onChange={(e)=>{handleOrderSearchByDate(e.target.value)}}
                        />
                      </div>
                    </div>
                    {/* <input type='search' onChange={handleOrderSearchByNumber} className='w-[65%]  form-control  !py-2 !ps-10 border' placeholder='Search your orders with order number'/> */}
                    {/* <input type='search' onChange={handleOrderSearchByDate} className='w-[30%] form-control  !py-2 !ps-10 border' placeholder='Search your orders with order date'/> */}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`nk-section nk-section-job-details pt-lg-0 `}>
            <div className={` `}></div>
            <div className="container">
              <div className={`nk-section-content row px-lg-3 drop-shadow-lg `}>
                <div className="col-lg-7 pe-lg-0 mt-[17px]">
                  <div className="nk-entry pe-lg-5 py-lg-1">
                    {filteredOrders?.length === 0 && (
                      <p className="flex !items-center !justify-center mt-5 text-xl  !w-full">
                        Your Orders are empty
                      </p>
                    )}
                    
                    <div className="table-responsive">
                      {filteredOrders?.length > 0 &&
                        filteredOrders?.map((order, ind) => (
                          <>
                            <div className=" border-1 shadow-lg ">
                              <table className="table ">
                                <thead className="table-success !bg-white">
                                  <tr>
                                    {/* <th>SHIP TO<br/><span className="th-tex">{order?.shipping_add1}</span></th> */}
                                    <th>
                                      SHIP TO PINCODE
                                      <br />
                                      <span className="th-tex !font-light !text-[#77839c]">
                                        {order?.shipping_zip}
                                      </span>
                                    </th>
                                    <th>
                                      ORDER ID
                                      <br />
                                      <span className="th-tex !font-light !text-[#77839c]">
                                        {order?.order_number}
                                      </span>
                                    </th>
                                    <th className="">
                                      INVOICE
                                      <br />
                                      <span
                                        className="th-tex !font-light !text-[#77839c]"
                                        style={{ opacity: 0 }}
                                      >
                                        5562
                                      </span>
                                    </th>
                                    <th>
                                      DELIVERY STATUS
                                      <br />
                                      <span className="th-tex !font-light !text-[#77839c]">
                                        Ready To Pack
                                      </span>
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                              <table className="table ">
                                <thead>
                                  <th colSpan="3" className="th-text-1">
                                    Delivered Saturday
                                    <Divider className="!w-full" />
                                  </th>
                                </thead>

                                <tbody className="">
                                  <tr className="flex justify-around text-left drop-shadow-lg">
                                    <td className="product-img">
                                      <img
                                        src={order?.product?.product?.img_1}
                                        width={200}
                                        alt="product image"
                                      />
                                    </td>
                                    <td>
                                      <table>
                                        <tr>
                                          <td className="td-text-1">
                                            {order?.product?.product?.name}
                                          </td>
                                        </tr>

                                        <tr>
                                          <td className="td-text-2">
                                            Return eligible through 15-Jun-2023
                                          </td>
                                        </tr>

                                        <tr>
                                          <td className="td-btn">
                                            <a
                                              href={`/checkout/order_id/${CryptoJS?.AES?.encrypt(
                                                `${order.id}`,
                                                "trading_materials_order"
                                              )
                                                ?.toString()
                                                .replace(/\//g, "_")
                                                .replace(/\+/g, "-")}`}
                                              target="_blank"
                                              className="btn btn-outline-dark border"
                                              rel="noreferrer"
                                            >
                                              <span
                                                style={{ fontSize: "12px" }}
                                              >
                                                View complete order
                                              </span>
                                            </a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td colSpan="3" className="td-btn-center">
                                      <a
                                        onClick={() => {
                                          handleViewAddress([
                                            {
                                              add_1: order?.shipping_add1,
                                              add_2: order?.shipping_add2,
                                              city: order?.shipping_city,
                                              state: order?.shipping_state,
                                              country: order?.shipping_country,
                                              zip: order?.shipping_zip,
                                            },
                                          ]);
                                        }}
                                        className="btn btn-outline-dark border w-100  margin-space"
                                      >
                                        <span style={{ fontSize: "12px" }}>
                                          Shipped To
                                        </span>
                                      </a>
                                      <br />
                                      {/* <a href={`/track-order/${order?.id}`} target="_blank" className="btn btn-outline-dark border w-100 mt-2 margin-space"><span style={{fontSize:"12px"}}>Track Order</span></a><br/> */}
                                      <a
                                        href="#"
                                        className="btn btn-outline-dark border w-100 mt-2 margin-space"
                                      >
                                        <span style={{ fontSize: "12px" }}>
                                          Review Product
                                        </span>
                                      </a>
                                      <br />
                                      <a
                                        href="/contact"
                                        target="_blank"
                                        className="btn btn-outline-dark border mt-2 w-100"
                                      >
                                        <span style={{ fontSize: "12px" }}>
                                          Contact Support
                                        </span>
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ))}
                    </div>
                  </div>

                  {filteredOrders?.length > 0 && (
                    <div className="row mt-1">
                      <div className="col-lg-4 col-md-6 col-sm-12 ">
                        <div className="mb-3">
                          <a
                            href="#"
                            className="btn-link text-primary !text-sm"
                          >
                            <span>Write a review</span>
                            <em className="icon ni ni-arrow-right"></em>
                          </a>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="mb-3">
                          <a href="#" className="btn-link text-primary text-sm">
                            <span>Buy It Again</span>
                            <em className="icon ni ni-arrow-right"></em>
                          </a>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="mb-3">
                          <a href="#" className="btn-link text-primary text-sm">
                            <span>Deliver on Date</span>
                            <em className="icon ni ni-arrow-right"></em>
                          </a>
                        </div>
                      </div>

                      {/* <div className="col-lg-3 col-md-6 col-sm-12">
									<div className="mb-3">
										<a href="#" className="btn-link text-primary "><span>Bordering</span><em className="icon ni ni-arrow-right"></em></a>
									</div>
								</div> */}
                    </div>
                  )}
                </div>
                <div className="col-lg-5 ps-lg-0 ">
                  <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5">
                    <div className="nk-section-blog-details">
                      <h4 className="mb-3 text-2xl text-left !font-bold">
                        Recently Delivered Items
                      </h4>
                      <div className="d-flex flex-column gap-2 pb-5">
                        {products?.map((product, ind) => (
                          <div key={ind} className="group hover:shadow-xl">
                            {ind < 5 && (
                              <div className="">
                                <div className="row mt-2 ">
                                  <div
                                    className="col-lg-5 ps-lg-3 cursor-pointer"
                                    onClick={() =>
                                      navigate(
                                        `${userLang}/product-detail/${
                                          product?.slug
                                        }/${CryptoJS?.AES?.encrypt(
                                          `${product?.id}`,
                                          "trading_materials"
                                        )
                                          ?.toString()
                                          .replace(/\//g, "_")
                                          .replace(/\+/g, "-")}`,
                                        {
                                          target: "_blank",
                                        }
                                      )
                                    }
                                  >
                                    <div className=" ">
                                      <img
                                        className="group-hover:scale-103 product-img"
                                        style={{ borderRadius: "0.5rem" }}
                                        src={product?.img_1}
                                        alt="small-img"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-lg-7 ps-lg-0 !drop-shadow-lg">
                                    <div className="gap-5">
                                      <p className="m-0 fs-16 w-100 td-text-3 !text-left group-hover:!font-bold group-hover:!text-black">
                                        {product?.name}
                                      </p>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between">
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
                                                            )?.toFixed(2) + ""
                                                          )?.split(".")[0]
                                                        }
                                                        <sub
                                                          style={{
                                                            verticalAlign:
                                                              "super",
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

                                                {currentUserlang === "en" &&
                                                product?.discount > 0
                                                  ? price?.INR &&
                                                    product?.discount > 0 && (
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
                                                              )?.toFixed(2) + ""
                                                            )
                                                              .toString()
                                                              .split(".")[0]
                                                          }
                                                          <sub
                                                            style={{
                                                              verticalAlign:
                                                                "super",
                                                            }}
                                                          >
                                                            {
                                                              (
                                                                parseFloat(
                                                                  price?.INR *
                                                                    (100 /
                                                                      (100 -
                                                                        product?.discount))
                                                                )?.toFixed(2) +
                                                                ""
                                                              )
                                                                .toString()
                                                                .split(".")[1]
                                                            }
                                                          </sub>
                                                        </del>
                                                      </>
                                                    )
                                                  : price?.USD &&
                                                    product?.discount > 0 && (
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
                                                              )?.toFixed(2) + ""
                                                            )
                                                              .toString()
                                                              .split(".")[0]
                                                          }
                                                          <sub
                                                            style={{
                                                              verticalAlign:
                                                                "super",
                                                            }}
                                                          >
                                                            {
                                                              (
                                                                parseFloat(
                                                                  price?.INR *
                                                                    (100 /
                                                                      (100 -
                                                                        product?.discount))
                                                                )?.toFixed(2) +
                                                                ""
                                                              )
                                                                .toString()
                                                                .split(".")[1]
                                                            }
                                                          </sub>
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
                                                            )?.toFixed(2) + ""
                                                          )
                                                            .toString()
                                                            .split(".")[0]
                                                        }
                                                        <sub
                                                          style={{
                                                            verticalAlign:
                                                              "super",
                                                          }}
                                                        >
                                                          {
                                                            (
                                                              parseFloat(
                                                                price?.INR
                                                              )?.toFixed(2) + ""
                                                            )
                                                              .toString()
                                                              .split(".")[1]
                                                          }
                                                        </sub>
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
                                                        <sub
                                                          style={{
                                                            verticalAlign:
                                                              "super",
                                                          }}
                                                        >
                                                          {
                                                            (
                                                              parseFloat(
                                                                price?.USD
                                                              )?.toFixed(2) + ""
                                                            )
                                                              .toString()
                                                              .split(".")[1]
                                                          }
                                                        </sub>
                                                      </>
                                                    )}

                                                {currentUserlang === "en" &&
                                                product?.discount > 0
                                                  ? price?.INR &&
                                                    product?.discount > 0 && (
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
                                                              )?.toFixed(2) + ""
                                                            )
                                                              .toString()
                                                              .split(".")[0]
                                                          }
                                                          <sub
                                                            style={{
                                                              verticalAlign:
                                                                "super",
                                                            }}
                                                          >
                                                            {
                                                              (
                                                                parseFloat(
                                                                  price?.INR *
                                                                    (100 /
                                                                      (100 -
                                                                        product?.discount))
                                                                )?.toFixed(2) +
                                                                ""
                                                              )
                                                                .toString()
                                                                .split(".")[1]
                                                            }
                                                          </sub>
                                                        </del>
                                                      </>
                                                    )
                                                  : price?.USD &&
                                                    product?.discount > 0 && (
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
                                                                    product?.discount)
                                                              )?.toFixed(2) + ""
                                                            )
                                                              .toString()
                                                              .split(".")[0]
                                                          }
                                                          <sub
                                                            style={{
                                                              verticalAlign:
                                                                "super",
                                                            }}
                                                          >
                                                            {
                                                              (
                                                                parseFloat(
                                                                  price?.INR *
                                                                    (100 /
                                                                      (100 -
                                                                        product?.discount))
                                                                )?.toFixed(2) +
                                                                ""
                                                              )
                                                                .toString()
                                                                .split(".")[1]
                                                            }
                                                          </sub>
                                                        </del>
                                                      </>
                                                    )}
                                              </p>
                                            )}
                                        </>
                                      ))}
                                    </div>

                                    <div className="pt-1 mb-2 d-flex justify-start">
                                      <button
                                        className="btn btn-outline-primary drop-shadow-lg"
                                        style={{ fontSize: "12px" }}
                                        onClick={(event) => {
                                          return isLoggedIn
                                            ? handleAddToCart(product?.id, product?.img_1)
                                            : dispatch(
                                              usersignupinModal({
                                                showSignupModal: false,
                                                showLoginModal: true,
                                                showforgotPasswordModal: false,
                                                showOtpModal: false,
                                                showNewPasswordModal: false,
                                              }))
                                        }}
                                      >
                                        Addto Cart
                                      </button>
                                    </div>
                                    <div className="d-flex align-items-center  mb-1 gap-1 mt-1 !text-right !w-full">
                                      {ratingStars(product?.rating)}
                                      <span className="fs-14 text-gray-800">
                                        {" "}
                                        ({product?.total_reviews} Reviews){" "}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <hr />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                    <a href="/contact" className="btn btn-white fw-semiBold">
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
