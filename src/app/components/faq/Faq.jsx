import React, { useEffect } from "react";
import Header from "../header/header";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "../../../features/loader/loaderSlice";
import Footer from "../footer/footer";

export default function Faq() {
  const dispatch = useDispatch();
  const loaderState = useSelector((state) => state?.loader?.value);

  useEffect(() => {
    dispatch(hideLoader);
  }, []);
  return (
    <>
      <div className="nk-body">
        <div className="nk-body-root">
          {loaderState && (
            <div className="preloader">
              <div className="loader"></div>
            </div>
          )}

          <Header />
          <main className="nk-pages mt-20 sm:mt-20 md:mt-10">
            <section className="nk-section ">
              <div className="nk-mask blur-1 left center"></div>
              <div className="container">
                <div className="flex w-full justify-content-center">
                  <div className="col-xl-7">
                    <div className="nk-section-head text-center pb-[20px] flex justify-center">
                      <img src="/images/working_on_it.webp" width={"50%"} alt="trading_materials"></img>
                    </div>
                  </div>
                </div>
                <h1 className="capitalize text-2xl !font-bold text-center !text-slate-400">We are Working on it</h1>
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
                            Get in touch with our support team if you still
                            can’t find your answer.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 text-center text-lg-end">
                      <a
                        href={`/contact`}
                        className="btn btn-white fw-semiBold"
                      >
                        Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
