/* eslint-disable no-unsafe-optional-chaining */
import React, { useState } from "react"
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
// import config from './config.js';
// import MessageParser from './messageParser.js';
// import ActionProvider from './actionProvide.js';
// import Chatbot from 'react-chatbot-kit';
// import 'react-chatbot-kit/build/main.css';


export default function ChatForm(){
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [apiErr, setApiErr] = useState([])

  const dispatch = useDispatch()

  function emailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
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
    emailValidaiton(email);
  };

  const handlePhonechange = (e) => {
    setPhone(e.target.value)
    isValidMobile(e.target.value)
  }


  const handleSubmit = async (e) => {
    setApiErr([])
    e.preventDefault();
    isValidMobile(phone);
    emailValidaiton(email);
    console.log(emailErr , phoneErr)
    if (emailErr === "" && email!== "" && phoneErr === "" && phone !== "" && apiErr?.length === 0) {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/discount/store",
          { email: email, phone: phone },
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          setSuccessMsg(response?.data?.message);
          
        }
      } catch (err) {
        console.log(err?.response?.data?.errors);
        if (err?.response?.data?.errors) {
          setEmailErr(err?.response?.data?.errors["email"])
          setPhoneErr(err?.response?.data?.errors["phone"])
          // setApiErr([...Object.values(err?.response?.data?.errors)]);
        } else {
          setApiErr([err?.response?.data?.message]);
        }
      } finally {
        dispatch(hideLoader());
      }
    }
    // Handle form submission here, e.g., send data to server
    console.log("Message:", email, phone);
  };
  return (
    <>
      <div className="fixed bottom-12 right-0 m-4 bg-white rounded-lg shadow-lg w-80">
        <div className="p-4">
  
              <div className="text-black">
                <div className="flex items-center mb-2 !text-black">
                  <div className="w-8 h-8  rounded-full flex items-center justify-center mr-2"><img src="/images/oneDayLeft.png" /></div>
                  Trading Materials
                </div>
                Get your promo code from our executive.
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Your email"
                  className="w-full px-3 py-2 border-b border-gray-800 rounded focus:outline-none focus:ring focus:border-blue-300 placeholder-black"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailErr && <p className="text-red-700 font-semibold mb-1 mt-1 text-left">{emailErr}</p>}
              </div>
              <div className="mt-2">
                <input
                  type="number"
                  placeholder="Mobile"
                  className="w-full px-3 py-2 border-b border-gray-800 rounded focus:outline-none focus:ring focus:border-blue-300 placeholder-black"
                  value={phone}
                  onChange={handlePhonechange}
                />
                {phoneErr && <p className="text-red-700 font-semibold mb1 mt-1 text-left">{phoneErr}</p>}
              </div>
              <button
                onClick={handleSubmit}
                className="mt-2 px-4 py-2 !bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Sign Up
              </button>
              {successMsg?.length >0 && <p className="text-green-600 font-semibold">{successMsg}</p>}
              {apiErr?.length > 0 &&
                            apiErr?.map((err, ind) => {
                              return (

                                  <p
                                    key={ind}
                                    className="text-red-600 font-semibold"
                                  >
                                    {err}
                                  </p>
                              );
                            })}
              </div>
              </div>
    </>
  );
}


      {/* <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      /> */}