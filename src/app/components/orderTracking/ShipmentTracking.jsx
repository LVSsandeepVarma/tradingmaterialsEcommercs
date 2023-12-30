import { Card, CardContent, Divider } from "@mui/material";
import { useSelector } from "react-redux";
// import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import React from "react";
import OrderTimeline from "./OrderTimeline";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaBox, FaTruckArrowRight } from "react-icons/fa6";
import EmojiRating from "./EmojiRating";
import Footer from "../footer/footer";
// swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import moment from "moment";


export default function ShipmentTracking() {
    const loaderState = useSelector((state) => state.loader?.value);
    // const params = useParams()

  // const decryptedDataString = CryptoJS.AES.decrypt(
  //   params?.awd.replace(/_/g, "/").replace(/-/g, "+"),
  //   "awd_no"
  // ).toString(CryptoJS.enc.Utf8);
  const ordDataString = sessionStorage.getItem("ordData");
  const orderData = JSON.parse(ordDataString);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    console.log(orderData, "data");
  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <div className="nk-body-root gradient-bg bg-fixed min-h-screen ">
        <div className="flex justify-between items-center p-2 !w-full">
          <img
            className="cursor-pointer"
            onClick={() => (window.location.href = "/")}
            src="/images/tm-logo-1.webp"
            alt="trading_materials_logo"
          />
        </div>
        <div className="row container mx-auto mt-2">
          {/* tracking details */}
          <div className="col-md-6">
            <Card className="rounded-lg">
              <CardContent>
                <div className="flex justify-between items-center fadein">
                  <span className="font-semibold text-xs text-slate-600">
                    {orderData?.timeline?.timeline?.shipment_status ==
                    "DELIVERED"
                      ? "Delivered On"
                      : "Last Updated On"}
                  </span>
                  <FaTruckArrowRight size={24} />
                </div>
                <div className="text-start fadein">
                  <p className="font-bold text-lg">
                    {
                      days[
                        new Date(
                          orderData?.timeline?.timeline?.current_timestamp
                        ).getDay()
                      ]
                    }
                  </p>
                  <span className="text-xs font-semibold">
                    {moment(
                      orderData?.timeline?.timeline?.current_timestamp,
                      "DD MM YYYY HH:mm"
                    ).format("MMMM")}
                  </span>
                  <p className="flex items-end">
                    <p className="font-bold text-8xl !py-0 !my-0 !text-blue-600">
                      {moment(
                        orderData?.timeline?.timeline?.current_timestamp,
                        "DD MM YYYY HH:mm"
                      ).format("DD")}
                    </p>
                    <span>
                      {moment(
                        orderData?.timeline?.timeline?.current_timestamp,
                        "DD MM YYYY HH:mm"
                      ).format("YYYY")}
                    </span>
                  </p>
                  <p>Status: </p>
                  <p className="!text-green-600 font-semibold flex gap-1 items-center text-2xl">
                    {orderData?.timeline?.timeline?.shipment_status ==
                    "DELIVERED" ? (
                      <FaRegCheckCircle />
                    ) : (
                      ""
                    )}
                    {orderData?.timeline?.timeline?.shipment_status}
                  </p>
                </div>
                <Divider className="my-2" />
                <>
                  <div className="flex justify-between items-center fadein">
                    <div className="flex justify-start items-center ">
                      <img
                        alt="courier_icon"
                        src="/images/courier/courier.jpg"
                        className="w-25 h-auto"
                      />
                      <p>{orderData?.timeline?.timeline?.courier_name}</p>
                    </div>
                    <div className=" w-full text-end">
                      <p className="text-sm font-semibold text-gray-800">
                        AWB No
                      </p>
                      <span className="text-sm !text-blue-600 font-bold">
                        {orderData?.timeline?.awb_no}
                      </span>
                    </div>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto fadein">
                    <OrderTimeline timeline={orderData} />
                  </div>
                </>
              </CardContent>
            </Card>
          </div>
          {/* order details and customer review */}
          <div className="col-md-6">
            <>
              <Card className="mt-4 md:!mt-auto ">
                <CardContent>
                  <>
                    <div className="flex gap-2 items-center fadein">
                      <FaBox />
                      <span className="font-semibold">Order Details</span>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between ">
                      <span className="text-sm text-secondary">Order ID</span>
                      <span className="text-sm font-semibold text-secondary">
                        {orderData?.timeline?.order_id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">
                        Order Placed On
                      </span>
                      <span className="text-sm font-semibold text-secondary">
                        {new Date(
                          orderData?.timeline?.created_at
                        ).toLocaleDateString("en", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary ">
                        Shipping address
                      </span>
                      <p className="text-sm font-semibold text-secondary max-w-[50%] float-right text-end">
                        <span>{orderData?.order?.shipping_address}</span>
                        <br />
                        <span>{orderData?.order?.shipping_address_2}</span>
                        <br />
                        <span>
                          {orderData?.order?.shipping_city},{" "}
                          {orderData?.order?.shipping_state}
                        </span>
                        <br />
                        <span>
                          {orderData?.order?.shipping_country},{" "}
                          {orderData?.order?.shipping_pincode}
                        </span>
                      </p>
                    </div>
                  </>
                </CardContent>
              </Card>
              <Card className="my-4">
                <Swiper
                  effect={"cards"}
                  grabCursor={true}
                  modules={[EffectCards]}
                  className="mySwiper"
                >
                  <SwiperSlide className="bg-white">
                    <CardContent data-aos="fade-up">
                      <>
                        <div>
                          <p className="text-lg font-normal mb-1 truncate max-w-[450px] md:max-w-[550px]">
                            <b>Review</b> {orderData?.order?.product?.name}
                          </p>
                        </div>
                        <EmojiRating orderDetails={orderData} />
                      </>
                    </CardContent>
                  </SwiperSlide>
                </Swiper>
              </Card>
            </>
          </div>
        </div>
        {/* </div> */}
        <section className="nk-section nk-cta-section nk-section-content-1 ">
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
                        Get in touch with our support team if you still can’t
                        find your answer.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                  <a href={`/contact`} className="btn btn-white fw-semiBold">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
