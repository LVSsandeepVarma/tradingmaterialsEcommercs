// ShippingAddressModal.js
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
// import AddressForm from '../forms/addressform';
import { Form } from "react-bootstrap";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import { Alert } from "@mui/material";

// eslint-disable-next-line react/prop-types, no-unused-vars
const ForgotPasswordModal = ({ show, onHide }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSentMsg, setEmailSentMsg] = useState("");
  const [apiError, setApiError] = useState();
  // eslint-disable-next-line no-unused-vars
  const [localLoader, setLocalLoader] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const userLang = useSelector((state) => state?.lang?.value);
  const userData = useSelector((state) => state?.user?.value);

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
      setEmailError("invalid email");
    } else {
      setEmailError("");
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e?.target?.value);
    emailValidaiton(e?.target?.value);
  };

  async function handleFormSubmission(e) {
    e.preventDefault()
    setApiError([]);
    setEmailSentMsg("");
    console.log(email);
    emailValidaiton(email);
    if (emailError === "" && email !== "") {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/reset-password-link",
          {
            email: email,
            client_id: userData?.client?.id,
          }
        );
        if (response?.data?.status) {
          setEmailSentMsg(response?.data?.message);
          console.log(response?.data);
          // navigate(`/login`);
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
          setEmailSentMsg("");
        }, 8000);
      } finally {
        dispatch(hideLoader());
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
      // size="lg"
      className="!backdrop-blur-[1px] !overflow-auto lg:!overflow-hidden"
      dialogClassName="modal-25"
      centered
      style={{ marginTop: "0 !important" }}
    >
      <Modal.Header closeButton={true} className="noBorderBottom !pt-[16px]">
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
              <div className="loader"></div>
            </div>
          )}

          <div
            className="nk-form-card card rounded-3 card-gutter-md nk-auth-form-card mx-xl-auto !text-left !h-[950px] "
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
                      src="/images/tm-logo-1.webp"
                      alt="logo"
                    />
                  </a>
                </div>
                <h3
                  className="title mb-2 font-semibold !font-bold"
                  style={{ fontSize: "2rem" }}
                >
                  Forgot Password
                </h3>
                {/* <small className="text font-semibold text-lg">To Offers</small> */}
                {/* <p className="text">
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
                </p> */}
              </div>
              <Form onSubmit={handleFormSubmission}>
                <div className="row gy-4">
                  <div className="col-12">
                    <div className="form-group text-left">
                      <label className="form-label">
                        Email<sup className="text-red-600 !font-bold">*</sup>
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          onChange={(e) => handleEmailChange(e)}
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
                      <button
                        className="btn btn-block btn-primary"
                        type="submit"
                        onClick={handleFormSubmission}
                      >
                        Send Reset Link
                      </button>
                      {emailSentMsg && (
                        <Alert
                          variant="outlined"
                          severity="success"
                          className="mt-2"
                        >
                          <p className="text-green-900 font-semibold">
                            {emailSentMsg}
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
                              className="!mt-2"
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

export default ForgotPasswordModal;
