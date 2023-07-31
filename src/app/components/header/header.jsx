import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { fetchAllProducts } from "../../../features/products/productsSlice";

export default function Header() {
  const dispatch = useDispatch()
  useEffect(()=>{
    async function fetchProducts (){
      
      dispatch(showLoader())
      try {
          const response = await axios.get("https://admin.tradingmaterials.com/api/get/products", {
              headers: {
                  "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
                  "Accept": "application/json"
              }
          })
          if (response?.data?.status) {
              dispatch(fetchAllProducts(response?.data?.data))
          }
      } catch (err) {
          console.log("err")
      }finally{
        dispatch(hideLoader())
      }
  }

  fetchProducts()
  },[])

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
                          <span>Purchase Now</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              <div className="nk-header-action">
                <ul className="nk-btn-group sm justify-content-center">
                  <li className="d-none d-md-block">
                    <a
                      href="/"
                      className="btn btn-primary text-nowrap text-nowrap"
                    >
                      <em className="icon ni ni-bag-fill"></em>
                      <span>Purchase Now</span>
                    </a>
                  </li>
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
