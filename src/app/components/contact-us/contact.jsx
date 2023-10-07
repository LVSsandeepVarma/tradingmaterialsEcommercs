import React, { useEffect, useState } from "react";
import Header from "../header/header";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import Footer from "../footer/footer";
import axios from "axios";

export default function Contact() {
  const dispatch = useDispatch();
  const loaderState = useSelector((state) => state?.loader?.value);
  const userLang = useSelector((state) => state?.lang?.value);

  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [desc, setDesc] = useState("");
  const [descErr, setDescErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [apiErr, setApiErr] = useState("");
  const [userIp, setUserIp] = useState("");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
      
  }, []);

  function validName(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      setNameErr("Full name is required");
      return false;
    }else if (!namePattern.test(name)) {
      setNameErr("Full name should contain only alphabets");
      return false;
    } else if (name?.length < 3) {
      setNameErr("Min 3 characters are required");
    } else if (name?.length > 100) {
      setNameErr("Max 100 characters are required");
    }  else {
      setNameErr("");
      return true;
    }
  }

  function validEmail(email) {
    const emailPattern = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    if (email === "") {
      setEmailErr("Email is required");
      return false;
    } else if (emailPattern.test(email)) {
      setEmailErr("");
      return true;
    } else {
      setEmailErr("Invalid Email");
      return false;
    }
  }

  function phoneValidation(phone) {
    const phoneRegex = /^[0-9]+$/;
    if (phone?.length === 0) {
      setPhoneError("Phone number is required");
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("Invalid phone number");
      return false;
    } else if (phone?.length <= 7) {
      setPhoneError("Invalid phone number");
      return false;
    } else if (phone?.length > 15) {
      setPhoneError("Invalid phone number");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  }

  function descValidation(desc) {
    if (desc?.length === 0) {
      setDescErr("Description is required");
      return false;
    } else if (desc?.length > 255) {
      setDescErr("Description should contain maximum 255 characters only");
    } else {
      setDescErr("");
      return true;
    }
  }

  function handleNameChange(e) {
    setName(e.target.value);
    validName(e.target.value);
  }
  function handleEmailChange(e) {
    setEmail(e.target.value);
    validEmail(e.target.value);
  }
  function handlePhoneChange(e) {
    setPhone(e.target.value);
    phoneValidation(e.target.value);
  }
  function handleDescChange(e) {
    setDesc(e.target.value);
    descValidation(e.target.value);
  }

  async function handlesubmit(e) {
    console.log(userIp,"ip")
    e.preventDefault();
    validName(name);
    validEmail(email);
    phoneValidation(phone);
    descValidation(desc);
    
    const currentUrl = window?.location?.href;
   let  updatedUrl;

   if (currentUrl && (currentUrl.startsWith('http://') || currentUrl.startsWith('https://'))) {
      // Replace "http://" or "https://" with "www."
     updatedUrl = currentUrl.replace(/^(https?:\/\/)/, 'www.');
      
      // Now, `updatedUrl` contains the modified URL with "www."
      console.log(updatedUrl);
    } else {
      // The URL didn't start with "http://" or "https://"
      updatedUrl = currentUrl
    }

    if (
      nameErr === "" && name !== "" &&
      emailErr === "" && email !== "" &&
      phoneError === "" && phone !== "" &&
      descErr === "" && desc !== ""
    ) {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/store/contact-us",
          {
            email: email,
            phone: phone,
            name: name,
            message: desc,
            ip_address: userIp,
            domain: updatedUrl
          }
        );
        if (response?.data?.status) {
          setSuccessMsg(response?.data?.message);
          setTimeout(()=>{
            window.location.reload()
          },2000)
        }
      } catch (err) {
        if (err?.response?.data?.errors) {
          setEmailErr(err?.response?.data?.errors["email"]);
          setPhoneError(err?.response?.data?.errors["phone"]);
          setNameErr(err?.response?.data?.errors["name"]);
          setDescErr(err?.response?.data?.errors["message"]);
        } else {
          setApiErr([err?.response?.data?.message]);
        }
      } finally {
        dispatch(hideLoader());
      }
    }
  }

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
          <main className="nk-pages mt-40 sm:mt-60 md:mt-20">
            <section className="nk-section ">
              <div className="nk-mask blur-1 left center"></div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xxl-6">
                    <div className="nk-section-head text-center">
                      <span className="nk-section-subtitle">
                        NEED ASSISTANCE
                      </span>
                      <h2 className="nk-section-titl !text-4xl !font-bold !leading-loose">
                        Reach Out To Us
                      </h2>
                      <p className="nk-section-text">
                        For any inquiries or support you require, feel free to
                        contact us. Our dedicated team is on standby to provide
                        you with optimal solutions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row gy-5 gy-xl-0">
                  <div className="col-md-6 col-xl-4">
                    <div className="card h-100 bg-blue-300 border-0">
                      <div className="card-body d-flex flex-column justify-content-start !text-left gap g-5">
                        <div>
                          <div className="media media-lg media-middle media-circle text-bg-primary mb-3 mb-md-5">
                            <em className="icon ni ni-cc-alt2-fill"></em>
                          </div>
                          <h4 className="!font-bold text-2xl">
                          Billing & Payments
                          </h4>
                          <p className="l">
                          For any doubts related to payment and invoices.
                            <br />
                            <br />
                            You can contact our Billing & Finance Team.
                          </p>
                        </div>
                        {/* <a href="/contact" className="btn-link text-primary ">
                          <span>See Pricing Questions</span>
                          <em className="icon ni ni-arrow-right"></em>
                        </a> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4">
                    <div className="card h-100 bg-blue-300 border-0">
                      <div className="card-body d-flex flex-column justify-content-between !text-left gap g-5">
                        <div>
                          <div className="media media-lg media-middle media-circle text-bg-primary mb-3 mb-md-5">
                            <em className="icon ni ni-users-fill"></em>
                          </div>
                          <h4 className="!font-bold text-2xl">
                          Account Management Team
                          </h4>
                          <p className="">
                          For updating or removing your profile.
                            <br />
                            <br />
                            You can contact our Account Management Team.
                          </p>
                        </div>
                        {/* <a href="/contact" className="btn-link text-primary ">
                          <span>Features and Integrations</span>
                          <em className="icon ni ni-arrow-right"></em>
                        </a> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4">
                    <div className="card h-100 bg-blue-300 border-0">
                      <div className="card-body d-flex flex-column justify-content-between !text-left gap g-5">
                        <div>
                          <div className="media media-lg media-middle media-circle text-bg-primary mb-3 mb-md-5">
                            <em className="icon ni ni-puzzle-fill"></em>
                          </div>
                          <h4 className="!font-bold text-2xl">
                          Order Processing Team
                          </h4>
                          <p className="">
                          For doubts regarding you order/ any products.
                            <br />
                            <br />
                            You can contact our Order Processing Team.
                          </p>
                        </div>
                        {/* <a href="/contact" className="btn-link text-primary ">
                          <span>See All Questions</span>
                          <em className="icon ni ni-arrow-right"></em>
                        </a> */}
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
                        Reach out for personalized assistance. Our team is here
                        to provide tailored solutions to meet your needs.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row g-gs">
                  <div className="col-lg-8 " data-aos-delay="0">
                    <div className="card rounded-2">
                      <div className="card-body !text-left">
                        <form
                          className="form-submit-init"
                          onSubmit={handlesubmit}
                        >
                          <div className="row g-gs !text-left">
                            <div className="col-12 ">
                              <div className="form-group">
                                <label className="form-label">
                                  Full Name{" "}
                                  <sup className="text-red-800 !font-bold">
                                    *
                                  </sup>
                                </label>
                                <div className="form-control-">
                                  <input
                                    className={`form-control ${
                                      nameErr?.length > 0
                                        ? "bg-red-100 drop-shadow-md"
                                        : ""
                                    }`}
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={handleNameChange}
                                  />
                                </div>
                                {nameErr && (
                                  <p className="font-bold text-sm mt-1 mb-1 text-red-600">
                                    {nameErr}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="form-label">
                                  Email{" "}
                                  <sup className="text-red-800 !font-bold">
                                    *
                                  </sup>
                                </label>
                                <div className="">
                                  <input
                                    type="email"
                                    className={`form-control ${
                                      emailErr?.length > 0
                                        ? "bg-red-100 drop-shadow-md"
                                        : ""
                                    }`}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleEmailChange}
                                  />
                                </div>
                                {emailErr && (
                                  <p className="font-bold text-sm mt-1 mb-1 text-red-600">
                                    {emailErr}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="form-label">
                                  Phone{" "}
                                  <sup className="text-red-800 !font-bold">
                                    *
                                  </sup>
                                </label>
                                <div className="">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      phoneError?.length > 0
                                        ? "bg-red-100 drop-shadow-md"
                                        : ""
                                    }`}
                                    placeholder="mobile number"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                  />
                                </div>
                                {phoneError && (
                                  <p className="font-bold text-sm mt-1 mb-1 text-red-600">
                                    {phoneError}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group">
                                <div className="form-label-group">
                                  <label className="form-label">
                                    Tell us a bit about your query{" "}
                                    <sup className="text-red-800 !font-bold">
                                      *
                                    </sup>
                                  </label>
                                  <span>
                                    <span id="char-count">{desc?.length}</span>/{" "}
                                    <span id="char-max" data-char-max="255">
                                      255
                                    </span>
                                  </span>
                                </div>
                                <div className="form-control-wrap">
                                  <textarea
                                    id="textarea-box"
                                    className={`form-control ${
                                      descErr?.length > 0
                                        ? "bg-red-100 drop-shadow-md"
                                        : ""
                                    }`}
                                    placeholder="Enter your message"
                                    value={desc}
                                    onChange={handleDescChange}
                                  ></textarea>
                                </div>
                                {descErr && (
                                  <p className="font-bold text-sm mt-1 mb-1 text-red-600">
                                    {descErr}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group">
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                  onSubmit={handlesubmit}
                                >
                                  Send Message
                                </button>
                              </div>
                              {successMsg?.length > 0 && (
                                <p className="text-green-900 mt-2 text-center font-semibold">
                                  {successMsg}
                                </p>
                              )}
                              {apiErr?.length > 0 &&
                                apiErr?.map((err, ind) => {
                                  return (
                                    <p
                                      key={ind}
                                      className="text-red-600 font-semibold"
                                    >
                                      {err}
                                    </p>
                                  );
                                })}
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="card-list">
                      {/* <div className="card rounded-2">
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
                      </div> */}
                      <div className="card rounded-2">
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
                            <a href="/faq" className="btn-link text-primary">
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
