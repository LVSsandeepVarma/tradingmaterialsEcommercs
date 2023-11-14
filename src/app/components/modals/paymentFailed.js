/* eslint-disable no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RiSecurePaymentFill } from "react-icons/ri";
import { hidepayment } from "../../../features/paymentStatus/paymentStatus";
// import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export default function PaymentFailed() {
  const dispatch = useDispatch();
    // const navigate = useNavigate()
    
    useEffect(() => {
        setTimeout(() => {
            dispatch(hidepayment())
            window.location.href="/"
        },2000)
    }, [])
    
    console.log("opatmnbksejtb")

  return (
    <>
      <Dialog open={open} maxWidth="xs" fullWidth>
        <DialogTitle className="text-danger flex items-center justify-center text-center">
          <RiSecurePaymentFill fontSize="medium" className="mr-1" />
          Payment process incomplete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="">
              <p className="flex items-cetner"></p>
              <p className="mt-2">
                <LoginIcon fontSize="medium" className="mr-1" />
                Please try again after login
              </p>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
