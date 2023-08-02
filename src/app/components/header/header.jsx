import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { fetchAllProducts } from "../../../features/products/productsSlice";
import { updatePositions } from "../../../features/positions/positionsSlice";
import { logoutUser } from "../../../features/login/loginSlice";
import { updateUsers } from "../../../features/users/userSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const dispatch = useDispatch();
  const positions = useSelector((state) => state?.position?.value);
  const isLoggedIn = useSelector( state => state.login?.value);
  const userData = useSelector(state => state?.user?.value);

  const navigate = useNavigate()

  console.log(userData)
  console.log(isLoggedIn)
  console.log(positions);
  useEffect(() => {
    const cartButtonRect = document
      ?.getElementById("cart")
      ?.getBoundingClientRect();
    dispatch(
      updatePositions({
        cartTop: cartButtonRect?.top,
        cartRight: cartButtonRect?.left,
        productTop: positions?.productTop ? positions?.productTop : "",
        productRight: positions?.productRight ? positions?.productRight : "",
      })
    );
  }, [window?.scroll]);

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
        }
      } catch (err) {
        console.log("err");
      } finally {
        dispatch(hideLoader());
      }
    }

    fetchProducts();
  }, []);

  async function handleLogout(){
    try{
      dispatch(showLoader())
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/lead/auth/logout",
        {},
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      );

      if(response?.status){
        dispatch(logoutUser())
        localStorage.removeItem("token");
        // window.location.reload();
        navigate("/login")
        
      }
    }catch(err){
      console.log("err", err)
    }finally{
      dispatch(hideLoader())
    }
  }

  return (
    <>
      <header className="nk-header">
        <div className="nk-header-main nk-navbar-main">
          <div className="container">
            <div className="nk-header-wrap">
              <div className="nk-header-logo">
                <a href="/" className="logo-link">
                  <div className="logo-wrap">
                    <img
                      className="logo-img logo-dark"
                      src="/images/tm-logo-1.png"
                      alt="brand-logo"
                    />
                  </div>
                </a>
              </div>
              <nav className="nk-header-menu nk-navbar">
                <div>
                  <ul className="nk-nav">
                    <li className="nk-nav-item">
                      <a href="/" className="nk-nav-link">
                        <span className="nk-nav-text">Home</span>
                      </a>
                    </li>
                    <li className="nk-nav-item">
                      <a href="about-us.php" className="nk-nav-link">
                        <span className="nk-nav-text">About Us</span>
                      </a>
                    </li>
                    <li className="nk-nav-item has-sub">
                      <a href="#" className="nk-nav-link nk-nav-toggle">
                        <span className="nk-nav-text">Trading Materials</span>
                      </a>
                      <ul className="nk-nav-sub nk-nav-mega nk-nav-mega-lg nk-nav-mega-lg-home">
                        <li className="nk-nav-item">
                          <ul className="row mx-auto">
                            <li className="col-lg-6 col-xl-4 p-0">
                              <a href="/" className="nk-nav-link">
                                <div className="media-group">
                                  <div className="text-primary me-3">
                                    <em className="icon ni ni-pie-fill"></em>
                                  </div>
                                  <div className="media-text d-flex align-items-center sm">
                                    <h2 className="lead-text fs-14 text-capitalize m-0">
                                      Day Trader Mouse Pad
                                    </h2>
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li className="col-lg-6 col-xl-4 p-0">
                              <a href="/" className="nk-nav-link">
                                <div className="media-group">
                                  <div className="text-danger me-3">
                                    <em className="icon ni ni-book-fill"></em>
                                  </div>
                                  <div className="media-text d-flex align-items-center sm">
                                    <h2 className="lead-text fs-14 text-capitalize m-0">
                                      Trading Cards
                                    </h2>
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li className="col-lg-6 col-xl-4 p-0">
                              <a href="/" className="nk-nav-link">
                                <div className="media-group">
                                  <div className="text-info me-3">
                                    <em className="icon ni ni-users-fill"></em>
                                  </div>
                                  <div className="media-text d-flex align-items-center sm">
                                    <h2 className="lead-text fs-14 text-capitalize m-0">
                                      Trading Desk Mat
                                    </h2>
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li className="col-lg-6 col-xl-4 p-0">
                              <a href="/" className="nk-nav-link">
                                <div className="media-group">
                                  <div className="text-warning me-3">
                                    <em className="icon ni ni-building-fill"></em>
                                  </div>
                                  <div className="media-text d-flex align-items-center sm">
                                    <h2 className="lead-text fs-14 text-capitalize m-0">
                                      Day Trading Journal
                                    </h2>
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li className="col-lg-6 col-xl-4 p-0">
                              <a href="/" className="nk-nav-link">
                                <div className="media-group">
                                  <div className="text-success me-3">
                                    <em className="icon ni ni-chat-circle-fill"></em>
                                  </div>
                                  <div className="media-text d-flex align-items-center sm">
                                    <h2 className="lead-text fs-14 text-capitalize m-0">
                                      Candlestick Chart Patterns Posters –
                                      Volume 1
                                    </h2>
                                  </div>
                                </div>
                              </a>
                            </li>
                            <li className="col-lg-6 col-xl-4 p-0">
                              <a href="/" className="nk-nav-link">
                                <div className="media-group">
                                  <div className="text-primary me-3">
                                    <em className="icon ni ni-db-fill"></em>
                                  </div>
                                  <div className="media-text d-flex align-items-center sm">
                                    <h2 className="lead-text fs-14 text-capitalize m-0">
                                      Price Action & Setup Posters - Volume 2
                                    </h2>
                                  </div>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li className="nk-nav-item has-sub">
                      <a href="#" className="nk-nav-link nk-nav-toggle">
                        <span className="nk-nav-text">Bundles</span>
                      </a>
                      <ul className="nk-nav-sub nk-nav-mega row nk-nav-mega-lg-2">
                        <li className="nk-nav-item col-lg-8">
                          <ul className="row px-3 px-lg-0 mx-auto">
                            <li className="col-lg-12 p-0">
                              <a href="/" className="nk-nav-link">
                                {" "}
                                Combo Trading Bundle{" "}
                              </a>
                            </li>
                            <li className="col-lg-12 p-0">
                              <a href="/" className="nk-nav-link">
                                {" "}
                                Bundle Pack 1{" "}
                              </a>
                            </li>
                            <li className="col-lg-12 p-0">
                              <a href="/" className="nk-nav-link">
                                {" "}
                                Bundle Pack 2{" "}
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>

                    <li className="nk-nav-item">
                      <a href="#" className="nk-nav-link">
                        <span className="nk-nav-text">Order Tracking</span>
                      </a>
                    </li>
                    <li className="nk-nav-item">
                      <a href="contact-us.php" className="nk-nav-link">
                        <span className="nk-nav-text">Contact Us</span>
                      </a>
                    </li>
                  </ul>
                  <div className="nk-navbar-btn d-lg-none">
                    <ul className="nk-btn-group sm justify-content-center">
                      <li className="w-100">
                        <a href="/" className="btn btn-primary w-100">
                          <em className="icon ni ni-bag-fill"></em>
                          <span id="cart">Profile</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              <div className="nk-header-action">
                <ul className="nk-btn-group sm justify-content-center">
                  <li className="flex items-center">
                    <button
                      type="button"
                      class="relative inline-flex items-center text-lg font-medium text-center rounded-lg  focus:outline-none "
                    >
                     <svg
                        width="24"
                        height="24"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.239 18.8538C13.4096 17.5179 15.4289 15.9456 17.2607 14.1652C18.5486 12.8829 19.529 11.3198 20.1269 9.59539C21.2029 6.25031 19.9461 2.42083 16.4289 1.28752C14.5804 0.692435 12.5616 1.03255 11.0039 2.20148C9.44567 1.03398 7.42754 0.693978 5.57894 1.28752C2.06175 2.42083 0.795919 6.25031 1.87187 9.59539C2.46978 11.3198 3.45021 12.8829 4.73806 14.1652C6.56988 15.9456 8.58917 17.5179 10.7598 18.8538L10.9949 19L11.239 18.8538Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M7.26062 5.05302C6.19531 5.39332 5.43839 6.34973 5.3438 7.47501"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <span class="sr-only">Notifications</span>
                      <div class="absolute inline-flex items-center justify-center w-6 h-6 !text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-2 -right-3 dark:border-gray-900">
                        {userData?.wish_count}
                      </div>
                    </button>
                  </li>

                  <li className="flex items-center">
                    <button
                      type="button"
                      class="relative inline-flex items-center text-lg font-medium text-center rounded-lg focus:outline-none "
                    >
                      <svg
                          width="21"
                          height="22"
                          viewBox="0 0 21 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.48626 20.5H14.8341C17.9004 20.5 20.2528 19.3924 19.5847 14.9348L18.8066 8.89359C18.3947 6.66934 16.976 5.81808 15.7311 5.81808H5.55262C4.28946 5.81808 2.95308 6.73341 2.4771 8.89359L1.69907 14.9348C1.13157 18.889 3.4199 20.5 6.48626 20.5Z"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M6.34902 5.5984C6.34902 3.21232 8.28331 1.27803 10.6694 1.27803V1.27803C11.8184 1.27316 12.922 1.72619 13.7362 2.53695C14.5504 3.3477 15.0081 4.44939 15.0081 5.5984V5.5984"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M7.70365 10.1018H7.74942"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M13.5343 10.1018H13.5801"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      <span class="sr-only">Notifications</span>
                      <div class="absolute inline-flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-black border-2 border-white rounded-full -top-2 -right-3 dark:border-gray-900">
                      {userData?.cart_count}
                      </div>
                    </button>
                  </li>
                  {isLoggedIn &&  <li className="nk-nav-item has-sub">
                      <a className="nk-nav-link nk-nav-toggle">
                        <span className="nk-nav-text">{userData?.first_name}</span>
                      </a>
                      <ul className="nk-nav-sub">
                        <li className="nk-nav-item col-lg-12">
                          <ul className="row px-3 px-lg-0 mx-auto">
                            <li className="col-lg-12 p-0">
                              <a href="/" className="nk-nav-link">
                                Profile
                              </a>
                            </li>
                            <li className="col-lg-12 p-0">
                              <a href="/" className="nk-nav-link">
                                inbox
                              </a>
                            </li>
                            <li className="col-lg-12 p-0">
                              <a  className="nk-nav-link" onClick={handleLogout}>
                                logout
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>}

                    {!isLoggedIn && <li className="flex items-center">
                    <a href="/login" >
                        <span className="nk-nav-text">Login</span>
                      </a>
                      </li>}
                    

                  <li className="nk-navbar-toggle">
                    <button className="btn btn-outline-primary navbar-toggle rounded-1 p-2 h-100">
                      <em className="icon ni ni-menu"></em>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
