import React, { useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "../../../features/loader/loaderSlice";
import { Divider } from "@mui/material";

export default function Disclaimer() {
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
        <section className="nk-section pt-120">
          <div className="nk-mask blur-1 left top"></div>
          <div className="nk-mask blur-1 right bottom"></div>
          <div className="container">
            <div className="nk-block-head md">
              <div
                className="nk-section-head nk-section-head !text-[1rem] text-left !pb-[25px]"
                style={{ fontSize: "1rem" }}
              >
                <nav></nav>
                <h2
                  className="text-[2.5rem] w-full text-center !font-bold"
                  style={{ lineHeight: "50px" }}
                >
                  Disclaimer policy
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
                    <li>
                      <a href="/refund-policy" className="fs-16">
                        Cancellation & Refund Policy
                      </a>
                    </li>
                    <li className="">
                      <a href="/shipping-policy" className="fs-16">
                        Shipping Policy
                      </a>
                    </li>
                    <li className="active">
                      <a href="/disclaimer-policy" className="fs-16">
                        Disclaimer Policy
                      </a>
                    </li>
                    <li className="">
                      <a href="/return-policy" className="fs-16">
                        Return Policy
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
                        This Disclaimer policy governs the use of
                        www.client.tradingmaterials.com (hereinafter referred to as the
                        “Website”).
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        1. Agreement to Disclaimer
                      </h5>
                      <p className="fs-16">
                        By accessing and using the Website, you agree to the
                        terms of this Disclaimer policy and any other terms and
                        policies that are applicable to the Website. If you do
                        not agree to these terms, you must not access or use the
                        Website.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">2. Content</h5>
                      <p className="fs-16">
                        The Website contains content that is provided for
                        general information purposes only and is not intended to
                        constitute professional advice. The content is provided
                        without any warranties, representations or guarantees of
                        any kind.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">3. Use of Website</h5>
                      <p className="fs-16">
                        The Website is available for your own personal use only.
                        You may not use the Website for any commercial purpose,
                        including but not limited to selling products or
                        services, without the express written consent of
                        www.client.tradingmaterials.com.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        4. Intellectual Property Rights
                      </h5>
                      <p className="fs-16">
                        All content on the Website, including but not limited to
                        text, graphics, logos, and images, is the property of
                        www.client.tradingmaterials.com or its suppliers and is
                        protected by copyright and other intellectual property
                        laws. You may not reproduce, modify, distribute,
                        republish, or otherwise exploit any content without the
                        express written consent of www.client.tradingmaterials.com.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        5. Limitation of Liability
                      </h5>
                      <p className="fs-16">
                        www.client.tradingmaterials.com shall not be liable for any
                        damages or losses arising out of or in connection with
                        the use of the Website, including but not limited to
                        direct, indirect, incidental, special, or consequential
                        damages.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        6. Links to Other Websites
                      </h5>
                      <p className="fs-16">
                        The Website may contain links to third-party websites.
                        The linked sites are not under the control of
                        www.client.tradingmaterials.com, and www.client.tradingmaterials.com
                        is not responsible for the content of any linked site.
                        www.client.tradingmaterials.com provides these links as a
                        convenience and does not endorse the companies or
                        contents of any linked sites.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        7. Changes to Disclaimer
                      </h5>
                      <p className="fs-16">
                        www.client.tradingmaterials.com reserves the right to change or
                        modify this Disclaimer policy at any time and for any
                        reason. Any changes or modifications will be effective
                        immediately upon posting the updated Disclaimer policy
                        on the Website. Your continued use of the Website
                        constitutes your agreement to this Disclaimer policy and
                        any updates.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">8. Contact Us</h5>
                      <p className="fs-16">
                        If you have any questions about this Disclaimer policy,
                        please contact us at :{" "}
                        <a
                          className="text-blue"
                          href="mailto:support@tradingmaterials.com"
                        >
                          support@tradingmaterials.com
                        </a>
                        .
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
