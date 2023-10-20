import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
const Countdown = ({ targetDate, loaderStatus }) => {
  const { t } = useTranslation();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(()=>{
    if(targetDate == ""){
      setShowLoader(true)
    }
  },[])

  const calculateTimeLeft = () => {
    // setShowLoader(true)
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else if (difference <= 0) {
      timeLeft = {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }
    setShowLoader(false);
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <ul className="nk-countdown" data-date="6-9-2023" data-time="12:00">
      {/* <li>
        <div className="nk-countdown-content day">
          <span className={`num m-0 h3 d-inline-block ${(!loaderStatus || !showLoader) ? "!font-bold" : ""} text-primary`}>
            {loaderStatus || showLoader ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              timeLeft?.days
            )}
          </span>
          <p className="word text-uppercase text-gray-800">{t("days")}</p>
        </div>
      </li> */}
      <li>
        <div className="nk-countdown-content hour">
          <span
            className={`num m-0 h3 d-inline-block ${
              !loaderStatus || !showLoader ? "!font-bold" : ""
            } text-primary`}
          >
            {loaderStatus || showLoader ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              timeLeft?.hours
            )}
          </span>
          <p className="word text-uppercase text-gray-800">{t("hours")}</p>
        </div>
      </li>
      <li>
        <div className="nk-countdown-content min">
          <span
            className={`num m-0 h3 d-inline-block ${
              !loaderStatus || !showLoader ? "!font-bold" : ""
            } text-primary`}
          >
            {loaderStatus || showLoader ? (
              <Spinner
                className="!font-normal"
                animation="border"
                variant="primary"
              />
            ) : (
              timeLeft?.minutes
            )}
          </span>
          <p className="word text-uppercase text-gray-800">{t("minutes")}</p>
        </div>
      </li>
      <li>
        <div className="nk-countdown-content  sec">
          <span
            className={`num m-0 h3 d-inline-block ${
              !loaderStatus || !showLoader ? "!font-bold" : ""
            } text-primary`}
          >
            {loaderStatus || showLoader ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              timeLeft?.seconds
            )}
          </span>
          <p className="word text-uppercase  text-gray-800">{t("seconds")}</p>
        </div>
      </li>
    </ul>
  );
};

export default Countdown;
