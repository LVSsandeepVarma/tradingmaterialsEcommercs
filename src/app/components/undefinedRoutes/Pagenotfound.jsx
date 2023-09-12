import React from 'react'
import Header from '../header/header'
import Footer from '../footer/footer'

export default function Pagenotfound() {
  return (
    <>
    <Header/>
        <main className="nk-pages">
        <section
          className="nk-error-section nk-sectin-space-lg pt-120 pt-xl-180 overflow-hidden mb-5"
        >
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
                      We are very sorry for inconvenience. It looks like you’re
                      try to access a page that either has been deleted or never
                      existed.
                    </p>
                    <ul
                      className="nk-btn-group pt-4 justify-content-center pt-3 pt-md-5 pb-2"
                    >
                      <li>
                        <a href="/" className="btn btn-primary">
                          Go Back Home
                        </a>
                      </li>
                      <li>
                        <a href="/" className="btn btn-outline-primary">
                          Try Again
                        </a>
                      </li>
                    </ul>
                    <hr className="mt-md-6" />
                  </div>
                </div>
              </div>
            </div>
            <div className="row g-gs">
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
            </div>
          </div>
        </section>
        {/* <section className="nk-section nk-newsletter-section pb-lg-0 pb-lg-0">
          <div className="container">
            <div
              className="row justify-content-center justify-content-lg-between align-items-center pb-5 border-bottom border-gray-50"
            >
              <div className="col-lg-6 col-xl-4">
                <div
                  className="nk-newsletter-content text-center text-lg-start pb-5 pb-lg-0"
                >
                  <h4 className="text-capitalize">Subscribe to our newsletter</h4>
                  <p className="fs-16">
                    Join the 5000+ People That Uses Softnio Products.
                  </p>
                </div>
              </div>
              <div className="col-md-10 col-lg-6 col-xl-5">
                <form
                  data-action="form/subscribe.php"
                  className="form-submit-init"
                  method="post"
                >
                  <div className="form-group nk-newsletter-one row">
                    <div className="col-md-8">
                      <div className="form-control-wrap mb-4 mb-md-0">
                        <input
                          type="email"
                          name="email"
                          className="form-control text-base"
                          placeholder="Enter Your Email"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4 ps-md-0">
                      <input
                        type="submit"
                        className="btn btn-primary btn-block h-100"
                        value="Subscribe"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <Footer/>
    </>
  )
}
