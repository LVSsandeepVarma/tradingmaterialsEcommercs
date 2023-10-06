import React, { useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "../../../features/loader/loaderSlice";
import { Divider } from "@mui/material";

export default function Refund() {
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
                  Cancellation & Refund Policy
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
                        Term &amp; Conditions
                      </a>
                    </li>
                    <li>
                      <a href="/privacy-policy" className="fs-16">
                        Privacy Policy
                      </a>
                    </li>
                    <li className="active">
                      <a href="/refund-policy" className="fs-16">
                        Cancellation & Refund Policy
                      </a>
                    </li>
                    <li className="">
                      <a href="/shipping-policy" className="fs-16">
                        Shipping Policy
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
                        This Cancellation &amp; Refund Policy outlines the
                        procedures regarding cancellations and refunds for
                        products or services purchased from Trading Materials
                        (&quot;<strong>we</strong>,&quot; &quot;
                        <strong>our</strong>,&quot; or &quot;<strong>us</strong>
                        &quot;). By making a purchase through our website, you
                        agree to the terms and conditions outlined in this
                        policy.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        1. Cancellation of Orders:
                      </h5>
                      <p className="fs-16">
                        a) <strong>Standard Orders:</strong> If you wish to
                        cancel a standard order, please notify us in writing at
                        least 48 hours/days prior to the scheduled delivery
                        date. We will process your cancellation and provide you
                        with a full refund.
                      </p>
                      <p className="fs-16">
                        b) <strong>Custom Orders:</strong> For custom orders
                        that involve personalized products or services,
                        cancellation policies may vary. Please refer to the
                        specific terms provided at the time of order placement.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        2. Refund Eligibility:
                      </h5>
                      <p className="fs-16">
                        a) <strong>Products:</strong> You may be eligible for a
                        refund if you return the purchased product(s) within 2
                        days of receiving them. The product(s) must be unused,
                        in their original condition, and with all packaging
                        intact.
                      </p>

                      <p className="fs-16">
                        b) <strong>Services:</strong> Refund eligibility for
                        services is subject to the terms outlined in the service
                        agreement provided at the time of purchase. Please
                        review the agreement for specific refund conditions.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">3. Refund Process:</h5>
                      <p className="fs-16">
                        a) <strong>Products:</strong> Once we receive the
                        returned product(s) and confirm their condition, we will
                        initiate the refund process. Refunds will be processed
                        using the same payment method used for the original
                        purchase.
                      </p>

                      <p className="fs-16">
                        b) <strong>Services:</strong> For services, refund
                        processes will be in accordance with the terms set forth
                        in the service agreement.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        4. Non-Refundable Items:
                      </h5>
                      <p className="fs-16">
                        a) <strong>Digital Products:</strong> Digital products,
                        including downloadable software, e-books, and digital
                        content, are non-refundable once they have been
                        downloaded or accessed.
                      </p>

                      <p className="fs-16">
                        b) <strong>Customized Items:</strong> Items that have
                        been customized or personalized according to your
                        specifications are generally non-refundable unless they
                        arrive damaged or defective.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        5. Processing Time:
                      </h5>
                      <p className="fs-16">
                        a) <strong>Products:</strong> Refunds for returned
                        products will be processed within 2 days business days
                        after we receive the returned items and verify their
                        condition.
                      </p>

                      <p className="fs-16">
                        b) <strong>Services:</strong> Refunds for services will
                        be processed in accordance with the terms outlined in
                        the service agreement.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">6. Contact Us:</h5>
                      <p className="fs-16">
                        If you have any questions, concerns, or requests related
                        to cancellations and refunds, please contact our
                        customer service team at :{" "}
                        <a
                          className="text-blue"
                          href="mailto:support@tradingmaterials.com"
                        >
                          support@tradingmaterials.com
                        </a>
                        .
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">7. Policy Updates:</h5>
                      <p className="fs-16">
                        We reserve the right to update or modify this
                        Cancellation &amp; Refund Policy at any time. Any
                        changes will be effective upon posting the revised
                        policy on our website.
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
