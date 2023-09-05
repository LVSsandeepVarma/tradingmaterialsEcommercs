import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Countdown = ({ targetDate }) => {
  const { t } = useTranslation();

  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference>0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }else if(difference <= 0){
      timeLeft = {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <ul className="nk-countdown" data-date="6-9-2023" data-time="12:00">
      <li>
        <div className="nk-countdown-content day">
          <span className="num m-0 h3 d-inline-block !font-bold text-primary">
            {timeLeft?.days}
          </span>
          <p className="word text-uppercase text-gray-800">{t("days")}</p>
        </div>
      </li>
      <li>
        <div className="nk-countdown-content hour">
          <span className="num m-0 h3 d-inline-block !font-bold text-primary">
            {timeLeft?.hours}
          </span>
          <p className="word text-uppercase text-gray-800">{t("hours")}</p>
        </div>
      </li>
      <li>
        <div className="nk-countdown-content min">
          <span className="num m-0 h3 d-inline-block !font-bold text-primary">
            {timeLeft?.minutes}
          </span>
          <p className="word text-uppercase text-gray-800">{t("minutes")}</p>
        </div>
      </li>
      <li>
        <div className="nk-countdown-content sec">
          <span className="num m-0 h3 d-inline-block !font-bold text-primary">
            {timeLeft?.seconds}
          </span>
          <p className="word text-uppercase text-gray-800">{t("seconds")}</p>
        </div>
      </li>
    </ul>
  );
};

export default Countdown;
