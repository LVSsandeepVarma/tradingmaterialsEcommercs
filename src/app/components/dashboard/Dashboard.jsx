/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";
import Header from "../header/header";
// import { FaBoxOpen, FaWindowClose } from "react-icons/fa";
// import { TbTruckDelivery } from "react-icons/tb";
// import { BsArrowLeftRight } from "react-icons/bs";
// import {MdOutlinePendingActions} from "react-icons/md"
import "../dashboard/dashboard.css";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../footer/footer";
import { Avatar, Divider } from "@mui/material";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import ShippingAddressModal from "../modals/address";
import { MdOutlineMyLocation } from "react-icons/md";
import ViewOrdersDashboard from "./Orders";
import PaymentDetails from "../payments/PaymentDetails";


export default function Dashboard() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.login?.value);
  const userData = useSelector((state) => state?.user?.value);
  console.log(userData);
  const [showModal, setShowModal] = useState(false);
  const [addressUpdateType, setAddressUpdateType] = useState();
  const [addressData, setAddressData] = useState();
  const [formType, setFormType] = useState("add");
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
        <ShippingAddressModal
          show={showModal}
          onHide={() => setShowModal(false)}
          addressType={addressUpdateType}
          data={addressData}
          type={formType}
        />

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
                    <div className="activitys !max-h-[80%]">
                      <h3 className="!font-bold flex items-center">
                        <IoLocationOutline className="mr-1" />
                        Primary Address :
                      </h3>
                      {userData?.client?.primary_address?.length > 0 ? (
                        <div className=" group  hover:shadow-sm ">
                          <div className="pl-4 group-hover:bg-blue-50">
                            <p className="flex items-center">
                              {/* <IoLocationOutline className="mr-1" /> */}
                              {userData?.client?.primary_address[0]?.add_1},
                            </p>
                            {userData?.client?.primary_address[0]?.add_2 !=
                              null && (
                              <p className="flex items-center">
                                {/* <IoLocationOutline className="mr-1" /> */}
                                {userData?.client?.primary_address[0]?.add_2},
                              </p>
                            )}
                            <p className="flex items-center">
                              {/* <IoLocationOutline className="mr-1" /> */}
                              {userData?.client?.primary_address[0]?.city},
                            </p>
                            <p className="flex items-center">
                              {/* <IoLocationOutline className="mr-1" /> */}
                              {userData?.client?.primary_address[0]?.state},
                            </p>

                            <p className="flex items-center">
                              {userData?.client?.primary_address[0]?.country},
                              {userData?.client?.primary_address[0]?.zip}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p>
                              No Address Found,{" "}
                              <b
                                className="hover:!text-blue-600 cursor-pointer !font-bold"
                                onClick={() => {
                                  setAddressUpdateType("");
                                  setShowModal(true);
                                  setAddressData([]);
                                  setFormType("add");
                                }}
                              >
                                Click here to add
                              </b>
                            </p>
                          </div>
                        </>
                      )}
                      <h3 className="!font-bold flex items-center">
                        <IoLocationOutline className="mr-1" />
                        Secondary Address
                        {/* {userData?.client?.address?.length > 2
                          ? "es"
                          : userData?.client?.address?.length== 2 ? "" : ""} */}
                        :
                      </h3>
                      {userData?.client?.address?.length > 1 ? (
                        <div>
                          {userData?.client?.address?.length > 1 &&
                            userData?.client?.address?.map((address, ind) => (
                              <div
                                key={ind}
                                className=" group  hover:shadow-sm "
                              >
                                <div className="pl-4 group-hover:bg-blue-50">
                                  <p className="flex items-center">
                                    <MdOutlineMyLocation className="mr-1" />
                                    {address?.add_1},
                                  </p>
                                  {address?.add_2 != null && (
                                    <p className="flex items-center">
                                      {/* <IoLocationOutline className="mr-1" /> */}
                                      {address?.add_2},
                                    </p>
                                  )}
                                  <p className="flex items-center">
                                    {/* <IoLocationOutline className="mr-1" /> */}
                                    {address?.city},
                                  </p>
                                  <p className="flex items-center">
                                    {/* <IoLocationOutline className="mr-1" /> */}
                                    {address?.state},
                                  </p>

                                  <p className="flex items-center">
                                    {address?.country},{address?.zip}
                                  </p>
                                  <Divider className="my-2" />
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        // </div>
                        <>
                          <div>
                            <p>
                              No Address Found,{" "}
                              <b
                                className="hover:!text-blue-600 cursor-pointer !font-bold"
                                onClick={() => {
                                  setAddressUpdateType("");
                                  setShowModal(true);
                                  setAddressData([]);
                                  setFormType("add");
                                }}
                              >
                                Click here to add
                              </b>
                            </p>
                          </div>
                        </>
                      )}
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
                    {/* <div
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
                    </div> */}
                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Placed
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_pending +
                                  userData?.client?.order_placed}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/placed.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Confirmed
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_confirmed}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/confirmed.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Dispatched
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_dispatched}
                              </h5>
                            </div>
                            <img
                              src="images/orders/dispatched.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Delivered
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_completed}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/delivered.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Cancelled
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_cancelled}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/cancelled.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="card shadow border-0 px-3 m-[10px]">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center db-cards">
                            <div class="">
                              <h3 class="mb-0 !font-bold text-muted text-[16px]">
                                Order Returned
                              </h3>
                              <h5 class="mb-0 mt-1! text-[16px]  !font-bold text-start text-muted">
                                {userData?.client?.order_confirmed}
                              </h5>
                            </div>
                            <img
                              src="/images/orders/returned.png"
                              alt="profile-pic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-xl-12 ">
                      <h3 className="text-left text-xl !font-bold text-[#6d6d6d]">
                        Your Orders:
                      </h3>
                      <div className="">
                        <ViewOrdersDashboard ordType={"placed"} />
                      </div>
                    </div>
                  </div>
                  {/* payments */}
                  <PaymentDetails/>
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