/* eslint-disable no-unsafe-optional-chaining */
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
import { Alert, Divider } from "@mui/material";
import CryptoJS from "crypto-js";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loaderState = useSelector((state) => state?.loader?.value);
  const userData = useSelector((state) => state?.user?.value);
  const cartProducts = useSelector((state) => state?.cart?.value);
  const userLang = useSelector((state) => state?.lang?.value);

  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isFailure, setIsFailure] = useState(false);
  const [allProducts, setAllProducts] = useState(cartProducts);
  const [fomrType, setFormType] = useState("add");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCVV] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [cardNumberError, setCardNumberError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvvError, setCVVError] = useState("");
  const [nameErr, setNameErr] = useState("");
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
  const [activePaymentMethod, setActivePaymentMethod] = useState("Razor_Pay");
  // State variable to track quantities for each product

  const [orderData, setOrderData] = useState({});
  const [paymentVerification, setPaymentVerification] = useState(false);
  const [clientToken, setClientToken] = useState("");
  const [time, setTime] = useState(5);
  const [apiError, setApiError] = useState([])

  // State variable to store prices for each product
  const [subTotal, setSubTotal] = useState(0);

  const { id } = useParams();
  const {encryptedrderId} = useParams();
  const decryptedId = CryptoJS.AES.decrypt(
    id.replace(/_/g, "/").replace(/-/g, "+"),
    "trading_materials_order"
  ).toString(CryptoJS.enc.Utf8);
  console.log(decryptedId);

  console.log(cartProducts, "gggggggg");


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

  const fetchOrderdetails = async () => {
    try {
      console.log(localStorage.getItem("client_token"));
      dispatch(showLoader());
      const response = await axios.get(
        `https://admin.tradingmaterials.com/api/lead/product/checkout/view-order?order_id=${decryptedId}`,
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        setAllProducts(response?.data?.data?.items);
        setSubTotal(response?.data?.data?.sub_total);
        setOrderData(response?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    // setActiveShippingAddress(userData?.client?.address[0]);
    // setActivebillingAddress(userData?.client?.primary_address[0]);
    // getUserInfo();
    fetchOrderdetails();
  }, []);

  // Set initial quantity for all products to 1 in the useEffect hook
  // useEffect(() => {
  //   if (allProducts?.length) {
  //     console.log(allProducts);
  //     const initialQuantities = {};
  //     allProducts.forEach((product) => {
  //       console.log(product?.total, "ttttttt");
  //       initialQuantities[product.product_id] = product?.qty;
  //     });
  //     setQuantities(initialQuantities);
  //   }
  // }, [allProducts, userData, products]);

  // Calculate the total price for each product based on the quantity
  // useEffect(() => {
  //   dispatch(showLoader());
  //   const updatedPrices = {};

  //   allProducts?.forEach((product) => {
  //     const quantity = quantities[product.product_id] || 1;
  //     const price = parseInt(product?.price);
  //     if (price) {
  //       const totalPrice = quantity * price;
  //       updatedPrices[product.product_id] = totalPrice.toFixed(2);
  //     }
  //   });
  //   setPrices(updatedPrices);
  //   // Calculate the subTotal by summing up the individual product prices
  //   const totalPriceArray = Object.values(updatedPrices).map(Number);
  //   const updatedSubTotal = totalPriceArray.reduce(
  //     (acc, price) => acc + price,
  //     0
  //   );
  //   setSubTotal(updatedSubTotal);

  //   dispatch(hideLoader());
  // }, [allProducts, quantities]);

  const handleCvvChange = (e) => {
    const addCvv = e.target.value;
    setCVV(addCvv);
    console.log(addCvv.match(/^[0-9]+$/), addCvv);
    if (addCvv?.length > 3 || addCvv?.length < 3) {
      setCVVError("CVV required");
    } else if (addCvv.match(/^[0-9]+$/) === null) {
      setCVVError("Invalid CVV");
    } else {
      setCVVError("");
    }
    if(apiError?.length >0){
      setApiError([])
    }
  };

  const handleNameChage = (e) => {
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
    return value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
  };

  const validateCardNumber = (value) => {
    // Implement your card number validation logic here
    // For example, you can use a library like 'card-validator'
    // Return true if the card number is valid, otherwise false
    return value?.length >= 12 && value?.length <= 19;
  };

  const validateCVV = (value) => {
    // Implement your CVV validation logic here
    // For example, you can check if the CVV is a 3 or 4 digit number
    // Return true if the CVV is valid, otherwise false
    return value?.length === 3 || value?.length === 4;
  };

  const handleCardNumberChange = (event) => {
    const formattedValue = formatCardNumber(event.target.value);

    if (validateCardNumber(formattedValue)) {
      setCardNumberError("");
    } else {
      setCardNumberError("Please enter a valid card number.");
    }
    setCardNumber(formattedValue);
    if(apiError?.length >0){
      setApiError([])
    }
  };

  const handleExpiryChange = (event) => {
    const formattedValue = formatExpiry(event.target.value);
    if (validateExpiry(formattedValue)) {
      setExpiryError("");
    } else {
      setExpiryError("Expiry field required");
    }
    setExpiry(formattedValue);
    if(apiError?.length >0){
      setApiError([])
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
          setNameErr("Invalid name");
        }
        if (isCardNumberValid === false) {
          setCardNumberError("Card number is invalid");
        }
        if (isExpiryValid === null) {
          setExpiryError("Invalid card expiry");
        }
        if (isCVVValid === false) {
          setCVVError("Invalid CVV");
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
    // setRid(res.razorpay_order_id);
    sessionStorage.setItem("order_id", res.razorpay_order_id);
    try {
      setPaymentVerification(true);
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/lead/product/checkout/verify-payment",
        {
          order_id: res.razorpay_order_id,
          payment_id: res.razorpay_payment_id,
          signature: res.razorpay_signature,
          payment_type: "Razor_Pay",
        },
        {
          headers: {
            "access-token": token,
          },
        }
      );
      if (response.data.status) {
        console.log(response?.data?.token, "actoken");
        setClientToken(response?.data?.token);
        localStorage.setItem("tmToken", response?.data?.token);
        setPaymentStatus("success");
        localStorage.setItem("client_type", "client");
        // timerRedirect(response?.data?.token)

        // sendDetails();
      }
    } catch (error) {
      console.log(error);
      setPaymentStatus("failed");
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
      image: "https://stage.tradingmaterials.com/images/tm-logo-1.png",
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
    setApiError([])
    try {
      dispatch(showLoader());
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/lead/product/checkout/create-order",
        {
          payment_type: "Razor_Pay",
          client_id: client_id,
          order_id: id,
          total: total,
        },
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
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
        setApiError([err?.response?.data?.message]);
      }
    } finally {
      dispatch(hideLoader());
    }
  }

  //create order for stripe 
  async function createOrderWithStripe(id, total, client_id,city, state,country,zipcode,address) {
    handleSubmit()
    if(nameErr === "" && expiryError === "" && cvvError==="" && cardNumberError ==="" && nameOnCard !== "" && expiry !== "" && cvv !== "" && expiry!=="" && apiError !== ""){
    try {
      console.log(orderData?.order,"orderData")
      dispatch(showLoader());
      const paymentData = {
        payment_type: "Stripe",
          client_id: client_id,
          order_id: id,
          total: total,
          amount: total,
          city: orderData?.order?.city,
          state: orderData?.order?.state,
          address_1:  orderData?.order?.address_1,
          zipcode: orderData?.order?.zip,
          country: orderData?.order?.country,
          card_number: cardNumber,
          exp_month_year: expiry,
          cvc: cvv,
          name_on_card: nameOnCard,
          currency: "INR",
          call_back_url: "https://stage.tradingmaterials.com/payment-status/"
      }
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/lead/product/checkout/create-order",
        paymentData,
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );

      if (response?.data?.status) {
        console.log(response, "response")

        // console.log(response?.data);
        localStorage.setItem("id", encryptedrderId)
        window.location.replace(response?.data?.redirect_url);
        // handleStripePayment(response?.data?.data);
      }
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.errors) {
        setApiError([...Object?.values(err?.response?.data?.errors)]);
      } else {
        setApiError([err?.response?.data?.message]);
        dispatch(hideLoader());
      }
    }
  }
  }
  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
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
      <div className="nk-pages text-left">
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
              <div className="col-lg-8 pe-lg-0">
                <div className="nk-entry pe-lg-5 py-lg-5 max-h-[50%] overflow-y-auto">
                  <div className="mb-5">
                    {allProducts?.length > 0 ? (
                      <table className="table">
                        <tbody>
                          {allProducts?.length &&
                            allProducts?.map((product, ind) => {
                              return (
                                <tr key={ind}>
                                  <td className="w-50">
                                    <div className="d-flex align-items-start">
                                      <img
                                        src={product?.product?.img_1}
                                        alt="product-image"
                                        className="mb-0 mr-2"
                                        width="150px"
                                      />
                                      <div className="w-75">
                                        <p
                                          className="prod-title mb-0"
                                          style={{
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            width: "90%",
                                          }}
                                        >
                                          {product?.product?.name}
                                        </p>

                                        <p className="prod-desc mb-1 text-success">
                                          In Stock
                                        </p>
                                        <div className=" ">
                                          <div id="counter" className="">
                                            Qty:
                                            <span className="fs-18 m-0 text-gray-1200 !text-xs !font-bold !ml-1 !mr-2r">
                                              {product?.qty || 1}
                                            </span>
                                          </div>
                                          <div
                                            className="!mt-3"
                                            // style={{ marginLeft: "1rem" }}
                                          >
                                            <span className="total text-white font-semibold">
                                              ₹ {product?.price}
                                            </span>{" "}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="d-flex align-items-center w-25">
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
                          onClick={() => navigate("/")}
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
                      <h4 className="mb-3 !font-bold">Billing Address</h4>
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
                    <div className="max-h-[100px] md:max-h-[225px] overflow-y-auto">
                      <h4 className="mb-3 !font-bold">Shipping Address</h4>

                      <ul className="d-flex flex-column gap-2 pb-0">
                        <div className="mb-1">
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
                        </div>
                        {/* // ))} */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ps-lg-0 mt-5 md:mt-0">
                {paymentStatus === "" && paymentVerification === false && (
                  <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5">
                    <h4 className="!font-bold">Payment Method</h4>

                    <div className="flex flex-wrap items-center">
                      {userData?.client?.payment_types?.map(
                        (paymentType,ind) => (
                          <div key={ind} className="flex">
                            <input
                              type="checkbox"
                              checked={
                                activePaymentMethod === paymentType?.name
                              }
                              onChange={() =>
                                handlePaymentMethod(`${paymentType?.name}`)
                              }
                            />

                            {/* <label className="ml-2"> {paymentType?.name}</label> */}
                            {paymentType?.name === "Razor_Pay" && (
                              <img
                                src={`https://admin.tradingmaterials.com/assets/images/payment-images/razorpay.png`}
                                className="ml-2 mr-2 "
                                alt={`${paymentType?.name}`}
                              />
                            )}
                            {paymentType?.name !== "Razor_Pay" && (
                              <img
                                src={`https://admin.tradingmaterials.com/assets/images/payment-images/stripe.png`}
                                className="ml-2"
                                alt={`${paymentType?.name}`}
                              />
                            )}
                          </div>
                        )
                      )}
                    </div>

                    {activePaymentMethod === "Stripe" && (
                      <>
                        <Divider className="mt-2" />
                        <Form onSubmit={handleSubmit}>
                          <Form.Group>
                            <label className="font-bold !text-sm mt-3 m-0">
                              Card Number
                            </label>
                            <div className="relative m-0">
                              <input
                                maxLength={19}
                                type="text"
                                className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                placeholder="Enter card number"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                required
                                // onInvalid={
                                //   !validateCardNumber(cardNumber)
                                // }
                              />
                              <div className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400">
                                <FaCreditCard size={15} color="gray" />
                              </div>
                            </div>
                            {cardNumberError ? (
                              <p className="text-red-600 font-bold !text-sm !m-0 !p-0 !text-left">
                                {cardNumberError}
                              </p>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                          <Form.Group>
                            <label className="font-bold !text-sm mt-3 m-0 ">
                              Expiry date
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={handleExpiryChange}
                                required
                                maxLength={5}
                                // onInvalid={!validateExpiry(expiry)}
                              />
                              <div className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400">
                                <FaCalendarAlt size={15} color="gray" />
                              </div>
                            </div>
                            {expiryError ? (
                              <p className="text-red-600 font-bold !text-left !text-sm !m-0 !p-0">
                                {expiryError}
                              </p>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                          <Form.Group>
                            <label className="font-bold !text-sm mt-3 m-0">
                              CVV
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
                                <FaLock size={15} color="gray" />
                              </div>
                            </div>
                            {cvvError ? (
                              <p className="text-red-600 font-bold !text-sm !text-left !m-0 !p-0">
                                {cvvError}
                              </p>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                          <Form.Group>
                            <label className="font-bold !text-sm mt-3 m-0">
                              Name on the card
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
                              <div className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400">
                                <MdOutlineAccountCircle
                                  size={20}
                                  color="gray"
                                />
                              </div>
                            </div>
                            {nameErr ? (
                              <p className="text-red-600 font-bold !text-sm !text-left !m-0 !p-0">
                                {nameErr}
                              </p>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                        </Form>
                      </>
                    )}
                    <hr className="mt-3" />
                    <div className="nk-section-blog-details">
                      <h4 className="mb-3 !font-bold">Order Summary</h4>
                      <div className="pt-0 mb-3">
                        {/* <div className="d-flex w-75">
                        {clientType === "client" && <input
                          type="text"
                          className="form-control rounded-0 py-0 px-2"
                          placeholder="Promocode"
                          name=""
                          value={promocode}
                          onChange={handlePromoCodeChange}
                        /> }
                        <button
                          type="button"
                          className="btn btn-success rounded-0 px-3 py-1 fs-14 bg-[rgba(34,197,94,1)]"
                          name="button"
                          onClick={()=>applyPromoCode}
                        >
                          Apply
                        </button>
                      </div> */}
                      </div>
                      <ul className="d-flex flex-column gap-2 pb-5">
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Sub Total:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            ₹ {orderData?.order?.sub_total}
                          </p>
                        </li>
                        {/* <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                          Shipping:
                        </p>
                        <p className="m-0 fs-14 text-gray-1200 w-75">
                          {allProducts?.length > 0 ? "₹ 10.00" : "₹ 0.00"}
                        </p>
                      </li> */}
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Tax:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            {orderData?.order?.total_tax}
                          </p>
                        </li>
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Discount:
                          </p>
                          <p className="m-0 fs-14 text-danger w-75">
                            {orderData?.order?.discount_type === "percentage"
                              ?`₹ ${orderData?.order?.discount_amount} ( ${orderData?.order?.discount}%)`
                              : "₹" + orderData?.order?.discount_amount}
                          </p>
                        </li>
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-16 fw-semibold text-uppercase w-25">
                            Total:
                          </p>
                          <p className="m-0 fs-16 fw-semibold text-dark w-75">
                            ₹ {orderData?.order?.total}
                          </p>
                        </li>
                      </ul>
                      <div className="!flex !justify-start items-center !text-sm">
                        <FaLock size={10} className="mb-2 mr-1" />
                        <span
                          className="w-fit text-center mb-2"
                          style={{ fontSize: "12px" }}
                        >
                          The payment is secure and data are not saved for your
                          privacy.
                        </span>
                      </div>
                      <button
                        disabled={allProducts?.length > 0 ? false : true}
                        className="btn btn-primary w-100"
                        type="submit"
                        onClick={() =>
                          {
                            if(activePaymentMethod === "Razor_Pay"){
                              createOrder(
                                orderData?.order_id,
                                orderData?.order?.total,
                                orderData?.client_id
                              )
                            }else if(activePaymentMethod === "Stripe"){
                              createOrderWithStripe(
                                orderData?.order_id,
                                orderData?.order?.total,
                                orderData?.client_id,
                                orderData?.city,
                                orderData?.state,
                                orderData?.country,
                                orderData?.pincode,
                                orderData?.address_1
                              )
                            }
                          }
                        }
                      >
                        Proceed to Pay
                      </button>
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
                                    className="text-red-600 font-semibold"
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
                          src="/images/paymentMethods.jpg"
                          alt="payment methods"
                          style={{ width: "45%" }}
                        ></img>
                        <div className="w-full flex justify-end">
                          <img
                            className=" "
                            src="/images/stripe.png"
                            width={45}
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

                      <div className="paper drop-shadow-lg">
                        <div className="main-contents">
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
                            {paymentStatus === "failure" && (
                              <ClearIcon
                                fontSize="large"
                                className="!font-bold"
                              />
                            )}
                          </div>
                          <div className="success-title !text-xl">
                            {paymentStatus === "success"
                              ? "Payment Successful"
                              : "Payment Failure"}
                          </div>

                          <div className="success-description">
                            {paymentStatus === "success"
                              ? `Thank you for your payment.`
                              : `There was some internal issue with the payment, please try again after some time`}
                          </div>
                          <div className="order-details"></div>
                          {paymentStatus === "success" ? (
                            <>
                              <div className="order-footer text-gray-700">
                                Thankyou
                                {/* <ConfettiExplosion
                                  zIndex={999}
                                  force={0.8}
                                  duration={3000}
                                  particleCount={250}
                                  width={1000}
                                  defaultValue={4}
                                /> */}
                              </div>
                              <small
                                className="font-bold "
                                
                              >
                                Do not Refresh the page, we will redirect to
                                your orders in {time}
                              </small>
                            </>
                          ) : (
                            <div className="order-footer">
                              <Button
                                variant="contained"
                                onClick={() => navigate("/")}
                                type="button"
                                className="!bg-[#009688] !border-[#009688] text-white w-[50%] p-2 mr-1 !rounded-none"
                              >
                                Retry
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="jagged-edge"></div>
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
                  <a
                    href={`${userLang}/contact`}
                    className="btn btn-white fw-semiBold"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
