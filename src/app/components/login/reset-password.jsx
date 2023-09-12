/* eslint-disable no-unsafe-optional-chaining */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// import { loginUser } from "../../../features/login/loginSlice";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
// import { updateUsers } from "../../../features/users/userSlice";
// import { updateNotifications } from "../../../features/notifications/notificationSlice";
// import { useTranslation } from "react-i18next";
import { userLanguage } from "../../../features/userLang/userLang";
// import { updateclientType } from "../../../features/clientType/clientType";
import { Alert } from "@mui/material";
import { Helmet } from "react-helmet-async";

export default function NewPassword() {
  // const { t } = useTranslation();

  const [confirmPassword, setconfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasswordError, setconfirmPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState([]);
  const [loginSuccessMsg, setLoginsuccessMsg] = useState("");
  const loginStatus = useSelector((state) => state?.login?.value);
  const loaderState = useSelector((state) => state.loader?.value);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  console.log(loginStatus);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLang = useSelector((state) => state?.lang?.value);

  const url = location.search;
  console.log(url);

  useEffect(() => {
    const lang = localStorage?.getItem("i18nextLng");
    console.log("lang", lang, userLang);
    
    if (lang === "/ms" || location.pathname.includes("/ms")) {
      dispatch(userLanguage("/ms"));
      
    } else {
      dispatch(userLanguage(""));
     
    }
  }, []);

  function confirmPasswordValidaiton(confirmPassword) {
    // const confirmPasswordRegex =
    //   /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (confirmPassword?.length === 0) {
      setconfirmPasswordError("confirm Password is required");
    } else if (confirmPassword !== password) {
      setconfirmPasswordError("password and confirm password does not match");
    } else {
      setconfirmPasswordError("");
    }
  }

  function passwordValidation(password) {
    if (password?.length === 0) {
      setPasswordError("Password is required");
    } else if (password?.length <= 5) {
      setPasswordError("password is Too short");
    } else if (password?.length <= 7 && password?.length > 5) {
      setPasswordError("min 8 digits required");
    } else if (confirmPassword != "" && confirmPassword !== password) {
      setconfirmPasswordError("password and confirm password does not match");
    } else {
      setPasswordError("");
    }
  }

  function handleconfirmPasswordChange(e) {
    setconfirmPassword(e?.target?.value);
    confirmPasswordValidaiton(e?.target?.value);
  }

  function handlePasswordChange(e) {
    setPassword(e?.target?.value);
    passwordValidation(e?.target?.value);
  }

  async function handleFormSubmission() {
    setApiError([]);
    setLoginsuccessMsg("");
    console.log(confirmPassword, password);
    confirmPasswordValidaiton(confirmPassword);
    passwordValidation(password);
    // if (
    //   confirmPasswordError === "" &&
    //   passwordError === "" &&
    //   confirmPassword !== "" &&
    //   password !== ""
    // ) {
    try {
      dispatch(showLoader());
      const url = location.hash;
      console.log(url);
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/lead/reset/password",
        {
          confirm_password: confirmPassword,
          password: password,
          hash: localStorage.getItem("passHash"),
        }
      );
      if (response?.data?.status) {
        localStorage.removeItem("passHash");
        setLoginsuccessMsg(response?.data?.message);
        //   localStorage.removeItem("client_token");
        //   localStorage.setItem("client_token", response?.data?.token);
        //   // localStorage
        //   console.log(response?.data?.first_name);
        //   dispatch(
        //     updateUsers({
        //       first_name: response?.data?.first_name,
        //       last_name: response?.data?.last_name,
        //       cart_count: response?.data?.cart_count,
        //       wish_count: response?.data?.wish_count,
        //     })
        //   );
        //   dispatch(updateclientType(response?.data?.type));
        //   localStorage.setItem("client_type", response?.data?.type);
        //   dispatch(loginUser());
        //   if (response?.data?.data?.type === "client") {
        //     navigate(`https://client.tradingmaterials.com/dashboard/`);
        //   } else {
        //     navigate(`${userLang}/profile`);
        //   }

        //   setTimeout(() => {
        //     localStorage.removeItem("token");
        //     dispatch(
        //       updateNotifications({
        //         type: "warning",
        //         message: "Session expired, Login again.",
        //       })
        //     );
        setTimeout(() => {
          navigate(`${userLang}/login`);
        }, 2000);

        //   }, 3600000);
      } else {
        console.log(response?.data);
        setApiError([...Object?.values(response?.data?.errors)]);
      }
    } catch (err) {
      console.log("err", err);
      if (err?.response?.data?.errors) {
        console.log(err?.response?.data?.errors);
        setPasswordError([
          ...Object?.values(err?.response?.data?.errors["password"]),
        ]);
        setconfirmPasswordError([
          ...Object?.values(err?.response?.data?.errors["confirm_password"]),
        ]);
      } else {
        setApiError([err?.response?.data?.message]);
      }
    } finally {
      dispatch(hideLoader());
    }
    // }
  }

  return (
    <>
      <Helmet>
        <meta name="no-back-button" content="true" />
      </Helmet>
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
                // data-aos="fade-up"
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
                      Reset Password
                    </h3>
                  </div>
                  <Form>
                    <div className="row gy-4 !text-left">
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label">Password</label>
                          <div className="form-control-wrap">
                            <a
                              // href="show-hide-password.html"
                              className="form-control-icon end password-toggle"
                              title="Toggle show/hide password"
                            >
                              <em
                                className={`on icon ni cursor-pointer ${
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
                            />
                          </div>
                          {passwordError && (
                            <p className="text-red-600 font-semibold">
                              {passwordError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label ">
                            Confirm Password
                          </label>
                          <div className="form-control-wrap">
                            <a
                              // href="show-hide-password.html"
                              className="form-control-icon end password-toggle"
                              title="Toggle show/hide password"
                            >
                              <em
                                className={`on icon ni cursor-pointer ${
                                  showConfirmPassword
                                    ? "ni-eye-off-fill"
                                    : "ni-eye-fill"
                                } text-primary`}
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              ></em>
                              {/* <em className="off icon ni ni-eye-off-fill text-primary"></em> */}
                            </a>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="form-control"
                              placeholder="Enter confirm Password"
                              onChange={handleconfirmPasswordChange}
                            />
                          </div>
                          {confirmPasswordError && (
                            <Alert variant="outlined" severity="error">
                              <p className="text-red-600 font-semibold">
                                {confirmPasswordError}
                              </p>
                            </Alert>
                          )}
                        </div>
                      </div>
                      {/* <div className="col-12">
                        <div className="d-flex flex-wrap align-items-center  justify-content-between text-center">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="rememberMe"
                            />
                            <label
                              className="form-check-label"
                              for="rememberMe"
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
                      </div> */}
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
                                    className="text-red-600 font-semibold"
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
                    We’re building a better application now
                  </h1>
                  <div className="nk-auth-quote ms-sm-5">
                    <div className="nk-auth-quote-inner">
                      <p className="small">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Venenatis magna massa semper tristique. Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit. Venenatis
                        magna massa semper tristique dotset.
                      </p>
                      <div className="media-group align-items-center pt-3">
                        <div className="media media-md media-circle media-middle">
                          <img src="/images/avatar/a.jpg" alt="avatar" />
                        </div>
                        <div className="media-text">
                          <div className="h5 mb-0 !font-bold">Wade Warren</div>
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
