import React, { useState } from 'react'
import { Card, CardActionArea, CardContent } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";

export default function FloatingForm(handleClose) {

    const [email, setEmail] = useState("");
    // const [phoneNumber, setPhoneNumber] = useState("")
    // eslint-disable-next-line no-unused-vars
    const [emailErr, setEmailErr] = useState("")
    // const [phoneErr, setPhoneErr] = useState("")
  
    function emailValidaiton(email) {
      const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
      if (email === "") {
        setEmailErr("Email is required");
      } else if (!emailRegex.test(email)) {
        setEmailErr("invalid email");
      } else {
        setEmailErr("");
      }
    }
  
    const handleEmailChange = (e) => {
      setEmail(e?.target?.value);
      emailValidaiton(email);
    };

  return (
    <>
        <Card style={{background:"linear-gradient(135deg, rgb(34, 125, 34), lightgreen)"}}>
            <CardActionArea>
            <CardContent>
                <div className='flex  items-center !w-full'> 
                <h3 className='!font-bold text-white mb-0 '>Claim Your Offer</h3>
                <p className='text-right' onClick={()=>handleClose}><CloseIcon className="!font-bold !text-4xl" /></p>
                </div>
            <form className="form-group w-[100%]">
        <input
          className="form-control !border-b-1 !text-white !border-white  bg-transparent hover:dorp-shadow-lg  mb-2 !placeholder-white w-full"
          style={{border:"0px", borderBottom:"1px solid white", borderRadius: 0}}
          placeholder="Email"
          onChange={handleEmailChange}
        />
        <input
          className="form-control border-b-1 !text-white border-white bg-transparent hover:drop-shadow-lg mb-2 placeholder-white w-full mb-4"
          placeholder="Mobile "
          style={{border:"0px", borderBottom:"1px solid white", borderRadius: 0}}
        />
 
      </form>
            </CardContent>
            </CardActionArea>
        </Card>
    </>
  )
}
