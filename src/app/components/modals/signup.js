// ShippingAddressModal.js
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Register from "../register/register";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { loginUser } from "../../../features/login/loginSlice";
import axios from "axios";
import { updateUsers } from "../../../features/users/userSlice";
// import AddressForm from '../forms/addressform';
import { Form } from "react-bootstrap";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import { Alert } from "@mui/material";

const SignupModal = ({ show, onHide }) => {
  const { t } = useTranslation();
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
  const [showPassword, setShowPassword] = useState(false);
  const [localLoader, setLocalLoader] = useState(false);

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
    let userLan = "";
    if (lang === "/ms" || location.pathname.includes("/ms")) {
      dispatch(userLanguage("/ms"));
      userLan = "/ms";
    } else {
      dispatch(userLanguage(""));
      userLan = "";
    }
  }, []);

  function emailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (email === "") {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("invalid email");
    } else {
      setEmailError("");
    }
  }

  function phoneValidation(phone) {
    if (phone?.length === 0) {
      setPhoneError("Phone number is required");
    } else if (phone?.length <= 5) {
      setPhoneError("Phone number should be atleast 6 digits");
    } else {
      setPhoneError("");
    }
  }

  function firstNameVerification(name) {
    const nameRegex = /^[a-zA-Z. ]+$/;
    if (name === "") {
      setFirstNameError("First name is required");
    } else if (!nameRegex.test(name)) {
      setFirstNameError("Invalid first name, only charecters are allowed");
    } else {
      setFirstNameError("");
    }
  }

  function lastNameVerification(name) {
    const nameRegex = /^[a-zA-Z. ]+$/;
    if (name === "") {
      setLastNameError("Last name is required");
    } else if (!nameRegex.test(name)) {
      setLastNameError("Invalid last name, only charecters are allowed");
    } else {
      setLastNameError("");
    }
  }

  function handleEmailChange(e) {
    setEmail(e?.target?.value);
    emailValidaiton(e?.target?.value);
  }

  function handlePhoneChange(e) {
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
            navigate(`${userLang}/`);

            setTimeout(() => {
              localStorage.removeItem("token");
              dispatch(
                updateNotifications({
                  type: "warning",
                  message: "Session expired, Login again",
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
      })
    );
    // document.getElementsByTagName(body).style =
  };

  return (
    <Modal
      show={show}
      onHide={handleHide}
      // size="lg"
      className="!backdrop-blur-[1px]  !overflow-auto md:!overflow-hidden"
      dialogClassName="modal-25"
      centered
    >
      <Modal.Header closeButton={true} className="noBorderBottom pt-[70px] md:!pt-[16px]">
        <Modal.Title
          className="text-[#072d52] !font-semibold !text-center w-full "
          style={{ borderBottom: 0 }}
        >
          Account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        <div className="nk-split-col ">
          {localLoader && (
            <div className="preloader  !backdrop-blur-[1px]">
              <div class="loader"></div>
            </div>
          )}
          <div
            className="nk-form-card card rounded-3 card-gutter-md nk-auth-form-card mx-md-9 mx-xl-auto !text-left !h-[100vh] !overflow-auto md:!overflow-hidden"
            style={{
              border: 0,
            }}
            // data-aos="fade-up"
          >
            <div class="account-steps">
              <div class="step"></div>
              <div class="step"></div>
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
                      src="/images/tm-logo-1.png"
                      alt="logo"
                    />
                  </a>
                </div>
                <h3 className="title mb-2 text-4xl !font-bold">
                  Sign up to your account
                </h3>
                <p className="text">
                  Already a member?{" "}
                  <a
                    onClick={() =>
                      dispatch(
                        usersignupinModal({
                          showSignupModal: false,
                          showLoginModal: true,
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
                      <label className="form-label">First Name</label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your first name"
                          onChange={handleFirstNamechange}
                        />
                        {firstNameError && (
                          <p className="text-red-600 font-semibold">
                            {firstNameError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your first name"
                          onChange={handleLastNameChange}
                        />
                        {lastNameError && (
                          <p className="text-red-600 font-semibold">
                            {lastNameError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your email"
                          onChange={handleEmailChange}
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
                      <label className="form-label">Phone</label>
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
                          placeholder="Enter your number"
                          onChange={handlePhoneChange}
                        />
                        {phoneError && (
                          <p className="text-red-700 font-semibold">
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
                          <p className="text-green-600 !text-center font-semibold">
                            {signupSuccessMsg}
                          </p>
                        </Alert>
                      )}

                      {apiError?.length > 0 &&
                        apiError?.map((err, ind) => {
                          return (
                            <Alert
                              variant="outlined"
                              severity="error"
                              className="mt-2"
                            >
                              <p
                                key={ind}
                                className="text-red-700 font-semibold"
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

export default SignupModal;
