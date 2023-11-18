import React, { useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "../../../features/loader/loaderSlice";
import { Divider } from "@mui/material";

export default function Return() {
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
                  Return policy
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
                    <li>
                      <a href="/disclaimer-policy" className="fs-16">
                        Disclaimer Policy
                      </a>
                    </li>
                    <li className="active">
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
                    {/* <div className="pb-5">
                      <p className="fs-16">
                        This Disclaimer policy governs the use of
                        www.tradingmaterials.com (hereinafter referred to as the
                        “Website”).
                      </p>
                    </div> */}
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        When can I return the order?
                      </h5>
                      <p className="fs-16">
                        www.tradingmaterials.com offers a
                        30-day return policy for most items purchased from the
                        Website, with the exception of items marked as “Wrong
                        items in Order”. If you wish to return an item, please
                        contact us within 30 days of your purchase. We will
                        provide you with a return shipping label and
                        instructions on how to return the item.
                      </p>
                    </div>
                    <div className="pb-5">
                      {/* <h5 className="!font-bold text-xl">2. Content</h5> */}
                      <p className="fs-16">
                        Once we have received the item and evaluated its
                        condition, we will process your return and issue a
                        refund.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        Which order are not eligible for return?
                      </h5>
                      <p className="fs-16">
                        Products that are physically damaged, defective, has
                        missing parts, or are different from their description
                        in the product details page are not eligible for return.
                      </p>
                    </div>
                    <div className="pb-5">
                      <h5 className="!font-bold text-xl">
                        what are Condition / term to be noted in any return
                        order ?
                      </h5>
                      <p className="fs-16">
                        Please note that refunds will be issued in the same form
                        of payment as the original purchase. Customers are
                        responsible for return shipping costs and items must be
                        returned in their original condition, unused and with
                        all original tags and packaging intact.
                      </p>
                    </div>
                    <div className="pb-5">
                      {/* <h5 className="!font-bold text-xl">8. Contact Us</h5> */}
                      <p className="fs-16">
                        We reserve the right to deny any return that does not
                        meet our return policy requirements.
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
