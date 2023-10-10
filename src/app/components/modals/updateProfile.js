// Title: Profile Incomplete !!
// We did'nt get Your name and some icons/images
// input field

import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import axios from "axios";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import { logoutUser } from "../../../features/login/loginSlice";
import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
import { updateUsers } from "../../../features/users/userSlice";
import { updateCart } from "../../../features/cartItems/cartSlice";
import { updateCartCount, updateWishListCount } from "../../../features/cartWish/focusedCount";
import { useNavigate } from "react-router-dom";
import SessionExpired from "./sessionExpired";

// eslint-disable-next-line react/prop-types
export default function UpdateProfile({ open, handleClose }) {
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const isLoggedIn = useSelector((state) => state.login?.value);
  const clientType = localStorage.getItem("client_type");




  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState();
  // eslint-disable-next-line no-unused-vars
  const [apiResponse, setApiResponse] = useState([]);
  const [showSessionExppiry, setShowSessionExpiry] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch();

  function validName(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      setNameErr("Full name is required");
      return false;
    }else if (!namePattern.test(name)) {
      setNameErr("Full name should contain only alphabets");
      return false;
    } else if (name?.length < 3) {
      setNameErr("Min 3 characters are required");
    } else if (name?.length > 100) {
      setNameErr("Max 100 characters are required");
    }  else {
      setNameErr("");
      return true;
    }
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
    validName(e.target.value);
  };

  
  const getUserInfo = async () => {
    console.log(location.pathname.includes("/product-detail"));
    if (isLoggedIn) {
      try {
        const url =
          clientType === "client"
            ? "https://admin.tradingmaterials.com/api/get-user-info"
            : "https://admin.tradingmaterials.com/api/lead/get-user-info";
        const headerData =
          clientType === "client"
            ? {
                headers: {
                  Authorization:
                    `Bearer ` + localStorage.getItem("client_token"),
                  Accept: "application/json",
                },
              }
            : {
                headers: {
                  "access-token": localStorage.getItem("client_token"),
                  Accept: "application/json",
                },
              };

        const response = await axios.get(url, headerData);

        if (response?.data?.status) {
          console.log(response?.data);
          dispatch(updateUsers(response?.data?.data));
          dispatch(updateCart(response?.data?.data?.client?.cart));
          dispatch(updateCartCount(response?.data?.data?.client?.cart_count));
          dispatch(
            updateWishListCount(response?.data?.data?.client?.wishlist_count)
          );
        } else {
          console.log(response?.data);
          if (
            location.pathname === "/" ||
            location.pathname.includes("/product-detail")
          ) {
            localStorage.removeItem("client_token");
            dispatch(logoutUser());
            sessionStorage.removeItem("offerPhone")
            sessionStorage.removeItem("expiry")
          } else {
            dispatch(
              updateNotifications({
                type: "warning",
                message: "Oops!",
              })
            );
          }
          // navigate("/login")
        }
      } catch (err) {
        console.log(err);
        if (
          location.pathname === "/" ||
          location.pathname.includes("/product-detail") ||
          location.pathname.includes("/terms-and-conditions") ||
          location.pathname.includes("/privacy-policy") ||
          location.pathname.includes("/refund-policy") ||
          location.pathname.includes("/contact") ||
          location.pathname.includes("/about")
        ) {
          localStorage.removeItem("client_token");
          dispatch(logoutUser());
          sessionStorage.removeItem("offerPhone")
            sessionStorage.removeItem("expiry")
        } else {
          dispatch(
            updateNotifications({
              type: "warning",
              message: "Oops!",
            })
          );
        }
      } finally {
        dispatch(hideLoader());
      }
    } else {
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
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validName(name)) {
      try {
        dispatch(showLoader());
        console.log(name, "namm");
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/lead/update-name",
          { fullname: name },
          { headers: { "access-token": localStorage.getItem("client_token") } }
        );
        if (response?.data?.status) {
          setStatus(response?.data?.status);
          setApiResponse([response?.data?.message]);
          getUserInfo()
        }
        setTimeout(() => {
          handleClose();
        }, 1500);
      } catch (err) {
        console.log(err);
        setStatus(err?.response?.data?.status);
        if (err?.response?.data?.errors) {
          setApiResponse([Object.values(err?.response?.data?.errors)]);
        } else {
          setApiResponse([err?.response?.data?.message]);
        }
      } finally {
        dispatch(hideLoader());
      }
    }
  };

  function handleSessionExpiryClose (){
    setShowSessionExpiry(false)
    navigate("/?login")
}

  return (
    <>
    <SessionExpired open={showSessionExppiry} handleClose={handleSessionExpiryClose}/>
      <Dialog open={open} keepMounted={true} fullWidth>
        <DialogTitle className=" drop-shadow-lg text-center bg-transparent">
          Profile Incomplete !
        </DialogTitle>
        <DialogContent className="hover:drop-shodow-lg">
          <div className="flex items-center">
            <div className="col-md-3 justify-center">
              <PersonSearchIcon className="drop-shadow-lg !w-[100px] h-25" />
            </div>
            <div className="col-md-9">
              <p className="font-semibold !drop-shadow-xl mb-2 flex items-center">
                {" "}
                We didn&apos;t get your name{" "}
              </p>
              {/* <label htmlFor="nameField"> Enter your name</label> */}
              <div className="flex justify-center gap-1">
                <input
                  id="nameField"
                  placeholder="Your Name"
                  value={name}
                  className="form-control drop-shadow-lg !text-xs mt-1 mb-1 shadow-xl"
                  onChange={handleNameChange}
                />
                <div className="buttonss-off cursor-pointer">
                  <a
                    type="submit"
                    className="cart-btn drop-shadow-lg"
                    style={{ borderRadius: "8px" }}
                    onClick={handleSubmit}
                  >
                    Save
                  </a>
                </div>
              </div>
              <div style={{ display: "inline-block" }}>
                {nameErr && (
                  <p className=" nk-message-error !font-bold mb-1 drop-shadow-lg !text-sm !text-left">
                    {nameErr}
                  </p>
                )}
                {apiResponse?.length > 0 &&
                  apiResponse?.map((msg, ind) => (
                    <p
                      key={ind}
                      className={` ${
                        status ? "!text-green-600" : "nk-message-error"
                      } !font-bold mb-1 drop-shadow-lg !text-sm !text-left`}
                    >
                      {msg}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
