import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Chip, Divider, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ViewOrderModal from "../modals/viewOrder";

export default function Invoices() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false)
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(showLoader());
        const response = await axios.get(
          "https://admin.tradingmaterials.com/api/lead/product/checkout/order-list",
          {
            headers: {
              "access-token": localStorage.getItem("client_token"),
            },
          }
        );
        if (response?.data?.status) {
          console.log(response?.data);
          const data = response?.data?.data?.order
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
  }, []);

  function formatDate(timestamp) {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = new Date(timestamp).toLocaleString("en-US", options);

    return formattedDate;
  }

  const hideModal = ()=>{
    setShowModal(false)
  }
  return (
    <>
    {showModal && <ViewOrderModal show={showModal} onHide={hideModal} orderId={orderId}/>}
      <div className="!bg-gray-800 max-h-[550px] overflow-auto">
        <div className="grid !bg-gray-500 !text-left">
          {orders?.length > 0 &&
            orders?.map((order, ind) => (
              <Stack
                sx={{
                  boxShadow: 12,
                }}
              >
                <div className="bg-neutral-50  p-3">
                
                  <div className="flex w-full items-center">
                    
                    <h1 className="!w-full flex !items-center !text-sm !font-bold">
                      <label className="font-semibold">Order Number :</label>
                      {order?.order_number}{" "}
                      <Chip
                        className="ml-2 text-sm"
                        label={`${
                          order?.amount_paid === order?.balance
                            ? "Paid"
                            : order?.amount_paid !== 0
                            ? "Partially Paid"
                            : "Unpaid"
                        }`}
                        color= {order?.amount_paid === order?.balance ? "success" : order?.amount_paid === 0 ? "error" : "warning"}
                      ></Chip>
                    </h1>
                    <div className="w-full flex justify-end">
                      <p className="font-bold">
                        {order?.balance !== 0 && order?.currency}&nbsp;
                        {order?.balance + order?.amount_paid}
                      </p>
                    </div>
                  </div>
                  <label style={{ fontSize: "12px" }}>
                    <AccessTimeIcon className="!w-[18px]" />{" "}
                    {formatDate(order?.created_at)} |{" "}
                    <b>{order?.balance === 0 ? "payment id" : "Shipping no"}</b>{" "}
                    :{" "}
                    {order?.balance === 0
                      ? order?.payment_id
                      : order?.invoice_id !== null ? order?.invoice_id : "1234567890"}
                  </label>
                  <div className="flex items-center">
                    <p className="!text-sm p-1 font-bold">{ind+1}.</p>
                    <div className="w-full leading-relaxed">
                      <p className="!text-sm p-1">
                        <b>Balance Amount : </b>
                        {order?.balance !== 0 && order?.currency}&nbsp;{" "}
                        <b className="text-black">{order?.balance}</b>
                      </p>
                      <p className="!text-sm p-1">
                        <b>Tax : </b>{" "}
                        {order?.amount_paid !== 0 && order?.currency}&nbsp;{" "}
                        <b className="text-black">{order?.total_tax}</b>
                      </p>
                      <p className="!text-sm p-1">
                        <b>Discount Amount : </b>{" "}
                        {order?.amount_paid !== 0 && order?.currency}&nbsp;{" "}
                        <b className="text-black">{order?.discount_amount}</b>
                      </p>
                      <p className="!text-sm p-1">
                        <b>Amount Paid : </b>
                        {order?.amount_paid !== 0 && order?.currency}&nbsp;{" "}
                        <b className="text-black">{order?.amount_paid}</b>
                      </p>
                      {/* <div className='flex items-center'>
                            <img src='/images/stripe.png' width={100}></img>
                            <div className=''>
                                <h4>Product name</h4>
                                <p>Qty : 4</p>
                            </div>
                        </div> */}
                    </div>
                    <p className="w-full text-right">
                      <Button
                        type="submit"
                        style={{
                          backgroundColor: "green",
                          border: "green",
                          color: "#fff",
                        }}
                        
                        onClick={() =>
                          navigate(
                            `/checkout/order_id/${CryptoJS?.AES?.encrypt(
                              `${order.id}`,
                              "trading_materials_order"
                            )
                              ?.toString()
                              .replace(/\//g, "_")
                              .replace(/\+/g, "-")}`
                          )
                        }
                      >
                        Pay now
                      </Button>
                    </p>
                  </div>
                  <Button
                        type="submit"
                        style={{
                          backgroundColor: "#54a8c7",
                          border: "#54a8c7",
                          color: "#fff",
                        }}
                        
                        onClick={() =>
                          {
                            setOrderId(order?.id);
                            setShowModal(true)
                          }
                        }
                      >
                        View All Products
                      </Button>
                      <Button
                      className="!ml-3"
                        type="submit"
                        style={{
                          backgroundColor: "orange",
                          border: "orange",
                          color: "#fff",
                        }}
                        
                        // onClick={() =>
                        //   navigate(
                        //     `/checkout/order_id/${CryptoJS?.AES?.encrypt(
                        //       `${order.id}`,
                        //       "trading_materials_order"
                        //     )
                        //       ?.toString()
                        //       .replace(/\//g, "_")
                        //       .replace(/\+/g, "-")}`
                        //   )
                        // }
                      >
                        Delete Order
                      </Button>
                </div>
              </Stack>
            ))}
        </div>
      </div>
    </>
  );
}
