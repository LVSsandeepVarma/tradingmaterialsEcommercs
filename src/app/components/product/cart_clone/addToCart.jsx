/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { BsCheck2Circle } from "react-icons/bs";

import {
  hideLoader,
  showLoader,
} from "../../../../features/loader/loaderSlice";
import axios from "axios";
import ShippingAddressModal from "../../modals/address";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { updateUsers } from "../../../../features/users/userSlice";
import { updateCart } from "../../../../features/cartItems/cartSlice";
import { updateNotifications } from "../../../../features/notifications/notificationSlice";
import { updateCartCount } from "../../../../features/cartWish/focusedCount";
import CryptoJS from "crypto-js";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import SessionExpired from "../../modals/sessionExpired";
import Dashboard from "../../commonDashboard/Dashboard";
import { useTranslation } from "react-i18next";

export default function AddToCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const products = useSelector((state) => state?.products?.value);
  const loaderState = useSelector((state) => state?.loader?.value);
  const userData = useSelector((state) => state?.user?.value);
  const cartProducts = useSelector((state) => state?.cart?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  const clientType = "client";
  // useSelector((state) => state?.clientType?.value);
  const addressStatus = useSelector((state) => state?.addressStatus?.value);

  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isSuccess, setIsSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isFailure, setIsFailure] = useState(false);
  const [disablePromocodeButton, setDisablePromocodeButton] = useState(false);
  const [allProducts, setAllProducts] = useState(cartProducts);
  const [fomrType, setFormType] = useState("add");
  const [promocode, setPromocode] = useState("");
  const [promocodeApplied, setPromocodeApplied] = useState(false);
  const [promocodeErr, setPromocodeErr] = useState("");
  const [activeBillingAddressChecked, setActiveBillingAddressChecked] =
    useState(0);
  const [apiErr, setApiErr] = useState([]);
  const [activeProductId, setActiveProductId] = useState();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState();
  const [increamentDecreamentLoader, setIncreamentDecreamentLoader] =
    useState(false);
  const [activeShippingAddress, setActiveShippingAddress] = useState(
    userData?.client?.address[0]
  );
  const [activeBillingAddress, setActivebillingAddress] = useState(
    userData?.client?.address[0]
  );
  // eslint-disable-next-line no-unused-vars
  const [activeShippingAddressChecked, setActiveShippingaddressChecked] =
    useState(0);

  const [addressUpdateType, setAddressUpdateType] = useState("");

  // State variable to track quantities for each product
  const [quantities, setQuantities] = useState({});

  // State variable to store prices for each product
  const [prices, setPrices] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [optionalNotes, setOptionalNotes] = useState("");
  const [showSessionExpiry, setShowSessionExpiry] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, [addressStatus]);

  useEffect(() => {
    if (localStorage.getItem("shipAdd")) {
      handleShippingAddressChange(parseInt(localStorage.getItem("shipAdd")));
      setBillingSameAsShipping(false);
    }
  }, []);

  const getUserInfo = async () => {
    try {
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
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        setAllProducts(response?.data?.data?.client?.cart);
        setActivebillingAddress(
          response?.data?.data?.client?.primary_address[0]?.id
        );
        if (billingSameAsShipping) {
          setActiveShippingAddress(
            response?.data?.data?.client?.address[0]?.id
          );
        } else {
          if (userData?.client?.address?.length > 1)
            if (activeShippingAddressChecked != 0) {
              setActiveShippingAddress(
                response?.data?.data?.client?.address[
                  activeShippingAddressChecked
                ]?.id
              );
            } else {
              setActiveShippingAddress(
                response?.data?.data?.client?.address[1]?.id
              );
            }
        }
      } else {
        setShowSessionExpiry(true);
        // navigate("/login")
      }
    } catch (err) {
      console.log(err, "err");
      setShowSessionExpiry(true);
    } finally {
      dispatch(hideLoader());
    }
  };

  async function handleAddToCart(productId, status) {
    // setAnimateProductId(productId)
    try {
      dispatch(showLoader());
      const response = await axios?.post(
        "https://admin.tradingmaterials.com/api/client/product/add-to-cart",
        {
          product_id: productId,
          qty: quantities[productId],
          status: status,
          client_id: userData?.client?.id,
        },
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        dispatch(updateCart(response?.data?.data?.cart_details));
        dispatch(updateCartCount(response?.data?.data?.cart_count));
        setAllProducts(response?.data?.data?.cart_details);
        if (status == "add") {
          setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 0) + 1,
          }));
        }
        if (status == "remove") {
          setQuantities((prevQuantities) => {
            const currentQuantity = prevQuantities[productId] || 0;
            return {
              ...prevQuantities,
              [productId]: currentQuantity > 1 ? currentQuantity - 1 : 1,
            };
          });
        }
        // getUserInfo();
        // applyPromoCode();
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
      } else {
        dispatch(
          updateNotifications({
            type: "error",
            message: err?.response?.data?.message,
          })
        );
      }
    } finally {
      dispatch(hideLoader());
    }
  }

  const handlePromoCodeChange = (e) => {
    setPromocode(e?.target?.value);
  };

  const applyPromoCode = async () => {
    try {
      if (promocode == "") {
        setPromocodeErr("Promocode is required");
        setTimeout(() => {
          setPromocodeErr("");
        }, 2000);
        return;
      } else if (promocodeApplied) {
        setPromocode("");
        setDiscount(0);
        setDiscountPercentage(0);
        setPromocodeApplied(!true);
        return;
      }
      const token = localStorage.getItem("client_token");
      const response = await axios.get(
        `https://admin.tradingmaterials.com/api/client/apply-promo-code?amount=${(
          subTotal - discount
        ).toFixed(2)}&promocode=${promocode}`,
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        setPromocodeApplied(true);
        setSubTotal(response?.data?.data?.originalAmount);
        setDiscount(response?.data?.data?.discount);
        setDiscountPercentage(response?.data?.data?.discount_rate);
        setDisablePromocodeButton(true);
        setDisablePromocodeButton(false);
      }
    } catch (err) {
      console.log(err, "err");
      if (err?.response?.data?.errors) {
        setPromocodeErr(
          Object.values(err?.response?.data?.errors?.promocode[0])?.join("")
        );
      } else {
        setPromocodeErr(err?.response?.data?.message);
      }
      setTimeout(() => {
        setPromocodeErr("");
        setPromocode("");
      }, 2000);
    }
  };

  const handleShippingAddressChange = (ind) => {
    setActiveShippingAddress(userData?.client?.address[ind]?.id);
    setActiveShippingaddressChecked(ind);
  };

  // Set initial quantity for all products to 1 in the useEffect hook
  useEffect(() => {
    if (allProducts?.length) {
      const initialQuantities = {};
      allProducts.forEach((product) => {
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

  // Function to handle incrementing the quantity for a product
  const handleIncrement = (productId) => {
    // setActiveProductId(productId)
    // setIncreamentDecreamentLoader(true)
    handleAddToCart(productId, "add");
    setTimeout(() => {
      setIncreamentDecreamentLoader(false);
      setActiveProductId();
    }, 800);
  };

  //deleting from the cart
  const handleDeleteFromCart = async (id, clientId) => {
    try {
      dispatch(showLoader());
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/product/remove-cart-item",
        { item_id: id, client_id: clientId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("client_token")}`,
          },
        }
      );
      if (response?.data?.status) {
        // getUserInfo();
        dispatch(updateCart(response?.data?.data?.cart_details));
        dispatch(updateCartCount(response?.data?.data?.cart_count));
        setAllProducts(response?.data?.data?.cart_details);
        // applyPromoCode();
      } else {
        setShowSessionExpiry(true);
        // navigate("/login")
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

  // Function to handle decrementing the quantity for a product
  const handleDecrement = (productId) => {
    if (quantities[productId] > 1) {
      setQuantities((prevQuantities) => {
        const currentQuantity = prevQuantities[productId] || 0;
        return {
          ...prevQuantities,
          [productId]: currentQuantity > 1 ? currentQuantity - 1 : 1,
        };
      });
      handleAddToCart(productId, "remove");
      setTimeout(() => {
        setIncreamentDecreamentLoader(false);
        setActiveProductId();
      }, 800);
    } else {
      setQuantities((prevQuantities) => {
        return {
          ...prevQuantities,
          [productId]: 1,
        };
      });
      setTimeout(() => {
        setIncreamentDecreamentLoader(false);
        setActiveProductId();
      }, 800);
    }
    // handleAddToCart(productId, "remove");
  };

  // Calculate the total price for each product based on the quantity

  const handleBillingSameAsShipping = () => {
    setBillingSameAsShipping(!billingSameAsShipping);
    if (!billingSameAsShipping) {
      setActiveShippingAddress(activeBillingAddress);
    } else {
      if (userData?.client?.address?.length > 1)
        setActiveShippingAddress(userData?.client?.address[1]?.id);
      setActiveShippingaddressChecked(1);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      dispatch(showLoader());
      setApiErr([]);
      if (!billingSameAsShipping && activeShippingAddressChecked == 0) {
        setApiErr(["Please select shipping address"]);
      } else {
        const data = billingSameAsShipping
          ? {
              total: (subTotal - discount).toFixed(2),
              subtotal: subTotal,
              disc_percent: discountPercentage,
              discount: discount,
              b_address_id: activeBillingAddress,
              shipping_address: billingSameAsShipping ? 1 : 0,
              s_address_id: activeBillingAddress,
              note: optionalNotes,
              client_id: userData?.client?.id,
            }
          : {
              total: (subTotal - discount).toFixed(2),
              subtotal: subTotal,
              disc_percent: discountPercentage,
              discount: discount,
              b_address_id: activeBillingAddress,
              shipping_address: billingSameAsShipping ? 0 : 1,
              s_address_id:
                userData?.client?.address[activeShippingAddressChecked]?.id,
              note: optionalNotes,
              client_id: userData?.client?.id,
            };

        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/product/checkout/place-order",
          data,
          {
            headers: {
              Authorization: `Bearer ` + localStorage.getItem("client_token"),
            },
          }
        );
        if (response?.data?.status) {
          localStorage.removeItem("shipAdd");
          // localStorage.setItem("order_id", response?.data?.data?.order_id);
          // navigate(
          //   `/checkout/order_id/${CryptoJS?.AES?.encrypt(
          //     `${response?.data?.data?.order_id}`,
          //     "trading_materials_order"
          //   )
          //     ?.toString()
          //     .replace(/\//g, "_")
          //     .replace(/\+/g, "-")}`
          // );
          window.location.href = `https://tradingmaterials.com/client/checkout/${CryptoJS?.AES?.encrypt(
            `${response?.data?.data?.order_id}`,
            "trading_materials_order"
          )
            ?.toString()
            .replace(/\//g, "_")
            .replace(/\+/g, "-")}/${localStorage.getItem("client_token")}/${
            userData?.client?.id
          }`;
        }
      }
    } catch (err) {
      console.log("err", err);
      if (err?.response?.data?.errors) {
        setApiErr([Object.values(err?.response?.data?.errors)]);
      } else {
        setApiErr([err?.response?.data?.message]);
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleAdditionalComments = (event) => {
    setOptionalNotes(event?.target?.value);
  };

  function handleSessionExpiryClose() {
    setShowSessionExpiry(false);
    navigate("/login");
  }

  return (
    <>
      <SessionExpired
        open={showSessionExpiry}
        handleClose={handleSessionExpiryClose}
      />
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <Dashboard />
      <ShippingAddressModal
        show={showModal}
        onHide={() => setShowModal(false)}
        type={fomrType}
        addressType={addressUpdateType}
        data={
          fomrType === "add"
            ? []
            : addressUpdateType == "Billing"
            ? userData?.client?.address[activeBillingAddressChecked]
            : userData?.client?.address[activeShippingAddressChecked]
        }
        // handleFormSubmit={handleFormSubmit}
      />

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
                      Cart Summary
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {cartProducts?.length > 0 && (
                        <div className="col-lg-4 order-lg-1 order-2">
                          {/* addressess  start*/}
                          <div className="nav-but-left  mb-2">
                            {userData?.client?.primary_address?.length === 0 &&
                              allProducts?.length > 0 && (
                                <span className="text-danger !mt-2 !text-xs ">
                                  Please add Address before placing order.
                                </span>
                              )}
                            {cartProducts?.length > 0 && (
                              <div className="mt-2  drop-shadow-lg">
                                {userData ? (
                                  <div className="nk-section-blog-details mt-2">
                                    <h4 className=" !font-bold">
                                      Billing Address :
                                      {userData?.client?.primary_address
                                        ?.length === 0 && (
                                        <ErrorOutlineIcon
                                          fontSize="md"
                                          className="!font-bold text-danger"
                                        />
                                      )}
                                    </h4>

                                    {userData?.client?.primary_address?.length >
                                      0 && (
                                      <ul className="d-flex flex-column gap-2 pb-0">
                                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                                            Full Name:
                                          </p>
                                          <p className="m-0 fs-14 text-gray-1200 w-75">
                                            {userData?.client?.first_name}&nbsp;
                                            {userData?.client?.last_name}
                                          </p>
                                        </li>
                                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                                            Address:
                                          </p>
                                          <p className="m-0 fs-14 text-gray-1200 w-75">
                                            {
                                              userData?.client
                                                ?.primary_address[0]?.add_1
                                            }
                                            ,{" "}
                                            {userData?.client
                                              ?.primary_address[0]?.add_2 !==
                                            null
                                              ? `${userData?.client?.primary_address[0]?.add_2},  `
                                              : ""}
                                            {
                                              userData?.client
                                                ?.primary_address[0]?.city
                                            }
                                            ,{" "}
                                            {
                                              userData?.client
                                                ?.primary_address[0]?.state
                                            }
                                            ,{" "}
                                            {
                                              userData?.client
                                                ?.primary_address[0]?.country
                                            }
                                            ,{" "}
                                            {
                                              userData?.client
                                                ?.primary_address[0]?.zip
                                            }
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
                                    )}
                                    {userData?.client?.primary_address?.length >
                                    0 ? (
                                      <div>
                                        <button
                                          className="btn btn-sm btn-warning mt-2 mb-2"
                                          variant="warning"
                                          color="warning"
                                          onClick={() => {
                                            setActiveBillingAddressChecked(0);
                                            setShowModal(true);
                                            setFormType("update");
                                            setAddressUpdateType("Billing");
                                          }}
                                          style={{
                                            background: "#54a8c7",
                                            border: "#54a8c7",
                                            color: "#fff",
                                          }}
                                        >
                                          Update address
                                        </button>
                                        <div className="flex justify-start items-center pb-2">
                                          <input
                                            type="checkbox"
                                            checked={
                                              billingSameAsShipping === true
                                            }
                                            onChange={
                                              handleBillingSameAsShipping
                                            }
                                            className="form-check-input"
                                          />
                                          <label className="ml-3 form-check-label">
                                            Billing address same as Shipping
                                            address
                                          </label>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        className="btn btn-sm btn-warning mt-2 mb-2"
                                        variant="warning"
                                        color="warning"
                                        onClick={() => {
                                          setShowModal(true);
                                          setFormType("add");
                                          setAddressUpdateType("Billing");
                                        }}
                                        style={{
                                          background: "#54a8c7",
                                          border: "#54a8c7",
                                          color: "#fff",
                                        }}
                                      >
                                        Add address
                                      </button>
                                    )}

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
                                        setAddressUpdateType("shipping");
                                      }}
                                      style={{
                                        background: "#54a8c7 ",
                                        border: "#54a8c7",
                                        color: "#fff",
                                      }}
                                    >
                                      Add address
                                    </Button>
                                  </div>
                                )}
                                {!billingSameAsShipping && (
                                  <>
                                    {userData?.client?.address?.length == 1 &&
                                      allProducts?.length > 0 && (
                                        <span className="text-danger !mt-1  !text-xs ">
                                          Please add Address before placing
                                          order.
                                        </span>
                                      )}
                                    <div className="nk-section-blog-details mt-1">
                                      <div className="max-h-[350px] md:max-h-[500px] overflow-y-auto">
                                        <h4 className="mb-3 !font-bold">
                                          Shipping Address{" "}
                                          {userData?.client?.address?.length ==
                                            1 &&
                                            !billingSameAsShipping && (
                                              <ErrorOutlineIcon
                                                fontSize="md"
                                                className="!font-bold text-danger"
                                              />
                                            )}
                                        </h4>

                                        <ul className="d-flex flex-column gap-2 pb-0 overflow-y-auto max-h-[350px]">
                                          {userData?.client?.address?.length >
                                            0 &&
                                            userData?.client?.address?.map(
                                              (add, ind) => {
                                                if (
                                                  add?.id !==
                                                  activeBillingAddress
                                                ) {
                                                  return (
                                                    <div className="" key={ind}>
                                                      <li className="d-flex align-items-center pb-1">
                                                        <div className="!block">
                                                          <input
                                                            type="checkbox"
                                                            checked={
                                                              activeShippingAddressChecked ===
                                                              ind
                                                            }
                                                            onChange={() => {
                                                              handleShippingAddressChange(
                                                                ind
                                                              );
                                                              setActiveShippingaddressChecked(
                                                                ind
                                                              );
                                                              localStorage.setItem(
                                                                "shipAdd",
                                                                ind
                                                              );
                                                            }}
                                                            className="form-check-input"
                                                          />
                                                          <span
                                                            className="ml-3  font-semibold fs-14"
                                                            style={{
                                                              color: "#0167f3",
                                                            }}
                                                          >
                                                            {activeShippingAddressChecked ===
                                                            ind
                                                              ? "[Selected]"
                                                              : ""}
                                                          </span>
                                                        </div>
                                                      </li>

                                                      <li className="d-flex align-items-center gap-5 text-gray-1200 py-1">
                                                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                                                          Full Name:
                                                        </p>
                                                        <p className="m-0 fs-14 text-gray-1200 w-75">
                                                          {
                                                            userData?.client
                                                              ?.first_name
                                                          }
                                                        </p>
                                                      </li>
                                                      <li className="d-flex align-items-center gap-5 text-gray-1200 py-1">
                                                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                                                          Address:
                                                        </p>
                                                        <p className="m-0 fs-14 text-gray-1200 w-75">
                                                          {add.add_1},{" "}
                                                          {add?.add_2 !== null
                                                            ? `${add?.add_2},  `
                                                            : ""}
                                                          {add?.city},{" "}
                                                          {add?.state},{" "}
                                                          {add?.country},{" "}
                                                          {add?.zip}
                                                        </p>
                                                      </li>
                                                      <li className="d-flex align-items-center gap-5 text-gray-1200 py-1">
                                                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                                                          Shipping Type:
                                                        </p>
                                                        <p className="m-0 fs-14 text-gray-1200 w-75">
                                                          Standard (2-5 business
                                                          days)
                                                        </p>
                                                      </li>
                                                    </div>
                                                  );
                                                }
                                              }
                                            )}
                                        </ul>
                                      </div>

                                      {userData?.client?.address?.length >
                                        1 && (
                                        <button
                                          className="btn btn-sm btn-warning mt-2 mb-2 "
                                          onClick={() => {
                                            setShowModal(true);
                                            setFormType("update");
                                            setAddressUpdateType("shipping");
                                          }}
                                          style={{
                                            backgroundColor: "#54a8c7",
                                            border: "#54a8c7",
                                            color: "#fff",
                                          }}
                                        >
                                          Update address
                                        </button>
                                      )}
                                      <button
                                        className="btn btn-sm btn-warning mb-2 mt-2 ml-2"
                                        variant="warning"
                                        color="warning"
                                        onClick={() => {
                                          setShowModal(true);
                                          setFormType("add");
                                          setAddressUpdateType("shipping");
                                        }}
                                        style={{
                                          background: "#54a8c7",
                                          border: "#54a8c7",
                                          color: "#fff",
                                        }}
                                      >
                                        Add address
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          {/* addressess end */}
                          <div className="nav flex-column  nav-pills">
                            <div className="nav-but-left drop-shadow-lg mt-0">
                              <h4 className="mb-3 !font-bold">Order Summary</h4>
                              <div className="pt-0 mb-3">
                                {/* <!-- <h6 className="fs-18 mb-0">Promocode</h6> --> */}
                                <div
                                  className={`capitalize ${
                                    promocodeApplied
                                      ? "grid grid-cols-1 gap-2"
                                      : ""
                                  }`}
                                >
                                  {promocodeApplied && (
                                    <p className="text-success font-semibold flex items-center text-sm gap-1 drop-shadow-sm">
                                      Promocode applied <BsCheck2Circle />
                                    </p>
                                  )}
                                  <>
                                    <div className="d-flex w-full shadow-sm">
                                      <input
                                        type="text"
                                        className="form-control rounded-0 py-0 px-2"
                                        placeholder="Promocode"
                                        name=""
                                        value={promocode}
                                        onChange={handlePromoCodeChange}
                                        disabled={
                                          disablePromocodeButton ||
                                          promocodeApplied
                                        }
                                      />
                                      <button
                                        type="submit"
                                        className={`btn  rounded-0 px-3 py-1 fs-14 ${
                                          promocodeApplied
                                            ? "bg-red-600 btn-danger"
                                            : "bg-[rgba(34,197,94,1)] btn-success"
                                        } `}
                                        name="button"
                                        onClick={applyPromoCode}
                                        disabled={disablePromocodeButton}
                                      >
                                        {promocodeApplied ? "Clear" : "Apply"}
                                      </button>
                                    </div>
                                  </>
                                  {/* {promocodeApplied && (
                                    <p className="text-green-900 font-semibold">
                                      Promocode applied{" "}
                                      {discountPercentage !== null
                                        ? discountPercentage + "%"
                                        : ""}
                                    </p>
                                  )} */}
                                </div>

                                <div>
                                  {promocodeErr && (
                                    <p className="text-red-600 text-xs text-start">
                                      {promocodeErr}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <ul className="d-flex flex-column gap-2 pb-5">
                                <li className="d-flex align-items-center text-gray-1200">
                                  <p className="m-0 fs-12 fw-semibold text-uppercase w-40">
                                    Sub Total:
                                  </p>
                                  <p className="m-0 fs-14 text-gray-1200 w-75">
                                    ₹ {subTotal}
                                  </p>
                                </li>

                                <li className="d-flex align-items-center text-gray-1200">
                                  <p className="m-0 fs-12 fw-semibold text-uppercase w-40">
                                    Tax:
                                  </p>
                                  <p className="m-0 fs-14 text-gray-1200 w-75">
                                    {allProducts?.length > 0
                                      ? "₹ 0.00"
                                      : "₹ 0.00"}
                                  </p>
                                </li>
                                <li className="d-flex align-items-center  text-gray-1200">
                                  <p className="m-0 fs-12 fw-semibold text-uppercase w-40">
                                    Discount:
                                  </p>
                                  <p className="m-0 fs-14 text-danger w-75">
                                    {discount} ({discountPercentage}%)
                                  </p>
                                </li>
                                <li className="d-flex align-items-center  text-gray-1200">
                                  <p className="m-0 fs-16 fw-semibold text-uppercase w-40">
                                    Total:
                                  </p>
                                  <p className="m-0 fs-16 fw-semibold text-dark w-75">
                                    {allProducts?.length > 0
                                      ? `₹ ${(subTotal - discount).toFixed(2)}`
                                      : "0.00"}
                                  </p>
                                </li>
                              </ul>
                              <label>
                                <h4 className="mb-1"> Comments:</h4>
                              </label>
                              <textarea
                                className="form-control rounded-0  px-2 mb-2 !min-h-[auto]"
                                rows={"2"}
                                value={optionalNotes}
                                onChange={handleAdditionalComments}
                                placeholder="Please mention comments on your order here."
                              ></textarea>

                              <button
                                disabled={
                                  (allProducts?.length > 0 &&
                                  userData?.client?.primary_address?.length !==
                                    0 &&
                                  subTotal > 0
                                    ? false
                                    : true ) || 
                                      (!billingSameAsShipping &&
                                      userData?.client?.address?.length <2)
                                }
                                onClick={handlePlaceOrder}
                                className="btn btn-primary w-100"
                              >
                                Place Order
                              </button>
                              {userData?.client?.primary_address?.length ===
                                0 && (
                                <span className="text-red-800 font-semibold">
                                  Please add Address before placing order.
                                </span>
                              )}
                              {apiErr?.length > 0 &&
                                apiErr?.map((err, ind) => (
                                  <span
                                    key={ind}
                                    className="text-red-800 font-semibold"
                                  >
                                    {err}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        className={`order-1 ${
                          cartProducts?.length > 0 ? "col-lg-8" : "col-lg-12"
                        } `}
                      >
                        <div className={`tab-content `}>
                          <div className="mb-5 !w-full lg:!w-[99%]">
                            {allProducts?.length > 0 ? (
                              <>
                                <div className="card ">
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-12 drop-shadow-lg">
                                        <div className="bd-breadcrumb d-flex align-items-center gap-3 mb-3">
                                          <span
                                            className="cursor-pointer hover:text-blue-600"
                                            onClick={() =>
                                              navigate("/products")
                                            }
                                          >
                                            Home
                                          </span>
                                          <span>Cart</span>
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
                                        </div>
                                        <Divider />
                                        <div>
                                          <div className="overflow-y-auto max-h-[600px]">
                                            {allProducts?.length &&
                                              allProducts?.map(
                                                (product, ind) => {
                                                  return (
                                                    <div key={ind}>
                                                      <div className="">
                                                        <div className="grid grid-cols-2 md:grid-cols-3  align-items-center">
                                                          <div className="w-[75%] lg:w-[50%]">
                                                            <img
                                                              src={
                                                                product?.product
                                                                  ?.img_1
                                                              }
                                                              alt="product-image"
                                                              className="mb-0 mr-2 cursor-pointer"
                                                              // width="150px"
                                                              onClick={() =>
                                                                navigate(
                                                                  `${userLang}/product-detail/${
                                                                    product
                                                                      ?.product
                                                                      ?.slug
                                                                  }/${CryptoJS?.AES?.encrypt(
                                                                    `${product?.product_id}`,
                                                                    "trading_materials"
                                                                  )
                                                                    ?.toString()
                                                                    .replace(
                                                                      /\//g,
                                                                      "_"
                                                                    )
                                                                    .replace(
                                                                      /\+/g,
                                                                      "-"
                                                                    )}`
                                                                )
                                                              }
                                                            />
                                                          </div>
                                                          <div className="min-w-[100%] max-w-[100%] md:min-w-[100%] md:max-w-[100%]">
                                                            <p
                                                              className="prod-title mb-0 text-xs lg:!text-md md:!text-sm  cursor-pointer"
                                                              onClick={() =>
                                                                navigate(
                                                                  `${userLang}/product-detail/${
                                                                    product
                                                                      ?.product
                                                                      ?.slug
                                                                  }/${CryptoJS?.AES?.encrypt(
                                                                    `${product?.product_id}`,
                                                                    "trading_materials"
                                                                  )
                                                                    ?.toString()
                                                                    .replace(
                                                                      /\//g,
                                                                      "_"
                                                                    )
                                                                    .replace(
                                                                      /\+/g,
                                                                      "-"
                                                                    )}`
                                                                )
                                                              }
                                                              style={{
                                                                textOverflow:
                                                                  "ellipsis",
                                                                whiteSpace:
                                                                  "nowrap",
                                                                overflow:
                                                                  "hidden",
                                                                width: "90%",
                                                              }}
                                                            >
                                                              {
                                                                product?.product
                                                                  ?.name
                                                              }
                                                            </p>

                                                            <p className="prod-desc  mb-1 text-success  text-xs lg:!text-md md:!text-sm">
                                                              In Stock
                                                            </p>
                                                            <p className="fs-18 m-0 text-gray-1200  text-start fw-bold !mr-2  !text-xs lg:!text-md md:!text-sm">
                                                              ₹{product?.price}
                                                              {product?.price
                                                                ?.USD && (
                                                                <span className="text-muted  text-xs lg:!text-md md:!text-sm">
                                                                  {" "}
                                                                  /Unit
                                                                </span>
                                                              )}
                                                            </p>

                                                            <div
                                                              className="flex items-center  mt-0 sm:!mt-[2rem]"
                                                              // style={{ marginTop: "0rem" }}
                                                            >
                                                              {increamentDecreamentLoader &&
                                                                activeProductId ==
                                                                  product?.product_id && (
                                                                  <CircularProgress
                                                                    color="secondary"
                                                                    size={25}
                                                                  />
                                                                )}
                                                              {activeProductId !=
                                                                product?.product_id && (
                                                                <div
                                                                  id="counter"
                                                                  className="nk-counter"
                                                                >
                                                                  <button
                                                                    className=" text-xs lg:!text-md md:!text-sm"
                                                                    onClick={() => {
                                                                      setIncreamentDecreamentLoader(
                                                                        true
                                                                      );
                                                                      setActiveProductId(
                                                                        product.product_id
                                                                      );
                                                                      handleDecrement(
                                                                        product.product_id
                                                                      );
                                                                    }}
                                                                  >
                                                                    -
                                                                  </button>
                                                                  <span id="count">
                                                                    {quantities[
                                                                      product
                                                                        .product_id
                                                                    ] || 1}
                                                                  </span>
                                                                  <button
                                                                    className=" text-xs lg:!text-md md:!text-sm"
                                                                    onClick={() => {
                                                                      setIncreamentDecreamentLoader(
                                                                        true
                                                                      );
                                                                      setActiveProductId(
                                                                        product.product_id
                                                                      );
                                                                      handleIncrement(
                                                                        product.product_id
                                                                      );
                                                                    }}
                                                                  >
                                                                    +
                                                                  </button>
                                                                </div>
                                                              )}
                                                              <div
                                                                className="!ml-8 w-full d-flex items-center flex-wrap"
                                                                // style={{ marginLeft: "1rem" }}
                                                              >
                                                                <span className="total  text-xs lg:!text-md md:!text-sm">
                                                                  ₹{" "}
                                                                  {
                                                                    prices[
                                                                      product
                                                                        ?.product_id
                                                                    ]
                                                                  }
                                                                </span>{" "}
                                                                <div className="">
                                                                  <a
                                                                    className="cursor-pointer  text-xs lg:!text-md md:!text-sm"
                                                                    onClick={() => {
                                                                      // handleDeleteFromCart(
                                                                      //   product?.id
                                                                      // );
                                                                      setDeleteProductId(
                                                                        product?.id
                                                                      );
                                                                      setShowDeleteAlert(
                                                                        true
                                                                      );
                                                                    }}
                                                                    style={{
                                                                      color:
                                                                        " #8812a1",
                                                                    }}
                                                                  >
                                                                    Delete |{" "}
                                                                  </a>{" "}
                                                                  <a
                                                                    className="cursor-pointer text-xs lg:!text-md md:!text-sm"
                                                                    href={`${userLang}/product-detail/${
                                                                      product
                                                                        ?.product
                                                                        ?.slug
                                                                    }/${CryptoJS?.AES?.encrypt(
                                                                      `${product?.product_id}`,
                                                                      "trading_materials"
                                                                    )
                                                                      ?.toString()
                                                                      .replace(
                                                                        /\//g,
                                                                        "_"
                                                                      )
                                                                      .replace(
                                                                        /\+/g,
                                                                        "-"
                                                                      )}`}
                                                                    style={{
                                                                      color:
                                                                        " #8812a1",
                                                                      marginLeft:
                                                                        "2px",
                                                                    }}
                                                                  >
                                                                    View
                                                                  </a>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="hidden md:flex items-center justify-end">
                                                            <img
                                                              src="https://cdn-icons-png.flaticon.com/512/2203/2203145.png"
                                                              className="mb-0 mr-1"
                                                              width="35px"
                                                              alt=""
                                                            />
                                                            <p
                                                              className="prod-desc mb-0 pr-2 text-success"
                                                              style={{
                                                                marginRight:
                                                                  "5px",
                                                              }}
                                                            >
                                                              Quick Delivery
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <Divider className="my-2" />
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center font-bold text-gray-700 ">
                                <p>No products found in cart</p>
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
                  <a href={`/contactus`} className="btn btn-white fw-semiBold">
                    {t("Contact_support")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <Dialog
        open={showDeleteAlert}
        // onClose={}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete the product from cart ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to delete this product from your cart, you can add it
            later anytime.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="!mr-2 !mb-2">
          <Button
            variant="outlined"
            className="border !border-blue-600 !p-2 !text-blue-600"
            onClick={() => {
              handleDeleteFromCart(deleteProductId, userData?.client?.id);
              setShowDeleteAlert(false);
            }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            className="border !border-red-600 nk-message-error text-xs"
            onClick={() => {
              setShowDeleteAlert(false);
            }}
            autoFocus
          >
            Keep it
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
