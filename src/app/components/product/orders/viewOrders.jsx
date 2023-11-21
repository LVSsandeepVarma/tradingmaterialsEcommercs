/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import "./viewOrder.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  hideLoader,
  showLoader,
} from "../../../../features/loader/loaderSlice";
import { useTranslation } from "react-i18next";
import {
  FaBoxesPacking,
  FaCartArrowDown,
  FaCrosshairs,
  FaFileInvoice,
  FaMagnifyingGlass,
  FaPeopleCarryBox,
  FaTruckFast,
} from "react-icons/fa6";
import CryptoJS from "crypto-js";

import { RiSecurePaymentFill } from "react-icons/ri";
import Dashboard from "../../commonDashboard/Dashboard";

export default function ViewOrders() {
  // const userData  =useSelector(state => state?.user?.value)
  // eslint-disable-next-line no-unused-vars
  const [orders, setOrders] = useState();
  const [orderDataOne, setOrderDataOne] = useState();
  const [orderDataTwo, setOrderDataTwo] = useState();
  const [orderId, setOrderId] = useState();
  const [activeOrder, setActiveOrder] = useState(0);
  const [orderNumber, setOrderNumber] = useState();
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [viewOrderDetails, setViewOrderDetails] = useState();
  const params = useParams();
  const dispatch = useDispatch();
  // const loaderState = useSelector((state) => state?.loader?.value);
  useEffect(() => {
    const getOrderTwoDetails = async (type, dataCount) => {
      console.log("orderss", type);
      try {
        dispatch(showLoader());
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/client/get-orders?type=${type}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("client_token"),
            },
          }
        );
        if (response?.data?.status) {
          console.log(response?.data);
          if (orderDataOne?.length == 0) {
            setOrderId(response?.data?.data?.orders[0]?.id);
          }
          if (dataCount == "one") {
            setOrderDataOne(response?.data?.data?.orders);
            // setOrders(...orders, response?.data?.data?.orders)
            console.log(
              response?.data?.data?.orders[0]?.order_number,
              "orderss"
            );
            setOrderNumber(response?.data?.data?.orders[0]?.order_number);
            setActiveOrder(response?.data?.data?.orders[0]?.order_number);
          } else if (dataCount == "two") {
            setOrderDataTwo(response?.data?.data?.orders);

            //                   setOrders(
            //                     ...orders,
            //                     response?.data?.data?.orders
            // );
            if (orderDataOne?.length == 0) {
              console.log(orderNumber, orderDataOne?.length, "orderss");
              setOrderNumber(response?.data?.data?.orders[0]?.order_number);
              setActiveOrder(response?.data?.data?.orders[0]?.order_number);
              // }
            }
            // setOrders(response?.data?.data?.orders);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoader());
      }
    };

    // if (params?.order_type == "unpaid" || params?.order_type == "placed") {

    const getOrderDetails = async (type, dataCount, secondType) => {
      console.log("orderss", type);
      if (type == "dispatched") {
        setOrderDataTwo([]);
      }
      try {
        dispatch(showLoader());
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/client/get-orders?type=${type}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("client_token"),
            },
          }
        );
        if (response?.data?.status) {
          console.log(response?.data);
          setOrderId(response?.data?.data?.orders[0]?.id);
          if (dataCount == "one") {
            setOrderDataOne(response?.data?.data?.orders);
            // setOrders(...orders, response?.data?.data?.orders)
            console.log(
              response?.data?.data?.orders[0]?.order_number,
              "orderss"
            );
            setOrderNumber(response?.data?.data?.orders[0]?.order_number);
            setActiveOrder(response?.data?.data?.orders[0]?.order_number);
          } else if (dataCount == "two") {
            setOrderDataTwo(response?.data?.data?.orders);

            //                   setOrders(
            //                     ...orders,
            //                     response?.data?.data?.orders
            // );
            // if (orderDataOne?.length) {
            //   console.log(orderNumber, orderDataOne?.length ,"orderss");
            //   setOrderNumber(
            //     response?.data?.data?.orders[0]?.order_number
            //   );
            //   setActiveOrder(
            //     response?.data?.data?.orders[0]?.order_number
            //   );
            // }
          }
          // setOrders(response?.data?.data?.orders);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (dataCount == "one" && secondType != "") {
          getOrderTwoDetails(secondType, "two");
        }
        dispatch(hideLoader());
      }
    };

    if (params?.order_type == "unpaid" || params?.order_type == "placed") {
      getOrderDetails("placed", "one", "unpaid");
    } else if (
      params?.order_type == "confirmed" ||
      params?.order_type == "cancelled"
    ) {
      getOrderDetails("confirmed", "one", "cancelled");
    } else if (
      params?.order_type == "delivered" ||
      params?.order_type == "returned"
    ) {
      getOrderDetails("delivered", "one", "returned");
    } else if (params?.order_type == "dispatched") {
      getOrderDetails("dispatched", "one", "");
    }

    // }

    // const getOrderDetails = async () => {
    //   try {
    //     dispatch(showLoader());
    //     const response = await axios.get(
    //       `https://admin.tradingmaterials.com/api/client/get-orders?type=${params?.order_type}`,
    //       {
    //         headers: {
    //           Authorization: "Bearer " + localStorage.getItem("client_token"),
    //         },
    //       }
    //     );
    //     if (response?.data?.status) {
    //       console.log(response?.data);
    //       setOrderId(response?.data?.data?.orders[0]?.id);
    //       setOrders(response?.data?.data?.orders);
    //       setOrderNumber(response?.data?.data?.orders[0]?.order_number);
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   } finally {
    //     dispatch(hideLoader());
    //   }
    // };
    // getOrderDetails();
  }, []);

  useEffect(() => {
    const viewOrderDetails = async () => {
      try {
        dispatch(showLoader());
        if (orderId != undefined) {
          const response = await axios.get(
            `https://admin.tradingmaterials.com/api/client/view-order?id=${orderId}`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("client_token"),
              },
            }
          );

          if (response?.data?.status) {
            setViewOrderDetails(response?.data?.data?.order);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoader());
      }
    };

    viewOrderDetails();
  }, [orderId]);
  return (
    <>
      <Header />
      <main className="nk-pages drop-shadow-lg">
        {/* {loaderState && (
        <div className="preloader !backdrop-blur-[1px] ">
          <div className="loader"></div>
        </div>
      )} */}
        <Dashboard />
        <section className="nk-section ">
          <div className="container">
            <div className="row">
              <div className="col mb-5">
                <div
                  className="timeline-steps aos-init aos-animate"
                  data-aos="fade-up"
                >
                  <div className="timeline-step order-delivered">
                    <div
                      className="timeline-content"
                      data-toggle="popover"
                      data-trigger="hover"
                      data-placement="top"
                      title=""
                      data-content="And here's some amazing content. It's very engaging. Right?"
                      data-original-title="2003"
                    >
                      <div
                        className={`inner-circle timeline-active ${
                          params?.order_type == "placed" ||
                          params?.order_type == "unpaid"
                            ? "border !border-blue-500 border-solid"
                            : ""
                        }`}
                        onClick={() => {
                          window.location.href = "/view-order/placed";
                        }}
                      >
                        <img
                          src="/images/orders/Order-placed.png"
                          className={`${
                            params?.order_type == "placed" ||
                            params?.order_type == "unpaid"
                              ? "w-[30px] fa-beat-fade"
                              : "!w-[36px]"
                          }`}
                          width="50px"
                          alt="placed"
                        />
                        {/* <FaCartArrowDown
                          className="fa-solid fa-cart-arrow-down text-[2em] "
                          style={{ color: "#1581d2" }}
                        /> */}
                      </div>
                      {/* <!-- <p class="h6 mt-3 mb-1">2003</p> --> */}
                      <p className="h6 text-muted !font-bold mb-0 mb-lg-0 order-placed">
                        Order Placed
                      </p>
                    </div>
                  </div>
                  <div className="timeline-step order-delivered">
                    <div
                      className="timeline-content"
                      data-toggle="popover"
                      data-trigger="hover"
                      data-placement="top"
                      title=""
                      data-content="And here's some amazing content. It's very engaging. Right?"
                      data-original-title="2005"
                    >
                      <div
                        className={`inner-circle timeline-active ${
                          params?.order_type == "confirmed" ||
                          params?.order_type == "cancelled"
                            ? "border !border-green-500 border-solid"
                            : ""
                        }`}
                        onClick={() => {
                          window.location.href = "/view-order/confirmed";
                        }}
                        // style={{ border: "1px solid #4CAF50" }}
                      >
                        <img
                          src="/images/orders/Order-confirmed.png"
                          className={`${
                            params?.order_type == "confirmed" ||
                            params?.order_type == "cancelled"
                              ? "w-[30px] fa-beat-fade"
                              : "!w-[36px]"
                          }`}
                          width="100px"
                        />
                        {/* <FaBoxesPacking
                          className="fa-solid fa-boxes-packing text-[2em] fa-beat-fade"
                          style={{ color: "#4caf50" }}
                        /> */}
                      </div>
                      {/* <!-- <p class="h6 mt-3 mb-1">2005</p> --> */}
                      <p className="h6 text-muted mb-0 !font-bold mb-lg-0 order-confirmed">
                        Order Confirmed <br /> & Cancelled
                      </p>
                    </div>
                  </div>
                  <div className="timeline-step order-delivered">
                    <div
                      className="timeline-content"
                      data-toggle="popover"
                      data-trigger="hover"
                      data-placement="top"
                      title=""
                      data-content="And here's some amazing content. It's very engaging. Right?"
                      data-original-title="2010"
                    >
                      <div
                        className={`inner-circle timeline-active ${
                          params?.order_type == "dispatched"
                            ? "border !border-[#ff9800] border-solid"
                            : ""
                        }`}
                        onClick={() => {
                          window.location.href = "/view-order/dispatched";
                        }}
                      >
                        <img
                          src="/images/orders/Order-dispatched.png"
                          className={`${
                            params?.order_type == "dispatched"
                              ? "w-[30px] fa-beat-fade"
                              : "!w-[36px]"
                          }`}
                          width="100px"
                        />{" "}
                        {/* <FaTruckFast
                          className="fa-solid fa-truck-fast text-[2em]"
                          style={{ color: "#ff9800" }}
                        /> */}
                      </div>
                      {/* <!-- <p class="h6 mt-3 mb-1">2010</p> --> */}
                      <p className="h6 text-muted mb-0 !font-bold mb-lg-0 order-dispatched">
                        Order Dispatched
                      </p>
                    </div>
                  </div>
                  <div className="timeline-step mb-0">
                    <div
                      className="timeline-content"
                      data-toggle="popover"
                      data-trigger="hover"
                      data-placement="top"
                      title=""
                      data-content="And here's some amazing content. It's very engaging. Right?"
                      data-original-title="2020"
                    >
                      <div
                        className={`inner-circle timeline-active ${
                          params?.order_type == "delivered" ||
                          params?.order_type == "returned"
                            ? "border !border-[#009688] border-solid"
                            : ""
                        }`}
                        onClick={() => {
                          window.location.href = "/view-order/delivered";
                        }}
                      >
                        <img
                          src="/images/orders/Order-delivered.png"
                          className={`${
                            params?.order_type == "delivered" ||
                            params?.order_type == "returned"
                              ? "w-[30px] fa-beat-fade"
                              : "!w-[36px]"
                          }`}
                          width="100px"
                        />{" "}
                        {/* <FaPeopleCarryBox
                          className="fa-sharp fa-solid fa-people-carry-box text-[2em]"
                          style={{ color: "#009688" }}
                        /> */}
                      </div>
                      {/* <!-- <p class="h6 mt-3 mb-1">2020</p> --> */}
                      <p className="h6 text-muted mb-0 !font-bold mb-lg-0 order-delivered">
                        Order Delivered <br /> & Returned
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="nk-mask blur-1 left center"></div>
          <div className="container">
            <div className="row mt-1">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header px-3 py-1 d-flex items-center justify-between flex-wrap">
                    <div className=" flex items-center card-header px-3 py-1 bg-transparent border-none">
                      {/* <img
                        className="flex items-center !rounded-none !w-[30px] mr-2 !h-auto"
                        src={`/images/orders/${params?.order_type}.png`}
                      /> */}
                      <h5 className="text-muted text-left capitalize text-xl !font-bold mb-0">
                        {" "}
                        {params?.order_type == "placed" ||
                        params?.order_type == "unpaid"
                          ? "Placed & Pending Orders"
                          : params?.order_type == "confirmed" ||
                            params?.order_type == "cancelled"
                          ? "Confirmed & Cancelled Orders"
                          : params?.order_type == "delivered" ||
                            params?.order_type == "returned"
                          ? "Delivered & Returned Orders"
                          : params?.order_type == "dispatched"
                          ? "Dispatched Orders"
                          : ""}
                        {(orderDataOne?.length > 0 ||
                          orderDataTwo?.length > 0) && (
                          <span className="badge badge-custom ms-2">
                            {orderDataOne?.length + orderDataTwo?.length}
                          </span>
                        )}
                      </h5>
                    </div>
                    <div
                      className="input-group mb-0"
                      style={{ width: "350px" }}
                    >
                      <input
                        type="text"
                        className="form-control px-2 py-1"
                        placeholder="Search Orders..."
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                      />
                      <span
                        className="input-group-text px-2 py-1"
                        id="basic-addon2"
                      >
                        <FaMagnifyingGlass className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div>
                  </div>
                  <div className="card-body ">
                    <div className="row ">
                      <div className="col-lg-12">
                        {orderDataOne?.length == 0 &&
                          orderDataTwo?.length == 0 && (
                            <>
                              <div className="">
                                <div className="flex justify-center">
                                  <img
                                    src={`/images/orders/large/${params?.order_type}.png`}
                                    className="w-22 h-auto"
                                    alt="orders_large_icons"
                                    style={{ filter: "blur(3px)" }}
                                  />
                                </div>
                                <div
                                  className="nav flex-column nav-pills me-3 !text-sm !font-bold text-[#0082f1]"
                                  id="v-pills-tab"
                                  role="tablist"
                                  aria-orientation="vertical "
                                >
                                  No Orders Available
                                </div>
                              </div>
                            </>
                          )}
                      </div>
                      <div className="col-lg-3 mr-0 pr-0 orders-scrollbar max-h-[500px] overflow-y-auto">
                        {(orderDataOne?.length > 0 ||
                          orderDataTwo?.length > 0) && (
                          <div
                            className="nav flex-column nav-pills "
                            id="v-pills-tab"
                            role="tablist"
                            aria-orientation="vertical"
                          >
                            {orderDataOne?.map((order, ind) => (
                              <button
                                key={ind}
                                onClick={() => {
                                  setOrderId(order?.id),
                                    setActiveOrder(order?.order_number),
                                    setOrderNumber(order?.order_number);
                                }}
                                className={`nav-but-left ${
                                  ind == 0 ? "!mt-0" : ""
                                } ${
                                  activeOrder === order?.order_number
                                    ? "active"
                                    : ""
                                } hover:drop-shadow-xl shadow-sm`}
                                id="prod-1-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#prod-1"
                                type="button"
                                role="tab"
                                aria-controls="prod-1"
                                aria-selected="true"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    #{order?.order_number} <br />{" "}
                                    <small className="drop-shadow-lg">
                                      {new Date(
                                        order?.created_at
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </small>
                                  </div>
                                  <div>
                                    <img
                                      src={
                                        params?.order_type == "placed" ||
                                        params?.order_type == "unpaid"
                                          ? "/images/orders/placed.png"
                                          : params?.order_type == "confirmed" ||
                                            params?.order_type == "cancelled"
                                          ? "/images/orders/confirmed.png"
                                          : params?.order_type == "delivered" ||
                                            params?.order_type == "returned"
                                          ? "/images/orders/delivered.png"
                                          : params?.order_type == "dispatched"
                                          ? "/images/orders/dispatched.png"
                                          : ""
                                      }
                                      className="w-[20px]"
                                      alt="placed"
                                    />
                                  </div>
                                </div>
                              </button>
                            ))}
                            {orderDataTwo?.map((order, ind) => (
                              <button
                                key={ind}
                                onClick={() => {
                                  setOrderId(order?.id),
                                    setActiveOrder(order?.order_number),
                                    setOrderNumber(order?.order_number);
                                }}
                                className={`nav-but-left ${
                                  ind == 0 ? "!mt-0" : ""
                                } ${
                                  activeOrder === order?.order_number
                                    ? "active"
                                    : ""
                                } hover:drop-shadow-xl shadow-sm`}
                                id="prod-1-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#prod-1"
                                type="button"
                                role="tab"
                                aria-controls="prod-1"
                                aria-selected="true"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    #{order?.order_number} <br />{" "}
                                    <small className="drop-shadow-lg">
                                      {new Date(
                                        order?.created_at
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </small>
                                  </div>
                                  <div>
                                    <img
                                      src={
                                        params?.order_type == "placed" ||
                                        params?.order_type == "unpaid"
                                          ? "/images/orders/unpaid.png"
                                          : params?.order_type == "confirmed" ||
                                            params?.order_type == "cancelled"
                                          ? "/images/orders/cancelled.png"
                                          : params?.order_type == "delivered" ||
                                            params?.order_type == "returned"
                                          ? "/images/orders/returned.png"
                                          : params?.order_type == "dispatched"
                                          ? "/images/orders/dispatched.png"
                                          : ""
                                      }
                                      className="w-[20px]"
                                      alt="placed"
                                    />
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="col-lg-9">
                        <div className="tab-content" id="v-pills-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="prod-1"
                            role="tabpanel"
                            aria-labelledby="prod-1-tab"
                          >
                            {(orderDataOne?.length > 0 ||
                              orderDataTwo?.length > 0) && (
                              <div className="card">
                                <div className="card-body">
                                  <div className="row">
                                    <div className="col-12 drop-shadow-lg">
                                      <div>
                                        <div className="bd-breadcrumb d-flex align-items-center gap-3 mb-3">
                                          <span
                                            className="cursor-pointer hover:text-blue-600"
                                            onClick={() => {
                                              window.location.href =
                                                "/products";
                                            }}
                                          >
                                            Home
                                          </span>
                                          <span>Orders</span>
                                          <span>
                                            Orders {params?.order_type}
                                          </span>
                                          <span>
                                            Order No:{" "}
                                            <b className="!text-blue-600">
                                              {orderNumber}
                                            </b>
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                          <h4 className="text-dark !text-2xl !text-black !font-bold">
                                            Order ID : {orderId}
                                          </h4>
                                          <div className="">
                                            <button
                                              type="button"
                                              className="btn btn-light btn-sm shadow me-2 rounded custom-btn"
                                              name="button"
                                              onClick={() => {
                                                // window.open(
                                                //   `${viewOrderDetails?.invoice?.invoicefile?.invoice_pdf}`,
                                                //   "_blank"
                                                // );
                                                window.open(
                                                  `/view-invoice/${CryptoJS?.AES?.encrypt(
                                                    `${orderId}`,
                                                    "trading_materials_order"
                                                  )
                                                    ?.toString()
                                                    .replace(/\//g, "_")
                                                    .replace(
                                                      /\+/g,
                                                      "-"
                                                    )}/${CryptoJS?.AES?.encrypt(
                                                    `${viewOrderDetails?.invoice?.invoicefile?.invoice_pdf}`,
                                                    "trading_materials_invoice_pdf"
                                                  )
                                                    ?.toString()
                                                    .replace(/\//g, "_")
                                                    .replace(/\+/g, "-")}`
                                                );
                                              }}
                                            >
                                              <FaFileInvoice className="mr-1" />{" "}
                                              Invoice
                                            </button>
                                            <button
                                              type="button"
                                              className="btn btn-primary btn-sm rounded custom-btn"
                                              name="button"
                                              onClick={() => {
                                                if (
                                                  // params?.order_type == "unpaid"
                                                  viewOrderDetails?.status == 0
                                                ) {
                                                  window.open(
                                                    `/checkout/order_id/${CryptoJS?.AES?.encrypt(
                                                      `${orderId}`,
                                                      "trading_materials_order"
                                                    )
                                                      ?.toString()
                                                      .replace(/\//g, "_")
                                                      .replace(/\+/g, "-")}`
                                                  );
                                                } else {
                                                  window.open(
                                                    `/track-order/${CryptoJS?.AES?.encrypt(
                                                      `${orderId}`,
                                                      "trading_materials"
                                                    )
                                                      ?.toString()
                                                      .replace(/\//g, "_")
                                                      .replace(/\+/g, "-")}`,
                                                    "_blank"
                                                  );
                                                }
                                              }}
                                            >
                                              {params?.order_type ==
                                              "unpaid" ? (
                                                <RiSecurePaymentFill />
                                              ) : (
                                                <FaCrosshairs className="mr-1" />
                                              )}
                                              {params?.order_type == "unpaid" ||
                                              viewOrderDetails?.status == "0"
                                                ? "Pay now"
                                                : "Track order"}{" "}
                                            </button>
                                          </div>
                                        </div>

                                        <div className="mt-2 text-left">
                                          <p className="order-date">
                                            <span className="text-muted">
                                              Order Date :{" "}
                                            </span>{" "}
                                            <span className="text-dark">
                                              {new Date(
                                                viewOrderDetails?.created_at
                                              ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                              })}
                                            </span>
                                            <span className="mx-2">|</span>
                                            <span className="text-muted">
                                              Order Status :{" "}
                                            </span>{" "}
                                            <span className="text-primary">
                                              Order {params?.order_type}
                                            </span>
                                          </p>
                                        </div>
                                        <hr className="!mt-[1rem] !mb-[1rem]" />
                                        <div className="row">
                                          <div className="col-12">
                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                              <span className="badge badge-light">
                                                Sub Total :{" "}
                                                {viewOrderDetails?.currency ===
                                                "INR"
                                                  ? "₹"
                                                  : "$"}
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.sub_total
                                                }
                                              </span>
                                              {params?.order_type !=
                                                "unpaid" && (
                                                <span className="badge badge-light">
                                                  <a
                                                    onClick={() =>
                                                      setShowModal(true)
                                                    }
                                                    className="!text-blue-600 cursor-pointer"
                                                  >
                                                    Paid :{" "}
                                                    {viewOrderDetails?.currency ===
                                                    "INR"
                                                      ? "₹"
                                                      : "$"}
                                                    {
                                                      viewOrderDetails?.invoice
                                                        ?.amount_paid
                                                    }
                                                  </a>
                                                </span>
                                              )}
                                              <span className="badge badge-light">
                                                Balance :{" "}
                                                {viewOrderDetails?.currency ===
                                                "INR"
                                                  ? "₹"
                                                  : "$"}
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.balance
                                                }
                                              </span>
                                              <span className="badge badge-light">
                                                Tax :{" "}
                                                {viewOrderDetails?.currency ===
                                                "INR"
                                                  ? "₹"
                                                  : "$"}
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.total_tax
                                                }
                                              </span>
                                              <span className="badge badge-light">
                                                Discount :{" "}
                                                {viewOrderDetails?.currency ===
                                                "INR"
                                                  ? "₹"
                                                  : "$"}
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.discount_total
                                                }
                                              </span>
                                              <span className="badge badge-light">
                                                Total :{" "}
                                                {viewOrderDetails?.currency ===
                                                "INR"
                                                  ? "₹"
                                                  : "$"}
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.total
                                                }
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <hr className="!mt-[1rem] !mb-[1rem]" />

                                        <div className="px-2">
                                          {viewOrderDetails?.items?.map(
                                            (order, ind) => (
                                              <div
                                                className="products-row d-flex align-items-center justify-content-between flex-wrap mt-2"
                                                key={ind}
                                              >
                                                <img
                                                  src={
                                                    order?.product_details
                                                      ?.img_1
                                                  }
                                                  className="img-thumbnail"
                                                  width="75px"
                                                  alt=""
                                                />
                                                <div className="">
                                                  <h6 className="mb-1 text-[#424242] !font-bold">
                                                    {
                                                      order?.product_details
                                                        ?.name
                                                    }
                                                  </h6>
                                                  <p className="order-date justify-content-center d-flex align-items-center">
                                                    <span className="text-muted">
                                                      Qty :{" "}
                                                    </span>{" "}
                                                    <span className="text-dark">
                                                      {order?.qty}
                                                    </span>{" "}
                                                    <span className="mx-1">
                                                      |
                                                    </span>
                                                    <span className="text-muted">
                                                      Price :{" "}
                                                    </span>{" "}
                                                    <span className="text-dark">
                                                      {viewOrderDetails?.currency ===
                                                      "INR"
                                                        ? "₹"
                                                        : "$"}
                                                      {order?.price}
                                                    </span>
                                                  </p>
                                                </div>
                                                <h6 className="!font-bold text-lg">
                                                  <small>
                                                    {viewOrderDetails?.currency ===
                                                    "INR"
                                                      ? "₹"
                                                      : "$"}
                                                  </small>
                                                  {order?.total}
                                                </h6>
                                              </div>
                                            )
                                          )}

                                          <hr className="!mt-[1rem] !mb-[1rem]" />
                                          <div className="row addresses px-2 mb-3">
                                            <div className="col-12 col-lg-6 text-left">
                                              <h6 className="mb-1 capitalize !font-bold ">
                                                Billing Address
                                              </h6>
                                              <p className="mb-0 order-date capitalize">
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.address_1
                                                }
                                              </p>
                                              <p className="mb-0 order-date capitalize">
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.address_2
                                                }
                                              </p>
                                              <p className="mb-0 order-date capitalize">
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.billing_city
                                                }
                                                ,{" "}
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.billing_state
                                                }
                                              </p>
                                              <p className="mb-0 order-date capitalize">
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.billing_country
                                                }{" "}
                                                -{" "}
                                                {
                                                  viewOrderDetails?.invoice
                                                    ?.billing_zip
                                                }{" "}
                                              </p>
                                            </div>
                                            <div className="col-12 col-lg-6 text-right capitalize">
                                              <h6 className="mb-1 !font-bold">
                                                Shipping Address
                                              </h6>
                                              <p className="mb-0 order-date capitalize">
                                                {
                                                  viewOrderDetails?.shipping_add1
                                                }
                                              </p>
                                              <p className="mb-0 order-date capitalize">
                                                {
                                                  viewOrderDetails?.shipping_add2
                                                }
                                              </p>
                                              <p className="mb-0 order-date capitalize">
                                                {
                                                  viewOrderDetails?.shipping_city
                                                }
                                                ,{" "}
                                                {
                                                  viewOrderDetails?.shipping_state
                                                }
                                              </p>
                                              <p className="mb-0 order-date capitalize">
                                                {viewOrderDetails?.country} -{" "}
                                                {viewOrderDetails?.shipping_zip}{" "}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div
                            className="tab-pane fade"
                            id="prod-2"
                            role="tabpanel"
                            aria-labelledby="prod-2-tab"
                          >
                            ...
                          </div>
                          <div
                            className="tab-pane fade"
                            id="prod-3"
                            role="tabpanel"
                            aria-labelledby="prod-3-tab"
                          >
                            ...
                          </div>
                          <div
                            className="tab-pane fade"
                            id="prod-4"
                            role="tabpanel"
                            aria-labelledby="prod-4-tab"
                          >
                            ...
                          </div>
                        </div>
                      </div>
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
      {/* <!--Paid modal -->								 */}
      <div
        id="popup1"
        className={`popup-container text-left !ease-in-out ${
          showModal ? "show-popup " : ""
        }`}
      >
        <div className="popup-content">
          <a
            onClick={() => setShowModal(false)}
            className="close cursor-pointer"
          >
            &times;
          </a>
          <div className="pricing-tables turquoise">
            {/* <!-- Table Head --> */}
            <div className="pricing-labels">
              {viewOrderDetails?.order_number}
            </div>
            <h2>
              <small>
                Transaction id:{" "}
                {
                  viewOrderDetails?.payments[
                    viewOrderDetails?.payments?.length - 1
                  ]?.transaction_id
                }{" "}
              </small>
            </h2>
            <h5>
              <small className="">
                Payment id:{" "}
                {
                  viewOrderDetails?.payments[
                    viewOrderDetails?.payments?.length - 1
                  ]?.payment_id
                }
              </small>
            </h5>
            {/* <!-- Features --> */}
            <div className="pricing-features">
              <div className="feature">
                Payment 1:{" "}
                <span
                  className={` ${
                    viewOrderDetails?.payments[
                      viewOrderDetails?.payments?.length - 1
                    ]?.payment_status == "SUCCESS"
                      ? "borderr"
                      : "bg-red-300 border-red-600"
                  }`}
                >
                  {
                    viewOrderDetails?.payments[
                      viewOrderDetails?.payments?.length - 1
                    ]?.payment_status
                  }
                </span>
              </div>
              <div className="feature">
                Paid On:
                <span>
                  {new Date(
                    viewOrderDetails?.payments[
                      viewOrderDetails?.payments?.length - 1
                    ]?.updated_at
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="feature">
                Amount:
                <span>
                  {
                    viewOrderDetails?.payments[
                      viewOrderDetails?.payments?.length - 1
                    ]?.paid_amount
                  }
                </span>
              </div>
              <div className="feature">
                Payment Method:
                <span className="borders">
                  {" "}
                  {
                    viewOrderDetails?.payments[
                      viewOrderDetails?.payments?.length - 1
                    ]?.payment_type
                  }
                </span>
              </div>
            </div>
            {/* <!-- Price --> */}
            {/* <!--<div class="price-tag">
               <span class="symbol">₹</span>
               <span class="amount">500.00</span>
               <span class="after">/month</span>
            </div>-->
            <!-- Button -->
            <!--<a class="price-button" href="#">Get Started</a>--> */}
          </div>
        </div>
      </div>
      {/* <!-- Paid Modal Ends--> */}
    </>
  );
}
