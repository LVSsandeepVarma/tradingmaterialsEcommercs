import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import axios from "axios";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { Form } from "react-bootstrap";
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
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
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
    emailValidaiton(email);
  };

  async function handleFormSubmission() {
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
        <div className="preloader !bg-[rgba(0,0,0,0.5)]">
          <div className="loader"></div>
        </div>
      )}
      <div className="nk-app-root !text-left">
        <main className="nk-pages">
          <div className="nk-split-page flex-column flex-xl-row">
            <div className="nk-split-col nk-auth-col justify-content-center">
              <div
                className="nk-form-card card  p-0 card-gutter-md nk-auth-form-card mx-lg-9 mx-xl-auto"
                data-aos="fade-up"
              >
                <div className="card-body">
                  <div className="nk-form-card-head text-center pb-5">
                    <div className="form-logo flex justify-center mb-3">
                      <a href={`/`}>
                        <img
                          className="logo-img justify-center"
                          src="/images/tm-logo-1.png"
                          alt="logo"
                        />
                      </a>
                    </div>
                    <h3
                      className="title mb-2 !font-bold"
                      style={{ fontSize: "2rem" }}
                    >
                      Password Forgotten?
                    </h3>
                    <p className="text">
                      Shouldn&apos;t be here{" "}
                      <a href={`/login`} className="btn-link text-primary">
                        Login
                      </a>
                      .
                    </p>
                  </div>
                  <Form>
                    <div className="row gy-4">
                      <div className="col-12">
                        <div className="form-group text-left">
                          <label className="form-label">Email</label>
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
                            type="button"
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
            <div className="nk-split-col nk-auth-col nk-auth-col-content  bg-primary-gradient is-theme">
              <div className="nk-mask shape-33" data-aos="fade-in"></div>
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
