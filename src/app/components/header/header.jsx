import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { fetchAllProducts } from "../../../features/products/productsSlice";
import { loginUser, logoutUser } from "../../../features/login/loginSlice";
import { updateUsers } from "../../../features/users/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import { updateCart } from "../../../features/cartItems/cartSlice";
import moment from "moment";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "animate.css";
import {
  updateCartCount,
  updateWishListCount,
} from "../../../features/cartWish/focusedCount";
// import { hidePopup, showPopup } from "../../../features/popups/popusSlice";
import { useTranslation } from "react-i18next";
import { userLanguage } from "../../../features/userLang/userLang";
import SignupModal from "../modals/signup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { productsSubId } from "../../../features/subCategoriesIds/subCategoriesSlice";
// import CloseIcon from "@mui/icons-material/Close";
import LoginModal from "../modals/login";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import ForgotPasswordModal from "../modals/forgotPassword";
import Offer from "../forms/offer";
import { hidePopup, showPopup } from "../../../features/popups/popusSlice";
import { Divider } from "@mui/material";
import ChatForm from "../Chatbot/chatbot";
import UpdateProfile from "../modals/updateProfile";
import CookieBanner from "./cookiesBanner";

export default function Header() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state?.products?.value);
  const positions = useSelector((state) => state?.position?.value);
  const isLoggedIn = useSelector((state) => state.login?.value);
  const userData = useSelector((state) => state?.user?.value);
  // const loaderState = useSelector((state) => state?.loader?.value);
  const notifications = useSelector((state) => state?.notification?.value);
  const cartCounts = useSelector((state) => state?.saved?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  const popup = useSelector((state) => state?.popup?.value);
  const modals = useSelector((state) => state?.signupInModal?.value);
  const clientType = localStorage.getItem("client_type");
  const [mouseOverEvent, setMouseOverEvent] = useState(false)
  const [activeDropDown, setActiveDropDown] = useState("");
  // const [showFloatingForm, setShowFloatingForm] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [showModal, setShowModal] = useState(false);
  const [productClicked, setProductclicked] = useState(false);
  const [bundleClicked, setBundleClicked] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [bottomOfferDisplay, setBottomOfferDisplay] = useState("block");
  const [showOffer, setShowOffer] = useState(false);
  const [cookieResponse, setCookieResponse] = useState(false);

  const { t } = useTranslation();
  const location = useLocation();

  const [toggleNavbar, setToggleNavbar] = useState(false);
  const [greetUser, setGreetUser] = useState("Good Morning");

  useEffect(() => {
    if (
      userData?.client?.id !== undefined &&
      userData?.client?.first_name == null
    ) {
      setShowNameModal(true);
    } else {
      setShowNameModal(false);
    }
  }, [userData]);

  useEffect(() => {
    dispatch(showLoader())
    try{
    const offerPhone = sessionStorage.getItem("offerPhone");
    const phone = userData?.client?.phone;
    const email = localStorage.getItem("offerEmail")
    console.log(phone, userData, "off--");
    // const expiry = sessionStorage.getItem("expiry");
    if (isLoggedIn == false) {
      console.log(offerPhone, "off--");
      if (offerPhone != undefined || offerPhone != null) {
        console.log("inside, off--");
        setShowOffer(false);
        console.log("emmmmm")
        setBottomOfferDisplay("none");
      } else {
        setShowOffer(true);
        console.log("emmmmm")
      }
    } else if (isLoggedIn == true && userData?.client?.email != undefined) {
      if (email == userData?.client?.email) {
        setShowOffer(false)
        console.log(email,userData?.client?.email,email == userData?.client?.email,"emmmmm")
        // if (moment(expiry) > Date.now()) {
        //   setShowOffer(false);
        //   setBottomOfferDisplay("none");
        // } else {
        //   setShowOffer(true);
        // }
      }
    }
  }catch(err){
    console.log(err)
  }finally{
    dispatch(hideLoader())
  }
    
  }, [isLoggedIn, userData]);

  // useEffect(() => {
  //   const offerPhone = sessionStorage.getItem("offerPhone");
  //   const phone = userData?.client?.phone;
  //   console.log(phone, userData, "off--");
  //   if (isLoggedIn == false) {
  //     console.log(offerPhone, "off--");
  //     if (offerPhone != undefined || offerPhone != null) {
  //       console.log("inside, off--");
  //       setShowOffer(false);
  //     } else {
  //       setShowOffer(true);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    function updateGreeting() {
      var currentTime = new Date();
      var currentHour = currentTime.getHours();
      var greeting;

      if (currentHour < 12) {
        greeting = "Good Morning";
      } else if (currentHour < 18) {
        greeting = "Good Afternoon";
      } else if (currentHour < 22) {
        greeting = "Good Evening";
      } else {
        greeting = "Good Night";
      }
      return greeting;
    }
    const greet = updateGreeting();
    setGreetUser(greet);
  }, []);

  const navigate = useNavigate();

  console.log(userData);
  console.log(isLoggedIn);
  console.log(positions);

  useEffect(() => {
    if (localStorage.getItem("client_token")) {
      dispatch(loginUser());
    }
    const lang = localStorage?.getItem("i18nextLng");
    console.log("lang", lang, userLang);
    if (lang === "/ms" || location.pathname.includes("/ms")) {
      dispatch(userLanguage("/ms"));
    } else {
      dispatch(userLanguage(""));
    }
  }, []);

  useEffect(() => {
    if (popup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  useEffect(() => {
    if (popup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [popup]);

  const hideProfileModal = () => {
    setShowNameModal(false);
  };

  const getUserInfo = async () => {
    console.log(location.pathname.includes("/product-detail"));
    if (isLoggedIn) {
      try {
        const url =
          clientType === "client"
            ? "https://admin.tradingmaterials.com/api/get-user-info"
            : "https://admin.tradingmaterials.com/api/lead/get-user-info";
        const headerData =
          clientType === "client"
            ? {
                headers: {
                  Authorization:
                    `Bearer ` + localStorage.getItem("client_token"),
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
          dispatch(updateCartCount(response?.data?.data?.client?.cart_count));
          dispatch(
            updateWishListCount(response?.data?.data?.client?.wishlist_count)
          );
        } else {
          console.log(response?.data);
          if (
            location.pathname === "/" ||
            location.pathname.includes("/product-detail")
          ) {
            localStorage.removeItem("client_token");
            sessionStorage.removeItem("offerPhone");
            sessionStorage.removeItem("expiry");
            dispatch(logoutUser());
          } else {
            dispatch(
              updateNotifications({
                type: "warning",
                message: "Oops!",
              })
            );
          }
          // navigate("/login")
        }
      } catch (err) {
        console.log(err);
        if (
          location.pathname === "/" ||
          location.pathname.includes("/product-detail") ||
          location.pathname.includes("/terms") ||
          location.pathname.includes("/privacy") ||
          location.pathname.includes("/refund") ||
          location.pathname.includes("/contact") ||
          location.pathname.includes("/about")
        ) {
          localStorage.removeItem("client_token");
          sessionStorage.removeItem("offerPhone");
          sessionStorage.removeItem("expiry");
          dispatch(logoutUser());
        } else {
          dispatch(
            updateNotifications({
              type: "warning",
              message: "Oops!",
            })
          );
        }
      } finally {
        dispatch(hideLoader());
      }
    } else {
      dispatch(
        usersignupinModal({
          showSignupModal: false,
          showLoginModal: true,
          showforgotPasswordModal: false,
          showOtpModal: false,
          showNewPasswordModal: false,
        })
      );
    }
  };

  const showSignupPopup = async () => {
    if (window.location.pathname === "/") {
      dispatch(showPopup());
    }
  };
  const memoizedFetchProducts = useMemo(() => {
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
        dispatch(fetchAllProducts(response?.data?.data));
        return response?.data?.data;
      } catch (err) {
        console.log(err);
      }
    };

    return fetchProducts;
  }, []);

  useEffect(() => {
    const fetchProducts = memoizedFetchProducts;
    fetchProducts();
  }, []);

  useEffect(() => {
    // dispatch(showLoader());
    if (isLoggedIn) {
      getUserInfo();
    }
    // else{
    //   dispatch(showPopup())
    // }
  }, [isLoggedIn]);

  useEffect(() => {
    if (
      !localStorage.getItem("client_token") &&
      modals?.showLoginModal === false
    ) {
      console.log("closed", modals?.showLoginModal);
      const timeOut = setTimeout(() => {
        if (modals?.showLoginModal === false) {
          if (!isLoggedIn) {
            showSignupPopup();
          }
        }
      }, 5000);
      if (
        modals?.showLoginModal ||
        modals?.showSignupModal ||
        modals?.showforgotPasswordModal
      ) {
        clearTimeout(timeOut);
      }
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [isLoggedIn, modals]);

  // useEffect(() => {
  //   getUserInfo();
  // }, [saved]);

  async function handleLogout() {
    try {
      dispatch(showLoader());
      const url =
        clientType === "client"
          ? "https://admin.tradingmaterials.com/api/auth/logout"
          : "https://admin.tradingmaterials.com/api/lead/auth/logout";
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
        sessionStorage.removeItem("offerPhone");
        sessionStorage.removeItem("expiry");
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

  useEffect(() => {
    if (notifications?.message !== "") {
      showAlert();
    }
  }, [notifications]);

  const handleUserResponse = () => {
    setCookieResponse(true);
  };

  const showAlert = () => {
    if (notifications?.type === "warning") {
      Swal.fire({
        title: notifications?.message,
        showCloseButton: false,
        // timer: 1000,
        timerProgressBar: true,
        icon: notifications?.type,
        html: `<a className="swalLink" style="font-weight: bold;
        cursor: pointer;
        box-shadow: none !important;
        outline: none !important;
        font-size: small;
        display: flex;
        align-items: center;
        justify-content: center;" href=${userLang}/ ><svg style="width:25px; height:25px; scale:0.7; fill:#545454 !important; font-weight:bold !important" xmlns="http://www.w3.org/2000/svg" viewBox="0,0,5" > <g> <path fill="none" d="M0 0h24v24H0z"/> <path d="M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H8z"/> </g> </svg>Back to home</a>`,
        footer: `<a className="swalLink font-bold focus:outline-none" style="font-weight:bold;cursor: pointer;box-shadow: none !important;
        outline: none !important; font-size:small;color: #54a8c7 !important;" autofocus=false href=/?login>Login here</a>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        willClose: () => {
          dispatch(updateNotifications({ message: "", type: "" }));
        },
      });
    } else {
      Swal.fire({
        title: notifications?.message,
        showCloseButton: true,
        // timer: 1000,
        timerProgressBar: true,
        icon: notifications?.type,
        // footer: '<a className="font-bold" style="font-weight:bold;cursor: pointer" href="/login">Click here to login</a>',
        // showConfirmButton: false,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        willClose: () => {
          dispatch(updateNotifications({ message: "", type: "" }));
        },
      });
    }
  };
  const handleCloseModals = () => {
    dispatch({
      showSignupModal: false,
      showLoginModal: false,
      showforgotPasswordModal: false,
      showOtpModal: false,
      showNewPasswordModal: false,
    });
  };

  function handleMouseOverEvent(){
    setMouseOverEvent(true)
  }

  return (
    <>
      {/* {loaderState && (
        <div className="preloader !backdrop-blur-[1px] ">
          <div className="loader"></div>
        </div>
      )} */}
      {/* {isLoggedIn === false && !sessionStorage.getItem("offerPhone") && (
        <div className="block sm:!hidden">
          <Tooltip title="Get 10% off on first purchase">
            <Fab
              className="!mt-16 !bg-white !drop-shadow-none  "
              style={{ position: "fixed", right: "75px", bottom: "15px" }}
              onClick={() => setBottomOfferDisplay("block")}
            >
              <img
                className="!w-full"
                src="/images/oneDayLeft.png"
                alt="one-day-offer-icon"
              />
            </Fab>
          </Tooltip>
        </div>
      )} */}
      {showNameModal && (
        <UpdateProfile open={showNameModal} handleClose={hideProfileModal} />
      )}
      {!modals?.showSignupModal &&
        !modals?.showLoginModal &&
        !modals?.showforgotPasswordModal && (
          <div
            className=""
            style={{
              position: "fixed",
              right: "75px",
              bottom: "45px",
              zIndex: "9999999",
            }}
          >
            {showOffer && (
              <div
                className={`${
                  bottomOfferDisplay == "none" ? "hidden" : "block"
                }`}
              >
                {(showOffer && cookieResponse) ||
                  (localStorage.getItem("cookieStatus") != undefined) && 
                     <ChatForm hide={setBottomOfferDisplay} />
                  }
              </div>
            )}
          </div>
        )}
      {modals?.showSignupModal === true && (
        <SignupModal
          show={modals?.showSignupModal}
          onHide={() => handleCloseModals}
        />
      )}
      {modals?.showLoginModal === true && (
        <LoginModal
          show={modals?.showLoginModal}
          onHide={() => handleCloseModals}
        />
      )}
      {modals?.showforgotPasswordModal === true && (
        <ForgotPasswordModal
          show={modals?.showforgotPasswordModal}
          onHide={() => handleCloseModals}
        />
      )}
      {/* offer claim modal starts */}
      <Modal
        show={popup}
        onHide={() => dispatch(hidePopup())}
        centered
        size="md"
        style={{ borderRadius: "0.75rem" }}
        className="offer"
      >
        {/* <Modal.Header className="!text-center w-full !text-white !font-bold text-2xl bg-[#8fd499] !fill-white-500 p-[8px]">
          Sign Up for Special Offer
          <div className="cursor-pointer" onClick={() => dispatch(hidePopup())}>
            <CloseIcon className="!font-bold !text-4xl" />
          </div>
        </Modal.Header> */}
        <Modal.Body
          className="p-0 !rounded-xl "
          style={{
            borderRadius: "0.75rem",
            paddingLeft: "30px !important",
            paddingTop: "9px !important",
          }}
        >
          <div
            id="popup"
            className="!rounded-l"
            style={{
              borderRadius: "0.75rem",
              paddingLeft: "30px !important",
              paddingTop: "9px !important",
            }}
          >
            <div className="flex !shadow-xl">
              {!mouseOverEvent && <div
                className="d-flex drop-shadow-lg shadow-lg flex-col w-[50%] items-center justify-center"
                style={{
                  background: "linear-gradient(45deg, #5582bf, transparent)",
                }}
              >
                <div className="absolute"></div>
                <h3
                  className="!font-bold text-black text-left pl-3 pt-3 "
                  style={{ fontSize: "25px", height: "100%" }}
                >
                  Get 10% off Now
                </h3>
                <div className="popup-img  !text-left">
                  <img src="/images/offer-nobg.png" alt="offer-img" />
                </div>
                <div
                  className="offer-tex  p-0 pb-2 flex items-center justify-center  rounded-xl"
                  style={{ textAlign: "left !important" }}
                >
                  <div className=" !text-center">
                    <h3 className="!font-bold text-black text-2xl text-left  ">
                      on First Order
                    </h3>
                  </div>
                </div>
              </div>}
              <div className={` d-flex flex-col drop-shadow-xl ${!mouseOverEvent ? "w-[40%] " : "!w-full "} items-center !justify-center  rounded-xl`} onMouseOver={()=>{console.log("mouse..")}}>
                <div className="d-flex items-center justify-center ">
                  <img
                    className={`${mouseOverEvent? "max-w-[50%]" : ""}`}
                    src="/images/oneDayLeft.png"
                    alt="oneDayleft_png"
                  ></img>
                </div>

                <div className={`${mouseOverEvent ? "w-[90%]" : "tb-space d-flex justify-center  mt-[22px] w-full"} `}>
                  <div className={`${mouseOverEvent ? "" : "!inline"} `}>
                    <div></div>
                    <Offer mouseOverEvent = {handleMouseOverEvent} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* offer claim modal ends */}

      {/* v0 popup */}

      {/* {popup && (
        <div className="absolute w-full !h-[1000%] z-[99999] !bg-[rgba(0,0,0,0.5)]">
          <span className="  fixed  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-[10000] ">
            <AiFillCloseCircle
              className="text-red-500 text-3xl cursor-pointer"
              onClick={() => dispatch(hidePopup())}
            />
            <a>
              <img
                onClick={() => {
                  setShowModal(true);
                  dispatch(hidePopup());
                }}
                src="/assets/images/banner-cart.jpg"
                alt=""
              />
            </a>
          </span>
        </div>
      )} */}

      {modals?.showSignupModal === false &&
        modals?.showLoginModal === false && (
          <header className="nk-header">
            <div className={`nk-header-main nk-navbar-main `}>
              <div className="container">
                <div className="nk-header-wrap">
                  <div className="nk-header-logo">
                    <a href={`${userLang}/`} className="logo-link">
                      <div className="logo-wrap">
                        <img
                          className="logo-img logo-dark"
                          src="/images/tm-logo-1.png"
                          alt="brand-logo"
                        />
                      </div>
                    </a>
                  </div>
                  {toggleNavbar && (
                    <div
                      className={`${
                        toggleNavbar ? "navbar-overlay h-[100vh]" : ""
                      }`}
                      onClick={() => {
                        setToggleNavbar(false);
                      }}
                    ></div>
                  )}
                  <nav
                    className={`nk-header-menu nk-navbar  ${
                      toggleNavbar ? "navbar-active h-[100vh]" : ""
                    }`}
                  >
                    <div>
                      <ul className="nk-nav">
                        <li className="nk-nav-item">
                          <a href={`${userLang}/`} className="nk-nav-link">
                            <span className="nk-nav-text">{t("Home")}</span>
                          </a>
                        </li>
                        <li className="nk-nav-item">
                          <a href={`${userLang}/about`} className="nk-nav-link">
                            <span className="nk-nav-text">{t("About_Us")}</span>
                          </a>
                        </li>
                        <li
                          className="nk-nav-item has-sub "
                          onMouseEnter={() => {
                            setProductclicked(false);
                          }}
                        >
                          <a
                            className="nk-nav-link nk-nav-toggle cursor-pointer"
                            onClick={() => {
                              activeDropDown === "trading"
                                ? setActiveDropDown("")
                                : setActiveDropDown("trading");
                              setProductclicked(false);
                            }}
                          >
                            <span className="nk-nav-text">
                              {t("Trading_Materials")}
                            </span>
                          </a>
                          <ul
                            className={`nk-nav-sub opacity-100 hover:visible
                            ${productClicked ? "opacity-0 invisible " : ""}
                            ${
                              activeDropDown === "trading" ? "!block " : ""
                            }  nk-nav-mega nk-nav-mega-lg  nk-nav-mega-lg-home`}
                          >
                            <li className="nk-nav-item">
                              <ul className="row mx-auto">
                                {products?.sub_categories?.map((product) => (
                                  <>
                                    {product?.combo == 0 && (
                                      <>
                                        <li className="col-lg-6 col-xl-4 p-0 cursor-pointer">
                                          <a
                                            onClick={() => {
                                              dispatch(
                                                productsSubId({
                                                  id: product?.id,
                                                  name: product?.name,
                                                  type: "single",
                                                })
                                              );
                                              navigate(`${userLang}/#products`);
                                              setProductclicked(true);
                                              setToggleNavbar(false);
                                              setActiveDropDown("");
                                            }}
                                            className="nk-nav-link "
                                          >
                                            <div className="media-group">
                                              <div className="text-primary me-3">
                                                <ArrowForwardIcon
                                                  style={{ fontSize: "18px" }}
                                                />
                                              </div>
                                              <div className="media-text d-flex align-items-center sm">
                                                <h2 className="lead-text fs-14 text-capitalize m-0 !font-bold">
                                                  {product?.name}
                                                </h2>
                                              </div>
                                            </div>
                                          </a>
                                        </li>
                                      </>
                                    )}
                                  </>
                                ))}
                              </ul>
                            </li>
                          </ul>
                        </li>
                        <li
                          className="nk-nav-item has-sub"
                          onMouseEnter={() => {
                            setBundleClicked(false);
                          }}
                        >
                          <a
                            className="nk-nav-link nk-nav-toggle cursor-pointer"
                            onClick={() => {
                              activeDropDown === "bundle"
                                ? setActiveDropDown("")
                                : setActiveDropDown("bundle");
                              setBundleClicked(false);
                            }}
                          >
                            <span className="nk-nav-text">{t("Bundles")}</span>
                          </a>
                          <ul
                            className={`
                             nk-nav-sub  cursor-pointer opacity-100 hover:visible 
                             ${bundleClicked ? "opacity-0 invisible " : ""}
                            ${
                              activeDropDown === "bundle" ? "!block " : ""
                            } nk-nav-mega  nk-nav-mega nk-nav-mega-home`}
                          >
                            <li className="nk-nav-item col-lg-8">
                              <ul className="row px-3 px-lg-0 mx-auto">
                                {products?.sub_categories?.map((product) => (
                                  <>
                                    {product?.combo == 1 && (
                                      <>
                                        <li className="col-lg-12 col-xl-12 p-0">
                                          <a
                                            // href = {`${userLang}/#bundles`}
                                            onClick={() => {
                                              dispatch(
                                                productsSubId({
                                                  id: product?.id,
                                                  name: product?.name,
                                                  type: "combo",
                                                })
                                              );
                                              navigate(`${userLang}/#bundles`);
                                              setBundleClicked(true);
                                              setToggleNavbar(false);
                                              setActiveDropDown("");
                                            }}
                                            className="nk-nav-link "
                                          >
                                            <div className="text-primary me-3">
                                              <ArrowForwardIcon
                                                style={{ fontSize: "18px" }}
                                              />
                                            </div>
                                            {product?.name}
                                          </a>
                                        </li>
                                      </>
                                    )}
                                  </>
                                ))}
                              </ul>
                            </li>
                          </ul>
                        </li>

                        {/* <li className="nk-nav-item">
                          <a href={`${userLang}/#`} className="nk-nav-link">
                            <span className="nk-nav-text">
                              {t("Order_Tracking")}
                            </span>
                          </a>
                        </li> */}
                        <li className="nk-nav-item">
                          <a
                            href={`${userLang}/contact`}
                            className="nk-nav-link"
                          >
                            <span className="nk-nav-text">
                              {t("Contact_Us")}
                            </span>
                          </a>
                        </li>

                        {isLoggedIn && (
                          <li className="nk-nav-item has-sub">
                            <Divider orientation="vertical" />
                            <div className="text-left nk-nav-item  !block has-sub ">
                              <p className="nk-nav-link pb-0  pt-0 !text-xs">
                                {greetUser}
                              </p>

                              <a
                                className="nk-nav-link nk-nav-toggle cursor-pointer pt-0 pb-0 !text-blue-900"
                                style={{ width: "1px" }}
                                onClick={() =>
                                  activeDropDown === "profile"
                                    ? setActiveDropDown("")
                                    : setActiveDropDown("profile")
                                }
                              >
                                <span className="nk-nav-text capitalize  !text-sm">
                                  {userData?.client?.first_name}
                                </span>
                              </a>
                              <ul
                                className={`nk-nav-sub  ${
                                  activeDropDown === "profile" ? "!block" : ""
                                } `}
                              >
                                <li className="nk-nav-item col-lg-12">
                                  <ul className="row px-3 px-lg-0 mx-auto">
                                    <li className="col-lg-12 p-0">
                                      <a
                                        href={`${
                                          clientType === "lead"
                                            ? "/profile?"
                                            : "https://client.tradingmaterials.com/"
                                        }`}
                                        className="nk-nav-link"
                                      >
                                        Profile
                                      </a>
                                    </li>
                                    <li className="col-lg-12 p-0">
                                      <a
                                        href={`${userLang}/`}
                                        className="nk-nav-link"
                                      >
                                        inbox
                                      </a>
                                    </li>
                                    <li className="col-lg-12 p-0">
                                      <a
                                        className="nk-nav-link cursor-pointer"
                                        onClick={handleLogout}
                                      >
                                        logout
                                      </a>
                                    </li>
                                  </ul>
                                </li>
                              </ul>
                            </div>
                          </li>
                        )}

                        {!isLoggedIn && (
                          <li className="flex items-center cursor-pointer">
                            <a
                              onClick={() => {
                                dispatch(
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
                              <span className="nk-nav-text nk-nav-link">
                                Login
                              </span>
                            </a>
                          </li>
                        )}
                      </ul>
                      {/* <div className="nk-navbar-btn d-lg-none">
                    <ul className="nk-btn-group sm justify-content-center">
                    {isLoggedIn && (
                    <li className="nk-nav-item has-sub">
                      <a className="nk-nav-link nk-nav-toggle">
                        <span className="nk-nav-text">
                          {userData?.client?.first_name}
                        </span>
                      </a>
                      <ul className="nk-nav-sub">
                        <li className="nk-nav-item col-lg-12">
                          <ul className="row px-3 px-lg-0 mx-auto">
                            <li className="col-lg-12 p-0">
                              <a href={`${userLang}/`} className="nk-nav-link">
                                Profile
                              </a>
                            </li>
                            <li className="col-lg-12 p-0">
                              <a href={`${userLang}/`} className="nk-nav-link">
                                inbox
                              </a>
                            </li>
                            <li className="col-lg-12 p-0">
                              <a className="nk-nav-link" onClick={handleLogout}>
                                logout
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  )}

                  {!isLoggedIn && (
                    <li className="flex items-center">
                      <a href={`${userLang}/login`}>
                        <span className="nk-nav-text">Login</span>
                      </a>
                    </li>
                  )}
                    </ul>
                  </div> */}
                    </div>
                  </nav>
                  <div className="nk-header-action">
                    <ul className="nk-btn-group sm justify-content-center">
                      <li className="flex items-center">
                        <button
                          onClick={() => {
                            if (isLoggedIn) {
                              navigate(`${userLang}/profile?wishlist`);
                              if (
                                window.location.pathname?.includes("/profile")
                              ) {
                                window.location.reload();
                              }
                            } else {
                              dispatch(
                                usersignupinModal({
                                  showSignupModal: false,
                                  showLoginModal: true,
                                  showforgotPasswordModal: false,
                                  showOtpModal: false,
                                  showNewPasswordModal: false,
                                })
                              );
                            }
                          }}
                          type="button"
                          className="relative inline-flex items-center text-lg font-medium text-center rounded-lg  focus:outline-none "
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 22 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.239 18.8538C13.4096 17.5179 15.4289 15.9456 17.2607 14.1652C18.5486 12.8829 19.529 11.3198 20.1269 9.59539C21.2029 6.25031 19.9461 2.42083 16.4289 1.28752C14.5804 0.692435 12.5616 1.03255 11.0039 2.20148C9.44567 1.03398 7.42754 0.693978 5.57894 1.28752C2.06175 2.42083 0.795919 6.25031 1.87187 9.59539C2.46978 11.3198 3.45021 12.8829 4.73806 14.1652C6.56988 15.9456 8.58917 17.5179 10.7598 18.8538L10.9949 19L11.239 18.8538Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M7.26062 5.05302C6.19531 5.39332 5.43839 6.34973 5.3438 7.47501"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                          <span className="sr-only">Notifications</span>
                          <div className="absolute inline-flex items-center justify-center w-6 h-6 !text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-2 -right-3 dark:border-gray-900">
                            {cartCounts?.wishLishCount}
                          </div>
                        </button>
                      </li>

                      <li className="flex items-center">
                        <button
                          type="button"
                          className="relative inline-flex items-center text-lg font-medium text-center rounded-lg focus:outline-none "
                          onClick={() => {
                            if (isLoggedIn) {
                              navigate(`${userLang}/cart`);
                            } else {
                              dispatch(
                                usersignupinModal({
                                  showSignupModal: false,
                                  showLoginModal: true,
                                  showforgotPasswordModal: false,
                                  showOtpModal: false,
                                  showNewPasswordModal: false,
                                })
                              );
                            }
                          }}
                        >
                          <svg
                            width="21"
                            height="22"
                            viewBox="0 0 21 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.48626 20.5H14.8341C17.9004 20.5 20.2528 19.3924 19.5847 14.9348L18.8066 8.89359C18.3947 6.66934 16.976 5.81808 15.7311 5.81808H5.55262C4.28946 5.81808 2.95308 6.73341 2.4771 8.89359L1.69907 14.9348C1.13157 18.889 3.4199 20.5 6.48626 20.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M6.34902 5.5984C6.34902 3.21232 8.28331 1.27803 10.6694 1.27803V1.27803C11.8184 1.27316 12.922 1.72619 13.7362 2.53695C14.5504 3.3477 15.0081 4.44939 15.0081 5.5984V5.5984"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M7.70365 10.1018H7.74942"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M13.5343 10.1018H13.5801"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                          <span className="sr-only">Notifications</span>
                          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-black border-2 border-white rounded-full -top-2 -right-3 dark:border-gray-900">
                            {cartCounts?.cartCount}
                          </div>
                        </button>
                      </li>
                      <li
                        className="nk-navbar-toggle"
                        onClick={() => setToggleNavbar(true)}
                      >
                        <button
                          className={`btn btn-outline-primary navbar-toggle ${
                            toggleNavbar ? "active" : ""
                          } rounded-1 p-2 h-100`}
                        >
                          <em className="icon ni ni-menu"></em>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}
      <div className="container" style={{ "--bs-gutter-x": "0" }}>
        {localStorage.getItem("cookieStatus") == "true" ? (
          <></>
        ) : (localStorage.getItem("cookieStatus") == "false" &&
            moment(localStorage.getItem("cookieDeclienedTime"))?._i <
              moment(new Date().toLocaleDateString())?._i) ||
          localStorage.getItem("cookieStatus") == undefined ? (
          <CookieBanner storeResponse={handleUserResponse} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
