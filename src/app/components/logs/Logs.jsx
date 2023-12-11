import React, { useEffect, useState } from "react";
import Header from "../header/header";
import "./logs.css";
import Footer from "../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import moment from "moment";
import { FaClockRotateLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
export default function Logs() {
  const [logs, setLogs] = useState();
  const dispatch = useDispatch();
  const loaderState = useSelector((state) => state?.loader?.value);
 const { t } = useTranslation();
  useEffect(() => {
    const viewOrderDetails = async () => {
      try {
        dispatch(showLoader());
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/client/get-logs`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("client_token"),
            },
          }
        );

        if (response?.data) {
          setLogs(response?.data?.data?.logs);
        }
      } catch (err) {
        console.log(err, logs);
      } finally {
        dispatch(hideLoader());
      }
    };

    viewOrderDetails();
  }, []);
    
    // eslint-disable-next-line react/prop-types
    const TimeAgo = (createdAt ) => {
        const now = moment()
        const createdat = moment(createdAt)
        const timeDifference = now.diff(createdat, "seconds");
        console.log(createdAt, timeDifference, "tfd", 60 * 60 * 1000);

      if (timeDifference < 60) {
        // Less than a minute
        return <span>Just now</span>;
      } else if (timeDifference < 3600) {
        // Less than an hour
        const minutesAgo = Math.floor(timeDifference / (60));
        return <span>{minutesAgo} minutes ago</span>;
      } else if (timeDifference < 24 * 60 * 60 ) {
        // Less than a day
        const hoursAgo = Math.floor(timeDifference / (60 * 60 ));
        return <span>{hoursAgo} hours ago</span>;
      } else {
        // More than a day
        const daysAgo = Math.floor(timeDifference / (24 * 60 * 60 ));
        return <span>{daysAgo} days ago</span>;
      }
    };


  return (
    <>
      <div className="nk-body" data-navbar-collapse="xl">
        {loaderState && (
          <div className="preloader">
            <div className="loader"></div>
          </div>
        )}
        <div className="nk-app-root">
          <Header />
          <main className="nk-pages">
            <section className="nk-section pt-120 pt-lg-100">
              <div className="nk-mask blur-1 left center"></div>
              <div className="container">
                <div className="row mt-1">
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header px-3 py-2 d-flex align-items-center justify-content-between flex-wrap">
                        <div className="d-flex align-items-center">
                          <h5 className="text-muted mb-0">Logs</h5>
                        </div>
                      </div>
                      <div className="card-body max-h-[75vh] overflow-y-auto">
                        <div className="timeline text-left">
                          {logs?.map((logInfo, ind) => (
                            <div
                              className="timeline-container primary"
                              key={ind}
                            >
                              <div className="timeline-icon flex items-center justify-center">
                                <FaClockRotateLeft className="fa-solid fa-clock-rotate-left" />
                              </div>
                              <div className="timeline-body">
                                <h4 className="timeline-title">
                                  <span className="badge">
                                    {logInfo?.action}
                                  </span>
                                </h4>
                                <p>{logInfo?.result}</p>
                                <p className="timeline-subtitle">
                                  {TimeAgo(logInfo?.created_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {logs?.length == 0 && <p>No logs found</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="nk-section nk-cta-section nk-section-content-1">
              <div className="container">
                <div
                  className="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div
                    className="row g-gs align-items-center"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="col-lg-8">
                      <div className="media-group flex-column flex-lg-row align-items-center">
                        <div className="media media-lg media-circle media-middle text-bg-white text-primary mb-2 mb-lg-0 me-lg-2">
                          <em className="icon ni ni-chat-fill"></em>
                        </div>
                        <div className="text-center text-lg-start">
                          <h3 className="text-capitalize m-0 !text-3xl !font-bold">
                            {t("Chat_With_Our_Support_Team")}
                          </h3>
                          <p className="fs-16 opacity-75 !text-lg mt-1">
                            {t("chat_team_desc")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 text-center text-lg-end">
                      <a
                        href={`/contactus`}
                        className="btn btn-white fw-semiBold"
                      >
                        {t("Contact_support")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
