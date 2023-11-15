import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import { hideLoader } from "../../../features/loader/loaderSlice";
import { logoutUser } from "../../../features/login/loginSlice";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateUsers } from "../../../features/users/userSlice";
import { updateCart } from "../../../features/cartItems/cartSlice";
import { updateCartCount } from "../../../features/cartWish/focusedCount";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "animate.css";
import SessionExpired from "../modals/sessionExpired";
// import CryptoJS from "crypto-js";

export default function AutoLogin() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { access_token } = useParams();
  const notifications = useSelector((state) => state?.notification?.value);
  const isLoading = useSelector((state)=> state?.loader?.value)

  const [showSessionExpiry, setShowSessionExpiry] = useState(false)

  console.log(access_token, "actoken");
  const getUserInfo = async () => {
    console.log(location.pathname.includes("/product-detail"));
    try {
      const response = await axios.get(
        "https://admin.tradingmaterials.com/api/client/get-user-info",
        {
          headers: {
            Authorization: `Bearer ` + access_token,
            Accept: "application/json",
          },
        }
      );

      if (response?.data?.status) {
        console.log(response?.data);
        localStorage.setItem("client_token", access_token);
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        dispatch(updateCartCount(response?.data?.data?.client?.cart_count));
        navigate("/products")
        // navigate(
        //   `/orders/${CryptoJS?.AES?.encrypt(
        //     `${localStorage.getItem("client_token")}`,
        //     "order_details"
        //   )
        //     ?.toString()
        //     .replace(/\//g, "_")
        //     .replace(/\+/g, "-")}`
        // );
      } else {
        console.log(response?.data);
        if (
          location.pathname === "/products" ||
          location.pathname.includes("/product-detail")
        ) {
          localStorage.removeItem("client_token");
          dispatch(logoutUser());
        } else {
          dispatch(
            updateNotifications({
              type: "warning",
              message: response?.data?.message,
            })
          );
        }
        // navigate("/login")
      }
    } catch (err) {
      console.log(err);
      setShowSessionExpiry(true)
    } finally {
      dispatch(hideLoader());
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (notifications?.message !== "") {
      showAlert();
    }
  }, [notifications]);

  const showAlert = () => {
    if (notifications?.type === "warning") {
      Swal.fire({
        title: notifications?.message,
        showCloseButton: false,
        // timer: 1000,
        timerProgressBar: true,
        icon: notifications?.type,
        html: `<a className="swalLink" style="font-weight: bold;
        cursor: pointer;
        box-shadow: none !important;
        outline: none !important;
        font-size: small;
        display: flex;
        align-items: center;
        justify-content: center;" href=/ ><svg style="width:25px; height:25px; scale:0.7; fill:#545454 !important; font-weight:bold !important" xmlns="http://www.w3.org/2000/svg" viewBox="0,0,5" > <g> <path fill="none" d="M0 0h24v24H0z"/> <path d="M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H8z"/> </g> </svg>Back to home</a>`,
        footer: `<a className="swalLink font-bold focus:outline-none" style="font-weight:bold;cursor: pointer;box-shadow: none !important;
        outline: none !important; font-size:small;color: #54a8c7 !important;" autofocus=false href=/login>Login here</a>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        willClose: () => {
          dispatch(updateNotifications({ message: "", type: "" }));
        },
      });
    } else {
      Swal.fire({
        title: notifications?.message,
        showCloseButton: true,
        // timer: 1000,
        timerProgressBar: true,
        icon: notifications?.type,
        // footer: '<a className="font-bold" style="font-weight:bold;cursor: pointer" href="/login">Click here to login</a>',
        // showConfirmButton: false,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        willClose: () => {
          dispatch(updateNotifications({ message: "", type: "" }));
        },
      });
    }
  };

  function handleSessionExpiryClose (){
    setShowSessionExpiry(false)
    navigate("/login")
}


  return (
    <>
            <SessionExpired open={showSessionExpiry} handleClose={handleSessionExpiryClose}/>

      {isLoading && <div className="preloader !backdrop-blur-[1px] ">
      <div className="loader"></div>
    </div>}
    </>
  );
}
