/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
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
import { useNavigate } from "react-router-dom";
import { updateUsers } from "../../../../features/users/userSlice";
import { updateCart } from "../../../../features/cartItems/cartSlice";
import { updateNotifications } from "../../../../features/notifications/notificationSlice";
import { updateCartCount } from "../../../../features/cartWish/focusedCount";
import CryptoJS from "crypto-js";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import OrderPlacedRepresentativeModal from "../../modals/orderplaced";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import DeleteAlert from "../../alerts/deleteAlert";

export default function AddToCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state?.products?.value);
  const loaderState = useSelector((state) => state?.loader?.value);
  const userData = useSelector((state) => state?.user?.value);
  const cartProducts = useSelector((state) => state?.cart?.value);
  const userLang = useSelector((state) => state?.lang?.value);
  const clientType = useSelector((state) => state?.clientType?.value);
  const addressStatus = useSelector((state) => state?.addressStatus?.value);
  const [deleteProductId, setDeleteProductId] = useState();

  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [allProducts, setAllProducts] = useState(cartProducts);
  const [fomrType, setFormType] = useState("add");
  const [promocode, setPromocode] = useState("");
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false);
  const [apiErr, setApiErr] = useState([]);
  const [activeShippingAddress, setActiveShippingAddress] = useState(
    userData?.client?.address[0]
  );
  const [activeBillingAddress, setActivebillingAddress] = useState(
    userData?.client?.address[0]
  );
  // eslint-disable-next-line no-unused-vars
  const [activeShippingAddressChecked, setActiveShippingaddressChecked] =
    useState(0);
  const [activeBillingAddressChecked, setActiveBillingAddressChecked] =
    useState(0);

  const [addressUpdateType, setAddressUpdateType] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [userDeleteAgreed, setUserDeleteAgreed] = useState(false);

  // State variable to track quantities for each product
  const [quantities, setQuantities] = useState({});

  // State variable to store prices for each product
  const [prices, setPrices] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [optionalNotes, setOptionalNotes] = useState("");

  console.log(cartProducts, "gggggggg");

  const getUserInfo = async () => {
    try {
      const url =
        clientType === "client"
          ? "https://admin.tradingmaterials.com/api/get-user-info"
          : "https://admin.tradingmaterials.com/api/lead/get-user-info";
      const headerData =
        clientType === "client"
          ? {
              headers: {
                Authorization: `Bearer ` + localStorage.getItem("client_token"),
                Accept: "application/json",
              },
            }
          : {
              headers: {
                "access-token": localStorage.getItem("client_token"),
                Accept: "application/json",
              },
            };

      const response = await axios.get(url, headerData);
      if (response?.data?.status) {
        console.log(response?.data);
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
            setActiveShippingAddress(
              response?.data?.data?.client?.address[1]?.id
            );
        }
      } else {
        console.log(response?.data);
        dispatch(
          updateNotifications({
            type: "warning",
            message: "Oops!",
          })
        );
        // navigate("/login")
      }
    } catch (err) {
      console.log(err, "err");
      dispatch(
        updateNotifications({
          type: "warning",
          message: "Oops!",
        })
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    applyPromoCode();
    console.log(activeBillingAddress, activeShippingAddress, userData);
  }, []);

  useEffect(() => {
    const productData = JSON.parse(localStorage.getItem("productData"));
    const qty = localStorage.getItem("prodcutQty");
    if (productData?.name && qty) {
      console.log(productData, "productdata", qty);
      const initialQuantities = {};
      initialQuantities[productData?.id] = localStorage.getItem("productQty");
      setQuantities(initialQuantities);
      handleAddToCartDirectly(productData?.id, "add", qty);
    }
  }, []);

  async function handleAddToCartDirectly(productId, status, qty) {
    // setAnimateProductId(productId)
    try {
      dispatch(showLoader());
      const response = await axios?.post(
        "https://admin.tradingmaterials.com/api/lead/product/add-to-cart",
        {
          product_id: productId,
          qty: qty,
          status: status,
        },
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        dispatch(updateCart(response?.data?.data?.cart_details));
        dispatch(updateCartCount(response?.data?.data?.cart_count));
        setAllProducts(response?.data?.data?.cart_details);
        // getUserInfo();
        applyPromoCode();
        // const productData = JSON.parse(localStorage.getItem("productData"))

        localStorage.removeItem("productData");
        localStorage.removeItem("prodcutQty");
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
  }

  async function handleAddToCart(productId, status, qty) {
    // setAnimateProductId(productId)
    try {
      dispatch(showLoader());
      const response = await axios?.post(
        "https://admin.tradingmaterials.com/api/lead/product/add-to-cart",
        {
          product_id: productId,
          qty: quantities[productId],
          status: status,
        },
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        dispatch(updateCart(response?.data?.data?.cart_details));
        dispatch(updateCartCount(response?.data?.data?.cart_count));
        setAllProducts(response?.data?.data?.cart_details);
        // getUserInfo();
        applyPromoCode();
        // const productData = JSON.parse(localStorage.getItem("productData"))

        localStorage.removeItem("productData");
        localStorage.removeItem("productQty");
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
  }

  const handlePromoCodeChange = (e) => {
    setPromocode(e?.target?.value);
  };

  const applyPromoCode = async () => {
    try {
      const token = localStorage.getItem("client_token");
      const response = await axios.get(
        "https://admin.tradingmaterials.com/api/lead/product/apply-register-promo-code",
        {
          headers: {
            "access-token": token,
          },
        }
      );
      if (response?.data?.status) {
        console.log(response?.data?.data);
        setSubTotal(response?.data?.data?.subtotal);
        if (response?.data?.data?.discount !== undefined) {
          setDiscount(response?.data?.data?.discount);
          setDiscountPercentage(
            response?.data?.data?.percentage !== null
              ? response?.data?.data?.percentage
              : 0
          );
        } else {
          setDiscount(0);
          setDiscountPercentage(0);
        }
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  const handleShippingAddressChange = (id) => {
    setActiveShippingAddress(id);
    setActiveShippingaddressChecked(id);
  };

  useEffect(() => {
    getUserInfo();
  }, [addressStatus]);

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
    console.log(updatedPrices, "uuuuuuuuuuuuuuuuu");
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
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
    handleAddToCart(productId, "add");
  };

  //deleting from the cart
  const handleDeleteFromCart = async (id) => {
    try {
      dispatch(showLoader());
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/lead/product/remove-cart-item",
        { item_id: id },
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        // getUserInfo();
        dispatch(updateCart(response?.data?.data?.cart_details));
        dispatch(updateCartCount(response?.data?.data?.cart_count));
        setAllProducts(response?.data?.data?.cart_details);
        applyPromoCode();
      } else {
        console.log(response?.data);
        dispatch(
          updateNotifications({
            type: "warning",
            message: "Oops!",
          })
        );
        // navigate("/login")
      }
    } catch (err) {
      console.log(err);
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
    } else {
      setQuantities((prevQuantities) => {
        return {
          ...prevQuantities,
          [productId]: 1,
        };
      });
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
      console.log(billingSameAsShipping);
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
          }
        : {
            total: (subTotal - discount).toFixed(2),
            subtotal: subTotal,
            disc_percent: discountPercentage,
            discount: discount,
            b_address_id: activeBillingAddress,
            shipping_address: billingSameAsShipping ? 0 : 1,
            s_address_id: activeShippingAddress,
            note: optionalNotes,
          };

      console.log(data);
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/lead/product/checkout/place-order",
        data,
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );
      if (response?.data?.status) {
        localStorage.setItem("order_id", response?.data?.data?.order_id);
        if (discount > 0) {
          const expiryDate = new Date(Date.now() + 604800 * 1000); // for 1 week
          sessionStorage.setItem("expiry", JSON.stringify(expiryDate));
          sessionStorage.setItem("offerPhone", userData?.client?.phone);
        }
        navigate(
          `/checkout/order_id/${CryptoJS?.AES?.encrypt(
            `${response?.data?.data?.order_id}`,
            "trading_materials_order"
          )
            ?.toString()
            .replace(/\//g, "_")
            .replace(/\+/g, "-")}`
        );
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

  const handleHideOrderPlacedModal = () => {
    setShowPlaceOrderModal(false);
  };

  const handleCloseDeleteAlert = (agreeStatus) => {
    setShowDeleteAlert(false);
    console.log(agreeStatus, "afree");
  };

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      {/* {showDeleteAlert && <DeleteAlert open={showDeleteAlert} handleClose={handleCloseDeleteAlert()}  />} */}
      {showPlaceOrderModal && (
        <OrderPlacedRepresentativeModal
          show={showPlaceOrderModal}
          hide={handleHideOrderPlacedModal}
        />
      )}
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
      <div className="nk-pages text-left">
        <section className="nk-banner nk-banner-career-job-details bg-gray">
          <div className="nk-banner-wrap wrap-padding pt-120 pt-lg-80 pb-[30px] md:pb-[300px] lg:!pb-[300px]">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-xxl-5 text-left">
                  <div>
                    <a
                      href={`${userLang}/`}
                      className="btn-link mb-2 !inline-flex !items-center !text-large !font-semibold"
                    >
                      <em className="icon ni ni-arrow-left  !inline-flex !items-center !text-large !font-semibold"></em>
                      <span>Back to Home</span>
                    </a>
                    <h1 className="mb-3 font-bold !text-4xl">Your Cart</h1>
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
              <div
                className={`${
                  cartProducts?.length == 0
                    ? "col-lg-12 flex items-center w-full justify-center"
                    : " col-lg-8 pe-lg-0"
                }`}
              >
                <div
                  className={`nk-entry ${
                    cartProducts?.length == 0 ? "border-0" : " pe-lg-5 py-lg-5 "
                  }${
                    allProducts?.length ? "max-h-[70%]" : ""
                  }  overflow-y-auto`}
                >
                  <div
                    className={`${cartProducts?.length > 0 ? " mb-5" : "m-2"}`}
                  >
                    {allProducts?.length > 0 ? (
                      <table className="table">
                        <tbody>
                          {allProducts?.length &&
                            allProducts?.map((product, ind) => {
                              return (
                                <tr key={ind}>
                                  <td className="w-50  drop-shadow-lg">
                                    <div className="d-flex hover:!shadow-lg align-items-start">
                                      <img
                                        src={product?.product?.img_1}
                                        alt="product-image"
                                        className="mb-0 mr-2 cursor-pointer"
                                        width="150px"
                                        onClick={() =>
                                          navigate(
                                            `${userLang}/product-detail/${
                                              product?.product?.slug
                                            }/${CryptoJS?.AES?.encrypt(
                                              `${product?.product_id}`,
                                              "trading_materials"
                                            )
                                              ?.toString()
                                              .replace(/\//g, "_")
                                              .replace(/\+/g, "-")}`
                                          )
                                        }
                                      />
                                      <div className="w-75">
                                        <p
                                          className="prod-title mb-0 !text-lg cursor-pointer"
                                          onClick={() =>
                                            navigate(
                                              `${userLang}/product-detail/${
                                                product?.product?.slug
                                              }/${CryptoJS?.AES?.encrypt(
                                                `${product?.product_id}`,
                                                "trading_materials"
                                              )
                                                ?.toString()
                                                .replace(/\//g, "_")
                                                .replace(/\+/g, "-")}`
                                            )
                                          }
                                          style={{
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            width: "90%",
                                          }}
                                        >
                                          {product?.product?.name}
                                        </p>
                                        {/* <p
                                          className="prod-desc mb-0"
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              product?.product?.description,
                                          }}
                                        /> */}
                                        <p className="prod-desc mb-1 text-success">
                                          In Stock
                                        </p>
                                        <p className="fs-18 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                                          ₹{product?.price}
                                          {product?.price?.USD && (
                                            <span className="text-muted">
                                              {" "}
                                              /Unit
                                            </span>
                                          )}
                                        </p>

                                        <div
                                          className="d-flex align-items-center "
                                          style={{ marginTop: "2rem" }}
                                        >
                                          <div
                                            id="counter"
                                            className="nk-counter"
                                          >
                                            <button
                                              onClick={() =>
                                                handleDecrement(
                                                  product.product_id
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <span id="count">
                                              {quantities[product.product_id] ||
                                                1}
                                            </span>
                                            <button
                                              onClick={() =>
                                                handleIncrement(
                                                  product.product_id
                                                )
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                          <div
                                            className="!ml-8 w-full"
                                            style={{ marginLeft: "1rem" }}
                                          >
                                            <span className="total">
                                              ₹ {prices[product?.product_id]}
                                            </span>{" "}
                                            <a
                                              className="cursor-pointer"
                                              onClick={() => {
                                                // handleDeleteFromCart(
                                                //   product?.id
                                                // );
                                                setDeleteProductId(product?.id);
                                                setShowDeleteAlert(true);
                                              }}
                                              style={{ color: " #8812a1" }}
                                            >
                                              Delete &nbsp; |{" "}
                                            </a>{" "}
                                            <a
                                              className="cursor-pointer"
                                              href={`${userLang}/product-detail/${
                                                product?.product?.slug
                                              }/${CryptoJS?.AES?.encrypt(
                                                `${product?.product_id}`,
                                                "trading_materials"
                                              )
                                                ?.toString()
                                                .replace(/\//g, "_")
                                                .replace(/\+/g, "-")}`}
                                              style={{
                                                color: " #8812a1",
                                                marginLeft: "8px",
                                              }}
                                            >
                                              View
                                            </a>
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
                      <div className="text-center w-full font-bold text-gray-700 ">
                        <p>No products found in cart</p>
                        <p
                          className="nav-link text-green-900 cursor-pointer"
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
                {userData?.client?.primary_address?.length === 0 && (
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
                          {userData?.client?.primary_address?.length === 0 && (
                            <ErrorOutlineIcon
                              fontSize="md"
                              className="!font-bold text-danger"
                            />
                          )}
                        </h4>

                        {userData?.client?.primary_address?.length > 0 && (
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
                        )}
                        {userData?.client?.primary_address?.length > 0 ? (
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
                            <div className="form-check">
                              <input
                                type="checkbox"
                                checked={billingSameAsShipping === true}
                                onChange={handleBillingSameAsShipping}
                                className="form-check-input"
                              />
                              <label className="ml-3 form-check-label">
                                Billing address same as Shipping address
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
                        {userData?.client?.address?.length == 1 && (
                          <span className="text-danger !mt-1  !text-xs ">
                            Please add Address before placing order.
                          </span>
                        )}
                        <div className="nk-section-blog-details mt-1">
                          <div className="max-h-[220px] md:max-h-[225px] overflow-y-auto">
                            <h4 className="mb-3 !font-bold">
                              Shipping Address{" "}
                              {userData?.client?.address?.length == 1 &&
                                !billingSameAsShipping && (
                                  <ErrorOutlineIcon
                                    fontSize="md"
                                    className="!font-bold text-danger"
                                  />
                                )}
                            </h4>

                            <ul className="d-flex flex-column gap-2 pb-0">
                              {userData?.client?.address?.length > 0 &&
                                userData?.client?.address?.map((add, ind) => {
                                  // console.log(add?.id, activeBillingAddress)
                                  if (add?.id !== activeBillingAddress) {
                                    return (
                                      <div className="" key={ind}>
                                        <li className="d-flex align-items-center ">
                                          <div className="!block">
                                            <input
                                              type="checkbox"
                                              checked={
                                                add?.id ===
                                                activeShippingAddress
                                              }
                                              onChange={() => {
                                                handleShippingAddressChange(
                                                  add?.id
                                                );
                                                setActiveShippingaddressChecked(
                                                  ind
                                                );
                                              }}
                                              className="form-check-input"
                                            />
                                            <span
                                              className="ml-3  font-semibold fs-14"
                                              style={{ color: "#0167f3" }}
                                            >
                                              {activeShippingAddressChecked ===
                                              ind
                                                ? "[Selected]"
                                                : ""}
                                            </span>
                                          </div>
                                        </li>

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
                                            {add.add_1},{" "}
                                            {add?.add_2 !== null
                                              ? `${add?.add_2},  `
                                              : ""}
                                            {add?.city}, {add?.state},{" "}
                                            {add?.country}, {add?.zip}
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
                                    );
                                  }
                                })}
                            </ul>
                          </div>

                          {userData?.client?.address?.length > 1 && (
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
              {cartProducts?.length > 0 && (
                <div className="col-lg-4 ps-lg-0 ">
                  <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5">
                    {/* {userData ? (
                    <div className="nk-section-blog-details mt-3">
                      <h4 className="mb-3">Shipping To</h4>
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
                            {userData?.client?.primary_address[0]?.add_2 !== null
                              ? `${userData?.client?.primary_address[0]?.add_2},  `
                              : ""}
                            {userData?.client?.primary_address[0]?.city}, {userData?.client?.primary_address[0]?.state},{" "}
                            {userData?.client?.primary_address[0]?.country}, {userData?.client?.primary_address[0]?.zip}
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
                          setFormType("update")
                        }}
                      >
                        Update address
                      </button>
                    </div>
                  ) : (
                    <div className="nk-section-blog-details mt-3">
                      <Button
                        className="btn btn-warning mb-2"
                        variant="warning"
                        color="warning"
                        onClick={() => {
                          setShowModal(true);
                          setFormType("add")
                        }}
                      >
                        Add address
                      </Button>
                    </div>
                  )}
                  <hr /> */}
                    <div className="nk-section-blog-details">
                      <h4 className="mb-3 text-lg !font-bold">Order Summary</h4>
                      <Divider />
                      <div className="pt-0 mb-3">
                        {/* <!-- <h6 className="fs-18 mb-0">Promocode</h6> --> */}
                        <div className="d-flex w-75">
                          {clientType === "client" && (
                            <input
                              type="text"
                              className="form-control rounded-0 py-0 px-2"
                              placeholder="Promocode"
                              name=""
                              value={promocode}
                              onChange={handlePromoCodeChange}
                            />
                          )}
                          {clientType === "client" && (
                            <button
                              type="button"
                              className="btn btn-success rounded-0 px-3 py-1 fs-14 bg-[rgba(34,197,94,1)]"
                              name="button"
                            >
                              Apply
                            </button>
                          )}
                          {clientType !== "client" && (
                            <p className="text-success text-sm">
                              Promocode applied:{" "}
                              {discountPercentage !== null
                                ? discountPercentage + "%"
                                : ""}
                            </p>
                          )}
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
                        {/* <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                          Shipping:
                        </p>
                        <p className="m-0 fs-14 text-gray-1200 w-75">{allProducts?.length> 0 ? "₹ 10.00" : "₹ 0.00"}</p>
                      </li> */}
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Tax:
                          </p>
                          <p className="m-0 fs-14 text-gray-1200 w-75">
                            {allProducts?.length > 0 ? "₹ 0.00" : "₹ 0.00"}
                          </p>
                        </li>
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                            Discount:
                          </p>
                          <p className="m-0 fs-14 text-danger w-75">
                            {discount} ({discountPercentage}%)
                          </p>
                        </li>
                        <li className="d-flex align-items-center gap-5 text-gray-1200">
                          <p className="m-0 fs-16 fw-semibold text-uppercase w-25">
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
                        className="form-control rounded-0 text-sm !pl-4 px-2 mb-2 !min-h-[auto]"
                        rows={"3"}
                        value={optionalNotes}
                        onChange={handleAdditionalComments}
                        placeholder="Enter your delivery preference"
                      ></textarea>

                      <button
                        disabled={
                          allProducts?.length > 0 &&
                          userData?.client?.primary_address?.length !== 0 &&
                          (userData?.client?.address?.length > 1 ||
                            billingSameAsShipping) &&
                          subTotal > 0
                            ? false
                            : true
                        }
                        onClick={handlePlaceOrder}
                        className="btn btn-primary w-100 rounded-none"
                      >
                        Place Order
                      </button>

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
            </div>
          </div>
        </section>
        <section className="nk-section nk-cta-section nk-section-content-1">
          <div className="container">
            <div className="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7">
              <div className="row g-gs align-items-center">
                <div className="col-lg-8">
                  <div className="media-group flex-column flex-lg-row align-items-center">
                    <div className="media media-lg media-circle media-middle text-bg-white text-primary mb-2 mb-lg-0 me-lg-2">
                      <em className="icon ni ni-chat-fill"></em>
                    </div>
                    <div className="text-center text-lg-start">
                      <h3 className="text-capitalize m-0 !text-3xl !font-bold !leading-loose">
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
            className="border !border-blue-600 !text-blue-600"
            onClick={() => {
              handleDeleteFromCart(deleteProductId);
              setShowDeleteAlert(false);
            }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            className="border !border-red-600 !text-red-600"
            onClick={() => {
              setShowDeleteAlert(false)
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
