/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { userLanguage } from "../../../features/userLang/userLang";
import axios from "axios";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import OtpInput from "react-otp-input";
import { Alert } from "@mui/material";
import { SlQuestion } from "react-icons/sl";

export default function Otp() {
  const [otpError, setotpError] = useState("");
  const [otp, setOtp] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [successMEssage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState();
  const params = useParams();
  console.log(params, "hashcode");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loaderState = useSelector((state) => state.loader?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  // eslint-disable-next-line no-unused-vars
  const userData = useSelector((state) => state?.user?.value);

  useEffect(() => {
    const verifyHash = async () => {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/verify/hash",
          {
            hash: params?.hash,
            client_id: userData?.client?.id,
          }
        );
        console.log("response", response);
        // setVerifiedHash(true)
      } catch (err) {
        console.log("err", err);
        dispatch(hideLoader());
        navigate("/expired");
        // setVerifiedHash(false)
      }
      dispatch(hideLoader());
    };
    verifyHash();
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

  function otpValidation(otp) {
    if (otp === "") {
      setotpError("Otp is required");
    } else {
      setotpError("");
    }
  }

  async function handleFormSubmission(e) {
    e.preventDefault();
    setApiError([]);
    setSuccessMessage("");
    console.log(otp);
    otpValidation(otp);
    if (otpError === "" && otp !== "") {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/verify/otp",
          {
            hash: params?.hash,
            otp: otp,
          }
        );
        if (response?.data?.status) {
          setSuccessMessage(response?.data?.message);
          console.log(response?.data);
          localStorage.setItem("passHash", params?.hash);

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
                      OTP{" "}
                    </h3>
                  </div>
                  <form onSubmit={handleFormSubmission}>
                    <div className="row gy-2 !text-left">
                      <div className="col-12 mt-0">
                        <div className="form-group">
                          <label className="form-label text-xs !mb-1 font-normal">
                            Enter your OTP
                          </label>
                          <div className="form-control-wrap ">
                            <OtpInput
                              value={otp}
                              onChange={setOtp}
                              numInputs={4}
                              inputType="tel"
                              shouldAutoFocus={true}
                              containerStyle={{ width: "100%" }}
                              inputStyle={{
                                padding: "15px",
                                width: "50px",
                                display: "flex",
                                justifyContent: "space-around",
                                marginRight: "15px",
                                border: "1px solid gray",
                                borderRadius: "8%",

                              }}
                              //   renderSeparator={<span>-</span>}
                              renderInput={(props) => <input {...props} />}
                            />
                            {otpError && (
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
                                {otpError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button
                            disabled={!otp}
                            className="btn btn-block btn-primary text-sm"
                            type="submit"
                            onClick={handleFormSubmission}
                          >
                            Send Reset Link
                          </button>

                          {/* {successMEssage && (
                        <p className="text-green-900 font-semibold">
                          {successMEssage}
                        </p>
                      )} */}

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
                  </form>
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
