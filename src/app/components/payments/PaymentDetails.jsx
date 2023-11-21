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
            setPaymentId(payment?.payment_id)
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
      <div className="card" data-aos="fade-up">
        <div class="card-header px-3 py-2">
          <h5 class="text-muted text-left">
            Your Payments{" "}
            <span class="badge bg-primary ms-2">{paymentsCount}</span>{" "}
          </h5>
        </div>
        <div className="card-body !p-0">
          <nav>
            <div className={`nav nav-tabs mb-3`} id="nav-tab" role="tablist">
              <button
                onClick={() => setActiveTab(1)}
                className={`nav-link ${activeTab == 1 ? "active" : ""} `}
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
                className={`nav-link ${activeTab == 2 ? "active" : ""} `}
                onClick={() => setActiveTab(2)}
              >
                Order Payment Failed
              </button>
              <button
                className={`nav-link ${activeTab == 3 ? "active" : ""} `}
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
            className="tab-content rounded-b-[12px] p-3 border bg-light"
            id="nav-tabContent"
          >
            <div
              className={`card ${paymentsCount != 0 ? "" : "hidden"} `}
              data-aos="fade-up"
            >
              {/* <div
                        className={`card-header ${
                          activeTab == 1
                            ? "!bg-green-200 border"
                            : activeTab == 2
                            ? "!bg-red-300"
                            : "!bg-orange-300"
                        } px-3 bg- py-1`}
                      >
                       
                        <h5 className={`text-muted  !m-0`}>
                          Your Payments{" "}
                          <span
                            className={`badge ${
                              activeTab == 1
                                ? "bg-success"
                                : activeTab == 2
                                ? "bg-danger"
                                : "bg-warning"
                            } border-r-3 ms-2`}
                          >
                            {paymentsCount}
                          </span>{" "}
                        </h5>
                      </div> */}
              {/* <div className="card-body"> */}
              <div className="tab-pane fade active show">
                <div className="col-lg-12">
                  {paymentsCount > 0 && (
                    <Accordion
                      defaultActiveKey="1"
                      className="panel-group"
                      id="accordion"
                      role="tab"
                      aria-multiselectable="true"
                    >
                      {paymentsData?.map((payment, ind) => {
                        if (activeTab == 1 && payment?.status == "1") {
                          return (
                            <Accordion.Item
                              key={ind}
                              className={`panelone panel-default hover:drop-shadow-lg `}
                              eventKey={`${ind}`}
                            >
                              <Accordion.Header
                                //   className={`${
                                //     payment?.status == "1"
                                //       ? "panel-headingone"
                                //       : payment?.status == "0"
                                //       ? "paymentPending"
                                //       : "panel-heading"
                                //   } !p-0 !m-0`}
                                id="PaymentSuccessOne"
                                onClick={() => {
                                  setActiveOrderId(payment?.order_id);
                                  setPaymentId(payment?.payment_id);
                                }}
                              >
                                {/* <h2 className="panel-title !p-0 !m-0 "> */}
                                <button
                                  className={`accordion-button accordion-success !px-2 ${
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
                                  <span class="fw-normal mx-1">
                                    |
                                    <span class="fs-12 fw-normal">
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
                              </Accordion.Header>
                              <Accordion.Body>
                                <div id="collapseOne" className="">
                                  <div
                                  // className={`${
                                  //   payment?.status == "1"
                                  //     ? "panel-bodyone"
                                  //     : payment?.status == "0"
                                  //     ? "panel-bodypending"
                                  //     : "panel-bodyfailed"
                                  // }`}
                                  >
                                    <div class="row">
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Order Status
                                        </p>
                                        <span
                                          class={`badge ${
                                            orderDetails?.status == 0
                                              ? "bg-warning"
                                              : orderDetails?.status == 5 ||
                                                orderDetails?.status == 6
                                              ? "bg-danger"
                                              : "bg-success"
                                          } fs-12`}
                                        >
                                          {orderDetails?.status == 0
                                            ? "Pending"
                                            : orderDetails?.status == 1
                                            ? "Placed"
                                            : orderDetails?.status == "2"
                                            ? "Confirmed"
                                            : orderDetails?.status == "3"
                                            ? "Dispatched"
                                            : orderDetails?.status == "4"
                                            ? "Delivered"
                                            : orderDetails?.status == "5"
                                            ? "Cancelled"
                                            : "returned"}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Transaction id
                                        </p>
                                        <span class="text-dark">TXN65445</span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Payment Type
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.payment_type}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Total Amount
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.total}
                                        </span>
                                      </div>
                                      <div class="col-lg-12 mb-1"></div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Discount
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.discount_amount}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Sub Total
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.sub_total}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Paid Amount
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.amount_paid}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Balance
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.balance_amount}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="acc-content ">
                                          <p className="desc flex text-lg drop-shadow-lg">
                                            Order Status :{" "}
                                            <p className="font-bold">
                                              {orderDetails?.status == 0
                                                ? "Pending"
                                                : orderDetails?.status == 1
                                                ? "Placed"
                                                : orderDetails?.status == "2"
                                                ? "Confirmed"
                                                : orderDetails?.status == "3"
                                                ? "Dispatched"
                                                : orderDetails?.status == "4"
                                                ? "Delivered"
                                                : orderDetails?.status == "5"
                                                ? "Cancelled"
                                                : "returned"}
                                            </p>
                                          </p>
                                          {
                                            <p className="desc flex">
                                              Total Amount :{" "}
                                              <p className="font-bold">
                                                {payment?.order?.currency ==
                                                "INR"
                                                  ? "₹"
                                                  : "$"}
                                                {payment?.order?.total}
                                              </p>
                                            </p>
                                          }
                                          <p className="desc flex">
                                            Discount:{" "}
                                            <p className="font-bold">
                                              {payment?.order?.currency == "INR"
                                                ? "₹"
                                                : "$"}
                                              {payment?.order?.discount_amount}
                                            </p>
                                          </p>
                                          <p className="desc !flex">
                                            Sub Total:{" "}
                                            <p className="font-bold">
                                              {payment?.order?.currency == "INR"
                                                ? "₹"
                                                : "$"}
                                              {payment?.order?.sub_total}
                                            </p>
                                          </p>
                                          <p className="desc flex">
                                            Paid Amount:{" "}
                                            <p className="font-bold">
                                              {payment?.order?.currency == "INR"
                                                ? "₹"
                                                : "$"}
                                              {payment?.order?.amount_paid}
                                            </p>
                                          </p>
                                          <p className="desc flex">
                                            Balance:{" "}
                                            <p className="font-bold">
                                              {payment?.order?.currency == "INR"
                                                ? "₹"
                                                : "$"}
                                              {payment?.balance_amount}
                                            </p>
                                          </p>
                                        </div>
                                      </div>
                                      {/* <div className="col-md-6">
                                                <div className="acc-content float-right">
                                                  <p className="desc !text-lg">
                                                    Shipping Address:
                                                  </p>
                                                  <span className="block">
                                                    {
                                                      orderDetails?.shipping_add1
                                                    }
                                                    ,
                                                  </span>
                                                  <span className="block">
                                                    {
                                                      orderDetails?.shipping_add2
                                                    }
                                                    {orderDetails?.shipping_add2 !=
                                                    null
                                                      ? ","
                                                      : ""}
                                                  </span>
                                                  <span className="block">
                                                    {
                                                      orderDetails?.shipping_city
                                                    }
                                                    ,
                                                  </span>
                                                  <span className="block">
                                                    {
                                                      orderDetails?.shipping_state
                                                    }
                                                    ,
                                                  </span>
                                                  <span className="block">
                                                    {
                                                      orderDetails?.shipping_country
                                                    }
                                                    ,
                                                  </span>
                                                  <span className="block">
                                                    {orderDetails?.shipping_zip}
                                                    ,
                                                  </span>
                                                </div>
                                              </div> */}
                                    </div>
                                  </div>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          );
                        } else if (activeTab == 2 && payment?.status == "2") {
                          return (
                            <Accordion.Item
                              key={ind}
                              className={`panelone panel-default hover:drop-shadow-lg `}
                              eventKey={`${ind}`}
                            >
                              <Accordion.Header
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
                                  <span class="fw-normal mx-1">
                                    |
                                    <span class="fs-12 fw-normal">
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
                              </Accordion.Header>
                              <Accordion.Body>
                                <div id="collapseOne" className="">
                                  <div
                                  // className={`${
                                  //   payment?.status == "1"
                                  //     ? "panel-bodyone"
                                  //     : payment?.status == "0"
                                  //     ? "panel-bodypending"
                                  //     : "panel-bodyfailed"
                                  // }`}
                                  >
                                    <div class="row">
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Order Status
                                        </p>
                                        <span
                                          class={`badge ${
                                            orderDetails?.status == 0
                                              ? "bg-warning"
                                              : orderDetails?.status == 5 ||
                                                orderDetails?.status == 6
                                              ? "bg-danger"
                                              : "bg-success"
                                          } fs-12`}
                                        >
                                          {orderDetails?.status == 0
                                            ? "Pending"
                                            : orderDetails?.status == 1
                                            ? "Placed"
                                            : orderDetails?.status == "2"
                                            ? "Confirmed"
                                            : orderDetails?.status == "3"
                                            ? "Dispatched"
                                            : orderDetails?.status == "4"
                                            ? "Delivered"
                                            : orderDetails?.status == "5"
                                            ? "Cancelled"
                                            : "returned"}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Transaction id
                                        </p>
                                        <span class="text-dark">TXN65445</span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Payment Type
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.payment_type}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Total Amount
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.total}
                                        </span>
                                      </div>
                                      <div class="col-lg-12 mb-1"></div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Discount
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.discount_amount}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Sub Total
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.sub_total}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Paid Amount
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.amount_paid}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Balance
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.balance_amount}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          );
                        } else if (activeTab == 3 && payment?.status == "0") {
                          return (
                            <Accordion.Item
                              key={ind}
                              className={`panelone panel-default hover:drop-shadow-lg `}
                              eventKey={`${ind}`}
                            >
                              <Accordion.Header
                                //   className={`${
                                //     payment?.status == "3"
                                //       ? "panel-headingone"
                                //       : payment?.status == "0"
                                //       ? "paymentPending"
                                //       : "panel-heading"
                                //   } !p-0 !m-0`}
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
                                  <span class="fw-normal mx-1">
                                    |
                                    <span class="fs-12 fw-normal">
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
                              </Accordion.Header>
                              <Accordion.Body>
                                <div id="collapseOne" className="">
                                  <div
                                  // className={`${
                                  //   payment?.status == "1"
                                  //     ? "panel-bodyone"
                                  //     : payment?.status == "0"
                                  //     ? "panel-bodypending"
                                  //     : "panel-bodyfailed"
                                  // }`}
                                  >
                                    <div class="row">
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Order Status
                                        </p>
                                        <span
                                          class={`badge ${
                                            orderDetails?.status == 0
                                              ? "bg-warning"
                                              : orderDetails?.status == 5 ||
                                                orderDetails?.status == 6
                                              ? "bg-danger"
                                              : "bg-success"
                                          } fs-12`}
                                        >
                                          {orderDetails?.status == 0
                                            ? "Pending"
                                            : orderDetails?.status == 1
                                            ? "Placed"
                                            : orderDetails?.status == "2"
                                            ? "Confirmed"
                                            : orderDetails?.status == "3"
                                            ? "Dispatched"
                                            : orderDetails?.status == "4"
                                            ? "Delivered"
                                            : orderDetails?.status == "5"
                                            ? "Cancelled"
                                            : "returned"}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Transaction id
                                        </p>
                                        <span class="text-dark">TXN65445</span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Payment Type
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.payment_type}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Total Amount
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.total}
                                        </span>
                                      </div>
                                      <div class="col-lg-12 mb-1"></div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Discount
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.discount_amount}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Sub Total
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.sub_total}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Paid Amount
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.order?.amount_paid}
                                        </span>
                                      </div>
                                      <div class="col-6 col-lg-3 mb-1">
                                        <p class="mb-0 text-muted fw-bold">
                                          Balance
                                        </p>
                                        <span class="text-dark">
                                          {payment?.order?.currency == "INR"
                                            ? "₹"
                                            : "$"}
                                          {payment?.balance_amount}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          );
                        }
                      })}
                    </Accordion>
                  )}
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
