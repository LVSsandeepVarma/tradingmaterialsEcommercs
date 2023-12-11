import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import axios from "axios";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { Form } from "react-bootstrap";
import { SlQuestion } from "react-icons/sl";
import { Alert } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [apiError, setApiError] = useState();
  const [emailSentMsg, setEmailSentMsg] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  const loaderState = useSelector((state) => state.loader?.value);
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
    e.target.value = e.target.value.trim();
    setEmail(e?.target?.value);
    emailValidaiton(email);
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
          setEmailError(err?.response?.data?.errors["email"]);
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

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <div className="nk-app-root !text-left">
        <main className="nk-pages gradient-bg flex flex-col justify-between min-h-[100vh]">
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
                      Forgot Password ?
                    </h3>
                    <p className="text">
                      Already a member?{" "}
                      <a href={`/login`} className="btn-link text-primary">
                        Login
                      </a>
                      .
                    </p>
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
                              onChange={(e) => handleEmailChange(e)}
                            />
                            {emailError && <p className="text-[#fb3048] font-normal !text-xs !px-3 flex items-center gap-1">
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
                            </p>}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button
                            disabled={!email}
                            className="btn btn-block btn-primary text-sm"
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
