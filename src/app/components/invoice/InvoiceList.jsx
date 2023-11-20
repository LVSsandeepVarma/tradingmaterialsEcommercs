import React, { useEffect, useState } from "react";
import Header from "../header/header";
import "../dashboard/dashboard.css";
import Footer from "../footer/footer";
import "./viewInvoice.css";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import axios from "axios";
import { FaDownload, FaEye } from "react-icons/fa6";
export default function InvoiceList() {
  const [viewOrderDetails, setViewOrderDetails] = useState();
  const [orderData, setOrderData] = useState()
  const dispatch = useDispatch();
  const loaderState = useSelector((state) => state?.loader?.value);

  useEffect(() => {
    const viewOrderDetails = async () => {
      try {
        dispatch(showLoader());
          const response = await axios.get(
            `https://admin.tradingmaterials.com/api/client/get-orders?type=${"placed"}`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("client_token"),
              },
            }
          );

          if (response?.data?.status) {
            setViewOrderDetails(response?.data?.data);
            setOrderData(response?.data?.data?.orders)
          }
        
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoader());
      }
    };

    viewOrderDetails();
  }, []);

  function handleSearch(value)
  {
    if (value == "") {
      setOrderData(viewOrderDetails?.orders)
    } else {
      const filteredData = viewOrderDetails?.orders?.filter((order) => order?.email?.includes(value))
      console.log(filteredData, value, "texxxt")
      setOrderData([...filteredData])
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
                          <span className="badge badge-custom ms-2">4</span>
                        </div>
                        <div
                          className="input-group mb-0"
                          style={{ width: "350px" }}
                        >
                          <input
                            type="text"
                            className="form-control px-2 py-1"
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
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-12">
                            <table className="table table-responsive w-full">
                              <thead>
                                <tr>
                                  <th
                                    style={{
                                      background: "#f1f2f7!important",
                                      borderBottom: "1px solid #c8c8c8",
                                      color: "grey!important",
                                    }}
                                  >
                                    Order No
                                  </th>
                                  <th
                                    style={{
                                      background: "#f1f2f7!important",
                                      borderBottom: "1px solid #c8c8c8",
                                      color: "grey!important",
                                    }}
                                  >
                                    Email
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
                                    Status
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
                              <tbody>
                                {orderData?.length > 0 &&
                                  orderData?.map((order, ind) => (
                                    <tr
                                      className="invoice_list border-b"
                                      key={ind}
                                    >
                                      <td
                                        style={{ padding: "10px" }}
                                        className="text-primary border-none"
                                      >
                                        #{order?.order_number}
                                      </td>
                                      <td
                                        className="border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        {order?.email}
                                      </td>
                                      {/* <td style={{ padding: "10px" }}>
                                      Trading Material
                                    </td> */}
                                      <td
                                        className="border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        <span className="badge bg-warning">
                                          ₹{order?.sub_total}
                                        </span>
                                      </td>
                                      <td
                                        className="border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        {new Date(
                                          order?.created_at
                                        ).toLocaleDateString()}
                                      </td>
                                      <td
                                        className="border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        <span className="badge bg-success">
                                          {viewOrderDetails?.type}
                                        </span>{" "}
                                      </td>
                                      <td
                                        className="flex justify-center gap-2 items-center border-none"
                                        style={{ padding: "10px" }}
                                      >
                                        <FaEye />
                                        <FaDownload />
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                            {!orderData?.length && (
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
