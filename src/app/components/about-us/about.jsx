import React, { useEffect } from "react";
import Header from "../header/header";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "../../../features/loader/loaderSlice";
import Footer from "../footer/footer";

export default function About() {
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
            <div className="preloader">
              <div className="loader"></div>
            </div>
          )}

          <Header />
          <main className="nk-pages mt-40 sm:mt-60 md:mt-20">
            <section className="nk-section ">
              <div className="nk-mask blur-1 left center"></div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-7">
                    <div className="nk-section-head text-center">
                      <span className="nk-section-subtitle">Our Story</span>
                      <h2 className="nk-section-title !font-bold">
                        The Story Behind Trading Materials
                      </h2>
                      <p className="nk-section-text">
                        {" "}
                        From a spark of trading passion, Trading Material
                        ignited to democratize knowledge, empowering traders to
                        conquer markets with confidence.{" "}
                      </p>
                      <ul className="nk-btn-group justify-content-center pt-5">
                        <li>
                          <a href={`/careers`} className="btn btn-lg btn-primary">
                            Join Our Team
                          </a>
                        </li>
                        <li>
                          <a
                            href={`${userLang}/contact`}
                            className="btn  btn-lg btn-outline-primary"
                          >
                            Our Values
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-lg-10 col-xl-8">
                    <div className="nk-video rounded-4 bg-primary-100 ">
                      <div className="nk-mask shape-1 rounded-4 overflow-hidden"></div>
                      <div className="nk-video-inner">
                        <div className="nk-video-logo p-4 text-left">
                          <a href={`${userLang}/`} className="logo-link">
                            <div className="logo-wrap text-start">
                              <img
                                className="logo-img"
                                src="/images/tm-logo-1.png"
                                alt="brand-logo"
                              />
                            </div>
                          </a>
                        </div>
                        <div className="nk-video-content">
                          <div className="nk-video-img">
                            <img src="/images/video/e.png" alt="video" />
                          </div>
                          <div className="nk-video-btn">
                            <a
                              data-fslightbox
                              href="https://www.youtube.com/watch?v=pVE92TNDwUk"
                              className="media media-lg media-middle media-circle text-bg-primary shadow-xl animate animate-infinite animate-pulse animate-duration-1"
                            >
                              <em className="icon ni ni-play-fill"></em>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="nk-section">
              <div className="container">
                <div className="row gy-5">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body !p-[30px]">
                        <div className="media-group gap-3 gap-md-4 flex-column flex-lg-row align-items-start align-items-lg-center">
                          <div className="media-text">
                            <div className="h1 text-primary !font-bold">
                              240%
                            </div>
                          </div>
                          <div className="media-text m-0">
                            <h4 className="text-capitalize !text-2xl !text-left !font-bold">
                              Company Growth
                            </h4>
                            <p>
                              {" "}
                              Fostering exponential advancement by embracing
                              innovation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body !p-[30px]">
                        <div className="media-group gap-3 gap-md-4 flex-column flex-lg-row align-items-start align-items-lg-center">
                          <div className="media-text">
                            <div className="h1 text-warning !font-bold">
                              175+
                            </div>
                          </div>
                          <div className="media-text m-0">
                            <h4 className="text-capitalize !text-2xl !text-left !font-bold">
                              Team Members
                            </h4>
                            <p>
                              {" "}
                              The dynamic prowess of our team fuels our journey.{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body !p-[30px]">
                        <div className="media-group gap-3 gap-md-4 flex-column flex-lg-row align-items-start align-items-lg-center">
                          <div className="media-text">
                            <div className="h1 text-danger !font-bold">
                              625+
                            </div>
                          </div>
                          <div className="media-text m-0">
                            <h4 className="text-capitalize !text-2xl !text-left !font-bold">
                              Ongoing Projects
                            </h4>
                            <p>
                              {" "}
                              Diverse initiatives at play, propelling our
                              mission forward.{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body !p-[30px]">
                        <div className="media-group gap-3 gap-md-4 flex-column flex-lg-row align-items-start align-items-lg-center">
                          <div className="media-text">
                            <div className="h1 text-success !font-bold">
                              99%
                            </div>
                          </div>
                          <div className="media-text m-0">
                            <h4 className="text-capitalize !text-2xl !text-left !font-bold">
                              Customer Delight
                            </h4>
                            <p>
                              Our prime concern is ensuring customer happiness.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="nk-section">
              <div className="container">
                <div className="row align-items-lg-end justify-content-lg-between gy-5 ">
                  <div className="col-lg-6">
                    <div className="d-flex flex-column">
                      <div className="nk-frame mb-5">
                        <img src="/images/cover/cover-37.png" alt="cover-bg" />
                      </div>
                      <div className="nk-section-head pb-0 !text-left">
                        <span className="nk-section-subtitle">The journey</span>
                        <h2 className="nk-section-title !text-left !font-bold">
                          Journey Towards Success
                        </h2>
                        <p className="nk-section-text text-left">
                          {" "}
                          Embark on our compelling journey towards success,
                          where dedication, innovation, and resilience converge.
                          With each step, we&apos;ve ventured beyond limits,
                          carving a trail of accomplishments driven by our
                          passion for excellence. Join us as we continue to
                          shape our remarkable narrative, destined for even
                          greater heights.{" "}
                        </p>
                        <ul className="nk-btn-group pt-5">
                          <li>
                            <a href={`/careers`} className="btn btn-primary">
                              Join Our Team
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-5">
                    <div className="d-flex flex-column">
                      <div className="nk-frame mb-5 mb-lg-0 order-lg-2 mt-lg-3">
                        <img src="/images/tm-man-cover-38.png" alt="cover-bg" />
                      </div>
                      <div className="nk-section-head pb-0 !text-left">
                        <span className="nk-section-subtitle !text-left">
                          Behind the story
                        </span>
                        <h2 className="nk-section-title !text-left !font-bold">
                          How Trading Materials
                        </h2>
                        <p className="nk-section-text text-left">
                          {" "}
                          Discover how Trading Materials came to life – born
                          from a passion for trading, driven by the goal to
                          empower traders worldwide. Our journey is marked by
                          dedication, curating a diverse range of resources to
                          fuel success in the trading realm.{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="nk-section">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xxl-6">
                    <div className="nk-section-head text-center ">
                      <span className="nk-section-subtitle !text-left">
                        SHAPING OUR BELIEFS
                      </span>
                      <div>
                        <h2 className="nk-section-title !font-bold">
                          Defining Our Core Principles
                        </h2>
                        <p className="nk-section-text">
                          Innovation, Collaboration, and Excellence: Anchored in
                          these beliefs, we pave the way for outstanding
                          solutions and empower businesses through unwavering
                          commitment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row gy-5">
                  <div className="col-md-6 col-lg-4">
                    <div className="card">
                      <div className="card-body !p-[30px] !text-left">
                        <div className="media media-lg media-middle media-circle text-bg-primary-soft mb-4 ">
                          <em className="icon ni ni-file-text-fill !text-left"></em>
                        </div>
                        <h5 className="!font-bold !text-left !text-xl">
                          Outcomes That Count
                        </h5>
                        <p className="text line-clamp-2 !text-left">
                          At Trading Materials, we stand by the significance of
                          results. We&apos;re dedicated to achieving concrete
                          outcomes and measurable impact for our clients.{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card">
                      <div className="card-body !p-[30px] !text-left">
                        <div className="media media-lg media-middle media-circle text-bg-info-soft mb-4">
                          <em className="icon ni ni-gift"></em>
                        </div>
                        <h5 className="!font-bold !text-left !text-xl">
                          Devotion
                        </h5>
                        <p className="text line-clamp-2 !text-left">
                          Devotion remains integral to our ethos at Trading
                          Materials. Our pledge revolves around delivering
                          exceptional service.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card">
                      <div className="card-body !p-[30px] !text-left">
                        <div className="media media-lg media-middle media-circle text-bg-warning-soft mb-4">
                          <em className="icon ni ni-growth-fill"></em>
                        </div>
                        <h5 className="!font-bold !text-left !text-xl">
                          Advancement
                        </h5>
                        <p className="text line-clamp-2 !text-left">
                          Advancement is deeply rooted in Trading Materials
                          values. We embrace constant learning, enhancement, and
                          broadening our capabilities.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card">
                      <div className="card-body !p-[30px] !text-left">
                        <div className="media media-lg media-middle media-circle text-bg-danger-soft mb-4">
                          <em className="icon ni ni-users-fill"></em>
                        </div>
                        <h5 className="!font-bold !text-left !text-xl">
                          Collaboration
                        </h5>
                        <p className="text line-clamp-2">
                          Collaboration is a cornerstone at Trading Materials.
                          We emphasize the potency of teamwork and the
                          harmonious synergy that collective effort brings.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card">
                      <div className="card-body !p-[30px] !text-left">
                        <div className="media media-lg media-middle media-circle text-bg-primary-soft mb-4">
                          <em className="icon ni ni-bulb-fill"></em>
                        </div>
                        <h5 className="!font-bold !text-left !text-xl">
                          Ingenuity
                        </h5>
                        <p className="text line-clamp-2">
                          Ingenuity pulses through the veins of Trading
                          Materials. We&apos;re relentless in our pursuit of
                          pushing limits and questioning the status quo.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card">
                      <div className="card-body !p-[30px] !text-left">
                        <div className="media media-lg media-middle media-circle text-bg-success-soft mb-4">
                          <em className="icon ni ni-flag-fill"></em>
                        </div>
                        <h5 className="!font-bold !text-left !text-xl">
                          Responsibility
                        </h5>
                        <p className="text line-clamp-2">
                          Responsibility is foundational at Trading Materials.
                          We firmly believe in taking ownership and being
                          accountable.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="nk-section">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xxl-6">
                    <div className="nk-section-head text-center">
                      <span className="nk-section-subtitle">
                        UNVEILING OUR TEAM
                      </span>
                      <h2 className="nk-section-title !font-bold">
                        Meet The Minds Shaping Trading Materials
                      </h2>
                      <p className="nk-section-text">
                        Get acquainted with the Committed Team Powering Trading
                        Materials, diligently striving to provide you with an
                        exceptional experience.
                      </p>
                      <ul className="nk-btn-group justify-content-center pt-5">
                        <li>
                          <a href={`/careers`} className="btn btn-primary btn-lg">
                            Join Our Team
                          </a>
                        </li>
                        <li>
                          <a
                            href={`${userLang}/contact`}
                            className="btn btn-outline-primary btn-lg"
                          >
                            Learn More
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row gy-5">
                  <div className="col-md-6 col-lg-4">
                    <div className="card border-0 bg-blue-300">
                      <div className="card-body !pb-0">
                        <div className="card-title-group align-items-start mb-4">
                          <div className="card-title-group-item !text-left">
                            <h4 className="text-capitalize mb-1 !font-bold text-2xl">
                              John Carter
                            </h4>
                            <p className="fs-16">CEO &amp; Founder</p>
                          </div>
                          <div className="card-title-group-item">
                            <a href="#" className="text-dark">
                              <em className="icon icon-lg ni ni-fedora"></em>
                            </a>
                          </div>
                        </div>
                        <div className="card-image text-center">
                          <img src="/images/team/tm-team-pic-01.png" alt="team" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card border-0 bg-green-50">
                      <div className="card-body  !pb-0">
                        <div className="card-title-group align-items-start mb-4">
                          <div className="card-title-group-item !text-left">
                            <h4 className="text-capitalize mb-1 !font-bold text-2xl">
                              Sophie Moor
                            </h4>
                            <p className="fs-16"> Manager Of XYZ</p>
                          </div>
                          <div className="card-title-group-item">
                            <a href="#" className="text-dark">
                              <em className="icon icon-lg ni ni-b-si"></em>
                            </a>
                          </div>
                        </div>
                        <div className="card-image text-center">
                          <img src="/images/team/b.png" alt="team" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card border-0 bg-yellow-50">
                      <div className="card-body  !pb-0">
                        <div className="card-title-group align-items-start mb-4">
                          <div className="card-title-group-item !text-left">
                            <h4 className="text-capitalize mb-1 !font-bold text-2xl">
                              Sam Houston
                            </h4>
                            <p className="fs-16">VP of Development</p>
                          </div>
                          <div className="card-title-group-item">
                            <a href="#" className="text-dark">
                              <em className="icon icon-lg ni ni-linkedin-round"></em>
                            </a>
                          </div>
                        </div>
                        <div className="card-image text-center">
                          <img src="/images/team/tm-team-pic-03.png" alt="team" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <section className="nk-section">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xxl-6">
                    <div className="nk-section-head text-center">
                      <span className="nk-section-subtitle">PRESS & MEDIA</span>
                      <h2 className="nk-section-title !font-bold">
                      Trading Materials In The News
                      </h2>
                      <p className="nk-section-text">
                      Catch Up on the Recent Developments and News Surrounding Trading Materials, Showcased Across Leading Publications and Media Platforms.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row gap g-3 justify-content-xl-center">
                  <div className="col-6 col-sm-4 col-lg-3 col-xl-2">
                    <a
                      href="#"
                      className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100"
                    >
                      <img
                        src="/images/brands/a.png"
                        alt="brand"
                        className="img-fluid"
                      />
                    </a>
                  </div>
                  <div className="col-6 col-sm-4 col-lg-3 col-xl-2">
                    <a
                      href="#"
                      className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100"
                    >
                      <img
                        src="/images/brands/b.png"
                        alt="brand"
                        className="img-fluid"
                      />
                    </a>
                  </div>
                  <div className="col-6 col-sm-4 col-lg-3 col-xl-2">
                    <a
                      href="#"
                      className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100"
                    >
                      <img
                        src="/images/brands/c.png"
                        alt="brand"
                        className="img-fluid"
                      />
                    </a>
                  </div>
                  <div className="col-6 col-sm-4 col-lg-3 col-xl-2">
                    <a
                      href="#"
                      className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100"
                    >
                      <img
                        src="/images/brands/d.png"
                        alt="brand"
                        className="img-fluid"
                      />
                    </a>
                  </div>
                  <div className="col-6 col-sm-4 col-lg-3 col-xl-2">
                    <a
                      href="#"
                      className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100"
                      data-aos="fade-up"
                      data-aos-delay="250"
                    >
                      <img
                        src="/images/brands/e.png"
                        alt="brand"
                        className="img-fluid"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </section> */}
            <section className="nk-section">
              <div className="nk-mask blur-1 right center"></div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xxl-6">
                    <div className="nk-section-head text-center">
                      <span className="nk-section-subtitle">
                        Press &amp; Media
                      </span>
                      <h2 className="nk-section-title !font-bold">
                        Trading Materials In The News
                      </h2>
                      <p className="nk-section-text">
                        Catch Up on the Recent Developments and News Surrounding
                        Trading Materials, Showcased Across Leading Publications
                        and Media Platforms.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row gy-5">
                  <div className="col-lg-6">
                    <div className="card card-gutter-lg bg-primary is-theme h-100">
                      <div className="card-body !p-[30px] p-5 p-md-7">
                        <div className="card-content h-100 d-flex flex-column justify-content-between">
                          <div className="card-image mb-3">
                            <a href="#">
                              <img
                                src="/images/brands/a-light.png"
                                alt="brand"
                                className="h-24px"
                              />
                            </a>
                          </div>
                          <h3 className="card-title text-capitalize !font-bold text-3xl !text-left !leading-relaxed ">
                            Trading Materials Raises $84M In Series C Funding
                          </h3>
                          <p className="text-left">
                            {" "}
                            Trading Materials, a rapidly growing technology
                            company, recently announced the successful
                            completion of its Series C funding round, securing a
                            substantial investment of $84 million. <br />
                            <br /> The funding will be utilized to further
                            enhance and expand Trading Materials products and
                            services, solidifying its position as a market
                            leader in the industry. The significant investment
                            highlights the confidence and support from investors
                            in Trading Materials vision and potential for
                            continued success.{" "}
                          </p>
                          <br />
                          <div className="text-left">
                            <a href="#" className="btn-link">
                              <span>Read More</span>
                              <em className="icon ni ni-arrow-right"></em>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="row gy-5">
                      <div className="col-12">
                        <div className="card card-gutter-md bg-blue-1400 is-theme">
                          <div className="card-body !p-[30px] p-5">
                            <div className="card-content">
                              <div className="card-image mb-3 mb-md-5 brand">
                                <a href="#">
                                  <img
                                    src="/images/brands/b.png"
                                    alt="brand"
                                    className="h-24px"
                                  />
                                </a>
                              </div>
                              <h4 className="card-title text-capitalize mb-3 mb-md-5 !font-bold text-2xl !text-left !leading-relaxed">
                                <a href="/about">
                                Trading Materials Claims To Be The #1 Player In The Analytics Industry
                                </a>
                              </h4>
                              <div className="text-left">
                                <a href="#" className="btn-link">
                                  <span>Read More</span>
                                  <em className="icon ni ni-arrow-right"></em>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="card card-gutter-md bg-dark is-theme">
                          <div className="card-body !p-[30px] p-5">
                            <div className="card-content">
                              <div className="card-image mb-3 mb-md-5 brand">
                                <a href="#">
                                  <img
                                    src="/images/brands/c.png"
                                    alt="brand"
                                    className="h-24px"
                                  />
                                </a>
                              </div>
                              <h4 className="card-title text-capitalize mb-3 mb-md-5 !font-bold text-2xl !text-left !leading-relaxed">
                                <a href="/about">
                                Trading Materials CEO Steps-Back, New CEO Comes In September After The Board Decisions
                                </a>
                              </h4>
                              <div className="text-left">
                                <a href="#" className="btn-link">
                                  <span>Read More</span>
                                  <em className="icon ni ni-arrow-right"></em>
                                </a>
                              </div>
                            </div>
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
