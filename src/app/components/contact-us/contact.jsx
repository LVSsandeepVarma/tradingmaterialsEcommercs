import React, { useEffect } from "react";
import Header from "../header/header";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "../../../features/loader/loaderSlice";
import Footer from "../footer/footer";

export default function Contact() {
  const dispatch = useDispatch();
  const loaderState = useSelector((state) => state?.loader?.value);
  const userLang = useSelector((state) => state?.lang?.value);

  useEffect(() => {
    dispatch(hideLoader);
  }, []);
  return (
    <>
      <div className="nk-body">
        <div className="nk-body-root">
          {loaderState && (
            <div className="preloader !backdrop-blur-[1px]">
              <div className="loader"></div>
            </div>
          )}

          <Header />
          <main className="nk-pages">
            <section className="nk-section pt-120 pt-lg-160">
              <div className="nk-mask blur-1 left center"></div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xxl-6">
                    <div className="nk-section-head text-center">
                      <span className="nk-section-subtitle" data-aos="fade-up">
                        Need support
                      </span>
                      <h2 className="nk-section-titl !text-4xl !font-bold !leading-loose">
                        Contact Us
                      </h2>
                      <p
                        className="nk-section-text"
                        data-aos="fade-up"
                        data-aos-delay="100"
                      >
                        {" "}
                        Contact us for any inquiries or support you may need.
                        Our dedicated team is ready to assist you and provide
                        the best solutions.{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row gy-5 gy-xl-0">
                  <div
                    className="col-md-6 col-xl-4"
                    data-aos="fade-up"
                    data-aos-delay="150"
                  >
                    <div className="card h-100 bg-blue-300 border-0">
                      <div className="card-body d-flex flex-column justify-content-start !text-left gap g-5">
                        <div>
                          <div className="media media-lg media-middle media-circle text-bg-primary mb-3 mb-md-5">
                            <em className="icon ni ni-cc-alt2-fill"></em>
                          </div>
                          <h4 className="!font-bold text-2xl">
                            Billing &amp; Payments
                          </h4>
                          <p className="line-clamp-3">
                            Manage your billing and payments effortlessly with
                            our user-friendly platform. Stay on top of your
                            financial transactions and ensure smooth and secure
                            payment processes.
                          </p>
                        </div>
                        <a
                          href="help-center.html"
                          className="btn-link text-primary "
                        >
                          <span>See Pricing Questions</span>
                          <em className="icon ni ni-arrow-right"></em>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 col-xl-4"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <div className="card h-100 bg-blue-300 border-0">
                      <div className="card-body d-flex flex-column justify-content-between !text-left gap g-5">
                        <div>
                          <div className="media media-lg media-middle media-circle text-bg-primary mb-3 mb-md-5">
                            <em className="icon ni ni-users-fill"></em>
                          </div>
                          <h4 className="!font-bold text-2xl">
                            Users and Collaboration
                          </h4>
                          <p className="line-clamp-3">
                            Connect and collaborate with users seamlessly on our
                            platform. Share information, assign tasks, and work
                            together efficiently to achieve your goals. Foster a
                            productive and collaborative environment for your
                            team with our user-centric features.
                          </p>
                        </div>
                        <a
                          href="help-center.html"
                          className="btn-link text-primary "
                        >
                          <span>All Documentations</span>
                          <em className="icon ni ni-arrow-right"></em>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4">
                    <div
                      className="card h-100 bg-blue-300 border-0"
                      data-aos="fade-up"
                      data-aos-delay="250"
                    >
                      <div className="card-body d-flex flex-column justify-content-between !text-left gap g-5">
                        <div>
                          <div className="media media-lg media-middle media-circle text-bg-primary mb-3 mb-md-5">
                            <em className="icon ni ni-puzzle-fill"></em>
                          </div>
                          <h4 className="!font-bold text-2xl">
                            Features and Integrations
                          </h4>
                          <p className="line-clamp-3">
                            Unlock a wide range of features and integrations to
                            enhance your workflow. From project management and
                            communication tools to data analytics and
                            automation, our platform offers a comprehensive
                            suite of features that cater to your business needs.
                            Seamlessly integrate with popular apps and services
                            to streamline your operations and boost
                            productivity.
                          </p>
                        </div>
                        <a
                          href="help-center.html"
                          className="btn-link text-primary "
                        >
                          <span>See All Questions</span>
                          <em className="icon ni ni-arrow-right"></em>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="nk-section">
              <div className="nk-mask blur-1 right center"></div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xxl-6">
                    <div className="nk-section-head text-center">
                      <span className="nk-section-subtitle">
                        Contact support
                      </span>
                      <h2 className="nk-section-title text-4xl !font-bold">
                        Get in touch
                      </h2>
                      <p className="nk-section-text">
                        Get in touch for personalized assistance. We're here to
                        help and provide solutions tailored to your
                        requirements.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row g-gs">
                  <div className="col-lg-8 " data-aos-delay="0">
                    <div className="card rounded-2">
                      <div className="card-body !text-left">
                        <form
                          data-action="form/message-form.php"
                          method="post"
                          className="form-submit-init"
                        >
                          <div className="row g-gs !text-left">
                            <div className="col-12 ">
                              <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="form-control-wrap">
                                  <input
                                    type="text"
                                    name="user-name"
                                    className="form-control"
                                    placeholder="Enter your name"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="form-label">Email</label>
                                <div className="form-control-wrap">
                                  <input
                                    type="email"
                                    name="user-email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="form-label">Phone</label>
                                <div className="form-control-wrap">
                                  <input
                                    type="text"
                                    name="user-phone"
                                    className="form-control"
                                    placeholder="(223) 456 - 789"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group">
                                <div className="form-label-group">
                                  <label className="form-label">
                                    Tell us a bit about your query
                                  </label>
                                  <span>
                                    <span id="char-count">0</span>/{" "}
                                    <span id="char-max" data-char-max="255">
                                      255
                                    </span>
                                  </span>
                                </div>
                                <div className="form-control-wrap">
                                  <textarea
                                    id="textarea-box"
                                    name="user-message"
                                    className="form-control"
                                    placeholder="Enter your message"
                                    required
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group">
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                  id="submit-btn"
                                >
                                  Send Message
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="card-list">
                      <div
                        className="card rounded-2"
                        data-aos="fade-up"
                        data-aos-dela="0"
                      >
                        <div className="card-body !text-left">
                          <div className="media media-lg media-middle media-circle text-bg-primary-soft mb-5">
                            <em className="icon ni ni-sign-usd"></em>
                          </div>
                          <h5 className="!font-bold text-xl">
                            Plans &amp; Pricing
                          </h5>
                          <p className="line-clamp-2">
                            Choose from our flexible plans and competitive
                            pricing options to find the best fit for your
                            business needs and budget.
                          </p>
                          <div className="pt-2">
                            <a href="#" className="btn-link text-primary">
                              <span>See Pricing</span>
                              <em className="icon ni ni-arrow-right"></em>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card rounded-2"
                        data-aos="fade-up"
                        data-aos-dela="50"
                      >
                        <div className="card-body !text-left">
                          <div className="media media-lg media-middle media-circle text-bg-primary-soft mb-5">
                            <em className="icon ni ni-question"></em>
                          </div>
                          <h5 className="!font-bold text-xl">
                            Frequently Asked Questions
                          </h5>
                          <p className="line-clamp-2">
                            Find answers to commonly asked questions about our
                            product or service in our comprehensive FAQ section.
                          </p>
                          <div className="pt-2">
                            <a href="#" className="btn-link text-primary">
                              <span>See All Questions</span>
                              <em className="icon ni ni-arrow-right"></em>
                            </a>
                          </div>
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
                  // data-aos="fade-up"
                  // data-aos-delay="100"
                >
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
                        href={`${userLang}/contact`}
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
