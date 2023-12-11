/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import {
  hideLoader,
  showLoader,
} from "../../../../features/loader/loaderSlice";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { Divider } from "@mui/material";
import CryptoJS from "crypto-js";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { updateUsers } from "../../../../features/users/userSlice";
import { IoMdRemoveCircle } from "react-icons/io";
import { logoutUser } from "../../../../features/login/loginSlice";
import { TbMoodSad2 } from "react-icons/tb";
import { BsFillPlayFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export default function PaymentVerifyStripe() {
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loaderState = useSelector((state) => state?.loader?.value);
  const userData = useSelector((state) => state?.user?.value);
  const cartProducts = useSelector((state) => state?.cart?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  const [allProducts, setAllProducts] = useState(cartProducts);
  const [paymentStatus, setPaymentStatus] = useState("loading");
  // State variable to track quantities for each product
  const [orderData, setOrderData] = useState({});

  // eslint-disable-next-line no-unused-vars
  const [paymentVerification, setPaymentVerification] = useState(false);
  const orderID = localStorage.getItem("orderID");
  const [clientToken, setClientToken] = useState("");
  const [time, setTime] = useState(5);
  const [paymentVerifyError, setPaymentVerifyError] = useState(
    `There was some internal issue with the payment on ${new Date().toLocaleDateString(
      "en-GB"
    )}`
  );

  // State variable to store prices for each product
  const queryParams = new URLSearchParams(window.location.search);
  console.log(
    params,
    "params",
    queryParams.get("payment_intent"),
    queryParams.get("payment_intent_client_secret")
  );
  const id = localStorage.getItem("order_id");
  const decryptedId = CryptoJS.AES.decrypt(
    id.replace(/_/g, "/").replace(/-/g, "+"),
    "trading_materials_order"
  ).toString(CryptoJS.enc.Utf8);
  console.log(decryptedId);

  console.log(cartProducts, "gggggggg");

  const fetchOrderdetails = async (client_id) => {
    try {
      console.log(localStorage.getItem("client_token"));
      dispatch(showLoader());
      const response = await axios.get(
        `https://admin.tradingmaterials.com/api/client/product/checkout/view-order?order_id=${localStorage.getItem(
          "order_id"
        )}&client_id=${client_id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        setAllProducts(response?.data?.data?.items);
        setOrderData(response?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (paymentStatus === "success") {
      console.log(time);
      const interval = setInterval(() => {
        setTime(time - 1);
        if (time === 1) {
          clearInterval(interval);
          console.log(clientToken, "actoken");
          console.log(localStorage.getItem("tmToken"));
          if (clientToken === undefined || clientToken === "") {
            window.location.href = `https://client.tradingmaterials.com/auto-login/${localStorage.getItem(
              "client_token"
            )}`;
          } else {
            window.location.href = `https://client.tradingmaterials.com/auto-login/${clientToken}`;
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [paymentStatus, time, clientToken]);

  const getUserInfo = async () => {
    try {
      dispatch(showLoader());
      const response = await axios.get(
        "https://admin.tradingmaterials.com/api/client/get-user-info",
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        console.log(response?.data);
        dispatch(updateUsers(response?.data?.data));
        localStorage.setItem("client_id", response?.data?.data?.client?.id);
        verifyPayment(response?.data?.data?.client?.id);
        fetchOrderdetails(response?.data?.data?.client?.id);
      } else {
        console.log(response?.data);

        dispatch(logoutUser());
        localStorage.removeItem("client_token");
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

  //payment verification Stripe
  async function verifyPayment(client_id) {
    const token = localStorage.getItem("client_token");
    console.log(token);
    sessionStorage.setItem("order_id", id);
    localStorage.setItem("order_id", id);

    try {
      setPaymentVerification(true);

      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/product/checkout/verify-payment",
        {
          order_id: params?.id,
          payment_id: queryParams.get("payment_intent"),
          payment_type: "Stripe",
          client_id: client_id,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.data.status) {
        console.log(response?.data?.token, "actoken");
        setClientToken(response?.data?.token);
        localStorage.setItem("tmToken", response?.data?.token);
        if (response?.data?.code === "SUCCESS") {
          // setShowLoader(false)
          setPaymentStatus("success");
        } else if (response?.data?.code === "EXISTS") {
          // setShowLoader(false)
          setPaymentStatus("success");
        } else {
          setPaymentStatus("success");
          //   setShowLoader(false)
        }

        localStorage.setItem("client_type", "client");
      } else {
        // Handle the case where response.data.status is false
        console.log(
          "Payment verification failed:",
          response.data,
          response?.data?.message?.message
        );
        if (
          response?.data?.message?.code?.includes(
            "payment_intent_authentication_failure"
          ) ||
          response?.data?.message?.message?.includes("payment_method_data")
        ) {
          setPaymentVerifyError("Payment cancelled, please try again later");
        } else if (
          response?.data?.message?.decline_code == "generic_decline" ||
          response?.data?.message?.message?.includes("does not support")
        ) {
          setPaymentVerifyError(
            "The last payment was incomplete due to no response from the transferring bank."
          );
        } else {
          setPaymentVerifyError(response?.data?.message?.message);
        }
        if (response?.data?.code === "ACTION_REQ") {
          window.location.herf = response?.data?.url;
        } else if (response?.data?.code === "FAILED") {
          setPaymentStatus("failed");
        } else {
          setPaymentStatus("failed");
        }
        setPaymentStatus("failed");
      }
    } catch (error) {
      // Log the error for debugging
      console.error("An error occurred during payment verification:", error);
      if (error?.response?.data?.message?.includes("payment_method_data")) {
        setPaymentStatus("failed");
        setPaymentVerifyError("Payment cancelled, please try again later");
      } else if (
        error?.response?.data?.message?.decline_code == "generic_decline" ||
        error?.response?.data?.message?.message?.includes("does not support")
      ) {
        setPaymentVerifyError(
          "The last payment was incomplete due to no response from the transferring bank."
        );
      } else {
        setPaymentStatus("failed");
        setPaymentVerifyError(error?.response?.data?.message);
      }
    } finally {
      setPaymentVerification(false);
    }
  }

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <Header />
      <div className="nk-pages text-left mt-80 sm:mt-60 md:mt-40">
        <section className="nk-banner nk-banner-career-job-details bg-gray">
          <div className="nk-banner-wrap pt-120 pt-lg-180 pb-[100px] lg:!pb-[300px]">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-xxl-5 text-left">
                  <div>
                    <a
                      onClick={() => {
                        if (paymentStatus !== "success") {
                          navigate(`${userLang}/`);
                        }
                      }}
                      className="btn-link mb-2 !inline-flex !items-center !text-large !font-semibold"
                    >
                      <em className="icon ni ni-arrow-left  !inline-flex !items-center !text-large !font-semibold"></em>
                      <span>Back to Home</span>
                    </a>
                    <h1 className="mb-3 font-bold !text-4xl">Order Summary</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="nk-section nk-section-job-details pt-lg-0">
          <div className="container">
            <div className="nk-section-content row px-lg-5">
              <div className="col-12 text-center flex justify-center h-fit  sm:py-2 container">
                {paymentStatus == "failed" && (
                  <p
                    className="flex items-center capitalize text-xl"
                    data-aos="fade-left"
                  >
                    <IoMdRemoveCircle className="text-red-600 mr-1  text-xl" />{" "}
                    payment failed
                  </p>
                )}
              </div>
              <div className="col-lg-8 h-fit">
                <div className="nk-entry pe-lg-5 !pt-1 max-h-[50%] overflow-y-auto">
                  <div className="mb-">
                    {allProducts?.length > 0 ? (
                      <table className="table max-h-[50%] overflow-y-auto">
                        <tbody>
                          {allProducts?.length &&
                            allProducts?.map((product, ind) => {
                              return (
                                <tr key={ind}>
                                  <td className="">
                                    <div className="d-flex justify-between hover:!shadow-lg align-items-center">
                                      <img
                                        src={product?.product?.img_1}
                                        alt="product-image"
                                        className="mb-0 mr-2 cursor-pointer w-[25%] lg:w-[20%]"
                                        // width="150px"
                                      />
                                      <div className="min-w-[70%] max-w-[70%] md:min-w-[59%] md:max-w-[59%]">
                                        <p
                                          className="prod-title mb-0 text-xs lg:!text-md md:!text-sm  cursor-pointer"
                                          style={{
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            width: "90%",
                                          }}
                                        >
                                          {product?.product?.name}
                                        </p>

                                        <p className="prod-desc  mb-1 text-success  text-xs lg:!text-md md:!text-sm">
                                          In Stock
                                        </p>
                                        <div className=" ">
                                          <div id="counter" className="">
                                            Qty:
                                            <span className="fs-18 m-0 text-gray-1200 text-xs lg:!text-md md:!text-sm !font-bold !ml-1 !mr-2r">
                                              {product?.qty || 1}
                                            </span>
                                          </div>
                                          <div
                                            className="!mt-3"
                                            // style={{ marginLeft: "1rem" }}
                                          >
                                            <span className="total text-white font-semibold text-xs lg:!text-md md:!text-sm">
                                              ₹ {product?.price}
                                            </span>{" "}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="hidden md:flex flex-wrap align-items-center">
                                        <img
                                          src="https://cdn-icons-png.flaticon.com/512/2203/2203145.png"
                                          className="mb-0 mr-1"
                                          width="35px"
                                          alt=""
                                        />
                                        <p
                                          className="prod-desc mb-0 text-success"
                                          style={{ marginLeft: "5px" }}
                                        >
                                          Quick Delivery
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center font-bold text-gray-700 ">
                        <p>No products found in cart</p>
                        <p
                          className="nav-link text-green-900"
                          onClick={() => navigate("/products")}
                        >
                          {" "}
                          Click here to add items
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* <hr className="mt-2" /> */}
                <div className="mt-5">
                  {orderData ? (
                    <div className="nk-section-blog-details mt-3 mb-3">
                      {orderData?.order?.note != null && (
                        <div>
                          <h4 className="mb-1 !font-bold">Comments</h4>
                          <ul className="d-flex flex-column gap-2 pb-0">
                            <li className="d-flex align-items-center gap-5 text-gray-1200">
                              {orderData?.order?.note}
                            </li>
                          </ul>
                        </div>
                      )}
                      <Divider className="mt-2 mb-2" />
                      <h4 className="mb-3 !font-bold">Billing Address</h4>
                      <ul className="d-flex flex-column gap-2 pb-0">
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Full Name:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75 capitalize">
                            {orderData?.order?.name === null
                              ? userData?.client?.first_name
                              : orderData?.order?.name}
                          </p>
                        </li>
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Address:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            {orderData?.order?.address_1},{" "}
                            {orderData?.order?.address_2?.length > 0
                              ? `${orderData?.order?.address_2},  `
                              : ""}
                            {orderData?.order?.city}, {orderData?.order?.state},{" "}
                            {orderData?.order?.country}, {orderData?.order?.zip}
                          </p>
                        </li>
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Shipping Type:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            Standard (2-5 business days)
                          </p>
                        </li>
                      </ul>

                      <div>
                        <hr className="mr-2 mt-2" />
                      </div>
                      <div className="nk-section-blog-details mt-3"></div>
                    </div>
                  ) : (
                    <div className="nk-section-blog-details mt-3"></div>
                  )}
                  <div className="nk-section-blog-details mt-3">
                    <div className="max-h-[200px] md:max-h-[225px] overflow-y-auto">
                      <h4 className="mb-3 !font-bold">Shipping Address</h4>

                      <ul className="d-flex flex-column gap-2 pb-0">
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Full Name:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            {orderData?.order?.name === null
                              ? userData?.client?.first_name
                              : orderData?.order?.name}
                          </p>
                        </li>
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Address:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            {orderData?.order?.shipping_add1},{" "}
                            {orderData?.order?.shipping_add2 !== null
                              ? `${orderData?.order?.shipping_add2},  `
                              : ""}
                            {orderData?.order?.shipping_city},{" "}
                            {orderData?.order?.shipping_state},{" "}
                            {orderData?.order?.shipping_country},{" "}
                            {orderData?.order?.shipping_zip}
                          </p>
                        </li>
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Shipping Type:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            Standard (2-5 business days)
                          </p>
                        </li>
                      </ul>
                    </div>
                    <Divider className="my-2 lg:hidden" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ps-lg-0 mt-5 md:mt-0">
                {paymentStatus !== "loading" && paymentStatus == "failed" && (
                  <div data-aos="fade-down">
                    <div className="flex justify-center">
                      <TbMoodSad2 className="text-red-600 text-4xl" />
                    </div>
                    <h2 className="!font-bold text-lg text-center">
                      Sorry, payment failed!
                    </h2>
                    <p className="text-center">
                      Payment failed from gateway: The payment attempted for the
                      purchase did not go through due to an issue with the
                      payment gateway. Please contact your payment provider for
                      more information.
                    </p>
                    <div className="flex justify-center items-center my-2">
                      <Button
                        variant="contained"
                        href={`/checkout/order_id/${CryptoJS?.AES?.encrypt(
                          `${orderID}`,
                          "trading_materials_order"
                        )
                          ?.toString()
                          .replace(/\//g, "_")
                          .replace(/\+/g, "-")}`}
                        target="_blank"
                        type="button"
                        className="!bg-red-600 !border-red-600 drop-shadow-lg text-white w-[50%] md:w-[35%]  text-center p-2 mr-1 !rounded-none"
                      >
                        Retry
                      </Button>
                    </div>
                    <p
                      className="text-[#00a3d9] cursor-pointer font-bold flex items-center justify-center"
                      onClick={() =>
                        window.open(
                          `/orders/${CryptoJS?.AES?.encrypt(
                            `${userData?.client?.id}`,
                            "order_details"
                          )
                            ?.toString()
                            .replace(/\//g, "_")
                            .replace(/\+/g, "-")}`,
                          "_blank"
                        )
                      }
                    >
                      {" "}
                      <BsFillPlayFill /> Back to &ldquo;My Orders&ldquo;
                    </p>
                  </div>
                )}
                {paymentStatus !== "loading" && paymentStatus != "failed" && (
                  <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5">
                    <div className="paper-container !text-center ">
                      <div className="printer-bottom"></div>

                      <div className={`paper drop-shadow-lg `}>
                        <div
                          className={`main-contents ${
                            paymentStatus === "failed"
                              ? "!bg-gradient-to-tr from-red-600 to-red-200"
                              : paymentStatus === "success"
                              ? "!bg-gradient-to-tr from-green-600 to-green-200"
                              : ""
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center ${
                              paymentStatus === "success"
                                ? "success-icon "
                                : "fail-icon"
                            }`}
                          >
                            {paymentStatus === "success" && (
                              <CheckIcon fontSize="large" />
                            )}
                            {paymentStatus === "failed" && (
                              <ClearIcon
                                fontSize="large"
                                className="!font-bold"
                              />
                            )}
                          </div>
                          <div
                            className={`success-title !text-xl ${
                              paymentStatus === "loading" ? "" : "!text-white"
                            }`}
                          >
                            {paymentStatus === "success"
                              ? "Payment Successful"
                              : "Payment Failure"}
                          </div>

                          <div
                            className={`success-description ${
                              paymentStatus === "loading" ? "" : "!text-white"
                            }`}
                          >
                            {paymentStatus === "success"
                              ? `Thank you for your payment made on ${new Date().toLocaleDateString(
                                  "en-GB"
                                )} `
                              : paymentVerifyError}
                          </div>
                          <div className="order-details"></div>
                          {paymentStatus === "success" ? (
                            <>
                              <div
                                className={`order-footer text-gray-700  ${
                                  paymentStatus === "loading"
                                    ? ""
                                    : "!text-white"
                                }`}
                              >
                                Thankyou
                              </div>
                              <small
                                className={`cursor-pointer hover:text-green-600  font-bold  ${
                                  paymentStatus === "loading"
                                    ? ""
                                    : "!text-white"
                                }`}
                                onClick={() =>
                                  navigate(`/order-tracking/${orderID}`)
                                }
                              >
                                Do not Refresh the page, we will redirect to
                                your orders in {time}
                              </small>
                            </>
                          ) : (
                            <div className="order-footer">
                              <Button
                                variant="contained"
                                href={`/checkout/order_id/${CryptoJS?.AES?.encrypt(
                                  `${orderID}`,
                                  "trading_materials_order"
                                )
                                  ?.toString()
                                  .replace(/\//g, "_")
                                  .replace(/\+/g, "-")}`}
                                target="_blank"
                                type="button"
                                className="!bg-red-600 !border-red-600 drop-shadow-lg text-white w-[50%] p-2 mr-1 !rounded-none"
                              >
                                Retry
                              </Button>
                            </div>
                          )}
                        </div>
                        <div
                          className={`jagged-edge ${
                            paymentStatus === "success"
                              ? "jagged-edge-success"
                              : paymentStatus === "failed"
                              ? "jagged-edge-failed"
                              : "jagged-edge-loading"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentStatus === "loading" && (
                  <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5 ">
                    <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5">
                      <div className="paper-container !text-center ">
                        <div className="printer-bottom"></div>

                        <div className="paper !h-full">
                          <div className="main-contents h-[40vh] flex items-center justify-center text-2xl">
                            <div className="payment-loading drop-shadow-lg ">
                              <span className="v">V</span>
                              <span className="e">e</span>
                              <span className="r">r</span>
                              <span className="r">i</span>
                              <span className="f">f</span>
                              <span className="y">y</span>
                              <span className="i">i</span>
                              <span className="n">n</span>
                              <span className="g">g</span>
                              <span className="d1">.</span>
                              <span className="d2">.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="nk-section nk-cta-section">
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
                      <h3 className="text-capitalize m-0">
                        Chat with our support team!
                      </h3>
                      <p className="fs-16 opacity-75">
                        Get in touch with our support team if you still can’t
                        find your answer.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                  <a href={`/contactus`} className="btn btn-white fw-semiBold">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
