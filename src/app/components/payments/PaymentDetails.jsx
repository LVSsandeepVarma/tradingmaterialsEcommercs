/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useMemo, useState } from "react";
import Header from "../header/header";
import "../dashboard/dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../footer/footer";
import { Button } from "react-bootstrap";
import CryptoJS from "crypto-js";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import Dashboard from "../commonDashboard/Dashboard";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
export default function PaymentDetails() {
  const userData = useSelector((state) => state?.user?.value);
  const { t } = useTranslation();
  const [paymentsData, stePaymentsData] = useState();
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [activeOrderId, setActiveOrderId] = useState();
  const [paymentId, setPaymentId] = useState()
  const [orderDetails, setOrderDetails] = useState();

  useEffect(() => {
    if (activeTab == 1) {
      const tempPaymentCount = paymentsData?.filter(
        (payment) => payment?.status == 1
      );
      setPaymentsCount(tempPaymentCount?.length);
    } else if (activeTab == 2) {
      const tempPaymentCount = paymentsData?.filter(
        (payment) => payment?.status == 2
      );
      setPaymentsCount(tempPaymentCount?.length);
    } else {
      const tempPaymentCount = paymentsData?.filter(
        (payment) => payment?.status == 0
      );
      setPaymentsCount(tempPaymentCount?.length);
    }
  }, [activeTab]);

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
        setActiveTab(1);
        // setActiveOrderId(response?.data?.data?.paments[0]?.order?.id)
        response.data?.data?.payments?.map((payment, ind) => {
          if (ind == 0) {
            // setPaymentId(payment?.payment_id)
            setActiveOrderId(payment?.order_id);
            return

          } else {
            return;
          }
        });
        stePaymentsData(response?.data?.data?.payments);
        const tempPaymentCount = response?.data?.data?.payments?.filter(
          (payment) => payment?.status == 1
        );
        setPaymentsCount(tempPaymentCount?.length);
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
      <div className="card">
        <div className="card-header px-3 py-2">
          <h5 className="text-muted text-left !font-bold text-lg">
            {activeTab == "1"
              ? "Success"
              : activeTab == "2"
              ? "Failed"
              : "Pending "}{" "}
            Payments{" "}
            <span className="badge bg-primary ms-2">{paymentsCount}</span>{" "}
          </h5>
        </div>
        <div className="card-body !p-0 ">
          <nav>
            <div className={`nav nav-tabs mb-3`} id="nav-tab" role="tablist">
              <button
                onClick={() => setActiveTab(1)}
                className={`nav-link ${
                  activeTab == 1 ? "active shadow-sm" : ""
                }`}
                id="nav-payment-success-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-payment-success"
                type="button"
                role="tab"
                aria-controls="nav-payment-success"
                aria-selected="true"
              >
                Order Payment Success
              </button>
              <button
                id="nav-payment-failed-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-payment-failed"
                type="button"
                role="tab"
                aria-controls="nav-payment-failed"
                aria-selected="false"
                className={`nav-link ${
                  activeTab == 2 ? "active shadow-sm" : ""
                } `}
                onClick={() => setActiveTab(2)}
              >
                Order Payment Failed
              </button>
              <button
                className={`nav-link ${
                  activeTab == 3 ? "active shadow-sm" : ""
                } `}
                onClick={() => setActiveTab(3)}
                id="nav-payment-pending-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-payment-pending"
                type="button"
                role="tab"
                aria-controls="nav-payment-pending"
                aria-selected="false"
              >
                Order Payment Pending
              </button>
            </div>
          </nav>
          <div
            className="tab-content rounded-b-[12px] p-3 border bg-light max-h-[500px] overflow-y-auto"
            id="nav-tabContent"
          >
            <div
              className={`card ${paymentsCount != 0 ? "" : "hidden"} `}
              data-aos="fade-up"
            >
              <div className="tab-pane fade active show">
                <div className="col-lg-12">
                  {paymentsCount > 0 &&
                    paymentsData?.map((payment, ind) => {
                      if (activeTab == 1 && payment?.status == "1") {
                        return (
                          <Accordion
                            id="accordion"
                            key={ind}
                            expanded={paymentId == payment?.payment_id}
                            disabled={payment?.order?.order_number == null}
                          >
                            <AccordionSummary
                              aria-controls="PaymentSuccessOne-content"
                              id="PaymentSuccessOne"
                              onClick={() => {
                                setActiveOrderId(payment?.order_id);
                                setPaymentId(payment?.payment_id);
                              }}
                              disabled={payment?.order?.order_number == null}
                            >
                              <button
                                className={`accordion-button accordion-success !px-2 ${
                                  paymentId != payment?.payment_id
                                    ? "collapsed"
                                    : ""
                                }`}
                                role="button"
                              >
                                {payment?.order != null ||
                                payment?.order?.order_number != null
                                  ? "#" + payment?.order?.order_number
                                  : "#Removed"}
                                <span className="fw-normal mx-1">
                                  |
                                  <span className="fs-12 fw-normal">
                                    {new Date(
                                      payment?.created_at
                                    ).toLocaleDateString("en-US", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </span>
                              </button>
                            </AccordionSummary>
                            <AccordionDetails>
                              <div id="collapseOne" className="">
                                <div>
                                  <div className="row">
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Payment Status
                                      </p>
                                      <span
                                        className={`badge bg-success fs-12`}
                                      >
                                        {payment?.payment_status
                                          ? payment?.payment_status
                                          : "Success"}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Payment id
                                      </p>
                                      <span className="text-dark block truncate">
                                        {payment?.payment_id}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Payment Type
                                      </p>
                                      <span className="text-dark">
                                        {payment?.payment_type}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Total Amount
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.total}
                                      </span>
                                    </div>
                                    <div className="col-lg-12 mb-1"></div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Discount
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.discount_amount}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Sub Total
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.sub_total}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Paid Amount
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.amount_paid}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Balance
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.balance_amount}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionDetails>
                          </Accordion>
                        );
                      } else if (activeTab == 2 && payment?.status == "2") {
                        return (
                          <Accordion
                            key={ind}
                            className={`panelone panel-default hover:drop-shadow-lg `}
                            expanded={paymentId == payment?.payment_id}
                            disabled={payment?.order?.order_number == null}
                          >
                            <AccordionSummary
                              id="PaymentSuccessOne"
                              onClick={() => {
                                setActiveOrderId(payment?.order_id);
                                setPaymentId(payment?.payment_id);
                              }}
                            >
                              <p
                                className={`accordion-button accordion-failed !px-2 ${
                                  paymentId != payment?.payment_id
                                    ? "collapsed"
                                    : ""
                                }`}
                              >
                                {payment?.order != null ||
                                payment?.order?.order_number != null
                                  ? "#" + payment?.order?.order_number
                                  : "#Removed"}
                                <span className="fw-normal mx-1">
                                  |
                                  <span className="fs-12 fw-normal">
                                    {new Date(
                                      payment?.created_at
                                    ).toLocaleDateString("en-US", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </span>
                              </p>
                            </AccordionSummary>
                            <AccordionDetails>
                              <div id="collapseOne" className="">
                                <div>
                                  <div className="row">
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Payment Status
                                      </p>
                                      <span className="badge bg-gradient-to-r from-[#dc0e0e] to-[#a22222] fs-12">
                                        {payment?.payment_status}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Payment id
                                      </p>
                                      <span className="block text-dark truncate">
                                        {payment?.payment_id}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Payment Type
                                      </p>
                                      <span className="text-dark">
                                        {payment?.payment_type}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Total Amount
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.total}
                                      </span>
                                    </div>
                                    <div className="col-lg-12 mb-1"></div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Discount
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.discount_amount}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Sub Total
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.sub_total}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Paid Amount
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.amount_paid}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Balance
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.balance_amount}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionDetails>
                          </Accordion>
                        );
                      } else if (activeTab == 3 && payment?.status == "0") {
                        return (
                          <Accordion
                            key={ind}
                            className={`panelone panel-default hover:drop-shadow-lg `}
                            expanded={paymentId == payment?.payment_id}
                            disabled={payment?.order?.order_number == null}
                          >
                            <AccordionSummary
                              id="PaymentSuccessOne"
                              onClick={() => {
                                setActiveOrderId(payment?.order_id);
                                setPaymentId(payment?.payment_id);
                              }}
                            >
                              {/* <h2 className="panel-title !p-0 !m-0 "> */}
                              <button
                                className={`accordion-button accordion-pending !px-2 ${
                                  paymentId != payment?.payment_id
                                    ? "collapsed"
                                    : ""
                                }`}
                                role="button"
                                data-toggle="collapse"
                                data-parent="#accordion"
                                // href="#collapseOne"
                                aria-expanded="false"
                                aria-controls="collapseOne"
                              >
                                {payment?.order != null ||
                                payment?.order?.order_number != null
                                  ? "#" + payment?.order?.order_number
                                  : "#Removed"}
                                <span className="fw-normal mx-1">
                                  |
                                  <span className="fs-12 fw-normal">
                                    {new Date(
                                      payment?.created_at
                                    ).toLocaleDateString("en-US", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </span>
                              </button>
                              {/* </h2> */}
                            </AccordionSummary>
                            <AccordionDetails>
                              <div id="collapseOne" className="">
                                <div>
                                  <div className="row">
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Payment Status
                                      </p>
                                      <span
                                        className={`badge bg-warning fs-12`}
                                      >
                                        {payment?.payment_status
                                          ? payment?.payment_status
                                          : "Pending"}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Payment id
                                      </p>
                                      <span className="text-dark block truncate">
                                        {payment?.payment_id}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Payment Type
                                      </p>
                                      <span className="text-dark">
                                        {payment?.payment_type}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Total Amount
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.total}
                                      </span>
                                    </div>
                                    <div className="col-lg-12 mb-1"></div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Discount
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.discount_amount}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Sub Total
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.order?.sub_total}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Paid Amount
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.paid_amount}
                                      </span>
                                    </div>
                                    <div className="col-6 col-lg-3 mb-1">
                                      <p className="mb-0 text-muted fw-bold">
                                        Balance
                                      </p>
                                      <span className="text-dark">
                                        {payment?.order?.currency == "INR"
                                          ? "₹"
                                          : "$"}
                                        {payment?.balance_amount}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionDetails>
                          </Accordion>
                        );
                      }
                    })}
                </div>
              </div>
              {/* </div> */}
            </div>
            {paymentsCount == 0 && (
              <p className="text-center w-full font-bold text-lg">
                No Payments Found
              </p>
            )}
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    </>
  );
}
