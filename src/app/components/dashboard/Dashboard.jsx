/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";
import Header from "../header/header";
// import { FaBoxOpen, FaWindowClose } from "react-icons/fa";
// import { TbTruckDelivery } from "react-icons/tb";
// import { BsArrowLeftRight } from "react-icons/bs";
// import {MdOutlinePendingActions} from "react-icons/md"
import "../dashboard/dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../footer/footer";
import { Avatar, Divider } from "@mui/material";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
export default function Dashboard() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.login?.value);
  const userData = useSelector((state) => state?.user?.value);
  console.log(userData);
  const [userIp, setUserIp] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [orders, setOrders] = useState();

  useEffect(() => {
    if (!localStorage.getItem("client_token")) {
      window.location.href = "/login";
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
  }, []);

  // useEffect(()=>{
  //   if(!isLoggedIn){
  //     window.location.href="/login"
  //   }
  // },[isLoggedIn])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(showLoader());
        const token = localStorage.getItem("client_token");
        console.log(token);
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/client/product/checkout/order-list?client_id=${userData?.client?.id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response?.data?.status) {
          console.log(response?.data);

          const data = response?.data?.data?.order;
          // Sort the array in descending order based on 'created_at'
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          setOrders(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoader());
      }
    };
    fetchOrders();
  }, [userData]);

  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <div className="nk-app-root">
        <Header />

        <main className="nk-pages mt-10 sm:mt-40 md:mt-[6rem]">
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
                      {userData == {} && (
                        <p className="!font-bold text-xl">No Data Found</p>
                      )}
                      {userData != {} && (
                        <div>
                          <div className="flex justify-center mb-3">
                            {userData?.client?.profile?.profile_image?.length >
                            0 ? (
                              <Avatar
                                alt="user profile"
                                src={userData?.client?.profile?.profile_image}
                                sx={{ width: "60%", height: "70%" }}
                                className=""
                              ></Avatar>
                            ) : (
                              <Avatar
                                alt="user profile"
                                src="/images/blueProfile.webp"
                                sx={{ width: "50%", height: "100%" }}
                                className=""
                              ></Avatar>
                            )}
                          </div>
                          <h4 className="truncate">
                            {userData?.client?.first_name}{" "}
                            {userData?.client?.last_name}
                          </h4>
                          <h5 className="truncate">
                            {userData?.client?.email}
                          </h5>
                          <p>{userData?.client?.phone}</p>
                          <Divider className="!mt-[1rem] !mb-[1rem]" />
                        </div>
                      )}
                    </div>
                    <div class="last-login justify-content-center ">
                      <h4>
                        Last Login:{" "}
                        <span>
                          {new Date().toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </h4>
                      <h4>
                        IP Address: <span>{userIp}</span>
                      </h4>
                      <hr className="mt-[1rem] mb-[1rem]" />
                    </div>
                    {/* <div class="activitys">
                    <h3>Activity</h3>

                    {orders ?.map((order,ind)=>{
                      if(new Date(order?.created_at).getMonth === new Date()?.getMonth){
                        return(
                        <div key={ind} className="">
                         {ind != 0 && <div class="act-col"><span class="vl"></span></div>}
                          <div class="act-col">
                      <div class="left-c"><span>Order Placed:</span></div>
                      <div class="right-c"><span>{new Date(order?.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
                    </div>
                    <div class="act-col">
                      <div class="left-c">
                        <span
                          >Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.</span
                        >
                      </div>
                      <div class="right-c"><span>29 Aug 2023</span></div>
                    </div>
                    
                        </div>)
                      }

                    })}

                  </div>
                  <div></div>
                  < hr className="mt-[1rem] mb-[1rem]" />
                  <div class="last-months">
                    <h3>Last Month</h3>
                    {orders ?.map((order,ind)=>{
                      if(new Date(order?.created_at).getMonth != new Date()?.getMonth){
                        return(
                          <div key={ind} className="">
                          {ind != 0 && <div class="act-col"><span class="vl"></span></div>}
                           <div class="act-col">
                       <div class="left-c"><span>Order Placed:</span></div>
                       <div class="right-c"><span>{new Date(order?.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
                     </div>
                     <div class="act-col">
                       <div class="left-c">
                         <span
                           >Lorem ipsum dolor sit amet, consectetur adipiscing
                           elit.</span
                         >
                       </div>
                       <div class="right-c"><span>29 Aug 2023</span></div>
                     </div>
                     
                         </div>)
                      }

                    })}
                    
                  </div> */}
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
                      <div
                        class="card-rs  !mt-0 group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200"
                        onClick={() => navigate("/view-order/unpaid")}
                      >
                        <div class="card-content flex-column justify-content-between  g-5">
                          <div class="d-flex !items-center gap-2 group-hover:!text-blue-600">
                            <div className="!flex justify-en w-full !items-center">
                              {/* <MdOutlinePendingActions className="w-fit h-[30px]"/> */}
                              <img
                                className="flex !rounded-none !w-[30px] !h-auto"
                                src="/images/orders/unpaid.png"
                              />
                              <h3 className="gap-2 !m-0 !text-left !relative group-hover:!text-blue-600 !font-bold">
                                Pending Orders
                              </h3>
                            </div>

                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">
                                {userData?.client?.order_pending}
                              </span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">
                              {new Date().toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="col-md-6 col-xl-3  !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div
                        class="card-rs mt-0 mb-5 group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200"
                        onClick={() => navigate("/view-order/placed")}
                      >
                        <div class="card-content flex-column justify-content-between  g-5">
                          <div class="d-flex items-center gap-2 group-hover:!text-blue-600">
                            <div className="!flex justify-en w-full">
                              {/* <FaBoxes className="w-fit h-[30px]"/> */}
                              <img
                                className="flex !rounded-none !w-[30px] !h-auto"
                                src="/images/orders/placed.png"
                                alt="placed"
                              />
                              <h3 className="group-hover:!text-blue-600 !m-0 !relative !font-bold">
                                Order Placed
                              </h3>
                            </div>
                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">
                                {userData?.client?.order_placed}
                              </span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">
                              {new Date().toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-md-6 col-xl-3   !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div
                        class="card-rs mt-0 mb-5 group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200"
                        onClick={() => navigate("/view-order/confirmed")}
                      >
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex justify-star w-full">
                              {/* <BsFillFileEarmarkCheckFill className="w-fit h-[30px]"/> */}
                              <h3 className=" group-hover:!text-blue-600 !text-start !w-[85%] !m-0 !relative !font-bold">
                                Order Confirmed
                              </h3>
                              <img
                                className="flex !rounded-none !w-[30px] !h-auto"
                                src="/images/orders/confirmed.png"
                                alt="order_confirmed"
                              />
                            </div>

                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">
                                {userData?.client?.order_confirmed}
                              </span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">
                              {new Date().toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-md-6 col-xl-3   !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div
                        class="card-rs mt-0 mb-5 group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200"
                        onClick={() => navigate("/view-order/dispatched")}
                      >
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex justify-en w-full">
                              <div className="flex justify-en w-full">
                                {/* <TbTruckDelivery className="w-fit h-[30px] "/> */}
                                <img
                                  src="/images/orders/dispatched.png"
                                  alt="order-dispatched"
                                  className="flex !rounded-none !w-[30px] !h-auto"
                                />
                                <h3 className="group-hover:!text-blue-600 !m-0 !relative !font-bold">
                                  Order Dispatched
                                </h3>
                              </div>
                            </div>

                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">
                                {userData?.client?.order_dispatched}
                              </span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">
                              {new Date().toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
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
                      <div
                        class="card-rs mt-0 mb-5 group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200"
                        onClick={() => navigate("/view-order/delivered")}
                      >
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex w-full">
                              {/* <FaBoxOpen className="w-fit h-[30px] flex justify-end"/> */}
                              <h3 className="group-hover:!text-blue-600 !m-0 !text-left !relative !font-bold">
                                Order Completed
                              </h3>

                              <img
                                className="flex !rounded-none !w-[30px] !h-auto"
                                src="/images/orders/delivered.png"
                                alt="order_delivered"
                              />
                            </div>

                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">
                                {userData?.client?.order_completed}
                              </span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">
                              {new Date().toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-md-6 col-xl-4   !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div
                        class="card-rs mt-0 mb-5 group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200"
                        onClick={() => navigate("/view-order/cancelled")}
                      >
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex w-full">
                              {/* <FaWindowClose className="w-fit h-[30px]"/> */}
                              <img
                                className="flex !rounded-none !w-[30px] !h-auto"
                                src="/images/orders/cancelled.png"
                                alt="order_cancelled"
                              />
                              <h3 className="group-hover:!text-blue-600 !m-0 !relative !font-bold">
                                Order Cancelled
                              </h3>
                            </div>

                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">
                                {userData?.client?.order_cancelled}
                              </span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">
                              {new Date().toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-md-6 col-xl-4   !pl-[0px] !pr-[0px]"
                      data-aos="fade-up"
                      data-aos-delay="150"
                    >
                      <div
                        class="card-rs mt-0 mb-5 group cursor-pointer !border hover:drop-shadow-lg hover:shadow-lg hover:border-blue-200"
                        onClick={() => navigate("/view-order/returned")}
                      >
                        <div class="card-content flex-column justify-content-between g-5">
                          <div class="d-flex align-items-center gap-2 group-hover:!text-blue-600">
                            <div className="flex w-full">
                              {/* <BsArrowLeftRight className="w-fit h-[30px]"/> */}
                              <img
                                className="flex !rounded-none !w-[30px] !h-auto"
                                src="/images/orders/returned.png"
                                alt="orders_returned"
                              />
                              <h3 className="group-hover:!text-blue-600 !m-0 !relative !font-bold">
                                Order Returned
                              </h3>
                            </div>

                            <h4>
                              <span className="group-hover:!text-blue-600 group-hover:!font-bold">
                                {userData?.client?.order_returned}
                              </span>
                            </h4>
                            <p className="group-hover:!text-blue-600 group-hover:!font-bold">
                              {new Date().toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
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
                    <a
                      href={`https://tradingmaterials.com/contact`}
                      className="btn btn-white fw-semiBold"
                    >
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
