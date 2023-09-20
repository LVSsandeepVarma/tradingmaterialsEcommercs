/* eslint-disable react/prop-types */
import React from 'react'
import { Modal } from 'react-bootstrap'
import { BsExclamationCircle } from 'react-icons/bs'
import { FaCheckCircle } from 'react-icons/fa'

// eslint-disable-next-line react/prop-types
export default function AddToFav({showModal, closeModal, addedToFavImg, modalMessage}) {
  return (
    <Modal show={showModal} onHide={closeModal} className="!border-0" centered>
          <Modal.Body className="border-0 !bg-[#e5e7eb]">
            <>
            <p className="!flex justify-end text-xl cursor-pointer w-full" onClick={closeModal}>X</p>
            <div className="flex justify-around min-h-[20vh] items-center pl-2">
              <img src={addedToFavImg} alt="saved_product" style={{width:"25%", height:"25%"}} ></img>
              <div>
              <p className=" flex text-xl items-center !truncate !text-[rgba(105,110,119,1)] p-2 "><FaCheckCircle color="success" style={{color:"green"}} className="mr-1"/>{modalMessage}</p>
              {/* <div className="!inline"> */}
              { modalMessage?.search("cart") !== -1 && <p className="flex text-lg items-center !truncate !text-[rgba(105,110,119,1)] p-2 pt-1"><BsExclamationCircle color="green" style={{color:"red"}} className="mr-1" />Removed from your wishlist</p>}
              {/* </div> */}
              </div>
            </div>
            </>
          </Modal.Body>
        </Modal>
  )
}
