import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import {
  hideLoader,
  showLoader,
} from "../../../../features/loader/loaderSlice";
import { fetchAllProducts } from "../../../../features/products/productsSlice";
import axios from "axios";
import ShippingAddressModal from "../../modals/address";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { updateUsers } from "../../../../features/users/userSlice";
import { updateCart } from "../../../../features/cartItems/cartSlice";
import { updateNotifications } from "../../../../features/notifications/notificationSlice";
import { updateCartCount } from "../../../../features/cartWish/focusedCount";
import { Form } from "formik";
import { FaCreditCard, FaCalendarAlt, FaLock, FaClock } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state?.products?.value);
  const loaderState = useSelector((state) => state?.loader?.value);
  const userData = useSelector((state) => state?.user?.value);
  const cartProducts = useSelector((state) => state?.cart?.value);
  const userLang = useSelector((state) => state?.lang?.value);

  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allProducts, setAllProducts] = useState(cartProducts);
  const [fomrType, setFormType] = useState("add");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCVV] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

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
    const [addressUpdateType, setAddressUpdateType] = useState("")

  // State variable to track quantities for each product
  const [quantities, setQuantities] = useState({});

  // State variable to store prices for each product
  const [prices, setPrices] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  console.log(cartProducts, "gggggggg");

  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        "https://admin.tradingmaterials.com/api/lead/get-user-info",
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        console.log(response?.data);
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        setAllProducts(response?.data?.data?.client?.cart);
      } else {
        console.log(response?.data);
        dispatch(
          updateNotifications({
            type: "warning",
            message: isLoggedIn
              ? response?.data?.message
              : "PLease Login to continue",
          })
        );
        // navigate("/login")
      }
    } catch (err) {
      console.log(err);
      dispatch(
        updateNotifications({
          type: "error",
          message: err?.response?.data?.message,
        })
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    setActiveShippingAddress(userData?.client?.address[0]);
    setActivebillingAddress(userData?.client?.primary_address[0]);
    getUserInfo();
  }, []);

  // Set initial quantity for all products to 1 in the useEffect hook
  useEffect(() => {
    if (allProducts?.length) {
      console.log(allProducts);
      const initialQuantities = {};
      allProducts.forEach((product) => {
        console.log(product?.total, "ttttttt");
        initialQuantities[product.product_id] = product?.qty;
      });
      setQuantities(initialQuantities);
    }
  }, [allProducts, userData, products]);

  // Calculate the total price for each product based on the quantity
  useEffect(() => {
    dispatch(showLoader());
    const updatedPrices = {};

    allProducts?.forEach((product) => {
      const quantity = quantities[product.product_id] || 1;
      const price = parseInt(product?.price);
      if (price) {
        const totalPrice = quantity * price;
        updatedPrices[product.product_id] = totalPrice.toFixed(2);
      }
    });
    setPrices(updatedPrices);
    // Calculate the subTotal by summing up the individual product prices
    const totalPriceArray = Object.values(updatedPrices).map(Number);
    const updatedSubTotal = totalPriceArray.reduce(
      (acc, price) => acc + price,
      0
    );
    setSubTotal(updatedSubTotal);

    dispatch(hideLoader());
  }, [allProducts, quantities]);

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
        setNameErr("invalid name");
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
    return value?.length >= 18 && value?.length <= 19;
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
  };

  const handleExpiryChange = (event) => {
    const formattedValue = formatExpiry(event.target.value);
    if (validateExpiry(formattedValue)) {
      setExpiryError("");
    } else {
      setExpiryError("Expiry field required");
    }
    setExpiry(formattedValue);
  };

  const validateName = (value) => {
    console.log(value.match(/^[a-zA-Z ]+$/), value);

    return value.match(/^[a-zA-Z ]+$/);
  };

  const handleShippingAddressChange = (id) => {
    setActiveShippingAddress(userData?.client?.address[id]);
    setActiveShippingaddressChecked(id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
          setNameErr("invalid name");
        }
        if (isCardNumberValid === false) {
          setCardNumberError("Card number is invalid");
        }
        if (isExpiryValid === null) {
          setExpiryError("invalid card expiry");
        }
        if (isCVVValid === false) {
          setCVVError("Invalid CVV");
        }
        // setIsFailure(true)
      }
    } else {
      if (nameOnCard === "") {
        setNameErr("name is required");
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

  return (
    <>
      {loaderState && (
        <div className="preloader !bg-[rgba(0,0,0,0.5)]">
          <div className="loader"></div>
        </div>
      )}
      {addressUpdateType==="shipping" && <ShippingAddressModal
        show={showModal}
        onHide={() => setShowModal(false)}
        type={fomrType}
        data={
          fomrType === "add"
            ? []
            : activeShippingAddress === undefined
            ? userData?.client?.address[activeShippingAddressChecked]
            : activeShippingAddress
        }
        // handleFormSubmit={handleFormSubmit}
      />}

{addressUpdateType==="billing" && <ShippingAddressModal
        show={showModal}
        onHide={() => setShowModal(false)}
        type={fomrType}
        data={
          fomrType === "add"
            ? []
            : activeBillingAddress === undefined
            ? userData?.client?.address[activeBillingAddfreeChecked]
            : activeBillingAddress
        }
        // handleFormSubmit={handleFormSubmit}
      />}

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
          <div className="nk-banner-wrap pt-120 pt-lg-180 pb-300">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-xxl-5 text-left">
                  <div>
                    <a
                      onClick={() => navigate("/cart")}
                      className="btn-link mb-2 !inline-flex !items-center !text-large !font-semibold"
                    >
                      <em className="icon ni ni-arrow-left  !inline-flex !items-center !text-large !font-semibold"></em>
                      <span>Back to Cart</span>
                    </a>
                    <h1 className="mb-3 font-bold !text-4xl">Order Summary</h1>
                    {/* <!-- <ul className="d-flex align-items-center gap-5 mb-5">
                                        <li>
                                            <p className="fs-14 text-gray-1200 fw-semibold text-uppercase"><em className="icon ni ni-clock-fill"></em><span className="ms-1">Full Time</span></p>
                                        </li>
                                        <li>
                                            <p className="fs-14 text-gray-1200 fw-semibold text-uppercase"><em className="icon ni ni-map-pin-fill"></em><span className="ms-1">San Francisco</span></p>
                                        </li>
                                    </ul>
                                    <a href="#" className="btn btn-primary"> Apply Now </a> --> */}
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
                                <tr>
                                  <td className="w-50">
                                    <div className="d-flex align-items-start">
                                      <img
                                        src={product?.product?.img_1}
                                        alt="product-image"
                                        className="mb-0 mr-2"
                                        width="150px"
                                      />
                                      <div className="w-75">
                                        <p className="prod-title mb-0">
                                          {product?.product?.name}
                                        </p>
                                        <p
                                          className="prod-desc mb-0"
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              product?.product?.description,
                                          }}
                                        />
                                        <p className="prod-desc mb-1 text-success">
                                          In Stock
                                        </p>
                                        <div className=" ">
                                          <div id="counter" className="">
                                            Qty:
                                            <span id="fs-18 m-0 text-gray-1200 text-start !font-bold !mr-2r">
                                              {quantities[product.product_id] ||
                                                1}
                                            </span>
                                          </div>
                                          <div
                                            className="!mt-3"
                                            // style={{ marginLeft: "1rem" }}
                                          >
                                            <span className="total text-black font-semibold">
                                              ₹ {prices[product?.product_id]}
                                            </span>{" "}
                                          </div>
                                        </div>

                                        {/* <div
                                          className="d-flex align-items-center "
                                          style={{ marginTop: "2rem" }}
                                        >
                                          <div
                                            id="counter"
                                            className="nk-counter"
                                          >
                                            <span id="count">
                                              {quantities[product.product_id] ||
                                                1}
                                            </span>
                                          </div>
                                          <div
                                            className="!ml-8"
                                            style={{ marginLeft: "1rem" }}
                                          >
                                            <span className="total">
                                              ₹ {prices[product?.product_id]}
                                            </span>{" "}
                                            <a
                                              className="cursor-pointer"
                                              onClick={() => {
                                                handleDeleteFromCart(
                                                  product?.id
                                                );
                                              }}
                                              style={{ color: " #8812a1" }}
                                            >
                                              Delete &nbsp; |{" "}
                                            </a>{" "}
                                            <a
                                              className="cursor-pointer"
                                              href={`/product-detail/${product?.product_id}`}
                                              style={{
                                                color: " #8812a1",
                                                marginLeft: "8px",
                                              }}
                                            >
                                              View
                                            </a>
                                          </div>
                                        </div> */}
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
                        <p>no products found in cart</p>
                        <p
                          className="nav-link text-green-600"
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
                  {userData ? (
                    <div className="nk-section-blog-details mt-3">
                      <h4 className="mb-3">Billing Address</h4>
                      <ul className="d-flex flex-column gap-2 pb-0">
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Full Name:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            {userData?.client?.first_name}
                          </p>
                        </li>
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Address:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            {userData?.client?.primary_address[0]?.add_1},{" "}
                            {userData?.client?.primary_address[0]?.add_2 !==
                            null
                              ? `${userData?.client?.primary_address[0]?.add_2},  `
                              : ""}
                            {userData?.client?.primary_address[0]?.city},{" "}
                            {userData?.client?.primary_address[0]?.state},{" "}
                            {userData?.client?.primary_address[0]?.country},{" "}
                            {userData?.client?.primary_address[0]?.zip}
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
                      <button
                        className="btn btn-warning mt-2 mb-2"
                        variant="warning"
                        color="warning"
                        onClick={() => {
                          setShowModal(true);
                          setFormType("update");
                          setAddressUpdateType("billing")
                        }}
                      >
                        Update address
                      </button>
                      {/* <button
                        className="btn btn-warning mb-2 mt-2 ml-2"
                        variant="warning"
                        color="warning"
                        onClick={() => {
                          setShowModal(true);
                          setFormType("add");
                        }}
                      >
                        Add address
                      </button> */}
                      <div>
                        <hr className="mr-2" />
                      </div>
                      <div className="nk-section-blog-details mt-3"></div>
                    </div>
                  ) : (
                    <div className="nk-section-blog-details mt-3">
                      <Button
                        className="btn btn-warning mb-2"
                        variant="warning"
                        color="warning"
                        onClick={() => {
                          setShowModal(true);
                          setFormType("add");
                          setAddressUpdateType("shipping")
                        }}
                      >
                        Add address
                      </Button>
                    </div>
                  )}
                  <div className="nk-section-blog-details mt-3">
                    <div className="max-h-[100px] md:max-h-[175px] overflow-y-auto">
                      <h4 className="mb-3">Shipping Address</h4>

                      <ul className="d-flex flex-column gap-2 pb-0">
                        {userData?.client?.address?.map((add, ind) => (
                          <div className="">
                            <li className="d-flex align-items-center ">
                              <div className="!block">
                                <input
                                  type="checkbox"
                                  checked={ind === activeShippingAddressChecked}
                                  onChange={() =>
                                    handleShippingAddressChange(ind)
                                  }
                                  className="form-check-input"
                                />
                              </div>
                            </li>

                            <li className="d-flex align-items-center gap-5 text-gray-1200">
                              {/* <div className="!block">
                          <input
                type="checkbox"
                checked={ind === activeShippingAddressChecked}
                onChange={() => handleShippingAddressChange(ind)}
                className="form-check-input"
              />
                          </div> */}

                              <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                                Full Name:
                              </p>
                              <p className="m-0 fs-14 text-gray-1200 w-75">
                                {userData?.client?.first_name}
                              </p>
                            </li>
                            <li className="d-flex align-items-center gap-5 text-gray-1200">
                              <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                                Address:
                              </p>
                              <p className="m-0 fs-14 text-gray-1200 w-75">
                                {add.add_1},{" "}
                                {add?.add_2 !== null ? `${add?.add_2},  ` : ""}
                                {add?.city}, {add?.state}, {add?.country},{" "}
                                {add?.zip}
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
                        ))}
                      </ul>
                    </div>

                    <button
                      className="btn btn-warning mt-2 mb-2"
                      variant="warning"
                      color="warning"
                      onClick={() => {
                        setShowModal(true);
                        setFormType("update");
                        setAddressUpdateType("shipping")
                      }}
                    >
                      Update address
                    </button>
                    <button
                      className="btn btn-warning mb-2 mt-2 ml-2"
                      variant="warning"
                      color="warning"
                      onClick={() => {
                        setShowModal(true);
                        setFormType("add");
                      }}
                    >
                      Add address
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ps-lg-0">
                <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5">
                  <h4 className="">Payment Details</h4>
                  <form onSubmit={handleSubmit}>
                    {/* <Form.Group controlId="cardNumber"> */}
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
                        isInvalid={
                          cardNumber && !validateCardNumber(cardNumber)
                        }
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
                    {/* </Form.Group> */}
                    <div className="">
                      {/* <Form.Group controlId="expiry" className="col-md-6 "> */}
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
                          isInvalid={expiry && !validateExpiry(expiry)}
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
                      {/* </Form.Group> */}
                      {/* <Form.Group controlId="cvv" className="col-md-6"> */}
                      <label className="font-bold !text-sm mt-3 m-0">CVV</label>
                      <div className="relative">
                        <input
                          type="password"
                          className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                          placeholder="Enter CVV"
                          value={cvv}
                          onChange={handleCvvChange}
                          required
                          maxLength={3}
                          isInvalid={cvv && !validateCVV(cvv)}
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
                      {/* </Form.Group> */}
                      {/* <Form.Group controlId="name" className="col-md-8"> */}
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
                          <MdOutlineAccountCircle size={20} color="gray" />
                        </div>
                      </div>
                      {nameErr ? (
                        <p className="text-red-600 font-bold !text-sm !text-left !m-0 !p-0">
                          {nameErr}
                        </p>
                      ) : (
                        ""
                      )}
                      {/* </Form.Group> */}
                    </div>
                  </form>
                  <hr className="mt-3" />
                  <div className="nk-section-blog-details">
                    <h4 className="mb-3">Order Summary</h4>
                    <div className="pt-0 mb-3">
                      {/* <!-- <h6 className="fs-18 mb-0">Promocode</h6> --> */}
                      <div className="d-flex w-75">
                        <input
                          type="text"
                          className="form-control rounded-0 py-0 px-2"
                          placeholder="Promocode"
                          name=""
                          value=""
                        />
                        <button
                          type="button"
                          className="btn btn-success rounded-0 px-3 py-1 fs-14 bg-[rgba(34,197,94,1)]"
                          name="button"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    <ul className="d-flex flex-column gap-2 pb-5">
                      <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                          Sub Total:
                        </p>
                        <p className="m-0 fs-14 text-gray-1200 w-75">
                          ₹ {subTotal?.toFixed(2)}
                        </p>
                      </li>
                      <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                          Shipping:
                        </p>
                        <p className="m-0 fs-14 text-gray-1200 w-75">
                          {allProducts?.length > 0 ? "₹ 10.00" : "₹ 0.00"}
                        </p>
                      </li>
                      <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                          Tax:
                        </p>
                        <p className="m-0 fs-14 text-gray-1200 w-75">
                          {allProducts?.length > 0 ? "₹ 40.00" : "₹ 0.00"}
                        </p>
                      </li>
                      <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                          Discount:
                        </p>
                        <p className="m-0 fs-14 text-danger w-75">
                          {allProducts?.length > 0 ? "- ₹5.00" : "₹ 0.00"}
                        </p>
                      </li>
                      <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-16 fw-semibold text-uppercase w-25">
                          Total:
                        </p>
                        <p className="m-0 fs-16 fw-semibold text-dark w-75">
                          {allProducts?.length > 0
                            ? `₹ ${(subTotal + 10 + 40 - 5).toFixed(2)}`
                            : "0.00"}
                        </p>
                      </li>
                    </ul>
                    <div className="!flex !justify-start items-center">
                      <img src="/images/stripe.png" width={45}></img>
                      <p className="w-fit text-sm">
                        The payment is secure and data are not saved for your
                        privacy.
                      </p>
                      <FaLock size={10} className="ml-1" />
                    </div>
                    <button
                      disabled={allProducts?.length > 0 ? false : true}
                      className="btn btn-primary w-100"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Proceed to Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="nk-section nk-cta-section">
          <div class="container">
            <div
              class="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div class="row g-gs align-items-center">
                <div class="col-lg-8">
                  <div class="media-group flex-column flex-lg-row align-items-center">
                    <div class="media media-lg media-circle media-middle text-bg-white text-primary mb-2 mb-lg-0 me-lg-2">
                      <em class="icon ni ni-chat-fill"></em>
                    </div>
                    <div class="text-center text-lg-start">
                      <h3 class="text-capitalize m-0">
                        Chat with our support team!
                      </h3>
                      <p class="fs-16 opacity-75">
                        Get in touch with our support team if you still can’t
                        find your answer.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 text-center text-lg-end">
                  <a href="contact-us.php" class="btn btn-white fw-semiBold">
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
