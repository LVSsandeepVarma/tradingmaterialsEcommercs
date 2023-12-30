/* eslint-disable no-unused-vars */
import { Button } from "@mui/material";
import React, { useState } from "react"
import { Modal, ModalBody } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";


export default function OrderSuccessLogin() {
    const loaderState = useSelector((state) => state.loader?.value);

    // const dispatch = useDispatch()
    return (
      <>
        {loaderState && (
          <div className="preloader !backdrop-blur-[1px]">
            <div className="loader"></div>
          </div>
        )}
        <div className="nk-body !text-left">
          <div className="nk-body-root gradient-bg flex flex-col justify-between min-h-[100vh]">
            <div className="flex justify-between items-center p-2 !w-full">
              <img
                className="cursor-pointer"
                onClick={() => (window.location.href = "/")}
                src="/images/tm-logo-1.webp"
                alt="trading_materials_logo"
              />
              <p className="text-sm text-right">
                New to Trading Materials?{" "}
                <a
                  className="underline hover:text-blue-600"
                  href="https://tradingmaterials.com/signup"
                >
                  Create a new account
                </a>
              </p>
            </div>
            {/* modal starts*/}
            <Modal centered show={true} animation="ease-in-out">
              <ModalBody>
                <>
                  <div>
                    <h4 className="text-2xl text-green-500 text-center !font-bold">
                      {" "}
                      Payment Success
                    </h4>
                    <FaCheckCircle className="text-6xl text-success w-full text-center  drop-shadow-lg" />

                    <div className="my-2">
                      <p className="text-sm text-center ">
                        You will be receiving your <b>login credentials</b> to
                        your email shortly.
                      </p>
                    </div>
                    <div className="w-full flex justify-center items-center ">
                      <Button
                        className=" !border-dashed border p-2 !text-xs !mt-2 shadow-sm"
                        onClick={() => {
                          window.location.href = "/login";
                        }}
                      >
                        <p className="!text-xs text-center !text-blue-600 cursor-pointer">
                          Login to track your order
                        </p>
                      </Button>
                    </div>
                  </div>
                </>
              </ModalBody>
            </Modal>
            {/* modal ends */}
          </div>
        </div>
      </>
    );
}