import axios from "axios";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../features/login/loginSlice";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { updateUsers } from "../../../features/users/userSlice";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [apiError, setApiError] = useState([])
    const [loginSuccessMsg, setLoginsuccessMsg] = useState("")
    const loginStatus = useSelector(state => state?.login?.value)
    const loaderState = useSelector(state => state.loader?.value);
    const [showPassword, setShowPassword] = useState(false);
    console.log(loginStatus)

    const dispatch = useDispatch()
    const navigate = useNavigate()


    function emailValidaiton(email){
        const emailRegex = /^[a-zA-Z0-9_%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        if(email === ""){
            setEmailError("E?mail is required")
        }else if (!emailRegex.test(email)){
            setEmailError("invalid email")
        }else{
            setEmailError("")
        }
    }

    function passwordValidation(password){
        if(password?.length === 0){
            setPasswordError("password is required")
        }else if(password?.length <=5){
            setPasswordError("password should be atleast 6 digits")
        }else{
            setPasswordError("")
        }
    }

    function handleEmailChange(e){
        setEmail(e?.target?.value)
        emailValidaiton(e?.target?.value)
    }

    function handlePasswordChange(e){
        setPassword(e?.target?.value)
        passwordValidation(e?.target?.value)
    }

    async function handleFormSubmission(){
        dispatch(showLoader())
        setApiError([]);
        setLoginsuccessMsg("")
        console.log(email, password)
        emailValidaiton(email)
        passwordValidation(password)
        if(emailError === "" && passwordError === ""){
            try{
                const response = await axios.post("https://admin.tradingmaterials.com/api/auth/login", {
                email: email, password: password
            })
            if(response?.data?.status){
                setLoginsuccessMsg(response?.data?.message)
                localStorage.setItem("client_token", response?.data?.token)
                console.log(response?.data?.first_name)
                dispatch(updateUsers({
                  first_name: response?.data?.first_name,
                  last_name : response?.data?.last_name,
                  cart_count : response?.data?.cart_count,
                  wish_count : response?.data?.wish_count
                }))
                dispatch(loginUser())
                navigate("/")
            }
            }catch(err){
                console.log("err", err);
                if(err?.response?.data?.errors){
                    setApiError([...Object?.values(err?.response?.data?.errors)])
                }else{
                    setApiError([err?.response?.data?.message])
                }
                
            }finally{
                dispatch(hideLoader())
            }
        }
    }



  return (
    <>
    {loaderState && (
        <div className="preloader !bg-[rgba(0,0,0,0.5)]">
          <div className="loader"></div>
        </div>
      )}
      <div className="nk-body">
        <div className="nk-body-root">
          <div className="nk-split-page flex-column flex-xl-row">
            <div className="nk-split-col nk-auth-col">
              <div
                className="nk-form-card card rounded-3 card-gutter-md nk-auth-form-card mx-md-9 mx-xl-auto"
                data-aos="fade-up"
              >
                <div className="card-body p-5">
                  <div className="nk-form-card-head text-center pb-5">
                    <div className="flex w-full form-logo mb-3">
                      <a
                        className="w-full flex content-center"
                        href="index.php"
                      >
                        <img
                          className="logo-img content-center"
                          src="images/tm-logo-1.png"
                          alt="logo"
                        />
                      </a>
                    </div>
                    <h3 className="title mb-2 text-4xl font-semibold">
                      Login to your account
                    </h3>
                    <p className="text">
                      Not a member yet?{" "}
                      <a href="/register" className="btn-link text-primary">
                        Sign Up
                      </a>
                      .
                    </p>
                  </div>
                  <Form  >
                    <div className="row gy-4 !text-left">
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label ">Email</label>
                          <div className="form-control-wrap">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter your email"
                              onChange={handleEmailChange}
                            />
                            {emailError && <p className="text-red-600 font-semibold">{emailError}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label">Password</label>
                          <div className="form-control-wrap">
                            <a
                              // href="show-hide-password.html"
                              className="form-control-icon end password-toggle"
                              title="Toggle show/hide password"
                            >
                              <em className={`on icon ni ${showPassword ? "ni-eye-off-fill" : "ni-eye-fill"} text-primary`} onClick={()=>setShowPassword(!showPassword)}></em>
                              <em className="off icon ni ni-eye-off-fill text-primary"></em>
                            </a>
                            <input
                              id="show-hide-password"
                              type = {showPassword ? "text": "password"}
                              className="form-control"
                              placeholder="Enter your password"
                              onChange={handlePasswordChange}
                            />
                            {passwordError && <p className="text-red-700 font-semibold">{passwordError}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex flex-wrap align-items-center  justify-content-between text-center">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="rememberMe"
                            />
                            <label
                              className="form-check-label"
                              for="rememberMe"
                            >
                              {" "}
                              Remember Me{" "}
                            </label>
                          </div>
                          <a
                            href="forgot-password.php"
                            className="d-inline-block fs-16"
                          >
                            Forgot Password?
                          </a>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button
                            className="btn btn-block btn-primary"
                            type="button"
                            onClick={handleFormSubmission}
                          >
                            Login to Your Account
                          </button>
                          {loginSuccessMsg && <p className="text-green-600 font-semibold">{loginSuccessMsg}</p>}

                          {apiError?.length>0 && apiError?.map((err,ind)=>{
                            return <p key={ind} className="text-red-700 font-semibold">{err}</p>
                          })}
                        </div>
                      </div>
                    </div>
                  </Form>
                  {/* <!--<div className="pt-4 text-center">
                                <div className="small overline-title-sep"><span className="bg-white px-2 text-base">or login with</span></div>
                            </div>
                            <div className="pt-4"><a href="#" className="btn btn-outline-gray-50 text-dark w-100"><img src="images/icon/a.png" alt="" className="icon"/><span>Login with Google</span></a></div>--> */}
                </div>
              </div>
            </div>
            <div className="nk-split-col nk-auth-col nk-auth-col-content  bg-primary-gradient is-theme">
              <div
                className="nk-mask shape-33"
                data-aos="fade-in"
                data-aos-delay="0"
              ></div>
              <div className="nk-auth-content mx-md-9 mx-xl-auto">
                <div className="nk-auth-content-inner">
                  <div className="media media-lg media-circle media-middle text-bg-cyan-200 mb-5">
                    <em className="icon ni ni-quote-left text-white"></em>
                  </div>
                  <h1 className="mb-5">
                    We’re building a better application now
                  </h1>
                  <div className="nk-auth-quote ms-sm-5">
                    <div className="nk-auth-quote-inner">
                      <p className="small">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Venenatis magna massa semper tristique. Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit. Venenatis
                        magna massa semper tristique dotset.
                      </p>
                      <div className="media-group align-items-center pt-3">
                        <div className="media media-md media-circle media-middle">
                          <img src="images/avatar/a.jpg" alt="avatar" />
                        </div>
                        <div className="media-text">
                          <div className="h5 mb-0">Wade Warren</div>
                          <span className="small">3 months ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
