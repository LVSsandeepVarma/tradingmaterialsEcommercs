import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../../features/login/loginSlice";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { updateUsers } from "../../../features/users/userSlice";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import { userLanguage } from "../../../features/userLang/userLang";
import { updateclientType } from "../../../features/clientType/clientType";
import { Alert } from "@mui/material";
// import { PiWarningDuotone } from "react-icons/pi";
import { SlQuestion } from "react-icons/sl";
// import { FcGoogle } from "react-icons/fc";

// import { MdOutlineSmsFailed } from "react-icons/md";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState([]);
  const [loginSuccessMsg, setLoginsuccessMsg] = useState("");
  const loginStatus = useSelector((state) => state?.login?.value);
  const loaderState = useSelector((state) => state.loader?.value);
  // const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saveCredentials, setSavecredentials] = useState(false);

  const submitRef = useRef();
  console.log(loginStatus);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLang = useSelector((state) => state?.lang?.value);

  useEffect(() => {
    if (
      localStorage.getItem("email") !== "" &&
      localStorage.getItem("phone") !== ""
    ) {
      setEmail(localStorage.getItem("email"));
      setPassword(localStorage.getItem("phone"));
      setSavecredentials(true);
      submitRef.current.focus();
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
      setEmailError("Invalid email");
    } else {
      setEmailError("");
    }
  }

  function passwordValidation(password) {
    if (password?.length === 0) {
      setPasswordError("Password is required");
    } else if (password?.length <= 7) {
      setPasswordError("Password should be atleast 8 digits");
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

  async function handleFormSubmission(e) {
    e.preventDefault();
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
          if (saveCredentials) {
            localStorage.setItem("email", email);
            localStorage.setItem("phone", password);
          } else {
            if (
              localStorage.getItem("email", email) &&
              localStorage.getItem("phone", password)
            ) {
              localStorage.removeItem("email", email);
              localStorage.removeItem("phone", password);
            }
          }

          localStorage.removeItem("client_token");
          localStorage.setItem("client_token", response?.data?.token);
          // localStorage
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
          if (response?.data?.type === "client") {
            setLoginsuccessMsg(response?.data?.message);
            window.location.href = `/auto-login/${localStorage.getItem(
              "client_token"
            )}`;
          }
          if (response?.data?.type === "lead") {
            setApiError["Unauthorized"];
            window.location.href = `https://tradingmaterials.com`;
          }
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
          setPasswordError(err?.response?.data?.errors["password"]);
          // setApiError([...Object?.values(err?.response?.data?.errors)]);
        } else {
          console.log(err?.response);
          setApiError([err?.response?.data?.message]);
        }
        // setOpen(true);
        setTimeout(() => {
          setApiError([]);
          setLoginsuccessMsg("");
        }, 80000);
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
                className=" nk-form-card !bg-[#fffff] card rounded-4 card-gutter-md nk-auth-form-card min-w-[100%] max-w-[100%] sm:min-w-[500px] sm:max-w-[500px]"
                // data-aos="fade-up"
              >
                <div className="card-body  !p-7">
                  <div className="nk-form-card-head !text-center pb-5">
                    {/* <div className="flex w-full form-logo mb-3">
                      <a
                        className="w-full flex justify-center"
                        href={`${userLang}/`}
                      >
                        <img
                          className="logo-img justify-center"
                          src="/images/tm-logo-1.webp"
                          alt="logo"
                        />
                      </a>
                    </div> */}
                    <h3
                      className="title mb-2 !font-bold"
                      style={{ fontSize: "24px" }}
                    >
                      Login to your account
                    </h3>
                  </div>
                  <Form onSubmit={handleFormSubmission}>
                    <div className="row gy-2 !text-left">
                      <div className="col-12 mt-0">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Email
                            <sup className="text-[#fb3048] !font-bold">*</sup>
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="email"
                              className="form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]"
                              placeholder="Enter your email"
                              value={email}
                              onChange={handleEmailChange}
                            />
                          </div>
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
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label text-sm !mb-1 font-normal">
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
                              className="form-control !py-2 !px-3 placeholder:!font-semibold placeholder:!text-[#cac7cf]"
                              placeholder="Enter your password"
                              maxLength="15"
                              onChange={handlePasswordChange}
                              value={password}
                            />
                          </div>
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
                      <div className="col-12">
                        <div className="d-flex flex-wrap align-items-center  justify-content-between text-center">
                          <div className="form-check !min-h-[0rem]">
                            <input
                              className="form-check-input !text-sm w-4 h-4"
                              type="checkbox"
                              value=""
                              id="rememberMe"
                              checked={saveCredentials}
                              onChange={() =>
                                setSavecredentials(!saveCredentials)
                              }
                            />
                            <label
                              className="form-check-label text-sm"
                              htmlFor="rememberMe"
                            >
                              {" "}
                              Remember Me{" "}
                            </label>
                          </div>
                          <a
                            href={`${userLang}/reset-password/forgot-password`}
                            className="d-inline-block fs-14 text-xs hover:text-blue-600"
                          >
                            Forgot Password?
                          </a>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button
                            disabled={!email || !password}
                            className="btn btn-block btn-primary text-sm"
                            type="submit"
                            ref={submitRef}
                            onClick={handleFormSubmission}
                          >
                            Login
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
                                  // variant="filled"
                                  severity="error"
                                  className="mt-2"
                                >
                                  <p
                                    key={ind}
                                    className="text-[#fb3048] font-semibold"
                                  >
                                    {err}
                                  </p>
                                </Alert>
                              );
                            })}
                          {/* will be used later  */}

                          {/* <p className="text-center w-full my-1"> Or </p>
                          <div className="flex justify-center">
                            <button type="button" className="p-2 border rounded-lg flex items-center gap-2 hover:bg-gradient-to-r from-blue-100 to-blue-300">
                              <FcGoogle size={24} />
                              Sign in with Google
                            </button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
              <div className="flex w-full">
                <span className="min-w-[100%] max-w-[100%] sm:min-w-[450px] sm:max-w-[450px] text-xs   mt-3 mx-auto text-center">
                  By clicking Login to your account above, you acknowledge that
                  you have read and understood, and agree to Trading materials{" "}
                  <a
                    className="underline hover:text-blue-600"
                    href="terms-and-conditions"
                  >
                    Terms&nbsp;of&nbsp;Service
                  </a>
                  &#160;and&#160;
                  <a
                    className="underline hover:text-blue-600"
                    href="/privacy-policy"
                  >
                    Privacy&nbsp;Policy
                  </a>
                  .
                </span>
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
