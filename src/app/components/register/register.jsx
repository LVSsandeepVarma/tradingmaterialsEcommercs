import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import { updateUsers } from "../../../features/users/userSlice";
import { loginUser } from "../../../features/login/loginSlice";
import { Form } from "react-bootstrap";
import { updateclientType } from "../../../features/clientType/clientType";
import Alert from "@mui/material/Alert";
import { SlQuestion } from "react-icons/sl";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [apiError, setApiError] = useState([]);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState("");
  const [useriP, setUserIp] = useState("");

  const loaderState = useSelector((state) => state.loader?.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLang = useSelector((state) => state?.lang?.value);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
  }, []);

  useEffect(() => {
    const lang = localStorage?.getItem("i18nextLng");
    console.log("lang", lang, userLang);
    if (lang === "/ms" || location.pathname.includes("/ms")) {
      dispatch(userLanguage("/ms"));
    } else {
      dispatch(userLanguage(""));
    }
  }, []);

  function emailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    if (email === "") {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  }
  function phoneValidation(phone) {
    const phoneRegex = /^[0-9]+$/;
    if (phone?.length === 0) {
      setPhoneError("Phone number is required");
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("Invalid phone number");
    } else if (phone?.length <= 7) {
      setPhoneError("Phone number should contain 8 - 15 digits only");
    } else if (phone?.length > 15) {
      setPhoneError("Phone number should contain 8 - 15 digits only");
    } else {
      setPhoneError("");
    }
  }

  function firstNameVerification(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      setFirstNameError("First name is required");
    } else if (!namePattern.test(name)) {
      setFirstNameError("First name should contain only alphabets");
    } else if (name?.length < 3) {
      setFirstNameError("Min 3 characters are required");
    } else if (name?.length > 50) {
      setFirstNameError("Maximum limit exceeded");
    } else {
      setFirstNameError("");
    }
  }

  function lastNameVerification(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      setLastNameError("Last name is required");
    } else if (!namePattern.test(name)) {
      setLastNameError("Last name should contain only alphabets");
    } else if (name?.length < 1) {
      setLastNameError("Last name is required");
    } else if (name?.length > 50) {
      setLastNameError("Maximum limit exceeded");
    } else {
      setLastNameError("");
    }
  }
  function handleEmailChange(e) {
    e.target.value = e.target.value.trim();
    setEmail(e?.target?.value);
    emailValidaiton(e?.target?.value);
  }

  function handlePhoneChange(e) {
    e.target.value = e.target.value.trim();
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    setPhone(e?.target?.value);
    phoneValidation(e?.target?.value);
  }

  function handleFirstNamechange(e) {
    e.target.value = e.target.value.trimStart();
    e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, "");
    setFirstName(e?.target?.value);
    firstNameVerification(e?.target?.value);
  }

  function handleLastNameChange(e) {
    e.target.value = e.target.value.trimStart();
    e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, "");
    setLastName(e?.target?.value);
    lastNameVerification(e?.target?.value);
  }

  async function handleFormSubmission(e) {
    e.preventDefault();
    setApiError([]);
    setSignupSuccessMsg("");
    firstNameVerification(firstName);
    lastNameVerification(lastName);
    emailValidaiton(email);
    phoneValidation(phone);

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
      emailError === "" &&
      phoneError === "" &&
      firstNameError === "" &&
      lastNameError === ""
    ) {
      if (
        (emailError === "" &&
          phoneError === "" &&
          firstNameError === "" &&
          lastNameError === "" &&
          email !== "" &&
          phone !== "",
        firstName !== "" && lastName !== "")
      ) {
        try {
          dispatch(showLoader());
          const response = await axios.post(
            "https://admin.tradingmaterials.com/api/client/store",
            {
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone: phone,
              domain: "www.tradingmaterials.com",
              ip_add: useriP,
            },
            {
              headers: {
                "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
                Accept: "application/json",
              },
            }
          );
          if (response?.data?.status) {
            setSignupSuccessMsg(response?.data?.message);
            localStorage.setItem("client_token", response?.data?.token);
            localStorage.setItem("client_type", "lead");
            console.log(response?.data?.first_name);
            dispatch(
              updateUsers({
                first_name: response?.data?.first_name,
                last_name: response?.data?.last_name,
                cart_count: response?.data?.cart_count,
                wish_count: response?.data?.wish_count,
              })
            );
            dispatch(loginUser());
            dispatch(updateclientType("lead"));

            navigate(`${userLang}/`);

            setTimeout(() => {
              localStorage.removeItem("token");
              navigate(`/login`);
            }, 3600000);
          }
        } catch (err) {
          console.log("err", err);
          if (err?.response?.data?.errors) {
            setEmailError(err?.response?.data?.errors["email"]);
            setFirstNameError(err?.response?.data?.errors["first_name"]);
            setLastNameError(err?.response?.data?.errors["last_name"]);
            setPhoneError(err?.response?.data?.errors["phone"]);
            // setApiError([...Object?.values(err?.response?.data?.errors)]);
          } else {
            setApiError([err?.response?.data?.message]);
          }
          setTimeout(() => {
            setApiError([]);
            setSignupSuccessMsg("");
          }, 8000);
        } finally {
          dispatch(hideLoader());
        }
      }
    }
  }

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <div className="nk-app-root !text-left">
        <main className="nk-pages gradient-bg flex flex-col justify-between min-h-[100vh]">
          <div className="flex justify-between items-center p-2 !w-full">
            <img
              className="cursor-pointer"
              onClick={() => (window.location.href = "/")}
              src="/images/tm-logo-1.webp"
              alt="trading_materials_logo"
            />
            {/* <p className="text-sm text-right">
              New to Trading Materials?{" "}
              <a
                className="underline hover:text-blue-600"
                href="https://tradingmaterials.com/signup"
              >
                Create a new account
              </a>
            </p> */}
          </div>
          <>
            <div className="flex justify-center items-center mx-4 md:px-0">
              <div
                className="nk-form-card !bg-[#fffff] card rounded-4 card-gutter-md nk-auth-form-card min-w-[100%] max-w-[100%] sm:min-w-[500px] sm:max-w-[500px] "
                data-aos="fade-up"
              >
                <div className="card-body  !p-7">
                  <div className="nk-form-card-head !text-center pb-5">
                    <h3
                      className="title mb-2 !font-bold"
                      style={{ fontSize: "24px" }}
                    >
                      Sign up to your account
                    </h3>
                    <p className="text">
                      Already a member?{" "}
                      <a
                        href={`${userLang}/login`}
                        className="btn-link text-primary"
                      >
                        Login
                      </a>
                      .
                    </p>
                  </div>
                  <Form onSubmit={handleFormSubmission}>
                    <div className="row gy-2 !text-left">
                      <div className="col-12 mt-0">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            First Name
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              className="form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]"
                              placeholder="Enter your first name"
                              onChange={handleFirstNamechange}
                            />
                            {firstNameError && (
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
                                {firstNameError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Last Name
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              className="form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]"
                              placeholder="Enter your last name"
                              onChange={handleLastNameChange}
                            />
                            {lastNameError && (
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
                                {lastNameError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Email
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              className="form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]"
                              placeholder="Enter your email"
                              onChange={handleEmailChange}
                            />
                            {emailError && (
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
                                {emailError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Phone
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              id="show-hide-password"
                              type="text"
                              maxLength={15}
                              className="form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]"
                              placeholder="Enter your Mobile"
                              onChange={handlePhoneChange}
                            />
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
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button
                            disabled={
                              !firstName || !lastName || !email || !phone
                            }
                            className="btn btn-block btn-primary text-s"
                            type="submit"
                            onClick={handleFormSubmission}
                          >
                            Sign Up to Your Account
                          </button>
                          {signupSuccessMsg && (
                            <Alert
                              variant="outlined"
                              severity="success"
                              className="mt-2"
                              // className="mt-2"
                            >
                              <p className="text-green-900 !text-center font-semibold">
                                {signupSuccessMsg}
                              </p>
                            </Alert>
                          )}

                          {apiError?.length > 0 &&
                            apiError?.map((err, ind) => {
                              return (
                                <Alert
                                  key={ind}
                                  variant="outlined"
                                  severity="error"
                                  className="mt-2"
                                >
                                  <p
                                    key={ind}
                                    className="text-[#fb3048] font-normal !text-xs !px-3 flex items-center gap-1"
                                  >
                                    {err}
                                  </p>
                                </Alert>
                              );
                            })}
                        </div>
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
                (window.location.href = "https://tradingmaterials.com/contact")
              }
            >
              <SlQuestion /> Contact us
            </span>
            <span></span>
          </div>
        </main>
        <a
          href="#"
          className="scroll-top shadow animate animate-infinite animate-pulse animate-duration-2"
        >
          <em className="icon ni ni-chevrons-up"></em>
        </a>
      </div>
    </>
  );
}
