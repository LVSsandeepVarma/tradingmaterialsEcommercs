import * as React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { useEffect } from "react";
import { useState } from "react";
import ViewOrderModal from "../modals/viewOrder";

export default function Invoices() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false)
  const [orders, setOrders] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [orderId, setOrderId] = useState();
  const loaderState = useSelector((state) => state?.loader?.value);
  const userData = useSelector((state) => state?.user?.value);
  useEffect(() => {
    const fetchOrders = async () => {
      
      try {
        
        dispatch(showLoader());
        const token = localStorage.getItem("client_token");
        console.log(token)
        const response = await axios.get(
          `https://admin.tradingmaterials.com/api/client/product/checkout/order-list?client_id=${userData?.client?.id}`,
          {
            headers: {
              Authorization: "Bearer "+token,
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
  }, [userData]);

  const hideModal = ()=>{
    setShowModal(false)
  }



  return (
    <>
    {loaderState && (
            <div className="preloader !backdrop-blur-[1px]">
              <div className="loader"></div>
            </div>
          )}
    {showModal && <ViewOrderModal show={showModal} onHide={hideModal} orderId={orderId}/>}
    {orders?.length ===0 && <p>Your Orders are empty</p>}
    <main className="nk-pages">
            <section className="nk-banner nk-banner-career-job-details  bg-gray">
                <div className="nk-banner-wrap pt-120 pt-lg-180 pb-lg-320">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-xxl-5">
                                <div><a href="product-details.php" className="btn-link mb-2"><em className="icon ni ni-arrow-left"></em><span>Back to Lists</span></a>
                                    <h1 className="mb-3">Your Orders</h1>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </section>
            <section className="nk-section nk-section-job-details pt-lg-0">
                <div className="container">
                    <div className="nk-section-content row px-lg-3">
                        <div className="col-lg-8 pe-lg-0 padding">
                            <div className="nk-entry pe-lg-5 py-lg-1">
                                <div className="table-responsive">
									<table className="table">
										<thead className="table-success">
											<tr>
												<th>SHIP TO<br/><span className="th-tex">B 12, Shop No2, Mukherjee Nagar, Delhi, India</span></th>
												<th>SHIP TO PINCODE<br/><span className="th-tex">110009</span></th>
												<th>DELIVERY STATUS<br/><span className="th-tex">Ready To Deliver</span></th>
												<th>ORDER ID<br/><span className="th-tex">123-45678</span></th>
												<th>INVOICE</th>
											</tr>
										</thead>
									</table>
										
									<table className="table">
										<thead>
											<th colSpan="3" className="th-text-1">
												Delivered Saturday
											</th>
										</thead>
										<tbody>
											<tr>
												<td className="product-img">
													<img src="images/product-img-1.jpg" alt="product image" />
												</td>
												<td>
													<table>
														<tr>
															<td className="td-text-1">Price Action & Setup Posters - Volume 2</td>
														</tr>
														
														<tr>
															<td className="td-text-2">Return eligible through 15-Jun-2023</td>
														</tr>
														
														<tr>
															<td className="td-btn"><a href="#" className="btn btn-outline-dark border"><span style={{fontSize:"14px"}}>View order details</span></a></td>
														</tr>
													</table>
												</td>
												<td colSpan="3" className="td-btn-center">
													<a href="#" className="btn btn-outline-dark border w-100 mt-4 margin-space"><span style={{fontSize:"14px"}}>Shipped To</span></a><br/>
													<a href="#" className="btn btn-outline-dark border w-100 margin-space"><span style={{fontSize:"14px"}}>Track Order</span></a><br/>
													<a href="#" className="btn btn-outline-dark border w-100 margin-space"><span style={{fontSize:"14px"}}>Review Product</span></a><br/>
													<a href="#" className="btn btn-outline-dark border w-100"><span style={{fontSize:"14px"}}>Contact Support</span></a>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
                            </div>
							
							<div className="nk-entry pe-lg-5 py-lg-1">
                                <div className="table-responsive">
									<table className="table">
										<thead className="table-success">
											<tr>
												<th>SHIP TO<br/><span className="th-tex">159, 26th Main, 32nd &apos; G &apos; Cross, Jayanagar Bangalore, India</span></th>
												<th>SHIP TO PINCODE<br/><span className="th-tex">560041</span></th>
												<th>DELIVERY STATUS<br/><span className="th-tex">Ready To Pack</span></th>
												<th>ORDER ID<br/><span className="th-tex">456-78900</span></th>
												<th>INVOICE</th>
											</tr>
										</thead>
									</table>
										
									<table className="table">
										<thead>
											<th colSpan="3" className="th-text-1">
												Delivered Friday
											</th>
										</thead>
										<tbody>
											<tr>
												<td className="product-img">
													<img src="images/product-img-2.jpg" alt="product image" />
												</td>
												<td>
													<table>
														<tr>
															<td className="td-text-1">Candlestick Chart Patterns Posters – Volume 1</td>
														</tr>
														
														<tr>
															<td className="td-text-2">Return eligible through 22-July-2023</td>
														</tr>
														
														<tr>
															<td className="td-btn"><a href="#" className="btn btn-outline-dark border"><span style={{fontSize:"14px"}}>View order details</span></a></td>
														</tr>
													</table>
												</td>
												<td colSpan="3" className="td-btn-center">
													<a href="#" className="btn btn-outline-dark border w-100 mt-4 margin-space"><span style={{fontSize:"14px"}}>Shipped To</span></a><br/>
													<a href="#" className="btn btn-outline-dark border w-100 margin-space"><span style={{fontSize:"14px"}}>Track Order</span></a><br/>
													<a href="#" className="btn btn-outline-dark border w-100 margin-space"><span style={{fontSize:"14px"}}>Review Product</span></a><br/>
													<a href="#" className="btn btn-outline-dark border w-100"><span style={{fontSize:"14px"}}>Contact Support</span></a>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
                            </div>
							
							<div className="nk-entry pe-lg-5 py-lg-1">
                                <div className="table-responsive">
									<table className="table">
										<thead className="table-success">
											<tr>
												<th>SHIP TO<br/><span className="th-tex">Shop No8, Manas Soc, Sec No 6, Airoli, Navi Mumbai, India</span></th>
												<th>SHIP TO PINCODE<br/><span className="th-tex">400708</span></th>
												<th>DELIVERY STATUS<br/><span className="th-tex">Product Replacement</span></th>
												<th>ORDER ID<br/><span className="th-tex">123-45678</span></th>
												<th>INVOICE</th>
											</tr>
										</thead>
									</table>
										
									<table className="table">
										<thead>
											<th colSpan="3" className="th-text-1">
												Delivered 04-Agu-2023
											</th>
										</thead>
										<tbody>
											<tr>
												<td className="product-img">
													<img src="images/product-img-3.jpg" alt="product image" />
												</td>
												<td>
													<table>
														<tr>
															<td className="td-text-1">Pack of 4: Book & Journal & Trading Cards and Mouse Pad</td>
														</tr>
														
														<tr>
															<td className="td-text-2">Return eligible through 09-Aug-2023</td>
														</tr>
														
														<tr>
															<td className="td-btn"><a href="#" className="btn btn-outline-dark border"><span style={{fontSize:"14px"}}>View order details</span></a></td>
														</tr>
													</table>
												</td>
												<td colSpan="3" className="td-btn-center">
													<a href="#" className="btn btn-outline-dark border w-100 mt-4 margin-space"><span style={{fontSize:"14px"}}>Shipped To</span></a><br/>
													<a href="#" className="btn btn-outline-dark border w-100 margin-space"><span style={{fontSize:"14px"}}>Track Order</span></a><br/>
													<a href="#" className="btn btn-outline-dark border w-100 margin-space"><span style={{fontSize:"14px"}}>Review Product</span></a><br/>
													<a href="#" className="btn btn-outline-dark border w-100"><span style={{fontSize:"14px"}}>Contact Support</span></a>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
                            </div>
							
							<div className="row mt-2">
								<div className="col-lg-3 col-md-6 col-sm-12">
									<div className="mb-3">
										<a href="#" className="btn-link text-primary "><span>Write a review</span><em className="icon ni ni-arrow-right"></em></a>
									</div>
								</div>
								
								<div className="col-lg-3 col-md-6 col-sm-12">
									<div className="mb-3">
										<a href="#" className="btn-link text-primary "><span>Buy It Again</span><em className="icon ni ni-arrow-right"></em></a>
									</div>
								</div>
								
								<div className="col-lg-3 col-md-6 col-sm-12">
									<div className="mb-3">
										<a href="#" className="btn-link text-primary "><span>Deliver on Date</span><em className="icon ni ni-arrow-right"></em></a>
									</div>
								</div>
								
								<div className="col-lg-3 col-md-6 col-sm-12">
									<div className="mb-3">
										<a href="#" className="btn-link text-primary "><span>Bordering</span><em className="icon ni ni-arrow-right"></em></a>
									</div>
								</div>
							</div>
                        </div>
                        <div className="col-lg-4 ps-lg-0">
                            <div className="nk-section-blog-sidebar ps-lg-5 py-lg-5">
                                <div className="nk-section-blog-details">
                                    <h4 className="mb-3">Recently Delivered Items</h4>
									<div className="d-flex flex-column gap-2 pb-5">
										<div className="row">
											<div className="col-lg-5 ps-lg-3">
												<div className="gap-5 pb-5">
													<img src="images/small-img-1.jpg" alt="small-img" />
												</div>
											</div>
											
											<div className="col-lg-7 ps-lg-0">
												<div className="gap-5">
													<p className="m-0 fs-16 w-100 td-text-3">Day Trader Mouse Pad</p>
												</div>
												<div className="d-flex align-items-center mb-1 gap-1 mt-1">
													<ul className="d-flex align-items-center">
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                    </ul><span className="fs-14 text-gray-800"> (7 Reviews) </span>
												</div>
												
												<div className="d-flex align-items-center justify-content-between">
                                                    <p className="fs-18 m-0 text-gray-1200 fw-bold"> $44.00 - <del className="text-gray-800">$85.00</del></p>
												</div>
												
												<div className="pt-1">
													<button className="btn btn-outline-primary">Add To Cart</button>
												</div>
											</div>
										</div>
										<hr/>
										<div className="row mt-2">
											<div className="col-lg-5 ps-lg-3">
												<div className="gap-5 pb-5">
													<img src="images/small-img-2.jpg" alt="small-img" />
												</div>
											</div>
											
											<div className="col-lg-7 ps-lg-0">
												<div className="gap-5">
													<p className="m-0 fs-16 w-100 td-text-3">Trading Desk Mat</p>
												</div>
												<div className="d-flex align-items-center mb-1 gap-1 mt-1">
													<ul className="d-flex align-items-center">
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                    </ul><span className="fs-14 text-gray-800"> (7 Reviews) </span>
												</div>
												
												<div className="d-flex align-items-center justify-content-between">
                                                    <p className="fs-18 m-0 text-gray-1200 fw-bold"> $45.00 - <del className="text-gray-800">$95.00</del></p>
												</div>
												
												<div className="pt-1">
													<button className="btn btn-outline-primary">Add To Cart</button>
												</div>
											</div>
										</div>
										<hr/>
										<div className="row mt-2">
											<div className="col-lg-5 ps-lg-3">
												<div className="gap-5 pb-5">
													<img src="images/small-img-3.jpg" alt="small-img" />
												</div>
											</div>
											
											<div className="col-lg-7 ps-lg-0">
												<div className="gap-5">
													<p className="m-0 fs-16 w-100 td-text-3">Day Trading Journal</p>
												</div>
												<div className="d-flex align-items-center mb-1 gap-1 mt-1">
													<ul className="d-flex align-items-center">
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                    </ul><span className="fs-14 text-gray-800"> (7 Reviews) </span>
												</div>
												
												<div className="d-flex align-items-center justify-content-between">
                                                    <p className="fs-18 m-0 text-gray-1200 fw-bold"> $45.00 - <del className="text-gray-800">$95.00</del></p>
												</div>
												
												<div className="pt-1">
													<button className="btn btn-outline-primary">Add To Cart</button>
												</div>
											</div>
										</div>
										<hr/>
										<div className="row mt-2">
											<div className="col-lg-5 ps-lg-3">
												<div className="gap-5 pb-5">
													<img src="images/small-img-4.jpg" alt="small-img" />
												</div>
											</div>
											
											<div className="col-lg-7 ps-lg-0">
												<div className="gap-5">
													<p className="m-0 fs-16 w-100 td-text-3">Combo Trading Bundle</p>
												</div>
												<div className="d-flex align-items-center mb-1 gap-1 mt-1">
													<ul className="d-flex align-items-center">
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                        <li><em className="icon ni ni-star-fill text-yellow"></em></li>
                                                    </ul><span className="fs-14 text-gray-800"> (7 Reviews) </span>
												</div>
												
												<div className="d-flex align-items-center justify-content-between">
                                                    <p className="fs-18 m-0 text-gray-1200 fw-bold"> $44.00 - <del className="text-gray-800">$85.00</del></p>
												</div>
												
												<div className="pt-1">
													<button className="btn btn-outline-primary">Add To Cart</button>
												</div>
											</div>
										</div>
									</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
			
            <section className="nk-section nk-cta-section nk-section-content-1">
                <div className="container">
                    <div className="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7" data-aos="fade-up" data-aos-delay="100">
                        <div className="row g-gs align-items-center">
                            <div className="col-lg-8">
                                <div className="media-group flex-column flex-lg-row align-items-center">
                                    <div className="media media-lg media-circle media-middle text-bg-white text-primary mb-2 mb-lg-0 me-lg-2"><em className="icon ni ni-chat-fill"></em></div>
                                    <div className="text-center text-lg-start">
                                        <h3 className="text-capitalize m-0">Chat with our support team!</h3>
                                        <p className="fs-16 opacity-75">Get in touch with our support team if you still can’t find your answer.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 text-center text-lg-end"><a href="contact-us.php" className="btn btn-white fw-semiBold">Contact Support</a></div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
  );
}
