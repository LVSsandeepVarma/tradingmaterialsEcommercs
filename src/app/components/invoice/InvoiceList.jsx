import React, { useEffect, useState } from "react";
import Header from "../header/header";
import "../dashboard/dashboard.css";
import Footer from "../footer/footer";
import "./viewInvoice.css";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import CryptoJS from "crypto-js";
import { FaDownload, FaEye } from "react-icons/fa6";
export default function InvoiceList() {
  const [viewInvoiceDetails, setViewInvoiceDetails] = useState();
  const [invoiceData, setInvoiceData] = useState()
  const dispatch = useDispatch();
  const loaderState = useSelector((state) => state?.loader?.value);

  useEffect(() => {
    const viewInvoiceDetails = async () => {
      try {
        dispatch(showLoader());
          const response = await axios.get(
            `https://admin.tradingmaterials.com/api/client/get-invoices`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("client_token"),
              },
            }
          );

          if (response?.data?.status) {
            setViewInvoiceDetails(response?.data?.data?.invoices);
            setInvoiceData(response?.data?.data?.invoices)
          }
        
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoader());
      }
    };

    viewInvoiceDetails();
  }, []);

  function handleSearch(value)
  {
    if (value == "") {
      setInvoiceData(viewInvoiceDetails)
    } else {
      const filteredData = viewInvoiceDetails?.filter((invoice) => String(invoice?.number)?.startsWith(value))
      console.log(filteredData, value, "texxxt")
      setInvoiceData([...filteredData])
    }
  }

  
  return (
    <>
      <div className="nk-body" data-navbar-collapse="xl">
        {loaderState && (
          <div className="preloader">
            <div className="loader"></div>
          </div>
        )}
        <div className="nk-app-root">
          <Header />
          <main className="nk-pages">
            <section className="nk-section pt-120 pt-lg-100">
              <div className="nk-mask blur-1 left center"></div>
              <div className="container">
                <div className=" row mt-1">
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header px-3 py-1 d-flex align-items-center justify-content-between flex-wrap">
                        <div className="d-flex align-items-center">
                          <h5 className="text-muted mb-0">Invoices</h5>
                          <span className="badge badge-custom ms-2">{ invoiceData?.length}</span>
                        </div>
                        <div
                          className="input-group mb-0"
                          style={{ width: "350px" }}
                        >
                          <input
                            type="text"
                            className="form-control px-2 py-1 my-2 sm:my-0"
                            placeholder="Search Orders..."
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                              handleSearch(e?.target?.value);
                            }}
                          />
                          <span
                            className="input-group-text px-2 py-1"
                            id="basic-addon2"
                          >
                            <i className="fa-solid fa-magnifying-glass"></i>
                          </span>
                        </div>
                      </div>
                      <div className="card-body ">
                        <div className="row">
                          <div className="col-lg-12 !max-h-[60vh] overflow-y-auto">
                            <table className="table table-responsive w-full ">
                              <thead>
                                <tr>
                                  <th
                                    style={{
                                      background: "#f1f2f7!important",
                                      borderBottom: "1px solid #c8c8c8",
                                      color: "grey!important",
                                    }}
                                  >
                                    Invoice No
                                  </th>
                                  <th
                                    style={{
                                      background: "#f1f2f7!important",
                                      borderBottom: "1px solid #c8c8c8",
                                      color: "grey!important",
                                    }}
                                  >
                                    Order Id
                                  </th>
                                  {/* <th
                                    style={{
                                      background: "#f1f2f7!important",
                                      borderBottom: "1px solid #c8c8c8",
                                      color: "grey!important",
                                    }}
                                  >
                                    Product
                                  </th> */}
                                  <th
                                    style={{
                                      background: "#f1f2f7!important",
                                      borderBottom: "1px solid #c8c8c8",
                                      color: "grey!important",
                                    }}
                                  >
                                    Amount
                                  </th>
                                  <th
                                    style={{
                                      background: "#f1f2f7!important",
                                      borderBottom: "1px solid #c8c8c8",
                                      color: "grey!important",
                                    }}
                                  >
                                    Date
                                  </th>
                                  <th
                                    style={{
                                      background: "#f1f2f7!important",
                                      borderBottom: "1px solid #c8c8c8",
                                      color: "grey!important",
                                    }}
                                  >
                                    banance
                                  </th>
                                  <th
                                    style={{
                                      background: "#f1f2f7!important",
                                      borderBottom: "1px solid #c8c8c8",
                                      color: "grey!important",
                                    }}
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="">
                                {invoiceData?.length > 0 &&
                                  invoiceData?.map((invoice, ind) => (
                                    <tr
                                      className="invoice_list border-b"
                                      key={ind}
                                    >
                                      <td
                                        style={{ padding: "10px" }}
                                        className="text-primary border-none"
                                      >
                                        { invoice?.prefix}{invoice?.number}
                                      </td>
                                      <td
                                        className="border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        {invoice?.order_id}
                                      </td>
                                      {/* <td style={{ padding: "10px" }}>
                                      Trading Material
                                    </td> */}
                                      <td
                                        className="border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        <span className="badge bg-warning">
                                          ₹{invoice?.sub_total}
                                        </span>
                                      </td>
                                      <td
                                        className="border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        {
                                          invoice?.date_added
                                        }
                                      </td>
                                      <td
                                        className="border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        <span className="badge bg-success">
                                          {invoice?.balance}
                                        </span>{" "}
                                      </td>
                                      <td
                                        className="flex justify-start gap-2 items-center border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        <FaEye
                                          className="cursor-pointer"
                                          onClick={() => {
                                            // window.open(
                                            //   `${viewInvoiceDetails?.invoice?.invoicefile?.invoice_pdf}`,
                                            //   "_blank"
                                            // );
                                            window.open(
                                              `/view-invoice/${CryptoJS?.AES?.encrypt(
                                                `${invoice?.order_id}`,
                                                "trading_materials_order"
                                              )
                                                ?.toString()
                                                .replace(/\//g, "_")
                                                .replace(
                                                  /\+/g,
                                                  "-"
                                                )}/${CryptoJS?.AES?.encrypt(
                                                `${invoice?.invoice_pdf}`,
                                                "trading_materials_invoice_pdf"
                                              )
                                                ?.toString()
                                                .replace(/\//g, "_")
                                                .replace(/\+/g, "-")}`
                                            );
                                          }}
                                        />
                                        <FaDownload
                                          className="cursor-pointer"
                                          onClick={() => {
                                            window.open(
                                              `${invoice?.invoice_pdf}`,
                                              "_blank"
                                            );
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                            {!invoiceData?.length && (
                              <p className="text-center w-full">
                                Invoices Not found
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <p style={{ pageBreakAfter: "always" }}></p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
