import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "../../../features/loader/loaderSlice";
import Header from "../header/header";
import Footer from "../footer/footer";
import { Divider } from "@mui/material";

export default function Terms() {
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
                className="nk-section-head !text-[1rem] text-left !pb-[25px]"
                style={{ fontSize: "1rem" }}
              >
                <nav>
                  {/* <ol className="breadcrumb mb-3 mb-md-4">
                    <li className="breadcrumb-item ">
                      <a href="/">Home</a>
                    </li>{" "}
                    <li className="breadcrumb-item active" aria-current="page">
                      Terms &amp; Conditions
                    </li>
                  </ol> */}
                </nav>
                <h2
                  className="text-[2.5rem] w-full text-center !font-bold"
                  style={{ lineHeight: "50px" }}
                >
                  Terms &amp; Conditions
                </h2>
              </div>
              <Divider />
            </div>
            <div className="row g-gs pt-3 ">
              <div className="col-lg-3">
                <div className="nk-entry-sidebar">
                  <ul className="nk-list-link nk-list-link-page flush">
                    <li className="active">
                      <a href="/terms-and-conditions" className="fs-16">
                        Term &amp; Conditions
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
                  </ul>
                </div>
              </div>
              <div className="col-lg-9 text-left">
                <div className="nk-entry-wrap pt-3 ps-lg-5">
                  <div className="nk-entry">
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">
                        Trading Materials Website Terms and Conditions
                      </h5>
                      <p className="fs-16">
                        Please read these terms and conditions carefully before
                        using the Trading Materials website. By accessing or
                        using the website, you agree to be bound by these terms
                        and conditions. If you do not agree with any part of
                        these terms and conditions, please refrain from using
                        the website.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">1. Use of Content:</h5>
                      <p className="fs-16">
                        The content on this website, including text, graphics,
                        images, and other materials, is for informational
                        purposes only. It is subject to change without notice.
                      </p>
                      <p className="fs-16">
                        Unauthorized use of this website&#39;s content may give
                        rise to a claim for damages and/or be a criminal
                        offense.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">
                        2. Accuracy of Information:
                      </h5>
                      <p className="fs-16">
                        We strive to provide accurate and up-to-date
                        information. However, we do not warrant the accuracy,
                        completeness, or suitability of the information on this
                        website for any particular purpose.
                      </p>
                      <p className="fs-16">
                        You acknowledge that such information may contain
                        inaccuracies or errors, and we expressly exclude
                        liability for any such inaccuracies or errors to the
                        fullest extent permitted by law.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">3. Use of Cookies:</h5>
                      <p className="fs-16">
                        This website uses cookies to monitor browsing
                        preferences. If you allow cookies to be used, the
                        personal information may be stored by us for use by
                        third parties. Please refer to our Privacy Policy for
                        more information.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">
                        4. Links to Other Websites:
                      </h5>
                      <p className="fs-16">
                        This website may contain links to other websites of
                        interest. However, once you use these links to leave our
                        site, please note that we do not have any control over
                        that other website.
                      </p>
                      <p className="fs-16">
                        We are not responsible for the protection and privacy of
                        any information you provide while visiting such sites
                        and such sites are not governed by this privacy
                        statement.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">
                        5. Intellectual Property:
                      </h5>
                      <p className="fs-16">
                        This website contains material which is owned by or
                        licensed to us. This material includes, but is not
                        limited to, the design, layout, look, appearance, and
                        graphics.
                      </p>
                      <p className="fs-16">
                        Reproduction is prohibited other than in accordance with
                        the copyright notice, which forms part of these terms
                        and conditions.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">6. Unlawful Use:</h5>
                      <p className="fs-16">
                        Your use of this website may give rise to a claim for
                        damages and/or be a criminal offense.
                      </p>
                      <p className="fs-16">
                        You may not use this website to distribute, store,
                        transmit, send, or use any material that consists of (or
                        is linked to) any spyware, computer virus, Trojan horse,
                        worm, keystroke logger, rootkit, or other malicious
                        computer software.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">7. Governing Law:</h5>
                      <p className="fs-16">
                        Your use of this website and any dispute arising out of
                        such use of the website is subject to the laws of the
                        jurisdiction in which you reside.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">
                        8. Changes to Terms and Conditions:
                      </h5>
                      <p className="fs-16">
                        We reserve the right to modify these terms and
                        conditions at any time. You should check this page
                        regularly to ensure that you are familiar with the
                        current version.
                      </p>
                      <p className="fs-16">
                        By using this website, you agree to these terms and
                        conditions and acknowledge that they constitute the
                        entire agreement between you and Trading Materials
                        regarding your use of the website.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="font-bold text-xl">9. Contact Us:</h5>
                      <p className="fs-16">
                        For any questions or clarifications regarding these
                        terms and conditions, please contact us at :{" "}
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
                        Connect with Our Support Team!
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
