import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import Header from "../header/header";
import Footer from "../footer/footer";
import { Button, TextField } from "@mui/material";
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
  const [orderNo, setOrderNo] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [submitted, setSubmitted] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [orderNoErr, setOrderNoErr] = useState("");
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
      setEmailErr("Invalid email");
      return false;
    } else {
      setEmailErr("");
      return true;
    }
  }

  function orderNoValidation(ordNo) {
    if (ordNo == "") {
      setOrderNoErr("Order No is required");
      return false;
    } else if (ordNo?.length < 6 || ordNo?.length > 20) {
      setOrderNoErr("Invalid Order no");
      return false;
    } else {
      setOrderNoErr("");
      return true;
    }
  }

  const handleOrderNoChange = (ordNo) => {
    setSubmitted(false);
    setOrderNo(ordNo);
    orderNoValidation(ordNo);
  };

  const handleEmailChange = (mail) => {
    setSubmitted(false);
    setEmail(mail);
    emailValidaiton(mail);
  };

  async function handleSubmit() {
    emailValidaiton(email);
    setApiErr("");
    orderNoValidation(orderNo);
    if (orderNo != "" && emailErr == "" && orderNoErr == "") {
      try {
        dispatch(showLoader());
        console.log(orderNo, "ordNO");
        const url =
          email != ""
            ? `https://admin.tradingmaterials.com/api/track-order?order_number=${orderNo}&email=${email}`
            : `https://admin.tradingmaterials.com/api/track-order?order_number=${orderNo}`;
        const response = await axios.get(url, {
          headers: {
            "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
            Accept: "application/json",
          },
        });
        if (response?.data?.status) {
          setSubmitted(response?.data?.message);
          setOrderData(response?.data?.data?.order);
        }
      } catch (err) {
        console.log(err);
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
                    {!submitted && orderData == null && (
                      <p className="text-2xl text-center md: text-start">
                        Book and track orders anytime, anywhere
                      </p>
                    )}
                    {submitted &&
                      windowWidth == "vertical" &&
                      orderData != null && (
                        <p className="text-2xl text-center md: text-start">
                          Your Order-<b>{orderData?.order_number} </b> is{" "}
                          <b className="">{steps[orderData?.status]}</b>
                        </p>
                      )}
                    <div className="flex justify-center">
                      {((windowWidth == "vertical" &&
                        !submitted &&
                        orderData == null) ||
                        windowWidth == "horizontal") && (
                        <img
                          src="/images/delivery.png"
                          alt="delvery"
                          className="w-[44%] "
                        />
                      )}
                      {windowWidth == "vertical" && icons[orderData?.status]}
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
                        src="/images/partner-logos.png"
                        alt="deli_partners"
                      />
                    </div>
                  </div>
                </div>
                {submitted &&
                  orderData != null &&
                  windowWidth == "horizontal" && (
                    <div className="col-md-12 col-lg-6 mb-6 pt-5 sm:pt-0 grid ">
                      <div className="ml-0 md:ml-4 lg:ml-8">
                      <p className="mb-2 text-start md:text-left">
                        Your Order: <b className="!text-blue-600">{orderData?.order_number} </b> <br />
                        <p className="">
                          Order Status:{" "}
                          <b className="!text-blue-600">{steps[orderData?.status]}</b>
                        </p>{" "}
                        <p className="">
                        Updated on:{" "}
                        <b className="!text-blue-600">{new Date(orderData?.updated_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                        </b>
                      </p>
                      </p>
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
                      <p className="text-center cursor-pointer hover:!text-blue-600" onClick={()=>{
                        if(orderData?.status != "0"){
                          window.location.href = `https://client.tradingmaterials.com/login`
                        }else{
                          dispatch(
                            usersignupinModal({
                              showSignupModal: false,
                              showLoginModal: true,
                              showforgotPasswordModal: false,
                              showOtpModal: false,
                              showNewPasswordModal: false,
                              showSignupCartModal: false
                            })
                          );
                        }
                      }}>Login to your account</p>
                    </div>
                  )}

                {!submitted && !orderData?.name && (
                  <div className="col-12 col-md-12 col-lg-6 card bg-white drop-shadow-lg shadow-lg  p-10">
                    <h1 className="!text-xl  lg:!text-4xl  text-center ">
                      <b>Track your</b> order
                    </h1>
                    <div className="flex justify-center w-full">
                      <div className="form-control-wrap hover:drop-shadow-lg w-[100%]  mt-3">
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          id="fullWidth"
                        />
                        <p className="text-red-600 text-xs font-semibold !inline">
                          {emailErr}
                        </p>
                      </div>
                    </div>
                    <div className="form-control-wrap hover:drop-shadow-lg w-[100%]  mt-3">
                      <TextField
                        value={orderNo}
                        onChange={(e) => handleOrderNoChange(e.target.value)}
                        className=""
                        fullWidth
                        label="Order No"
                        variant="outlined"
                      />
                      <p
                        className="text-red-600 text-xs font-semibold !inline"
                        style={
                          orderNoErr
                            ? { visibility: "visible" }
                            : { visibility: "hidden" }
                        }
                      >
                        {orderNoErr}
                      </p>
                    </div>
                    <Button
                      className="mt-5 p-3"
                      variant="contained"
                      onClick={handleSubmit}
                    >
                      Track Order
                    </Button>
                    {apiErr && (
                      <p className="text-red-600 font-bold !text-sm">
                        {apiErr}
                      </p>
                    )}
                  </div>
                )}
                {submitted && orderData == null && (
                  <div className="p-10 col-12 col-md-6 ">
                    <div className="flex justify-center">
                      <img
                        src="/images/orderNotFound.png"
                        className="!w-[34%]"
                        alt="ord_not_found"
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      <Button
                        onClick={() => {
                          setSubmitted(false);
                        }}
                        variant="outlined"
                        startIcon={<CompareArrowsIcon className="!w-[18px]" />}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* {submitted && <div className="card w-full drop-shadow-lg shadow-lg text-center">
                    <p className="capitalize font-semibold text-lg text-center hover:drop-shadow-xl">Order number not found</p>
                </div>} */}
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
