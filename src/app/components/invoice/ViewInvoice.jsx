import React, { useEffect, useState } from "react";
import Header from "../header/header";
import "../dashboard/dashboard.css";
import Footer from "../footer/footer";
import "./viewInvoice.css";
import CryptoJS from "crypto-js";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import {  Divider } from "@mui/material";
import { FaDownload } from "react-icons/fa6";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
export default function ViewInvoice() {
  const params = useParams()
   const { t } = useTranslation();
    const [viewOrderDetails, setViewOrderDetails] = useState();
    const dispatch = useDispatch();

  useEffect(() => {
    const viewOrderDetails = async () => {
      try {
        dispatch(showLoader());
        if (decryptedOrderId != undefined) {
          const response = await axios.get(
            `https://admin.tradingmaterials.com/api/client/view-order?id=${decryptedOrderId}`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("client_token"),
              },
            }
          );

          if (response?.data?.status) {
            setViewOrderDetails(response?.data?.data?.order);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoader());
      }
    };

    viewOrderDetails();
  }, []);

    const decryptedOrderId = CryptoJS.AES.decrypt(
      params?.order_id.replace(/_/g, "/").replace(/-/g, "+"),
      "trading_materials_order"
    ).toString(CryptoJS.enc.Utf8);
    const decryptedInvoicePdfFile = CryptoJS.AES.decrypt(
      params?.pdf_filelink.replace(/_/g, "/").replace(/-/g, "+"),
      "trading_materials_invoice_pdf"
    ).toString(CryptoJS.enc.Utf8);
    console.log(params, decryptedInvoicePdfFile, decryptedOrderId, "hellllo", viewOrderDetails)
  return (
    <>
      <div className="nk-app-root">
        <Header />
        <div className="container mt-28">
          <div className=" ">
            <div className="">
              <div className="watermark">
                <span id="watermark" style={{ display: "none" }}>
                  WATERMARK
                </span>
              </div>
              <div></div>
              <div className="invoice-box">
                <div className="container">
                  <div className="flex justify-end">
                    <button
                      className="bg-light p-2 rounded flex items-center inv-button"
                      onClick={() => {
                        window.open(
                          `${viewOrderDetails?.invoice?.invoicefile?.invoice_pdf}`,
                          "_blank"
                        );
                      }}
                    >
                      Download <FaDownload className="ml-2" />
                    </button>
                  </div>
                  <div className="row">
                    <table className="table mb-0">
                      <tr
                        className="item"
                        style={{ background: "transparent", border: "none" }}
                      >
                        <td>
                          <div className="equalHW eq logo-block border-none">
                            {/* <a href=""> */}
                            <img src="/images/tm-logo-1.webp" />
                            {/* </a> */}
                          </div>
                        </td>
                        <td style={{ textAlign: "right", float: "right" }}>
                          <div
                            className="eq title-block border-none"
                            style={{ textAlign: "right", float: "right" }}
                          >
                            <h2
                              className="no-padding"
                              id="InvoiceSumExVat"
                              style={{
                                margin: "0px",
                                textAlign: "right",
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1.5",
                                fontSize: "26px",
                              }}
                            >
                              INVOICE
                            </h2>
                            <h5
                              style={{
                                marginBottom: "20px",
                                textAlign: "right",
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1.5",
                              }}
                            >
                              {viewOrderDetails?.invoice?.prefix}-
                              {viewOrderDetails?.invoice?.number}
                            </h5>

                            {/* <!-- <p style="color:red;font-family: 'Lato', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;border: 1px solid red;width: fit-content;text-align: right;float: right;padding: 0 5px;border-radius: 5px;font-size: 14px;">UNPAID</p> --> */}

                            <p
                              className={`border ${
                                viewOrderDetails?.amount_paid == 0
                                  ? "text-red-600 !border-red-600"
                                  : viewOrderDetails?.balance == 0
                                  ? "text-green-600 !border-green-600"
                                  : "text-orange-600  !border-orange-600"
                              }  `}
                              style={{
                                // color: "green",
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                // border: "1px solid green",
                                width: "fit-content",
                                textAlign: "right",
                                float: "right",
                                padding: " 0 5px",
                                borderRadius: "5px",
                                fontSize: "14px",
                              }}
                            >
                              {viewOrderDetails?.amount_paid == 0
                                ? "Unpaid"
                                : viewOrderDetails?.balance == 0
                                ? "Paid"
                                : "Partially paid"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <Divider />
                  </div>

                  <div className="row ">
                    <div className=" !px-0 !w-[100%] !max-w-[100%]">
                      <table
                        className="table my-0"
                        style={{ marginTop: "0px" }}
                      >
                        <tr
                          className="item"
                          style={{ background: "transparent", border: "none" }}
                        >
                          <td
                            style={{
                              fontFamily:
                                "Lato Helvetica Neue Helvetica, Helvetica, Arial, sans-serif",
                              color: "#333447",
                              lineHeight: "1.5",
                            }}
                          >
                            <div className="equalHW eq infoblock to-block border-none">
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                <b>Invoice Date</b> :{" "}
                                {new Date(
                                  viewOrderDetails?.invoice?.created_at
                                ).toLocaleDateString()}
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                <b>Trading Materials</b>
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                3rd Floor, 31, Door No 301
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                Maina Apartments, Thillai Nagar,
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                Vadakuthu, Neyveli, Cuddalore Tamil Nadu,
                                607803.
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                Phone : 080-68493342
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                &nbsp;{" "}
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                {" "}
                                &nbsp;
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                &nbsp;{" "}
                              </p>
                            </div>
                          </td>
                          <td
                            className="max-w-[50%] w-[50%]"
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#333447",
                              lineHeight: "1.5",
                              textAlign: "right",
                              verticalAlign: "top",
                            }}
                          >
                            <div className="equalHW eq infoblock info-block border-none">
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                                className=""
                              >
                                <b>Bill To:</b>
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                                className=""
                              >
                                <b>
                                  {viewOrderDetails?.customer?.first_name}{" "}
                                  {viewOrderDetails?.customer?.last_name}
                                </b>
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                                className=""
                              >
                                {viewOrderDetails?.invoice?.address_1},
                                {viewOrderDetails?.invoice?.last_name}
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                                className=""
                              >
                                {viewOrderDetails?.invoice?.billing_city},
                                {viewOrderDetails?.invoice?.billing_state}
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                                className=""
                              >
                                {viewOrderDetails?.invoice?.billing_country} -{" "}
                                {viewOrderDetails?.invoice?.billing_zip}
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                                className=""
                              >
                                {viewOrderDetails?.customer?.phone}
                              </p>
                              <br />
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div className="!px-0">
                      <Table responsive className="table mt-0 responsive !px-0">
                        <tr
                          className="titles border-none"
                          style={{
                            fontFamily:
                              "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                            color: "#fff",
                            lineHeight: "1.5",
                            background: "#5c5c5c",
                          }}
                        >
                          <th
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#fff",
                              lineHeight: "1.5",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#fff",
                              lineHeight: "1.5",
                            }}
                          >
                            Item
                          </th>
                          <th
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#fff",
                              lineHeight: "1.5",
                            }}
                          >
                            Qty
                          </th>
                          <th
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#fff",
                              lineHeight: "1.5",
                            }}
                          >
                            Rate
                          </th>
                          <th
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#fff",
                              lineHeight: "1.5",
                              width: "160px",
                            }}
                          >
                            Tax
                          </th>
                          <th
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#fff",
                              lineHeight: "1.5",
                              width: "70px",
                            }}
                          >
                            Amount
                          </th>
                        </tr>
                        {viewOrderDetails?.items?.map((item, ind) => (
                          <tr
                            key={ind}
                            className="item border-none "
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#333447",
                              lineHeight: "1.5",
                              borderBottom: "1px solid #DDD",
                            }}
                          >
                            <td
                              className="!py-[10px]"
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1.5",
                                borderBottom: "1px solid #DDD",
                              }}
                            >
                              {ind + 1}
                            </td>
                            <td
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1.5",
                                border: "none",
                              }}
                            >
                              {" "}
                              <b className="border-none">
                                {item?.product_details?.name}
                              </b>
                            </td>
                            <td
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1.5",
                              }}
                            >
                              {item?.qty}
                            </td>
                            <td
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1.5",
                                borderBottom: "1px solid #DDD",
                              }}
                            >
                              ₹{item?.price}
                            </td>
                            <td
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1.5",
                                borderBottom: "1px solid #DDD",
                              }}
                            >
                              0%
                            </td>
                            <td
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1.5",
                                borderBottom: "1px solid #DDD",
                              }}
                            >
                              ₹{item?.total}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td className="text-right border-0">
                            <span
                              style={{
                                display: "inline-block",
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1",
                              }}
                              className="border-none py-0"
                            >
                              <strong>Subtotal:</strong>
                            </span>
                          </td>
                          <td className="text-right border-0">
                            <span
                              id="InvoiceCurrency1"
                              className="border-0 py-0"
                            >
                              ₹{viewOrderDetails?.sub_total}
                            </span>
                            <br />
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td className="text-right border-0 mr-0">
                            <span
                              className="border-0 py-0"
                              style={{
                                display: "inline-block",
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1",
                              }}
                            >
                              <strong>Discount:</strong>
                            </span>
                          </td>
                          <td className="text-right border-0">
                            <span
                              id="InvoiceCurrency1"
                              className="border-0 py-0"
                            >
                              ₹{viewOrderDetails?.discount_amount}
                            </span>
                            <br />
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td className="text-right border-0">
                            <span
                              className="border-0 py-0"
                              style={{
                                display: "inline-block",
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1",
                              }}
                            >
                              <strong>Total:</strong>
                            </span>
                          </td>
                          <td className="text-right border-0">
                            <span id="InvoiceCurrency2" className="border-0">
                              ₹{viewOrderDetails?.total}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td className="text-right border-0">
                            <span
                              className="border-0 py-0"
                              style={{
                                display: "inline-block",
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1",
                              }}
                            >
                              <strong>Total Paid:</strong>
                            </span>
                          </td>
                          <td className="text-right border-0">
                            <span
                              id="InvoiceCurrency3"
                              className="border-0 py-0"
                            >
                              ₹{viewOrderDetails?.amount_paid}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td className="text-right border-0">
                            <span
                              className="border-0"
                              style={{
                                display: "inline-block",
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1",
                              }}
                            >
                              <strong>Amount Due:</strong>
                            </span>
                          </td>
                          <td className="text-right border-0">
                            <span
                              id="InvoiceCurrency3"
                              className="border-0 py-0"
                            >
                              ₹{viewOrderDetails?.balance}
                            </span>
                          </td>
                        </tr>
                      </Table>
                    </div>
                  </div>
                  {viewOrderDetails?.payments?.length > 0 && (
                    <div className="row">
                      <div className=" !px-0 !w-[100%] !max-w-[100%] table-responsive">
                        <table className="table mt-0 responsive">
                          <tr
                            className="titles border-none"
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#fff",
                              lineHeight: "1.5",
                              background: "#5c5c5c",
                            }}
                          >
                            <th
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#fff",
                                lineHeight: "1.5",
                              }}
                            >
                              #
                            </th>
                            <th
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#fff",
                                lineHeight: "1.5",
                              }}
                            >
                              Payment Type
                            </th>
                            <th
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#fff",
                                lineHeight: "1.5",
                              }}
                            >
                              Payment Id
                            </th>
                            <th
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#fff",
                                lineHeight: "1.5",
                              }}
                            >
                              Transaction Id
                            </th>
                            <th
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#fff",
                                lineHeight: "1.5",
                                width: "160px",
                              }}
                            >
                              Amount
                            </th>
                            <th
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#fff",
                                lineHeight: "1.5",
                                width: "70px",
                              }}
                            >
                              Status
                            </th>
                            <th
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#fff",
                                lineHeight: "1.5",
                                width: "70px",
                              }}
                            >
                              Date
                            </th>
                          </tr>
                          {viewOrderDetails?.payments?.map((item, ind) => (
                            <tr
                              key={ind}
                              className="item border-none "
                              style={{
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                color: "#333447",
                                lineHeight: "1.5",
                                borderBottom: "1px solid #DDD",
                              }}
                            >
                              <td
                                className="!py-[10px]"
                                style={{
                                  fontFamily:
                                    "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                  color: "#333447",
                                  lineHeight: "1.5",
                                  borderBottom: "1px solid #DDD",
                                }}
                              >
                                {ind + 1}
                              </td>
                              <td
                                style={{
                                  fontFamily:
                                    "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                  color: "#333447",
                                  lineHeight: "1.5",
                                  border: "none",
                                }}
                              >
                                {" "}
                                <b className="border-none">
                                  {item?.payment_type}
                                </b>
                              </td>
                              <td
                                style={{
                                  fontFamily:
                                    "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                  color: "#333447",
                                  lineHeight: "1.5",
                                }}
                              >
                                {item?.payment_id}
                              </td>
                              <td
                                style={{
                                  fontFamily:
                                    "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                  color: "#333447",
                                  lineHeight: "1.5",
                                  borderBottom: "1px solid #DDD",
                                }}
                              >
                                {item?.transaction_id != null
                                  ? item?.transaction_id
                                  : "-"}
                              </td>
                              <td
                                style={{
                                  fontFamily:
                                    "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                  color: "#333447",
                                  lineHeight: "1.5",
                                  borderBottom: "1px solid #DDD",
                                }}
                              >
                                ₹{item?.paid_amount}
                              </td>
                              <td
                                style={{
                                  fontFamily:
                                    "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                  color: "#333447",
                                  lineHeight: "1.5",
                                  borderBottom: "1px solid #DDD",
                                }}
                              >
                                {item?.status == "0"
                                  ? "Pending"
                                  : item?.status == "2"
                                  ? "Failed"
                                  : "Success"}
                              </td>
                              <td
                                style={{
                                  fontFamily:
                                    "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                  color: "#333447",
                                  lineHeight: "1.5",
                                  borderBottom: "1px solid #DDD",
                                }}
                              >
                                {new Date(item?.updated_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  )}
                  <div className="row">
                    <div
                      className=""
                      style={{ textAlign: "right", float: "right" }}
                    >
                      <div className=""></div>
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: "20px" }}>
                    <div>
                      <img
                        src="https://www.freepnglogos.com/uploads/signature-png/nguy-ecnh-nguyen-van-binh-signature-png-5.png"
                        width="150px"
                      />
                    </div>
                    <div
                      className="text-left"
                      style={{
                        borderBottom: "1px solid #e9e9e9",
                        paddingBottom: "0.25rem",
                      }}
                    >
                      Authorized Signature
                    </div>
                    <p
                      style={{
                        width: "90%",
                        textAlign: "center",
                        margin: "0.25rem auto",
                        fontSize: " 10px",
                        color: "gray",
                        lineHeight: "1.25",
                      }}
                    >
                      All payments information from fetched from payment
                      providers are recorded for our customer future reference
                      any details regarding cards or wallets or account are not
                      shared by the payment providers for the customer privacy
                      and security in transaction.
                    </p>
                  </div>
                  <p style={{ pageBreakAfter: "always" }}></p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  <a href={`/contactus`} className="btn btn-white fw-semiBold">
                    {t("Contact_support")}
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
