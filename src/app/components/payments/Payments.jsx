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
export default function Payments() {
  const userData = useSelector((state) => state?.user?.value);
  const { t } = useTranslation();
  const [paymentsData, stePaymentsData] = useState()
  const [paymentsCount, setPaymentsCount] = useState(0)
  const [activeTab, setActiveTab] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [activeOrderId, setActiveOrderId] = useState();
  const [orderDetails, setOrderDetails] = useState()

  useEffect(()=>{
    if(activeTab == 1){
      const tempPaymentCount = paymentsData?.filter((payment)=> payment?.status == 1)
      console.log(tempPaymentCount?.length)
      setPaymentsCount(tempPaymentCount?.length)
    } else if(activeTab == 2){
      const tempPaymentCount = paymentsData?.filter((payment)=> payment?.status == 2)
      console.log(tempPaymentCount?.length)
      setPaymentsCount(tempPaymentCount?.length)
    }else {
      const tempPaymentCount = paymentsData?.filter((payment)=> payment?.status == 0)
      console.log(tempPaymentCount?.length)
      setPaymentsCount(tempPaymentCount?.length)
    }
  },[activeTab])

  console.log(userData);
    const dispatch = useDispatch()
    const fetchPaymentData = async()=>{
        try{
            dispatch(showLoader())
            const response = await axios.get("https://admin.tradingmaterials.com/api/client/get-payments", {
                headers: {
                  Authorization: `Bearer ` + localStorage.getItem("client_token"),
                  Accept: "application/json",
                },
              })
            if(response?.data?.status){
                console.log(response?.data?.data?.payments, "ord-")
                setActiveTab(1)
                // setActiveOrderId(response?.data?.data?.paments[0]?.order?.id)
                response.data?.data?.payments?.map((payment, ind)=>{
                  if(ind == 0){
                    return  setActiveOrderId(payment?.order_id)
                  }else{
                    return
                  }
                })
                stePaymentsData(response?.data?.data?.payments)
                const tempPaymentCount = response?.data?.data?.payments?.filter((payment)=> payment?.status == 1)
      console.log(tempPaymentCount?.length)
      setPaymentsCount(tempPaymentCount?.length)
                console.log(paymentsData)
            }
        }catch(err){console.log(err)}finally{dispatch(hideLoader())}
    }

  useEffect(()=>{
    fetchPaymentData()
  },[])



  const memoizedOrderDetails = useMemo(()=>{
    const getOrderDetails = async()=>{
      try{
        dispatch(showLoader())
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
      }catch(err){console.log(err,"err")}finally{
        dispatch(hideLoader())
      }
    }

    return getOrderDetails
  }, [activeOrderId])


  useEffect(()=>{
    const Orderdata = memoizedOrderDetails
    Orderdata()
  },[activeOrderId])


  return (
    <>
      <div className="nk-app-root">
        <Header />

        <main className="nk-pages ">
          <Dashboard />
          <section className="nk-section ">
            <div className="nk-mask blur-1 left center"></div>
            <div className="container">
              <div className="row">
                <div className="col-lg-12 mb-6">
                  <div className="row  ">
                    <div
                      className={`col-lg-4 p-3 cursor-pointer shadow-sm ${
                        activeTab == 1 ? "shadow-lg bg-green-300" : ""
                      } drop-shadow-lg text-success`}
                      onClick={() => setActiveTab(1)}
                    >
                      Order Payment Success
                    </div>
                    <div
                      className={`col-lg-4 p-3 cursor-pointer shadow-sm ${
                        activeTab == 2 ? "shadow-lg bg-red-300" : ""
                      } drop-shadow-lg text-red-600`}
                      onClick={() => setActiveTab(2)}
                    >
                      Order Payment Failed
                    </div>
                    <div
                      className={`col-lg-4 p-3 cursor-pointer shadow-sm ${
                        activeTab == 3 ? "shadow-lg bg-orange-300" : ""
                      } drop-shadow-lg text-orange-600`}
                      onClick={() => setActiveTab(3)}
                    >
                      Order Payment Pending
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 container">
                  <div
                    className="card shadow-md drop-shadow-md"
                    data-aos="fade-up"
                  >
                    <div
                      className={`card-header ${
                        activeTab == 1
                          ? "!bg-green-200 border"
                          : activeTab == 2
                          ? "!bg-red-300"
                          : "!bg-orange-300"
                      } px-3 bg- py-1`}
                    >
                      <h5
                        className={`text-muted ${
                          activeTab == 1
                            ? "!text-green-500 "
                            : activeTab == 2
                            ? "!text-red-600"
                            : "!text-orange-600"
                        } !m-0`}
                      >
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
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12">
                          {paymentsCount > 0 && (
                            <Accordion
                              defaultActiveKey="0"
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
                                        className={`${
                                          payment?.status == "1"
                                            ? "panel-headingone"
                                            : payment?.status == "0"
                                            ? "paymentPending"
                                            : "panel-heading"
                                        } !p-0 !m-0`}
                                        id="headingOne"
                                        onClick={() =>
                                          setActiveOrderId(payment?.order_id)
                                        }
                                      >
                                        <h4 className="panel-title !p-0 !m-0 ">
                                          <a
                                            className="collapsed "
                                            role="button"
                                            data-toggle="collapse"
                                            data-parent="#accordion"
                                            // href="#collapseOne"
                                            aria-expanded="false"
                                            aria-controls="collapseOne"
                                          >
                                            {payment?.order != null ||
                                            payment?.order?.order_number != null
                                              ? "#" +
                                                payment?.order?.order_number
                                              : "#Removed"}
                                            <span style={{ float: "right" }}>
                                              {" "}
                                              Order placed on{" "}
                                              <b>
                                                {new Date(
                                                  payment?.created_at
                                                ).toLocaleDateString("en-US", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                                })}
                                              </b>
                                            </span>
                                          </a>
                                        </h4>
                                      </Accordion.Header>
                                      <Accordion.Body>
                                        <div id="collapseOne" className="">
                                          <div
                                            className={`${
                                              payment?.status == "1"
                                                ? "panel-bodyone"
                                                : payment?.status == "0"
                                                ? "panel-bodypending"
                                                : "panel-bodyfailed"
                                            }`}
                                          >
                                            <div className="row">
                                              <div className="col-md-6">
                                                <div className="acc-content ">
                                                  <p className="desc flex text-lg drop-shadow-lg">
                                                    Order Status :{" "}
                                                    <p className="font-bold">
                                                      {orderDetails?.status == 0
                                                        ? "Pending"
                                                        : orderDetails?.status ==
                                                          1
                                                        ? "Placed"
                                                        : orderDetails?.status ==
                                                          "2"
                                                        ? "Confirmed"
                                                        : orderDetails?.status ==
                                                          "3"
                                                        ? "Dispatched"
                                                        : orderDetails?.status ==
                                                          "4"
                                                        ? "Delivered"
                                                        : orderDetails?.status ==
                                                          "5"
                                                        ? "Cancelled"
                                                        : "returned"}
                                                    </p>
                                                  </p>
                                                  {
                                                    <p className="desc flex">
                                                      Total Amount :{" "}
                                                      <p className="font-bold">
                                                        {payment?.order
                                                          ?.currency == "INR"
                                                          ? "₹"
                                                          : "$"}
                                                        {payment?.order?.total}
                                                      </p>
                                                    </p>
                                                  }
                                                  <p className="desc flex">
                                                    Discount:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {
                                                        payment?.order
                                                          ?.discount_amount
                                                      }
                                                    </p>
                                                  </p>
                                                  <p className="desc !flex">
                                                    Sub Total:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {
                                                        payment?.order
                                                          ?.sub_total
                                                      }
                                                    </p>
                                                  </p>
                                                  <p className="desc flex">
                                                    Paid Amount:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {
                                                        payment?.order
                                                          ?.amount_paid
                                                      }
                                                    </p>
                                                  </p>
                                                  <p className="desc flex">
                                                    Balance:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {payment?.balance_amount}
                                                    </p>
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="col-md-6">
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
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  );
                                } else if (
                                  activeTab == 2 &&
                                  payment?.status == "2"
                                ) {
                                  return (
                                    <Accordion.Item
                                      key={ind}
                                      className={`panelone panel-default hover:drop-shadow-lg `}
                                      eventKey={`${ind}`}
                                    >
                                      <Accordion.Header
                                        className={`${
                                          payment?.status == "1"
                                            ? "panel-headingone"
                                            : payment?.status == "0"
                                            ? "paymentPending"
                                            : "panel-heading"
                                        } !p-0 !m-0`}
                                        id="headingOne"
                                        onClick={() =>
                                          setActiveOrderId(payment?.order_id)
                                        }
                                      >
                                        <h4 className="panel-title !p-0 !m-0 ">
                                          <a
                                            className="collapsed "
                                            role="button"
                                            data-toggle="collapse"
                                            data-parent="#accordion"
                                            // href="#collapseOne"
                                            aria-expanded="false"
                                            aria-controls="collapseOne"
                                          >
                                            {payment?.order != null ||
                                            payment?.order?.order_number != null
                                              ? "#" +
                                                payment?.order?.order_number
                                              : "#Removed"}
                                            <span style={{ float: "right" }}>
                                              {" "}
                                              Payment Failed on{" "}
                                              <b>
                                                {new Date(
                                                  payment?.created_at
                                                ).toLocaleDateString("en-US", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                                })}
                                              </b>
                                            </span>
                                          </a>
                                        </h4>
                                      </Accordion.Header>
                                      <Accordion.Body>
                                        <div id="collapseOne" className="">
                                          <div
                                            className={`${
                                              payment?.status == "1"
                                                ? "panel-bodyone"
                                                : payment?.status == "0"
                                                ? "panel-bodypending"
                                                : "panel-bodyfailed"
                                            }`}
                                          >
                                            <div className="row">
                                              <div className="col-md-6">
                                                <div className="acc-content ">
                                                  <p className="desc flex text-lg drop-shadow-lg">
                                                    Order Status :{" "}
                                                    <p className="font-bold">
                                                      {orderDetails?.status == 0
                                                        ? "Pending"
                                                        : orderDetails?.status ==
                                                          1
                                                        ? "Placed"
                                                        : orderDetails?.status ==
                                                          "2"
                                                        ? "Confirmed"
                                                        : orderDetails?.status ==
                                                          "3"
                                                        ? "Dispatched"
                                                        : orderDetails?.status ==
                                                          "4"
                                                        ? "Delivered"
                                                        : orderDetails?.status ==
                                                          "5"
                                                        ? "Cancelled"
                                                        : "returned"}
                                                    </p>
                                                  </p>
                                                  {
                                                    <p className="desc flex">
                                                      Total Amount :{" "}
                                                      <p className="font-bold">
                                                        {payment?.order
                                                          ?.currency == "INR"
                                                          ? "₹"
                                                          : "$"}
                                                        {payment?.order?.total}
                                                      </p>
                                                    </p>
                                                  }
                                                  <p className="desc flex">
                                                    Discount:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {
                                                        payment?.order
                                                          ?.discount_amount
                                                      }
                                                    </p>
                                                  </p>
                                                  <p className="desc !flex">
                                                    Sub Total:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {
                                                        payment?.order
                                                          ?.sub_total
                                                      }
                                                    </p>
                                                  </p>
                                                  <p className="desc flex">
                                                    Paid Amount:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {
                                                        payment?.order
                                                          ?.amount_paid
                                                      }
                                                    </p>
                                                  </p>
                                                  <p className="desc flex">
                                                    Balance:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {payment?.balance_amount}
                                                    </p>
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="col-md-6">
                                                <div className="acc-content float-right">
                                                  <p className="desc flex  !text-lg">
                                                    Transaction id:
                                                  </p>
                                                  <span className="block">
                                                    {
                                                      orderDetails?.payments[
                                                        orderDetails?.payments
                                                          ?.length - 1
                                                      ]?.transaction_id
                                                    }
                                                  </span>
                                                  <p className="desc flex  !text-lg">
                                                    Transaction date:
                                                  </p>
                                                  <span className="block">
                                                    {new Date(
                                                      orderDetails?.payments[
                                                        orderDetails?.payments
                                                          ?.length - 1
                                                      ]?.created_at
                                                    ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                      }
                                                    )}
                                                  </span>
                                                  <p className="desc flex">
                                                    Payment Type
                                                  </p>
                                                  <span>
                                                    {
                                                      orderDetails?.payments[
                                                        orderDetails?.payments
                                                          ?.length - 1
                                                      ]?.payment_type
                                                    }
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  );
                                } else if (
                                  activeTab == 3 &&
                                  payment?.status == "0"
                                ) {
                                  return (
                                    <Accordion.Item
                                      key={ind}
                                      className={`panelone panel-default hover:drop-shadow-lg`}
                                      eventKey={`${ind}`}
                                    >
                                      <Accordion.Header
                                        className={`${
                                          payment?.status == "1"
                                            ? "panel-headingone"
                                            : payment?.status == "0"
                                            ? "paymentPending"
                                            : "panel-heading"
                                        } !p-0 !m-0`}
                                        id="headingOne"
                                      >
                                        <h4 className="panel-title !p-0 !m-0">
                                          <a
                                            className="collapsed "
                                            role="button"
                                            data-toggle="collapse"
                                            data-parent="#accordion"
                                            // href="#collapseOne"
                                            aria-expanded="false"
                                            aria-controls="collapseOne"
                                          >
                                            {payment?.order != null ||
                                            payment?.order?.order_number != null
                                              ? "#" +
                                                payment?.order?.order_number
                                              : "#Removed"}
                                            <span style={{ float: "right" }}>
                                              {" "}
                                              Order placed on{" "}
                                              <b>
                                                {new Date(
                                                  payment?.created_at
                                                ).toLocaleDateString("en-US", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                                })}
                                              </b>
                                            </span>
                                          </a>
                                        </h4>
                                      </Accordion.Header>
                                      <Accordion.Body>
                                        <div id="collapseOne" className="">
                                          <div
                                            className={`${
                                              payment?.status == "1"
                                                ? "panel-bodyone"
                                                : payment?.status == "0"
                                                ? "panel-bodypending"
                                                : "panel-bodyfailed"
                                            }`}
                                          >
                                            <div className="row">
                                              <div className="col-md-6">
                                                <div className="acc-content ">
                                                  <p className="desc flex text-lg drop-shadow-lg">
                                                    Order Status :{" "}
                                                    <p className="font-bold">
                                                      {orderDetails?.status == 0
                                                        ? "Pending"
                                                        : orderDetails?.status ==
                                                          1
                                                        ? "Placed"
                                                        : orderDetails?.status ==
                                                          "2"
                                                        ? "Confirmed"
                                                        : orderDetails?.status ==
                                                          "3"
                                                        ? "Dispatched"
                                                        : orderDetails?.status ==
                                                          "4"
                                                        ? "Delivered"
                                                        : orderDetails?.status ==
                                                          "5"
                                                        ? "Cancelled"
                                                        : "returned"}
                                                    </p>
                                                  </p>
                                                  {
                                                    <p className="desc flex">
                                                      Total Amount :{" "}
                                                      <p className="font-bold">
                                                        {payment?.order
                                                          ?.currency == "INR"
                                                          ? "₹"
                                                          : "$"}
                                                        {payment?.order?.total}
                                                      </p>
                                                    </p>
                                                  }
                                                  <p className="desc flex">
                                                    Discount:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {
                                                        payment?.order
                                                          ?.discount_amount
                                                      }
                                                    </p>
                                                  </p>
                                                  <p className="desc !flex">
                                                    Sub Total:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {
                                                        payment?.order
                                                          ?.sub_total
                                                      }
                                                    </p>
                                                  </p>
                                                  <p className="desc flex">
                                                    Paid Amount:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {
                                                        payment?.order
                                                          ?.amount_paid
                                                      }
                                                    </p>
                                                  </p>
                                                  <p className="desc flex">
                                                    Balance:{" "}
                                                    <p className="font-bold">
                                                      {payment?.order
                                                        ?.currency == "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {payment?.order?.balance}
                                                    </p>
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="col-md-6 float-right flex items-center justify-end">
                                                <Button
                                                  variant="outline-warning"
                                                  onClick={() => {
                                                    window.open(
                                                      `/checkout/order_id/${CryptoJS?.AES?.encrypt(
                                                        `${payment?.order?.id}`,
                                                        "trading_materials_order"
                                                      )
                                                        ?.toString()
                                                        .replace(/\//g, "_")
                                                        .replace(/\+/g, "-")}`
                                                    );
                                                  }}
                                                >
                                                  Pay now
                                                </Button>
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
                          {paymentsCount == 0 && (
                            <p className="text-center w-full font-bold text-lg">
                              No Payments Found
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4"></div>
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
                      href={`https://tradingmaterials.com/contact`}
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
