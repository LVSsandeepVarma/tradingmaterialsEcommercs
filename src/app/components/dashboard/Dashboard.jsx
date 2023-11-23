/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";
import Header from "../header/header";
// import { FaBoxOpen, FaWindowClose } from "react-icons/fa";
// import { TbTruckDelivery } from "react-icons/tb";
// import { BsArrowLeftRight } from "react-icons/bs";
// import {MdOutlinePendingActions} from "react-icons/md"
import "../dashboard/dashboard.css";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../footer/footer";
import { Avatar, Box, Divider, Skeleton } from "@mui/material";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import ShippingAddressModal from "../modals/address";
import { MdOutlineMyLocation } from "react-icons/md";
import ViewOrdersDashboard from "./Orders";
import PaymentDetails from "../payments/PaymentDetails";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import { FaRegHeart } from "react-icons/fa6";
import CryptoJS from "crypto-js";
import { updateCartCount, updateWishListCount } from "../../../features/cartWish/focusedCount";
import { logoutUser } from "../../../features/login/loginSlice";
import { updateUsers } from "../../../features/users/userSlice";
import { updateCart } from "../../../features/cartItems/cartSlice";
import { updatePositions } from "../../../features/positions/positionsSlice";
import SessionExpired from "../modals/sessionExpired";
import AddToFav from "../modals/addToFav";

export default function Dashboard() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.login?.value);
  const userData = useSelector((state) => state?.user?.value);
  const products = useSelector((state) => state?.products?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  const [currentUserlang, setCurrentUserLang] = useState(
    localStorage.getItem("i18nextLng")
  );
  const [animateProductId, setAnimateProductId] = useState("");
  const [showWishlistRemoveMsg, setShowWishlistRemoveMsg] = useState(false);
  console.log(userData);
  const [showModal, setShowModal] = useState(false);
  const [showAddtoCartModal, setShowAddToCartModal] = useState(false)
  const [addressUpdateType, setAddressUpdateType] = useState();
  const [addressData, setAddressData] = useState();
  const [allProducts, setAllProducts] = useState([]);
  const [formType, setFormType] = useState("add");
  const [addedToFavImg, setAddedToFavImg] = useState("");
  const [userIp, setUserIp] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [orders, setOrders] = useState();
  const [showSessionExppiry, setShowSessionExpiry] = useState(false);
  const [showPlaceHolderLoader, setShowPlaceHolderLoader] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  useEffect(() => {
    setAllProducts(products?.products);
  }, [products]);

  useEffect(() => {
    if (!localStorage.getItem("client_token")) {
      window.location.href = "/login";
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
  }, []);

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

  // useEffect(()=>{
  //   if(!isLoggedIn){
  //     window.location.href="/login"
  //   }
  // },[isLoggedIn])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(showLoader());
        const token = localStorage.getItem("client_token");
        console.log(token);
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/client/product/checkout/order-list?client_id=${userData?.client?.id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
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
  }, [userData]);

  const { t } = useTranslation();
  const navigate = useNavigate();
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
        setShowAddToCartModal(true);
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

    const handleCartPosition = () => {
      const cartButtonRect = document
        ?.getElementById(`img-4`)
        ?.getBoundingClientRect();
      const top = cartButtonRect?.top;
      const right = cartButtonRect?.left;
      // dispatch(
      //   updatePositions({
      //     cartTop: positions?.cartTop,
      //     cartRight: positions?.cartRight,
      //     productTop: top,
      //     productRight: right,
      //   })
      // );
    };

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
        setShowAddToCartModal(true);
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

    function handleSessionExpiryClose() {
      setShowSessionExpiry(false);
      navigate("/login");
  }
  
    const closeAddToCartModal = () => {
      setShowAddToCartModal(false);
      setModalMessage("");
      setAddedToFavImg("");
    };

  return (
    <>
      <div className="nk-app-root">
        <Header />
        <ShippingAddressModal
          show={showModal}
          onHide={() => setShowModal(false)}
          addressType={addressUpdateType}
          data={addressData}
          type={formType}
        />

        {addedToFavImg !== "" && (
          <AddToFav
            showModal={showAddtoCartModal}
            closeModal={closeAddToCartModal}
            modalMessage={modalMessage}
            addedToFavImg={addedToFavImg}
            wishMsg={showWishlistRemoveMsg}
          />
        )}

        <SessionExpired
          open={showSessionExppiry}
          handleClose={handleSessionExpiryClose}
        />

        <main className="nk-pages mt-10 sm:mt-40 md:mt-[6rem]">
          <section className="nk-section ">
            <div className="nk-mask blur-1 left center"></div>
            <div className="container">
              <div class="row gy-5 gy-xl-0">
                <div
                  class="col-md-3 col-xl-3 justify-content-center"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <div class="left-side-bar max-h-[770px] overflow-y-auto">
                    <div class="profiles  drop-shadow-lg justify-content-center">
                      {userData == {} && (
                        <p className="!font-bold text-xl">No Data Found</p>
                      )}
                      {userData != {} && (
                        <div>
                          <div className="flex justify-center mb-3">
                            {userData?.client?.profile?.profile_image?.length >
                            0 ? (
                              <Avatar
                                alt="user profile"
                                src={userData?.client?.profile?.profile_image}
                                sx={{ width: "60%", height: "70%" }}
                                className=""
                              ></Avatar>
                            ) : (
                              <Avatar
                                alt="user profile"
                                src="/images/blueProfile.webp"
                                sx={{ width: "50%", height: "100%" }}
                                className=""
                              ></Avatar>
                            )}
                          </div>
                          <h4 className="truncate">
                            {userData?.client?.first_name}{" "}
                            {userData?.client?.last_name}
                          </h4>
                          <h5 className="truncate">
                            {userData?.client?.email}
                          </h5>
                          <p>{userData?.client?.phone}</p>
                          <Divider className="!mt-[1rem] !mb-[1rem]" />
                        </div>
                      )}
                    </div>
                    <div class="last-login justify-content-center ">
                      <h4>
                        Last Login:{" "}
                        <span>
                          {new Date().toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </h4>
                      <h4>
                        IP Address: <span>{userIp}</span>
                      </h4>
                      <Divider className="mt-[1rem] mb-[1rem]" />
                    </div>
                    <div className="activitys !max-h-[80%]">
                      <h3 className="!font-bold flex items-center">
                        <IoLocationOutline className="mr-1" />
                        Primary Address :
                      </h3>
                      {userData?.client?.primary_address?.length > 0 ? (
                        <div className=" group  hover:shadow-sm ">
                          <div className="pl-4 group-hover:bg-blue-50">
                            <p className="flex items-center">
                              {/* <IoLocationOutline className="mr-1" /> */}
                              {userData?.client?.primary_address[0]?.add_1},
                            </p>
                            {userData?.client?.primary_address[0]?.add_2 !=
                              null && (
                              <p className="flex items-center">
                                {/* <IoLocationOutline className="mr-1" /> */}
                                {userData?.client?.primary_address[0]?.add_2},
                              </p>
                            )}
                            <p className="flex items-center">
                              {/* <IoLocationOutline className="mr-1" /> */}
                              {userData?.client?.primary_address[0]?.city},
                            </p>
                            <p className="flex items-center">
                              {/* <IoLocationOutline className="mr-1" /> */}
                              {userData?.client?.primary_address[0]?.state},
                            </p>

                            <p className="flex items-center">
                              {userData?.client?.primary_address[0]?.country},
                              {userData?.client?.primary_address[0]?.zip}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="!pl-4">
                              No Address Found,{" "}
                              <b
                                className="hover:!text-blue-600 cursor-pointer !font-bold"
                                onClick={() => {
                                  setAddressUpdateType("");
                                  setShowModal(true);
                                  setAddressData([]);
                                  setFormType("add");
                                }}
                              >
                                Click here to add
                              </b>
                            </p>
                          </div>
                        </>
                      )}
                      <Divider className="my-2" />
                      <h3 className="!font-bold flex items-center">
                        <IoLocationOutline className="mr-1" />
                        Secondary Address
                        {/* {userData?.client?.address?.length > 2
                          ? "es"
                          : userData?.client?.address?.length== 2 ? "" : ""} */}
                        :
                      </h3>
                      {userData?.client?.address?.length > 1 ? (
                        <div>
                          {userData?.client?.address?.length > 1 &&
                            userData?.client?.address?.map((address, ind) => (
                              <div
                                key={ind}
                                className=" group  hover:shadow-sm "
                              >
                                <div className="pl-4 group-hover:bg-blue-50">
                                  <p className="flex items-center">
                                    <MdOutlineMyLocation className="mr-1" />
                                    {address?.add_1},
                                  </p>
                                  {address?.add_2 != null && (
                                    <p className="flex items-center">
                                      {/* <IoLocationOutline className="mr-1" /> */}
                                      {address?.add_2},
                                    </p>
                                  )}
                                  <p className="flex items-center">
                                    {/* <IoLocationOutline className="mr-1" /> */}
                                    {address?.city},
                                  </p>
                                  <p className="flex items-center">
                                    {/* <IoLocationOutline className="mr-1" /> */}
                                    {address?.state},
                                  </p>

                                  <p className="flex items-center">
                                    {address?.country},{address?.zip}
                                  </p>
                                  {userData?.client?.address?.length !=
                                    ind + 1 && <Divider className="my-2" />}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        // </div>
                        <>
                          <div>
                            <p className="!pl-4">
                              No Address Found,{" "}
                              <b
                                className="hover:!text-blue-600 cursor-pointer !font-bold"
                                onClick={() => {
                                  setAddressUpdateType("");
                                  setShowModal(true);
                                  setAddressData([]);
                                  setFormType("add");
                                }}
                              >
                                Click here to add
                              </b>
                            </p>
                          </div>
                        </>
                      )}
                      <Divider className="my-2" />
                    </div>
                    {/* <div class="activitys">
                    <h3>Activity</h3>

                    {orders ?.map((order,ind)=>{
                      if(new Date(order?.created_at).getMonth === new Date()?.getMonth){
                        return(
                        <div key={ind} className="">
                         {ind != 0 && <div class="act-col"><span class="vl"></span></div>}
                          <div class="act-col">
                      <div class="left-c"><span>Order Placed:</span></div>
                      <div class="right-c"><span>{new Date(order?.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
                    </div>
                    <div class="act-col">
                      <div class="left-c">
                        <span
                          >Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.</span
                        >
                      </div>
                      <div class="right-c"><span>29 Aug 2023</span></div>
                    </div>
                    
                        </div>)
                      }

                    })}

                  </div>
                  <div></div>
                  < hr className="mt-[1rem] mb-[1rem]" />
                  <div class="last-months">
                    <h3>Last Month</h3>
                    {orders ?.map((order,ind)=>{
                      if(new Date(order?.created_at).getMonth != new Date()?.getMonth){
                        return(
                          <div key={ind} className="">
                          {ind != 0 && <div class="act-col"><span class="vl"></span></div>}
                           <div class="act-col">
                       <div class="left-c"><span>Order Placed:</span></div>
                       <div class="right-c"><span>{new Date(order?.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
                     </div>
                     <div class="act-col">
                       <div class="left-c">
                         <span
                           >Lorem ipsum dolor sit amet, consectetur adipiscing
                           elit.</span
                         >
                       </div>
                       <div class="right-c"><span>29 Aug 2023</span></div>
                     </div>
                     
                         </div>)
                      }

                    })}
                    
                  </div> */}
                  </div>
                </div>
                <div
                  class="col-md-9 col-xl-9"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  {/* <div class="row">

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Placed
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_pending +
                                  userData?.client?.order_placed}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/placed.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Confirmed
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_confirmed}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/confirmed.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Dispatched
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_dispatched}
                              </h5>
                            </div>
                            <img
                              src="images/orders/dispatched.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Delivered
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_completed}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/delivered.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Cancelled
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_cancelled}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/cancelled.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Returned
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_confirmed}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/returned.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <div className="row">
                    <div className="col-12 col-xl-12 ">
                      <h3 className="text-left text-xl !font-bold text-[#6d6d6d]">
                        Your Orders:
                      </h3>
                      <div className="">
                        <ViewOrdersDashboard ordType={"placed"} />
                      </div>
                    </div>
                  </div>
                  {/* payments */}
                </div>
                <div className="">
                  <div className="col-12 col-xl-12">
                    <PaymentDetails />
                  </div>
                </div>
                <div className="">
                  <div className="col-12 col-xl-12 ">
                    <h3 className="text-left text-xl !font-bold text-[#6d6d6d] mt-4">
                      Featured Products:
                    </h3>
                    <div>
                      <div className="row gy-5 justify-between ">
                        {/* overflow-auto !max-h-[354px] sm:!max-h-[500px] lg:!max-h-[670px] */}
                        {allProducts?.length === 0 && (
                          <p className="font-bold">No products to Display</p>
                        )}
                        {allProducts?.length !== 0 &&
                          allProducts?.map((product) => {
                            if (
                              product?.combo &&
                              product?.stock?.stock != "0"
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
                                          <Skeleton
                                            animation="wave"
                                            width="60%"
                                          />
                                          <Skeleton
                                            animation="wave"
                                            width="30%"
                                          />
                                          <Skeleton
                                            animation="wave"
                                            width="30%"
                                          />
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
                                              {
                                                product?.total_reviews
                                              } Reviews{" "}
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
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
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
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )?.split(".")[1]
                                                              }
                                                              {/* </sub> */}
                                                            </>
                                                          )
                                                        : price?.USD &&
                                                          `${Number.parseFloat(
                                                            price?.USD
                                                          )}`}

                                                      {currentUserlang ===
                                                        "en" &&
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
                                                                    .split(
                                                                      "."
                                                                    )[0]
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
                                                                    .split(
                                                                      "."
                                                                    )[1]
                                                                }
                                                                {/* </sub> */}
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
                                                                    .split(
                                                                      "."
                                                                    )[0]
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
                                                                    .split(
                                                                      "."
                                                                    )[1]
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
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
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
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
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
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
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
                                                                  )?.toFixed(
                                                                    2
                                                                  ) + ""
                                                                )
                                                                  .toString()
                                                                  .split(".")[1]
                                                              }
                                                              {/* </sub> */}
                                                            </>
                                                          )}

                                                      {currentUserlang ===
                                                        "en" &&
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
                                                                    .split(
                                                                      "."
                                                                    )[0]
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
                                                                    .split(
                                                                      "."
                                                                    )[1]
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
                                                                          product?.discount)
                                                                    )?.toFixed(
                                                                      2
                                                                    ) + ""
                                                                  )
                                                                    .toString()
                                                                    .split(
                                                                      "."
                                                                    )[0]
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
                                                                    .split(
                                                                      "."
                                                                    )[1]
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
                                              {animateProductId ===
                                              product?.id ? (
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
                <div
                  className="row g-gs align-items-center"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
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
        </main>

        <Footer />
      </div>
    </>
  );
}
