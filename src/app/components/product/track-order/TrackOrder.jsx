/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { Box, Divider, Chip, CardActionArea, Tooltip } from "@mui/material";
// import CallIcon from "@mui/icons-material/Call";
// import DoneSharpIcon from '@mui/icons-material/DoneSharp';
// import LocalShippingSharpIcon from '@mui/icons-material/LocalShippingSharp';
// import UnarchiveSharpIcon from '@mui/icons-material/UnarchiveSharp';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  hideLoader,
  showLoader,
} from "../../../../features/loader/loaderSlice";
import axios from "axios";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DiscountIcon from "@mui/icons-material/Discount";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import SnoozeIcon from "@mui/icons-material/Snooze";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PendingActionsSharpIcon from "@mui/icons-material/PendingActionsSharp";
import ListAltSharpIcon from "@mui/icons-material/ListAltSharp";
import AssignmentTurnedInSharpIcon from "@mui/icons-material/AssignmentTurnedInSharp";
import CryptoJS from "crypto-js";
import CustomizedSteppers from "./orderTrackerStepper";
import { MdTimeline } from "react-icons/md";
import { FaClock } from "react-icons/fa";

export default function OrderTacker() {
  const [orderData, setOrderData] = useState([]);
  const [orderDetails, setOrderDetails] = useState();
  const [showModal, setShowModal] = useState(false);
  const userLang = useSelector((state) => state?.lang?.value);
  const userData = useSelector((state) => state?.user?.value);
  const loaderState = useSelector((state) => state?.loader?.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const steps = [
    //    "Placed ",
    "Placed",
    "Confirmed",
    "Dispatched",
    "Delivered",
    //   "Delivered",
    //   "Delivered",
  ];

  // const clientId = userData?.client?.id;
  const { order_id } = useParams();
  const descryptedId = CryptoJS.AES.decrypt(
    order_id.replace(/_/g, "/").replace(/-/g, "+"),
    "trading_materials"
  ).toString(CryptoJS.enc.Utf8);

  useEffect(() => {
    if (!params?.order_id) {
      setShowModal(true);
    }
  }, []);

  //fetching order details
  // https://admin.tradingmaterials.com/api/client/product/checkout/view-order?id=${descryptedId}&client_id=${clientId}
  const fetchOrderData = async () => {
    try {
      console.log(userData?.client?.id, "ttttttttt");
      dispatch(showLoader());
      const response = await axios.get(
        `https://admin.tradingmaterials.com/api/client/view-order?id=${descryptedId}`,
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("client_token"),
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        setOrderData(response?.data?.data?.items);
        setOrderDetails(response?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [userData]);

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <Header />

      <div className="nk-pages text-left mt-40 sm:mt-40 md:mt-40">
        <section className="nk-banner nk-banner-career-job-details bg-gray">
          <div className="nk-banner-wrap pt-20 pt-lg-80 pb-[100px]">
            <div className="container">
              <div className=" text-left">
                <div className="mb-2">
                  <h2 className="text-xl !font-bold ">My Orders / Tracking</h2>
                  <Divider />
                  {/* <div
                    className={`flex ${
                      orderDetails?.consignment?.tracking_url ||
                      orderDetails?.consignment?.consignment_id
                        ? "justify-around"
                        : " justify-start"
                    } flex-wrap`}
                  >
                    <p className="mt-2">
                      Order No: <b>{orderDetails?.order?.order_number}</b>
                    </p>
                    {orderDetails?.consignment?.tracking_url && (
                      <p
                        className="mt-2 pb-3 cursor-pointer hover:!text-blue-600"
                        onClick={() => {
                          window.open(
                            `${orderDetails?.consignment?.tracking_url}`
                          );
                        }}
                      >
                        Track your order{" "}
                        <span className="!text-blue-600 text-xs">
                          click here
                        </span>
                      </p>
                    )}

                    {orderDetails?.consignment?.consignment_id && (
                      <p className="mt-2 ">
                        Consignment No(AWB):{" "}
                        <Tooltip title="Copy to clipboard">
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                orderDetails?.consignment?.consignment_id
                              );
                            }}
                          >
                            {orderDetails?.consignment?.consignment_id}
                          </span>
                        </Tooltip>
                      </p>
                    )}
                  </div> */}

                  <div className="p-2 border-1 border mb-2">
                    <div className="flex justify-between flex-wrap">
                      <div className="text-left">
                        <p className="!font-bold"> Shipping By:</p>
                        <span>Trading Materials</span>
                      </div>
                      <div className="text-left">
                        <p className="!font-bold"> Order No:</p>
                        <span>{orderDetails?.order?.order_number}</span>
                      </div>
                      <div className="text-left">
                        <p className="!font-bold uppercase"> Payment Type:</p>
                        <span>{orderDetails?.order?.payment_type}</span>
                      </div>
                      {/* <div className="text-left">
                        <p className="!font-bold"> Tracking #:</p>
                        <span>{null} </span>
                      </div> */}
                    </div>
                  </div>
                  {/* <div className="mb-4">
                    <div className="vefs-milestone-wrapper flex justify-center">
                      <div className="milestone-container">
                        <div className="chart-container">
                          <div className="line-container">
                            <div className="line"></div>
                            <div
                              className="line left"
                              style={{ width: "75%" }}
                            ></div>
                          </div>

                          <div className="dot-container">
                            <div className="milestones milestone__0 flex items-center">
                              <div className="dot completed colored flex items-center p-4 justify-center"> <DoneSharpIcon color="success" style={{fontWeight:"bold", fontSize:"2.2rem"}}/></div>
                            </div>
                            <div className="milestones milestone__35 flex items-center">
                              <div className="dot completed colored flex items-center p-4 justify-center"><CallIcon color="warning" style={{fontWeight:"bold", fontSize:"2rem", color:"white"}}/></div>
                            </div>
                            <div className="milestones milestone__70 flex items-center ">
                              <div className="dot completed colored flex items-center p-4 justify-center"><LocalShippingSharpIcon style={{fontWeight:"bold", fontSize:"2rem", color:"white"}}/></div>
                            </div>
                            <div className="milestones milestone__100 flex items-center">
                              <div className="dot flex items-center p-4 justify-center"><UnarchiveSharpIcon style={{fontWeight:"bold", fontSize:"2rem", color:"white"}} /></div>
                            </div>
                          </div>
                        </div>

                        <div className="label-container">
                          <div className="milestones milestone__0 mt-2">
                            <div className=" colored">Placed</div>
                          </div>
                          <div className="milestones milestone__35  mt-2">
                            <div className=" colored">Confirmed</div>
                          </div>
                          <div className="milestones milestone__70  mt-2">
                            <div className=" colored">Dispatched</div>
                          </div>
                          
                          <div className="milestones milestone__100  mt-2">
                            <div className="" style={{width:"max-content"}}>Delivered</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <p> Order Status</p>
                  <CustomizedSteppers
                    orderStatus={
                      orderDetails?.order?.status == "0"
                        ? "0"
                        : orderDetails?.order?.status >= 4
                        ? "3"
                        : orderDetails?.order?.status - 1
                    }
                  />
                </div>
                <Divider />
                <h2 className="!font-bold text-xl mt-2">Order details</h2>
                <div className="">
                  <Box
                    sx={{
                      borderRadius: "16px",
                      border: 1,
                      borderColor: "#f8f8f8",
                    }}
                  >
                    <Divider />
                    <div className="flex w-full p-3 !items-start">
                      <div className="w-full">
                        <h3 className="!font-bold flex items-center text-xs md:text-sm">
                          Invoice No:{" "}
                          <AssignmentIcon style={{ width: "15px" }} />
                          {orderDetails?.order?.invoice?.number === null
                            ? 1324567980
                            : orderDetails?.order?.invoice?.prefix +
                              orderDetails?.order?.invoice?.number}{" "}
                        </h3>
                        <small className="!w-full font-semibold">
                          {new Date(
                            orderDetails?.order?.created_at
                          ).toLocaleDateString("en", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                        </small>
                      </div>
                      <div className="flex justify-end w-full items-center">
                        <SnoozeIcon />
                        <Chip
                          label={
                            steps[
                              orderDetails?.order?.status == "0"
                                ? 0
                                : orderDetails?.order?.status >= 4
                                ? 3
                                : orderDetails?.order?.status - 1
                            ]
                          }
                          variant="outlined"
                        ></Chip>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex justify-between p-3">
                      <p className="font-bold">
                        <MarkUnreadChatAltIcon
                          className="mr-1"
                          style={{ width: "20px" }}
                        />
                        Order Comments
                      </p>
                      <p className="!truncate text-right w-[30%] md:w-[85%]">
                        {orderDetails?.order?.note !== null
                          ? `"${orderDetails?.order?.note}"`
                          : "no Comments"}
                      </p>
                    </div>
                    <Divider />
                    <div className="p-3">
                      <p className="font-bold">
                        <ListAltSharpIcon
                          className="mr-1"
                          style={{ width: "20px" }}
                        />{" "}
                        Order Items
                      </p>
                      {orderDetails?.order?.items?.map((product, ind) => {
                        if (orderDetails?.order?.shiprocketorders?.length > 0) {
                          const shItem =
                            orderDetails?.order?.shiprocketorders?.find(
                              (item) => item?.product_id == product?.product_id
                            );
                          return (
                            <CardActionArea
                              key={ind}
                              // onClick={() =>
                              //   navigate(
                              //     `${userLang}/product-detail/${product?.product?.slug
                              //     }/${CryptoJS?.AES?.encrypt(
                              //       `${product?.product?.id}`,
                              //       "trading_materials"
                              //     )
                              //       ?.toString()
                              //       .replace(/\//g, "_")
                              //       .replace(/\+/g, "-")}`
                              //   )
                              // }
                            >
                              <div className="grid grid-cols-1">
                                <div className="row mx-2 mt-2 hover:drop-shadow-lg ">
                                  <div className="row ">
                                    {/* <div className=" w-full min-w-full"> */}
                                    <div className="col-1 sm:col">
                                      <img
                                        src={product?.product_details?.img_1}
                                        alt="product_img"
                                        width={"100"}
                                        height={"100"}
                                        // style={{ objectFit: "contain" }}
                                      />
                                    </div>
                                    <div className="col gap-2">
                                      <p className="font-bold ml-2 truncate w-[100px] sm:w-[90%]  md:w-[99%]">
                                        {product?.product_details?.name}
                                      </p>

                                      <p className="text-sm font-bold ml-2">
                                        <b className="text-sm text-black font-semibold">
                                          {orderDetails?.order?.currency}{" "}
                                          {parseFloat(product?.price)?.toFixed(
                                            2
                                          )}
                                        </b>
                                        <span className="font-normal"> | </span>
                                        qty:{" "}
                                        <b className="text-black font-semibold">
                                          {product?.qty}
                                        </b>
                                      </p>
                                    </div>
                                    <div className="col gap-2">
                                      <b className="text-sm  font-semibold">
                                        Measurements
                                      </b>
                                      <p className="text-sm font-bold ">
                                        {shItem?.orderstatus?.package?.length}x
                                        {shItem.orderstatus?.package?.breadth}x
                                        {shItem?.orderstatus?.package?.height}
                                        (cm)
                                      </p>
                                    </div>

                                    <div className="col gap-2">
                                      <b className="text-sm  font-semibold">
                                        Weight
                                      </b>
                                      <p className="text-sm font-bold ">
                                        {shItem?.orderstatus?.package?.weight}
                                        kg
                                      </p>
                                    </div>
                                    <div className="col gap-2">
                                      <b className="text-sm  font-semibold">
                                        Order&nbsp;Status
                                      </b>
                                      <p className="flex items-center gap-1 mb-0">
                                        <img
                                          src="/images/order-status.png"
                                          className="w-6 h-6 hidden sm:block"
                                          alt="ord-status"
                                        />
                                        <span className="text-xs sm:text-sm text-black font-semibold">
                                          {shItem?.orderstatus?.status}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="col">
                                      <b className="text-sm  font-semibold">
                                        Consignment No
                                      </b>
                                      <p className={`text-sm font-bold `}>
                                        {shItem?.orderstatus?.awd_code
                                          ? shItem?.orderstatus?.awd_code
                                          : "Not Available"}
                                      </p>
                                    </div>
                                    {/* </div> */}
                                    {shItem?.orderstatus?.timeline?.timeline
                                      ?.scans?.length > 0 && (
                                      <div className="flex justify-start gap-1 flex-wrap mt-2">
                                        <b className="flex items-center gap-1">
                                          <MdTimeline />
                                          Status :
                                        </b>
                                        {shItem?.orderstatus?.timeline?.timeline?.scans?.map(
                                          (timeline, ind) => {
                                            if (ind < 5) {
                                              return (
                                                <div
                                                  className="flex items-center flex-wrap"
                                                  key={ind}
                                                >
                                                  &#x2022;
                                                  <div>
                                                    {timeline?.activity?.replaceAll(
                                                      "_",
                                                      " "
                                                    )}

                                                    <p className="flex items-center gap-1 text-xs">
                                                      <FaClock color="gray" />
                                                      {new Date(
                                                        timeline?.date
                                                      ).toLocaleString(
                                                        "en-US",
                                                        {
                                                          day: "numeric",
                                                          month: "short",
                                                          year: "numeric",
                                                          hour: "numeric",
                                                          minute: "numeric",
                                                          hour12: true,
                                                        }
                                                      )}
                                                    </p>
                                                  </div>
                                                </div>
                                              );
                                            }
                                          }
                                        )}
                                      </div>
                                    )}
                                    {/* logs */}
                                  </div>
                                  {orderDetails?.order?.shiprocketorders
                                    ?.length !=
                                    ind + 1 && <Divider className="mt-1" />}
                                </div>
                              </div>
                            </CardActionArea>
                          );
                        } else {
                          return (
                            <CardActionArea
                              key={ind}
                              onClick={() =>
                                navigate(
                                  `${userLang}/product-detail/${
                                    product?.product?.slug
                                  }/${CryptoJS?.AES?.encrypt(
                                    `${product?.product?.id}`,
                                    "trading_materials"
                                  )
                                    ?.toString()
                                    .replace(/\//g, "_")
                                    .replace(/\+/g, "-")}`
                                )
                              }
                            >
                              <div className="flex w-full  items-center justify-between p-3 flex-wrap">
                                <div className="flex items-center px-4">
                                  <p className="font-bold mr-1">{ind + 1}.</p>
                                  <img
                                    src={product?.product_details?.img_1}
                                    alt="product_img"
                                    width={"100"}
                                    height={"100"}
                                  />
                                  <div>
                                    <p className="font-bold ml-2 truncate w-[100px] sm:w-[90%]  md:w-[99%]">
                                      {product?.product_details?.name}
                                    </p>
                                  </div>
                                </div>
                                <div className=" justify-end text-right">
                                  <b className="text-sm text-black font-semibold">
                                    {orderDetails?.order?.currency}{" "}
                                    {parseFloat(product?.price)?.toFixed(2)}
                                  </b>
                                  <p className="text-sm font-bold ">
                                    qty:{" "}
                                    <b className="text-black font-semibold">
                                      {product?.qty}
                                    </b>
                                  </p>
                                </div>
                              </div>
                            </CardActionArea>
                          );
                        }
                      })}
                    </div>

                    <Divider />
                    <h3 className="!font-bold p-2 pb-0">Order Summary</h3>
                    <div className="p-2">
                      <div className="flex !w-full justify-between">
                        <p className="font-bold px-2 pb-2">
                          <RequestQuoteIcon
                            className="mr-1"
                            style={{ width: "20px" }}
                          />{" "}
                          SubTotal
                        </p>
                        <p className="text-black font-semibold ">
                          {orderDetails?.order?.currency}{" "}
                          {parseFloat(orderDetails?.order?.sub_total)?.toFixed(
                            2
                          )}
                        </p>
                      </div>
                      <div className="flex !w-full justify-between">
                        <p className="font-bold px-2 pb-2">
                          {" "}
                          <CorporateFareIcon
                            className="mr-1"
                            style={{ width: "20px" }}
                          />{" "}
                          Tax
                        </p>
                        <p className="text-black font-semibold">
                          {orderDetails?.order?.currency}{" "}
                          {parseFloat(orderDetails?.order?.total_tax)?.toFixed(
                            2
                          )}
                        </p>
                      </div>
                      <div className="flex !w-full justify-between">
                        <p className="font-bold px-2">
                          <DiscountIcon
                            className="mr-1"
                            style={{ width: "20px" }}
                          />{" "}
                          Discount
                        </p>
                        <p className="text-black font-semibold">
                          {orderDetails?.order?.currency}{" "}
                          {parseFloat(
                            orderDetails?.order?.discount_amount
                          )?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex justify-between p-2">
                      <p className="font-bold px-2">
                        <AssignmentTurnedInSharpIcon
                          className="mr-1"
                          style={{ width: "20px" }}
                        />
                        Total paid
                      </p>
                      <p className="text-black font-semibold">
                        {orderDetails?.order?.currency}{" "}
                        {parseFloat(orderDetails?.order?.amount_paid)?.toFixed(
                          2
                        )}{" "}
                      </p>
                    </div>
                    <div className="flex justify-between p-2 pt-0">
                      <p className="font-bold px-2">
                        <PendingActionsSharpIcon
                          className="mr-1"
                          style={{ width: "20px" }}
                        />{" "}
                        Total Balance
                      </p>
                      <p className="text-black font-semibold">
                        {" "}
                        {orderDetails?.order?.currency}{" "}
                        {parseFloat(orderDetails?.order?.balance)?.toFixed(2)}
                      </p>
                    </div>

                    <Divider />
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5">
                {orderData?.map((product, ind) => (
                  <Card className="mt-5 " sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                          <CardMedia
                            component="img"
                            height="140"
                            image={product?.product?.img_1}
                            alt="green iguana"
                            className="sm:!h-[300px]"
                            onClick={() =>
                              navigate(
                                `${userLang}/product-detail/${
                                  product?.product?.slug
                                }/${CryptoJS?.AES?.encrypt(
                                  `${product?.product?.id}`,
                                  "trading_materials"
                                )
                                  ?.toString()
                                  .replace(/\//g, "_")
                                  .replace(/\+/g, "-")}`
                              )
                            }
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              <div className="nk-card-info bg-white p-4">
                                <a
                                  href={`${userLang}/product-detail/${
                                    product?.slug
                                  }/${CryptoJS?.AES?.encrypt(
                                    `${product?.product?.id}`,
                                    "trading_materials"
                                  )
                                    ?.toString()
                                    .replace(/\//g, "_")
                                    .replace(/\+/g, "-")}`}
                                  className="d-inline-block mb-1 line-clamp-1 h5 !font-bold text-left"
                                  style={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    width: "90%",
                                  }}
                                >
                                  {product?.product?.name}
                                  <br />
                                  {/* <span className="text-xs !mt-1">
                                    <p
                                      onClick={() => {
                                        navigate(
                                          `${userLang}/product-detail/${
                                            item?.product?.slug
                                          }/${CryptoJS?.AES?.encrypt(
                                            `${item?.product?.id}`,
                                            "trading_materials"
                                          )
                                            ?.toString()
                                            .replace(/\//g, "_")
                                            .replace(/\+/g, "-")}`
                                        );
                                        dispatch(showLoader());
                                      }}
                                      className="!mt-5 text-gray-700  truncate"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          product?.product?.description?.length > 55
                                            ? `${product?.product?.description?.slice(
                                                0,
                                                55
                                              )}...`
                                            : product?.product?.description,
                                      }}
                                    />
                                  </span> */}
                    {/* </a>
                                <div className="d-flex align-items-center justify-content-start">
                                  <p className="fs-16 m-0 text-gray-900 font-semibold text-start !mr-2 ">
                                    Amount : <b className="text-black">₹{product?.price}</b>
                                  </p>
                                  </div>
                                  <div className="d-flex align-items-center justify-content-start">
                                  <p
                                    className="fs-16 m-0 text-gray-900 font-semibold text-start !mr-2 "
                                    
                                  > */}
                    {/* <span className="text-base text-black font-semibold flex !items-left"> */}
                    {/* Qty: <b className="text-black">{product?.qty}</b> */}
                    {/* </span> */}

                    {/* </p>
                                  </div>
                                  <div className="d-flex align-items-center justify-content-start">
                                  <p
                                    className="fs-16 m-0 text-gray-900 font-semibold text-start !mr-2 "
                                  > */}
                    {/* <span className="text-base text-black font-semibold flex !items-center"> */}
                    {/* Total:<b className="text-black">{product?.total}</b> */}
                    {/* </span> */}

                    {/* </p>
                                </div>
                              </div> */}
                    {/* </Typography> */}
                    {/* </CardContent> */}

                    {/* </CardActionArea> */}
                    {/* </Card> */}
                    {/* ))} */}
                    {/* </div> */}
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
