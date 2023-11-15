import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { fetchAllProducts } from "../../../features/products/productsSlice";
import { loginUser, logoutUser } from "../../../features/login/loginSlice";
import { updateUsers } from "../../../features/users/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
// import { Modal } from "react-bootstrap";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import { updateCart } from "../../../features/cartItems/cartSlice";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "animate.css";
import { updateCartCount } from "../../../features/cartWish/focusedCount";
import { showPopup } from "../../../features/popups/popusSlice";
// import { useTranslation } from "react-i18next";
import { userLanguage } from "../../../features/userLang/userLang";
import SignupModal from "../modals/signup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { productsSubId } from "../../../features/subCategoriesIds/subCategoriesSlice";
// import CloseIcon from "@mui/icons-material/Close";
import LoginModal from "../modals/login";
// import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import ForgotPasswordModal from "../modals/forgotPassword";
import SessionExpired from "../modals/sessionExpired";

export default function Header() {
  const dispatch = useDispatch();
  //   const products = useSelector((state) => state?.products?.value);
  const positions = useSelector((state) => state?.position?.value);
  const isLoggedIn = useSelector((state) => state.login?.value);
  const loaderState = useSelector((state) => state?.loader?.value);
  const userData = useSelector((state) => state?.user?.value);
  const notifications = useSelector((state) => state?.notification?.value);
  const cartCounts = useSelector((state) => state?.saved?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  const popup = useSelector((state) => state?.popup?.value);
  const modals = useSelector((state) => state?.signupInModal?.value);
  const [activeDropDown, setActiveDropDown] = useState("orders");

  // eslint-disable-next-line no-unused-vars
  const [showModal, setShowModal] = useState(false);
  const [showSessionExpiry, setShowSessionExpiry] = useState(false);

  //   const { t } = useTranslation();
  const location = useLocation();
  console.log(location.pathname);

  const [toggleNavbar, setToggleNavbar] = useState(false);

  console.log(notifications);

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

  const getUserInfo = async () => {
    console.log(location.pathname.includes("/product-detail"));
    if (isLoggedIn) {
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
          if (
            location.pathname === "/" ||
            location.pathname.includes("/product-detail")
          ) {
            localStorage.removeItem("client_token");
            dispatch(logoutUser());
          } else {
            localStorage.removeItem("client_token");
            dispatch(logoutUser());
            setShowSessionExpiry(true);
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
          location.pathname.includes("/products")
        ) {
          localStorage.removeItem("client_token");
          dispatch(logoutUser());
        } else {
          localStorage.removeItem("client_token");
          dispatch(logoutUser());
          setShowSessionExpiry(true);
        }
      } finally {
        dispatch(hideLoader());
      }
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
  }, [isLoggedIn]);

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

  useEffect(() => {
    if (notifications?.message !== "") {
      showAlert();
    }
  }, [notifications]);

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
        outline: none !important; font-size:small;color: #54a8c7 !important;" autofocus=false href=/login>Login here</a>`,
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

  function handleSessionExpiryClose() {
    setShowSessionExpiry(false);
    navigate("/login");
  }

  return (
    <>
      <SessionExpired
        open={showSessionExpiry}
        handleClose={handleSessionExpiryClose}
      />
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px] ">
          <div className="loader"></div>
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
                          src="/images/tm-logo-1.webp"
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
                          <a
                            href={`${userLang}/`}
                            className={`nk-nav-link ${
                              location.pathname === "/" ? "active" : ""
                            }`}
                          >
                            <span className="nk-nav-text">Dashboard</span>
                          </a>
                        </li>
                        <li className="nk-nav-item">
                          <a
                            href={`${userLang}/products`}
                            className={`nk-nav-link ${
                              location.pathname === "/products" ? "active" : ""
                            }`}
                          >
                            <span className="nk-nav-text">Products</span>
                          </a>
                        </li>

                        <li className="nk-nav-item has-sub">
                          <a
                            className={`nk-nav-link nk-nav-toggle cursor-pointer ${
                              location.pathname.includes("/view-order")
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              activeDropDown === "orders"
                                ? setActiveDropDown("")
                                : setActiveDropDown("orders")
                            }
                          >
                            <span className="nk-nav-text">Orders</span>
                          </a>
                          <ul
                            className={`nk-nav-sub cursor-pointer ${
                              activeDropDown === "orders" ? "!block " : ""
                            } nk-nav-mega  nk-nav-mega nk-nav-mega-home`}
                          >
                            <li className="nk-nav-item col-lg-8">
                              <ul className="row px-3 px-lg-0 mx-auto">
                                <>
                                  <li className="col-lg-12 col-xl-12 p-0">
                                    <a
                                      // href = {`${userLang}/#bundles`}
                                      onClick={() => {
                                        navigate(
                                          `${userLang}/view-order/unpaid`
                                        );
                                      }}
                                      className="nk-nav-link "
                                    >
                                      <div className="text-primary me-3">
                                        <ArrowForwardIcon
                                          style={{ fontSize: "18px" }}
                                        />
                                      </div>
                                      Pending Orders
                                    </a>
                                  </li>
                                  <li className="col-lg-12 col-xl-12 p-0">
                                    <a
                                      // href = {`${userLang}/#bundles`}
                                      onClick={() => {
                                        navigate(
                                          `${userLang}/view-order/placed`
                                        );
                                      }}
                                      className="nk-nav-link "
                                    >
                                      <div className="text-primary me-3">
                                        <ArrowForwardIcon
                                          style={{ fontSize: "18px" }}
                                        />
                                      </div>
                                      Orders Placed
                                    </a>
                                  </li>
                                  <li className="col-lg-12 col-xl-12 p-0">
                                    <a
                                      // href = {`${userLang}/#bundles`}
                                      onClick={() => {
                                        navigate(
                                          `${userLang}/view-order/confirmed`
                                        );
                                      }}
                                      className="nk-nav-link "
                                    >
                                      <div className="text-primary me-3">
                                        <ArrowForwardIcon
                                          style={{ fontSize: "18px" }}
                                        />
                                      </div>
                                      Orders Confirmed
                                    </a>
                                  </li>
                                  <li className="col-lg-12 col-xl-12 p-0">
                                    <a
                                      // href = {`${userLang}/#bundles`}
                                      onClick={() => {
                                        navigate(
                                          `${userLang}/view-order/dispatched`
                                        );
                                      }}
                                      className="nk-nav-link "
                                    >
                                      <div className="text-primary me-3">
                                        <ArrowForwardIcon
                                          style={{ fontSize: "18px" }}
                                        />
                                      </div>
                                      Orders Dispatched
                                    </a>
                                  </li>
                                  <li className="col-lg-12 col-xl-12 p-0">
                                    <a
                                      // href = {`${userLang}/#bundles`}
                                      onClick={() => {
                                        navigate(
                                          `${userLang}/view-order/delivered`
                                        );
                                      }}
                                      className="nk-nav-link "
                                    >
                                      <div className="text-primary me-3">
                                        <ArrowForwardIcon
                                          style={{ fontSize: "18px" }}
                                        />
                                      </div>
                                      Orders Delivered
                                    </a>
                                  </li>
                                  <li className="col-lg-12 col-xl-12 p-0">
                                    <a
                                      // href = {`${userLang}/#bundles`}
                                      onClick={() => {
                                        navigate(
                                          `${userLang}/view-order/cancelled`
                                        );
                                      }}
                                      className="nk-nav-link "
                                    >
                                      <div className="text-primary me-3">
                                        <ArrowForwardIcon
                                          style={{ fontSize: "18px" }}
                                        />
                                      </div>
                                      Orders Cancelled
                                    </a>
                                  </li>
                                  <li className="col-lg-12 col-xl-12 p-0">
                                    <a
                                      // href = {`${userLang}/#bundles`}
                                      onClick={() => {
                                        navigate(
                                          `${userLang}/view-order/returned`
                                        );
                                      }}
                                      className="nk-nav-link "
                                    >
                                      <div className="text-primary me-3">
                                        <ArrowForwardIcon
                                          style={{ fontSize: "18px" }}
                                        />
                                      </div>
                                      Orders Returned
                                    </a>
                                  </li>
                                </>
                              </ul>
                            </li>
                          </ul>
                        </li>

                        <li className="nk-nav-item">
                          <a
                            href={`${userLang}/products`}
                            className={`nk-nav-link ${
                              location.pathname === "/track-order"
                                ? "active"
                                : ""
                            }`}
                          >
                            <span className="nk-nav-text">Order Tracking</span>
                          </a>
                        </li>

                        {isLoggedIn && (
                          <li className="nk-nav-item has-sub">
                            <a
                              className="nk-nav-link nk-nav-toggle cursor-pointer"
                              onClick={() =>
                                activeDropDown === "profile"
                                  ? setActiveDropDown("")
                                  : setActiveDropDown("profile")
                              }
                            >
                              <span className="nk-nav-text">
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
                                      href={`/profile`}
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
                          </li>
                        )}

                        {!isLoggedIn && (
                          <li className="flex items-center cursor-pointer">
                            <a onClick={() => navigate(`/login`)}>
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
                      <a href={`/login`}>
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
                            } else {
                              dispatch(showPopup());
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
                            {userData?.client?.wishlist_count
                              ? userData?.client?.wishlist_count
                              : 0}
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
                              dispatch(showPopup());
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
    </>
  );
}
