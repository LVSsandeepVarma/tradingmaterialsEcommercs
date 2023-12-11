/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MailIcon from "@mui/icons-material/Mail";
import EmailIcon from "@mui/icons-material/Email";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { updateUsers } from "../../../features/users/userSlice";
import Footer from "../footer/footer";
import { updateCart } from "../../../features/cartItems/cartSlice";
import {
  FaBoxesPacking,
  FaCartArrowDown,
  FaHeart,
  FaLocationDot,
  FaRightFromBracket,
} from "react-icons/fa6";

import {
  updateCartCount,
  updateWishListCount,
} from "../../../features/cartWish/focusedCount";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Avatar, CardActionArea, Tooltip } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BusinessIcon from "@mui/icons-material/Business";
import axios from "axios";
import { Button } from "@mui/material";
import ShippingAddressModal from "../modals/address";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";
import { FaMinusCircle } from "react-icons/fa";
import CryptoJS from "crypto-js";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { BiSolidPhoneCall } from "react-icons/bi";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutUser } from "../../../features/login/loginSlice";
import AddToFav from "../modals/addToFav";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import SessionExpired from "../modals/sessionExpired";
import EditIcon from "@mui/icons-material/Edit";

// import { logoutUser } from "../../../features/login/loginSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function SideBar() {
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [showModal, setShowModal] = useState(false);
  const [addressUpdateType, setAddressUpdateType] = useState();
  const [addressData, setAddressData] = useState();
  const userData = useSelector((state) => state?.user?.value);
  const tabs = ["Address", "Cart", "Wishlist", "Orders"];
  const [animateProductId, setAnimateProductId] = useState("");
  const [formType, setFormType] = useState("add");
  const [addedToFavImg, setAddedToFavImg] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showWishlistRemoveMsg, setShowWishlistRemoveMsg] = useState(false);
  const [dialogShow, setDialogShow] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [showFileInput, setShowFileInput] = useState(false);
  const [profileUploadErr, setProfileUploadErr] = useState("");
  const [showSessionExppiry, setShowSessionExpiry] = useState(false);
  const [isEditIconVisible, setIsEditIconVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLang = useSelector((state) => state?.lang?.value);
  const addressStatus = useSelector((state) => state?.addressStatus?.value);
  const isLoggedIn = useSelector((state) => state?.login?.value);

  const handleMouseEnter = () => {
    setIsEditIconVisible(true);
  };

  const handleMouseLeave = () => {
    setIsEditIconVisible(false);
  };

  const imageUpdate = async () => {
    dispatch(showLoader());
    const token = localStorage.getItem("client_token");

    try {
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/update-profile-image",
        {
          profile_image: profileImage,
          client_id: userData?.client?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        window.location.reload();
      }
    } catch (error) {
      setProfileUploadErr(error?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  const closedialogModal = () => {
    setDialogShow(false);
    setModalMessage("");
    setAddedToFavImg("");
  };

  useEffect(() => {
    if (window?.location?.search === "?wishlist") {
      setActiveIndex(2);
    } else if (window.location.search === "?orders") {
      setActiveIndex(3);
    }
  }, []);

  //function for review stars
  function ratingStars(number) {
    const elemetns = Array.from({ length: 5 }, (_, index) => (
      <>
        {index < number && (
          <li key={index}>
            <em className="icon ni ni-star-fill text-yellow"></em>
          </li>
        )}
        {index >= number && (
          <li key={index}>
            <em className="icon ni ni-star-fill text-gray-700"></em>
          </li>
        )}
      </>
    ));

    return <ul className="d-flex align-items-center">{elemetns}</ul>;
  }

  const getUserInfo = async () => {
    try {
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
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        dispatch(updateCartCount(response?.data?.data?.client?.cart_count));
      } else {
        setShowSessionExpiry(true);
        // navigate("/login")
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

  // function for handling add to cart animation

  useEffect(() => {
    const timoeOut = setTimeout(() => {
      setAnimateProductId("");
    }, 3000);

    return () => {
      clearTimeout(timoeOut);
    };
  }, [animateProductId]);

  useEffect(() => {
    getUserInfo();
  }, [addressStatus]);

  async function handleLogout() {
    try {
      dispatch(showLoader());
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/auth/logout",
        { client_id: userData?.client?.id },
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
            Accept: "application/json",
          },
        }
      );

      if (response?.status) {
        dispatch(logoutUser());
        localStorage.removeItem("client_token");
        dispatch(updateNotifications({ type: "", message: "" }));
        navigate(`${userLang}/`);
        window.location.reload();
      }
    } catch (err) {
      console.log("err", err);
      navigate("/login")
    } finally {
      dispatch(hideLoader());
    }
  }

  const handleActiveTab = (index) => {
    if (index !== 3 && index !== 4 && index !== 1 && index != 0) {
      setActiveIndex(index);
    } else {
      if (index === 3) {
        window.location.href =
          userData?.order_placed_count != 0
            ? "/view-order/placed"
            : userData?.order_confirmed_count != 0
            ? "/view-order/confirmed"
            : userData?.order_dispatched_count != 0
            ? "/view-order/dispatched"
            : userData?.order_delivered_count != 0
            ? "/view-order/delivered"
            : "/view-order/placed";
      } else if (index === 4) {
        handleLogout();
      } else if (index == 1) {
        window.location.href = "/cart";
      } else if (index == 0) {
        window.location.href = "/profile";
      }
    }
  };

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
        setDialogShow(true);
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
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      setShowFileInput(false);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (profileImage) {
      imageUpdate();
    }
  }, [handleImageUpload]);

  function handleSessionExpiryClose() {
    setShowSessionExpiry(false);
    navigate("/login");
  }

  return (
    <>
      <SessionExpired
        open={showSessionExppiry}
        handleClose={handleSessionExpiryClose}
      />
      <ShippingAddressModal
        show={showModal}
        onHide={() => setShowModal(false)}
        addressType={addressUpdateType}
        data={addressData}
        type={formType}
      />
      {addedToFavImg !== "" && (
        <AddToFav
          showModal={dialogShow}
          closeModal={closedialogModal}
          modalMessage={modalMessage}
          addedToFavImg={addedToFavImg}
          wishMsg={showWishlistRemoveMsg}
        />
      )}
      <Header />
      <div className="">
        <main className="nk-pages mt-20 sm:mt-20 md:mt-24">
          <section className="nk-section ">
            <div className="nk-mask blur-1 left center"></div>
            <div className="container">
              <div className="card rounded-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-3 m-auto flex !justify-center">
                      <div className="profile-container w-fit h-fit text-center relative group ">
                        <label htmlFor="upload-button cursor-pointer w-fit h-fit">
                          <div className="edit-icon  text-center z-10 !cursor-pointer left-1/2 -translate-x-1/2 hidden group-hover:block justify-center w-full overflow-clip absolute top-[112px] h-14 bg-[rgba(255,255,255,0.5)]  !shadow-none">
                            <EditIcon className="mx-auto" />
                          </div>

                          <Tooltip
                            title="upload profile"
                            placement="bottom-end"
                          >
                            {userData?.client?.profile?.profile_image?.length >
                            0 ? (
                              <>
                                <Avatar
                                  alt="user profile"
                                  src={userData?.client?.profile?.profile_image}
                                  sx={{ width: "140px", height: "140px" }}
                                  className="cursor-pointer"
                                ></Avatar>
                              </>
                            ) : (
                              <>
                                <Avatar
                                  alt="user profile"
                                  src="/images/blueProfile.webp"
                                  sx={{ width: "140px", height: "140px" }}
                                  className=""
                                ></Avatar>
                              </>
                            )}
                          </Tooltip>
                        </label>
                        <input
                          type="file"
                          id="upload-button"
                          onChange={handleImageUpload}
                          className="opacity-0 visibility-0  absolute w-full h-full z-50 right-0 cursor-pointer"
                        />
                        {profileUploadErr && (
                          <p className="text-red-600">{profileUploadErr}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-9  md:flex align-items-center profile-container">
                      <div className="profile-container w-100">
                        <div className="client-details">
                          <h4 className="mb-1 !font-bold text-xl ">
                            {userData?.client?.first_name}{" "}
                            {userData?.client?.last_name}
                          </h4>
                          <p className="mb-2 fs-14 ">
                            {userData?.client?.email} -{" "}
                            <span className="text-black">
                              {userData?.client?.email_verified == 1
                                ? "Verified"
                                : "New"}
                            </span>
                          </p>
                          {/* <p className="mb-2 fs-14">
                            +91 {userData?.client?.phone}
                          </p> */}
                          <p className="mb-0 text-center md:flex justify-content-between align-items-center flex-wrap ">
                            <span className="mb-2 fs-14">
                              +91 {userData?.client?.phone}
                            </span>
                            <p className="fs-12 text-muted">
                              Created On :{" "}
                              <b>
                                {new Date(
                                  userData?.client?.created_at
                                ).toLocaleDateString("en-US", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </b>{" "}
                            </p>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="mb-4 mt-2" />
                  <div className="row">
                    <div className="col-lg-3 ">
                      <div
                        className="nav flex-column  me-3"
                        id="v-pills-tab"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        <button
                          className={` nav-link !border-none ${
                            activeIndex == 0 ? "active bg-[#e6ebfc]" : ""
                          } flex items-center gap-3 !w-full justify-start font-bold`}
                          id="v-pills-address-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-address"
                          type="button"
                          role="tab"
                          aria-controls="v-pills-address"
                          aria-selected="true"
                          onClick={() => handleActiveTab(0)}
                        >
                          <FaLocationDot /> Address
                        </button>
                        <button
                          className={`nav-link !border-none flex items-center gap-3 !w-full justify-start font-bold ${
                            activeIndex == 1 ? "active bg-[#e6ebfc]" : ""
                          }`}
                          id="v-pills-cart-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-cart"
                          type="button"
                          role="tab"
                          aria-controls="v-pills-cart"
                          aria-selected="false"
                          onClick={() => handleActiveTab(1)}
                        >
                          <FaCartArrowDown />
                          Cart
                        </button>
                        <button
                          className={`nav-link !border-none flex items-center gap-3 !w-full justify-start font-bold ${
                            activeIndex == 2 ? "active bg-[#e6ebfc]" : ""
                          } `}
                          id="v-pills-wishlist-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-wishlist"
                          type="button"
                          role="tab"
                          aria-controls="v-pills-wishlist"
                          aria-selected="false"
                          onClick={() => handleActiveTab(2)}
                        >
                          <FaHeart /> Wishlist
                        </button>
                        <button
                          className={`nav-link !border-none flex items-center gap-3 !w-full justify-start font-bold ${
                            activeIndex == 3 ? "active bg-[#e6ebfc]" : ""
                          }`}
                          id="v-pills-orders-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-orders"
                          type="button"
                          role="tab"
                          aria-controls="v-pills-orders"
                          aria-selected="false"
                          onClick={() => handleActiveTab(3)}
                        >
                          <FaBoxesPacking />
                          Orders
                        </button>
                        <button
                          className={`nav-link !border-none flex items-center gap-3 !w-full justify-start font-bold ${
                            activeIndex == 4 ? "active bg-[#e6ebfc]" : ""
                          }`}
                          id="v-pills-logout-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-logout"
                          type="button"
                          role="tab"
                          aria-controls="v-pills-logout"
                          aria-selected="false"
                          onClick={() => handleActiveTab(4)}
                        >
                          <FaRightFromBracket />
                          Logout
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-9">
                      <div
                        className="tab-content border px-2 h-100"
                        id="v-pills-tabContent"
                      >
                        <div
                          className=" max-w-full  ml-2"
                          style={{
                            flexGrow: 1,
                          }}
                        >
                          <p
                            className="pt-2 ml-2 !mt-2 md:!ml-2 md:!p-0 md:!m-2 text-left text-sm font-bold"
                            style={{ color: "darkgray" }}
                          >
                            {" "}
                            {activeIndex > 0
                              ? "Product details"
                              : "Profile Details"}{" "}
                            &gt;{" "}
                            <b style={{ color: "black" }}>
                              {tabs[activeIndex]}
                            </b>
                          </p>
                          <DrawerHeader />

                          {activeIndex === 0 && (
                            <>
                              <div>
                                <h4 className=" !font-bold">Address</h4>
                                <div className="!mb-3">
                                  <small className="w-full !text-left">
                                    {userData?.client?.primary_address?.length >
                                    0
                                      ? "Showing all addresses"
                                      : "No Address Found"}
                                  </small>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4  mb-2">
                                    {userData?.client?.address?.map(
                                      (address, ind) => (
                                        <div
                                          key={ind}
                                          className="col-sm-4  w-fit border border-1 p-3  text-left !w-[95%]  mt-5 ml-2 mr-3  gap-5"
                                        >
                                          {/* !min-w-[75%]  sm:!min-w-[25%] sm:max-w-[40%] */}
                                          <CardActionArea
                                            onClick={() => {
                                              if (ind == 0) {
                                                setAddressUpdateType("primary");
                                                setShowModal(true);
                                                setFormType("update");
                                                setAddressData(
                                                  userData?.client?.address[ind]
                                                );
                                              } else {
                                                setAddressUpdateType("");
                                                setShowModal(true);
                                                setFormType("update");
                                                setAddressData(
                                                  userData?.client?.address[ind]
                                                );
                                              }
                                            }}
                                          >
                                            <h3
                                              className={`!font-bold ${
                                                ind == 0 ? "!text-blue-600" : ""
                                              }`}
                                            >
                                              {ind == 0
                                                ? "Primary Address"
                                                : `Secondary Address - ${ind}`}
                                            </h3>
                                            <p className="truncate">
                                              {address?.add_1},
                                            </p>
                                            {address?.add_2 !== null
                                              ? `${address?.add_2},`
                                              : ""}
                                            <p className="truncate">
                                              {address?.city},
                                            </p>
                                            <p className="truncate">
                                              {address?.state},
                                            </p>
                                            <p className="truncate">
                                              {address?.country},
                                            </p>
                                            <p className="truncate">
                                              {address?.zip}.
                                            </p>
                                          </CardActionArea>
                                        </div>
                                      )
                                    )}
                                    <Button
                                      className="!ml-2 !mt-7"
                                      onClick={() => {
                                        setAddressUpdateType("");
                                        setShowModal(true);
                                        setAddressData([]);
                                        setFormType("add");
                                      }}
                                    >
                                      + Add new Address
                                    </Button>
                                  </div>
                                  {/* <Divider /> */}
                                </div>
                              </div>
                            </>
                          )}
                          {activeIndex === 1 && (
                            <>
                              <div className="mx-2">
                                <h4 className="!font-bold">Your cart</h4>
                                <Divider />
                                {userData?.client?.cart?.length === 0 && (
                                  <div>
                                    <FaMinusCircle
                                      className="text-center w-full mt-5 "
                                      size={45}
                                      color="red"
                                    />
                                    <div className="flex justify-center items-center ">
                                      <img
                                        className="text-center"
                                        style={{ filter: "blur(2px)" }}
                                        src="/images/favicon.webp"
                                      ></img>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-red-600 font-semibold">
                                        Your cart is Empty.
                                      </p>
                                      <p
                                        className="text-center font-semibold cursor-pointer"
                                        onClick={() => navigate(`${userLang}/`)}
                                        style={{ color: "#007aff" }}
                                      >
                                        Add Products to Cart
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {userData?.client?.cart?.length > 0 && (
                                  <div className="row gy-5">
                                    {userData?.client?.cart?.map(
                                      (product, ind) => (
                                        <div
                                          key={ind * 2}
                                          className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]"
                                        >
                                          <Card
                                            className="mt-5 "
                                            sx={{ maxWidth: 345 }}
                                          >
                                            <CardActionArea>
                                              <CardMedia
                                                component="img"
                                                height="140"
                                                image={product?.product?.img_1}
                                                alt="green iguana"
                                                className="sm:!h-[300px] "
                                                onClick={() =>
                                                  navigate(
                                                    `${userLang}/product-detail/${
                                                      product?.product?.slug
                                                    }/${CryptoJS?.AES?.encrypt(
                                                      `${product?.product?.id}`,
                                                      "trading_materials"
                                                    )
                                                      ?.toString()
                                                      .replace(/\//g, "_")
                                                      .replace(/\+/g, "-")}`
                                                  )
                                                }
                                              />
                                              <CardContent>
                                                <Typography
                                                  gutterBottom
                                                  variant="h5"
                                                  component="div"
                                                >
                                                  <div className="nk-card-info bg-white p-4">
                                                    <a
                                                      href={`${userLang}/product-detail/${
                                                        product?.product?.slug
                                                      }/${CryptoJS?.AES?.encrypt(
                                                        `${product?.id}`,
                                                        "trading_materials"
                                                      )
                                                        ?.toString()
                                                        .replace(/\//g, "_")
                                                        .replace(/\+/g, "-")}`}
                                                      className="d-inline-block mb-1 line-clamp-1 h5 !font-bold text-left"
                                                      style={{
                                                        textOverflow:
                                                          "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        width: "90%",
                                                      }}
                                                    >
                                                      {product?.product?.name}
                                                      <br />
                                                      <span className="text-xs !mt-1">
                                                        <p
                                                          onClick={() => {
                                                            navigate(
                                                              `${userLang}/product-detail/${
                                                                product?.product
                                                                  ?.slug
                                                              }/${CryptoJS?.AES?.encrypt(
                                                                `${product?.id}`,
                                                                "trading_materials"
                                                              )
                                                                ?.toString()
                                                                .replace(
                                                                  /\//g,
                                                                  "_"
                                                                )
                                                                .replace(
                                                                  /\+/g,
                                                                  "-"
                                                                )}`
                                                            );
                                                            dispatch(
                                                              showLoader()
                                                            );
                                                          }}
                                                          className="!mt-5 text-gray-700  truncate"
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              product?.product
                                                                ?.description
                                                                ?.length > 55
                                                                ? `${product?.product?.description?.slice(
                                                                    0,
                                                                    55
                                                                  )}...`
                                                                : product
                                                                    ?.product
                                                                    ?.description,
                                                          }}
                                                        />
                                                      </span>
                                                    </a>
                                                    <div className="d-flex align-items-center text-lg mb-2 gap-1">
                                                      {ratingStars(
                                                        product?.product?.rating
                                                          ? product?.product
                                                              ?.rating
                                                          : 0
                                                      )}

                                                      <span className=" fs-12 text-gray-800">
                                                        {" "}
                                                        (
                                                        {
                                                          product?.product
                                                            ?.total_reviews
                                                        }{" "}
                                                        Reviews){" "}
                                                      </span>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-start">
                                                      <p className="fs-16 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                                                        <sub
                                                          style={{
                                                            verticalAlign:
                                                              "super",
                                                          }}
                                                        >
                                                          ₹
                                                        </sub>
                                                        {product?.price}
                                                        {product?.product
                                                          ?.discount > 0 && (
                                                          <del className="text-gray-800 !ml-2">
                                                            {
                                                              (
                                                                parseFloat(
                                                                  product?.price *
                                                                    (100 /
                                                                      product
                                                                        ?.product
                                                                        ?.discount)
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
                                                                  product?.price *
                                                                    (100 /
                                                                      product
                                                                        ?.product
                                                                        ?.discount)
                                                                )?.toFixed(2) +
                                                                ""
                                                              )
                                                                .toString()
                                                                .split(".")[1]
                                                            }
                                                            {/* </sub> */}
                                                          </del>
                                                        )}
                                                      </p>
                                                      <p
                                                        className="p-0 !flex !flex-row	 border-0 outline-none bg-transparent !content-center w-full !text-right text-lg"
                                                        style={{
                                                          display: "flex",
                                                          justifyContent: "end",
                                                          marginRight: "5px",
                                                        }}
                                                      >
                                                        <span className="text-base text-black font-semibold flex !items-center">
                                                          Qty:
                                                        </span>
                                                        {product?.qty}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </Typography>
                                              </CardContent>
                                            </CardActionArea>
                                          </Card>
                                          {product?.product?.discount > 0 && (
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
                                                  {product?.product?.discount}%
                                                </label>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                          {activeIndex === 2 && (
                            <>
                              <div>
                                <h4 className="!font-bold">Your Wishlist</h4>
                                <Divider />
                                {userData?.client?.wishlist?.length === 0 && (
                                  <p>Your Wishlist is empty</p>
                                )}
                                <div className="nk-section-content-products">
                                  <div className="mx-2 my-4 ">
                                    {userData?.client?.wishlist?.length > 0 && (
                                      <div className="row">
                                        {userData?.client?.wishlist?.map(
                                          (product, ind) => (
                                            <div
                                              key={ind}
                                              className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]"
                                            >
                                              <Card
                                                className="mt-2 "
                                                sx={{ maxWidth: 345 }}
                                              >
                                                <div>
                                                  <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={
                                                      product?.product?.img_1
                                                    }
                                                    alt="prod_img"
                                                    className=""
                                                    onClick={() =>
                                                      navigate(
                                                        `${userLang}/product-detail/${
                                                          product?.product?.slug
                                                        }/${CryptoJS?.AES?.encrypt(
                                                          `${product?.product?.id}`,
                                                          "trading_materials"
                                                        )
                                                          ?.toString()
                                                          .replace(/\//g, "_")
                                                          .replace(/\+/g, "-")}`
                                                      )
                                                    }
                                                  />
                                                  <CardContent>
                                                    <Typography
                                                      gutterBottom
                                                      variant="h5"
                                                      component="div"
                                                    >
                                                      <div>
                                                        <a
                                                          href={`${userLang}/product-detail/${
                                                            product?.product
                                                              ?.slug
                                                          }/${CryptoJS?.AES?.encrypt(
                                                            `${product?.product?.id}`,
                                                            "trading_materials"
                                                          )
                                                            ?.toString()
                                                            .replace(/\//g, "_")
                                                            .replace(
                                                              /\+/g,
                                                              "-"
                                                            )}`}
                                                          className="d-inline-block mb-1 line-clamp-1 h5 !font-bold text-left"
                                                          style={{
                                                            textOverflow:
                                                              "ellipsis",
                                                            whiteSpace:
                                                              "nowrap",
                                                            overflow: "hidden",
                                                            width: "97%",
                                                          }}
                                                        >
                                                          {
                                                            product?.product
                                                              ?.name
                                                          }
                                                          <br />
                                                          <span className="text-xs !mt-1">
                                                            <p
                                                              onClick={() => {
                                                                navigate(
                                                                  `${userLang}/product-detail/${
                                                                    product
                                                                      ?.product
                                                                      ?.slug
                                                                  }/${CryptoJS?.AES?.encrypt(
                                                                    `${product?.product?.id}`,
                                                                    "trading_materials"
                                                                  )
                                                                    ?.toString()
                                                                    .replace(
                                                                      /\//g,
                                                                      "_"
                                                                    )
                                                                    .replace(
                                                                      /\+/g,
                                                                      "-"
                                                                    )}`
                                                                );
                                                                dispatch(
                                                                  showLoader()
                                                                );
                                                              }}
                                                              className="!mt-5 text-gray-700  truncate"
                                                              dangerouslySetInnerHTML={{
                                                                __html:
                                                                  product
                                                                    ?.product
                                                                    ?.description
                                                                    ?.length >
                                                                  55
                                                                    ? `${product?.product?.description?.slice(
                                                                        0,
                                                                        55
                                                                      )}...`
                                                                    : product
                                                                        ?.product
                                                                        ?.description,
                                                              }}
                                                            />
                                                          </span>
                                                        </a>
                                                        <div className="d-flex align-items-center text-lg mb-2 gap-1">
                                                          {ratingStars(
                                                            product?.rating
                                                              ? product?.rating
                                                              : 0
                                                          )}

                                                          <span className=" fs-12 text-gray-800">
                                                            {" "}
                                                            ({
                                                              product?.review
                                                            }{" "}
                                                            Reviews){" "}
                                                          </span>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-start">
                                                          <p className="fs-16 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                                                            <sub
                                                              style={{
                                                                verticalAlign:
                                                                  "super",
                                                              }}
                                                            >
                                                              ₹
                                                            </sub>
                                                            {product?.price}
                                                            {product?.discount >
                                                              0 && (
                                                              <del className="text-gray-800 !ml-2">
                                                                <sub
                                                                  style={{
                                                                    verticalAlign:
                                                                      "super",
                                                                  }}
                                                                >
                                                                  ₹
                                                                </sub>
                                                                {
                                                                  (
                                                                    parseFloat(
                                                                      product?.price *
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
                                                    verticalAlign: "super",
                                                  }}
                                                > */}
                                                                .
                                                                {
                                                                  (
                                                                    parseFloat(
                                                                      product?.price *
                                                                        (100 /
                                                                          product?.discount)
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
                                                            )}
                                                          </p>

                                                          <div className="flex justify-end w-full items-center">
                                                            <button
                                                              className="p-0 border-0 outline-none bg-transparent text-primary !content-right text-right"
                                                              // eslint-disable-next-line no-unused-vars
                                                              onClick={(
                                                                event
                                                              ) => {
                                                                return isLoggedIn
                                                                  ? handleAddToCart(
                                                                      product
                                                                        ?.product
                                                                        ?.id,
                                                                      product
                                                                        ?.product
                                                                        ?.img_1
                                                                    )
                                                                  : dispatch(
                                                                      usersignupinModal(
                                                                        {
                                                                          showSignupModal: false,
                                                                          showLoginModal: true,
                                                                          showforgotPasswordModal: false,
                                                                          showOtpModal: false,
                                                                          showNewPasswordModal: false,
                                                                        }
                                                                      )
                                                                    );
                                                              }}
                                                            >
                                                              {animateProductId ===
                                                              product?.product
                                                                ?.id ? (
                                                                <img
                                                                  src="/images/addedtocart.gif"
                                                                  className="max-w-[45px]"
                                                                />
                                                              ) : (
                                                                <em className="icon ni ni-cart text-2xl "></em>
                                                              )}
                                                            </button>
                                                          </div>

                                                          {/* {product?.prices?.map(
                                            (price, ind) => (
                                              <p className="fs-16 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                                                {currentUserlang === "en"
                                                  ? price?.INR &&
                                                    `₹${Number.parseFloat(
                                                      price?.INR
                                                    ).toFixed(2)}`
                                                  : price?.USD &&
                                                    `$${Number.parseFloat(
                                                      price?.USD
                                                    ).toFixed(2)}`}
                                                {currentUserlang === "en"
                                                  ? price?.INR && (
                                                      <del className="text-gray-800 !ml-2">
                                                        {currentUserlang ===
                                                        "en"
                                                          ? "₹"
                                                          : "$"}
                                                        {getRandomNumberWithOffset(
                                                          price?.INR
                                                        )}
                                                      </del>
                                                    )
                                                  : price?.USD && (
                                                      <del className="text-gray-800 !ml-2">
                                                        {currentUserlang ===
                                                        "en"
                                                          ? "₹"
                                                          : "$"}
                                                        {getRandomNumberWithOffset(
                                                          Number.parseFloat(
                                                            price?.USD
                                                          ).toFixed(2)
                                                        )}
                                                      </del>
                                                    )}
                                              </p>
                                            )
                                          )} */}

                                                          {/* <button
                                            className="p-0 !flex !flex-row	 border-0 outline-none bg-transparent text-primary !content-center w-full !text-right"
                                            style={{
                                              display: "flex",
                                              justifyContent: "end",
                                              marginRight: "5px",
                                            }}
                                            onClick={() => {
                                              isLoggedIn
                                                ? handleAddToWishList(
                                                    product?.id
                                                  )
                                                : dispatch(showPopup());
                                            }}
                                          >
                                            <FaRegHeart size={18} />
                                          </button> */}

                                                          {/* <button
                                            className="p-0 border-0 outline-none bg-transparent text-primary !content-right text-right"
                                            onClick={(event) => {
                                              return isLoggedIn
                                                ? (handleAddToCart(product?.id),
                                                  handleCartPosition(event))
                                                : dispatch(showPopup());
                                            }}
                                          >
                                            {animateProductId ===
                                            product?.id ? (
                                              <img src="/images/addedtocart.gif" />
                                            ) : (
                                              <em className="icon ni ni-cart text-2xl"></em>
                                            )}
                                          </button> */}
                                                          {/* <p
                                      className="p-0 !flex !flex-row	 border-0 outline-none bg-transparent !content-center w-full !text-right text-lg"
                                      style={{
                                        display: "flex",
                                        justifyContent: "end",
                                        marginRight: "5px",
                                      }}
                                    >
                                      <span className="text-base text-black font-semibold flex !items-center">
                                        Qty:
                                      </span>
                                      {product?.qty}
                                    </p> */}
                                                        </div>
                                                      </div>
                                                    </Typography>
                                                  </CardContent>
                                                </div>
                                              </Card>
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
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {activeIndex === 3 && (
                            <>
                              <div className="!w-full">
                                <h4 className="!font-bold">Your Orders</h4>
                                <Divider />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="nk-section nk-cta-section nk-section-content-1">
            <div className="container">
              <div className="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7">
                <div className="row g-gs align-items-center">
                  <div className="col-lg-8">
                    <div className="media-group flex-column flex-lg-row align-items-center">
                      <div className="media media-lg media-circle media-middle text-bg-white text-primary mb-2 mb-lg-0 me-lg-2">
                        <em className="icon ni ni-chat-fill"></em>
                      </div>
                      <div className="text-center text-lg-start">
                        <h3 className="text-capitalize m-0 !text-3xl !font-bold !leading-loose">
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
                    <a
                      href={`/contactus`}
                      className="btn btn-white fw-semiBold"
                    >
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
