/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useRef, useState } from "react";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
// import config from './config.js';
// import MessageParser from './messageParser.js';
// import ActionProvider from './actionProvide.js';
// import Chatbot from 'react-chatbot-kit';
// import 'react-chatbot-kit/build/main.css';

// eslint-disable-next-line react/prop-types
export default function ChatForm({ hide }) {
  const [email, setEmail] = useState("staticEmail@gmail.com");
  const [phone, setPhone] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [apiErr, setApiErr] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [userIp, setUserIp] = useState();
  const componentRef = useRef();

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.login?.value);
  const userData = useSelector((state) => state?.user?.value);

  // getting user ip
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
  }, []);

  function emailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    if (email === "") {
      setEmailErr("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailErr("Invalid email format");
    } else {
      setEmailErr("");
    }
  }

  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setPhoneErr("");
        setApiErr([]);
        setSuccessMsg("");
      }
    });

    return () => {
      document.removeEventListener("click", (event) => {
        componentRef.current && !componentRef.current.contains(event.target);
      });
    };
  }, [componentRef]);

  // Validate mobile number function (example)
  const isValidMobile = (mobile) => {
    const phoneRegex = /^[0-9]+$/;
    if (mobile?.length === 0) {
      setPhoneErr("Phone number is required");
    } else if (!phoneRegex.test(mobile)) {
      setPhoneErr("Invalid Phone number");
    } else if (mobile?.length <= 7) {
      setPhoneErr("Phone number should contain 8 - 15 digits only");
    } else if (mobile?.length > 15) {
      setPhoneErr("Phone number should contain 8 - 15 digits only");
    } else {
      setPhoneErr("");
    }
  };

  const handleEmailChange = (e) => {
    setApiErr([]);
    setEmail(e?.target?.value);
    emailValidaiton(email);
  };

  const handlePhonechange = (e) => {
    setApiErr([]);
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    setPhone(e.target.value);
    isValidMobile(e.target.value);
  };

  const handleStepOne = () => {
    isValidMobile(phone);
    if (phone != "" && phoneErr == "") {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e) => {
    setApiErr([]);
    setSuccessMsg("");
    e.preventDefault();
    isValidMobile(phone);

    const currentUrl = window?.location?.href;
    let updatedUrl;

    if (
      currentUrl &&
      (currentUrl.startsWith("http://") || currentUrl.startsWith("https://"))
    ) {
      // Replace "http://" or "https://" with "www."
      updatedUrl = currentUrl.replace(/^(https?:\/\/)/, "www.");

      // Now, `updatedUrl` contains the modified URL with "www."
      console.log(updatedUrl);
    } else {
      // The URL didn't start with "http://" or "https://"
      updatedUrl = currentUrl;
    }
    // console.log(phoneErr)
    if (phoneErr === "" && phone !== "" && apiErr?.length === 0) {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/instant/enq/store",
          {
            phone: phone,
            domain: "www.tradingmaterials.com",
            ip_address: userIp,
          },
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          setSuccessMsg(`Offer Code Applied to ${phone}`);
          const expiryDate = new Date(Date.now() + 604800 * 1000); // for 1 week
          sessionStorage.setItem("expiry", expiryDate);
          sessionStorage.setItem("offerPhone", phone);
          localStorage.setItem("expiry", expiryDate);
          localStorage.setItem("offerPhone", phone);
          if (isLoggedIn) {
            localStorage.setItem("offerEmail", userData?.client?.email);
          }
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (err) {
        if (err?.response?.data?.errors) {
          // setEmailErr(err?.response?.data?.errors["email"])
          // setPhoneErr(err?.response?.data?.errors["phone"])
          setApiErr([...Object.values(err?.response?.data?.errors)]);
        } else {
          setApiErr([err?.response?.data?.message]);
        }
      } finally {
        dispatch(hideLoader());
        setCurrentStep(1);
      }
    }
  };
  return (
    <>
      {/* type-1 */}
      <div className="outer" ref={componentRef}>
        <div className="p-2 text-left w-full">
          <div
            className="flex items-start w-full justify-around relative"
            style={{ zIndex: "999999" }}
          >
            <h2 className="h1text !font-bold !w-full mt-0 pt-0">
              Get 10% Off on First Order
            </h2>

            <p
              className="  cursor-pointer offer-bottom-right flex justify-end mr-2"
              onClick={() => hide("none")}
            >
              X
            </p>
          </div>
          <div className="flex justify-around items-center">
            <div className="w-full relative" style={{ zIndex: "999999" }}>
              {successMsg?.length > 0 && (
                <p className="text-sm text-green-500 w-fit bg-slate-100 p-1  font-semibold ">
                  Offer Code Applied
                </p>
              )}
              {successMsg?.length == 0 && (
                <div className="text-input-off">
                  <input
                    type="text"
                    id="input1"
                    value={phone}
                    maxLength={15}
                    onChange={handlePhonechange}
                    placeholder="Phone Number!"
                  />
                  <label htmlFor="input1">Phone</label>
                </div>
              )}
              {phoneErr && (
                <p className="nk-message-error mb-1 text-xs text-left">
                  {phoneErr}
                </p>
              )}

              {successMsg?.length == 0 && (
                <div className="buttonss-off cursor-pointer">
                  <a
                    className="cart-btn"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    GET OFFER CODE
                  </a>
                </div>
              )}
              {/* {successMsg && <p className="text-green-900 text-xs font-semibold mt-1 text-left">{successMsg}</p>} */}
              {apiErr?.length > 0 &&
                apiErr?.map((err, ind) => {
                  return (
                    <p
                      key={ind}
                      className="nk-message-error text-xs font-semibold mb1 mt-1 text-left"
                    >
                      {err}
                    </p>
                  );
                })}
            </div>
            <div className="cardss">
              <div className="illustration">
                <lottie-player
                  src="https://assets10.lottiefiles.com/packages/lf20_LrcfNr.json"
                  fill="transparent"
                  background="transparent"
                  speed="1"
                  loop=""
                  autoplay="true"
                ></lottie-player>
              </div>
            </div>
            <span className="imgs relative" style={{ zIndex: "9999" }}>
              <img src="/images/offer-box.webp" alt="product-image" />
            </span>
          </div>
        </div>

        {/* <div className="content animated fadeInLeft">
						<div className="flex items-center w-full z-999">
            <div className="h1text">Get 10% Off on First Order</div>
            
            </div>
						<div className="text-input-off">
						<input type="text" id="input1" value={phone} onChange={handlePhonechange} placeholder="Phone Number!"/>
						<label htmlFor="input1">Phone</label>
						</div>
            {phoneErr && <p className="text-red-700 text-xs font-semibold mb1 mt-1 text-left">{phoneErr}</p>}

						<div className="buttonss-off cursor-pointer">
							<a className="cart-btn" onClick={(e)=>{handleSubmit(e)}}>GET OFFER CODE</a>
						</div>
            {successMsg && <p className="text-green-900 text-xs font-semibold mt-1 text-left">{successMsg}</p>}
            {apiErr?.length > 0 &&
          apiErr?.map((err, ind) => {
            return (
              <p key={ind} className="text-red-700 text-xs font-semibold mb1 mt-1 text-left">
                {err}
              </p>
            );
          })}

					</div>
			
					<div className="cardss">			
          <div className="absolute w-full cursor-pointer offer-bottom-right"  onClick={()=>hide("none")}>X</div>
						<div className="ilustration">			
							<lottie-player src="https://assets10.lottiefiles.com/packages/lf20_LrcfNr.json" background="white" speed="1" loop autoplay></lottie-player>
							<span className="imgs"><img src="/images/offer-box.webp" alt="product-image"/></span>
						</div>			
					</div>	 */}
      </div>

      {/* type 2 */}
      {/* <div className="outer">
 
					<div className="content animated fadeInLeft">
						<div className="h1text">Get 10% Off on First Order</div>
						<div className="text-input-off">
						<input type="text" id="input1" placeholder="Phone Number!"/>
						<label htmlFor="input1">Phone</label>
						</div>

						<div className="buttonss-off">
							<a className="cart-btn" href="#">GET OFFER CODE</a>
						</div>

					</div>
			
					<div className="cardss">			
						<div className="ilustration">				
							<lottie-player src="https://assets10.lottiefiles.com/packages/lf20_LrcfNr.json" background="white" speed="1" loop autoplay></lottie-player>
							<span className="imgs"><img src="images/offer-box.webp" alt="product-image"/></span>
						</div>			
					</div>	
		</div> */}

      {/* two step form */}
      {/* <div className="outer">
 
 <div className="content animated fadeInLeft">
   <div className="h1text">Get 10% Off on First Order</div>
   {currentStep == 1 && <div>
   <div className="text-input-off">
   <input type="text" value={phone} onChange={handlePhonechange} id="input1" placeholder="Phone Number"/>
   <label htmlFor="input1">Phone</label>
   <label className="!text-left text-sm w-full"><span className="!text-blue-600">{currentStep}</span>/2</label>
   </div>
   {phoneErr && <p className="text-red-700 text-sm font-semibold mb1 mt-1 text-left">{phoneErr}</p>}
   
   </div>}
   {currentStep == 2 && <div>
   <div className="text-input-off">
   <input type="text" value={email} onChange={handleEmailChange} id="input2" placeholder="Email"/>
   <label htmlFor="input2">Email</label>
   </div>
   {emailErr && <p className="text-red-700 text-sm font-semibold mb-1 mt-1 text-left">{emailErr}</p>}

   <label className="!text-left !text-sm w-full"><span className="!text-blue-600">{currentStep}</span>/2</label>
   </div>}

   <div className="buttonss-off cursor-pointer">
     <a className="cart-btn" onClick={(e)=>{
      if(currentStep == 1){
        handleStepOne()
      }else{
        handleSubmit(e)
      }
     }} >{currentStep == 1 ? "Next" : "GET OFFER CODE"}</a>
   </div>

 </div>

 <div className="cardss">			
   <div className="ilustration">				
     <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_LrcfNr.json" background="white" speed="1" loop autoplay></lottie-player>
     <span className="imgs"><img src="images/offer-box.webp" alt="product-image"/></span>
   </div>			
 </div>	
</div> */}
    </>
  );
}

{
  /* <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      /> */
}
