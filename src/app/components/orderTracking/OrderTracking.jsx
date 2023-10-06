import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import Header from "../header/header";
import Footer from "../footer/footer";
import { Button, TextField } from "@mui/material";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

export default function OrderTacker() {
  const loaderState = useSelector((state) => state?.loader?.value);
  const [email, setEmail] = useState("");
  const [orderNo, setOrderNo] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [submitted, setSubmitted] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [orderNoErr, setOrderNoErr] = useState("");

  const dispatch = useDispatch();

  function emailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    if (email === "") {
      setEmailErr("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
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

  function handleSubmit() {
    dispatch(showLoader());
    emailValidaiton(email);
    orderNoValidation(orderNo);
    if (email != "" && orderNo != "" && emailErr == "" && orderNoErr == "") {
      setTimeout(() => {
        setSubmitted(true);
        setEmail("");
        setOrderNo("");
        dispatch(hideLoader());
      }, 500);
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

      <div className="nk-pages text-left mt-80 sm:mt-60 md:mt-40">
        <section className="nk-banner nk-banner-career-job-details bg-gray">
          <div className="nk-banner-wrap pt-120 pt-lg-80 pb-[100px]">
            <div className="container">
              <div className="row p-10">
                <div className="col-12 col-md-6 "> 
                <div className="w-full  ">
                  <p className="text-2xl text-center md: text-start">
                    Book and track orders anytime, anywhere
                  </p>
                  <div className="flex justify-center">
                    <img src="/images/delivery.png" alt="delvery" className="w-[44%] "/>
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
                {!submitted && (
                  <div className="col-12 col-md-6 card bg-white drop-shadow-lg shadow-lg  p-10">
                    <h1 className="text-4xl text-center">
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
                        <p className="text-red-600 text-xs font-semibold !inline" style={orderNoErr ? {visibility:"visible"} : { visibility:"hidden"}}>
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
                  </div>
                )}
                {submitted && (
                  <div className="p-10 col-12 col-md-6 ">
                    <div className="flex justify-center">
                      <img
                        src="/images/orderNotFound.png"
                        className="!w-[34%]"
                        alt="ord_not_found"
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      {/* <Button className="text-center" variant="outlined">Try Again</Button> */}
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

      <Footer />
    </>
  );
}
