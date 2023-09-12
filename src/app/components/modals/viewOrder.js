/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DiscountIcon from "@mui/icons-material/Discount";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import SnoozeIcon from "@mui/icons-material/Snooze";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PendingActionsSharpIcon from "@mui/icons-material/PendingActionsSharp";
import ListAltSharpIcon from '@mui/icons-material/ListAltSharp';
import AssignmentTurnedInSharpIcon from "@mui/icons-material/AssignmentTurnedInSharp";
import {
  Box,
  CardActionArea,
  Chip,
  Divider,
} from "@mui/material";

export default function ViewOrderModal({ show, onHide, orderId }) {
  const [orderData, setOrderData] = useState([]);
  const [orderDetails, setOrderDetails] = useState();
  const userLang = useSelector((state) => state?.lang?.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        dispatch(showLoader());
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/lead/product/checkout/view-order?order_id=${orderId}`,
          {
            headers: {
              "access-token": localStorage.getItem("client_token"),
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
    fetchOrderData();
  }, []);
  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton={true}>
          <Modal.Title className="!font-bold flex items-center text-lg">
            Order / ID {orderDetails?.order?.order_number}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="overflow-y-auto !max-h-[750px]">
          <>
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
                    <Chip label="Not Started" variant="outlined"></Chip>
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
                  key={ind*3}
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
               
              </Box>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
}
