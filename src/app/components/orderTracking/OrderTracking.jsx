/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import Header from "../header/header";
import Footer from "../footer/footer";
import { Button, Checkbox, FormControlLabel, TextField, ThemeProvider, createTheme } from "@mui/material";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { FaBoxOpen, FaBoxes, FaWindowClose } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { BsFillFileEarmarkCheckFill } from "react-icons/bs";
import { MdOutlinePendingActions } from "react-icons/md";
// import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
// import { TbTruckReturn } from "react-icons/tb";
import { GiReturnArrow } from "react-icons/gi";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import axios from "axios";
import CustomizedSteppers from "./productTracking";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";

export default function OrderTacker() {
  const loaderState = useSelector((state) => state?.loader?.value);
  const [email, setEmail] = useState("");
  const [awbNo, setAwbNo] = useState("");
  const isLoggedIn = useSelector((state) => state.login?.value);
  // eslint-disable-next-line no-unused-vars
  const [submitted, setSubmitted] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [awbNoErr, setAwbNoErr] = useState("");
  const [trackMethod, setTrackMethod] = useState("AWB")
  // eslint-disable-next-line no-unused-vars
  const [orderData, setOrderData] = useState();
  const steps = [
    "Placed ",
    "Placed",
    "Confirmed",
    "Dispatched",
    "Delivered",
    "Delivered",
    "Delivered",
  ];
  const [windowWidth, setWindowWidth] = useState("horizontal");
  const [apiErr, setApiErr] = useState("");

  const icons = {
    0: (
      <MdOutlinePendingActions
        className="!w-[120px] !h-[80px] mt-4 rounded text-white p-3"
        style={{
          background:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        }}
      />
    ),
    1: (
      <FaBoxes
        className="!w-[120px] !h-[80px] mt-4 rounded text-white p-3"
        style={{
          background:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        }}
      />
    ),
    2: (
      <BsFillFileEarmarkCheckFill
        className="!w-[120px] !h-[80px] mt-4 rounded text-white p-3"
        style={{
          background:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        }}
      />
    ),
    3: (
      <TbTruckDelivery
        className="!w-[120px] !h-[80px] mt-4 rounded text-white p-3"
        style={{
          background:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        }}
      />
    ),
    4: (
      <FaBoxOpen
        className="!w-[120px] !h-[80px] mt-4 rounded text-white p-3"
        style={{
          background:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        }}
      />
    ),
    5: (
      <FaWindowClose
        className="!w-[120px] !h-[80px] mt-4 rounded text-white p-3"
        style={{
          background:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        }}
      />
    ),
    6: (
      <GiReturnArrow
        className="!w-[120px] !h-[80px] mt-4 rounded text-white p-3"
        style={{
          background:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        }}
      />
    ),
  };

  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });

  // Function to update the window width state
  const updateWindowWidth = () => {
    if (window.innerWidth < 800) setWindowWidth("vertical");
    else setWindowWidth("horizontal");
    console.log(window.innerWidth, "innerWidth");
  };

  useEffect(() => {
    // Add an event listener to listen for window resize events
    window.addEventListener("resize", updateWindowWidth);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);
  const dispatch = useDispatch();

  function emailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    if (email != "" && !emailRegex.test(email)) {
      setEmailErr("Invalid email format");
      return false;
    } else {
      setEmailErr("");
      return true;
    }
  }

  function awbNoValidation(ordNo) {
    if (ordNo == "") {
      setAwbNoErr("AWB number is required");
      return false;
    } else if (ordNo?.length < 6 || ordNo?.length > 20) {
      setAwbNoErr("Invalid AWB number");
      return false;
    } else {
      setAwbNoErr("");
      return true;
    }
  }

  const handleawbNoChange = (ordNo) => {
    // ordNo = ordNo.replace(/[^0-9]/g, "");
    setSubmitted(false);
    setAwbNo(ordNo);
    console.log(ordNo);
    awbNoValidation(ordNo);
  };

  const handleEmailChange = (mail) => {
    setSubmitted(false);
    setEmail(mail);
    emailValidaiton(mail);
  };

  async function handleSubmit() {
    emailValidaiton(email);
    setApiErr("");
    awbNoValidation(awbNo);
    if (awbNo != "" && emailErr == "" && awbNoErr == "") {
      try {
        dispatch(showLoader());
        console.log(awbNo, "ordNO");
        const url =
          `https://admin.tradingmaterials.com/api/shiprocket/awb/order-track?awb_number=${awbNo}`;
        const response = await axios.get(url, {
          headers: {
            "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
            Accept: "application/json",
          },
        });
        if (response?.data?.status) {
          setSubmitted(true);
          setOrderData(response?.data?.data?.order);
          const resp = JSON.stringify(response?.data?.data)
          sessionStorage.setItem("ordData", resp)
          window.location.href = `/tracking/${CryptoJS?.AES?.encrypt(
            `${awbNo}`,
            "awd_no"
          )
            ?.toString()
            .replace(/\//g, "_")
            .replace(/\+/g, "-")}`;
        }
      } catch (err) {
        console.log(err);
        if (err?.response?.data?.errors) {
          setAwbNoErr(
            Object.values(err?.response?.data?.errors["order_number"])
          );
          setEmailErr(Object.values(err?.response?.data?.errors["email"]));
        }
        setApiErr(err?.response?.data?.message);
      } finally {
        dispatch(hideLoader());
      }
    } else {
      dispatch(hideLoader());
    }
  }

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <Header />

      <div className="nk-pages text-left mt-10 sm:mt-40 md:mt-20">
        <section className="nk-banner nk-banner-career-job-details bg-gray">
          <div className="nk-banner-wrap pt-10  pb-[50px] ">
            <div className="container">
              <div className="row p-10">
                <div className={`col-12 col-md-12 col-lg-6 `}>
                  <div className="w-full  ">
                    {(!submitted || (orderData == null && submitted)) && (
                      <p className="text-2xl text-center md:text-start">
                        Book and track orders anytime, anywhere
                      </p>
                    )}
                    {submitted && orderData != null && (
                      <p className="text-2xl text-center md:text-start">
                        Your Order-<b>{orderData?.order_number} </b> is{" "}
                        <b className="">{steps[orderData?.status]}</b>
                      </p>
                    )}
                    <div className="flex justify-center">
                      {
                        <img
                          src="/images/gifs/truck-tm1.gif"
                          alt="delvery"
                          className="w-[44%] "
                        />
                      }
                    </div>
                    <div
                      className="mt-5 p-3 "
                      style={{
                        background:
                          "linear-gradient(23.01deg, #2b5cfd 14.9%, #1d3faf 85.1%)",
                      }}
                    >
                      <img
                        className="w-[100%]"
                        src="/images/partner-logos.webp"
                        alt="deli_partners"
                      />
                    </div>
                  </div>
                </div>
                {/* {
                  submitted && orderData != null && (
                    <div className="col-md-12 col-lg-6 mb-6 pt-5 sm:pt-0 grid place-items-center !pr-0 !pl-0">
                      <div className="flex justify-around items-center w-full mb-[16px]">
                        <div className="ml-0 md:ml-4 lg:ml-8">
                          <p className=" text-start md:text-left text-xs md:text-sm lg:text-xl !mb-3">
                            Your Order:{" "}
                            <b className="!text-blue-600 text-xs md:text-sm lg:text-xl">
                              {orderData?.order_number}{" "}
                            </b>{" "}
                            <br />
                            <p className="text-xs md:text-sm lg:text-xl ">
                              Order Status:{" "}
                              <b className="!text-blue-600 text-xs md:text-sm lg:text-xl !mb-2">
                                {steps[orderData?.status]}
                              </b>
                            </p>{" "}
                            <p className="text-xs md:text-sm lg:text-xl !mb-2">
                              Updated on:{" "}
                              <b className="!text-blue-600 text-xs md:text-sm lg:text-xl ">
                                {new Date(
                                  orderData?.updated_at
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </b>
                            </p>
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setSubmitted(false);
                            setOrderData(null);
                          }}
                          variant="outlined"
                          startIcon={
                            <CompareArrowsIcon className="!w-[18px]" />
                          }
                        >
                          Try Again
                        </Button>
                      </div>

                      <CustomizedSteppers
                        orderStatus={
                          orderData?.status == "0"
                            ? "0"
                            : orderData?.status >= 4
                            ? "3"
                            : orderData?.status - 1
                        }
                      />
                      {!isLoggedIn && (
                        <p
                          className="text-center cursor-pointer hover:!text-blue-600 !mt-8 sm:mt-[auto]"
                          onClick={() => {
                            if (orderData?.status != "0") {
                              window.location.href = `/login`;
                            } else {
                              dispatch(
                                usersignupinModal({
                                  showSignupModal: false,
                                  showLoginModal: true,
                                  showforgotPasswordModal: false,
                                  showOtpModal: false,
                                  showNewPasswordModal: false,
                                  showSignupCartModal: false,
                                  showSignupBuyModal: false,
                                })
                              );
                            }
                          }}
                        >
                          Login to your account
                        </p>
                      )}
                    </div>
                  )
                } */}

                {/* {!submitted && ( */}
                  <div className="col-12 col-md-12 col-lg-6 card bg-white drop-shadow-lg shadow-lg  px-10 py-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <p className="text-[#0B0757]  text-lg font-semibold">
                          {" "}
                          Track By:
                        </p>
                        <div>
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled
                                checked={trackMethod == "Email"}
                                onChange={() => setTrackMethod("Email")}
                              />
                            }
                            label="Email"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={trackMethod == "AWB"}
                                onChange={() => setTrackMethod("AWB")}
                              />
                            }
                            label="AWB Number"
                          />
                        </div>
                    </div>
                    <div>
                      {trackMethod == "Email" && (
                        <div className="flex justify-center w-full">
                          <div className="form-control-wrap hover:drop-shadow-lg w-[100%]  mt-3">
                            <TextField
                              fullWidth
                              label="Email"
                              type="email"
                              value={email}
                              onChange={(e) =>
                                handleEmailChange(e.target.value)
                              }
                              id="fullWidth"
                            />
                            <p className="nk-message-error text-xs font-semibold !inline">
                              {emailErr}
                            </p>
                          </div>
                        </div>
                      )}
                      {trackMethod == "AWB" && (
                        <div className="form-control-wrap hover:drop-shadow-lg w-[100%]  mt-3">
                          <ThemeProvider theme={theme}>
                            <TextField
                              value={awbNo}
                              onChange={(e) =>
                                handleawbNoChange(e.target.value)
                              }
                              className=""
                              required
                              fullWidth
                              label="AWB No"
                              variant="outlined"
                            />
                          </ThemeProvider>
                          <p
                            className="nk-message-error text-xs font-semibold !inline"
                            style={
                              awbNoErr
                                ? { visibility: "visible" }
                                : { visibility: "hidden" }
                            }
                          >
                            {awbNoErr}
                          </p>
                        </div>
                      )}

                      <Button
                        className="mt-5 p-3 w-full"
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        Track Order
                      </Button>

                      {apiErr && (
                        <p className="nk-message-error font-bold !text-xs mt-2">
                          {apiErr}
                        </p>
                      )}
                      </div>
                      <div className="mt-5">
                        <p className="capitalize text-[#0B0757] font-semibold">
                          {" "}
                          Can&apos;t find your order details?
                        </p>
                        <span className="text-sm text-gray-800 ml-1">
                          We sent your AWB tracking number to you via Email upon
                          order confirmation.
                        </span>
                      </div>
                  </div>
                {/* )} */}
                {/* {submitted && orderData == null && (
                  <div className="p-10 col-12 col-md-6 ">
                    <div className="flex justify-center">
                      <img
                        src="/images/awbNotFound.webp"
                        className="!w-[34%]"
                        alt="ord_not_found"
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      <Button
                        onClick={() => {
                          setSubmitted(false);
                          setOrderData();
                        }}
                        variant="outlined"
                        startIcon={<CompareArrowsIcon className="!w-[18px]" />}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </section>
      </div>
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
                      Get in touch with our support team if you still can’t find
                      your answer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-center text-lg-end">
                <a href={`/contact`} className="btn btn-white fw-semiBold">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
