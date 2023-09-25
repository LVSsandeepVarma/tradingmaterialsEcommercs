import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MailIcon from "@mui/icons-material/Mail";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { updateUsers } from "../../../features/users/userSlice";
import { updateCart } from "../../../features/cartItems/cartSlice";
import {
  updateCartCount,
  updateWishListCount,
} from "../../../features/cartWish/focusedCount";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GitHubForkRibbon from "react-github-fork-ribbon";

import { Avatar, CardActionArea } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BusinessIcon from "@mui/icons-material/Business";
import axios from "axios";
import { Button } from "@mui/material";
import ShippingAddressModal from "../modals/address";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";
import { FaMinusCircle } from "react-icons/fa";
import CryptoJS from "crypto-js";
import Invoices from "./invoices";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { BiSolidPhoneCall } from "react-icons/bi";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutUser } from "../../../features/login/loginSlice";
import AddToFav from "../modals/addToFav";
// import { logoutUser } from "../../../features/login/loginSlice";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  //   overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLang = useSelector((state) => state?.lang?.value);
  const clientType = useSelector((state) => state?.clientType?.value);
  const addressStatus = useSelector((state) => state?.addressStatus?.value);
  const [addedToFavImg, setAddedToFavImg] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showWishlistRemoveMsg, setShowWishlistRemoveMsg] = useState(false);
  const isLoggedIn = useSelector((state) => state?.login?.value);
  const [dialogShow, setDialogShow] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [showFileInput, setShowFileInput] = useState(false);
  const [profileUploadErr, setProfileUploadErr] = useState("");
  // const [profileuploadSucc, setProfileUploadSucc] = useState("");

  // const closeModal = () => {
  //   setShowModal(false);
  //   setModalMessage("");
  //   setAddedToFavImg("");
  // };

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
        window.location.reload()
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
        dispatch(
          updateNotifications({
            type: "warning",
            message: response?.data?.message,
          })
        );
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
      const url = "https://admin.tradingmaterials.com/api/client/auth/logout";
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
      const response = await axios.post(url, {}, headerData);

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
    if (index !== 3 && index !== 4 && index !== 1) {
      setActiveIndex(index);
    } else {
      if (index === 3) {
        // `/orders/${CryptoJS?.AES?.encrypt(
        //   `${userData?.client?.id}`,
        //   "order_details"
        // )
        //   ?.toString()
        //   .replace(/\//g, "_")
        //   .replace(/\+/g, "-")}`
        window.open(
        " /view-order/placed",
          "_blank"
        );
      } else if (index === 4) {
        handleLogout();
      } else if (index === 1) {
        navigate("/cart");
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

  return (
    <>
      <ShippingAddressModal
        show={showModal}
        onHide={() => setShowModal(false)}
        addressType={addressUpdateType}
        data={addressData}
        type={formType}
        // handleFormSubmit={handleFormSubmit}
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
      <div className="container">
        <Header />
        <Box sx={{ display: "flex" }}>
          {/* <CssBaseline /> */}
          {/* <AppBar open={open} style={{background: "linear-gradient(23.01deg, #2b5cfd 14.9%, #1d3faf 85.1%)"}}>
        
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon  />
          </IconButton>
          
        </Toolbar>
      </AppBar> */}
          <Drawer
            variant="permanent"
            className="drop-shadow-xl !w-[100%] sm:!w-[100%]  md:!w-[35%] lg:!w-[24%]"
            open={open}
          >
            <Divider />
            <DrawerHeader
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
                    {userData?.client?.profile?.profile_image?.length > 0 ? (
                      <Avatar
                        alt="user profile"
                        src={userData?.client?.profile?.profile_image}
                        sx={{ width: "140px", height: "140px" }}
                        className=""
                      ></Avatar>
                    ) : (
                      <Avatar
                        alt="user profile"
                        src="/images/blueProfile.png"
                        sx={{ width: "50%", height: "100%" }}
                        className=""
                      ></Avatar>
                    )}
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
                {/* {profileuploadSucc && <p>{profileuploadSucc}</p>} */}
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
                <p
                  className=" flex items-center font-bold text-sm !text-left w-full ml-3  p-1 pb-0"
                  style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: "90%",
                  }}
                >
                  <MdOutlineAlternateEmail className="mr-1" size={16} />
                  {userData?.client?.email}
                </p>
                <p
                  className="flex  items-center font-bold text-sm !text-left w-full ml-3 p-1 pt-0 "
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
              {/* <IconButton onClick={handleDrawerClose}>

            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton> */}
            </DrawerHeader>
            <Divider />
            <List>
              {["Address", "Cart", "Wishlist", "Orders", "Logout"].map(
                (text, index) => (
                  <ListItem key={text} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        backgroundColor: activeIndex === index ? "skyblue" : "",
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
          </Drawer>
          <Divider />
          <Box
            className="drop-shadow-lg"
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              borderTop: "1px solid #eeeeee",
              borderRight: "1px solid #eeeeee",
              borderLeft: "1px solid #eeeeee",
            }}
          >
            <p
              className="p-0 m-0 text-left text-sm font-bold"
              style={{ color: "darkgray" }}
            >
              {" "}
              {activeIndex > 0
                ? "Product details"
                : "Profile Details"} &gt;{" "}
              <b style={{ color: "black" }}>{tabs[activeIndex]}</b>
            </p>
            <DrawerHeader />
            {/* {activeIndex === 0 && <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>} */}
            {activeIndex === 0 && (
              <>
                <div>
                  <h4 className="!font-bold !text-gray-900">Billing address</h4>
                  <div>
                    <small className="w-full !text-left">
                      Showing All Billing address available
                    </small>
                    <div className="flex overflow-x-auto">
                      {userData?.client?.primary_address?.map(
                        (address, ind) => (
                          <div
                            key={ind * 3}
                            className="w-fit border border-1 p-3  text-left !min-w-[45%]  sm:!min-w-[25%] sm:max-w-[40%]  mt-5 ml-5 gap-5"
                          >
                            <CardActionArea
                              onClick={() => {
                                setAddressUpdateType("billing");
                                setShowModal(true);
                                setFormType("update");
                                setAddressData(
                                  userData?.client?.primary_address[ind]
                                );
                              }}
                            >
                              <h3 className="!font-bold">
                                Address - {ind + 1}
                              </h3>
                              <p>{address?.add_1},</p>
                              <p>
                                {address?.add_2 !== null
                                  ? `${address?.add_2},`
                                  : ""}
                              </p>
                              <p>{address?.city},</p>
                              <p>{address?.zip},</p>
                              <p>{address?.state},</p>
                              <p>{address?.country}.</p>
                            </CardActionArea>
                          </div>
                        )
                      )}
                      {userData?.client?.primary_address?.length === 0 && (
                        <Button
                          className="!ml-2 !mr-2"
                          onClick={() => {
                            setAddressUpdateType("billing");
                            setShowModal(true);
                            setAddressData([]);
                            setFormType("add");
                          }}
                        >
                          + Add new Address
                        </Button>
                      )}
                    </div>

                    <Divider />
                  </div>
                  <h4 className="mt-5 !font-bold">Shippping address</h4>
                  <div>
                    <small className="w-full !text-left">
                      Showing All Shipping address available
                    </small>
                    <div className="flex overflow-x-auto ">
                      {userData?.client?.address?.map((address, ind) => (
                        <div
                          key={ind}
                          className=" w-fit border border-1 p-3  text-left !min-w-[45%]  sm:!min-w-[25%] sm:max-w-[40%]  mt-5 ml-5 gap-5"
                        >
                          <CardActionArea
                            onClick={() => {
                              setAddressUpdateType("shipping");
                              setShowModal(true);
                              setFormType("update");
                              setAddressData(userData?.client?.address[ind]);
                            }}
                          >
                            <h3 className="!font-bold">Address - {ind + 1}</h3>
                            <p>{address?.add_1},</p>
                            <p>
                              {address?.add_2 !== null
                                ? `${address?.add_2},`
                                : ""}
                            </p>
                            <p>{address?.city},</p>
                            <p>{address?.zip},</p>
                            <p>{address?.state},</p>
                            <p>{address?.country}.</p>
                          </CardActionArea>
                        </div>
                      ))}
                      <Button
                        className="!ml-2"
                        onClick={() => {
                          setAddressUpdateType("shipping");
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
                <div>
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
                          src="/images/favicon.png"
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
                                image={
                                  product?.product?.product?.product?.img_1
                                }
                                alt="green iguana"
                                className="sm:!h-[300px]"
                                onClick={() =>
                                  navigate(
                                    `${userLang}/product-detail/${
                                      product?.product?.product?.product?.slug
                                    }/${CryptoJS?.AES?.encrypt(
                                      `${product?.product?.product?.product?.id}`,
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
                                    {product?.product?.product?.product?.name}
                                  </p>
                                </div>
                                <small className="font-bold block !w-full !text-left">
                                  Qty : {product?.product?.qty}{" "}
                                </small> */}
                                  <div className="nk-card-info bg-white p-4">
                                    {/* <a
                              href="/"
                              className="d-inline-block mb-1 line-clamp-1 h5"
                            >
                               {product?.product?.name}
                            </a> */}
                                    <a
                                      href={`${userLang}/product-detail/${
                                        product?.product?.product?.product?.slug
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
                                        width: "90%",
                                      }}
                                    >
                                      {product?.product?.product?.product?.name}
                                      <br />
                                      <span className="text-xs !mt-1">
                                        <p
                                          onClick={() => {
                                            navigate(
                                              `${userLang}/product-detail/${
                                                product?.product?.product
                                                  ?.product?.slug
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
                                              product?.product?.product?.product
                                                ?.description?.length > 55
                                                ? `${product?.product?.product?.product?.description?.slice(
                                                    0,
                                                    55
                                                  )}...`
                                                : product?.product?.product
                                                    ?.product?.description,
                                          }}
                                        />
                                      </span>
                                    </a>
                                    <div className="d-flex align-items-center text-lg mb-2 gap-1">
                                      {ratingStars(
                                        product?.rating ? product?.rating : 0
                                      )}

                                      <span className=" fs-12 text-gray-800">
                                        {" "}
                                        ({
                                          product?.product?.review
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
                                        {product?.product?.price}
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
                                        {product?.product?.qty}
                                      </p>
                                    </div>
                                  </div>
                                </Typography>
                                {/* <Typography variant="body2" color="text.secondary">
                       <p dangerouslySetInnerHTML={{__html: product?.product?.product?.product?.description}}/>
                    </Typography> */}
                              </CardContent>
                            </CardActionArea>
                          </Card>
                          {product?.discount > 0 && (
                            <div className="flex justify-end items-end ">
                              <div
                                className="flex absolute items-center justify-center img-box !drop-shadow-lg

"
                              >
                                <img
                                  src="/images/sale-2.png"
                                  alt="ffer_label"
                                  width={65}
                                  className="drop-shadow-lg"
                                ></img>
                                <label className="absolute !font-bold text-white !text-xs right-1">
                                  {product?.product?.product?.product?.discount}
                                  %
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
                    <div className=" ">
                      {userData?.client?.wishlist?.length > 0 && (
                        <div className="row">
                          {userData?.client?.wishlist?.map((product, ind) => (
                            <div
                              key={ind}
                              className="col-md-6 col-lg-5 col-xl-4 !gap-x-[5px] group hover:drop-shadow-xl"
                              id={`img-${product?.product?.id}`}
                            >
                              <div className="nk-card overflow-hidden rounded-3 h-100 border text-left ">
                                <div className="nk-card-img relative">
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
                                  >
                                    <img
                                      src={product?.product?.img_1}
                                      alt="product-image"
                                      className="sm:!h-[300px] !w-full group-hover:scale-105 transition duration-500"
                                      loading="lazy"
                                    />
                                    {product?.product?.stock?.stock < 10 && (
                                      <GitHubForkRibbon
                                        className="drop-shadow-xl subpixel-antialiased"
                                        color="orange"
                                        position="left"
                                      >
                                        Only {product?.product?.stock?.stock}{" "}
                                        left !!
                                      </GitHubForkRibbon>
                                    )}
                                  </a>
                                </div>
                                <div className="nk-card-info bg-white p-4">
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
                                    className="d-inline-block mb-1 line-clamp-1 h5 !font-bold"
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
                                            product?.product?.description
                                              ?.length > 55
                                              ? `${product?.product?.description?.slice(
                                                  0,
                                                  55
                                                )}...`
                                              : product?.product?.description,
                                        }}
                                      />
                                    </span>
                                  </a>
                                  <div className="d-flex align-items-center mb-2 gap-1">
                                    {ratingStars(product?.product?.rating)}

                                    <span className="fs-14 text-gray-800">
                                      {" "}
                                      ({product?.product?.total_reviews}{" "}
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
                                    </p>

                                    <div className="flex justify-start items-center">
                                      <button
                                        className="p-0 border-0 outline-none bg-transparent text-primary !content-right text-right"
                                        // eslint-disable-next-line no-unused-vars
                                        onClick={(event) => {
                                          return isLoggedIn
                                            ? handleAddToCart(
                                                product?.product?.id,
                                                product?.product?.img_1
                                              )
                                            : navigate(`/login`);
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
                                  </div>
                                </div>
                                {product?.product?.discount > 0 && (
                                  <div className="flex justify-end items-end   !mt-2">
                                    <div
                                      className="flex absolute items-center justify-center img-box !drop-shadow-lg

"
                                    >
                                      <img
                                        src="/images/sale-2.png"
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
                            </div>
                          ))}
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
                  <Invoices />
                </div>
              </>
            )}
          </Box>
        </Box>
      </div>
    </>
  );
}
