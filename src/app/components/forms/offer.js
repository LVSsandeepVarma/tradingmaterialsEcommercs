import React, { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hidePopup } from "../../../features/popups/popusSlice";

export default function Offer() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [apiErr, setApiErr] = useState([]);
  const [userIp, setUserIp] = useState("");

  const loaderState = useSelector((state) => state?.loader?.value);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
  }, []);

  function emailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    if (email === "") {
      setEmailErr("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailErr("Invalid email");
    } else {
      setEmailErr("");
    }
  }

  // Validate mobile number function (example)
  const isValidMobile = (mobile) => {
    const phoneRegex = /^[0-9]+$/;
    if (mobile?.length === 0) {
      setPhoneErr("Phone number is required");
    } else if (!phoneRegex.test(mobile)) {
      setPhoneErr("Invalid Phone number");
    } else if (mobile?.length <= 7) {
      setPhoneErr("Phone number should be atleast 8 digits");
    } else if (mobile?.length > 15) {
      setPhoneErr("Phone number should be atmost 15 digits");
    } else {
      setPhoneErr("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e?.target?.value);
    emailValidaiton(e?.target?.value);
  };

  const handlePhonechange = (e) => {
    setPhone(e.target.value);
    isValidMobile(e.target.value);
  };

  const handleSubmit = async (e) => {
    setApiErr([]);
    e.preventDefault();
    isValidMobile(phone);
    emailValidaiton(email);
    if (
      emailErr === "" &&
      email !== "" &&
      phoneErr === "" &&
      phone !== "" &&
      apiErr?.length === 0
    ) {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/discount/store",
          {
            email: email,
            phone: phone,
            domain: window.location.href.split("https://")[1],
            ip_add: userIp,
          },
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          setSuccessMsg(response?.data?.message);
          setTimeout(() => {
            dispatch(hidePopup());
          }, 2000);
        }
      } catch (err) {
        if (err?.response?.data?.errors) {
          setEmailErr(err?.response?.data?.errors["email"]);
          setPhoneErr(err?.response?.data?.errors["phone"]);
        } else {
          setApiErr([err?.response?.data?.message]);
        }
      } finally {
        dispatch(hideLoader());
      }
    }
  };

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <form className="form-group w-[100%]">
        <input
          className="form-control !border-b-1 !text-white !border-white  bg-transparent hover:dorp-shadow-lg  mb-2 !placeholder-white w-full"
          style={{
            border: "0px",
            borderBottom: "1px solid white",
            borderRadius: 0,
          }}
          placeholder="Email"
          onChange={handleEmailChange}
        />
        {emailErr && (
          <p className="text-red-700 font-semibold mb-1 mt-1 text-left">
            {emailErr}
          </p>
        )}

        <input
          className="form-control border-b-1 !text-white border-white bg-transparent hover:drop-shadow-lg mb-2 placeholder-white w-full "
          placeholder="Mobile "
          onChange={handlePhonechange}
          style={{
            border: "0px",
            borderBottom: "1px solid white",
            borderRadius: 0,
          }}
        />
        {phoneErr && (
          <p className="text-red-700 font-semibold mb-1 text-sm  text-left">
            {phoneErr}
          </p>
        )}

        {successMsg?.length > 0 && (
          <p className="text-green-900 text-sm font-semibold">{successMsg}</p>
        )}
        {apiErr?.length > 0 &&
          apiErr?.map((err, ind) => {
            return (
              <p
                key={ind}
                className="text-red-600 text-sm font-semibold text-sm"
              >
                {err}
              </p>
            );
          })}
        <div className="">
          <div className="buttonss-off cursor-pointer">
            <a className="cart-btn" onClick={handleSubmit}>
              Sign Up
            </a>
          </div>
        </div>
      </form>
    </>
  );
}
