import React from "react";
import Header from "../header/header";
import Footer from "../footer/footer";

export default function Pagenotfound() {
  return (
    <>
      <Header />
      <div className="nk-body">
        <div className="nk-body-root">
          <main className="nk-pages">
            <section className="nk-error-section nk-sectin-space-lg pt-120 pt-xl-180 overflow-hidden mb-5">
              <div className="nk-mask blur-1 left top"></div>
              <div className="nk-mask blur-1 right bottom"></div>
              <div className="container">
                <div className="row justify-content-center text-center">
                  <div className="col-xl-7">
                    <div className="nk-block-head">
                      <div className="nk-section-head">
                        <div className="error-number mb-5">404</div>
                        <h2 className="nk-block-title m-0 mb-2 mb-md-4">
                          Oops, Page Not Found
                        </h2>
                        <p className="nk-block-text lead">
                          We are very sorry for inconvenience. It looks like
                          you’re try to access a page that either has been
                          deleted or never existed.
                        </p>
                        <ul className="nk-btn-group pt-4 justify-content-center pt-3 pt-md-5 pb-2">
                          <li>
                            <a href="/products" className="btn btn-primary">
                              Go Back Home
                            </a>
                          </li>
                          <li>
                            <a href="/products" className="btn btn-outline-primary">
                              Try Again
                            </a>
                          </li>
                        </ul>
                        <hr className="mt-md-6" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="row g-gs">
              <div className="col-md-6">
                <div className="card bg-primary-100 border-0 h-100 rounded-2">
                  <div className="card-body d-flex flex-column">
                    <div
                      className="media media-lg media-middle media-circle text-bg-primary mb-3 mb-md-5"
                    >
                      <em className="icon ni ni-help-fill"></em>
                    </div>
                    <h4 className="card-title mb-2 mb-md-1">Read the FAQs</h4>
                    <p className="fs-16 mb-0">
                      Lorem ipsum dolor sit amet, consectet adipiscing elit.
                      Consequat aliquet soll ac. Lorem ipsum dolor sit amet,
                      consectet adipiscing elit..
                    </p>
                    <div className="pt-3 pt-md-5 mt-auto">
                      <a href="/contact" className="btn-link text-primary"
                        ><span>Read FAQS</span
                        ><em className="icon ni ni-arrow-right"></em
                      ></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card bg-green-100 border-0 h-100 rounded-2">
                  <div className="card-body d-flex flex-column">
                    <div
                      className="media media-lg media-middle media-circle text-bg-success mb-3 mb-md-5"
                    >
                      <em className="icon ni ni-account-setting"></em>
                    </div>
                    <h4 className="card-title mb-2 mb-md-1">Help &amp; Support</h4>
                    <p className="fs-16 mb-0">
                      Lorem ipsum dolor sit amet, consectet adipiscing elit.
                      Consequat aliquet soll ac. Lorem ipsum dolor sit amet,
                      consectet adipiscing elit.
                    </p>
                    <div className="pt-3 pt-md-5 mt-auto">
                      <a href="#" className="btn-link text-success"
                        ><span>help@nioland.com</span
                        ><em className="icon ni ni-arrow-right"></em
                      ></a>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
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
                        href={`https://tradingmaterials.com/contact`}
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
