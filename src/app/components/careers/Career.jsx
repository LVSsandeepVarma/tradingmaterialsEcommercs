import React, { useEffect, useState } from "react";
import Header from "../header/header";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import Footer from "../footer/footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Form } from "react-bootstrap";
import axios from "axios";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Career() {
  const dispatch = useDispatch();
  const userLang = useSelector((state) => state?.lang?.value);

  const loaderState = useSelector((state) => state?.loader?.value);
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState("");
  const [base64encodedFile, setBase64EncodedFile] = useState();
  const [firstNameErr, setFirstNameErr] = useState("");
  const [lastNameErr, setLastNameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [experienceErr, setExperienceErr] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");
  const [positionErr, setPositionErr] = useState("");
  const [fileErr, setFileErr] = useState("");
  const [success, setSuccess] = useState("");
  const [apiErr, setApiErr] = useState([]);
  const [formTitle, setFormTitle] = useState("");

  useEffect(() => {
    dispatch(hideLoader);
  }, []);

  const handleClose = () => {
    setShowForm(false);
    window.location.reload();

    //   if(success != ""){
    //     setSuccess("")
    //   if(apiErr.length >0){setApiErr([])}
    //   if(firstNameErr != ""){setFirstNameErr("")}
    //   if(lastNameErr != ""){setLastNameErr("")}
    //   if(phoneErr != ""){setPhoneErr("")}
    //   if(descriptionErr != ""){setDescriptionErr("")}
    //   if(positionErr != ""){setPositionErr("")}
    //   if(experienceErr != ""){setExperienceErr("")}
    //   if(fileErr != ""){setFileErr("")}
    //   if(firstName != ""){setFirstName("")}
    //   if(lastName != ""){setLastName("")}
    //   if(phone != ""){setPhone("")}
    //   if(description != ""){setDescription("")}
    //   if(position != ""){setPosition("")}
    //   if(experience != ""){setExperience("")}
    //   // if(file != ""){setFile("")}
    //   }
  };

  function validFirstName(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      setFirstNameErr("First name is required");
      return false;
    } else if (!namePattern.test(name)) {
      setFirstNameErr("First name should contain only alphabets");
      return false;
    } else if (name?.length < 3) {
      setFirstNameErr("Min 3 characters are required");
    } else if (name?.length > 100) {
      setFirstNameErr("Max 100 characters are required");
    } else {
      setFirstNameErr("");
      return true;
    }
  }
  function validLastName(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      setLastNameErr("Last name is required");
      return false;
    } else if (!namePattern.test(name)) {
      setLastNameErr("Last name should contain only alphabets");
      return false;
    } else if (name?.length < 3) {
      setLastNameErr("Min 3 characters are required");
    } else if (name?.length > 100) {
      setLastNameErr("Max 100 characters are required");
    } else {
      setLastNameErr("");
      return true;
    }
  }

  //   function validEmail(email) {
  //     const emailPattern = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
  //     if (email === "") {
  //       setEmailErr("Email is required");
  //       return false;
  //     } else if (emailPattern.test(email)) {
  //       setEmailErr("");
  //       return true;
  //     } else {
  //       setEmailErr("Invalid Email");
  //       return false;
  //     }
  //   }

  function phoneValidation(phone) {
    const phoneRegex = /^[0-9]+$/;
    if (phone?.length === 0) {
      setPhoneErr("Phone number is required");
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneErr("Invalid phone number");
      return false;
    } else if (phone?.length <= 7) {
      setPhoneErr("Invalid phone number");
      return false;
    } else if (phone?.length > 15) {
      setPhoneErr("Invalid phone number");
      return false;
    } else {
      setPhoneErr("");
      return true;
    }
  }

  function descValidation(desc) {
    if (desc?.length === 0) {
      setDescriptionErr("Description is required");
      return false;
    } else if (desc?.length > 255) {
      setDescriptionErr(
        "Description should contain maximum 255 characters only"
      );
      return false;
    } else {
      setDescriptionErr("");
      return true;
    }
  }
  function handleExperienceValidation(exp) {
    const experiencePattern = /^[a-zA-Z0-9-.]*$/;
    if (exp === "") {
      setExperienceErr("Experience is required");
      return false;
    } else if (!experiencePattern.test(exp)) {
      setExperienceErr("please enter valid experience");
      return false;
    } else if (exp?.length > 30) {
      setExperienceErr("Max only 30 charecters are allowed");
    } else {
      setExperienceErr("");
      return true;
    }
  }
  function handlePositionValidation(position) {
    const positionPattern = /^[A-Za-z ]+$/;
    if (position === "") {
      setPositionErr("Position is required");
      return false;
    } else if (!positionPattern.test(position)) {
      setPositionErr("Position should contain only alphabets");
      return false;
    } else if (position?.length < 3) {
      setPositionErr("Min 3 characters are required");
    } else if (position?.length > 100) {
      setPositionErr("Max 100 characters are required");
    } else {
      setPositionErr("");
      return true;
    }
  }
  function handleFileValidation(file) {
    const filePattern = /\.pdf$/;
    if (file == "") {
      setFileErr("Resume is required");
      return false;
    } else if (!filePattern.test(file)) {
      setFileErr("Only pdf's are allowed");
    } else {
      setFileErr("");
    }
    return true;
  }

  const handlechange = (inputType, value) => {
    if (inputType == "firstName") {
      setFirstName(value), validFirstName(value);
    } else if (inputType == "lastName") {
      setLastName(value), validLastName(value);
    } else if (inputType == "phone") {
      setPhone(value), phoneValidation(value);
    } else if (inputType == "experience") {
      setExperience(value), handleExperienceValidation(value);
    } else if (inputType == "position") {
      setPosition(value), handlePositionValidation(value);
    } else if (inputType == "description") {
      setDescription(value), descValidation(value);
    }
  };

  function handleFileChange(event) {
    setFile(event.target.value);
    fileFormatter(event.target.files[0]);
    handleFileValidation(event.target.value);
  }

  function fileFormatter(file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      console.log(base64String, base64String.length, "b64");
      // Now you can send the base64String to your server or use it as needed
      setBase64EncodedFile(base64String);
    };

    // Read the file as a data URL, which will be Base64-encoded
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async () => {
    try {
      setApiErr([]);
      setSuccess("");
      dispatch(showLoader());
      validFirstName(firstName);
      validLastName(lastName);
      phoneValidation(phone);
      handleExperienceValidation(experience);
      handlePositionValidation(position);
      descValidation(description);
      handleFileValidation(file);
      if (
        firstNameErr == "" &&
        firstName != "" &&
        lastNameErr == "" &&
        lastName != "" &&
        phoneErr == "" &&
        phone != "" &&
        experienceErr == "" &&
        experience != "" &&
        positionErr == "" &&
        position != "" &&
        descriptionErr == "" &&
        description != "" &&
        fileErr == "" &&
        file != ""
      ) {
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/store/career",
          {
            firstname: firstName,
            lastname: lastName,
            phone: phone,
            experience: experience,
            description: description,
            position: position,
            cvfile: base64encodedFile,
          },
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          setSuccess(response?.data?.message);
          setTimeout(() => {
            handleClose();
          }, 1000);
        }
      }
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.errors) {
        setFirstNameErr(err?.response?.data?.errors["firstname"]);
        setLastNameErr(err?.response?.data?.errors["lastname"]);
        setPhoneErr(err?.response?.data?.errors["phone"]);
        setPositionErr(err?.response?.data?.errors["position"]);
        setExperienceErr(err?.response?.data?.errors["experience"]);
        setFileErr(err?.response?.data?.errors["cvfile"]);
        setDescriptionErr(err?.response?.data?.errors["description"]);
      } else {
        setApiErr([err?.response?.data?.message]);
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
      <div className="nk-body">
        <div className="nk-body-root careers">
          {loaderState && (
            <div className="preloader">
              <div className="loader"></div>
            </div>
          )}
          <Header />
          <main className="nk-pages">
            <section className="nk-section nk-section-teams pt-120 pt-lg-160">
              <div className="nk-mask blur-1 left top"></div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xxl-6">
                    <div className="nk-section-head text-center">
                      <span
                        className="nk-section-subtitle"
                        data-aos="fade-up"
                        data-aos-delay="0"
                      >
                        Join Our Team
                      </span>
                      <h2
                        className="nk-section-title"
                        data-aos="fade-up"
                        data-aos-delay="50"
                      >
                        Grow your career
                      </h2>
                      <p
                        className="nk-section-text"
                        data-aos="fade-up"
                        data-aos-delay="100"
                      >
                        Accelerate your career growth with our comprehensive
                        resources, personalized coaching, and valuable insights.
                      </p>
                      <ul className="nk-btn-group justify-content-center pt-5">
                        <li data-aos="fade-up" data-aos-delay="150">
                          <a href="#open_positions" className="btn btn-primary">
                            Open Positions
                          </a>
                        </li>
                        <li data-aos="fade-up" data-aos-delay="200">
                          <a
                            href="/contact"
                            className="btn btn-outline-primary"
                          >
                            Contact Us
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="nk-section-content"
                data-aos="fade-up"
                data-aos-delay="250"
              >
                <Swiper
                  slidesPerView={3}
                  spaceBetween={30}
                  dots={false}
                  speed={1500}
                  loop={true}
                  autoplay={true}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    720: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 2,
                      spaceBetween: 40,
                    },
                    2048: {
                      slidesPerView: 2,
                      spaceBetween: 50,
                    },
                  }}
                  modules={[Pagination, Autoplay]}
                  className="swiper swiper-init nk-swiper-s4 pt-5 pt-lg-0"
                  data-autoplay="true"
                  data-space-between="30"
                >
                  <SwiperSlide className="swiper-slide h-auto max-h-[50%]">
                    <div>
                      <img
                        src="/images/career/banner-cover-1-a.jpg"
                        alt="banner-cover"
                        className="w-[auto] rounded-2"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide h-auto max-h-[50%]">
                    <div>
                      <img
                        src="/images/career/banner-cover-1-b.jpg"
                        alt="banner-cover"
                        className="w-w-[auto] rounded-2"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide h-auto max-h-[50%]">
                    <div>
                      <img
                        src="/images/career/banner-cover-1-c.jpg"
                        alt="banner-cover"
                        className="w-w-[auto] rounded-2"
                      />
                    </div>
                  </SwiperSlide>

                  <div className="swiper-pagination"></div>
                </Swiper>
              </div>
            </section>
            <section className="nk-section">
              <div className="nk-mask blur-1 right top"></div>
              <div className="container">
                <div className="row gy-5 justify-content-center">
                  <div
                    className="col-md-6 col-lg-4"
                    data-aos="fade-up"
                    data-aos-delay="50"
                  >
                    <div className="card">
                      <div className="card-body">
                        <div className="media media-lg media-middle media-circle text-bg-primary-soft mb-5">
                          <em className="icon ni ni-bar-chart-fill"></em>
                        </div>
                        <h5>Career Growth</h5>
                        <p className="fs-16 line-clamp-3">
                          Planning around your career development is essential
                          for reaching your goals, workplace accomplishments and
                          hard skills.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 col-lg-4"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="card">
                      <div className="card-body">
                        <div className="media media-lg media-middle media-circle text-bg-primary-soft mb-5">
                          <em className="icon ni ni-building-fill"></em>
                        </div>
                        <h5>Great Culture</h5>
                        <p className="fs-16 line-clamp-3">
                          Our working culture encouraged to work as a team, have
                          each other&apos;s back, and bring the best outcomes in
                          every project.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 col-lg-4"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="card">
                      <div className="card-body">
                        <div className="media media-lg media-middle media-circle text-bg-primary-soft mb-5">
                          <em className="icon ni ni-clock-fill"></em>
                        </div>
                        <h5>Flexible Hours</h5>
                        <p className="fs-16 line-clamp-3">
                          Employees break down their workday into
                          non-consecutive chunks of time — 8 a.m. to noon and 4
                          p.m. to 8 p.m.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="nk-section nk-section-info-about">
              <div className="nk-mask blur-1 left center"></div>
              <div className="container">
                <div className="row flex-row-reverse align-items-center justify-content-between">
                  <div className="col-lg-6">
                    <div className="nk-frame pb-md-7 pb-lg-0">
                      <img
                        src="/images/career/section-cover-1.png"
                        alt="section-cover"
                        data-aos="fade-up"
                        data-aos-delay="0"
                      />
                      <div className="nk-frame-children">
                        <img
                          src="/images/career/section-cover-1-a.png"
                          alt="section-cover"
                          data-aos="fade-up"
                          data-aos-delay="50"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <div className="nk-section-head">
                        <h2 className="nk-section-title">
                          We make it easy for teams to build great software
                        </h2>
                        <p className="nk-section-text">
                          Empower your teams to create exceptional software with
                          our user-friendly platform that streamlines
                          development processes, enhances collaboration, and
                          provides robust tools for efficient project
                          management.
                        </p>
                      </div>
                      <a href="#" className="btn btn-outline-primary">
                        <span>Learn More</span>
                        <em
                          className="icon ni ni-arrow-right"
                          id="open_positions"
                        ></em>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="nk-section nk-section-positions">
              <div className="nk-mask blur-1 right top"></div>
              <div className="nk-mask blur-1 left bottom"></div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-6 ">
                    <div className="nk-section-head text-center">
                      <span className="nk-section-subtitle">
                        Open Positions
                      </span>
                      <h2 className="nk-section-title">
                        Come join us at Trading Materials
                      </h2>
                      <p className="nk-section-text">
                        Join us at Trading Materials and be part of our
                        innovative and dynamic team. We offer exciting
                        opportunities for growth.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="nk-section-content border rounded-3 p-5 p-md-7">
                  <div className="row mb-5">
                    <div className="col-lg-3">
                      <h4 className="mb-5 mb-lg-0">Development</h4>
                    </div>
                    <div className="col-lg-9">
                      <div className="position-card ps-lg-2 pb-5 mb-5 border-bottom">
                        <div className="row gx-5 justify-content-md-between align-items-center">
                          <div className="position-card-info col-md-8 px-lg-0 mb-5 mb-md-0">
                            <h5 className="mb-2 !font-bold !text-left">
                              Full Stack Web Developer
                            </h5>
                            <div className="d-flex gap-2 align-items-center text-primary mb-2">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-map-pin-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Banglore
                                </span>
                              </p>
                              -
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-clock-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Full Time
                                </span>
                              </p>
                            </div>
                            <p className="fs-14 line-clamp-6 text-start">
                              To join our tiny but mighty team in Bangalore, we
                              are now looking for a highly driven Full Stack
                              Developer with a strong focus on Node and React
                              JavaScript. The best applicant will have at least
                              three years of full stack development experience
                              and a track record of producing high-caliber
                              software solutions.
                            </p>
                          </div>
                          <div className="col-md-4 col-xl-3">
                            <a
                              onClick={() => {
                                setShowForm(true),
                                  setFormTitle("Full Stack Web Developer");
                              }}
                              className="btn btn-outline-dark border w-100"
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* <div className="position-card ps-lg-2 pb-5 mb-5 border-bottom">
                        <div className="row gx-5 justify-content-md-between align-items-center">
                          <div className="position-card-info col-md-8 px-lg-0 mb-5 mb-md-0">
                            <h5 className="mb-2">Full Stack Developer</h5>
                            <div className="d-flex gap-2 align-items-center text-primary mb-2">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-map-pin-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  san francisco
                                </span>
                              </p>
                              -
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-clock-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Full Time
                                </span>
                              </p>
                            </div>
                            <p className="fs-14 line-clamp-2">
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit morbi in gravida sem enim sed in at euismod
                              tortor et. Lorem ipsum dolor sit amet, consectetur
                              adipiscing elit morbi. lorem
                            </p>
                          </div>
                          <div className="col-md-4 col-xl-3">
                            <a
                              onClick={()=>setShowForm(true)}
                              className="btn btn-outline-dark border w-100"
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="row mb-5">
                    <div className="col-lg-3">
                      <h4 className="mb-5 mb-lg-0">Inventory</h4>
                    </div>
                    <div className="col-lg-9">
                      <div className="position-card ps-lg-2 pb-5 mb-5 border-bottom">
                        <div className="row gx-5 justify-content-md-between align-items-center">
                          <div className="position-card-info col-md-8 px-lg-0 mb-5 mb-md-0">
                            <h5 className="mb-2 !font-bold !text-left">
                              Inventory Supervisor
                            </h5>
                            <div className="d-flex gap-2 align-items-center text-primary mb-2">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-map-pin-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Banglore
                                </span>
                              </p>
                              -
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-clock-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Full Time
                                </span>
                              </p>
                            </div>
                            <p className="fs-14 line-clamp-6 text-start">
                              To manage and monitor all warehouse activities,
                              guarantee effective procedures, and increase
                              warehouse efficiency, we are looking for an
                              experienced warehouse supervisor. The duties of
                              the warehouse supervisor include managing staff,
                              organizing logistical procedures, assuring the
                              quality of the items, and creating pertinent
                              documentation.
                            </p>
                          </div>
                          <div className="col-md-4 col-xl-3">
                            <a
                              onClick={() => {
                                setShowForm(true),
                                  setFormTitle("Inventory Supervisor");
                              }}
                              className="btn btn-outline-dark border w-100"
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="position-card ps-lg-2 pb-5 mb-5 border-bottom">
                        <div className="row gx-5 justify-content-md-between align-items-center">
                          <div className="position-card-info col-md-8 px-lg-0 mb-5 mb-md-0">
                            <h5 className="mb-2 !font-bold !text-left">
                              Store Manager
                            </h5>
                            <div className="d-flex gap-2 align-items-center text-primary mb-2">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-map-pin-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Banglore
                                </span>
                              </p>
                              -
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-clock-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Full Time
                                </span>
                              </p>
                            </div>
                            <p className="fs-14 line-clamp-6 text-start">
                              To handle the daily activities of our business, we
                              are looking for an experienced and devoted store
                              manager. The chosen candidate will be in charge of
                              staff management, assuring top-notch customer
                              service, constantly hitting sales goals, and
                              inventory management.
                            </p>
                          </div>
                          <div className="col-md-4 col-xl-3">
                            <a
                              onClick={() => {
                                setShowForm(true),
                                  setFormTitle("Store Manager");
                              }}
                              className="btn btn-outline-dark border w-100"
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3">
                      <h4 className="mb-5 mb-lg-0">Logistics</h4>
                    </div>
                    <div className="col-lg-9">
                      <div className="position-card ps-lg-2 pb-5 mb-5 border-bottom">
                        <div className="row gx-5 justify-content-md-between align-items-center">
                          <div className="position-card-info col-md-8 px-lg-0 mb-5 mb-md-0">
                            <h5 className="mb-2 !font-bold !text-left">
                              Delivery Manager
                            </h5>
                            <div className="d-flex gap-2 align-items-center text-primary mb-2">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-map-pin-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Banglore
                                </span>
                              </p>
                              -
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-clock-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Full Time
                                </span>
                              </p>
                            </div>
                            <p className="fs-14 line-clamp-6 text-start">
                              In our software industry, we&nbsp;re looking for a
                              Senior Delivery Manager with experience to manage
                              the efficient completion of customer projects.
                              Coordinating project proposals, overseeing
                              execution, fostering client relationships, and
                              enforcing established procedures are all part of
                              this function. Strong technical knowledge,
                              outstanding leadership skills, and a track record
                              of successfully completing projects within
                              predetermined constraints are necessary.
                            </p>
                          </div>
                          <div className="col-md-4 col-xl-3">
                            <a
                              onClick={() => {
                                setShowForm(true),
                                  setFormTitle("Delivery Manager");
                              }}
                              className="btn btn-outline-dark border w-100"
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="position-card ps-lg-2 pb-5">
                        <div className="row gx-5 justify-content-md-between align-items-center">
                          <div className="position-card-info col-md-8 px-lg-0 mb-5 mb-md-0">
                            <h5 className="mb-2 !font-bold !text-left">
                              Delivery Partner
                            </h5>
                            <div className="d-flex gap-2 align-items-center text-primary mb-2">
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-map-pin-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Banglore
                                </span>
                              </p>
                              -
                              <p className="d-flex align-items-center gap-1 mb-0">
                                <em className="icon ni ni-clock-fill"></em>
                                <span className="fs-14 fw-semibold text-uppercase">
                                  Full Time
                                </span>
                              </p>
                            </div>
                            <p className="fs-14 line-clamp-6 text-start">
                              For the position of Delivery Partner, we are
                              searching for applicants with at least zero years
                              of experience. Candidates with prior Full-Time
                              employment experience are welcome to apply. The
                              Delivery Managers Two Wheeler, Delivery Boy Have
                              Bike & License, Goods Vehicle Driving Experience,
                              2 Wheeler Chalane Aana Chahiye, and Delivery are
                              skills needed for a courier position.-General
                              Education or High School Diploma.
                            </p>
                          </div>
                          <div className="col-md-4 col-xl-3">
                            <a
                              onClick={() => {
                                setShowForm(true),
                                  setFormTitle("Delivery Partner");
                              }}
                              className="btn btn-outline-dark border w-100"
                            >
                              Apply Now
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
          <Dialog
            open={showForm}
            onClose={handleClose}
            fullWidth={"80%"}
            className=""
            size="lg"
          >
            <DialogTitle className="!font-bold">{formTitle}</DialogTitle>
            <DialogContent>
              {/* <DialogContentText>
            
          </DialogContentText> */}
              <TextField
                autoFocus
                margin="dense"
                id="fname"
                label="First Name"
                type="text"
                fullWidth
                value={firstName}
                onChange={(e) => {
                  handlechange("firstName", e.target.value);
                }}
                variant="standard"
              />
              {firstNameErr && (
                <p className="text-red-600 font-semibold drop-shadow-lg !text-sm">
                  {firstNameErr}
                </p>
              )}
              <TextField
                autoFocus
                margin="dense"
                id="lname"
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => {
                  handlechange("lastName", e.target.value);
                }}
                fullWidth
                variant="standard"
              />
              {lastNameErr && (
                <p className="text-red-600 font-semibold drop-shadow-lg !text-sm">
                  {lastNameErr}
                </p>
              )}
              {/* <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          /> */}
              <TextField
                autoFocus
                margin="dense"
                id="phone"
                label="Phone number"
                type="number"
                value={phone}
                onChange={(e) => {
                  handlechange("phone", e.target.value);
                }}
                fullWidth
                variant="standard"
              />
              {phoneErr && (
                <p className="text-red-600 font-semibold drop-shadow-lg !text-sm">
                  {phoneErr}
                </p>
              )}
              <TextField
                autoFocus
                margin="dense"
                id="position"
                label="Position"
                type="text"
                value={position}
                autoComplete={false}
                onChange={(e) => {
                  handlechange("position", e.target.value);
                }}
                fullWidth
                variant="standard"
              />
              {positionErr && (
                <p className="text-red-600 font-semibold drop-shadow-lg !text-sm">
                  {positionErr}
                </p>
              )}
              <TextField
                autoFocus
                margin="dense"
                id="experience"
                label="Experience"
                type="text"
                value={experience}
                onChange={(e) => {
                  handlechange("experience", e.target.value);
                }}
                fullWidth
                variant="standard"
              />
              {experienceErr && (
                <p className="text-red-600 font-semibold drop-shadow-lg !text-sm">
                  {experienceErr}
                </p>
              )}
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                type="textarea"
                value={description}
                onChange={(e) => {
                  handlechange("description", e.target.value);
                }}
                fullWidth
                variant="standard"
              />
              {descriptionErr && (
                <p className="text-red-600 font-semibold drop-shadow-lg !text-sm">
                  {descriptionErr}
                </p>
              )}
              <Form.Group controlId="formFileSm" className="mt-3">
                <Form.Label>Upload you Resume</Form.Label>
                <Form.Control
                  type="file"
                  value={file}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  size="sm"
                />
              </Form.Group>
              {fileErr && (
                <p className="text-red-600 font-semibold drop-shadow-lg !text-sm">
                  {fileErr}
                </p>
              )}
            </DialogContent>
            {success && (
              <p className="text-green-400 text-center font-semibold drop-shadow-lg !text-sm">
                {success}
              </p>
            )}
            {apiErr?.length > 0 &&
              apiErr?.map((err, ind) => {
                return (
                  <p
                    key={ind}
                    className="text-red-700 text-xs text-center font-semibold mb1 mt-1 text-left"
                  >
                    {err}
                  </p>
                );
              })}
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Apply</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}
