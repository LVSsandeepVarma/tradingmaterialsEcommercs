import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";

import { SlQuestion } from "react-icons/sl";


export default function LoginContactUs() {
 const dispatch = useDispatch();
 const loaderState = useSelector((state) => state?.loader?.value);

 const [name, setName] = useState("");
 const [nameErr, setNameErr] = useState("");
 const [email, setEmail] = useState("");
 const [emailErr, setEmailErr] = useState("");
 const [phone, setPhone] = useState("");
 const [phoneError, setPhoneError] = useState("");
 const [desc, setDesc] = useState("");
 const [descErr, setDescErr] = useState("");
 const [successMsg, setSuccessMsg] = useState("");
 const [apiErr, setApiErr] = useState("");
 const [userIp, setUserIp] = useState("");

 useEffect(() => {
   fetch("https://api.ipify.org?format=json")
     .then((response) => response.json())
     .then((data) => setUserIp(data.ip));
 }, []);

 function validName(name) {
   const namePattern = /^[A-Za-z ]+$/;
   if (name === "") {
     setNameErr("Full name is required");
     return false;
   } else if (!namePattern.test(name)) {
     setNameErr("Full name should contain only alphabets");
     return false;
   } else if (name?.length < 3) {
     setNameErr("Min 3 characters are required");
   } else if (name?.length > 100) {
     setNameErr("Max 100 characters are allowed");
   } else {
     setNameErr("");
     return true;
   }
 }

 function validEmail(email) {
   const emailPattern = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
   if (email === "") {
     setEmailErr("Email is required");
     return false;
   } else if (emailPattern.test(email)) {
     setEmailErr("");
     return true;
   } else {
     setEmailErr("Invalid email format");
     return false;
   }
 }

 function phoneValidation(phone) {
   const phoneRegex = /^[0-9]+$/;
   if (phone?.length === 0) {
     setPhoneError("Phone number is required");
     return false;
   } else if (!phoneRegex.test(phone)) {
     setPhoneError("Invalid phone number");
     return false;
   } else if (phone?.length <= 7) {
     setPhoneError("Phone number should contain 8 - 15 digits only");
     return false;
   } else if (phone?.length > 15) {
     setPhoneError("Phone number should contain 8 - 15 digits only");
     return false;
   } else {
     setPhoneError("");
     return true;
   }
 }

 function descValidation(desc) {
   if (desc?.length === 0) {
     setDescErr("Description is required");
     return false;
   } else if (desc?.length > 255) {
     setDescErr("Description should contain maximum 255 characters only");
   } else {
     setDescErr("");
     return true;
   }
 }

 function handleNameChange(e) {
   e.target.value = e.target.value.trimStart();
   setName(e.target.value);
   validName(e.target.value);
 }
 function handleEmailChange(e) {
   e.target.value = e.target.value.trim();
   setEmail(e.target.value);
   validEmail(e.target.value);
 }
 function handlePhoneChange(e) {
   e.target.value = e.target.value.trim();
   e.target.value = e.target.value.replace(/[^0-9]/g, "");
   setPhone(e.target.value);
   phoneValidation(e.target.value);
 }
 function handleDescChange(e) {
   e.target.value = e.target.value.trimStart();
   setDesc(e.target.value);
   descValidation(e.target.value);
 }

 async function handlesubmit(e) {
   console.log(userIp, "ip");
   e.preventDefault();
   validName(name);
   validEmail(email);
   phoneValidation(phone);
   descValidation(desc);

   const currentUrl = window?.location?.href;
   let updatedUrl;

   if (
     currentUrl &&
     (currentUrl.startsWith("http://") || currentUrl.startsWith("https://"))
   ) {
     // Replace "http://" or "https://" with "www."
     updatedUrl = currentUrl.replace(/^(https?:\/\/)/, "www.");

     // Now, `updatedUrl` contains the modified URL with "www."
     console.log(updatedUrl);
   } else {
     // The URL didn't start with "http://" or "https://"
     updatedUrl = currentUrl;
   }

   if (
     nameErr === "" &&
     name !== "" &&
     emailErr === "" &&
     email !== "" &&
     phoneError === "" &&
     phone !== "" &&
     descErr === "" &&
     desc !== ""
   ) {
     try {
       dispatch(showLoader());
       const response = await axios.post(
         "https://admin.tradingmaterials.com/api/store/contact-us",
         {
           email: email,
           phone: phone,
           name: name,
           message: desc,
           ip_address: userIp,
           domain: "www.tradingmaterials.com",
         }
       );
       if (response?.data?.status) {
         setSuccessMsg(response?.data?.message);
         setTimeout(() => {
           window.location.reload();
         }, 2000);
       }
     } catch (err) {
       if (err?.response?.data?.errors) {
         setEmailErr(err?.response?.data?.errors["email"]);
         setPhoneError(err?.response?.data?.errors["phone"]);
         setNameErr(err?.response?.data?.errors["name"]);
         setDescErr(err?.response?.data?.errors["message"]);
       } else {
         setApiErr([err?.response?.data?.message]);
       }
     } finally {
       dispatch(hideLoader());
     }
   }
 }

 useEffect(() => {
   dispatch(hideLoader);
 }, []);

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <div className="nk-body !text-left">
        <div className="nk-body-root gradient-bg flex flex-col justify-between min-h-[100vh]">
          <div className="flex justify-between items-center p-2 !w-full">
            <img
              className="cursor-pointer"
              onClick={() => (window.location.href = "/")}
              src="/images/tm-logo-1.webp"
              alt="trading_materials_logo"
            />
            <p className="text-sm text-right">
              New to Trading Materials?{" "}
              <a
                className="underline hover:text-blue-600"
                href="https://tradingmaterials.com/signup"
              >
                Create a new account
              </a>
            </p>
          </div>
          <>
            <div className="p-3  mx-auto md:px-0">
              <div
                className=" nk-form-card !bg-[#fffff] card rounded-4 card-gutter-md nk-auth-form-card min-w-[100%] max-w-[100%] sm:min-w-[600px] sm:max-w-[600px]"
                // data-aos="fade-up"
              >
                <div className="card-body  !p-7">
                  <div className="nk-form-card-head !text-center pb-5">
                    <h3
                      className="title mb-2 !font-bold"
                      style={{ fontSize: "24px" }}
                    >
                      Contact Support
                    </h3>
                    <small className="text-center text-sm">
                      Reach out for personalized assistance. Our team is here to
                      provide tailored solutions to meet your needs.
                    </small>
                  </div>
                  <Form className="form-submit-init" onSubmit={handlesubmit}>
                    <div className="row g-gs !text-left">
                      <div className="col-12 ">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Full Name{" "}
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              className={`form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]`}
                              placeholder="Enter your name"
                              value={name}
                              onChange={handleNameChange}
                            />
                          </div>
                          {nameErr && (
                            <p className="text-[#fb3048] font-normal !text-xs !px-3 flex items-center gap-1">
                              <svg
                                data-v-059cda41=""
                                data-v-4b5d7b40=""
                                viewBox="0 0 24 24"
                                className="sc-icon sc-icon_16 sc-validation-message__icon w-4 h-4"
                                style={{ fill: "#fb3048" }}
                              >
                                <path d="M20.4 16 14.3 5.4a2.6 2.6 0 0 0-4.6 0L3.6 16c-1 1.8.3 4 2.3 4h12.2c2-.1 3.3-2.3 2.3-4zm-9.5-6.4c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1v2.9c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1V9.6zm1.1 7.8c-.6 0-1.2-.5-1.2-1.2S11.4 15 12 15s1.2.5 1.2 1.2-.6 1.2-1.2 1.2z"></path>
                              </svg>
                              {nameErr}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 mt-1">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Email{" "}
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="email"
                              className={`form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]`}
                              placeholder="Enter your email"
                              value={email}
                              onChange={handleEmailChange}
                            />
                          </div>
                          {emailErr && (
                            <p className="text-[#fb3048] font-normal !text-xs !px-3 flex items-center gap-1">
                              <svg
                                data-v-059cda41=""
                                data-v-4b5d7b40=""
                                viewBox="0 0 24 24"
                                className="sc-icon sc-icon_16 sc-validation-message__icon w-4 h-4"
                                style={{ fill: "#fb3048" }}
                              >
                                <path d="M20.4 16 14.3 5.4a2.6 2.6 0 0 0-4.6 0L3.6 16c-1 1.8.3 4 2.3 4h12.2c2-.1 3.3-2.3 2.3-4zm-9.5-6.4c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1v2.9c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1V9.6zm1.1 7.8c-.6 0-1.2-.5-1.2-1.2S11.4 15 12 15s1.2.5 1.2 1.2-.6 1.2-1.2 1.2z"></path>
                              </svg>
                              {emailErr}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 mt-1">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Phone{" "}
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              className={`form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]`}
                              placeholder="mobile number"
                              value={phone}
                              onChange={handlePhoneChange}
                            />
                          </div>
                          {phoneError && (
                            <p className="text-[#fb3048] font-normal !text-xs !px-3 flex items-center gap-1">
                              <svg
                                data-v-059cda41=""
                                data-v-4b5d7b40=""
                                viewBox="0 0 24 24"
                                className="sc-icon sc-icon_16 sc-validation-message__icon w-4 h-4"
                                style={{ fill: "#fb3048" }}
                              >
                                <path d="M20.4 16 14.3 5.4a2.6 2.6 0 0 0-4.6 0L3.6 16c-1 1.8.3 4 2.3 4h12.2c2-.1 3.3-2.3 2.3-4zm-9.5-6.4c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1v2.9c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1V9.6zm1.1 7.8c-.6 0-1.2-.5-1.2-1.2S11.4 15 12 15s1.2.5 1.2 1.2-.6 1.2-1.2 1.2z"></path>
                              </svg>
                              {phoneError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 mt-1">
                        <div className="form-group">
                          {/* <div className="form-label-group"> */}
                          <label className="form-label text-sm !mb-1 font-normal">
                            Tell us a bit about your query{" "}
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
                          <span className=" float-right">
                            <span id="char-count">{desc?.length}</span>/{" "}
                            <span id="char-max" data-char-max="255">
                              255
                            </span>
                          </span>
                          {/* </div> */}
                          <div className="form-control-wrap">
                            <textarea
                              id="textarea-box"
                              className={`form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]`}
                              placeholder="Enter your message"
                              value={desc}
                              onChange={handleDescChange}
                            ></textarea>
                          </div>
                          {descErr && (
                            <p className="text-[#fb3048] font-normal !text-xs !px-3 flex items-center gap-1">
                              <svg
                                data-v-059cda41=""
                                data-v-4b5d7b40=""
                                viewBox="0 0 24 24"
                                className="sc-icon sc-icon_16 sc-validation-message__icon w-4 h-4"
                                style={{ fill: "#fb3048" }}
                              >
                                <path d="M20.4 16 14.3 5.4a2.6 2.6 0 0 0-4.6 0L3.6 16c-1 1.8.3 4 2.3 4h12.2c2-.1 3.3-2.3 2.3-4zm-9.5-6.4c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1v2.9c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1V9.6zm1.1 7.8c-.6 0-1.2-.5-1.2-1.2S11.4 15 12 15s1.2.5 1.2 1.2-.6 1.2-1.2 1.2z"></path>
                              </svg>
                              {descErr}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button
                            className="btn btn-primary"
                            type="submit"
                            onSubmit={handlesubmit}
                          >
                            Send Message
                          </button>
                        </div>
                        {successMsg?.length > 0 && (
                          <p className="text-green-900 mt-2 text-center font-semibold">
                            {successMsg}
                          </p>
                        )}
                        {apiErr?.length > 0 &&
                          apiErr?.map((err, ind) => {
                            return (
                              <p key={ind} className="nk-message-error text-xs">
                                {err}
                              </p>
                            );
                          })}
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </>

          <div className="flex justify-start gap-5 mx-3 py-3 items-center">
            <span
              className="flex items-center gap-1 cursor-pointer hover:text-blue-600 !font-bold"
              onClick={() =>
                (window.location.href = "/contactus")
              }
            >
              <SlQuestion /> Contact us
            </span>
            <span></span>
          </div>
        </div>
      </div>
    </>
  );
}
