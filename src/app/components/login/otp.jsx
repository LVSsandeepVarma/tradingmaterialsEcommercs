import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import axios from "axios";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import OtpInput from "react-otp-input";
import { Alert } from "@mui/material";

export default function Otp() {
  const [email, setEmail] = useState("");
  const [otpError, setotpError] = useState("");
  const [otp, setOtp] = useState("");
  const [successMEssage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState();
  const params = useParams();
  console.log(params, "hashcode");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loaderState = useSelector((state) => state.loader?.value);
  const userLang = useSelector((state) => state?.lang?.value);

  useEffect(() => {
    const verifyHash = async () => {
      try {
        dispatch(showLoader());
        const urlParameter = window.location.pathname;
        const hash = urlParameter.substring(urlParameter.lastIndexOf("/") + 1);
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/lead/verify/hash",
          {
            hash: params?.hash,
          }
        );
        console.log("response", response);
        // setVerifiedHash(true)
      } catch (err) {
        console.log("err", err);
        dispatch(hideLoader());
        // setVerifiedHash(false)
      }
      dispatch(hideLoader());
    };
    verifyHash();
  }, []);

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

  function otpValidation(otp) {
    if (otp === "") {
      setotpError("Otp is required");
    } else {
      setotpError("");
    }
  }

  const handleEmailChange = (e) => {
    setOtp(e?.target?.value);
    otpValidation(otp);
  };

  async function handleFormSubmission() {
    setApiError([]);
    setSuccessMessage("");
    console.log(otp);
    otpValidation(otp);
    if (otpError === "" && otp !== "") {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/lead/verify/otp",
          {
            hash: params?.hash,
            otp: otp,
          }
        );
        if (response?.data?.status) {
          setSuccessMessage(response?.data?.message);
          console.log(response?.data);
          localStorage.setItem("passHash", params?.hash)

          navigate(`${userLang}/reset-password/new-password?:${params?.hash}`);
        }
      } catch (err) {
        console.log("err", err);
        if (err?.response?.data?.errors) {
          setApiError([...Object?.values(err?.response?.data?.errors)]);
        } else {
          setApiError([err?.response?.data?.message]);
        }
        setTimeout(() => {
          setApiError([]);
          setSuccessMessage("");
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
                // data-aos="fade-up"
              >
                <div className="card-body">
                  <div className="nk-form-card-head text-center pb-5">
                    <div className="form-logo mb-3">
                      <a href={`/`}>
                        <img
                          className="logo-img content-center"
                          src="/images/tm-logo-1.png"
                          alt="logo"
                        />
                      </a>
                    </div>
                    {/* <h3 className="title mb-2 text-4xl font-semibold">
                      OTP
                    </h3> */}
                    {/* <p className="text">
                      Shouldn't be here{" "}
                      <a href={`/login`} className="btn-link text-primary">
                        Login
                      </a>
                      .
                    </p> */}
                  </div>
                  <form action="#">
                    <div className="row gy-4">
                      <div className="col-12">
                        <div className="form-group text-left">
                          <label className="form-label">Enter your OTP</label>
                          <div className="form-control-wrap">
                            <OtpInput
                              value={otp}
                              onChange={setOtp}
                              numInputs={4}
                              shouldAutoFocus={true}
                              containerStyle={{ width: "100%" }}
                              inputStyle={{
                                padding: "15px",
                                width: "50px",
                                display: "flex",
                                justifyContent: "space-around",
                                marginRight: "15px",
                              }}
                              //   renderSeparator={<span>-</span>}
                              renderInput={(props) => <input {...props} />}
                            />
                            {otpError && (
                              <p className="text-red-600 font-semibold">
                                {otpError}
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

                          {/* {successMEssage && (
                        <p className="text-green-600 font-semibold">
                          {successMEssage}
                        </p>
                      )} */}

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

                          {/* <p className="text">
                            Shouldn't be here{" "}
                            <a
                              href={`/login`}
                              className="btn-link text-primary"
                            >
                              Login
                            </a>
                            .
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </form>
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
        {/* <div className="nk-sticky-badge">
          <ul>
            <li>
              <a
                href="index.php"
                className="nk-sticky-badge-icon nk-sticky-badge-home"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-custom-className="nk-tooltip"
                data-bs-title="View Demo"
              >
                <em className="icon ni ni-home-fill"></em>
              </a>
            </li>
            <li>
              <a
                href="product-details.php"
                className="nk-sticky-badge-icon nk-sticky-badge-purchase"
                data-bs-toggle="tooltip"
                data-bs-custom-className="nk-tooltip"
                data-bs-title="Purchase Now"
                aria-label="Purchase Now"
              >
                <em className="icon ni ni-cart-fill"></em>
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </>
  );
}
