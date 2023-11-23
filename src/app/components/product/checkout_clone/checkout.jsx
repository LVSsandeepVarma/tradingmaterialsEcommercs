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
import ShippingAddressModal from "../../modals/address";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { FaCreditCard, FaCalendarAlt, FaLock } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CryptoJS from "crypto-js";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import Dashboard from "../../commonDashboard/Dashboard";
import { useTranslation } from "react-i18next";
import SessionExpired from "../../modals/sessionExpired";
import moment from "moment";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const loaderState = useSelector((state) => state?.loader?.value);
  const userData = useSelector((state) => state?.user?.value);
  const cartProducts = useSelector((state) => state?.cart?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  const isLoggedIn = useSelector((state) => state.login?.value);

  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [clientToken, setClientToken] = useState("");
  const [apiError, setApiError] = useState([]);

  const [allProducts, setAllProducts] = useState(cartProducts);
  const [fomrType, setFormType] = useState("add");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCVV] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentType, setPaymentType] = useState("online");
  const [showSessionExpiry, setShowSessionExpiry] = useState(false);
  const [cardNumberError, setCardNumberError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvvError, setCVVError] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [activeAccordion, setActiveAccordion] = useState("online");
  const [activePaymentMethodAccordion, setActivePaymentMethodAccordion] =
    useState("");
  const [activeShippingAddress, setActiveShippingAddress] = useState(
    userData?.client?.address[0]
  );
  const [activeBillingAddress, setActivebillingAddress] = useState(
    userData?.client?.primary_address[0]
  );
  const [activeShippingAddressChecked, setActiveShippingaddressChecked] =
    useState(0);
  const [activeBillingAddfreeChecked, setActiveBillingAddressChecked] =
    useState(0);
  const [addressUpdateType, setAddressUpdateType] = useState("");
  const [activePaymentMethod, setActivePaymentMethod] = useState("");
  // State variable to track quantities for each product
  const [paymentVerifyError, setPaymentVerifyError] = useState(
    `There was some internal issue with the payment on ${new Date().toLocaleDateString(
      "en-GB"
    )}`
  );
  const [orderData, setOrderData] = useState({});
  const [paymentVerification, setPaymentVerification] = useState(false);
  const [time, setTime] = useState(5);
  const [activePaymentType, setActivePAymentType] = useState("");
  // State variable to store prices for each product
  const [prices, setPrices] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  const { id } = useParams();
  const { encryptedrderId } = useParams();
  const decryptedId = CryptoJS.AES.decrypt(
    id.replace(/_/g, "/").replace(/-/g, "+"),
    "trading_materials_order"
  ).toString(CryptoJS.enc.Utf8);
  console.log(decryptedId);
  const orderID = localStorage.getItem("orderID");

  console.log(cartProducts, "gggggggg");

  console.log(userData, "ttttttttt");

  useEffect(() => {
    if (userData?.client?.payment_types?.length > 0) {
      setActivePaymentMethod(userData?.client?.payment_types[0]?.name);
    }
  }, []);

  // useEffect(() => {
  //   if (paymentStatus === "success") {
  //     console.log(time);
  //     const interval = setInterval(() => {
  //       setTime(time - 1);
  //       if (time === 1) {
  //         clearInterval(interval);
  //         console.log(clientToken, "actoken");
  //         console.log(localStorage.getItem("tmToken"));
  //         if (clientToken === undefined || clientToken === "") {
  //           window.location.href = `https://client.tradingmaterials.com/auto-login/${localStorage.getItem(
  //             "client_token"
  //           )}`;
  //         } else {
  //           window.location.href = `https://client.tradingmaterials.com/auto-login/${clientToken}`;
  //         }
  //       }
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [paymentStatus, time, clientToken]);

  const fetchOrderdetails = async () => {
    try {
      console.log(userData?.client?.id, "ttttttttt");
      dispatch(showLoader());
      if (userData?.client?.id !== undefined) {
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/client/product/checkout/view-order?order_id=${decryptedId}&client_id=${userData?.client?.id}`,
          {
            headers: {
              Authorization: `Bearer ` + localStorage.getItem("client_token"),
            },
          }
        );
        if (response?.data?.status) {
          setAllProducts(response?.data?.data?.items);
          setSubTotal(response?.data?.data?.sub_total);
          setOrderData(response?.data?.data);
          console.log(
            response?.data?.data?.payments,
            response?.data?.data?.payments[0]?.status === 1
          );
          if (response?.data?.data?.payments?.length > 0) {
            const latestPaymentIndex = response?.data?.data?.payments?.length;
            if (
              response?.data?.data?.payments[latestPaymentIndex - 1]?.status ===
              1
            ) {
              setPaymentStatus("success");
              // setPaymentVerification(true)
            }
          }
        }
      } else {
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/client/product/checkout/view-order?order_id=${decryptedId}&client_id=${localStorage.getItem(
            "id"
          )}`,
          {
            headers: {
              Authorization: `Bearer ` + localStorage.getItem("client_token"),
            },
          }
        );
        if (response?.data?.status) {
          setAllProducts(response?.data?.data?.items);
          setSubTotal(response?.data?.data?.sub_total);
          setOrderData(response?.data?.data);
          console.log(
            response?.data?.data?.payments,
            response?.data?.data?.payments?.length
          );
          if (response?.data?.data?.payments?.length > 0) {
            const latestPaymentIndex = response?.data?.data?.payments?.length;
            if (
              response?.data?.data?.payments[latestPaymentIndex - 1]?.status ===
              1
            ) {
              setPaymentStatus("success");
              // setPaymentVerification(true)
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      const errMsg = err?.response?.data?.message?.toLowerCase();
      if (
        errMsg?.includes("token") ||
        errMsg?.includes("expired") ||
        errMsg?.includes("expire")
      ) {
        setShowSessionExpiry(true);
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    console.log(userData, "ttttttttt", isLoggedIn);
    fetchOrderdetails();
  }, [userData]);

  const handleCvvChange = (e) => {
    e.target.value = e.target.value.trim();
    const addCvv = e.target.value.replace(/[^0-9]/g, "");

    setCVV(addCvv);
    console.log(addCvv.match(/^[0-9]+$/), addCvv);
    if (addCvv == "") {
      setCVVError("CVV is required");
    } else if (addCvv?.length > 3 || addCvv?.length < 3) {
      setCVVError("Invalid CVV");
    } else if (addCvv.match(/^[0-9]+$/) === null) {
      setCVVError("Invalid CVV");
    } else {
      setCVVError("");
    }
    if (apiError?.length > 0) {
      setApiError([]);
    }
  };

  const handleNameChage = (e) => {
    e.target.value = e.target.value.trimStart();
    e.target.value = e.target.value.replace(/[^A-Za-z ]/g, "");
    const addName = e.target.value;
    setNameOnCard(addName);
    if (addName?.length == 0) {
      setNameErr("Name is required");
    } else {
      if (validateName(addName) !== null) {
        setNameErr("");
      } else {
        setNameErr("Invalid name");
      }
    }
  };

  const formatCardNumber = (value) => {
    // Remove any non-digit characters from the input value
    const cardNumberDigits = value.replace(/\D/g, "");
    // Split the card number into groups of 4 digits
    const cardNumberGroups = cardNumberDigits.match(/.{1,4}/g);
    // Join the groups with a space between them
    return cardNumberGroups ? cardNumberGroups.join(" ") : cardNumberDigits;
  };

  const formatExpiry = (value) => {
    // Remove any non-digit characters from the input value
    const expiryDigits = value.replace(/\D/g, "");
    // Split the expiry value into month and year
    const month = expiryDigits.slice(0, 2);
    const year = expiryDigits.slice(2, 4);
    // Format the expiry value as MM/YY
    return `${month}/${year}`;
  };

  const validateExpiry = (value) => {
    // Implement your expiry date validation logic here
    // For example, you can check if the expiry date is in the future and in the valid format
    // Return true if the expiry date is valid, otherwise false

    if (!value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      return false;
    } else {
      const year = value.split("/")[1];
      const month = value.split("/")[0];
      const currentYear = moment().year().toString();
      const currentMonth = new Date().getMonth();
      console.log(
        parseInt(currentYear.slice(2, 4)) >= parseInt(year),
        parseInt(currentYear.slice(2, 4)),
        parseInt(year),
        "yeeeer"
      );
      console.log(
        parseInt(currentMonth) + 1 >= parseInt(month),
        parseInt(currentMonth) + 1,
        parseInt(month),
        "curMon",
        parseInt(currentYear.slice(2, 4)) == parseInt(year)
      );
      if (parseInt(currentYear.slice(2, 4)) > parseInt(year)) {
        return false;
      } else if (
        parseInt(currentYear.slice(2, 4)) == parseInt(year) &&
        parseInt(currentMonth) + 1 > parseInt(month)
      ) {
        return false;
      }

      if (value?.length <= 1) {
        return false;
      }
      return true;
    }
  };

  const validateCardNumber = (value) => {
    // Implement your card number validation logic here
    // For example, you can use a library like 'card-validator'
    // Return true if the card number is valid, otherwise false
    return value?.length >= 17 && value?.length <= 19;
  };

  const validateCVV = (value) => {
    // Implement your CVV validation logic here
    // For example, you can check if the CVV is a 3 or 4 digit number
    // Return true if the CVV is valid, otherwise false
    return value?.length === 3 || value?.length === 4;
  };

  const handleCardNumberChange = (event) => {
    event.target.value = event.target.value.trimStart();
    const formattedValue = formatCardNumber(event.target.value);
    setCardNumber(formattedValue);
    if (validateCardNumber(formattedValue)) {
      setCardNumberError("");
    } else {
      if (event.target.value == "") {
        setCardNumberError("Card number is required");
      } else {
        setCardNumberError("Please enter a valid card number.");
      }
    }

    if (apiError?.length > 0) {
      setApiError([]);
    }
  };

  const handleExpiryChange = (event) => {
    const formattedValue = formatExpiry(event.target.value);
    if (validateExpiry(formattedValue)) {
      setExpiryError("");
    } else {
      if (formattedValue == "/" || formattedValue == "") {
        setExpiryError("Expiry is required");
      } else {
        setExpiryError("Invalid expiry");
      }
    }
    setExpiry(formattedValue);
    if (apiError?.length > 0) {
      setApiError([]);
    }
  };

  const validateName = (value) => {
    console.log(value.match(/^[a-zA-Z ]+$/), value);

    return value.match(/^[a-zA-Z ]+$/);
  };

  const handleSubmit = async () => {
    // event.preventDefault();
    const isNameValid = validateName(nameOnCard);
    const isCardNumberValid = validateCardNumber(cardNumber);
    const isExpiryValid = validateExpiry(expiry);
    const isCVVValid = validateCVV(cvv);
    console.log(nameErr, cardNumberError, cvvError, expiryError);
    if (
      nameErr === "" &&
      cardNumberError === "" &&
      expiryError === "" &&
      cvvError === ""
    ) {
      console.log(isCVVValid, isCardNumberValid, isExpiryValid, isNameValid);
      if (
        isNameValid !== null &&
        isCardNumberValid !== false &&
        isExpiryValid !== null &&
        isCVVValid !== false
      ) {
        console.log("all fields are validated and are valid");
        // setIsSuccess(true)
      } else {
        if (isNameValid === null) {
          if (nameOnCard != "") {
            setNameErr("Invalid name");
          } else {
            setNameErr("Name is required");
          }
        }
        if (isCardNumberValid === false) {
          if (cardNumber != "") {
            setCardNumberError("Card number is invalid");
          } else {
            setCardNumberError("Card number is required");
          }
        }
        if (isExpiryValid === false) {
          if (expiry != "") {
            setExpiryError("Invalid card expiry");
          } else {
            setExpiryError("Expiry is required");
          }
        }
        if (isCVVValid === false) {
          if (cvvError != "") {
            setCVVError("Invalid CVV");
          } else {
            setCVVError("CVV is required");
          }
        }
        // setIsFailure(true)
      }
    } else {
      if (nameOnCard === "") {
        setNameErr("Name is required");
      }
      if (cardNumber === "") {
        setCardNumberError("Card number is required");
      }
      if (expiry === "") {
        setExpiryError("Card expiry required");
      }
      if (cvv === "") {
        setCVVError("CVV requried");
      }
      // setIsFailure(true)
    }
  };

  // function for updating choosen payment method
  const handlePaymentMethod = (paymentType) => {
    console.log(paymentType, "paymentType");
    setActivePaymentMethod(paymentType);
  };

  //payment verification razorpay
  async function handleBookingPaymentResponse(res) {
    console.log(res);
    const token = localStorage.getItem("client_token");
    console.log(token);
    sessionStorage.setItem("order_id", res.razorpay_order_id);
    try {
      setPaymentVerification(true);
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/product/checkout/verify-payment",
        {
          order_id: res.razorpay_order_id,
          payment_id: res.razorpay_payment_id,
          signature: res.razorpay_signature,
          payment_type: "Razor_Pay",
          client_id: userData?.client?.id,
        },
        {
          headers: {
            Authorization: `Bearer ` + token,
          },
        }
      );
      if (response.data.status) {
        console.log(response?.data);
        setPaymentStatus("success");
        setClientToken(response?.data?.token);
        localStorage.setItem("client_type", "client");
        fetchOrderdetails();
        // sendDetails();
      }
    } catch (error) {
      console.log(error);
      setPaymentStatus("failed");
      const errMsg = error?.response?.data?.message?.toLowerCase();
      if (error?.response?.data?.message) {
        setPaymentStatus("failed");
        setPaymentVerifyError(error?.response?.data?.message);
      }
      if (
        errMsg?.includes("token") ||
        errMsg?.includes("expired") ||
        errMsg?.includes("expire")
      ) {
        setShowSessionExpiry(true);
      }
    } finally {
      setPaymentVerification(false);
    }
  }

  //razorpay window
  function handleRazorpayPayment(res) {
    console.log(res);
    var options = {
      key_id: res?.client_id,
      amount: res?.total,
      currency: "INR",
      name: "Trading Materials",
      description: "Booking Request amount for Trading Materials",
      image: "https://tradingmaterials.com/images/tm-logo-1.webp",
      order_id: res?.order_id,
      handler: handleBookingPaymentResponse,
      prefill: {
        name: userData?.client?.first_name,
        email: userData?.client?.email,
        contact: userData?.client?.phone,
      },
      notes: {
        address: "note value",
      },
      theme: {
        color: " #0000FF",
      },
    };

    let rzp = new window.Razorpay(options);
    rzp.open();
  }

  // create order for razorpay
  async function createOrder(id, total, client_id) {
    try {
      dispatch(showLoader());
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/product/checkout/create-order",
        {
          payment_type: "Razor_Pay",
          payment_mode: paymentType,
          client_id: client_id,
          order_id: id,
          total: total,
        },
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
          },
        }
      );

      if (response?.data?.status) {
        console.log(response?.data);
        handleRazorpayPayment(response?.data?.data);
      }
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.errors) {
        setApiError([Object.values(err?.response?.data?.errors)]);
      } else {
        const errMsg = err?.response?.data?.message?.toLowerCase();
        if (
          errMsg?.includes("token") ||
          errMsg?.includes("expired") ||
          errMsg?.includes("expire")
        ) {
          setShowSessionExpiry(true);
        } else {
          setApiError([err?.response?.data?.message]);
        }
      }
    } finally {
      dispatch(hideLoader());
    }
  }

  //create order for stripe
  async function createOrderWithStripe(
    id,
    total,
    client_id,
    city,
    state,
    country,
    zipcode,
    address
  ) {
    handleSubmit();
    if (
      nameErr === "" &&
      expiryError === "" &&
      cvvError === "" &&
      cardNumberError === "" &&
      nameOnCard !== "" &&
      expiry !== "" &&
      cvv !== "" &&
      expiry !== ""
    ) {
      try {
        console.log(orderData?.order, "orderData");
        dispatch(showLoader());
        const paymentData = {
          payment_type: "Stripe",
          payment_mode: paymentType,
          client_id: userData?.client?.id,
          order_id: id,
          total: total,
          amount: total,
          city: orderData?.order?.city,
          state: orderData?.order?.state,
          address_1: orderData?.order?.address_1,
          zipcode: orderData?.order?.zip,
          country: orderData?.order?.country,
          card_number: cardNumber,
          exp_month_year: expiry,
          cvc: cvv,
          name_on_card: nameOnCard,
          currency: "INR",
          call_back_url: "http://localhost:3001/payment-status/",
        };
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/product/checkout/create-order",
          paymentData,
          {
            headers: {
              Authorization: `Bearer ` + localStorage.getItem("client_token"),
            },
          }
        );

        if (response?.data?.status) {
          console.log(response, "response");

          // console.log(response?.data);
          localStorage.setItem("id", id);
          localStorage.setItem("order_id", id);
          localStorage.setItem("orderID", decryptedId);
          window.location.replace(response?.data?.redirect_url);
          // handleStripePayment(response?.data?.data);
        }
      } catch (err) {
        console.log(err);
        if (err?.response?.data?.errors) {
          setApiError([Object?.values(err?.response?.data?.errors)]);
        } else {
          const errMsg = err?.response?.data?.message?.toLowerCase();
          if (err?.response?.data?.message?.includes("unknown")) {
            setApiError([
              "Payment unsuccessful. Kindly consider an alternative Indian card for your transaction.",
            ]);
          } else if (
            errMsg?.includes("token") ||
            errMsg?.includes("expired") ||
            errMsg?.includes("expire")
          ) {
            setShowSessionExpiry(true);
          } else {
            setApiError([err?.response?.data?.message]);
          }
        }
        dispatch(hideLoader());
        setTimeout(() => {
          setApiError([]);
        }, 2500);
      } finally {
        // dispatch(hideLoader());
      }
    }
  }

  function handleSessionExpiryClose() {
    setShowSessionExpiry(false);
    navigate("/login");
  }

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}

      <SessionExpired
        open={showSessionExpiry}
        handleClose={handleSessionExpiryClose}
      />
      <Dashboard />
      {addressUpdateType === "shipping" && (
        <ShippingAddressModal
          show={showModal}
          onHide={() => setShowModal(false)}
          type={fomrType}
          addressType={addressUpdateType}
          data={
            fomrType === "add"
              ? []
              : activeShippingAddress === undefined
              ? userData?.client?.address[activeShippingAddressChecked]
              : activeShippingAddress
          }
          // handleFormSubmit={handleFormSubmit}
        />
      )}

      {addressUpdateType === "billing" && (
        <ShippingAddressModal
          show={showModal}
          onHide={() => setShowModal(false)}
          type={fomrType}
          addressType={addressUpdateType}
          data={
            fomrType === "add"
              ? []
              : activeBillingAddress === undefined
              ? userData?.client?.address[activeBillingAddfreeChecked]
              : activeBillingAddress
          }
          // handleFormSubmit={handleFormSubmit}
        />
      )}

      {isSuccess && (
        <div
          className=" top-0 left-1/2 transform-translate-x-1/9 bg-green-500 text-white px-4 py-2 rounded shadow-lg absolute  "
          style={{
            zIndex: 100000,
            animation: "slide-down 2s ease-in-out",
            animationFillMode: "forwards",
          }}
        >
          Address added successfully!
        </div>
      )}

      {/* Failure Alert */}
      {isFailure && (
        <div
          className="top-0 left-1/2 transform-translate-x-1/9 bg-red-500 text-white px-4 py-2 rounded shadow-lg absolute "
          style={{
            animation: "slide-down 2s ease-in-out",
            animationFillMode: "forwards",
          }}
        >
          Address submission failed!
        </div>
      )}
      <Header />
      <div className="nk-pages text-left !border-0 drop-shadow-lg">
        <section className="nk-section pt-0">
          <div className="nk-mask blur-1 left center"></div>
          <div className="container">
            <div className="row mt-1">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header px-3 py-1">
                    <h5 className="text-muted text-left capitalize !font-bold">
                      Your Order
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-7 ">
                        <div className={`tab-content   `}>
                          <div className="mb-5 ">
                            {allProducts?.length > 0 ? (
                              <>
                                <div className="card w-[98%]">
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-12 drop-shadow-lg">
                                        <div className="bd-breadcrumb d-flex align-items-center gap-3 mb-3">
                                          <span
                                            className="cursor-pointer hover:text-blue-600 overflow-hidden"
                                            onClick={() =>
                                              navigate("/products")
                                            }
                                          >
                                            Home
                                          </span>
                                          <span>Order</span>
                                        </div>
                                        <div className="mt-2 text-left">
                                          <p className="order-date">
                                            <span className="text-muted">
                                              Date :{" "}
                                            </span>{" "}
                                            <span className="text-dark">
                                              {new Date().toLocaleDateString(
                                                "en-US",
                                                {
                                                  year: "numeric",
                                                  month: "short",
                                                  day: "numeric",
                                                }
                                              )}
                                            </span>
                                          </p>

                                          <Divider />
                                          {allProducts?.length > 0 ? (
                                            <div>
                                              <div>
                                                {allProducts?.length &&
                                                  allProducts?.map(
                                                    (product, ind) => {
                                                      return (
                                                        <div key={ind}>
                                                          <div className="drop-shadow-lg">
                                                            <div className="grid grid-cols-3 hover:!shadow-lg align-items-center">
                                                              <div className="w-[75%] lg:w-[50%]">
                                                                <img
                                                                  src={
                                                                    product
                                                                      ?.product
                                                                      ?.img_1
                                                                  }
                                                                  alt="product-image"
                                                                  className="mb-0 mr-2 cursor-pointer "
                                                                  // width="150px"
                                                                />
                                                              </div>
                                                              <div className="min-w-[100%] max-w-[100%] md:min-w-[100%] md:max-w-[100%]">
                                                                <p
                                                                  className="prod-title mb-0 text-xs lg:!text-md md:!text-sm  cursor-pointer"
                                                                  style={{
                                                                    textOverflow:
                                                                      "ellipsis",
                                                                    whiteSpace:
                                                                      "nowrap",
                                                                    overflow:
                                                                      "hidden",
                                                                    width:
                                                                      "90%",
                                                                  }}
                                                                >
                                                                  {
                                                                    product
                                                                      ?.product
                                                                      ?.name
                                                                  }
                                                                </p>

                                                                <p className="prod-desc  mb-1 text-success  text-xs lg:!text-md md:!text-sm">
                                                                  In Stock
                                                                </p>
                                                                <div className=" ">
                                                                  <div
                                                                    id="counter"
                                                                    className=""
                                                                  >
                                                                    Qty:
                                                                    <span className="fs-18 m-0 text-gray-1200  text-start fw-bold !mr-2  !text-xs lg:!text-md md:!text-sm">
                                                                      {product?.qty ||
                                                                        1}
                                                                    </span>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                              <div
                                                                className="text-right"
                                                                // style={{ marginLeft: "1rem" }}
                                                              >
                                                                <span className="total  text-xs lg:!text-md md:!text-sm">
                                                                  ₹{" "}
                                                                  {
                                                                    product?.price
                                                                  }
                                                                </span>{" "}
                                                              </div>
                                                            </div>
                                                            <Divider />
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="text-center font-bold text-gray-700 ">
                                              <p>No products found in cart</p>
                                              <p
                                                className="nav-link text-green-900"
                                                onClick={() =>
                                                  navigate("/products")
                                                }
                                              >
                                                {" "}
                                                Click here to add items
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center font-bold text-gray-700 ">
                                <p>no products found in cart</p>
                                <p
                                  className="nav-link text-green-900 cursor-pointer"
                                  onClick={() => navigate("/products")}
                                >
                                  {" "}
                                  Click here to add items
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <hr className="mt-2" />
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
                              <h4 className="mb-3 !font-bold">
                                Billing Address
                              </h4>
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
                                    {orderData?.order?.address_1},{" "}
                                    {orderData?.order?.address_2?.length > 0
                                      ? `${orderData?.order?.address_2},  `
                                      : ""}
                                    {orderData?.order?.city},{" "}
                                    {orderData?.order?.state},{" "}
                                    {orderData?.order?.country},{" "}
                                    {orderData?.order?.zip}
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
                            <div className="max-h-[100px] md:max-h-[225px] overflow-y-auto">
                              <h4 className="mb-3 !font-bold">
                                Shipping Address
                              </h4>

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
                                {/* // ))} */}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <Divider className=" my-2 md:hidden" />
                      </div>

                      <div className="col-lg-5  col-12">
                        <Divider className="my-2 block md:hidden" />
                        {paymentStatus === "" &&
                          paymentVerification === false && (
                            <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5">
                              {/* Payment Mode */}
                              <h4 className="!font-bold">Payment Mode</h4>
                              <RadioGroup
                                // defaultValue={paymentType}
                                aria-labelledby="payment_methods"
                                name="payment_methods"
                                className="mb-3 "
                              >
                                <Accordion
                                  expanded={activeAccordion == "online"}
                                  onChange={() => {
                                    setActiveAccordion("online"),
                                      setPaymentType("online");
                                  }}
                                >
                                  <AccordionSummary
                                    // expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel4bh-content"
                                    id="panel4bh-header"
                                    className={`${
                                      paymentType == "online"
                                        ? "bg-gray-600 drop-shadow-lg"
                                        : ""
                                    }`}
                                  >
                                    <Typography
                                      sx={{ width: "100%", flexShrink: 0 }}
                                    >
                                      <div className="flex justify-around">
                                        <FormControlLabel
                                          className="!w-full text-sm"
                                          value="online"
                                          checked={
                                            paymentType == "online"
                                              ? true
                                              : false
                                          }
                                          control={<Radio size="sm" />}
                                          label="Online Secure Payment [Cards]"
                                        />
                                        <img
                                          src="/images/vma.webp"
                                          style={{
                                            objectFit: "contain",
                                            width: "25%",
                                          }}
                                        />
                                      </div>
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography>
                                      <ol className="text-xs">
                                        <li>- No delivery charges applied</li>
                                        <li>
                                          - Choose from our secure online
                                          payments
                                        </li>
                                      </ol>
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>
                                <Accordion
                                  expanded={activeAccordion == "cod"}
                                  onChange={() => {
                                    setActiveAccordion("cod"),
                                      setPaymentType("cod");
                                  }}
                                >
                                  <AccordionSummary
                                    // expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel4bh-content"
                                    id="panel4bh-header"
                                    className={`${
                                      paymentType == "cod"
                                        ? "bg-gray-600 drop-shadow-lg"
                                        : ""
                                    }`}
                                  >
                                    <Typography
                                      sx={{ width: "100%", flexShrink: 0 }}
                                    >
                                      <div className="flex justify-around">
                                        <FormControlLabel
                                          className="!w-full text-sm"
                                          value="cod"
                                          checked={
                                            paymentType == "cod" ? true : false
                                          }
                                          control={<Radio size="sm" />}
                                          label="Cash On Delivery"
                                        />
                                        <img
                                          src="/images/cash-on-delivery-tm.webp"
                                          width={"5%"}
                                          alt="cod"
                                        />
                                      </div>
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography>
                                      <ol className="text-xs">
                                        <li>- Order With Comfort</li>
                                        <li>
                                          - Pay when you receive the the order
                                        </li>
                                        <li className="text-xs">
                                          - Delivery charges applicable [150
                                          INR]
                                        </li>
                                      </ol>
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>
                              </RadioGroup>

                              {/* Payment Type if online */}
                              <h4 className="!font-bold">Payment Gateway</h4>
                              <RadioGroup
                                // defaultValue={paymentType}
                                aria-labelledby="payment_type"
                                name="payment_type"
                              >
                                {userData?.client?.payment_types?.map(
                                  (payment, ind) => (
                                    <Accordion
                                      key={ind}
                                      expanded={
                                        activePaymentMethodAccordion ==
                                        payment?.name
                                      }
                                      onChange={() => {
                                        // if payment type is online only
                                        // if(paymentType == "online"){
                                        setActivePaymentMethod(payment?.name);
                                        setActivePaymentMethodAccordion(
                                          payment?.name
                                        ),
                                          setActivePAymentType(payment?.name);
                                        // }
                                      }}
                                    >
                                      <AccordionSummary
                                        // expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel4bh-content"
                                        id="panel4bh-header"
                                        className={`${
                                          activePaymentMethodAccordion ==
                                          payment?.name
                                            ? "bg-gray-600 drop-shadow-lg"
                                            : ""
                                        }`}
                                      >
                                        <Typography
                                          sx={{ width: "100%", flexShrink: 0 }}
                                        >
                                          <div
                                            className={`flex "justify-around
                              `}
                                          >
                                            <FormControlLabel
                                              className="!w-full text-sm"
                                              value={payment?.name}
                                              checked={
                                                activePaymentMethodAccordion ==
                                                payment?.name
                                                  ? true
                                                  : false
                                              }
                                              control={<Radio size="sm" />}
                                              label={payment?.name}
                                            />

                                            <img
                                              src={
                                                payment?.name == "Stripe"
                                                  ? `/images/stripe.webp`
                                                  : payment?.image
                                              }
                                              className="ml-2"
                                              width={"12%"}
                                              alt={`${paymentType?.name}`}
                                            />
                                          </div>
                                        </Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        {activePaymentMethodAccordion ==
                                        "Stripe" ? (
                                          <>
                                            <Divider className="mt-2" />
                                            {payment?.name == "Stripe" && (
                                              <Form onSubmit={handleSubmit}>
                                                <Form.Group>
                                                  <label className="font-bold !text-sm mt-3 m-0">
                                                    Card Number
                                                    <sup className="text-red-600 !font-bold">
                                                      *
                                                    </sup>
                                                  </label>
                                                  <div className="relative m-0">
                                                    <input
                                                      maxLength={19}
                                                      type="text"
                                                      className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                                      placeholder="Enter card number"
                                                      value={cardNumber}
                                                      onChange={
                                                        handleCardNumberChange
                                                      }
                                                      required
                                                      // onInvalid={
                                                      //   !validateCardNumber(cardNumber)
                                                      // }
                                                    />
                                                    <div className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400">
                                                      <FaCreditCard
                                                        size={15}
                                                        color="gray"
                                                      />
                                                    </div>
                                                  </div>
                                                  {cardNumberError ? (
                                                    <p className="nk-message-error !text-xs !m-0 !p-0 !text-left">
                                                      {cardNumberError}
                                                    </p>
                                                  ) : (
                                                    ""
                                                  )}
                                                </Form.Group>
                                                <Form.Group>
                                                  <label className="font-bold !text-sm mt-3 m-0 ">
                                                    Expiry date
                                                    <sup className="text-red-600 !font-bold">
                                                      *
                                                    </sup>
                                                  </label>
                                                  <div className="relative">
                                                    <input
                                                      type="text"
                                                      className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                                      placeholder="MM/YY"
                                                      value={expiry}
                                                      onChange={
                                                        handleExpiryChange
                                                      }
                                                      required
                                                      maxLength={5}
                                                      // onInvalid={!validateExpiry(expiry)}
                                                    />
                                                    <div className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400">
                                                      <FaCalendarAlt
                                                        size={15}
                                                        color="gray"
                                                      />
                                                    </div>
                                                  </div>
                                                  {expiryError ? (
                                                    <p className="nk-message-error !text-left !text-xs !m-0 !p-0">
                                                      {expiryError}
                                                    </p>
                                                  ) : (
                                                    ""
                                                  )}
                                                </Form.Group>
                                                <Form.Group>
                                                  <label className="font-bold !text-sm mt-3 m-0">
                                                    CVV
                                                    <sup className="text-red-600 !font-bold">
                                                      *
                                                    </sup>
                                                  </label>
                                                  <div className="relative">
                                                    <input
                                                      type="password"
                                                      className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                                      placeholder="Enter CVV"
                                                      value={cvv}
                                                      onChange={handleCvvChange}
                                                      required
                                                      maxLength={3}
                                                      // onInvalid={!validateCVV(cvv)}
                                                    />
                                                    <div className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400">
                                                      <FaLock
                                                        size={15}
                                                        color="gray"
                                                      />
                                                    </div>
                                                  </div>
                                                  {cvvError ? (
                                                    <p className="nk-message-error !text-xs !text-left !m-0 !p-0">
                                                      {cvvError}
                                                    </p>
                                                  ) : (
                                                    ""
                                                  )}
                                                </Form.Group>
                                                <Form.Group>
                                                  <label className="font-bold !text-sm mt-3 m-0">
                                                    Name on the card
                                                    <sup className="text-red-600 !font-bold">
                                                      *
                                                    </sup>
                                                  </label>
                                                  <div className="relative">
                                                    <input
                                                      className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                                      type="text"
                                                      placeholder="Enter account holder name"
                                                      value={nameOnCard}
                                                      onChange={handleNameChage}
                                                      // isInvalid={nameOnCard && !validateName(name)}
                                                    />
                                                    <div
                                                      className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400"
                                                      style={{
                                                        background: "#f3f3f3",
                                                        right: "7px",
                                                        paddingTop: "2px",
                                                        paddingRight: "2px",
                                                        top: "15px",
                                                      }}
                                                    >
                                                      <MdOutlineAccountCircle
                                                        size={20}
                                                        color="gray"
                                                      />
                                                    </div>
                                                  </div>
                                                  {nameErr ? (
                                                    <p className="nk-message-error !text-xs !text-left !m-0 !p-0">
                                                      {nameErr}
                                                    </p>
                                                  ) : (
                                                    ""
                                                  )}
                                                </Form.Group>
                                              </Form>
                                            )}
                                          </>
                                        ) : (
                                          <Typography className="!text-xs">
                                            After clicking “Pay now”, you will
                                            be redirected to Razorpay Secure
                                            (UPI, Cards, Wallets, NetBanking) to
                                            complete your purchase securely.
                                          </Typography>
                                        )}
                                      </AccordionDetails>
                                    </Accordion>
                                  )
                                )}
                              </RadioGroup>

                              <hr className="mt-3" />
                              <div className="nk-section-blog-details">
                                <h4 className="mb-3 !font-bold">
                                  Order Summary
                                </h4>
                                <div className="pt-0 mb-3"></div>
                                <ul className="d-flex flex-column gap-2 pb-5">
                                  <li className="d-flex align-items-center gap-5 text-gray-1200">
                                    <p className="m-0 fs-12 fw-semibold text-uppercase w-[30%]">
                                      Sub Total:
                                    </p>
                                    <p className="m-0 fs-14 text-gray-1200 w-[70%]">
                                      ₹{" "}
                                      {parseFloat(
                                        orderData?.order?.sub_total
                                      )?.toFixed(2)}
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center gap-5 text-gray-1200">
                                    <p className="m-0 fs-12 fw-semibold text-uppercase w-[30%]">
                                      Tax:
                                    </p>
                                    <p className="m-0 fs-14 text-gray-1200 w-[70%]">
                                      ₹{" "}
                                      {parseFloat(
                                        orderData?.order?.total_tax
                                      )?.toFixed(2)}
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center gap-5 text-gray-1200">
                                    <p className="m-0 fs-12 fw-semibold text-uppercase w-[30%]">
                                      Discount:
                                    </p>
                                    <p className="m-0 fs-14 text-danger w-[70%]">
                                      {orderData?.order?.discount_type ===
                                      "percentage"
                                        ? `₹ ${parseFloat(
                                            orderData?.order?.discount_amount
                                          )?.toFixed(2)} ( ${
                                            orderData?.order?.discount
                                          }%)`
                                        : "₹" +
                                          parseFloat(
                                            orderData?.order?.discount_amount
                                          )?.toFixed(2)}
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center gap-5 text-gray-1200">
                                    <p className="m-0 fs-16 fw-semibold text-uppercase w-[30%]">
                                      Total:
                                    </p>
                                    <p className="m-0 fs-16 fw-semibold text-dark w-[70%]">
                                      ₹{" "}
                                      {parseFloat(
                                        orderData?.order?.total
                                      )?.toFixed(2)}
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center gap-5 text-gray-1200">
                                    <p className="m-0 fs-12 fw-semibold text-uppercase w-[30%]">
                                      {paymentType == "online"
                                        ? "Delivery Charges:"
                                        : "Advance:"}
                                    </p>
                                    <p className="m-0 fs-16 fw-semibold text-dark w-[70%]">
                                      {paymentType == "online"
                                        ? "₹ 0.00"
                                        : parseFloat(orderData?.order?.total) <
                                          500
                                        ? " 150.00 INR"
                                        : " 450.00 INR"}
                                    </p>
                                  </li>
                                </ul>
                                <div className="!flex !justify-start items-center !text-sm">
                                  <FaLock size={10} className="mb-2 mr-1" />
                                  <span
                                    className="w-fit text-center mb-2"
                                    style={{ fontSize: "12px" }}
                                  >
                                    The payment is secure and data are not saved
                                    for your privacy.
                                  </span>
                                </div>
                                {userData?.client?.payment_types?.length >
                                  0 && (
                                  <button
                                    disabled={
                                      allProducts?.length > 0 ? false : true
                                    }
                                    className="btn btn-primary w-100 !normal-case	"
                                    type="submit"
                                    onClick={() => {
                                      if (activePaymentMethod === "Razor_Pay") {
                                        createOrder(
                                          orderData?.order_id,
                                          orderData?.order?.total,
                                          orderData?.client_id
                                        );
                                      } else if (
                                        activePaymentMethod === "Stripe"
                                      ) {
                                        if (
                                          cardNumberError != "" ||
                                          cvvError != "" ||
                                          nameErr != "" ||
                                          expiryError != ""
                                        ) {
                                          setActivePaymentMethodAccordion(
                                            "Stripe"
                                          );
                                        } else {
                                          createOrderWithStripe(
                                            orderData?.order_id,
                                            orderData?.order?.total,
                                            orderData?.client_id,
                                            orderData?.city,
                                            orderData?.state,
                                            orderData?.country,
                                            orderData?.pincode,
                                            orderData?.address_1
                                          );
                                        }
                                      }
                                    }}
                                  >
                                    Proceed to pay{" "}
                                    {paymentType == "online"
                                      ? " " +
                                        parseFloat(
                                          orderData?.order?.total
                                        )?.toFixed(2) +
                                        " INR"
                                      : parseFloat(orderData?.order?.total) <
                                        500
                                      ? "150.00 INR"
                                      : "450.00 INR"}
                                  </button>
                                )}
                                {userData?.client?.payment_types?.length ==
                                  0 && (
                                  <button
                                    disabled={
                                      allProducts?.length > 0 ? false : true
                                    }
                                    className="btn btn-primary w-100"
                                    type="submit"
                                  >
                                    Online Payment Not Available
                                  </button>
                                )}
                                {apiError?.length > 0 &&
                                  apiError?.map((err, ind) => {
                                    return (
                                      <Alert
                                        key={ind}
                                        variant="outlined"
                                        severity="error"
                                        className="!mt-2"
                                      >
                                        <p
                                          key={ind}
                                          className="nk-message-error text-xs"
                                        >
                                          {err}
                                        </p>
                                      </Alert>
                                    );
                                  })}
                                <Divider className="mt-2" />
                                <div className="flex  w-full mt-3">
                                  <img
                                    className="flex justify-start"
                                    src="/images/paymentMethods.webp"
                                    alt="payment methods"
                                    style={{ width: "45%" }}
                                  ></img>
                                  <div className="w-full flex justify-end">
                                    <img
                                      className=" "
                                      src="/images/stripe.webp"
                                      width={"22%"}
                                    ></img>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        {paymentStatus !== "" && (
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
                                      paymentStatus === "loading"
                                        ? ""
                                        : "!text-white"
                                    }`}
                                  >
                                    {paymentStatus === "success"
                                      ? "Payment Successful"
                                      : "Payment Failure"}
                                  </div>

                                  <div
                                    className={`success-description ${
                                      paymentStatus === "loading"
                                        ? ""
                                        : "!text-white"
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
                                      {/* <small
                                        className={`cursor-pointer hover:text-green-600  font-bold  ${
                                          paymentStatus === "loading"
                                            ? ""
                                            : "!text-white"
                                        }`}
                                        onClick={() =>
                                          navigate(`/order-tracking/${orderID}`)
                                        }
                                      >
                                        Do not Refresh the page, we will
                                        redirect to your orders in {time}
                                      </small> */}
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

                        {paymentVerification === true && (
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
      </div>
      <Footer />
    </>
  );
}
