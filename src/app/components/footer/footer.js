import React from "react";
import { useSelector } from "react-redux";

export default function Footer() {
  const userLang = useSelector((state) => state?.lang?.value);
  return (
    <>
      <footer className="nk-footer is-theme pt-lg-9">
        <div className="nk-footer-top">
          <div className="container">
            <div className="nk-footer-content">
              <div className="row gy-5 gy-xl-0 justify-content-start justify-content-xl-between">
                <div className="col-md-12 col-lg-6 col-xxl-6 !mt-[100px] md:!mt-[106px] lg:!mt-[0px]">
                  <div className="nk-footer-brand pb-5 pb-lg-0">
                    <div className="nk-footer-brand-info mb-4">
                      <div className="nk-footer-logo flex !justify-start !text-left">
                        <a href={`${userLang}/`} className="logo-link">
                          <div className="logo-wrap ">
                            <img
                              className="logo-img"
                              src="/images/footer-logo.webp"
                              alt="footer-logo"
                            />
                          </div>
                        </a>
                      </div>
                      <p className="!text-left">
                        At Trading Materials, we&apos;re your dedicated source
                        for top-notch trading essentials. We prioritize quality,
                        offering a range of products, from Trading Desk Mats to
                        Candlestick Chart Patterns Posters, designed to elevate
                        your trading experience.
                        <br />
                        At Trading Materials, customer satisfaction is
                        paramount. We aim to make your shopping experience
                        seamless, and our responsive customer support is here to
                        assist you.
                        <br />
                        Thank you for choosing Trading Materials as your source
                        for trading materials. Explore our catalog and embark on
                        your journey to trading success.
                      </p>
                    </div>
                    <ul className="nk-footer-social">
                      <li>
                        {/* // eslint-disable-next-line react/jsx-no-target-blank */}
                        <a
                          rel="noreferrer"
                          href="https://www.facebook.com/people/Trading-Material-Shipping-Service/61551868807687/"
                          target="_blank"
                        >
                          <em className="icon ni ni-facebook-f"></em>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <em className="icon ni ni-twitter"></em>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <em className="icon ni ni-linkedin"></em>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <em className="icon ni ni-telegram"></em>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-12 col-lg-2 col-xxl-2 ">
                  <div className="nk-footer-info text-start">
                    <h5 className="title !text-start !font-bold !mb-[2px]">
                      Pages
                    </h5>
                    <ul className="row gy-1 gy-sm-4">
                      {/* <li className="col-12"><a href="pricing.php">Pricing </a></li> */}
                      <li className="col-12 !mt-[2.25rem] cursor-pointer">
                        <a href="/">Trading Materials</a>
                      </li>
                      <li className="col-12  cursor-pointer">
                        <a href="/about">About Us</a>
                      </li>
                      <li className="col-12 cursor-pointer">
                        <a href="/contact">Contact</a>
                      </li>
                      <li className="col-12 cursor-pointer">
                        <a href="/careers">Careers</a>
                      </li>
                      <li className="col-12 cursor-pointer">
                        <a href="/faq">FAQ</a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* <div className="col-md-8 col-lg-2 col-xxl-2"> 
                        <div className="nk-footer-info">
                            <h5 className="title">Utility Pages</h5>
                            <ul className="row gy-1 gy-sm-4">
                                <li className="col-12"><a href="/#login">Login</a></li>
                                <li className="col-12"><a href="/#signup">Sign up</a></li>
                                <li className="col-12"><a href="forgot-password.php"> Forgot Password </a></li>
                                <li className="col-12"><a href="reset-password.php">Reset Password</a></li>
                            </ul>
                        </div>
                    </div> */}

                <div className="col-md-12 col-lg-3 col-xxl-3">
                  <div className="nk-footer-info ">
                    <h5 className="title !text-start !font-bold !mb-[24px]">
                      Get In Touch
                    </h5>
                    <ul className="row gy-2 gy-sm-4 ">
                      <li className="col-12 !text-center">
                        <a
                          href="mailto:info@softnio.com"
                          className="nk-footer-text d-flex align-items-center gap-1"
                        >
                          <em className="icon ni ni-mail-fill text-primary"></em>
                          <span className="text-lowercase">
                            {" "}
                            support@tradingmaterials.com{" "}
                          </span>
                        </a>
                      </li>
                      <li className="col-12 ">
                        <a
                          href="tel:+1-080-68493342"
                          className="!text-center nk-footer-text d-flex align-items-center gap-1"
                        >
                          <em className="icon ni ni-call-alt-fill text-primary"></em>
                          <span className="text-lowercase"> 080-68493342 </span>
                        </a>
                      </li>
                      <li className="col-12 !text-start">
                        <em className="icon ni ni-map-pin-fill text-primary"></em>
                        <span className="capitalize">
                          3rd Floor, 31, Door No 301, Maina Apartments, Thillai
                          Nagar, Vadakuthu, Neyveli, Cuddalore, Tamil Nadu,
                          607803
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="nk-footer-content">
              <div className="row text-center text-xl-start justify-content-center justify-content-md-between">
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="nk-footer-brand">
                    <div className="nk-footer-brand-info">
                      <h5 className="title !font-bold !text-xl">
                        Our Courier Partners
                      </h5>
                      <div className="nk-footer-logo md:flex md:justify-center lg:justify-start mb-5 mb-md-0">
                        <img
                          className="logo-img"
                          src="/images/partner-logos.webp"
                          alt="partner-logos"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="nk-footer-brand md:flex md:justify-center lg:justify-start">
                    <div className="nk-footer-brand-info ">
                      <h5 className="title !text-xl !font-bold">
                        We Accept Card Payment
                      </h5>
                      <div className="nk-footer-logo mb-5 mb-md-0">
                        <img
                          className="logo-img"
                          src="/images/card-logo.webp"
                          alt="card-logo"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="nk-footer-bottom">
          <div className="container">
            <div className="nk-footer-content-2">
              <div className="row justify-content-between items-end">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <p className=" nk-footer-copyright-text text-center text-xs">
                    Copyrights &copy;
                    <span id="currentYear">{new Date().getFullYear()}</span>
                    <a className=" pr-1 !text-blue-600" href="#">
                      {" "}
                      Trading&#160;Materials.
                    </a>
                    All&nbsp;Rights&nbsp;Reserved.
                  </p> 
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <ul className="  nk-footer-copyright flex flex-auto flex-wrap justify-content-center items-center sm:items-center justify-content-lg-end !mt-2 sm:!mt-0">
                    <li>
                      <a
                        className=" !text-xs nk-footer-text w-50% sm:w-auto"
                        href={`/terms-and-conditions`}
                      >
                        Terms&nbsp;&nbsp;&&nbsp;&nbsp;conditions
                      </a>
                    </li>
                    <li>
                      <a
                        className="nk-footer-text !text-xs"
                        href={`/privacy-policy`}
                      >
                        Privac&nbsp;&nbsp;Policy
                      </a>
                    </li>
                    <li>
                      <a
                        className="nk-footer-text !text-xs"
                        href={`/refund-policy`}
                      >
                        Cancellation&nbsp;&nbsp;&&nbsp;&nbsp;Refund&nbsp;&nbsp;Policy
                      </a>
                    </li>
                    <li>
                      <a
                        className="nk-footer-text !text-xs"
                        href={`/shipping-policy`}
                      >
                        Shipping&nbsp;&nbsp;Policy
                      </a>
                    </li>
                    <li>
                      <a
                        className="!text-xs nk-footer-text"
                        href={`/disclaimer-policy`}
                      >
                        Disclaimer&nbsp;&nbsp;Policy
                      </a>
                    </li>
                    <li>
                      <a
                        className="!text-xs nk-footer-text"
                        href={`/return-policy`}
                      >
                        Return&nbsp;&nbsp;Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
