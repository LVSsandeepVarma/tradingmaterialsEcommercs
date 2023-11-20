/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";
import Header from "../header/header";
import "../dashboard/dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../footer/footer";
import { Accordion } from "react-bootstrap";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
export default function Payments() {
  const userData = useSelector((state) => state?.user?.value);
  const [paymentsData, stePaymentsData] = useState()
  console.log(userData);
    const dispatch = useDispatch()
    const fetchPaymentData = async()=>{
        try{
            dispatch(showLoader())
            const response = await axios.get("https://admin.tradingmaterials.com/api/client/get-payments", {
                headers: {
                  Authorization: `Bearer ` + localStorage.getItem("client_token"),
                  Accept: "application/json",
                },
              })
            if(response?.data?.status){
                console.log(response?.data)
                stePaymentsData(response?.data?.data?.payments)
                console.log(paymentsData)
            }
        }catch(err){console.log(err)}finally{dispatch(hideLoader())}
    }

  useEffect(()=>{
    fetchPaymentData()
  },[])


  return (
    <>
      <div className="nk-app-root">
        <Header />

        <main className="nk-pages ">
        <section className="pt-100">
          <div className="container">
            <div className="row flex items-center">
              <div className="col-lg-12 sbreadcrumb">
                <div className="row flex items-center">
                  <div className="col-lg-6 lcard text-left">
                    <div className="flex  items-center gap-3 mb-3">
                    {userData?.client?.profile?.profile_image?.length > 0 ? (
                      <img src={userData?.client?.profile?.profile_image} alt="profile-pic" />
                    ) : (
                      <img src="/images/blueProfile.png" alt="profile-pic" />
                    )}
                      <div>
                        <span>
                        <strong>{userData?.client?.first_name} {userData?.client?.last_name}</strong>
                      </span>
                      <div>
                      <span className="s-color"> {userData?.client?.email}</span>
                      </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 rcard">
                    <div className="">
                      <button
                        type="button"
                        className="btn btn-light btn-sm shadow me-2 rounded custom-btn"
                        name="button"
                      >
                        <i className="fa-solid fa-file-invoice me-1"></i>{" "}
                        Message
                      </button>
                      <button
                        type="button"
                        className="btn btn-light btn-sm shadow me-2 rounded custom-btn"
                        name="button"
                      >
                        <i className="fa-solid fa-file-invoice me-1"></i>{" "}
                        Setting
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
          <section className="nk-section pt-20">
            <div className="nk-mask blur-1 left center"></div>
            <div className="container">
              <div className="row">
                <div className="col-lg-8">
                  <div className="card" data-aos="fade-up">
                    <div className="card-header px-3 py-1">
                      <h5 className="text-muted">
                        Your Payments{" "}
                        <span className="badge bg-primary ms-2">{paymentsData?.length}</span>{" "}
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12">
                          {paymentsData?.length > 0 && <Accordion
                          defaultActiveKey="0"
                            className="panel-group"
                            id="accordion"
                            role="tab"
                            aria-multiselectable="true"
                          >
                            {paymentsData?.map((payment,ind)=>(
                            <Accordion.Item key={ind} className={`panelone panel-default `} eventKey={`${ind}`}>
                              <Accordion.Header
                                className={`${payment?.status == "1" ? "panel-headingone": payment?.status == "0" ? "paymentPending" : "panel-heading"} !p-0 !m-0`}
                                id="headingOne"
                              >
                                <h4 className="panel-title !p-0 !m-0">
                                  <a
                                    className="collapsed "
                                    role="button"
                                    data-toggle="collapse"
                                    data-parent="#accordion"
                                    // href="#collapseOne"
                                    aria-expanded="false"
                                    aria-controls="collapseOne"
                                  >
                                    {payment?.order?.order_number}
                                    <span></span>
                                  </a>
                                </h4>
                              </Accordion.Header>
                              <Accordion.Body>
                              <div
                                id="collapseOne"
                                className=""
                                
                              >
                                <div className="panel-bodyone">
                                  <div className="acc-content">
                                    {payment?.transaction_id != null && <p className="desc">
                                      Transaction Id: <span>{payment?.transaction_id}</span>
                                    </p>}
                                    <p className="desc">
                                      Order No: <span>{payment?.order_id}</span>
                                    </p>
                                    <p className="desc">
                                      Total Amount: <span>{payment?.total_amount}</span>
                                    </p>
                                    <p className="desc">
                                      Paid Amount: <span>{payment?.paid_amount}</span>
                                    </p>
                                    <p className="desc">
                                      Payment Staus:{" "}
                                      <span className={`${payment?.status == "1" ? "sucess-color" : payment?.status == "0" ? "!text-blue-600 !font-bold" : "!text-red-600 font-bold"}`}>{payment?.payment_status == null ? "Pending" : payment?.payment_status}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              </Accordion.Body>
                            </Accordion.Item>
                            ))}
                          </Accordion>}
                          {paymentsData?.length == 0 && <p className="text-center w-full font-bold text-lg">No Payments Found</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4"></div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
