import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="nk-footer">
        <div className="nk-footer-top">
          <div className="container">
            <div className="nk-footer-content row justify-content-xl-between">
              <div className="col-md-8 col-lg-4 col-xxl-4">
                <div className="nk-footer-brand pb-5 pb-lg-0">
                  <div className="nk-footer-brand-info mb-4">
                    <div className="nk-footer-logo">
                      <a href="/" className="logo-link">
                        <div className="logo-wrap">
                          <img
                            className="logo-img"
                            src="images/tm-logo-1.png"
                            alt="brand-logo"
                          />
                        </div>
                      </a>
                    </div>
                    <p>
                      Streamline your business operations with our powerful
                      suite of solutions. Boost productivity and drive growth
                      with NioLand.
                    </p>
                  </div>
                  <ul className="nk-footer-social">
                    <li>
                      <a href="#">
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

              <div className="col-md-8 col-lg-2 col-xxl-2">
                <div className="nk-footer-info">
                  <h5 className="title">Pages</h5>
                  <ul className="row gy-1 gy-sm-4">
                    <li className="col-12">
                      <a href="about-us.php">About Us</a>
                    </li>
                    <li className="col-12">
                      <a href="pricing.php">Pricing </a>
                    </li>
                    <li className="col-12">
                      <a href="product-details.php">Trading Materials</a>
                    </li>
                    <li className="col-12">
                      <a href="contact-us.html">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-md-8 col-lg-2 col-xxl-2">
                <div className="nk-footer-info">
                  <h5 className="title">Utility Pages</h5>
                  <ul className="row gy-1 gy-sm-4">
                    <li className="col-12">
                      <a href="login.php">Login</a>
                    </li>
                    <li className="col-12">
                      <a href="signup.php">Sign up</a>
                    </li>
                    <li className="col-12">
                      <a href="forgot-password.php"> Forgot Password </a>
                    </li>
                    <li className="col-12">
                      <a href="reset-password.php">Reset Password</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-md-8 col-lg-4 col-xxl-4">
                <div className="nk-footer-info">
                  <h5 className="title">Get In Touch</h5>
                  <p>
                    140/142, 2 Nd Flr, Govind Building, Princess Street, Near
                    Imperial Hotel, Residency Road, India
                  </p>
                  <p>info@tradingmaterials.com</p>
                  <p>+91 - 1234567890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="nk-footer-bottom">
          <div className="container">
            <div className="nk-footer-content row justify-content-between">
              <div className="col-lg-6 px-0">
                <p className="nk-footer-copyright-text text-center text-lg-start">
                  Copyrights &copy; <span id="currentYear"></span>
                  <a className="fs-16" href="#" target="_blank">
                    {" "}
                    Trading Materials
                  </a>
                  . All Rights Reserved.
                </p>
              </div>
              <div className="col-lg-6 px-0">
                <ul className="nk-footer-copyright justify-content-center justify-content-lg-end">
                  <li>
                    <a className="nk-footer-text" href="terms-and-conditions.php">
                      Terms & conditions
                    </a>
                  </li>
                  <li>
                    <a className="nk-footer-text" href="privacy-policy.php">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a className="nk-footer-text" href="refund-policy.php">
                      Cancellation & Refund Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
