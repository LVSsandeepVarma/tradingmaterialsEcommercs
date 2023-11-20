import React, { useEffect, useState } from "react";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { Box, Divider, Chip, CardActionArea } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import LocalShippingSharpIcon from '@mui/icons-material/LocalShippingSharp';
import UnarchiveSharpIcon from '@mui/icons-material/UnarchiveSharp';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoader, showLoader } from "../../../../features/loader/loaderSlice";
import axios from "axios";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DiscountIcon from "@mui/icons-material/Discount";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import SnoozeIcon from "@mui/icons-material/Snooze";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PendingActionsSharpIcon from "@mui/icons-material/PendingActionsSharp";
import ListAltSharpIcon from '@mui/icons-material/ListAltSharp';
import AssignmentTurnedInSharpIcon from "@mui/icons-material/AssignmentTurnedInSharp";
import CryptoJS from "crypto-js";
import { Button, Modal } from "react-bootstrap";


export default function OrderTacker() {

  const [orderData, setOrderData] = useState([]);
  const [orderDetails, setOrderDetails] = useState();
  const [orderId, setOrderId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const userLang = useSelector((state) => state?.lang?.value);
  const userData = useSelector((state) => state?.user?.value);
  const loaderState = useSelector((state) => state?.loader?.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams()
  
  const clientId= userData?.client?.id
  const {order_id} = useParams()

  useEffect(()=>{
    if(!params?.order_id){
      setShowModal(true)
    }
  },[])

  //fetching order details
  const fetchOrderData = async () => {
    try {
      console.log(userData?.client?.id, "ttttttttt")
      dispatch(showLoader());
      const response = await axios.get(
        `https://admin.tradingmaterials.com/api/client/product/checkout/view-order?order_id=${order_id}&client_id=${clientId}`,
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


  const handleOrderIdInput =async(e)=>{
    setOrderId(e.target.value)
    console.log(e.target.value)
    // trackign with bluedart api
    // const response = await axios.get(`https://api.bluedart.com/v1/tracking/?waybillNumber=${orderId}`)

  }

  return (
    <>
    <Modal show={showModal} onHide={()=>setShowModal(false)} centered className="!backdrop-blur-[2px]">
      <Modal.Header closeButton>Track your Order</Modal.Header>
      <Modal.Body>
        <>
          <div className="text-left">
            <label>Enter your Order id</label>
            <input className="form-control mt-2 mb-2" placeholder="your order id" value={orderId} onChange={handleOrderIdInput} />
            <Button variant="primary" onClick={()=>{
              if(orderId!== "" || orderId !== undefined){
                fetchOrderData();
                setShowModal(false)
              }
            }} >Track My Order</Button>
          </div>

        </>
      </Modal.Body>
    </Modal>
    {loaderState && (
        <div className="preloader !backdrop-blur-[1px]">
          <div className="loader"></div>
        </div>
      )}
      <Header />

      <div className="nk-pages text-left mt-80 sm:mt-60 md:mt-40">
        <section className="nk-banner nk-banner-career-job-details bg-gray">
          <div className="nk-banner-wrap pt-120 pt-lg-80 pb-[100px]">
            <div className="container">
              <div className=" text-left">
                <div>
                  <h2 className="text-xl !font-bold ">My Orders / Tracking</h2>
                  <Divider />
                  <p className="mt-2 pb-3">
                    Order ID: <b>{orderData?.order?.order_number}</b>
                  </p>
                  <div className="p-2 border-1 border mb-6">
                    <div className="flex justify-between">
                      <div className="text-left">
                        <p className="!font-bold"> Estimated Delivery time:</p>
                        <span>29 nov 2019</span>
                      </div>
                      <div className="text-left">
                        <p className="!font-bold"> Shipping By:</p>
                        <span>
                          BLUEDART | <CallIcon fontSize="md" /> 8998675986{" "}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="!font-bold"> Status:</p>
                        <span>Picked by the courier </span>
                      </div>
                      <div className="text-left">
                        <p className="!font-bold"> Tracking #:</p>
                        <span>sdgnlak3546 </span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
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
                            <div className=" colored">Order Confirmed</div>
                          </div>
                          <div className="milestones milestone__35  mt-2">
                            <div className=" colored">Picked by courier</div>
                          </div>
                          <div className="milestones milestone__70  mt-2">
                            <div className=" colored">on the way</div>
                          </div>
                          
                          <div className="milestones milestone__100  mt-2">
                            <div className="" style={{width:"max-content"}}>Ready for Pickup</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
                <Divider/>
                  <h2 className="!font-bold text-xl mt-2">Order details</h2>
                  <div className="">
              <Box sx={{ borderRadius: "16px", border: 1, borderColor: "#f8f8f8" }}>
                <Divider />
                <div className="flex w-full p-3 !items-start">
                  <div className="w-full">
                    <h3 className="!font-bold">
                      <AssignmentIcon style={{ width: "15px" }} />
                      {orderDetails?.order?.invoice_no === null
                        ? 1324567980
                        : orderDetails?.order?.invoice_no}{" "}
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
                    <Chip label="On the Way" variant="outlined"></Chip>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between p-3">
                  <p
                    className="font-bold" 
                    
                  >
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
                <p className="font-bold"><ListAltSharpIcon className="mr-1"
                      style={{ width: "20px" }}/> Order Items</p>
                {orderData?.map((product, ind) => (
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
                    <div className="flex w-full  items-center justify-between p-3">
                      <div className="flex items-center">
                        <p className="font-bold mr-1">{ind + 1}.</p>
                        <img
                          src={product?.product?.img_1}
                          alt="product_img"
                          width={75}
                          height={75}
                        />
                        <div >
                          <p className="font-bold ml-2 truncate w-[100px] md:w-[145px]">
                            {product?.product?.name}
                          </p>
                        </div>
                      </div>
                      <div className=" justify-end text-right">
                        <b className="text-sm text-black font-semibold">
                          {orderDetails?.order?.currency} {product?.price}
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
                ))}
                </div>

                <Divider />
                <h3 className="!font-bold p-2 pb-0">Order Summary</h3>
                <div className="p-2">
                  <div className="flex !w-full justify-between">
                    <p className="font-bold">
                      <RequestQuoteIcon
                        className="mr-1"
                        style={{ width: "20px" }}
                      />{" "}
                      SubTotal
                    </p>
                    <p className="text-black font-semibold">
                      {orderDetails?.order?.currency}{" "}
                      {orderDetails?.order?.sub_total}
                    </p>
                  </div>
                  <div className="flex !w-full justify-between">
                    <p className="font-bold">
                      {" "}
                      <CorporateFareIcon
                        className="mr-1"
                        style={{ width: "20px" }}
                      />{" "}
                      Tax
                    </p>
                    <p className="text-black font-semibold">
                      {orderDetails?.order?.currency}{" "}
                      {orderDetails?.order?.total_tax}
                    </p>
                  </div>
                  <div className="flex !w-full justify-between">
                    <p className="font-bold">
                      <DiscountIcon
                        className="mr-1"
                        style={{ width: "20px" }}
                      />{" "}
                      Discount
                    </p>
                    <p className="text-black font-semibold">
                      {orderDetails?.order?.currency}{" "}
                      {orderDetails?.order?.discount_amount}
                    </p>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between p-3">
                  <p className="font-bold">
                    <AssignmentTurnedInSharpIcon
                      className="mr-1"
                      style={{ width: "20px" }}
                    />
                    Total paid
                  </p>
                  <p className="text-black font-semibold">
                    {orderDetails?.order?.currency}{" "}
                    {orderDetails?.order?.amount_paid}{" "}
                  </p>
                </div>
                <div className="flex justify-between p-3 pt-0">
                  <p className="font-bold">
                    <PendingActionsSharpIcon
                      className="mr-1"
                      style={{ width: "20px" }}
                    />{" "}
                    Total Balance
                  </p>
                  <p className="text-black font-semibold">
                    {" "}
                    {orderDetails?.order?.currency}{" "}
                    {orderDetails?.order?.balance}
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
