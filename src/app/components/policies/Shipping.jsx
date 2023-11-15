import React, { useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "../../../features/loader/loaderSlice";
import { Divider } from "@mui/material";
import moment from "moment";

export default function ShippingPolicy() {
  const dispatch = useDispatch();

  const loaderState = useSelector((state) => state?.loader?.value);

  useEffect(() => {
    if (loaderState) {
      dispatch(hideLoader());
    }
  }, []);

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px] ">
          <div className="loader"></div>
        </div>
      )}
      <Header />
      <main className="nk-pages">
        <section className="nk-section pt-120 ">
          <div className="nk-mask blur-1 left top"></div>
          <div className="nk-mask blur-1 right bottom"></div>
          <div className="container">
            <div className="nk-block-head md">
              <div
                className="nk-section-head nk-section-head !text-[1rem] text-left !pb-[25px]"
                style={{ fontSize: "1rem" }}
              >
                <nav>
                  {/* <ol className="breadcrumb mb-3 mb-md-4">
                    <li className="breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Cancellation & Refund Policy
                    </li>
                  </ol> */}
                </nav>
                <h2
                  className="text-[2.5rem] w-full text-center !font-bold"
                  style={{ lineHeight: "50px" }}
                >
                  Shipping Policy
                </h2>
              </div>
              <Divider />
            </div>
            <div className="row g-gs pt-3 ">
              <div className="col-lg-3">
                <div className="nk-entry-sidebar">
                  <ul className="nk-list-link nk-list-link-page flush">
                    <li>
                      <a href="/terms-and-conditions" className="fs-16">
                        Terms &amp; Conditions
                      </a>
                    </li>
                    <li>
                      <a href="/privacy-policy" className="fs-16">
                        Privacy Policy
                      </a>
                    </li>
                    <li className="">
                      <a href="/refund-policy" className="fs-16">
                        Cancellation & Refund Policy
                      </a>
                    </li>
                    <li className="active">
                      <a href="/shipping-policy" className="fs-16">
                        Shipping Policy
                      </a>
                    </li>
                    <li className="">
                      <a href="/disclaimer-policy" className="fs-16">
                        Disclaimer Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-9 text-left">
                <div className="nk-entry-wrap pt-3 ps-lg-5">
                  <div className="nk-entry">
                    <div className="pb-5">
                      <p className="fs-16">
                        At Trading Materials, we are committed to providing you
                        with a seamless and reliable shopping experience. We
                        understand that receiving your products promptly is
                        essential. Please take a moment to review our Shipping
                        Policy to understand how we handle shipping and
                        delivery:
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">Order Processing:</h5>
                      <p className="fs-16">
                        After you place an order on our website, our team will
                        work diligently to process it promptly. Most orders are
                        typically processed within 1-2 business days, excluding
                        weekends and holidays. You will receive a confirmation
                        email with your order details once it has been
                        processed.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">Shipping Methods:</h5>
                      <p className="fs-16">
                        We offer various shipping methods to cater to your
                        needs, including standard and expedited options. The
                        availability of shipping methods may vary depending on
                        your location and the products you order.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">Shipping Times:</h5>
                      <p className="fs-16">
                        Shipping times depend on your chosen shipping method,
                        your location, and product availability. Estimated
                        delivery times will be provided at the checkout based on
                        your shipping address. Please note that these delivery
                        times are estimates and may be subject to unexpected
                        delays caused by factors beyond our control.
                      </p>
                      <br />
                      <p className="fs-16">
                        For delivery across India, the normal shipping duration
                        time will be 3-4 days.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        Tracking Your Order:
                      </h5>
                      <p className="fs-16">
                        Once your order has been shipped, you will receive a
                        tracking number via email. You can use this tracking
                        number to monitor the progress of your shipment and
                        receive real-time updates on its status.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">Shipping Fees:</h5>
                      <p className="fs-16">
                        Shipping fees are calculated based on the weight of your
                        order, your chosen shipping method, and your location.
                        You can view the shipping costs at the checkout before
                        finalizing your purchase.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        International Shipping:
                      </h5>
                      <p className="fs-16">
                        We offer international shipping to select destinations.
                        Please note that additional customs fees, taxes, or
                        import duties may apply depending on your country&#39;s
                        regulations. These charges are the responsibility of the
                        recipient.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        Shipping Restrictions:
                      </h5>
                      <p className="fs-16">
                        Some products may be subject to shipping restrictions
                        due to their size, weight, or destination. We will
                        notify you if your order is affected by any such
                        restrictions, and we will work with you to find a
                        suitable solution.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        Order Changes and Address Updates:
                      </h5>
                      <p className="fs-16">
                        If you need to make changes to your order or update your
                        shipping address, please contact our customer support
                        team as soon as possible. We will do our best to
                        accommodate your request.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        Lost or Damaged Shipments:
                      </h5>
                      <p className="fs-16">
                        In the rare event that your order is lost or damaged
                        during transit, please contact us immediately, and we
                        will initiate a resolution process to ensure your
                        satisfaction.
                        <br />
                        If you have any questions or require further assistance
                        regarding our Shipping Policy, please do not hesitate to
                        reach out to our customer support team. Your
                        satisfaction is our priority, and we are here to assist
                        you.
                      </p>
                    </div>
                    <div className="pb-5">
                      <p className="fs-16">
                        Thank you for choosing Trading Materials for your
                        trading needs.
                      </p>
                      <p className="mt-2">
                        Last Updated:{" "}
                        <b>
                          {moment()
                            .clone()
                            .startOf("month")
                            .format("DD-MM-YYYY")}
                        </b>
                      </p>
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
                      <h3 className="text-capitalize m-0">
                        Connect With Our Support Team!
                      </h3>
                      <p className="fs-16 opacity-75">
                        Feel free to reach out to our support team if your
                        question remains unanswered.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                  <a href="/contact" className="btn btn-white fw-semiBold">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
