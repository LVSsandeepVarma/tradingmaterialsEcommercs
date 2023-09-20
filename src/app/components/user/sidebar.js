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
import { updateCartCount } from "../../../features/cartWish/focusedCount";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
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


  useEffect(() => {
    if (window?.location?.search === "?wishlist") {
      setActiveIndex(2);
    } else if (window.location.search === "?orders"){
      setActiveIndex(3)
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

      const response = await axios.get("https://admin.tradingmaterials.com/api/client/get-user-info", {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("client_token"),
          Accept: "application/json",
        },
      });
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
      const url =
        "https://admin.tradingmaterials.com/api/client/auth/logout"
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
        navigate(`${userLang}/`)
        window.location.reload();
        
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      dispatch(hideLoader());
    }
  }

  const handleActiveTab = (index) => {
    if (index !== 3 && index !== 4) {
      setActiveIndex(index);
    } else {
      if(index === 3){
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
        }
        else if(index === 4){
          handleLogout()
        }
    }
  };

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
                  className="font-bold !text-left w-full ml-3 p-3 flex justify-center w-full"
                  style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: "90%",
                  }}
                >
                  <Avatar
                    alt="user profile"
                    src="/images/blueProfile.png"
                    sx={{ width: "40%", height: "40%" }}
                    className=""
                  ></Avatar>
                </p>
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
                          justifyContent: "center"
                        }}
                        >
                        </LogoutIcon>
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
                              <p>{address?.add_2 !== null ? `${address?.add_2},` : ""}</p>
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
                            <p>{address?.add_2 !== null ? `${address?.add_2},` : ""}</p>
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
                                                : product?.product?.description,
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
                                            <sub
                                              style={{
                                                verticalAlign: "super",
                                              }}
                                            >
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
                                            </sub>
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
                                              product?.total_reviews
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
                                                {
                                                  (
                                                    parseFloat(
                                                      product?.price *
                                                        (100 /
                                                          product?.discount)
                                                    )?.toFixed(2) + ""
                                                  )
                                                    .toString()
                                                    .split(".")[0]
                                                }
                                                <sub
                                                  style={{
                                                    verticalAlign: "super",
                                                  }}
                                                >
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
                                                </sub>
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
                                      {product?.discount}%
                                    </label>
                                  </div>
                                </div>
                              )}
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
