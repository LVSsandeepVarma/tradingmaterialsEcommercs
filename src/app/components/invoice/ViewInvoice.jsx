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
export default function ViewInvoice() {
    const params = useParams()
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
              <div className="invoice-box">
                <div className="container">
                  <div className="row">
                    <table className="table">
                      <tr
                        className="item"
                        style={{ background: "transparent", border: "none" }}
                      >
                        <td>
                          <div className="equalHW eq logo-block border-none">
                            <a href="">
                              <img src="https://gtechwebservice.com/TradingMaterial/assets/images/logo/tm-logo.png" />
                            </a>
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
                              style={{
                                color: "green",
                                fontFamily:
                                  "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                border: "1px solid green",
                                width: "fit-content",
                                textAlign: "right",
                                float: "right",
                                padding: " 0 5px",
                                borderRadius: "5px",
                                fontSize: "14px",
                              }}
                            >
                              PAID
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <div className="row ">
                    <table className="table">
                      <tr
                        className="item"
                        style={{ background: "transparent", border: "none" }}
                      >
                        <td
                          style={{
                            fontFamily:
                              "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                            color: "#333447",
                            lineHeight: "1.5",
                          }}
                        >
                          {/* <!--<div className="equalHW eq nomargin-nopadding title" style="margin-left: 10px;margin-right: 10px;font-weight: bold;border-bottom: 1px solid #8B8B8B;">-->
                <!--  From-->
                <!--</div>--> */}
                        </td>
                        <td
                          style={{
                            fontFamily:
                              "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                            color: "#333447",
                            lineHeight: "1.5",
                            textAlign: "right",
                          }}
                        >
                          {/* <!--<div className="equalHW eq nomargin-nopadding title" style="margin-left: 10px;margin-right: 10px;font-weight: bold;border-bottom: 1px solid #8B8B8B;">-->
                <!--  To-->
                <!--</div>--> */}
                        </td>
                      </tr>
                    </table>
                    <div className="row !pr-0 !w-[101%] !max-w-[103%]">
                      <table className="table" style={{ marginTop: "5px" }}>
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
                                No.3 FC, 401, level-4 RAGHAVA
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                BUILDING, 4Th Floor, Ramamurthy Nagar,
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                Bengaluru, Karnataka - 560016.
                              </p>
                              <p
                                style={{
                                  marginBottom: "2px",
                                  fontSize: "14px",
                                }}
                              >
                                Phone : 971 568030111
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
                            style={{
                              fontFamily:
                                "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                              color: "#333447",
                              lineHeight: "1.5",
                              textAlign: "right",
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
                    <table className="table ">
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
                          }}
                        >
                          Amount
                        </th>
                      </tr>
                      {viewOrderDetails?.items?.map((item, ind) => (
                        <tr
                          key={ind}
                          className="item border-none"
                          style={{
                            fontFamily:
                              "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                            color: "#333447",
                            lineHeight: "1.5",
                            borderBottom: "1px solid #DDD",
                          }}
                        >
                          <td
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
                    </table>
                  </div>
                  <div className="row ">
                    <table className="table">
                      <tr
                        className="item"
                        style={{ background: "transparent", border: "none" }}
                      >
                        <td
                          style={{
                            fontFamily:
                              "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                            color: "#333447",
                            lineHeight: "1.5",
                          }}
                        >
                          <div className="equalHW eq infoblock to-block border-none">
                            <span>
                              <b></b>
                            </span>
                            <br />
                            <span></span>
                            <br />
                            <span></span> <span id="CustomerCity"></span>
                            <br />
                            <span></span>
                            <br />
                          </div>
                        </td>
                        <td
                          style={{
                            fontFamily:
                              "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                            color: "#333447",
                            lineHeight: "1.5",
                            textAlign: "right",
                          }}
                        >
                          <div className="equalHW eq infoblock info-block border-none">
                            <table
                              className=""
                              style={{ textAlign: "right", float: "right" }}
                            >
                              <tr>
                                <td>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      marginRight: "10px",
                                      fontFamily:
                                        "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                      color: "#333447",
                                      lineHeight: "1.5",
                                    }}
                                    className="border-none"
                                  >
                                    <strong>Subtotal:</strong>
                                  </span>
                                </td>
                                <td>
                                  <span id="InvoiceCurrency1">
                                    ₹{viewOrderDetails?.sub_total}
                                  </span>
                                  <br />
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      marginRight: "10px",
                                      fontFamily:
                                        "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                      color: "#333447",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    <strong>Discount:</strong>
                                  </span>
                                </td>
                                <td>
                                  <span id="InvoiceCurrency1">
                                    ₹{viewOrderDetails?.discount_amount}
                                  </span>
                                  <br />
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      marginRight: "10px",
                                      fontFamily:
                                        "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                      color: "#333447",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    <strong>Total:</strong>
                                  </span>
                                </td>
                                <td>
                                  <span id="InvoiceCurrency2">
                                    ₹{viewOrderDetails?.total}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      marginRight: "10px",
                                      fontFamily:
                                        "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                      color: "#333447",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    <strong>Total Paid:</strong>
                                  </span>
                                </td>
                                <td>
                                  <span id="InvoiceCurrency3">
                                    ₹{viewOrderDetails?.amount_paid}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      marginRight: "10px",
                                      fontFamily:
                                        "Lato, Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                                      color: "#333447",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    <strong>Amount Due:</strong>
                                  </span>
                                </td>
                                <td>
                                  <span id="InvoiceCurrency3">
                                    ₹{viewOrderDetails?.balance}
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Quisque in ultricies arcu. Suspendisse tincidunt lacus a
                      diam ornare fermentum. Sed non dolor a magna fermentum
                      dapibus vel vitae ante. Fusce lobortis nulla eu eleifend
                      efficitur. Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit.
                    </p>
                  </div>
                  <p style={{ pageBreakAfter: "always" }}></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
