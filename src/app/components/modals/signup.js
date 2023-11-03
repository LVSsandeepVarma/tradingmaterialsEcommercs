// ShippingAddressModal.js
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import { loginUser } from "../../../features/login/loginSlice";
import axios from "axios";
import { updateUsers } from "../../../features/users/userSlice";
// import AddressForm from '../forms/addressform';
import { Form } from "react-bootstrap";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import { Alert } from "@mui/material";
import { updateclientType } from "../../../features/clientType/clientType";
import SessionExpired from "./sessionExpired";

// eslint-disable-next-line react/prop-types, no-unused-vars
const SignupModal = ({ show, onHide }) => {
  // const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [showSessionExppiry, setShowSessionExpiry] = useState(false);
  const [apiError, setApiError] = useState([]);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState("");
  const [localLoader, setLocalLoader] = useState(false);
  const [useriP, setUserIp] = useState("");

  const loginStatus = useSelector((state) => state?.login?.value);
  console.log(loginStatus, window.location.host, window.location.hostname);

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

  async function handleFormSubmission() {
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
    // console.log(emailError, phoneError, firstNameError)

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
          setLocalLoader(true);
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
            handleHide();
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
              setShowSessionExpiry(true);
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
          //   dispatch(hideLoader());
          setLocalLoader(false);
        }
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
        showSignupCartModal: false,
        showSignupBuyModal: false,
      })
    );
    // document.getElementsByTagName(body).style =
  };

  function handleSessionExpiryClose() {
    setShowSessionExpiry(false);
    navigate("/?login");
  }

  return (
    <>
      <SessionExpired
        open={showSessionExppiry}
        handleClose={handleSessionExpiryClose}
      />
      <Modal
        show={show}
        onHide={handleHide}
        // size="lg"
        className="!backdrop-blur-[1px]  !overflow-auto !h-[100%]"
        dialogClassName="modal-25"
        centered
      >
        <Modal.Header closeButton={true} className="noBorderBottom !pt-[16px]">
          <Modal.Title
            className="text-[#072d52] !font-semibold !text-center w-full "
            style={{ borderBottom: 0 }}
          >
            Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
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
                        className="logo-img"
                        src="/images/tm-logo-1.webp"
                        alt="logo"
                      />
                    </a>
                  </div>
                  <h3 className="title mb-2 text-2xl !font-bold">
                    Sign up to your account
                  </h3>
                  <p className="text-sm">
                    Already a member?{" "}
                    <a
                      onClick={() =>
                        dispatch(
                          usersignupinModal({
                            showSignupModal: false,
                            showLoginModal: true,
                            showforgotPasswordModal: false,
                            showOtpModal: false,
                            showNewPasswordModal: false,
                            showSignupCartModal: false,
                            showSignupBuyModal: false,
                          })
                        )
                      }
                      className="btn-link text-primary cursor-pointer"
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
                          Email<sup className="text-red-600 !font-bold">*</sup>
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
                          Phone<sup className="text-red-600 !font-bold">*</sup>
                        </label>
                        <div className="form-control-wrap">
                          {/* <a
                              href="show-hide-password.html"
                              className="form-control-icon end password-toggle"
                              title="Toggle show/hide password"
                            >
                              <em className={`on icon ni ${
                                  showPassword
                                    ? "ni-eye-off-fill"
                                    : "ni-eye-fill"
                                } text-primary`}
                                onClick={() => setShowPassword(!showPassword)}></em>
                              <em className="off icon ni ni-eye-off-fill text-primary"></em>
                            </a> */}
                          <input
                            id="show-hide-password"
                            type="text"
                            className="form-control"
                            placeholder="Enter your mobile"
                            onChange={handlePhoneChange}
                          />
                          {phoneError && (
                            <p className="nk-message-error text-xs">
                              {phoneError}
                            </p>
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
                {/* <!--<div className="pt-4 text-center">
                                <div className="small overline-title-sep"><span className="bg-white px-2 text-base">or register with</span></div>
                            </div>
                            <div className="pt-4"><a href="#" className="btn btn-outline-gray-50 text-dark w-100"><img src="images/icon/a.png" alt="" className="icon"><span>Sign Up with Google</span></a></div>--> */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SignupModal;
