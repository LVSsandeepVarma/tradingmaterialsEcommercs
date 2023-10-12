import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../../features/login/loginSlice";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { updateUsers } from "../../../features/users/userSlice";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
// import { useTranslation } from "react-i18next";
import { userLanguage } from "../../../features/userLang/userLang";
import { updateclientType } from "../../../features/clientType/clientType";
import { Alert } from "@mui/material";

export default function Login() {
  // const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState([]);
  const [loginSuccessMsg, setLoginsuccessMsg] = useState("");
  const loginStatus = useSelector((state) => state?.login?.value);
  const loaderState = useSelector((state) => state.loader?.value);
  const [showPassword, setShowPassword] = useState(false);
  const [saveCredentials, setSavecredentials] = useState(false);
  console.log(loginStatus);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLang = useSelector((state) => state?.lang?.value);

  useEffect(() => {
    dispatch(hideLoader());
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("email") !== "" &&
      localStorage.getItem("phone") !== ""
    ) {
      setEmail(localStorage.getItem("email"));
      setPassword(localStorage.getItem("phone"));
      setSavecredentials(true);
    }
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

  function passwordValidation(password) {
    if (password?.length === 0) {
      setPasswordError("Password is required");
    } else if (password?.length <= 7 || password?.length > 15) {
      setPasswordError("Invalid password");
    } else {
      setPasswordError("");
    }
  }

  function handleEmailChange(e) {
    setEmail(e?.target?.value);
    emailValidaiton(e?.target?.value);
  }

  function handlePasswordChange(e) {
    setPassword(e?.target?.value);
    passwordValidation(e?.target?.value);
  }

  async function handleFormSubmission() {
    setApiError([]);
    setLoginsuccessMsg("");
    console.log(email, password);
    emailValidaiton(email);
    passwordValidation(password);
    if (
      emailError === "" &&
      passwordError === "" &&
      email !== "" &&
      password !== ""
    ) {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/auth/login",
          {
            email: email,
            password: password,
          }
        );
        if (response?.data?.status) {
          setLoginsuccessMsg(response?.data?.message);
          localStorage.removeItem("client_token");
          localStorage.setItem("client_token", response?.data?.token);
          // localStorage
          console.log(response?.data?.first_name);
          if (saveCredentials) {
            localStorage.setItem("email", email);
            localStorage.setItem("phone", password);
          }
          // } else {
          //   if (
          //     localStorage.getItem("email") &&
          //     localStorage.getItem("phone")
          //   ) {
          //     localStorage.removeItem("email");
          //     localStorage.removeItem("phone");
          //   }
          // }

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
          if (response?.data?.data?.type === "client") {
            navigate(
              `https://client.tradingmaterials.com/${localStorage.getItem(
                "client_token"
              )}`
            );
          } else {
            navigate(`${userLang}/profile`);
          }

          setTimeout(() => {
            localStorage.removeItem("token");
            dispatch(
              updateNotifications({
                type: "warning",
                message: "Oops!",
              })
            );
            navigate(`${userLang}/?login`);
          }, 3600);
        }
      } catch (err) {
        console.log("err", err);
        if (err?.response?.data?.errors) {
          // eslint-disable-next-line no-unsafe-optional-chaining
          setApiError([...Object?.values(err?.response?.data?.errors)]);
        } else {
          setApiError([err?.response?.data?.message]);
        }
        setTimeout(() => {
          setApiError([]);
          setLoginsuccessMsg("");
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
      <div className="nk-body !text-left">
        <div className="nk-body-root">
          <div className="nk-split-page flex-column flex-xl-row">
            <div className="nk-split-col nk-auth-col">
              <div
                className="nk-form-card card rounded-3 card-gutter-md nk-auth-form-card mx-md-9 mx-xl-auto"
                data-aos="fade-up"
              >
                <div className="card-body p-5">
                  <div className="nk-form-card-head !text-center pb-5">
                    <div className="flex w-full form-logo mb-3">
                      <a
                        className="w-full flex justify-center"
                        href={`${userLang}/`}
                      >
                        <img
                          className="logo-img justify-center"
                          src="/images/tm-logo-1.png"
                          alt="logo"
                        />
                      </a>
                    </div>
                    <h3
                      className="title mb-2 font-semibold !font-bold"
                      style={{ fontSize: "2rem" }}
                    >
                      Login to your account
                    </h3>
                    <p className="text">
                      Not a member yet?{" "}
                      <a
                        href={`${userLang}/signup`}
                        className="btn-link text-primary"
                      >
                        Sign Up
                      </a>
                      .
                    </p>
                  </div>
                  <Form>
                    <div className="row gy-4 !text-left">
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label ">
                            Email
                            <sup className="text-red-600 !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter your email"
                              value={email}
                              onChange={handleEmailChange}
                            />
                          </div>
                          {emailError && (
                            <p className="nk-message-error text-xs">
                              {emailError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label">
                            Password
                            <sup className="text-red-600 !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <a
                              // href="show-hide-password.html"
                              className="form-control-icon end password-toggle"
                              title="Toggle show/hide password"
                            >
                              <em
                                className={`on icon ni ${
                                  showPassword
                                    ? "ni-eye-off-fill"
                                    : "ni-eye-fill"
                                } text-primary`}
                                onClick={() => setShowPassword(!showPassword)}
                              ></em>
                              <em className="off icon ni ni-eye-off-fill text-primary"></em>
                            </a>
                            <input
                              id="show-hide-password"
                              type={showPassword ? "text" : "password"}
                              className="form-control"
                              placeholder="Enter your password"
                              onChange={handlePasswordChange}
                              value={password}
                            />
                          </div>
                        </div>
                        {passwordError && (
                          <p className="nk-message-error">{passwordError}</p>
                        )}
                      </div>
                      <div className="col-12">
                        <div className="d-flex flex-wrap align-items-center  justify-content-between text-center">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="rememberMe"
                              checked={saveCredentials}
                              onChange={() =>
                                setSavecredentials(!saveCredentials)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="rememberMe"
                            >
                              {" "}
                              Remember Me{" "}
                            </label>
                          </div>
                          <a
                            href={`${userLang}/reset-password/forgot-password`}
                            className="d-inline-block fs-16"
                          >
                            Forgot Password?
                          </a>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button
                            className="btn btn-block btn-primary"
                            type="button"
                            onClick={handleFormSubmission}
                          >
                            Login to Your Account
                          </button>
                          {loginSuccessMsg && (
                            <Alert
                              variant="outlined"
                              severity="success"
                              className="mt-2"
                            >
                              <p className="text-green-900 font-semibold">
                                {loginSuccessMsg}
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
                  {/* <!--<div className="pt-4 text-center">
                                <div className="small overline-title-sep"><span className="bg-white px-2 text-base">or login with</span></div>
                            </div>
                            <div className="pt-4"><a href="#" className="btn btn-outline-gray-50 text-dark w-100"><img src="/images/icon/a.png" alt="" className="icon"/><span>Login with Google</span></a></div>--> */}
                </div>
              </div>
            </div>
            <div className="nk-split-col nk-auth-col nk-auth-col-content  bg-primary-gradient is-theme">
              <div
                className="nk-mask shape-33"
                data-aos="fade-in"
                data-aos-delay="0"
              ></div>
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
                          <img src="/images/avatar/a.jpg" alt="avatar" />
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
        </div>
      </div>
    </>
  );
}
