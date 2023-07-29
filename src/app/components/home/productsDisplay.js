import React, { useEffect, useState } from "react";
import Countdown from "./countdown";
import { useSelector } from "react-redux";

export default function ProductsDisplay() {
  const [megaDealTime, setMegaDealTime] = useState("2023-08-31T00:00:00");
  const products = useSelector((state) => state?.products?.value);
//   console.log(products.products[5]?.prices[0]);
let totalCount =0;
useEffect(()=>{
    products?.sub_categories?.forEach(element => {
        if(element?.combo ===0){
            return totalCount += element?.product_count
        }
        
    });
          
      console.log(totalCount)
},[products])

function getRandomNumberWithOffset(number) {
    // Define an array of possible offsets: 5, 10, and 20.
    const offsets = [15, 50, 80];
  
    // Generate a random index within the valid range of offsets array.
    const randomIndex = Math.floor(Math.random() * offsets.length);
  
    // Get the random offset based on the selected index.
    const randomOffset = offsets[randomIndex];
  
    // Add the random offset to the input number.
    const result = parseInt(number) + randomOffset;
    console.log(number, result)
    return result;

}  

function ratingStars(number) {
    const elemetns = Array.from({length: number},(_, index) => (
        <li key={index}>
                                    <em className="icon ni ni-star-fill text-yellow"></em>
                                  </li>
    ))

    return                               <ul className="d-flex align-items-center">{elemetns}</ul>

}

  return (
    <>
      <div className="nk-pages">
        <section className="nk-banner nk-banner-shop">
          <div className="container">
            <div className="nk-banner-wrap">
              <div className="nk-banner-content position-relative">
                <div className="row align-items-center justify-content-around">
                  <div className="col-xl-5">
                    <div className="nk-frame text-center mb-7 mb-xl-0">
                      <img
                        src="images/shop/banner-cover.png"
                        alt="banner-cover"
                        data-aos="zoom-in"
                      />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="text-center text-xl-start">
                      <div className="mb-5">
                        <h1 className="text-capitalize display-6 mb-2">
                          MEGA DEAL
                        </h1>
                        <p className="m-0 text-gray-800">
                          {" "}
                          Hurry and get discounts on selected products up to 60%{" "}
                        </p>
                      </div>
                      <Countdown targetDate={megaDealTime} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="nk-section nk-section-products">
          <div className="container">
            <div className="nk-section-content">
              <div className="row">
                <div className="col-lg-3">
                  <div className="nk-section-content-sidebar">
                    <div className="mb-4">
                      <form data-action="#">
                        <div className="form-group nk-newsletter-three">
                          <div className="form-control-wrap">
                            <div className="icon">
                              <em className="icon ni ni-search"></em>
                            </div>
                            <input
                              type="email"
                              name="email"
                              className="form-control py-2 ps-7 border"
                              placeholder="Enter Your Email"
                              required
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="d-flex flex-column gap-5">
                      <div>
                        <h6 className="mb-3">Trading Materials</h6>
                        <ul className="d-flex gy-4 flex-column">
                          <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="category"
                                id="all-category"
                                checked
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <label
                                  className="form-check-label fs-14 text-gray-1200"
                                  for="all-category"
                                >
                                  All Trading Materials
                                </label>
                                <span className="fs-14 text-gray-1200">
                                  
                                </span>
                              </div>
                            </div>
                          </li>
                          {products?.sub_categories?.map((product, ind)=>(
                            <>
                          {product?.combo == 0 && <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="category"
                                id="tablet"
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <label
                                  className="form-check-label fs-14 text-gray-1200"
                                  for="tablet"
                                >
                                  {product?.name}
                                </label>
                                <span className="fs-14 text-gray-1200">{product?.product_count}</span>
                              </div>
                            </div>
                          </li>}
                          </>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="mb-3">Bundles</h6>
                        <ul className="d-flex gy-4 flex-column">
                          <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="brand"
                                id="themenio"
                                checked
                              />
                              <label
                                className="form-check-label fs-14 text-gray-1200"
                                for="themenio"
                              >
                                {" "}
                                All Trading Materials Pack on Shop{" "}
                                <p>{totalCount}</p>
                              </label>
                              
                            </div>
                          </li>
                          {products?.sub_categories?.map((product, ind)=>(
                            <>
                          {product?.combo == 1 && <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="category"
                                id="tablet"
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <label
                                  className="form-check-label fs-14 text-gray-1200"
                                  for="tablet"
                                >
                                  {product?.name}
                                </label>
                                <span className="fs-14 text-gray-1200">{product?.product_count}</span>
                              </div>
                            </div>
                          </li>}
                          </>
                          ))}

                        </ul>
                      </div>
                      <div>
                        <h6 className="mb-3">Stock Status</h6>
                        <ul className="d-flex gy-4 flex-column">
                          <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="stock"
                                id="in-stock"
                                checked
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <label
                                  className="form-check-label fs-14 text-gray-1200"
                                  for="in-stock"
                                >
                                  In Stock
                                </label>
                                <span className="fs-14 text-gray-1200">{products?.inStock}</span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="form-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="stock"
                                id="out-stock"
                              />
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <label
                                  className="form-check-label fs-14 text-gray-1200"
                                  for="out-stock"
                                >
                                  Out Of Stock
                                </label>
                                <span className="fs-14 text-gray-1200">{products?.outStock}</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="nk-section-content-products">
                    <div className="row justify-content-between align-items-center pb-5">
                      <div className="col-sm-6">
                        <h6 className="fs-16 fw-normal">
                          Showing all 6 results
                        </h6>
                      </div>
                      <div className="col-sm-4 col-md-3 col-xl-2">
                        <div className="nk-dropdown py-1 ps-2 pe-1 border rounded">
                          <input
                            type="checkbox"
                            className="nk-dropdown-field"
                            id="nk-sorting"
                            hidden
                          />
                          <label for="nk-sorting" className="nk-dropdown-menu">
                            <ul
                              className="nk-dropdown-filter"
                              role="listbox"
                              tabindex="-1"
                            >
                              <li
                                className="nk-dropdown-filter-selected"
                                aria-selected="true"
                              >
                                <span className="fs-14 text-gray-1200">
                                  Default Sorting
                                </span>
                              </li>
                              <li>
                                <ul className="nk-dropdown-select">
                                  <li
                                    className="nk-dropdown-select-option py-2"
                                    role="option"
                                  >
                                    <span className="fs-14 text-gray-1200">
                                      Popular
                                    </span>
                                  </li>
                                  <li
                                    className="nk-dropdown-select-option py-2"
                                    role="option"
                                  >
                                    <span className="fs-14 text-gray-1200">
                                      Newest
                                    </span>
                                  </li>
                                  <li
                                    className="nk-dropdown-select-option py-2"
                                    role="option"
                                  >
                                    <span className="fs-14 text-gray-1200">
                                      Oldest
                                    </span>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row gy-5">
                        {products !== {} && products?.products?.map((product,ind)=>(
                      <div className="col-md-6 col-xl-4">
                        <div className="nk-card overflow-hidden rounded-3 h-100 border">
                          <div className="nk-card-img">
                            <a href="product-details.php">
                              <img
                                src={product?.img_1}
                                alt="product-image"
                                className="w-100"
                              />
                            </a>
                          </div>
                          <div className="nk-card-info bg-white p-4">
                            <a
                              href="product-details.php"
                              className="d-inline-block mb-1 line-clamp-1 h5"
                            >
                               {product?.name}
                            </a>
                            <div className="d-flex align-items-center mb-2 gap-1">
                                {ratingStars(product?.rating)}
                              
                              <span className="fs-14 text-gray-800">
                                {" "}
                                (7 Reviews){" "}
                              </span>
                            </div>
                            <div className="d-flex align-items-center justify-content-start">
                            {product?.prices?.map((price,ind)=>(
                              <p className="fs-18 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                              {price?.USD && Number.parseFloat(price?.USD).toFixed(2)}
                              {price?.USD && <del className="text-gray-800 !ml-2">${getRandomNumberWithOffset(Number.parseFloat(price?.USD).toFixed(2))}</del>}
                              </p>
                              ))}
                              
                              <button className="p-0 border-0 outline-none bg-transparent text-primary">
                                <em className="icon ni ni-cart"></em>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="nk-section  pt-lg-0">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="nk-section-head">
                  <h2 className="nk-section-title">Trading Bundles</h2>
                </div>
              </div>
            </div>
            <div className="row gy-5 justify-center">
              
                {products !== {} && products?.products?.map((product,indx)=>{
                    if(product?.combo){
                        return (
                        // product?.getproducts?.map((comboProduct, n)=>(
                            <div
                className="col-xl-4 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="0"
              >
                            <div className= "nk-card overflow-hidden rounded-3 border h-100">
                  <div className="nk-card-img">
                    <a href="product-details.php">
                      <img
                        src={product?.img_1}
                        alt="product-image"
                        className="w-100"
                      />
                    </a>
                  </div>
                  <div className="nk-card-info bg-white p-4">
                    <a
                      href="product-details.php"
                      className="d-inline-block mb-1 line-clamp-1 h5"
                    >
                     {product?.name}
                      <br />
                      <span className="text-xs">
                        <p dangerouslySetInnerHTML={{__html: product?.description}} />
                      </span>
                    </a>
                    <div className="d-flex align-items-center mb-2 gap-1">
                      {ratingStars(product?.rating)}
                      <span className="fs-14 text-gray-800"> (7 Reviews) </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                    {product?.prices?.map((price,ind)=>(
                              <p className="fs-18 m-0 text-gray-1200 text-start fw-bold !mr-2 ">
                              {price?.USD && Number.parseFloat(price?.USD).toFixed(2)}
                              {price?.USD && <del className="text-gray-800 !ml-2">${getRandomNumberWithOffset(Number.parseFloat(price?.USD).toFixed(2))}</del>}
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
                )}
                })}
                
              
            </div>
          </div>
        </section>

        <section className="nk-section nk-cta-section">
          <div className="container">
            <div
              className="nk-cta-wrap bg-primary-gradient rounded-3 is-theme p-5 p-lg-7"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="row g-gs align-items-center">
                <div className="col-lg-8">
                  <div className="media-group flex-column flex-lg-row align-items-center">
                    <div className="media media-lg media-circle media-middle text-bg-white text-primary mb-2 mb-lg-0 me-lg-2">
                      <em className="icon ni ni-chat-fill"></em>
                    </div>
                    <div className="text-center text-lg-start">
                      <h3 className="text-capitalize m-0">
                        Chat with our support team!
                      </h3>
                      <p className="fs-16 opacity-75">
                        Get in touch with our support team if you still can’t
                        find your answer.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                  <a
                    href="contact-us.php"
                    className="btn btn-white fw-semiBold"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
