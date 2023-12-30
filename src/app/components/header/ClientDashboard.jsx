/* eslint-disable no-unused-vars */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import { logoutUser } from "../../../features/login/loginSlice";
import { updateNotifications } from "../../../features/notifications/notificationSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function ClientDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state?.user?.value);
  const { encryptedrderId, token } = useParams();

  async function handleLogout() {
    try {
      dispatch(showLoader());
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/auth/logout",
        { client_id: userData?.client?.id },
        {
          headers: {
            Authorization: `Bearer ${token ? token : sessionStorage.getItem("tempClientToken")}`,
            Accept: "application/json",
          },
        }
      );

      if (response?.status) {
        dispatch(logoutUser());
        localStorage.removeItem("client_token");
        dispatch(updateNotifications({ type: "", message: "" }));
        window.location.href = `https://client.tradingmaterials.com`;
        // window.location.reload();
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      dispatch(hideLoader());
    }
  }

  return (
    <>
      <section className="pt-100">
        <div className="container">
          <div className="row flex items-center">
            <div className="col-lg-12 sbreadcrumb">
              <div className="row flex items-center">
                <div className="col-lg-6 lcard text-left">
                  <div className="flex flex-wrap  items-center gap-3 mb-3">
                    {userData?.client?.profile?.profile_image?.length > 0 ? (
                      <img
                        src={userData?.client?.profile?.profile_image}
                        alt="profile-pic"
                      />
                    ) : (
                      <img src="/images/blueProfile.webp" alt="profile-pic" />
                    )}
                    <div>
                      <span>
                        <strong>
                          {userData?.client?.first_name}{" "}
                          {userData?.client?.last_name}
                        </strong>
                      </span>
                      <div>
                        <span className="s-color">
                          {" "}
                          {userData?.client?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`col-lg-6 !text-start sm:!text-end sm:rcard`}>
                  <div className="">
                    <button
                      type="button"
                      className="btn btn-light btn-sm shadow me-2 rounded custom-btn"
                      name="button"
                      onClick={() => {
                        window.location.href = "https://client.tradingmaterials.com/profile";
                      }}
                    >
                      <i className="fa-solid fa-file-invoice me-1"></i> Profile
                    </button>
                    <button
                      type="button"
                      className="btn btn-light btn-sm shadow me-2 rounded custom-btn"
                      name="button"
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-file-invoice me-1"></i> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
