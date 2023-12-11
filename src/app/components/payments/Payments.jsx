/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useMemo, useState } from "react";
import Header from "../header/header";
import "../dashboard/dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../footer/footer";
import { Accordion, Button } from "react-bootstrap";
import CryptoJS from "crypto-js";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import Dashboard from "../commonDashboard/Dashboard";
import { useTranslation } from "react-i18next";
import PaymentDetails from "./PaymentDetails";
export default function Payments() {
  const userData = useSelector((state) => state?.user?.value);
  const { t } = useTranslation();
  const [paymentsData, stePaymentsData] = useState();
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [activeOrderId, setActiveOrderId] = useState();
  const [orderDetails, setOrderDetails] = useState();

  useEffect(() => {
    if (activeTab == 1) {
      const tempPaymentCount = paymentsData?.filter(
        (payment) => payment?.status == 1
      );
      console.log(tempPaymentCount?.length);
      setPaymentsCount(tempPaymentCount?.length);
    } else if (activeTab == 2) {
      const tempPaymentCount = paymentsData?.filter(
        (payment) => payment?.status == 2
      );
      console.log(tempPaymentCount?.length);
      setPaymentsCount(tempPaymentCount?.length);
    } else {
      const tempPaymentCount = paymentsData?.filter(
        (payment) => payment?.status == 0
      );
      console.log(tempPaymentCount?.length);
      setPaymentsCount(tempPaymentCount?.length);
    }
  }, [activeTab]);

  console.log(userData);
  const dispatch = useDispatch();
  const fetchPaymentData = async () => {
    try {
      dispatch(showLoader());
      const response = await axios.get(
        "https://admin.tradingmaterials.com/api/client/get-payments",
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        console.log(response?.data?.data?.payments, "ord-");
        setActiveTab(1);
        // setActiveOrderId(response?.data?.data?.paments[0]?.order?.id)
        response.data?.data?.payments?.map((payment, ind) => {
          if (ind == 0) {
            return setActiveOrderId(payment?.order_id);
          } else {
            return;
          }
        });
        stePaymentsData(response?.data?.data?.payments);
        const tempPaymentCount = response?.data?.data?.payments?.filter(
          (payment) => payment?.status == 1
        );
        console.log(tempPaymentCount?.length);
        setPaymentsCount(tempPaymentCount?.length);
        console.log(paymentsData);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const memoizedOrderDetails = useMemo(() => {
    const getOrderDetails = async () => {
      try {
        dispatch(showLoader());
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/client/view-order?id=${activeOrderId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("client_token"),
            },
          }
        );

        if (response?.data?.status) {
          setOrderDetails(response?.data?.data?.order);
        }
      } catch (err) {
        console.log(err, "err");
      } finally {
        dispatch(hideLoader());
      }
    };

    return getOrderDetails;
  }, [activeOrderId]);

  useEffect(() => {
    const Orderdata = memoizedOrderDetails;
    Orderdata();
  }, [activeOrderId]);

  return (
    <>
      <div className="nk-app-root">
        <Header />

        <main className="nk-pages ">
          <Dashboard />
          <section className="nk-section ">
            <div className="nk-mask blur-1 left center"></div>
            <div className="container">
              <PaymentDetails />
            </div>
          </section>
          <section className="nk-section nk-cta-section nk-section-content-1">
            <div className="container">
              <div
                className="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="row g-gs align-items-center">
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
    </>
  );
}
