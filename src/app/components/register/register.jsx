import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import { updateUsers } from "../../../features/users/userSlice";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import { loginUser } from "../../../features/login/loginSlice";
import { Form } from "react-bootstrap";
import { updateclientType } from "../../../features/clientType/clientType";
import Alert from "@mui/material/Alert";

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

  const loginStatus = useSelector((state) => state?.login?.value);
  const loaderState = useSelector((state) => state.loader?.value);
  console.log(loginStatus);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLang = useSelector((state) => state?.lang?.value);

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
      setPhoneError("Invalid Phone number");
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
    setEmail(e?.target?.value);
    emailValidaiton(e?.target?.value);
  }

  function handlePhoneChange(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    setPhone(e?.target?.value);
    phoneValidation(e?.target?.value);
  }

  function handleFirstNamechange(e) {
    setFirstName(e?.target?.value);
    firstNameVerification(e?.target?.value);
  }

  function handleLastNameChange(e) {
    setLastName(e?.target?.value);
    lastNameVerification(e?.target?.value);
  }

  async function handleFormSubmission() {
    setApiError([]);
    setSignupSuccessMsg("");
    console.log(email, firstName, lastName, phone);
    firstNameVerification(firstName);
    lastNameVerification(lastName);
    emailValidaiton(email);
    phoneValidation(phone);
    // console.log(emailError, phoneError, firstNameError)
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
          console.log(response?.data?.first_name);
          dispatch(
            updateUsers({
              first_name: response?.data?.first_name,
              last_name: response?.data?.last_name,
              cart_count: response?.data?.cart_count,
              wish_count: response?.data?.wish_count,
            })
          );
          dispatch(updateclientType(response?.data?.type));
          localStorage.setItem("client_type", response?.data?.type);
          dispatch(loginUser());
          navigate(`${userLang}/`);
          setTimeout(() => {
            localStorage.removeItem("token");
            dispatch(
              updateNotifications({
                type: "warning",
                message: "Oops!",
              })
            );
            navigate(`${userLang}/login`);
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

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <div className="nk-app-root !text-left">
        <main className="nk-pages">
          <div className="nk-split-page flex-column flex-xl-row">
            <div className="nk-split-col nk-auth-col">
              <div
                className="nk-form-card card rounded-3 card-gutter-md nk-auth-form-card mx-md-9 mx-xl-auto"
                style={{ opacity: "1 !important" }}
                data-aos="fade-up"
              >
                <div className="card-body p-5">
                  <div className="nk-form-card-head text-center pb-5">
                    <div className="form-logo mb-3 flex justify-center">
                      <a href={`${userLang}/`}>
                        <img
                          className="logo-img justify-center"
                          src="/images/tm-logo-1.webp"
                          alt="logo"
                        />
                      </a>
                    </div>
                    <h3
                      className="title mb-2 !font-bold"
                      style={{ fontSize: "2rem" }}
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
                  <Form>
                    <div className="row gy-4 !text-left">
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label">
                            First Name
                            <sup className="text-red-600 !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your first name"
                              onChange={handleFirstNamechange}
                            />
                            {firstNameError && (
                              <p className="nk-message-error text-xs">
                                {firstNameError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label">
                            Last Name
                            <sup className="text-red-600 !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your last name"
                              onChange={handleLastNameChange}
                            />
                            {lastNameError && (
                              <p className="nk-message-error text-xs">
                                {lastNameError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label">
                            Email
                            <sup className="text-red-600 !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your email"
                              onChange={handleEmailChange}
                            />
                            {emailError && (
                              <p className="nk-message-error text-xs">
                                {emailError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label">
                            Phone
                            <sup className="text-red-600 !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              id="show-hide-password"
                              type="text"
                              className="form-control"
                              placeholder="Enter your Mobile"
                              onChange={handlePhoneChange}
                            />
                            {phoneError && (
                              <p className="nk-message-error">{phoneError}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button
                            className="btn btn-block btn-primary"
                            type="button"
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
                                    className="nk-message-error text-xs"
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
            <div className="nk-split-col nk-auth-col nk-auth-col-content  bg-primary-gradient is-theme">
              <div className="nk-mask shape-33"></div>
              <div className="nk-auth-content mx-md-9 mx-xl-auto">
                <div className="nk-auth-content-inner">
                  <div className="media media-lg media-circle media-middle text-bg-cyan-200 mb-5">
                    <em className="icon ni ni-quote-left text-white"></em>
                  </div>
                  <h1 className="mb-5 !text-5xl !font-bold !leading-normal">
                    Join to all traders community
                  </h1>
                  <div className="nk-auth-quote ms-sm-5">
                    <div className="nk-auth-quote-inner">
                      <p className="small">
                        The trading materials is about to have a twist on forum
                        and community space for all who love to trade and make
                        their own living.
                      </p>
                      <div className="media-group align-items-center pt-3">
                        <div className="media media-md media-circle media-middle">
                          <img src="/images/avatar/a.webp" alt="avatar" />
                        </div>
                        <div className="media-text">
                          <div className="h5 mb-0 !font-bold">Founder</div>
                          <span className="small">3 months ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
