import React, { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hidePopup } from "../../../features/popups/popusSlice";
// import { Checkbox, CircularProgress, FormControlLabel } from "@mui/material";
// import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import { updateUsers } from "../../../features/users/userSlice";
import { updateclientType } from "../../../features/clientType/clientType";
import { loginUser } from "../../../features/login/loginSlice";
import { CircularProgress } from "@mui/material";

// eslint-disable-next-line react/prop-types
export default function Offer() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [apiErr, setApiErr] = useState([]);
  const [userIp, setUserIp] = useState("");
  const [emailVerificationStatus, setEmailVerificationStatus] = useState(false);
  const [emailVerifyLoader, setEmailVerifyLoader] = useState(false);
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [userType, setUserType] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [checkboxChecked, setCheckboxChecked] = useState(true);

  const loaderState = useSelector((state) => state?.loader?.value);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
  }, []);

  useEffect(() => {
    setPhone("");
  }, [userType, emailVerificationStatus]);

  async function handleEmailVerification(emailid) {
    if (emailid != "") {
      try {
        setEmailVerifyLoader(true);
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/email/check",
          { email: emailid },
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          console.log(response?.data);
          setUserType("");
        }
      } catch (err) {
        console.log(err);

        if (
          err?.response?.data?.errors["email"] ==
          "The email has already been taken."
        ) {
          setEmailVerificationStatus(true);
          if (err?.response?.data?.type == "lead") {
            setUserType("lead");

            // setTimeout(()=>{
            //   dispatch(hidePopup())
            // },1000)
          } else if (err?.response?.data?.type == "client") {
            setUserType("client");
            setTimeout(() => {
              window.location.href =
                "https://client.tradingmaterials.com/login";
            }, 1000);
          } else {
            setUserType("");
          }
        }
      } finally {
        setEmailVerifyLoader(false);
      }
    }
  }

  function handleNameChange(e) {
    e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, "");
    setName(e?.target?.value);
  }

  function ispasswordValid(password) {
    if (password?.length === 0) {
      setPhoneErr("Password is required");
    } else if (password?.length > 15) {
      setPhoneErr("Maximum limit exceeded");
    } else {
      setPhoneErr("");
    }
  }

  function handleNaveValidation(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      setNameErr("Name is required");
      return false;
    } else if (!namePattern.test(name)) {
      setNameErr("Name should contain only alphabets");
      return false;
    } else if (name?.length < 3) {
      setNameErr("Min 3 characters are required");
    } else if (name?.length > 100) {
      setNameErr("Max 100 characters are required");
    } else {
      setNameErr("");
      return true;
    }
  }

  function emailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    if (email === "") {
      setEmailErr("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailErr("Invalid email format");
    } else {
      setEmailErr("");
    }
  }

  function userEmailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    if (email === "") {
      return false;
    } else if (!emailRegex.test(email)) {
      return false;
    } else {
      return true;
    }
  }

  // Validate mobile number function (example)
  const isValidMobile = (mobile) => {
    const phoneRegex = /^[0-9]+$/;
    if (mobile?.length === 0) {
      setPhoneErr("Phone number is required");
    } else if (!phoneRegex.test(mobile)) {
      setPhoneErr("Invalid Phone number");
    } else if (mobile?.length <= 7) {
      setPhoneErr("Phone number should contain 8 - 15 digits only");
    } else if (mobile?.length > 15) {
      setPhoneErr("Phone number should contain 8 - 15 digits onlyr");
    } else {
      setPhoneErr("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e?.target?.value);
    // emailValidaiton(e?.target?.value);
    if (userEmailValidaiton(e?.target?.value)) {
      handleEmailVerification(e?.target?.value);
    } else if (e?.target?.value == "") {
      setUserType("");
    }
  };

  const handlePhonechange = (e) => {
    if (userType == "") {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
      setPhone(e.target.value);
    } else {
      setPhone(e.target.value);
    }
    // isValidMobile(e.target.value);
  };

  const handleUserLogin = async () => {
    // e.preventDefault()
    try {
      dispatch(showLoader());
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/auth/login",
        {
          email: email,
          password: phone,
        }
      );
      if (response?.data?.status) {
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
          window.open(
            `https://client.tradingmaterials.com/auto-login/${localStorage.getItem(
              "client_token"
            )}`,
            "_blank"
          );
        }
        dispatch(hidePopup());
      }
    } catch (err) {
      console.log("err", err);
      if (err?.response?.data?.errors) {
        setEmailErr(err?.response?.data?.errors["email"]);
        setPhoneErr(err?.response?.data?.errors["password"]);
        // setApiError([...Object?.values(err?.response?.data?.errors)]);
      } else {
        console.log(err?.response);
        setApiErr([err?.response?.data?.message]);
      }
      setTimeout(() => {
        setApiErr([]);
        setSuccessMsg("");
      }, 2000);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleSubmit = async () => {
    setApiErr([]);
    isValidMobile(phone);
    emailValidaiton(email);
    handleNaveValidation(name);

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
    if (
      emailErr === "" &&
      email !== "" &&
      phoneErr === "" &&
      phone !== "" &&
      name != "" &&
      nameErr == "" &&
      apiErr?.length === 0
    ) {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/discount/store",
          {
            name: name,
            email: email,
            phone: phone,
            domain: "www.tradingmaterials.com",
            ip_add: userIp,
          },
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          setSuccessMsg(response?.data?.message);
          handleUserLogin();
          setTimeout(() => {
            // dispatch(hidePopup());
            sessionStorage.setItem("offerCodeClaimed", true);
            setApiErr([]);
            setSuccessMsg("");
            //   dispatch(
            //     usersignupinModal({
            //       showSignupModal: false,
            //       showLoginModal: true,
            //       showforgotPasswordModal: false,
            //       showOtpModal: false,
            //       showNewPasswordModal: false,
            //       showSignupCartModal: false,
            //       showSignupBuyModal: false,
            //     })
            //   );
          }, 2000);
        }
      } catch (err) {
        if (err?.response?.data?.errors) {
          setEmailErr(err?.response?.data?.errors["email"]);
          setPhoneErr(err?.response?.data?.errors["phone"]);
        } else {
          setApiErr([err?.response?.data?.message]);
        }
      } finally {
        dispatch(hideLoader());
      }
    }
  };

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      {emailVerificationStatus && userType == "client" && (
        <small className="!text-blue-600 mb-2 block !w-full !text-left">
          This email is already registered.
        </small>
      )}
      <form action="#" method="#" className="login">
        {userType == "" && (
          <>
            <div className="form__field mb-0 mt-0">
              <div className="flex items-center relative w-full">
                {
                  <img
                    src="/images/user.webp"
                    alt="email"
                    className="ml-2 absolute right-[87%] !w-[20px] !h-[20px]"
                  />
                }

                <input
                  id="login__username"
                  type="text"
                  maxLength={100}
                  name="name"
                  onChange={handleNameChange}
                  onBlur={() => {
                    handleNaveValidation(name);
                  }}
                  className="input-fields-1 mb-0 !pl-14"
                  placeholder="Name"
                  required=""
                  aria-autocomplete="list"
                />
              </div>
            </div>
            {nameErr && (
              <p className="nk-message-error pl-8 pt-0 mt-0 texxt-xs text-left">
                {nameErr}
              </p>
            )}
          </>
        )}

        <div className="form__field mb-0">
          <div className="flex items-center relative w-full">
            {
              <img
                src="/images/email.webp"
                alt="email"
                className="ml-2 absolute right-[87%] !w-[20px] !h-[20px]"
              />
            }
            <input
              id="login__username"
              type="email"
              name="email"
              onChange={handleEmailChange}
              onBlur={() => {
                emailValidaiton(email), handleEmailVerification(email);
              }}
              className="input-fields-2 mb-0 !pl-14"
              placeholder="Email address"
              required=""
            />
            {emailVerifyLoader && (
              <CircularProgress className="ml-2 absolute right-[10px] !w-[20px] !h-[20px]" />
            )}
          </div>
        </div>
        {emailErr && (
          <p className="nk-message-error pl-8 texxt-xs text-left">{emailErr}</p>
        )}

        <div className="form__field  mb-0">
          <div className="flex items-center w-full relative">
            {
              <img
                src={
                  userType == "lead"
                    ? "/images/password.webp"
                    : "/images/call.webp"
                }
                alt="email"
                className="ml-2 absolute right-[87%] !w-[20px] !h-[20px]"
              />
            }

            <input
              id="login__username"
              maxLength={15}
              type="text"
              name="phone"
              onChange={handlePhonechange}
              onBlur={() => {
                if (userType == "") {
                  isValidMobile(phone);
                } else {
                  ispasswordValid(phone);
                }
              }}
              value={phone}
              className={` ${
                userType == "" ? "input-fields-3" : "input-fields-3-password"
              } mb-0 !pl-14`}
              placeholder={userType == "" ? "Mobile" : "Password"}
              required=""
            />
          </div>
        </div>
        {phoneErr && (
          <p className="nk-message-error pl-8 texxt-xs text-left">{phoneErr}</p>
        )}

        <div className="form__field">
          <button
            // disabled={!checkboxChecked}
            onClick={(e) => {
              e.preventDefault();
              if (userType == "lead") {
                handleUserLogin();
              } else {
                handleSubmit();
              }
            }}
            className="btn btn-block btn-primary-2 hover:!bg-blue-600 !normal-case !rounded-[50px] "
          >
            Click here to login
          </button>
        </div>
        <p
          className="text-sm text-center text-primary cursor-pointer antialiased "
          onClick={() => dispatch(hidePopup())}
        >
          Back to Shop
        </p>
        {successMsg?.length > 0 && (
          <p className="text-green-900 text-sm">{successMsg}</p>
        )}
        {apiErr?.length > 0 &&
          apiErr?.map((err, ind) => {
            return (
              <p key={ind} className="text-red-600 text-sm ">
                {err}
              </p>
            );
          })}

        <div className="form__field text-center">
          <div className="terms-tex-2 mt-2 text-lg">
            <p>
              By signing up, you agree to our <br />
              <a className="text-success">Terms and conditions</a> and
              <a className="text-success"> Privacy Policy</a>.{" "}
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
