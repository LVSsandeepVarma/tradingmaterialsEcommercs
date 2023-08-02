import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../footer/footer";
import { hideLoader, showLoader } from "../../../../features/loader/loaderSlice";
import Header from "../../header/header";
import axios from "axios";
import { useParams } from "react-router-dom";
import { fetchAllProducts } from "../../../../features/products/productsSlice";



export default function ProductDetails() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state?.products?.value);
  const loaderState = useSelector(state => state?.loader?.value);
  const [product, setProduct] = useState({});

  const [subCatProducts, setSubCatProducts] = useState([]);



  function getRandomNumberWithOffset(number) {
    // Define an array of possible offsets: 5, 10, and 20.
    const offsets = [15, 50, 80];

    // Generate a random index within the valid range of offsets array.
    const randomIndex = Math.floor(Math.random() * offsets.length);

    // Get the random offset based on the selected index.
    const randomOffset = offsets[randomIndex];

    // Add the random offset to the input number.
    const result = parseInt(number) + randomOffset;
    return result;
  }

  function ratingStars(number) {
    const elemetns = Array.from({ length: number }, (_, index) => (
      <li key={index}>
        <em className="icon ni ni-star-fill text-yellow"></em>
      </li>
    ));

    return <ul className="d-flex align-items-center">{elemetns}</ul>;
  }

  console.log(products);

  const {id}  =useParams()

  async function fetchProductdetails(){
    
    console.log(id)
    try{
      dispatch(showLoader())
      const response = await axios.get(`https://admin.tradingmaterials.com/api/get/products-details?product_id=${id}`,{ headers:{
        "x-api-secret":"XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
        "Accept":"application/json"
      }})
      if(response?.data?.status){
        setProduct(response?.data?.data)
      }
    }catch(err){
      console.log(err)
    }finally{
      dispatch(hideLoader());
    }
      
      
  }
  useEffect(() => {
    // fetchProducts();
    
    setSubCatProducts(products?.products);
    fetchProductdetails()
  }, []);

  useEffect(()=>{
    async function fetchProducts (){
      
      dispatch(showLoader())
      try {
          const response = await axios.get("https://admin.tradingmaterials.com/api/get/products", {
              headers: {
                  "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
                  "Accept": "application/json"
              }
          })
          if (response?.data?.status) {
              dispatch(fetchAllProducts(response?.data?.data))
              setSubCatProducts(response?.data?.data?.products)

          }
      } catch (err) {
          console.log("err")
      }finally{
        dispatch(hideLoader())
      }
  }

  fetchProducts()
  },[])

  // function ratingStars(number) {
  //   const elemetns = Array.from({ length: number }, (_, index) => (
  //     <li key={index}>
  //       <em className="icon ni ni-star-fill text-yellow"></em>
  //     </li>
  //   ));

  //   return <ul className="d-flex align-items-center">{elemetns}</ul>;
  // }

  return (
    <>
      <div className="nk-body">
        <div className="nk-body-root">
          {loaderState && (
            <div className="preloader">
              <div className="loader"></div>
            </div>
          )}

          <Header />
          <main className="nk-pages">
            <section className="nk-section nk-section-product-details pb-lg-7 pt-120 pt-lg-180">
              <div className="container">
                <div className="nk-section-content">
                  <div className="row gy-5 gy-md-7 gy-lg-0 justify-content-lg-between">
                    <div className="col-lg-6">
                      <div className="swiper product-slider-lg mb-5">
                        <div className="swiper-wrapper">
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_1 === null ? "/images/shop/slider-cover-1.jpg" : product?.product?.img_1}
                              className="w-100"
                            />
                          </div>
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_2 === null ? "/images/shop/slider-cover-2.jpg" : product?.product?.img_2}
                              className="w-100"
                            />
                          </div>
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_3 === null ? "/images/shop/slider-cover-3.jpg" : product?.product?.img_3}
                              className="w-100"
                            />
                          </div>
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_4 === null ? product?.product?.img_1 : product?.product?.img_4}
                              className="w-100"
                            />
                          </div>
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_5 === null ? product?.product?.img_2 : product?.product?.img_5}
                              className="w-100"
                            />
                          </div>
                        </div>
                      </div>
                      <div thumbsSlider="" className="swiper product-slider-sm">
                        <div className="swiper-wrapper">
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_1 === null ? "/images/shop/slider-cover-1.jpg" : product?.product?.img_1}
                              className="w-100"
                            />
                          </div>
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_2 === null ? "/images/shop/slider-cover-2.jpg" : product?.product?.img_2}
                              className="w-100"
                            />
                          </div>
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_3 === null ? "/images/shop/slider-cover-3.jpg" : product?.product?.img_3}
                              className="w-100"
                            />
                          </div>
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_4 === null ? product?.product?.img_1 : product?.product?.img_4}
                              className="w-100"
                            />
                          </div>
                          <div className="swiper-slide">
                            <img
                              src={product?.product?.img_5 === null ? product?.product?.img_2 : product?.product?.img_5}
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-xl-5">
                      <div>
                        <div>
                          <div className="pb-3 border-bottom">
                            <span className="fs-14 text-gray-1200 text-uppercase fw-semibold">
                              {product?.product?.name}
                            </span>
                            <div className="text-sm" dangerouslySetInnerHTML={{
                                            __html: product?.product?.description,
                                          }} />
                          </div>
                          <div className="d-flex gap-4 align-items-center pt-1">
                            <div className="d-flex gap-1 align-items-center">
                            {ratingStars(product?.product?.rating)}
                              <p className="fs-14">(7 Reviews)</p>
                            </div>
                            <a
                              href="#"
                              className="d-flex align-items-center text-gray-1200"
                            >
                              <em className="icon ni ni-edit-alt text-gray-800"></em>
                              <span className="fs-14 ms-1">Write A Review</span>
                            </a>
                          </div>
                        </div>
                        <div className="nk-product-specification py-5">
                          <div className="nk-product-specification-content">
                            <h6 className="fs-16 m-0 w-50">Availability:</h6>
                            <p className="fs-16 text-gray-800 w-50">{product?.stock}</p>
                          </div>
                          <div className="nk-product-specification-content">
                            <h6 className="fs-16 m-0 w-50">Brand:</h6>
                            <p className="fs-16 text-gray-800 w-50">
                              Rubberised Material
                            </p>
                          </div>
                          <div className="nk-product-specification-content">
                            <h6 className="fs-16 m-0 w-50">Size:</h6>
                            <p className="fs-16 text-gray-800 w-50">
                              (32 inch x13inch) Large enough to have mouse,
                              keyboard and other desk items]
                            </p>
                          </div>
                          <div className="nk-product-specification-content">
                            <h6 className="fs-16 m-0 w-50">Product Code:</h6>
                            <p className="fs-16 text-gray-800 w-50">
                              Product 20
                            </p>
                          </div>
                          <div className="nk-product-specification-content">
                            <h6 className="fs-16 m-0 w-50">Mode of Payment:</h6>
                            <p className="fs-16 text-gray-800 w-50">
                              Cash on Delivery / Online Banking
                            </p>
                          </div>
                          <div className="nk-product-specification-content">
                            <h6 className="fs-16 m-0 w-50">
                              7 Day Free Replacement:
                            </h6>
                            <p className="fs-16 text-gray-800 w-50">
                              Replace your item within 7 days.
                            </p>
                          </div>
                          <div className="nk-product-specification-content">
                            <h6 className="fs-16 m-0 w-50">
                              Fast/Free Shipping
                            </h6>
                            <p className="fs-16 text-gray-800 w-50">
                              All orders are shipped free within 24 hours
                            </p>
                          </div>
                          <div className="nk-product-specification-content">
                            <h6 className="fs-16 m-0 w-50">Quantity:</h6>
                            <div className="w-50">
                              <div id="counter" className="nk-counter">
                                <button id="decrement">-</button>
                                <span id="count">0</span>
                                <button id="increment">+</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="position-relative overflow-hidden bg-blue-300 rounded p-4">
                          <h4 className="mb-4">$450.00</h4>
                          <p className="fs-14 text-gray-1200">
                            <em className="icon ni ni-plus-circle-fill text-primary me-1"></em>
                            <span>Add Nio care pius service from $39</span>
                          </p>
                          <ul className="d-flex align-items-center gap-2">
                            <li>
                              <button className="btn btn-primary">
                                Buy Now
                              </button>
                            </li>
                            <li>
                              <button className="btn btn-white text-primary">
                                Add To Cart
                              </button>
                            </li>
                          </ul>
                          <div className="d-flex align-items-center gap-1 pt-4">
                            <em className="icon ni ni-heart-fill text-primary "></em>
                            <p className="fs-16 fw-semibold text-gray-1200">
                              {" "}
                              Add to WishList{" "}
                              <span className="fs-14 text-gray-800 fw-normal">
                                (32,145 Adds)
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="pt-5">
                          <p className="fs-14">
                            {" "}
                            Must explain to you how all this mistaken idea of
                            denouncing pleasure and praising pain was born and I
                            will give you a complete account of the system, and
                            expound.{" "}
                          </p>
                          <div className="nk-social d-sm-flex align-items-center gap-3 pb-2">
                            <h6 className="fs-14 m-0 fw-semibold text-uppercase mb-2 mb-sm-0">
                              Share :
                            </h6>
                            <ul>
                              <li>
                                <a
                                  href="#"
                                  className="d-flex align-items-center text-gray-1200"
                                >
                                  <em className="icon ni ni-facebook-f text-primary"></em>
                                  <p className="fs-14 text-nowrap fw-semibold ms-1">
                                    Facebook{" "}
                                    <span className=" fs-14 text-gray-800">
                                      120
                                    </span>
                                  </p>
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  className="d-flex align-items-center text-gray-1200"
                                >
                                  <em className="icon ni ni-twitter text-primary"></em>
                                  <p className="fs-14 text-nowrap fw-semibold ms-1">
                                    Twitter{" "}
                                    <span className=" fs-14 text-gray-800">
                                      60
                                    </span>
                                  </p>
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  className="d-flex align-items-center text-gray-1200"
                                >
                                  <em className="icon ni ni-snapchat text-primary"></em>
                                  <p className="fs-14 text-nowrap fw-semibold ms-1">
                                    Snap Chat{" "}
                                    <span className=" fs-14 text-gray-800">
                                      80
                                    </span>
                                  </p>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="nk-nav-tabs nav-tabs-s2 py-5 py-lg-7">
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#tab-1"
                        >
                          {" "}
                          Product Details{" "}
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#tab-2"
                          disabled
                        >
                          {" "}
                          Reviews (242){" "}
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#"
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#tab-3"
                          disabled
                        >
                          {" "}
                          Shipping & Payment{" "}
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content pt-5" id="myTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="tab-1"
                        tabindex="0"
                      >
                        <div className="mb-5">
                          <h5 className="mb-2">Product Description</h5>
                          <p className="fs-16 text-gray-1200 text-left"  dangerouslySetInnerHTML={{
                                            __html: product?.product?.long_desc,
                                          }}/>
                            
                        </div>
                        <div className="row">
                          <div className="col-lg-10 col-xl-8">
                            <div className="row flex-row-reverse gy-5 gy-md-0">
                              <div className="col-md-6">
                                <div>
                                  <h6 className="mb-3">Care & Instructions</h6>
                                  <p className="fs-16 text-gray-1200">
                                    {" "}
                                    Introducing our premium product, designed to
                                    meet your needs with style and
                                    functionality. Crafted with utmost care and
                                    attention to detail, this product combines
                                    durability and aesthetic appeal.
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <h6 className="mb-3">Item Details</h6>
                                <ul className="d-flex flex-column gap-1">
                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Brand:{" "}
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      Rubberised Material
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Product Code:{" "}
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      Product 20
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Reference:
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      455656ssss562
                                    </p>
                                  </li>

                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Reward Points:
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      Nio Fashion
                                    </p>
                                  </li>

                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Condition:
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      Fress
                                    </p>
                                  </li>
                                  <li className="d-flex align-items-center justify-content-between">
                                    <h6 className="fs-14 text-uppercase text-gray-1200 w-50">
                                      Availability:
                                    </h6>
                                    <p className="fs-16 text-gray-j800 w-50">
                                      In Stock
                                    </p>
                                  </li>
                                </ul>
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
            <section className="nk-section pt-lg-0">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="nk-section-head pb-5">
                      <h2 className="nk-section-title">Trading Bundles</h2>
                    </div>
                  </div>
                </div>
                <div className="row gy-5 justify-center">
              {subCatProducts?.length !== 0 &&
                subCatProducts?.map((product, indx) => {
                  if (product?.combo) {
                    return (
                      // product?.getproducts?.map((comboProduct, n)=>(
                      <div
                        className="col-xl-4 col-lg-4 col-md-6"
                        data-aos="fade-up"
                        data-aos-delay="0"
                      >
                        <div className="nk-card overflow-hidden rounded-3 border h-100">
                          <div className="nk-card-img">
                            <a href="/">
                              <img
                                src={product?.img_1}
                                alt="product-image"
                                className="w-100"
                              />
                            </a>
                          </div>
                          <div className="nk-card-info bg-white p-4">
                            <a
                              href="/"
                              className="d-inline-block mb-1 line-clamp-1 h5"
                            >
                              {product?.name}
                              <br />
                              <span className="text-xs">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: product?.description,
                                  }}
                                />
                              </span>
                            </a>
                            <div className="d-flex align-items-center mb-2 gap-1">
                              {ratingStars(5)}
                              <span className="fs-14 text-gray-800">
                                {" "}
                                (7 Reviews){" "}
                              </span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              {product?.prices?.map((price, ind) => (
                                <p className="fs-18 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                                  {price?.USD &&
                                    Number.parseFloat(price?.USD).toFixed(2)}
                                  {price?.USD && (
                                    <del className="text-gray-800 !ml-2">
                                      $
                                      {getRandomNumberWithOffset(
                                        Number.parseFloat(price?.USD).toFixed(2)
                                      )}
                                    </del>
                                  )}
                                </p>
                              ))}
                              <button className="p-0 border-0 outline-none bg-transparent text-primary">
                                <em className="icon ni ni-cart"></em>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      // ))
                    );
                  }
                })}
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
