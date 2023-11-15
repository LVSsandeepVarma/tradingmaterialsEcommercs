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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLang = useSelector((state) => state?.lang?.value);
  const addressStatus = useSelector((state) => state?.addressStatus?.value);
  const isLoggedIn = useSelector((state) => state?.login?.value);

  const imageUpdate = async () => {
    dispatch(showLoader());
    const token = localStorage.getItem("client_token");
    console.log();

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

      console.log(response);
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
        console.log(response?.data);
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        dispatch(updateCartCount(response?.data?.data?.client?.cart_count));
      } else {
        console.log(response?.data);
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
    } finally {
      dispatch(hideLoader());
    }
  }

  const handleActiveTab = (index) => {
    if (index !== 3 && index !== 4 && index !== 1 && index != 0) {
      setActiveIndex(index);
    } else {
      if (index === 3) {
        window.open(
          `/orders/${CryptoJS?.AES?.encrypt(
            `${userData?.client?.id}`,
            "order_details"
          )
            ?.toString()
            .replace(/\//g, "_")
            .replace(/\+/g, "-")}`,
          "_blank"
        );
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
      console.log(reader.result);
      setShowFileInput(false);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (profileImage) {
      console.log(profileImage);
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
          <section className="nk-section container">
            <div className="flex flex-wrap md:flex-wrap-nowrap">
              <div
                // variant="permanent"
                className="shadow-xl text-black !w-[100%] sm:!w-[100%]   lg:!w-[24%]"
              >
                <Divider />
                <div
                  className="drop-shadow-xl !w-full"
                  style={{ width: "100% !important" }}
                >
                  <div
                    style={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    <p
                      className="font-bold !text-left w-full ml-3 p-3 flex justify-center w-full cursor-pointer"
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        width: "90%",
                      }}
                    >
                      <label
                        htmlFor="upload-button"
                        className="  w-full flex justify-center !w-full !h-auto cursor-pointer"
                      >
                        <Tooltip title="upload profile" placement="bottom-end">
                          {userData?.client?.profile?.profile_image?.length >
                          0 ? (
                            <Avatar
                              alt="user profile"
                              src={userData?.client?.profile?.profile_image}
                              sx={{ width: "140px", height: "140px" }}
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
                        </Tooltip>
                      </label>
                    </p>
                    <input
                      type="file"
                      id="upload-button"
                      onChange={handleImageUpload}
                      className="opacity-0 visibility-0"
                    />
                    {profileUploadErr && (
                      <p className="text-red-600">{profileUploadErr}</p>
                    )}
                    <p
                      className="font-bold text-lg !text-left w-full ml-3 p-1"
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        width: "90%",
                      }}
                    >
                      {userData?.client?.first_name?.charAt(0)?.toUpperCase() +
                        userData?.client?.first_name?.slice(1)}{" "}
                      {userData?.client?.last_name}
                    </p>
                    <div className="flex items-center p-1">
                      <EmailIcon className="mr-1" fontSize="small" />
                      <p
                        className=" flex items-center font-bold text-sm !text-left w-full !mt-0  ml-0 pt-0 pl-0 pb-0"
                        style={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          width: "90%",
                        }}
                      >
                        {userData?.client?.email}
                      </p>
                    </div>
                    <p
                      className="flex  items-center font-bold text-sm !text-left w ml-0 p-1 pt-0 "
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        width: "90%",
                      }}
                    >
                      <BiSolidPhoneCall className="mr-1" size={16} />
                      {userData?.client?.phone}
                    </p>
                  </div>
                </div>
                <Divider />
                <List>
                  {["Address", "Cart", "Wishlist", "Orders", "Logout"].map(
                    (text, index) => (
                      <ListItem
                        key={text}
                        disablePadding
                        sx={{ display: "block" }}
                      >
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                            backgroundColor:
                              activeIndex === index ? "skyblue" : "",
                          }}
                          color={`${activeIndex === index ? "blue" : ""} `}
                          onClick={() => handleActiveTab(index)}
                        >
                          {text === "Logout" && (
                            <LogoutIcon
                              size={20}
                              className="mr-7"
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                              }}
                            ></LogoutIcon>
                          )}
                          {text === "Orders" && (
                            <BsFillBoxSeamFill
                              size={20}
                              className="mr-7"
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <MailIcon />
                            </BsFillBoxSeamFill>
                          )}
                          {text === "Cart" && (
                            <ShoppingCartRoundedIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <MailIcon />
                            </ShoppingCartRoundedIcon>
                          )}
                          {text === "Address" && (
                            <BusinessIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <MailIcon />
                            </BusinessIcon>
                          )}
                          {text === "Wishlist" && (
                            <FavoriteBorderIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <MailIcon />
                            </FavoriteBorderIcon>
                          )}
                          <ListItemText
                            primary={text}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                        <Divider />
                      </ListItem>
                    )
                  )}
                </List>
                {/* <Divider /> */}
              </div>
              <Divider />
              <div
                className="drop-shadow-lg max-w-full lg:max-w-[75%] ml-2"
                // component="main"
                style={{
                  flexGrow: 1,
                  p: 3,
                  borderTop: "1px solid #eeeeee",
                  borderRight: "1px solid #eeeeee",
                  borderLeft: "1px solid #eeeeee",
                }}
              >
                <p
                  className="pt-2 ml-2 !mt-2 md:!ml-2 md:!p-0 md:!m-2 text-left text-sm font-bold"
                  style={{ color: "darkgray" }}
                >
                  {" "}
                  {activeIndex > 0
                    ? "Product details"
                    : "Profile Details"} &gt;{" "}
                  <b style={{ color: "black" }}>{tabs[activeIndex]}</b>
                </p>
                <DrawerHeader />

                {activeIndex === 0 && (
                  <>
                    <div>
                      <h4 className="mt-5 !font-bold">Address</h4>
                      <div className="!mb-3">
                        <small className="w-full !text-left">
                          {userData?.client?.primary_address?.length > 0
                            ? "Showing all addresses"
                            : "No Address Found"}
                        </small>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4  mb-2">
                          {userData?.client?.address?.map((address, ind) => (
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
                                    : `Address - ${ind + 1}`}
                                </h3>
                                <p className="truncate">{address?.add_1},</p>
                                {address?.add_2 !== null
                                  ? `${address?.add_2},`
                                  : ""}
                                <p className="truncate">{address?.city},</p>
                                <p className="truncate">{address?.state},</p>
                                <p className="truncate">{address?.country},</p>
                                <p className="truncate">{address?.zip}.</p>
                              </CardActionArea>
                            </div>
                          ))}
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
                        <Divider />
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
                          {userData?.client?.cart?.map((product, ind) => (
                            <div
                              key={ind * 2}
                              className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]"
                            >
                              <Card className="mt-5 " sx={{ maxWidth: 345 }}>
                                <CardActionArea>
                                  <CardMedia
                                    component="img"
                                    height="140"
                                    image={product?.product?.img_1}
                                    alt="green iguana"
                                    className="sm:!h-[300px]"
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
                                      {/* <div className="flex items-center">
                                  <p
                                    className="max-w-[100%] md:max-w-[75%]"
                                    style={{
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      width: "90%",
                                    }}
                                  >
                                    {product?.product?.name}
                                  </p>
                                </div>
                                <small className="font-bold block !w-full !text-left">
                                  Qty : {product?.qty}{" "}
                                </small> */}
                                      <div className="nk-card-info bg-white p-4">
                                        {/* <a
                              href="/"
                              className="d-inline-block mb-1 line-clamp-1 h5"
                            >
                               {product?.name}
                            </a> */}
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
                                            textOverflow: "ellipsis",
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
                                                    product?.product?.slug
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
                                                  product?.product?.description
                                                    ?.length > 55
                                                    ? `${product?.product?.description?.slice(
                                                        0,
                                                        55
                                                      )}...`
                                                    : product?.product
                                                        ?.description,
                                              }}
                                            />
                                          </span>
                                        </a>
                                        <div className="d-flex align-items-center text-lg mb-2 gap-1">
                                          {ratingStars(
                                            product?.product?.rating
                                              ? product?.product?.rating
                                              : 0
                                          )}

                                          <span className=" fs-12 text-gray-800">
                                            {" "}
                                            ({
                                              product?.product?.total_reviews
                                            }{" "}
                                            Reviews){" "}
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-start">
                                          <p className="fs-16 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                                            <sub
                                              style={{
                                                verticalAlign: "super",
                                              }}
                                            >
                                              ₹
                                            </sub>
                                            {product?.price}
                                            {product?.product?.discount > 0 && (
                                              <del className="text-gray-800 !ml-2">
                                                {
                                                  (
                                                    parseFloat(
                                                      product?.price *
                                                        (100 /
                                                          product?.product
                                                            ?.discount)
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
                                                      product?.price *
                                                        (100 /
                                                          product?.product
                                                            ?.discount)
                                                    )?.toFixed(2) + ""
                                                  )
                                                    .toString()
                                                    .split(".")[1]
                                                }
                                                {/* </sub> */}
                                              </del>
                                            )}
                                          </p>

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
                                    {/* <Typography variant="body2" color="text.secondary">
                       <p dangerouslySetInnerHTML={{__html: product?.product?.description}}/>
                    </Typography> */}
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
                          ))}
                        </div>
                        // </div>
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
                        <div className="mx-2 ">
                          {userData?.client?.wishlist?.length > 0 && (
                            <div className="row">
                              {userData?.client?.wishlist?.map(
                                (product, ind) => (
                                  <div
                                    key={ind}
                                    className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px]"
                                  >
                                    <Card
                                      className="mt-5 "
                                      sx={{ maxWidth: 345 }}
                                    >
                                      <div>
                                        <CardMedia
                                          component="img"
                                          height="140"
                                          image={product?.product?.img_1}
                                          alt="green iguana"
                                          className="sm:!h-[300px]"
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
                                                  product?.product?.slug
                                                }/${CryptoJS?.AES?.encrypt(
                                                  `${product?.product?.id}`,
                                                  "trading_materials"
                                                )
                                                  ?.toString()
                                                  .replace(/\//g, "_")
                                                  .replace(/\+/g, "-")}`}
                                                className="d-inline-block mb-1 line-clamp-1 h5 !font-bold text-left"
                                                style={{
                                                  textOverflow: "ellipsis",
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  width: "97%",
                                                }}
                                              >
                                                {product?.product?.name}
                                                <br />
                                                <span className="text-xs !mt-1">
                                                  <p
                                                    onClick={() => {
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
                                                      );
                                                      dispatch(showLoader());
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
                                                          : product?.product
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
                                                  } Reviews){" "}
                                                </span>
                                              </div>
                                              <div className="d-flex align-items-center justify-content-start">
                                                <p className="fs-16 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                                                  <sub
                                                    style={{
                                                      verticalAlign: "super",
                                                    }}
                                                  >
                                                    ₹
                                                  </sub>
                                                  {product?.price}
                                                  {product?.discount > 0 && (
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
                                                            product?.price *
                                                              (100 /
                                                                product?.discount)
                                                          )?.toFixed(2) + ""
                                                        )
                                                          .toString()
                                                          .split(".")[1]
                                                      }
                                                      {/* </sub> */}
                                                    </del>
                                                  )}
                                                </p>

                                                <div className="flex justify-end w-full items-center">
                                                  <button
                                                    className="p-0 border-0 outline-none bg-transparent text-primary !content-right text-right"
                                                    // eslint-disable-next-line no-unused-vars
                                                    onClick={(event) => {
                                                      return isLoggedIn
                                                        ? handleAddToCart(
                                                            product?.product
                                                              ?.id,
                                                            product?.product
                                                              ?.img_1
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
                                                    {animateProductId ===
                                                    product?.product?.id ? (
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
                      {/* {userData?.client?.orders?.length === 0 && (
                    <p>Your Orders are empty</p>
                  )} */}
                      {/* <Invoices /> */}
                    </div>
                  </>
                )}
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
                      href={`https://tradingmaterials.com/contact`}
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
