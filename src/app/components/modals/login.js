/* eslint-disable react/prop-types */
// ShippingAddressModal.js
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
// import Register from "../register/register";
// import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
// import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { loginUser } from "../../../features/login/loginSlice";
import axios from "axios";
import { updateUsers } from "../../../features/users/userSlice";
// import AddressForm from '../forms/addressform';
import { Form } from "react-bootstrap";
import { updateclientType } from "../../../features/clientType/clientType";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import { Alert } from "@mui/material";

// eslint-disable-next-line no-unused-vars
const LoginModal = ({ show, onHide }) => {
  // const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [localLoader, setLocalLoader] = useState(false);
  const [apiError, setApiError] = useState([]);
  const [loginSuccessMsg, setLoginsuccessMsg] = useState("");
  // const loaderState = useSelector((state) => state.loader?.value);
  const [showPassword, setShowPassword] = useState(false);
  const [saveCredentials, setSavecredentials] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLang = useSelector((state) => state?.lang?.value);

  useEffect(() => {
    if (localStorage.getItem("email") && localStorage.getItem("phone")) {
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
      setEmailError("Invalid email");
    } else {
      setEmailError("");
    }
  }

  function passwordValidation(password) {
    if (password?.length === 0) {
      setPasswordError("Password is required");
    } else if (password?.length <= 7) {
      setPasswordError("Invalid phone number");
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
    // console.log(emailError, phoneError, firstNameError)
    if (
      emailError === "" &&
      passwordError === "" &&
      email !== "" &&
      password !== ""
    ) {
      try {
        setLocalLoader(true);
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
          setLoginsuccessMsg(response?.data?.message);
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
            window.open (`https://client.tradingmaterials.com/auto-login/${localStorage.getItem("client_token")}`, "_blank");
          } else {
            console.log(window.location.pathname)
            if(window.location.pathname.includes("orders")){
              // window.location.reload()
              onHide()
            }else{
              navigate(`${userLang}/profile`);
            }
          }
          handleHide();
          setTimeout(() => {
            localStorage.removeItem("token");
            dispatch(
              updateNotifications({
                type: "warning",
                message: "Oops!",
              })
            );
            navigate(`${userLang}/?login`);
          }, 3600000);
        }
      } catch (err) {
        
        console.log("err", err);
        if (err?.response?.data?.errors) {
          setEmailError(err?.response?.data?.errors["email"]);
          setPasswordError(err?.response?.data?.errors["password"]);
          // setApiError([...Object?.values(err?.response?.data?.errors)]);
        } else {
          console.log(err?.response)
          setApiError([err?.response?.data?.message]);
        }
        setTimeout(() => {
          setApiError([]);
          setLoginsuccessMsg("");
        }, 80000);
      } finally {
        // dispatch(hideLoader());
        setLocalLoader(false);
      }
    }
  }

  const handleHide = () => {
    // onHide();
    dispatch(
      usersignupinModal({
        showSignupModal: false,
        showLoginModal: false,
        showforgotPasswordModal: false,
        showOtpModal: false,
        showNewPasswordModal: false,
      })
    );
    // document.getElementsByTagName(body).style =
  };

  return (
    <Modal
      show={show}
      onHide={handleHide}
      // scrollable
      // size="lg"
      className="!backdrop-blur-[1px] !overflow-auto !h-[100%] "
      dialogClassName="modal-25"
      style={{ marginTop: "0 !important" }}
    >
      <Modal.Header closeButton={true} className="noBorderBottom  pt-[16px]">
        <Modal.Title
          className="text-[#072d52] !font-semibold !text-center w-full "
          style={{ borderBottom: 0 }}
        >
          Account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="!pt-0">
        <div className="nk-split-col ">
          {localLoader && (
            <div className="preloader  !backdrop-blur-[1px]">
              <div className="loader"></div>
            </div>
          )}

          <div
            className="nk-form-card card rounded-3 card-gutter-md nk-auth-form-card mx-xl-auto !text-left !h-[auto]  "
            style={{
              border: 0,
            }}
            data-aos="fade-up"
          >
            <div className="account-steps">
              <div className="step"></div>
              <div className="step"></div>
            </div>
            <div className="card-body !text-left p-5">
              <div className="nk-form-card-head text-center pb-5">
                <div className="form-logo mb-3">
                  <a
                    href={`${userLang}/`}
                    className="flex justify-center w-full"
                  >
                    <img
                      className="logo-img "
                      src="/images/tm-logo-1.png"
                      alt="logo"
                    />
                  </a>
                </div>
                <h3
                  className="title mb-2 font-semibold !font-bold"
                  style={{ fontSize: "1.5rem" }}
                >
                  Login to your account
                </h3>
                {/* <small className="text font-semibold text-lg">To Offers</small> */}
                <p className="text-sm">
                  Not a member yet?{" "}
                  <a
                    onClick={() =>
                      dispatch(
                        usersignupinModal({
                          showSignupModal: true,
                          showLoginModal: false,
                          showforgotPasswordModal: false,
                          showOtpModal: false,
                          showNewPasswordModal: false,
                        })
                      )
                    }
                    className="btn-link text-primary cursor-pointer"
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
                      <label className="form-label ">Email</label>
                      <div className="form-control-wrap">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          onChange={handleEmailChange}
                          value={email}
                        />
                        {emailError && (
                          <p className="text-red-600 font-semibold">
                            {emailError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
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
                              showPassword ? "ni-eye-off-fill" : "ni-eye-fill"
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
                      <p className="text-red-600 font-semibold">
                        {passwordError}
                      </p>
                    )}
                  </div>
                  <div className="col-12">
                    <div className="d-flex flex-wrap align-items-start  justify-content-between text-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="rememberMe"
                          checked={saveCredentials}
                          onChange={() => setSavecredentials(!saveCredentials)}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">
                          {" "}
                          Remember Me{" "}
                        </label>
                      </div>
                      <a
                        onClick={() =>
                          dispatch(
                            usersignupinModal({
                              showSignupModal: false,
                              showLoginModal: false,
                              showforgotPasswordModal: true,
                              showOtpModal: false,
                              showNewPasswordModal: false,
                            })
                          )
                        }
                        className="d-inline-block fs-16 cursor-pointer pt-0"
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
                      <div className="terms-tex mt-2 text-lg">
                        <p>
                          By signing up, you agree to the <br></br>{" "}
                          <a href="/terms-and-conditions">Terms of Service</a> and{" "}
                          <a href="/privacy-policy">Privacy Policy</a>.{" "}
                        </p>
                      </div>{" "}
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
                                <div className="small overline-title-sep"><span className="bg-white px-2 text-base">or register with</span></div>
                            </div>
                            <div className="pt-4"><a href="#" className="btn btn-outline-gray-50 text-dark w-100"><img src="images/icon/a.png" alt="" className="icon"><span>Sign Up with Google</span></a></div>--> */}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
