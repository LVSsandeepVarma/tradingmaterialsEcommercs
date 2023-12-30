/* eslint-disable no-unsafe-optional-chaining */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { userLanguage } from "../../../features/userLang/userLang";
import { Alert } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { SlQuestion } from "react-icons/sl";


export default function NewPassword() {
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
  const userData = useSelector((state) => state?.user?.value);

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
    } else if (confirmPassword?.length < 8 || confirmPassword?.length > 15) {
      setconfirmPasswordError("Password does not match");
    } else if (confirmPassword !== password) {
      setconfirmPasswordError("Password does not match");
    } else {
      setconfirmPasswordError("");
    }
  }

  function passwordValidation(password) {
    console.log(password?.length, passwordError);
    // const passwordRegex = /^(?=.*[A-Za-z0-9])(?=.*[^A-Za-z0-9]).+$/
    const hasAlpha = /[A-Za-z]/;
    const hasNumaricals = /\d/;
    const hasSpecialCharecters = /[^A-Za-z0-9]/;
    console.log(
      hasAlpha.test(password),
      hasNumaricals.test(password),
      hasSpecialCharecters.test(password),
      "tessst"
    );
    if (password?.length === 0) {
      setPasswordError("Password is required");
    } else if (password?.length <= 7 || password?.length > 15) {
      setPasswordError("Password should contain 8 - 15 characters only");
      if (confirmPassword != "" && confirmPassword !== password) {
        // console.log(password, confirmPassword, "confm")
        setconfirmPasswordError("Password does not match");
      }
    } else if (password?.length >= 8 && password?.length <= 15) {
      if (!hasAlpha.test(password)) {
        setPasswordError("Atleast one alphabet is required ");
        console.log("tessst");
        if (confirmPassword != "" && confirmPassword !== password) {
          // console.log(password, confirmPassword, "confm")
          setconfirmPasswordError("Password does not match");
        }
        if (confirmPassword != "" && confirmPassword == password) {
          setconfirmPasswordError("");
        }
        return;
      } else if (!hasNumaricals.test(password)) {
        setPasswordError("Atleast one number is required");
        console.log("tessst");
        if (confirmPassword != "" && confirmPassword !== password) {
          // console.log(password, confirmPassword, "confm")
          setconfirmPasswordError("Password does not match");
        }
        if (confirmPassword != "" && confirmPassword == password) {
          setconfirmPasswordError("");
        }
        return;
      } else if (!hasSpecialCharecters.test(password)) {
        setPasswordError("Atleast one special character is required");
        console.log("tessst");
        if (confirmPassword != "" && confirmPassword !== password) {
          // console.log(password, confirmPassword, "confm")
          setconfirmPasswordError("Password does not match");
        }
        if (confirmPassword != "" && confirmPassword == password) {
          setconfirmPasswordError("");
        }
        return;
      }

      if (confirmPassword != "" && confirmPassword !== password) {
        // console.log(password, confirmPassword, "confm")
        setconfirmPasswordError("Password does not match");
      }
      if (confirmPassword != "" && confirmPassword == password) {
        setconfirmPasswordError("");
      }
      setPasswordError("");
    } else if (confirmPassword != "" && confirmPassword == password) {
      setconfirmPasswordError("");
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

  async function handleFormSubmission(e) {
    e.preventDefault()
    setApiError([]);
    setLoginsuccessMsg("");
    console.log(confirmPassword, password);
    confirmPasswordValidaiton(confirmPassword);
    
    passwordValidation(password);
    try {
      dispatch(showLoader());
      const url = location.hash;
      console.log(url);
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/reset/password",
        {
          confirm_password: confirmPassword,
          password: password,
          hash: localStorage.getItem("passHash"),
          client_id: userData?.client?.id,
        }
      );
      if (response?.data?.status) {
        localStorage.removeItem("passHash");
        setLoginsuccessMsg(response?.data?.message);
        setTimeout(() => {
          navigate(`/login`);
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
        <div className="nk-pages gradient-bg flex flex-col justify-between min-h-[100vh]">
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
                      Reset Password
                    </h3>
                  </div>
                  <Form onSubmit={handleFormSubmission}>
                    <div className="row gy-4 !text-left">
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Password
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
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
                              className="form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]"
                              maxLength={15}
                              placeholder="Enter your password"
                              onChange={handlePasswordChange}
                            />
                          </div>
                          {passwordError && (
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
                              {passwordError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Confirm Password
                            <sup className="text-[#fb3048] !font-bold">*</sup>
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
                              className="form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]"
                              maxLength={15}
                              placeholder="Enter confirm Password"
                              onChange={handleconfirmPasswordChange}
                            />
                          </div>
                          {confirmPasswordError && (
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
                              {confirmPasswordError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button
                            disabled={!password || !confirmPassword}
                            className="btn btn-block btn-primary text-sm"
                            type="submit"
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
                </div>
              </div>
            </div>
          </>
          <div className="flex justify-start gap-5 mx-3 py-3 items-center">
            <span
              className="flex items-center gap-1 cursor-pointer hover:text-blue-600 !font-bold"
              onClick={() =>
                (window.location.href = "/contact")
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
