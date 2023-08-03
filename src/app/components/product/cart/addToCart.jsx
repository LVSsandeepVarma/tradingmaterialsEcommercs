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

export default function AddToCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state?.products?.value);
  const loaderState = useSelector((state) => state?.loader?.value);
  const userData = useSelector((state) => state?.user?.value);
  const cartProducts = useSelector((state) => state?.cart?.value);

  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allProducts, setAllProducts] = useState(cartProducts);

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
            message: response?.data?.message,
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

  async function handleAddToCart(productId, status) {
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
        dispatch(updateCartCount(response?.data?.data?.cart_count))
        setAllProducts(response?.data?.data?.cart_details);
        // getUserInfo();
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

  useEffect(() => {
    async function fetchProducts() {
      if (cartProducts?.length > 0) {
        setAllProducts(cartProducts);
      }
      dispatch(showLoader());
      try {
        const response = await axios.get(
          "https://admin.tradingmaterials.com/api/get/products",
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          // setAllProducts(response?.data?.data?.products)
          dispatch(fetchAllProducts(response?.data?.data));
          // setSubCatProducts(response?.data?.data?.products)
        }
      } catch (err) {
        console.log("err");
      } finally {
        dispatch(hideLoader());
      }
    }

    fetchProducts();
  }, [cartProducts]);

  useEffect(() => {
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
        dispatch(updateCartCount(response?.data?.data?.cart_count))
        setAllProducts(response?.data?.data?.cart_details)
      } else {
        console.log(response?.data);
        dispatch(
          updateNotifications({
            type: "warning",
            message: response?.data?.message,
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
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId] || 0;
      return {
        ...prevQuantities,
        [productId]: currentQuantity > 1 ? currentQuantity - 1 : 1,
      };
    });
    handleAddToCart(productId, "remove");
  };

  // Calculate the total price for each product based on the quantity
  const calculateTotalPrice = (product) => {
    const quantity = quantities[product.id] || 1;
    const price = product?.prices?.find((price) => {
      return price?.USD;
    });
    console.log(price);
    if (price) {
      const totalPrice = quantity * price.USD;
      // setPrices((prevPrices) => ({ ...prevPrices, [product.id]: totalPrice }));
      return totalPrice.toFixed(2);
    }
    return "0.00";
  };

  const handleFormSubmit = async (values, actions) => {
    setIsSuccess(false);
    setIsFailure(false);
    // Perform form submission logic here, e.g., sending data to the server
    // For demonstration purposes, let's assume the submission is successful after 2 seconds
    try {
      const token = localStorage.getItem("client_token");
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/add-new/address",
        values,
        {
          headers: {
            "access-token": token,
          },
        }
      );
    } catch (err) {
      console.log(err, "error");
    }

    // setTimeout(() => {
    //   setIsSuccess(false);
    //   setIsFailure(false);
    // }, 6000);
  };

  return (
    <>
      {loaderState && (
        <div className="preloader !bg-[rgba(0,0,0,0.5)]">
          <div className="loader"></div>
        </div>
      )}
      <ShippingAddressModal
        show={showModal}
        onHide={() => setShowModal(false)}
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
          <div className="nk-banner-wrap pt-120 pt-lg-180 pb-300">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-xxl-5 text-left">
                  <div>
                    <a
                      href="careers-project-manage.html"
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
              <div className="col-lg-8 pe-lg-0">
                <div className="nk-entry pe-lg-5 py-lg-5">
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
              </div>
              <div className="col-lg-4 ps-lg-0">
                <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5">
                  {userData ? (
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
                            {userData?.client?.add_1},{" "}
                            {userData?.client?.add_2 !== ""
                              ? `${userData?.client?.add_2},  `
                              : ""}
                            {userData?.client?.city}, {userData?.client?.state},{" "}
                            {userData?.client?.country}, {userData?.client?.zip}
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
                  ) : (
                    <div className="nk-section-blog-details mt-3">
                      <Button
                        className="btn btn-warning mb-2"
                        variant="warning"
                        color="warning"
                        onClick={() => {
                          setShowModal(true);
                        }}
                      >
                        Add address
                      </Button>
                    </div>
                  )}
                  <hr />
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
                        <p className="m-0 fs-14 text-gray-1200 w-75">₹ 10.00</p>
                      </li>
                      <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                          Tax:
                        </p>
                        <p className="m-0 fs-14 text-gray-1200 w-75">₹ 40.00</p>
                      </li>
                      <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-12 fw-semibold text-uppercase w-25">
                          Discount:
                        </p>
                        <p className="m-0 fs-14 text-danger w-75">- ₹ 5.00</p>
                      </li>
                      <li className="d-flex align-items-center gap-5 text-gray-1200">
                        <p className="m-0 fs-16 fw-semibold text-uppercase w-25">
                          Total:
                        </p>
                        <p className="m-0 fs-16 fw-semibold text-dark w-75">
                          ₹ {(subTotal + 10 + 40 - 5).toFixed(2)}
                        </p>
                      </li>
                    </ul>
                    <a href="#" className="btn btn-primary w-100">
                      Proceed to Pay
                    </a>
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
