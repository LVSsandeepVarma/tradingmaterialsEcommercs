/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { BsExclamationCircle } from 'react-icons/bs'
import { FaCheckCircle } from 'react-icons/fa'

// eslint-disable-next-line react/prop-types
export default function AddToFav({showModal, closeModal, addedToFavImg, modalMessage , wishMsg}) {
  console.log(wishMsg, "msggg")

  useEffect(()=>{
    setTimeout(()=>{
      closeModal()
    }, 2000)
  },[])
  return (
    <Modal show={showModal} onHide={closeModal} className="!border-0" centered>
          <Modal.Body className="border-0 !bg-[#e5e7eb]">
            <>
            {/* <p className="!flex justify-end text-xl cursor-pointer w-full" onClick={closeModal}><FaCheckCircle color="success" style={{color:"green"}}/></p>
            <div className="flex flex-wrap justify-around min-h-[20vh] items-center pl-2">
              <img src={addedToFavImg} className='!w-[75%] sm:!w-[25%]' alt="saved_product" style={{width:"25%", height:"25%"}} ></img>
              <div>
              <p className=" flex text-sm sm:text-lg md:text-xl items-center !truncate !text-[rgba(105,110,119,1)] p-2 "><FaCheckCircle color="success" style={{color:"green"}} className="mr-1"/>{modalMessage}</p>
              { modalMessage?.search("cart") !== -1 && wishMsg == true && <p className="flex text-sm sm:text-lg md:text-xl items-center !truncate !text-[rgba(105,110,119,1)] p-2 pt-1"><BsExclamationCircle color="green" style={{color:"red"}} className="mr-1" />Removed from your wishlist</p>}
              </div>
            </div> */}
            <div className='p-2 !rounded bg-white'>
              <div className='flex justify-between items-center pb-2'>
                <div className=''>
                <p className='text-xs sm:text-lg font-semibold flex items-center pl-3'>
                <FaCheckCircle className='mr-2' color='success' size={22} style={{color: "green"}}/>{modalMessage}
                </p>
                { modalMessage?.search("cart") !== -1 && wishMsg == true && <p className="!pt-2 ms:!pt-0 text-xs sm:text-sm flex justify-center items-center pl-3"><BsExclamationCircle color="green" style={{color:"red"}} className="mr-1" />Removed from your wishlist</p>}
                </div>
                <img src='/images/favicon.png' width={75}/>
              </div>
              <div className='flex justify-center '>
              <img src={addedToFavImg} style={{width : "76%", objectFit: "cover"}} alt='product'/>
              </div>
            </div>
            </>
          </Modal.Body>
        </Modal>
  )
}
