import React, { useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "../../../features/loader/loaderSlice";
import { Divider } from "@mui/material";

export default function Privacy() {
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
                <nav>
                  {/* <ol className="breadcrumb mb-3 mb-md-4">
                    <li className="breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Privacy Policy
                    </li>
                  </ol> */}
                </nav>
                <h2
                  className="text-[2.5rem] w-full text-center !font-bold"
                  style={{ lineHeight: "50px" }}
                >
                  Privacy Policy
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
                    <li className="active">
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
                        This Privacy Policy outlines how Trading Materials
                        (&quot;<strong>we</strong>,&quot; &quot;
                        <strong>our</strong>,&quot; or &quot;<strong>us</strong>
                        &quot;) collects, uses, discloses, and safeguards the
                        personal information you provide to us when you use our
                        website. We are committed to protecting your privacy and
                        ensuring the security of your personal information. By
                        accessing or using our website, you consent to the
                        practices described in this Privacy Policy.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        1. Information We Collect:
                      </h5>
                      <p className="fs-16">
                        a) <strong>Personal Information:</strong> We may collect
                        personal information, such as your name, email address,
                        phone number, and other contact details when you
                        voluntarily submit this information through our website
                        forms, such as inquiry forms or newsletter
                        subscriptions.
                      </p>
                      <p className="fs-16">
                        b) <strong>Automatically Collected Information:</strong>{" "}
                        Our website may collect certain information
                        automatically, including your IP address, browser type,
                        operating system, and browsing activities. This
                        information helps us analyze trends, administer the
                        website, and improve user experience.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        2. How We Use Your Information:
                      </h5>
                      <p className="fs-16">
                        a) <strong>Provide Services:</strong> We may use your
                        personal information to respond to inquiries, process
                        transactions, and provide you with the services you
                        request from us.
                      </p>
                      <p className="fs-16">
                        b) <strong>Improve User Experience:</strong> We use
                        collected data to enhance our website&#39;s
                        functionality, troubleshoot technical issues, and
                        optimize user experience.
                      </p>
                      <p className="fs-16">
                        c) <strong>Marketing Communication:</strong> With your
                        consent, we may use your contact information to send you
                        newsletters, updates, and promotional materials. You can
                        opt-out of these communications at any time.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        3. Disclosure of Information:
                      </h5>
                      <p className="fs-16">
                        We do not sell, trade, or otherwise transfer your
                        personal information to third parties without your
                        explicit consent, except as described below:
                      </p>
                      <p className="fs-16">
                        a) <strong>Service Providers:</strong> We may share your
                        personal information with trusted third-party service
                        providers who assist us in operating our website or
                        providing services to you, as long as they agree to keep
                        this information confidential.
                      </p>
                      <p className="fs-16">
                        b) <strong>Legal Compliance:</strong> We may disclose
                        your information when required by law or if we believe
                        that such disclosure is necessary to comply with legal
                        processes, protect our rights, privacy, safety, or
                        property, or to investigate potential violations of our
                        terms.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">4. Your Rights:</h5>
                      <p className="fs-16">
                        a) <strong>Access and Correction:</strong> You have the
                        right to access and correct your personal information
                        that we hold. If you wish to access or update your
                        information, please contact us using the information
                        provided below.
                      </p>
                      <p className="fs-16">
                        b) <strong>Withdraw Consent:</strong> If you wish to
                        withdraw your consent for the collection, use, or
                        disclosure of your personal information, please contact
                        us using the information below.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">5. Security:</h5>
                      <p className="fs-16">
                        We implement reasonable security measures to protect
                        your personal information from unauthorized access, use,
                        disclosure, alteration, or destruction. However, no data
                        transmission over the internet or storage system can be
                        guaranteed to be 100% secure.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        6. Updates to Privacy Policy:
                      </h5>
                      <p className="fs-16">
                        We may update this Privacy Policy from time to time. The
                        most current version will be posted on our website, and
                        the revised policy will become effective when posted
                        unless otherwise stated.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">7. Contact Us:</h5>
                      <p className="fs-16">
                        If you have any questions, concerns, or requests
                        regarding this Privacy Policy or the handling of your
                        personal information, please contact us at :{" "}
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
