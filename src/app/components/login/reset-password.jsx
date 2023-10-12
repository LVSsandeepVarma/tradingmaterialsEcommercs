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
      setconfirmPasswordError("Confirm Password is required");
    }else if (confirmPassword?.length <8 || confirmPassword?.length> 15 ) {
      setconfirmPasswordError("Password does not match")
    } else if (confirmPassword !== password) {
      setconfirmPasswordError("Password does not match");
    } else {
      setconfirmPasswordError("");
    }
  }

  function passwordValidation(password) {
    console.log(password?.length, passwordError)
    // const passwordRegex = /^(?=.*[A-Za-z0-9])(?=.*[^A-Za-z0-9]).+$/
    const hasAlpha = /[A-Za-z]/;
    const hasNumaricals = /\d/;
    const hasSpecialCharecters = /[^A-Za-z0-9]/
    console.log(hasAlpha.test(password),hasNumaricals.test(password),hasSpecialCharecters.test(password),"tessst")
    if (password?.length === 0) {
      setPasswordError("Password is required");
    } else if ((password?.length <= 7 ) || password?.length >15) {

      setPasswordError("Password should contain 8 - 15 characters only");
      if(confirmPassword != "" && confirmPassword !== password){
        // console.log(password, confirmPassword, "confm")
        setconfirmPasswordError("Password does not match");
      }
    }
     else if (password?.length >=8 && password?.length<= 15 ) {

      if(!hasAlpha.test(password)){
        setPasswordError("Atleast one alphabet is required ")
        console.log("tessst")
        if(confirmPassword != "" && confirmPassword !== password){
          // console.log(password, confirmPassword, "confm")
          setconfirmPasswordError("Password does not match");
          
        }if (confirmPassword != "" && confirmPassword == password){
          setconfirmPasswordError("")
        }
        return
      }else if(!hasNumaricals.test(password)){
        setPasswordError("Atleast one number is required")
        console.log("tessst")
        if(confirmPassword != "" && confirmPassword !== password){
          // console.log(password, confirmPassword, "confm")
          setconfirmPasswordError("Password does not match");
          
        }if (confirmPassword != "" && confirmPassword == password){
          setconfirmPasswordError("")
        }
        return
      }else if(!hasSpecialCharecters.test(password)){
        setPasswordError("Atleast one special character is required")
        console.log("tessst")
        if(confirmPassword != "" && confirmPassword !== password){
          // console.log(password, confirmPassword, "confm")
          setconfirmPasswordError("Password does not match");
          
        }if (confirmPassword != "" && confirmPassword == password){
          setconfirmPasswordError("")
        }
        return
      }

      if(confirmPassword != "" && confirmPassword !== password){
        // console.log(password, confirmPassword, "confm")
        setconfirmPasswordError("Password does not match");
        
      }if (confirmPassword != "" && confirmPassword == password){
        setconfirmPasswordError("")
      }
      setPasswordError("")
      
    }else if (confirmPassword != "" && confirmPassword == password){
      setconfirmPasswordError("")
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
    if (
      confirmPasswordError === "" &&
      passwordError === "" &&
      confirmPassword !== "" &&
      password !== ""
    ) {
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

        setTimeout(() => {
          navigate(`/?login`);
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
    }
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
                      Reset Password
                    </h3>
                  </div>
                  <Form>
                    <div className="row gy-4 !text-left">
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label">New Password<sup className="text-red-600 !font-bold">
                                    *
                                  </sup></label>
                          <div className="form-control-wrap">
                            <a
                              // href="show-hide-password.html"
                              className="form-control-icon end bg-white border-y password-toggle"
                              title="Toggle show/hide password"
                            >
                              <em
                                className={`on icon ni cursor-pointer bg-white w-[15%]  ${
                                  showPassword
                                    ? "ni-eye-off-fill"
                                    : "ni-eye-fill"
                                } text-primary`}
                                onClick={() => setShowPassword(!showPassword)}
                              ></em>
                              <em className="off icon  ni ni-eye-off-fill text-primary"></em>
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
                            <p className="nk-message-error text-xs mt-1">
                              {passwordError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label ">
                            Confirm Password<sup className="text-red-600 !font-bold">
                                    *
                                  </sup>
                          </label>
                          <div className="form-control-wrap">
                            <a
                              // href="show-hide-password.html"
                              className="form-control-icon end bg-white border-y password-toggle"
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
                              <p className="nk-message-error text-xs mt-1">
                                {confirmPasswordError}
                              </p>
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
                            Reset Password
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
