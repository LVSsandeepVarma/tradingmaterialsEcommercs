import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import { hideLoader } from "../../../features/loader/loaderSlice";
import { logoutUser } from "../../../features/login/loginSlice";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateUsers } from "../../../features/users/userSlice";
import { updateCart } from "../../../features/cartItems/cartSlice";
import { updateCartCount } from "../../../features/cartWish/focusedCount";
import CryptoJS from "crypto-js";

export default function AutoLogin() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { access_token } = useParams();

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
        navigate(
          `/orders/${CryptoJS?.AES?.encrypt(
            `${localStorage.getItem("client_token")}`,
            "order_details"
          )
            ?.toString()
            .replace(/\//g, "_")
            .replace(/\+/g, "-")}`
        );
      } else {
        console.log(response?.data);
        if (
          location.pathname === "/" ||
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
    } finally {
      dispatch(hideLoader());
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div className="preloader !backdrop-blur-[1px] ">
      <div className="loader"></div>
    </div>
  );
}
