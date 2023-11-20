/* eslint-disable react/no-unknown-property */
import React from "react";
import Header from "../header/header";
import { FaBoxOpen, FaBoxes, FaWindowClose } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { BsArrowLeftRight, BsFillFileEarmarkCheckFill } from "react-icons/bs";
import {MdOutlinePendingActions} from "react-icons/md"
import "../dashboard/dashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../footer/footer";
import { Avatar, Divider } from "@mui/material";
export default function Dashboard() {
  const userData = useSelector((state) => state?.user?.value);
  console.log(userData);
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <div className="nk-app-root">
        <Header />

        <main className="nk-pages mt-20 sm:mt-60 md:mt-40">
          <section className="nk-section ">
            <div className="nk-mask blur-1 left center"></div>
            <div className="container">
              <div class="row gy-5 gy-xl-0">
                <div
                  class="col-md-6 col-xl-3 justify-content-center"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <div class="left-side-bar">
                    <div class="profiles  drop-shadow-lg justify-content-center">
                    <div className="flex justify-center mb-3">
                    {userData?.client?.profile?.profile_image?.length > 0 ? (
                      <Avatar
                      alt="user profile"
                      src={userData?.client?.profile?.profile_image}
                      sx={{ width: "60%", height: "70%" }}
                      className=""
                    ></Avatar>
                    ) : (
                      <Avatar
                        alt="user profile"
                        src="/images/blueProfile.png"
                        sx={{ width: "50%", height: "100%" }}
                        className=""
                      ></Avatar>
                    )}
                    </div>
                      <h4 className="">{userData?.client?.first_name} {userData?.client?.last_name}</h4>
                      <h5>{userData?.client?.email}</h5>
                      <p>{userData?.client?.phone}</p>
                      <Divider />
                    </div>
                  </div>
                </div>
                <div
                  class="col-md-6 col-xl-9"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >

                  <div class="row">
                  <div
                      class="col-md-6 col-xl-3  !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div class="card-rs  group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200" onClick={()=>navigate("/view-order/unpaid")}>
                        <div class="card-content flex-column justify-content-between  g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="!flex justify-end w-full">
                              <MdOutlinePendingActions className="w-fit h-[30px]"/>
                            </div>
                            <h3 className="group-hover:!text-blue-600 !font-bold">Pending Orders</h3>
                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">{userData?.client?.order_pending}</span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="col-md-6 col-xl-3  !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div class="card-rs  group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200" onClick={()=>navigate("/view-order/placed")}>
                        <div class="card-content flex-column justify-content-between  g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="!flex justify-end w-full">
                              <FaBoxes className="w-fit h-[30px]"/>
                            </div>
                            <h3 className="group-hover:!text-blue-600 !font-bold">Order Placed</h3>
                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">{userData?.client?.order_placed}</span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-md-6 col-xl-3   !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div class="card-rs group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200" onClick={()=>navigate("/view-order/confirmed")}>
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex justify-end w-full">
                              <BsFillFileEarmarkCheckFill className="w-fit h-[30px]"/>
                            </div>
                            <h3 className="group-hover:!text-blue-600 !font-bold">Order Confirmed</h3>
                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">{userData?.client?.order_confirmed}</span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-md-6 col-xl-3   !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div class="card-rs group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200" onClick={()=>navigate("/view-order/dispatched")}>
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex justify-end w-full">
                              <div className="">
                              <TbTruckDelivery className="w-fit h-[30px] "/>
                              </div>
                              
                            </div>
                            <h3 className="group-hover:!text-blue-600 !font-bold">Order Dispatched</h3>
                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">{userData?.client?.order_dispatched}</span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div
                      class="col-md-6 col-xl-4   !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div class="card-rs group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200" onClick={()=>navigate("/view-order/delivered")}>
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex justify-end w-full">
                              <FaBoxOpen className="w-fit h-[30px] flex justify-end"/>
                            </div>
                            <h3 className="group-hover:!text-blue-600 !font-bold">Order Completed</h3>
                            <h4>
                             <span className="group-hover:!text-blue-600 group-hover:!font-bold">{userData?.client?.order_completed}</span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-md-6 col-xl-4   !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div class="card-rs group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200" onClick={()=>navigate("/view-order/cancelled")}>
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex justify-end w-full">
                              <FaWindowClose className="w-fit h-[30px]"/>
                            </div>
                            <h3 className="group-hover:!text-blue-600 !font-bold">Order Cancelled</h3>
                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">{userData?.client?.order_cancelled}</span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-md-6 col-xl-4   !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div class="card-rs group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200" onClick={()=>navigate("/view-order/returned")}>
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex justify-end w-full">
                             <BsArrowLeftRight className="w-fit h-[30px]"/>
                            </div>
                            <h3 className="group-hover:!text-blue-600 !font-bold">Order Returned</h3>
                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">{userData?.client?.order_returned}</span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
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
              <div
                className="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div
                  className="row g-gs align-items-center"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="col-lg-8">
                    <div className="media-group flex-column flex-lg-row align-items-center">
                      <div className="media media-lg media-circle media-middle text-bg-white text-primary mb-2 mb-lg-0 me-lg-2">
                        <em className="icon ni ni-chat-fill"></em>
                      </div>
                      <div className="text-center text-lg-start">
                        <h3 className="text-capitalize m-0 !text-3xl !font-bold">
                          {t("Chat_With_Our_Support_Team")}
                        </h3>
                        <p className="fs-16 opacity-75 !text-lg mt-1">
                          {t("chat_team_desc")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 text-center text-lg-end">
                    <a href={`/contact`} className="btn btn-white fw-semiBold">
                      {t("Contact_support")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
