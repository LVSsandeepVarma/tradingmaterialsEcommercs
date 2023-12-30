/* eslint-disable no-unused-vars */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Badge,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import urlConstants from "../../../constants.json";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import ArticleIcon from "@mui/icons-material/Article";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BungalowIcon from "@mui/icons-material/Bungalow";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import React, { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Form } from "react-bootstrap";
import {
  MdOutlineAccountCircle,
  MdOutlineDoNotDisturbOn,
} from "react-icons/md";
import { FaCalendarAlt, FaCreditCard, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  hideLoader,
  showLoader,
} from "../../../../features/loader/loaderSlice";
import { updateUsers } from "../../../../features/users/userSlice";
import { updateCart } from "../../../../features/cartItems/cartSlice";
// import { updateNotifications } from "../../../features/notifications/notificationSlice";
import {
  updateCartCount,
  updateWishListCount,
} from "../../../../features/cartWish/focusedCount";
import axios from "axios";
import { BsCheck2Circle } from "react-icons/bs";
import { showpayment } from "../../../../features/paymentStatus/paymentStatus";
import PaymentFailed from "../../modals/paymentFailed";
import { loginUser } from "../../../../features/login/loginSlice";
import { updateclientType } from "../../../../features/clientType/clientType";
import { updateNotifications } from "../../../../features/notifications/notificationSlice";
import { useNavigate } from "react-router-dom";

export default function CheckoutLead() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const paymentFailedStatus = useSelector(
    (state) => state?.paymentStatus?.value
  );
  const [loginSuccessMsg, setLoginsuccessMsg] = useState("");
  const [countryArray, setCountryArray] = useState([]);
  const [countryInput, setcountryInput] = useState("India"); //19
  const [countries, setCountries] = useState([]);
  const [sCountries, setScountries] = useState([]);
  const [paymentType, setPaymentType] = useState("online");
  const [billingType, setBillingType] = useState("sameAsShippingAddress");
  const [runLoadingMessages, setRunLoadingMessages] = useState();
  const [orderId, setOrderId] = useState("");
  const [useriP, setUserIp] = useState("");
  const [cartData, setCartData] = useState();
  const [activePaymentMethod, setActivePaymentMethod] = useState("Stripe");
  const [password, setPassword] = useState("");
  const [subpaisaSubmitUrl, setSubpaisaSubmitUrl] = useState("");
  const [encData, setEncData] = useState();
  const [clientCode, setClientCode] = useState();
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState(""); //0
  const [firstName, setFirstName] = useState(""); //1
  const [lastName, setLastName] = useState(""); //2
  const [mobile, setMobile] = useState(""); //3
  const [city, setCity] = useState(""); //4
  const [state, setState] = useState(""); //5
  const [zip, setZip] = useState(""); //6
  const [addOne, setAddOne] = useState(""); //7
  const [addTwo, setAddTwo] = useState(""); //8
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(1);
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [promocodeApplied, setPromocodeApplied] = useState("");
  const [promocodeErr, setPromocodeErr] = useState("");
  const [promocode, setPromocode] = useState("");
  const [disablePromocodeButton, setDisablePromocodeButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sCity, setSCity] = useState(""); //9
  const [sState, setSState] = useState(""); //10
  const [sCountry, setSCountry] = useState("India"); //11
  const [sZip, setSZip] = useState(""); //12
  const [sAddOne, setSAddOne] = useState(""); //13
  const [sAddTwo, setSAddTwo] = useState(""); //14
  const [sMobile, setSMobile] = useState(""); //15
  const [sFirstName, setSFirstName] = useState(""); //16
  const [sLastName, setSLastName] = useState(""); //17
  const [note, setNote] = useState(""); //18
  const [countryErr, setCountryErr] = useState("");
  const [sCountryErr, setScountryErr] = useState("");
  const [activePaymentType, setActivePAymentType] = useState("");
  const [activePaymentMethodAccordion, setActivePaymentMethodAccordion] =
    useState("Phonepe");
  const [apiError, setApiError] = useState([]);
  const [errors, setErrors] = useState(new Array(25).fill(""));
  const [apiErr, setApiErr] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCVV] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvvError, setCVVError] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [emailVerificationStatus, setEmailVerificationStatus] = useState(false);
  const [emailVerifyLoader, setEmailVerifyLoader] = useState(false);
  const [zipVerifyLoader, setZipVerifyLoader] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = [
    "Registering your account please wait",
    "Searching product availability",
    "Product available",
    "Placing order",
  ];

  const dispatch = useDispatch();
  const loaderState = useSelector((state) => state?.loader?.value);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
  }, []);

  useEffect(() => {
    if (loaderState) {
      let intervalId; // Define intervalId within the effect hook
      if (currentTextIndex === texts.length - 1) {
        clearInterval(intervalId);
        return;
      }
      intervalId = setInterval(() => {
        setCurrentTextIndex((prevIndex) => prevIndex + 1);
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [currentTextIndex, runLoadingMessages]);

  useEffect(() => {
    setQty(localStorage.getItem("productQty"));
    setCartData(JSON.parse(localStorage.getItem("productData")));
  }, []);

  useEffect(() => {
    if (paymentType == "cod" && inputRef.current) {
      inputRef.current.focus();
      document.getElementById("deliveryZip").focus();
    }
  }, [paymentType]);

  useEffect(() => {
    if (!localStorage.getItem("productData")) {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/name/india?fullText=true")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country) => country.name.common);
        countryNames.sort();

        setCountryArray(countryNames);
      })
      .catch((error) => {
        console.error("Error fetching country data:", error);
      });
  }, []);

  useEffect(() => {
    let countryFilteredArr = countryArray?.filter((country) =>
      country?.toLowerCase()?.startsWith(countryInput?.toLowerCase())
    );
    // if(countryFilteredArr.length == 0 && countryInput != ""){
    //   err[19] = "Invalid country, please choose from the list";
    // }else{
    //   err[19] = "";
    // }
    let sCountryFilteredArr = countryArray?.filter((country) =>
      country?.toLowerCase()?.startsWith(sCountry?.toLowerCase())
    );

    // if(sCountryFilteredArr.length == 0 && sCountry != ""){
    //   err[11] = "Invalid country, please choose from the list";
    // }else{
    //   err[11] = "";

    // }
    setCountries(countryFilteredArr);
    setScountries(sCountryFilteredArr);
  }, [countryInput, countryArray, sCountry]);

  useEffect(() => {
    const fetchPaymentGateways = async () => {
      try {
        dispatch(showLoader());
        const response = await axios.get(
          "https://admin.tradingmaterials.com/api/payment-gateways",
          {
            headers: {
              "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
              Accept: "application/json",
            },
          }
        );
        if (response?.data?.status) {
          setPaymentMethods(response?.data?.data?.payment_types);
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoader());
      }
    };
    fetchPaymentGateways();
  }, []);

  function passwordValidation(password) {
    if (password?.length === 0) {
      setPasswordError("Password is required");
    } else if (password?.length <= 7 || password?.length > 15) {
      setPasswordError("Invalid password");
    } else {
      setPasswordError("");
    }
  }

  const handlePasswordChange = (value) => {
    value = value?.trimStart();
    setPassword(value);
    passwordValidation(value);
  };

  function validateFields() {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    const err = [...errors];
    if (email === "") {
      err[0] = "Email is required";
    } else if (!emailRegex.test(email)) {
      err[0] = "Invalid email format";
    } else {
      err[0] = "";
      handleEmailVerification(email);
    }

    const namePattern = /^[A-Za-z ]+$/;
    if (firstName === "") {
      err[1] = "First name is required";
    } else if (!namePattern.test(firstName)) {
      err[1] = "First name should contain only alphabets";
    } else if (firstName?.length < 3) {
      err[1] = "Min 3 characters are required";
    } else if (firstName?.length > 50) {
      err[1] = "Maximum limit exceeded";
    } else {
      err[1] = "";
    }
    if (lastName === "") {
      err[2] = "Last name is required";
    } else if (!namePattern.test(lastName)) {
      const err = [...errors];
      err[2] = "Last name should contain only alphabets";
      setErrors([...err]);
    } else if (lastName?.length < 1) {
      err[2] = "Min 1 character is required";
    } else if (lastName?.length > 50) {
      err[2] = "Maximum limit exceeded";
    } else {
      err[2] = "";
    }

    const countriesRegex = new RegExp(`^(?:${countryArray.join("|")})$`);
    if (countriesRegex.test(countryInput)) {
      setCountryErr("");
    } else if (countryInput == "") {
      setCountryErr("Country is required");
    } else {
      setCountryErr("Invalid country, please choose from the list");
    }

    const phoneRegex = /^[0-9]+$/;
    if (mobile?.length === 0) {
      err[3] = "Phone number is required";
    } else if (!phoneRegex.test(mobile)) {
      err[3] = "Invalid phone number";
    } else if (mobile?.length <= 7) {
      err[3] = "Phone number should contain 8 - 15 digits only";
    } else if (mobile?.length > 15) {
      err[3] = "Phone number should contain 8 - 15 digits only";
    } else {
      err[3] = "";
    }

    const cityRegex = /^\s*[A-Za-z& ]{3,50}\s*$/;
    if (city == "") {
      err[4] = "City is required";
    } else if (!cityRegex.test(city)) {
      err[4] = "Invalid City";
    } else {
      err[4] = "";
    }

    const stateRegex = /^\s*[A-Za-z& ]{3,50}\s*$/;
    if (state == "") {
      err[5] = "State is required";
    } else if (!stateRegex.test(state)) {
      err[5] = "Invalid State";
    } else {
      err[5] = "";
    }

    const zipRegex = /^\s*[0-9 ]{6,10}\s*$/;
    if (zip == "") {
      err[6] = "Zipcode is required";
    } else if (!zipRegex.test(zip)) {
      err[6] = "Invalid zipcode";
    } else {
      err[6] = "";
    }

    if (addOne === "") {
      err[7] = "Address is required";
    } else if (addOne?.length < 3) {
      err[7] = "Min 3 characters are required";
    } else if (addOne?.length > 100) {
      err[7] = "Maximum limit exceeded";
    } else {
      err[7] = "";
    }

    if (billingType == "differentBillingAddress") {
      if (sCity == "") {
        err[9] = "City is required";
      } else if (!cityRegex.test(sCity)) {
        err[9] = "Invalid City";
      } else {
        err[9] = "";
      }

      if (sState == "") {
        err[10] = "State is required";
      } else if (!stateRegex.test(sState)) {
        err[10] = "Invalid State";
      } else {
        err[10] = "";
      }
      const sCountryIsThere = sCountries?.findIndex(
        (element) => element === sCountry
      );
      if (sCountryIsThere != -1) {
        setScountryErr("");
      } else if (sCountry == "") {
        setScountryErr("Country is required");
      } else {
        setScountryErr("Invalid country, please choose from the list");
      }

      if (sZip == "") {
        err[12] = "Zipcode is required";
      } else if (!zipRegex.test(sZip)) {
        err[12] = "Invalid zipcode";
      } else {
        err[12] = "";
      }

      if (sAddOne === "") {
        err[13] = "Address is required";
      } else if (sAddOne?.length < 3) {
        err[13] = "Min 3 characters are required";
      } else if (sAddOne?.length > 100) {
        err[13] = "Maximum limit exceeded";
      } else {
        err[13] = "";
      }

      if (sFirstName === "") {
        err[16] = "First name is required";
      } else if (!namePattern.test(sFirstName)) {
        err[16] = "First name should contain only alphabets";
      } else if (sFirstName?.length < 3) {
        err[16] = "Min 3 characters are required";
      } else if (sFirstName?.length > 50) {
        err[16] = "Maximum limit exceeded";
      } else {
        err[16] = "";
      }

      if (sLastName === "") {
        err[17] = "Last name is required";
      } else if (!namePattern.test(sLastName)) {
        err[17] = "Last name should contain only alphabets";
      } else if (sLastName?.length < 3) {
        err[17] = "Min 3 characters are required";
      } else if (sLastName?.length > 50) {
        err[17] = "Maximum limit exceeded";
      } else {
        err[17] = "";
      }

      if (sMobile?.length === 0) {
        err[15] = "Phone number is required";
      } else if (!phoneRegex.test(sMobile)) {
        err[15] = "Invalid phone number";
      } else if (sMobile?.length <= 7) {
        err[15] = "Phone number should contain 8 - 15 digits only";
      } else if (sMobile?.length > 15) {
        err[15] = "Phone number should contain 8 - 15 digits only";
      } else {
        err[15] = "";
      }
    }
    setErrors([...err]);
  }

  function emailValidaiton(email) {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    if (email === "") {
      const err = [...errors];
      err[0] = "Email is required";
      setErrors([...err]);
    } else if (!emailRegex.test(email)) {
      const err = [...errors];
      err[0] = "Invalid email format";
      setErrors([...err]);
    } else {
      const err = [...errors];
      err[0] = "";
      handleEmailVerification(email);
      setErrors([...err]);
    }
  }

  function firstNameVerification(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      const err = [...errors];
      err[1] = "First name is required";
      setErrors([...err]);
    } else if (!namePattern.test(name)) {
      const err = [...errors];
      err[1] = "First name should contain only alphabets";
      setErrors([...err]);
    } else if (name?.length < 3) {
      const err = [...errors];
      err[1] = "Min 3 characters are required";
      setErrors([...err]);
    } else if (name?.length > 50) {
      const err = [...errors];
      err[1] = "Maximum limit exceeded";
      setErrors([...err]);
    } else {
      const err = [...errors];
      err[1] = "";
      setErrors([...err]);
    }
  }

  function lastNameVerification(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      const err = [...errors];
      err[2] = "Last name is required";
      setErrors([...err]);
    } else if (!namePattern.test(name)) {
      const err = [...errors];
      err[2] = "Last name should contain only alphabets";
      setErrors([...err]);
    } else if (name?.length < 1) {
      const err = [...errors];
      err[2] = "Min 3 characters are required";
      setErrors([...err]);
    } else if (name?.length > 50) {
      const err = [...errors];
      err[2] = "Maximum limit exceeded";
      setErrors([...err]);
    } else {
      const err = [...errors];
      err[2] = "";
      setErrors([...err]);
    }
  }

  function countryValidation(country) {
    if (country != "") {
      const countriesRegex = new RegExp(`^(?:${countryArray.join("|")})$`);
      if (!countriesRegex.test(country)) {
        setCountryErr("Invalid country, please choose from the list");
      } else {
        setCountryErr("");
      }
    } else {
      if (country == "") {
        setCountryErr("Country is required");
      }
    }
  }

  function phoneValidation(phone) {
    const phoneRegex = /^[0-9]+$/;
    const err = [...errors];
    if (phone?.length === 0) {
      err[3] = "Phone number is required";
      setErrors([...err]);
    } else if (!phoneRegex.test(phone)) {
      err[3] = "Invalid phone number";
      setErrors([...err]);
    } else if (phone?.length <= 7) {
      err[3] = "Phone number should contain 8 - 15 digits only";
      setErrors([...err]);
    } else if (phone?.length > 15) {
      err[3] = "Phone number should contain 8 - 15 digits only";
      setErrors([...err]);
    } else {
      err[3] = "";
      setErrors([...err]);
    }
  }

  function cityValidation(city) {
    const cityRegex = /^\s*[A-Za-z& ]{3,50}\s*$/;
    const err = [...errors];
    if (city == "") {
      err[4] = "City is required";
      setErrors([...err]);
    } else if (!cityRegex.test(city)) {
      err[4] = "Invalid City";
      setErrors([...err]);
    } else {
      err[4] = "";
      setErrors([...err]);
    }
  }

  function stateValidation(state) {
    const stateRegex = /^\s*[A-Za-z& ]{3,50}\s*$/;
    const err = [...errors];
    if (state == "") {
      err[5] = "State is required";
      setErrors([...err]);
    } else if (!stateRegex.test(state)) {
      err[5] = "Invalid State";
      setErrors([...err]);
    } else {
      err[5] = "";
      setErrors([...err]);
    }
  }

  function zipValidation(zip) {
    const zipRegex = /^\s*[0-9 ]{6}\s*$/;
    const err = [...errors];
    if (zip == "") {
      err[6] = "Zipcode is required";
      // inputRef.current.focus();
      setErrors([...err]);
    } else if (!zipRegex.test(zip)) {
      err[6] = "Invalid zipcode";
      // inputRef.current.focus();
      setErrors([...err]);
    } else {
      err[6] = "";
      fetchStateAndCountry(zip, "zip");
      setErrors([...err]);
    }
  }

  function addOneValidation(addressOne) {
    if (addressOne === "") {
      const err = [...errors];
      err[7] = "Address is required";
      setErrors([...err]);
    } else if (addressOne?.length < 3) {
      const err = [...errors];
      err[7] = "Min 3 characters are required";
      setErrors([...err]);
    } else if (addressOne?.length > 100) {
      const err = [...errors];
      err[7] = "Maximum limit exceeded";
      setErrors([...err]);
    } else {
      const err = [...errors];
      err[7] = "";
      setErrors([...err]);
    }
  }

  function sCityValidation(city) {
    const cityRegex = /^\s*[A-Za-z& ]{3,50}\s*$/;
    const err = [...errors];
    if (city == "") {
      err[9] = "City is required";
      setErrors([...err]);
    } else if (!cityRegex.test(city)) {
      err[9] = "Invalid City";
      setErrors([...err]);
    } else {
      err[9] = "";
      setErrors([...err]);
    }
  }
  function sStateValidation(state) {
    const stateRegex = /^\s*[A-Za-z& ]{3,50}\s*$/;
    const err = [...errors];
    if (state == "") {
      err[10] = "State is required";
      setErrors([...err]);
    } else if (!stateRegex.test(state)) {
      err[10] = "Invalid State";
      setErrors([...err]);
    } else {
      err[10] = "";
      setErrors([...err]);
    }
  }

  function sCountryValidation(country) {
    if (country != "") {
      const countriesRegex = new RegExp(`^(?:${countryArray.join("|")})$`);
      if (!countriesRegex.test(country)) {
        setScountryErr("Invalid country, please choose from the list");
      } else {
        setScountryErr("");
      }
    } else {
      if (country == "") {
        setScountryErr("Country is required");
      }
    }
  }

  function sZipValidation(zip) {
    const zipRegex = /^\s*[0-9 ]{6,10}\s*$/;
    const err = [...errors];
    if (zip == "") {
      err[12] = "Zipcode is required";
      setErrors([...err]);
    } else if (!zipRegex.test(zip)) {
      err[12] = "Invalid zipcode";
      setErrors([...err]);
    } else {
      err[12] = "";
      setErrors([...err]);
      fetchStateAndCountry(zip, "sZip");
    }
  }

  function addSOneValidation(addressOne) {
    if (addressOne === "") {
      const err = [...errors];
      err[13] = "Address is required";
      setErrors([...err]);
    } else if (addressOne?.length < 3) {
      const err = [...errors];
      err[13] = "Min 3 characters are required";
      setErrors([...err]);
    } else if (addressOne?.length > 100) {
      const err = [...errors];
      err[13] = "Maximum limit exceeded";
      setErrors([...err]);
    } else {
      const err = [...errors];
      err[13] = "";
      setErrors([...err]);
    }
  }

  function sFirstNameVerification(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      const err = [...errors];
      err[16] = "First name is required";
      setErrors([...err]);
    } else if (!namePattern.test(name)) {
      const err = [...errors];
      err[16] = "First name should contain only alphabets";
      setErrors([...err]);
    } else if (name?.length < 3) {
      const err = [...errors];
      err[16] = "Min 3 characters are required";
      setErrors([...err]);
    } else if (name?.length > 50) {
      const err = [...errors];
      err[16] = "Maximum limit exceeded";
      setErrors([...err]);
    } else {
      const err = [...errors];
      err[16] = "";
      setErrors([...err]);
    }
  }

  function sLastNameVerification(name) {
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
      const err = [...errors];
      err[17] = "Last name is required";
      setErrors([...err]);
    } else if (!namePattern.test(name)) {
      const err = [...errors];
      err[17] = "Last name should contain only alphabets";
      setErrors([...err]);
    } else if (name?.length < 1) {
      const err = [...errors];
      err[17] = "Min 3 characters are required";
      setErrors([...err]);
    } else if (name?.length > 50) {
      const err = [...errors];
      err[17] = "Maximum limit exceeded";
      setErrors([...err]);
    } else {
      const err = [...errors];
      err[17] = "";
      setErrors([...err]);
    }
  }

  function sPhoneValidation(phone) {
    const phoneRegex = /^[0-9]+$/;
    const err = [...errors];
    if (phone?.length === 0) {
      err[15] = "Phone number is required";
      setErrors([...err]);
    } else if (!phoneRegex.test(phone)) {
      err[15] = "Invalid phone number";
      setErrors([...err]);
    } else if (phone?.length <= 7) {
      err[15] = "Phone number should contain 8 - 15 digits only";
      setErrors([...err]);
    } else if (phone?.length > 15) {
      err[15] = "Phone number should contain 8 - 15 digits only";
      setErrors([...err]);
    } else {
      err[15] = "";
      setErrors([...err]);
    }
  }

  const handleFormChange = (field, value) => {
    if (field == "email") {
      value = value.trim();
      setEmail(value);
    } else if (field == "firstName") {
      value = value?.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setFirstName(value);
    } else if (field == "lastName") {
      value = value?.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setLastName(value);
    } else if (field == "countryInput") {
      value = value?.trimStart();
      setcountryInput(value);
      countryValidation(value);
    } else if (field == "mobile") {
      value = value.trimStart();
      value = value.replace(/[^0-9]/g, "");
      setMobile(value);
      phoneValidation(value);
    } else if (field == "city") {
      value = value.trimStart();
      value = value.replace(/[^a-zA-z ]/g, "");
      setCity(value);
      cityValidation(value);
    } else if (field == "state") {
      value = value.trimStart();
      value = value.replace(/[^a-zA-z ]/g, "");

      setState(value);
      stateValidation(value);
    } else if (field == "zip") {
      setZipVerifyLoader(true);
      setTimeout(() => {
        setZipVerifyLoader(false);
      }, 1000);
      value = value.trimStart();
      value = value.replace(/[^0-9]/g, "");
      setZip(value);
    } else if (field == "addOne") {
      value = value.trimStart();
      setAddOne(value);
    } else if (field == "addTwo") {
      setAddTwo(value);
    } else if (field == "billingSameAsShipping") {
      setBillingSameAsShipping(value);
    } else if (field == "qty") {
      setQty(value);
    } else if (field == "sCity") {
      value = value.trimStart();
      value = value?.replace(/[^a-z A-Z ]/g, "");
      setSCity(value);
    } else if (field == "sState") {
      value = value.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setSState(value);
    } else if (field == "sCountry") {
      value = value?.trimStart();
      setSCountry(value);
    } else if (field == "sZip") {
      value = value.trim();
      value = value.replace(/[^0-9]/g, "");
      setSZip(value);
    } else if (field == "sAddOne") {
      value = value.trimStart();
      setSAddOne(value);
    } else if (field == "sAddTwo") {
      setSAddTwo(value);
    } else if (field == "sFirstName") {
      value = value?.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setSFirstName(value);
    } else if (field == "sLastName") {
      value = value?.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setSLastName(value);
    } else if (field == "note") {
      setNote(value);
    } else if (field == "sMobile") {
      value = value.trim();
      value = value.replace(/[^0-9]/g, "");
      setSMobile(value);
    }
  };

  const handleFormValidation = (field, value) => {
    if (field == "email") {
      value = value.trim();
      setEmail(value);
      emailValidaiton(value);
    } else if (field == "firstName") {
      value = value?.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setFirstName(value);
      firstNameVerification(value);
    } else if (field == "lastName") {
      value = value?.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setLastName(value);
      lastNameVerification(value);
    } else if (field == "countryInput") {
      // value = value?.trimStart();
      setcountryInput(value);
      // countryValidation(value);
    } else if (field == "mobile") {
      value = value.trimStart();
      value = value.replace(/[^0-9]/g, "");
      setMobile(value);
      phoneValidation(value);
    } else if (field == "city") {
      value = value.trim();
      value = value.replace(/[^a-zA-z ]/g, "");
      setCity(value);
      cityValidation(value);
    } else if (field == "state") {
      value = value.trimStart();
      value = value.replace(/[^a-zA-z ]/g, "");
      setState(value);
      stateValidation(value);
    } else if (field == "zip") {
      value = value.trimStart();
      value = value.replace(/[^0-9]/g, "");
      zipValidation(value);
      setZip(value);
    } else if (field == "addOne") {
      value = value.trimStart();
      setAddOne(value);
      addOneValidation(value);
    } else if (field == "addTwo") {
      setAddTwo(value);
    } else if (field == "billingSameAsShipping") {
      setBillingSameAsShipping(value);
    } else if (field == "qty") {
      setQty(value);
    } else if (field == "sCity") {
      value = value.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setSCity(value);
      sCityValidation(value);
    } else if (field == "sState") {
      value = value.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setSState(value);
      sStateValidation(value);
    } else if (field == "sCountry") {
      setSCountry(value);
      sCountryValidation(value);
    } else if (field == "sZip") {
      value = value.trim();
      value = value.replace(/[^0-9]/g, "");
      setSZip(value);
      sZipValidation(value);
    } else if (field == "sAddOne") {
      value = value.trimStart();
      setSAddOne(value);
      addSOneValidation(value);
    } else if (field == "sAddTwo") {
      setSAddTwo(value);
    } else if (field == "sFirstName") {
      value = value?.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setSFirstName(value);
      sFirstNameVerification(value);
    } else if (field == "sLastName") {
      value = value?.trimStart();
      value = value?.replace(/[^a-zA-Z ]/g, "");
      setSLastName(value);
      sLastNameVerification(value);
    } else if (field == "note") {
      setNote(value);
    } else if (field == "sMobile") {
      value = value.trim();
      value = value.replace(/[^0-9]/g, "");
      setSMobile(value);
      sPhoneValidation(value);
    }
  };

  const fetchStateAndCountry = async (value, field) => {
    try {
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/fetch/postacode/info",
        { zipcode: value },
        {
          headers: {
            "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        const err = [...errors];
        if (field == "zip") {
          setState(response?.data?.data?.info?.state);
          setCity(response?.data?.data?.info?.district);
          err[4] = "";
          err[5] = "";
          err[6] = "";
        } else if (field == "sZip") {
          setSState(response?.data?.data?.info?.state);
          setSCity(response?.data?.data?.info?.district);
          err[9] = "";
          err[10] = "";
          err[12] = "";
        }
        setErrors([...err]);
      }
    } catch (err) {
      console.log(err);
      if (field == "zip") {
        setState("");
        setCity("");
      } else if (field == "sZip") {
        setSState("");
        setSCity("");
      }
    }
  };

  const handlePlaceOrder = async () => {
    setSuccessMsg("");
    setApiErr([]);
    const exceptions = [11, 16, 17, 13, 9, 10, 12, 15];
    if (paymentType != "cod" || activePaymentMethodAccordion == "Stripe") {
      handleSubmit();
    }

    if (
      errors?.every(
        (element, index) =>
          exceptions[index] == index || element === "" || element == undefined
      ) &&
      firstName != "" &&
      lastName != "" &&
      email != "" &&
      mobile != "" &&
      addOne != "" &&
      city != "" &&
      state != "" &&
      countryInput != "" &&
      zip != "" &&
      nameOnCard != "" &&
      cvv != "" &&
      expiry != "" &&
      (cardNumber != "") & 7
    ) {
      if (
        (billingType == "differentBillingAddress" &&
          sFirstName != "" &&
          sLastName != "" &&
          sMobile != "" &&
          sAddOne != "" &&
          sCity != "" &&
          sState != "" &&
          sCountry != "" &&
          sZip != "" &&
          exceptions.every((element) => errors[element] == "")) ||
        (exceptions.every((element) => errors[element] == "") &&
          billingType != "differentBillingAddress")
      ) {
        try {
          dispatch(showLoader());
          const data = {
            first_name:
              billingType == "differentBillingAddress" ? sFirstName : firstName,
            last_name:
              billingType == "differentBillingAddress" ? sLastName : lastName,
            email: email,
            phone: billingType == "differentBillingAddress" ? sMobile : mobile,
            city: billingType == "differentBillingAddress" ? sCity : city,
            state: billingType == "differentBillingAddress" ? sState : state,
            country:
              billingType == "differentBillingAddress"
                ? sCountry
                : countryInput,
            zip: billingType == "differentBillingAddress" ? sZip : zip,
            add_1: billingType == "differentBillingAddress" ? sAddOne : addOne,
            add_2: sAddTwo,
            shipping_address: billingType == "differentBillingAddress" ? 1 : 0,
            product_id: cartData?.id,
            payment_type: paymentType,
            qty: qty,
            s_city: city,
            s_state: state,
            s_country: countryInput,
            s_zip: zip,
            s_add_1: addOne,
            s_add_2: addTwo,
            s_first_name: firstName,
            s_phone: mobile,
            s_last_name: lastName,
            note: note,
            ip_address: useriP,
            domain: "www.tradingmaterials.com",
            promocode_applied: promocodeApplied ? 1 : 0,
          };
          const response = await axios.post(
            "https://admin.tradingmaterials.com/api/register-client-with-order",
            data,
            {
              headers: {
                "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
                Accept: "application/json",
              },
            }
          );
          if (response?.data?.status) {
            setSuccessMsg(response?.data?.message);
            localStorage.setItem("client_token", response?.data?.token);
            localStorage.setItem("tempOrdID", response?.data?.data?.order_id);
            localStorage.setItem("orderID", response?.data?.data?.order_id);
            setOrderId(response?.data?.data?.order_id);
            CryptoJS?.AES?.encrypt(
              `${response?.data?.data?.order_id}`,
              "trading_materials_order"
            )
              ?.toString()
              .replace(/\//g, "_")
              .replace(/\+/g, "-");
            localStorage.setItem(
              "id",
              CryptoJS?.AES?.encrypt(
                `${response?.data?.data?.order_id}`,
                "trading_materials_order"
              )
                ?.toString()
                .replace(/\//g, "_")
                .replace(/\+/g, "-")
            );
            getUserInfo();
          }
        } catch (err) {
          const errs = [...errors];
          if (err?.response?.data?.errors) {
            errs[0] = err?.response?.data?.errors["email"];
            errs[1] = err?.response?.data?.errors["first_name"];
            errs[2] = err?.response?.data?.errors["last_name"];
            errs[billingType == "differentBillingAddress" ? 15:3] = err?.response?.data?.errors["phone"];
            errs[4] = err?.response?.data?.errors["city"];
            errs[5] = err?.response?.data?.errors["state"];
            errs[6] = err?.response?.data?.errors["zip"];
            errs[19] = err?.response?.data?.errors["country"];
            errs[7] = err?.response?.data?.errors["add_1"];
            setErrors([...errs]);
          }
          setApiErr(err?.response?.data?.message);

          dispatch(hideLoader());
        } finally {
          localStorage.removeItem("productData");
        }
      } else {
        validateFields();
        if (paymentType != "cod") {
          handleSubmit();
        }
      }
    } else {
      validateFields();

      if (paymentType != "cod") {
        handleSubmit();
      }
    }
  };

  // phonepe place order
  const handlePhonepePlaceOrder = async () => {
    setSuccessMsg("");
    setApiErr([]);

    const exceptions = [11, 16, 17, 13, 9, 10, 12, 15];

    if (
      errors?.every(
        (element, index) =>
          exceptions[index] == index || element === "" || element == undefined
      ) &&
      firstName != "" &&
      lastName != "" &&
      email != "" &&
      mobile != "" &&
      addOne != "" &&
      city != "" &&
      state != "" &&
      countryInput != "" &&
      zip != ""
    ) {
      if (
        (billingType == "differentBillingAddress" &&
          sFirstName != "" &&
          sLastName != "" &&
          sMobile != "" &&
          sAddOne != "" &&
          sCity != "" &&
          sState != "" &&
          sCountry != "" &&
          sZip != "" &&
          exceptions.every((element) => errors[element] == "")) ||
        (exceptions.every((element) => errors[element] == "") &&
          billingType != "differentBillingAddress")
      ) {
        try {
          dispatch(showLoader());
          const data = {
            first_name:
              billingType == "differentBillingAddress" ? sFirstName : firstName,
            last_name:
              billingType == "differentBillingAddress" ? sLastName : lastName,
            email: email,
            phone: billingType == "differentBillingAddress" ? sMobile : mobile,
            city: billingType == "differentBillingAddress" ? sCity : city,
            state: billingType == "differentBillingAddress" ? sState : state,
            country:
              billingType == "differentBillingAddress"
                ? sCountry
                : countryInput,
            zip: billingType == "differentBillingAddress" ? sZip : zip,
            add_1: billingType == "differentBillingAddress" ? sAddOne : addOne,
            add_2: sAddTwo,
            shipping_address: billingType == "differentBillingAddress" ? 1 : 0,
            product_id: cartData?.id,
            payment_type: paymentType,
            qty: qty,
            s_city: city,
            s_state: state,
            s_country: countryInput,
            s_zip: zip,
            s_add_1: addOne,
            s_add_2: addTwo,
            s_first_name: firstName,
            s_phone: mobile,
            s_last_name: lastName,
            note: note,
            ip_address: useriP,
            domain: "www.tradingmaterials.com",
            promocode_applied : promocodeApplied ? 1 : 0,
          };
          const response = await axios.post(
            "https://admin.tradingmaterials.com/api/register-client-with-order",
            data,
            {
              headers: {
                "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
                Accept: "application/json",
              },
            }
          );
          if (response?.data?.status) {
            setSuccessMsg(response?.data?.message);
            localStorage.setItem("client_token", response?.data?.token);
            localStorage.setItem("tempOrdID", response?.data?.data?.order_id);
            localStorage.setItem("orderID", response?.data?.data?.order_id);
            setOrderId(response?.data?.data?.order_id);
            CryptoJS?.AES?.encrypt(
              `${response?.data?.data?.order_id}`,
              "trading_materials_order"
            )
              ?.toString()
              .replace(/\//g, "_")
              .replace(/\+/g, "-");
            localStorage.setItem(
              "id",
              CryptoJS?.AES?.encrypt(
                `${response?.data?.data?.order_id}`,
                "trading_materials_order"
              )
                ?.toString()
                .replace(/\//g, "_")
                .replace(/\+/g, "-")
            );
            getUserInfo();
          }
        } catch (err) {
          const errs = [...errors];
          if (err?.response?.data?.errors) {
            errs[0] = err?.response?.data?.errors["email"];
            errs[1] = err?.response?.data?.errors["first_name"];
            errs[2] = err?.response?.data?.errors["last_name"];
            errs[billingType == "differentBillingAddress" ? 15 : 3] =
              err?.response?.data?.errors["phone"];
            errs[4] = err?.response?.data?.errors["city"];
            errs[5] = err?.response?.data?.errors["state"];
            errs[6] = err?.response?.data?.errors["zip"];
            errs[19] = err?.response?.data?.errors["country"];
            errs[7] = err?.response?.data?.errors["add_1"];
            setErrors([...errs]);
          }
          setApiErr(err?.response?.data?.message);

          dispatch(hideLoader());
        } finally {
          localStorage.removeItem("productData");
        }
      } else {
        validateFields();
      }
    } else {
      validateFields();
    }
  };

  // create order for cod
  const handleCODPlaceOrder = async () => {
    setSuccessMsg("");
    setApiErr([]);
    const exceptions = [11, 16, 17, 13, 9, 10, 12, 15];
    setNameErr("");
    setExpiryError("");
    setCardNumberError("");
    setCVVError("");
    if (
      firstName != "" &&
      lastName != "" &&
      mobile != "" &&
      addOne != "" &&
      city != "" &&
      state != "" &&
      countryInput != "" &&
      zip != ""
    ) {
      if (
        (billingType == "differentBillingAddress" &&
          sFirstName != "" &&
          sLastName != "" &&
          sMobile != "" &&
          sAddOne != "" &&
          sCity != "" &&
          sState != "" &&
          sCountry != "" &&
          sZip != "" &&
          exceptions.every((element) => errors[element] == "")) ||
        (exceptions.every((element) => errors[element] == "") &&
          billingType != "differentBillingAddress")
      ) {
        try {
          dispatch(showLoader());
          const data = {
            first_name:
              billingType == "differentBillingAddress" ? sFirstName : firstName,
            last_name:
              billingType == "differentBillingAddress" ? sLastName : lastName,
            email: email,
            phone: billingType == "differentBillingAddress" ? sMobile : mobile,
            city: billingType == "differentBillingAddress" ? sCity : city,
            state: billingType == "differentBillingAddress" ? sState : state,
            country:
              billingType == "differentBillingAddress"
                ? sCountry
                : countryInput,
            zip: billingType == "differentBillingAddress" ? sZip : zip,
            add_1: billingType == "differentBillingAddress" ? sAddOne : addOne,
            add_2: sAddTwo,
            shipping_address: billingType == "differentBillingAddress" ? 1 : 0,
            product_id: cartData?.id,
            qty: qty,
            s_city: city,
            s_state: state,
            s_country: countryInput,
            s_zip: zip,
            s_add_1: addOne,
            s_add_2: addTwo,
            s_first_name: firstName,
            s_phone: mobile,
            s_last_name: lastName,
            note: note,
            payment_type: paymentType,
            ip_address: useriP,
            domain: "www.tradingmaterials.com",
            promocode_applied: promocodeApplied ? 1 : 0,
          };
          const response = await axios.post(
            "https://admin.tradingmaterials.com/api/register-client-with-order",
            data,
            {
              headers: {
                "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
                Accept: "application/json",
              },
            }
          );
          if (response?.data?.status) {
            setSuccessMsg(response?.data?.message);
            localStorage.setItem("client_token", response?.data?.token);
            localStorage.setItem("tempOrdID", response?.data?.data?.order_id);
            localStorage.setItem("orderID", response?.data?.data?.order_id);
            setOrderId(response?.data?.data?.order_id);
            CryptoJS?.AES?.encrypt(
              `${response?.data?.data?.order_id}`,
              "trading_materials_order"
            )
              ?.toString()
              .replace(/\//g, "_")
              .replace(/\+/g, "-");
            localStorage.setItem(
              "id",
              CryptoJS?.AES?.encrypt(
                `${response?.data?.data?.order_id}`,
                "trading_materials_order"
              )
                ?.toString()
                .replace(/\//g, "_")
                .replace(/\+/g, "-")
            );
            localStorage.removeItem("client_token");
            localStorage.setItem("client_token", response?.data?.token);
            localStorage.setItem("client_type", response?.data?.type);
            setSuccessMsg(response?.data?.message);
            setTimeout(() => {
              setSuccessMsg("");
              window.location.href = `https://client.tradingmaterials.com/auto-login/${response.data.token}`;
            }, 1500);
          }
        } catch (err) {
          const errs = [...errors];
          if (err?.response?.data?.errors) {
            errs[0] = err?.response?.data?.errors["email"];
            errs[1] = err?.response?.data?.errors["first_name"];
            errs[2] = err?.response?.data?.errors["last_name"];
            errs[billingType == "differentBillingAddress" ? 15 : 3] =
              err?.response?.data?.errors["phone"];
            errs[4] = err?.response?.data?.errors["city"];
            errs[5] = err?.response?.data?.errors["state"];
            errs[6] = err?.response?.data?.errors["zip"];
            errs[19] = err?.response?.data?.errors["country"];
            errs[7] = err?.response?.data?.errors["add_1"];
            setErrors([...errs]);
          }
          setApiErr(err?.response?.data?.message);

          dispatch(hideLoader());
        } finally {
          dispatch(hideLoader());
          localStorage.removeItem("productData");
        }
      } else {
        validateFields();
      }
    } else {
      validateFields();

      // handleSubmit();
    }
  };

  useEffect(() => {
    if (subpaisaSubmitUrl != "" && clientCode != "" && encData != "") {
      document.getElementById("submitButton").click();
    }
  }, [subpaisaSubmitUrl, clientCode, encData]);

  //create order with phonepe
  async function createOrderWithPhonepe(total, amount) {
    try {
      dispatch(showLoader());
      const paymentData = {
        payment_type: "Phonepe",
        payment_mode: paymentType,
        client_id: localStorage.getItem("client_token"),
        order_id: localStorage.getItem("tempOrdID"),
        total: total,
        amount: amount,
        city: city,
        state: state,
        address_1: addOne,
        zipcode: zip,
        country: countryInput,
        currency: "INR",
        call_back_url: `${urlConstants.root}/payment-status/phonepe`,
        ip_address: useriP,
        domain: "www.tradingmaterials.com",
      };
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/lead/product/checkout/create-order",
        paymentData,
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );

      if (response?.data?.status) {
        sessionStorage.setItem("phonepeOrdId", response?.data?.data?.order_id);

        window.location.href = response?.data?.redirect_url;
      }
    } catch (err) {
      console.log(err);
      dispatch(showpayment());
      if (err?.response?.data?.errors) {
        // eslint-disable-next-line no-unsafe-optional-chaining
        setApiErr([...Object?.values(err?.response?.data?.errors)]);
      } else {
        if (err?.response?.data?.message?.includes("unknown")) {
          setApiErr([
            "Payment unsuccessful. Kindly consider an alternative Indian card for your transaction.",
          ]);
        } else {
          setApiErr([err?.response?.data?.message]);
        }
      }

      // window.location.href="/"
    } finally {
      dispatch(hideLoader());
    }
  }

  // create order with subpaisa
  async function createOrderWithSubPaisa(id, total, client_id) {
    setApiError([]);
    try {
      dispatch(showLoader());
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/lead/product/checkout/create-order",
        {
          payment_type: "Subpaisa",
          payment_mode: paymentType,
          order_id: localStorage.getItem("orderID"),
          total: total,
        },
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
          },
        }
      );

      if (response?.data?.status) {
        try {
          setSubpaisaSubmitUrl(response?.data?.pay_data?.url);
          setClientCode(response?.data?.pay_data?.clientCode);
          setEncData(response?.data?.pay_data?.encData);
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.errors) {
        setApiError([Object.values(err?.response?.data?.errors)]);
      } else {
        setApiError([err?.response?.data?.message]);
      }
    } finally {
      dispatch(hideLoader());
    }
  }

  //create order for stripe
  async function createOrderWithStripe(total, amount) {
    handleSubmit();
    if (
      nameErr === "" &&
      expiryError === "" &&
      cvvError === "" &&
      cardNumberError === "" &&
      nameOnCard !== "" &&
      expiry !== "" &&
      cvv !== "" &&
      expiry !== "" &&
      apiErr !== ""
    ) {
      try {
        dispatch(showLoader());
        const paymentData = {
          payment_type: "Stripe",
          payment_mode: paymentType,
          client_id: localStorage.getItem("client_token"),
          order_id: localStorage.getItem("tempOrdID"),
          total: total,
          amount: amount,
          city: city,
          state: state,
          address_1: addOne,
          zipcode: zip,
          country: countryInput,
          card_number: cardNumber,
          exp_month_year: expiry,
          cvc: cvv,
          name_on_card: nameOnCard,
          currency: "INR",
          call_back_url: `${urlConstants.root}/payment-status/`,
        };
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/lead/product/checkout/create-order",
          paymentData,
          {
            headers: {
              "access-token": localStorage.getItem("client_token"),
            },
          }
        );

        if (response?.data?.status) {
          window.location.href = response?.data?.redirect_url;
          // handleStripePayment(response?.data?.data);
        }
      } catch (err) {
        console.log(err);
        dispatch(showpayment());
        if (err?.response?.data?.errors) {
          // eslint-disable-next-line no-unsafe-optional-chaining
          setApiErr([...Object?.values(err?.response?.data?.errors)]);
        } else {
          if (err?.response?.data?.message?.includes("unknown")) {
            setApiErr([
              "Payment unsuccessful. Kindly consider an alternative Indian card for your transaction.",
            ]);
          } else {
            setApiErr([err?.response?.data?.message]);
          }
        }

        // window.location.href="/"
      } finally {
        dispatch(hideLoader());
      }
    }
  }

  // get user info
  const getUserInfo = async (productId) => {
    try {
      // setShowWishlistRemoveMsg(false)
      dispatch(showLoader());
      const url = "https://admin.tradingmaterials.com/api/lead/get-user-info";
      const headerData = {
        headers: {
          "access-token": localStorage.getItem("client_token"),
          Accept: "application/json",
        },
      };

      const response = await axios.get(url, headerData);
      if (response?.data?.status) {
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        dispatch(updateCartCount(response?.data?.data?.client?.cart_count));
        dispatch(
          updateWishListCount(response?.data?.data?.client?.wishlist_count)
        );
        if (paymentType != "cod") {
          if (activePaymentMethodAccordion == "Stripe") {
            createOrderWithStripe(
              parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                parseInt(discount),
              parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                parseInt(discount)
            );
          } else if (activePaymentMethodAccordion == "Phonepe") {
            if (useriP == "106.51.73.212") {
              createOrderWithPhonepe(
                parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                  parseInt(discount),
                parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                  parseInt(discount)
              );
            } else {
              createOrderWithPhonepe(
                parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                  parseInt(discount),
                parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                  parseInt(discount)
              );
            }
              
          } else if (activePaymentMethodAccordion == "Subpaisa") {
            createOrderWithSubPaisa(
              parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                parseInt(discount),
              parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                parseInt(discount)
            );
          }
        } else {
          window.location.href = `/place-order/${CryptoJS?.AES?.encrypt(
            `${orderId}`,
            "trading_materials_order"
          )
            ?.toString()
            .replace(/\//g, "_")
            .replace(/\+/g, "-")}`;
        }
      } else {

        // dispatch(logoutUser());
        localStorage.removeItem("client_token");
        sessionStorage.removeItem("offerPhone");
        sessionStorage.removeItem("expiry");
        dispatch(hideLoader());
      }
    } catch (err) {
      console.log(err);
      dispatch(hideLoader());
      // window.location.href="/"
    }
  };

  // clear fields if billing as as shipping
  function clearFields() {
    const fields = [11, 16, 17, 13, 9, 10, 12, 15];
    const errs = [...errors];
    for (let i = 0; i < fields?.length; i++) {
      errs[fields[i]] = "";
    }
    setSAddOne("");
    setSFirstName("");
    setSLastName("");

    setSMobile("");
    setSCity("");
    setSState("");
    setSCountry("");
    setScountries([]);
    setSZip("");
    setErrors([...errs]);
  }

  // *********** card related functions ***********
  const handleCvvChange = (e) => {
    e.target.value = e.target.value.trim();
    const addCvv = e.target.value.replace(/[^0-9]/g, "");

    setCVV(addCvv);
    if (addCvv == "") {
      setCVVError("CVV is required");
    } else if (addCvv?.length > 3 || addCvv?.length < 3) {
      if (cardNumber?.length == 18) {
        if (addCvv?.length == 4) {
          setCVVError("");
        } else {
          setCVVError("Invalid CVV");
        }
      } else {
        setCVVError("Invalid CVV");
      }
    } else if (addCvv.match(/^[0-9]+$/) === null) {
      setCVVError("Invalid CVV");
    } else {
      setCVVError("");
    }
    if (apiErr?.length > 0) {
      setApiErr();
    }
  };

  const handleNameChage = (e) => {
    e.target.value = e.target.value.trimStart();
    e.target.value = e.target.value.replace(/[^A-Za-z ]/g, "");
    const addName = e.target.value;
    setNameOnCard(addName);
    if (addName?.length == 0) {
      setNameErr("Name is required");
    } else {
      if (validateName(addName) !== null) {
        setNameErr("");
      } else {
        setNameErr("Invalid name");
      }
    }
  };

  const formatCardNumber = (value) => {
    // Remove any non-digit characters from the input value
    const cardNumberDigits = value.replace(/\D/g, "");
    // Split the card number into groups of 4 digits
    const cardNumberGroups = cardNumberDigits.match(/.{1,4}/g);
    // Join the groups with a space between them
    return cardNumberGroups ? cardNumberGroups.join(" ") : cardNumberDigits;
  };

  const formatExpiry = (value) => {
    // Remove any non-digit characters from the input value
    const expiryDigits = value.replace(/\D/g, "");
    // Split the expiry value into month and year
    const month = expiryDigits.slice(0, 2);
    const year = expiryDigits.slice(2, 4);
    // Format the expiry value as MM/YY
    return `${month}/${year}`;
  };

  const validateExpiry = (value) => {
    if (!value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      return false;
    } else {
      const year = value.split("/")[1];
      const month = value.split("/")[0];
      const currentYear = moment().year().toString();
      const currentMonth = new Date().getMonth();
      if (parseInt(currentYear.slice(2, 4)) > parseInt(year)) {
        return false;
      } else if (
        parseInt(currentYear.slice(2, 4)) == parseInt(year) &&
        parseInt(currentMonth) + 1 > parseInt(month)
      ) {
        return false;
      }

      if (value?.length <= 1) {
        return false;
      }
      return true;
    }
  };

  const validateCardNumber = (value) => {
    return value?.length >= 17 && value?.length <= 19;
  };

  const validateCVV = (value) => {
    if (cardNumber?.length == 18) {
      return value?.length == 4;
    } else {
      return value?.length == 3;
    }
  };

  const handleCardNumberChange = (event) => {
    event.target.value = event.target.value.trimStart();
    const formattedValue = formatCardNumber(event.target.value);
    setCardNumber(formattedValue);
    if (validateCardNumber(formattedValue)) {
      setCardNumberError("");
    } else {
      if (event.target.value == "") {
        setCardNumberError("Card number is required");
      } else {
        setCardNumberError("Please enter a valid card number.");
      }
    }

    if (apiErr?.length > 0) {
      setApiErr([]);
    }
  };

  const handleExpiryChange = (event) => {
    event.target.value = event.target.value.trim();
    const formattedValue = formatExpiry(event.target.value);
    if (validateExpiry(formattedValue)) {
      setExpiryError("");
    } else {
      if (formattedValue == "/" || formattedValue == "") {
        setExpiryError("Expiry is required");
      } else {
        setExpiryError("Invalid expiry");
      }
    }
    setExpiry(formattedValue);
    if (apiErr?.length > 0) {
      setApiErr([]);
    }
  };

  const validateName = (value) => {
    value = value.trimStart();

    return value.match(/^[a-zA-Z ]+$/);
  };

  const handleSubmit = async () => {
    // event.preventDefault();
    const isNameValid = validateName(nameOnCard);
    const isCardNumberValid = validateCardNumber(cardNumber);
    const isExpiryValid = validateExpiry(expiry);
    const isCVVValid = validateCVV(cvv);
    if (
      nameErr === "" &&
      cardNumberError === "" &&
      expiryError === "" &&
      cvvError === ""
    ) {
      if (
        isNameValid !== null &&
        isCardNumberValid !== false &&
        isExpiryValid !== null &&
        isCVVValid !== false
      ) {
        // setIsSuccess(true)
      } else {
        if (isNameValid === null) {
          if (nameOnCard != "") {
            setNameErr("Invalid name");
          } else {
            setNameErr("Name is required");
          }
        }
        if (isCardNumberValid === false) {
          if (cardNumber != "") {
            setCardNumberError("Card number is invalid");
          } else {
            setCardNumberError("Card number is required");
          }
        }
        if (isExpiryValid === false) {
          if (expiry != "") {
            setExpiryError("Invalid card expiry");
          } else {
            setExpiryError("Expiry is required");
          }
        }
        if (isCVVValid === false) {
          if (cvvError != "") {
            setCVVError("Invalid CVV");
          } else {
            setCVVError("CVV is required");
          }
        }
        // setIsFailure(true)
      }
    } else {
      if (nameOnCard === "") {
        setNameErr("Name is required");
      }
      if (cardNumber === "") {
        setCardNumberError("Card number is required");
      }
      if (expiry === "") {
        setExpiryError("Card expiry required");
      }
      if (cvv === "") {
        setCVVError("CVV requried");
      }
      // setIsFailure(true)
    }
  };

  async function handleEmailVerification(emailid) {
    try {
      setEmailVerifyLoader(true);
      const response = await axios.post(
        "https://admin.tradingmaterials.com/api/client/email/check",
        { email: emailid },
        {
          headers: {
            "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        setEmailVerificationStatus(false);
      }
    } catch (err) {
      console.log(err);
      if (
        err?.response?.data?.errors["email"] ==
        "The email has already been taken."
      ) {
        setEmailVerificationStatus(true);
        // setTimeout(() => {
        //   window.location.href = "/?login";
        // }, 2000);
      }
    } finally {
      setEmailVerifyLoader(false);
    }
  }

  async function handleFormSubmission() {
    setApiError([]);
    setLoginsuccessMsg("");
    emailValidaiton(email);
    passwordValidation(password);
    if (
      errors[0] === "" &&
      passwordError === "" &&
      email !== "" &&
      password !== ""
    ) {
      try {
        dispatch(showLoader());
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/auth/login",
          {
            email: email,
            password: password,
          }
        );
        if (response?.data?.status) {
          setLoginsuccessMsg(response?.data?.message);
          localStorage.removeItem("client_token");
          localStorage.setItem("client_token", response?.data?.token);
          // localStorage

          dispatch(
            updateUsers({
              first_name: response?.data?.first_name,
              last_name: response?.data?.last_name,
              cart_count: response?.data?.cart_count,
              wish_count: response?.data?.wish_count,
            })
          );
          dispatch(updateclientType(response?.data?.type));
          localStorage.setItem("client_type", response?.data?.type);
          dispatch(loginUser());
          if (response?.data?.type === "client") {
            window.location.href = `https://client.tradingmaterials.com/auto-login/${response.data.token}`;
          } else {
            if (window.location.pathname.includes("orders")) {
              // window.location.reload()
            } else {
              navigate(`/profile`);
            }
          }
        }
      } catch (err) {
        console.log("err", err);
        if (err?.response?.data?.errors) {
          // eslint-disable-next-line no-unsafe-optional-chaining
          setApiError([...Object?.values(err?.response?.data?.errors)]);
        } else {
          setApiError([err?.response?.data?.message]);
        }
        setTimeout(() => {
          setApiError([]);
          setLoginsuccessMsg("");
        }, 8000);
      } finally {
        dispatch(hideLoader());
      }
    }
  }

  // promocode apply api
  const applyPromoCode = async () => {
    try {
      dispatch(showLoader());
      if (promocode == "") {
        setPromocodeErr("Promocode is required");
        setTimeout(() => {
          setPromocodeErr("");
        }, 2000);
        return;
      } else if (promocodeApplied) {
        setPromocode("");
        setDiscount(0);
        setDiscountPercentage(0);
        setPromocodeApplied(!true);
        return;
      }
      const userPromocode =
        promocode == "NEWYR2024" ? "TMZOF10YESL" : promocode;
      const response = await axios.get(
        `https://admin.tradingmaterials.com/api/verify-promocode?promocode=${userPromocode}`,
        {
          headers: {
            "x-api-secret": "XrKylwnTF3GpBbmgiCbVxYcCMkNvv8NHYdh9v5am",
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        if (response?.data?.data?.valid == "true") {
          setPromocodeApplied(true);
        } else {
          setPromocodeApplied(false);
          setPromocodeErr("Invalid promocode");
          setTimeout(() => {
            setPromocode("")
            setPromocodeErr("");
          }, 2500);
        }

        const discountedPrice =
          (cartData?.prices[0]?.INR *
            parseInt(qty) *
            parseInt(response?.data?.data?.rate)) /
          100;
        setDiscount(discountedPrice);
        setDiscountPercentage(response?.data?.data?.rate);
        setDisablePromocodeButton(true);
        setDisablePromocodeButton(false);
      }
    } catch (err) {
      console.log(err, "err");
      if (err?.response?.data?.errors) {
        setPromocodeErr(
          Object.values(err?.response?.data?.errors?.promocode[0])?.join("")
        );
      } else {
        setPromocodeErr(err?.response?.data?.message);
      }
      setTimeout(() => {
        setPromocodeErr("");
        setPromocode("");
      }, 2000);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
      {/* {paymentFailedStatus && <PaymentFailed />} */}
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px] ">
          <div className="loader"></div>
          <p className="flex w-full h-full justify-center items-center mt-2 !text-blue-500 font-semibold text-lg">
            {texts[currentTextIndex]}
          </p>
        </div>
      )}
      <section>
        <div className="container">
          <div className="row container">
            <div className="flex justify-between items-center col-lg-11">
              <img
                src="/images/tm-logo-1.webp"
                className="cursor-pointer"
                onClick={() => {
                  window.location.href = "/";
                }}
              />
              {/* <img
                src="/images/stripe-badge-transparent.png"
                className="w-[40%]"
              /> */}
            </div>
          </div>
        </div>
        <Divider className="mb-4" />
      </section>
      <section className="container ">
        <div className="row container ">
          {emailVerificationStatus == "" && (
            <div className="flex items-center justify-center text-sm px-2 gap-1 text-black border rounded shadow-sm py-2 my-2 col-lg-11">
              <>
                <VscWorkspaceTrusted
                  // fontSize="25"
                  className="text-black text-lg min-w-[15%] md:min-w-[auto]"
                  fill="orange"
                />
                <p className=" shodow-sm text-xs md:text-xs text-gray-800">
                  Feel secure when you purchase from Trading Materials, as we
                  ensure that you will be fully refunded if your item does not
                  arrive, arrives damaged, or isn&apos;t as described.
                </p>
              </>
            </div>
          )}
          {emailVerificationStatus != "" && (
            <p className="text-xl font-semibold mb-2">
              Login to your account here
            </p>
          )}

          {emailVerificationStatus != "" && (
            <p className="antialiased">Already resgistered email found.</p>
          )}
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setRunLoadingMessages(Math.random());
            if (emailVerificationStatus == "") {
              if (paymentType != "cod") {
                if (activePaymentMethodAccordion == "Stripe") {
                  handlePlaceOrder();
                } else if (activePaymentMethodAccordion == "Phonepe") {
                  handlePhonepePlaceOrder();
                } else if (activePaymentMethodAccordion == "Subpaisa") {
                  handlePhonepePlaceOrder();
                }
              } else {
                handleCODPlaceOrder();
              }
            } else {
              handleFormSubmission();
            }
          }}
        >
          <div
            className={`row container mb-4${
              emailVerificationStatus != "" ? "mt-6" : ""
            } `}
          >
            <div
              className={`col-lg-6 float-right ${
                emailVerificationStatus != "" ? "mx-auto" : ""
              }`}
            >
              <div className="container">
                {/* contact */}
                <div className="mb-2 mt-4">
                  <div className="flex justify-between items-center ">
                    <h3 className="!font-bold text-sm md:text-lg">
                      {emailVerificationStatus == "" ? "Contact" : "Login"}
                      <ImportContactsIcon className="ml-1" fontSize="small" />
                      {emailVerifyLoader && (
                        <CircularProgress className="ml-2 text-sm" size={15} />
                      )}
                      {/* {emailVerificationStatus && (
                        <small className="!text-blue-600 !font-light mb-2 text-xs">
                          (This email is already registered.)
                        </small>
                      )} */}
                    </h3>
                    <span className="text-xs md:text-sm ">
                      {emailVerificationStatus == "" ? "Have an account?" : ""}
                      {emailVerificationStatus == "" ? (
                        <a
                          className="!text-blue-600 underline text-xs md:text-sm"
                          href="/?login"
                        >
                          Log in
                        </a>
                      ) : (
                        <a
                          className="!text-blue-600 underline text-xs md:text-xs"
                          href="/reset-password/forgot-password"
                        >
                          Forgot Password ?
                        </a>
                      )}
                    </span>
                  </div>
                  <input
                    className="form-control  customise-checkout-input  "
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                      handleFormChange("email", e?.target?.value)
                    }
                    onBlur={(e) =>
                      handleFormValidation("email", e?.target?.value)
                    }
                  ></input>
                  {errors[0] != "" && (
                    <p className="text-red-600 text-start text-xs pt-0   pl-4">
                      {errors[0]}
                    </p>
                  )}

                  {emailVerificationStatus != "" && (
                    <div className="my-2 ">
                      <div className="relative">
                        <div className="absolute left-[90%] sm:left-[95%] top-[25%]">
                          <em
                            className={`on icon ni cursor-pointer ${
                              showPassword ? "ni-eye-off-fill" : "ni-eye-fill"
                            } text-primary`}
                            onClick={() => setShowPassword(!showPassword)}
                          ></em>
                          <em className="off icon ni ni-eye-off-fill text-primary"></em>
                        </div>
                        <input
                          className="form-control customise-checkout-input"
                          placeholder="Password"
                          value={password}
                          type={showPassword ? "text" : "password"}
                          maxLength={15}
                          onChange={(e) =>
                            handlePasswordChange(e?.target?.value)
                          }
                        ></input>

                        {passwordError != "" && (
                          <p className="text-red-600 text-start text-xs pt-0   pl-4">
                            {passwordError}
                          </p>
                        )}
                      </div>
                      {apiError?.length > 0 &&
                        apiError?.map((err, ind) => {
                          return (
                            <Alert
                              key={ind}
                              variant="outlined"
                              severity="error"
                              className="mt-2"
                            >
                              <p key={ind} className="nk-message-error text-xs">
                                {err}
                              </p>
                            </Alert>
                          );
                        })}
                      <Button
                        type="submit"
                        className="w-full flex items-center mt-4 justify-center px-2"
                        variant="contained"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleFormSubmission();
                        }}
                      >
                        Login
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {emailVerificationStatus == "" && (
                <div>
                  {/* Shipping address */}
                  <div className="container">
                    <div className="row">
                      <h3 className="!font-bold text-start  text-sm md:text-lg">
                        Delivery
                        <BungalowIcon className="ml-1" fontSize="small" />
                      </h3>
                      <div className="col-12 mb-4">
                        <input
                          type="text"
                          name="country"
                          className="form-control  customise-checkout-input "
                          placeholder="Country"
                          disabled
                          value={countryInput}
                          // onChange={(e) => {
                          //   // setcountryInput(e.target.value);
                          //   handleFormChange("countryInput", e?.target?.value);
                          //   if (e?.target?.value != "") {
                          //     setCountrySelected(true);
                          //   } else {
                          //     setCountrySelected(false);
                          //   }
                          // }}
                        ></input>
                        {countryErr != "" && (
                          <p className="text-red-600 text-start text-xs pt-0   pl-4">
                            {countryErr}
                          </p>
                        )}

                        {/* {countries?.length > 0 && countrySelected && (
                      <div className="shadow-lg px-2 py-2 overflow-auto max-h-[20vh]">
                        {countries?.map((country, ind) => (
                          <div
                            key={ind}
                            className="cursor-pointer hover-bg-slate-100  hover:shadow-xl"
                          >
                            <p
                              className=" hover:!text-blue-600 py-1 text-xs text-start"
                              onClick={() => {
                                setcountryInput(country);
                                handleFormChange("countryInput", "India");
                                // countryValidation(country)
                                setCountrySelected(false);
                              }}
                            >
                              {country}
                            </p>
                            <Divider />
                          </div>
                        ))}
                      </div>
                    )} */}
                      </div>
                      <div className="col-md-4 mb-4">
                        <input
                          ref={inputRef}
                          id="deliveryZip"
                          className="form-control  customise-checkout-input "
                          placeholder="Pincode"
                          value={zip}
                          maxLength={6}
                          onChange={(e) => {
                            handleFormChange("zip", e?.target?.value);
                            handleFormValidation("zip", e?.target?.value);
                          }}
                          // onBlur={(e) => {
                          //   handleFormValidation("zip", e?.target?.value);
                          // }}
                          autoFocus={true}
                        ></input>
                        {errors[6] != "" && (
                          <p className="text-red-600 text-start text-xs pt-0   pl-4">
                            {errors[6]}
                          </p>
                        )}
                      </div>
                      <div className="col-md-4 mb-4">
                        <input
                          className="form-control  customise-checkout-input "
                          placeholder="City"
                          value={city}
                          maxLength={51}
                          onChange={(e) => {
                            handleFormChange("city", e?.target?.value);
                            handleFormValidation("city", e?.target?.value);
                          }}
                          onBlur={(e) => {
                            handleFormValidation("city", e?.target?.value);
                          }}
                        ></input>
                        {errors[4] != "" && (
                          <p className="text-red-600 text-start text-xs pt-0   pl-4">
                            {errors[4]}
                          </p>
                        )}
                      </div>
                      <div className="col-md-4 mb-4">
                        <input
                          className="form-control  customise-checkout-input "
                          placeholder="State"
                          maxLength={51}
                          value={state}
                          onChange={(e) => {
                            handleFormChange("state", e?.target?.value);
                            handleFormValidation("state", e?.target?.value);
                          }}
                          onBlur={(e) => {
                            handleFormValidation("state", e?.target?.value);
                          }}
                        ></input>
                        {errors[5] != "" && (
                          <p className="text-red-600 text-start text-xs pt-0   pl-4">
                            {errors[5]}
                          </p>
                        )}
                      </div>
                      <div className="col-md-12">
                        <Divider className="mb-4 " />
                      </div>
                      <div className="col-md-6  mb-4">
                        <input
                          className="form-control  customise-checkout-input "
                          placeholder="First Name"
                          value={firstName}
                          maxLength={51}
                          onChange={(e) => {
                            handleFormChange("firstName", e?.target?.value);
                          }}
                          onBlur={(e) => {
                            handleFormValidation("firstName", e?.target?.value);
                          }}
                        ></input>
                        {errors[1] != "" && (
                          <p className="text-red-600 text-start text-xs pt-0   pl-4">
                            {errors[1]}
                          </p>
                        )}
                      </div>
                      <div className="col-md-6 mb-4">
                        <input
                          className="form-control  customise-checkout-input "
                          placeholder="Last Name"
                          value={lastName}
                          maxLength={51}
                          onChange={(e) => {
                            handleFormChange("lastName", e?.target?.value);
                          }}
                          onBlur={(e) => {
                            handleFormValidation("lastName", e?.target?.value);
                          }}
                        ></input>
                        {errors[2] != "" && (
                          <p className="text-red-600 text-start text-xs pt-0   pl-4">
                            {errors[2]}
                          </p>
                        )}
                      </div>
                      <div className="col-md-12 mb-4">
                        <input
                          className="form-control  customise-checkout-input "
                          placeholder="Address"
                          maxLength={101}
                          value={addOne}
                          onChange={(e) => {
                            handleFormChange("addOne", e?.target?.value);
                          }}
                          onBlur={(e) => {
                            handleFormValidation("addOne", e?.target?.value);
                          }}
                        ></input>
                        {errors[7] != "" && (
                          <p className="text-red-600 text-start text-xs pt-0   pl-4">
                            {errors[7]}
                          </p>
                        )}
                      </div>

                      <div className="col-md-12 mb-4">
                        <input
                          className="form-control  customise-checkout-input "
                          placeholder="Phone Number"
                          value={mobile}
                          maxLength={10}
                          onChange={(e) => {
                            handleFormChange("mobile", e?.target?.value);
                          }}
                          onBlur={(e) => {
                            handleFormValidation("mobile", e?.target?.value);
                          }}
                        ></input>
                        {errors[3] != "" && (
                          <p className="text-red-600 text-start text-xs pt-0   pl-4">
                            {errors[3]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 text-start">
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Save this information for next time"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="!font-bold text-lg text-start">
                      Shipping Method
                      <LocalShippingIcon className="ml-1" fontSize="small" />
                    </h3>
                    <div className="p-3  ">
                      <RadioGroup
                        // defaultValue={paymentType}
                        aria-labelledby="payment_methods"
                        name="payment_methods"
                        className="mb-3 "
                      >
                        <Typography sx={{ width: "100%", flexShrink: 0 }}>
                          <div
                            className={`flex justify-around border px-3 py-1 ${
                              paymentType == "online"
                                ? "bg-blue-300 !border-blue-700 rounded-t-lg"
                                : ""
                            }`}
                            onClick={() => setPaymentType("online")}
                          >
                            <FormControlLabel
                              className="!w-full text-sm"
                              value="online"
                              checked={paymentType == "online" ? true : false}
                              control={
                                <Radio
                                  size="lg"
                                  color="info"
                                  sx={{ fontSize: 20 }}
                                />
                              }
                              label="Online Secure Payment "
                              onClick={() => setPaymentType("online")}
                            />
                            {/* <img
                          src="/images/vma.webp"
                          style={{ objectFit: "contain", width: "25%" }}
                        /> */}
                          </div>
                        </Typography>

                        <Typography
                          sx={{ width: "100%", flexShrink: 0 }}
                          onClick={() => {
                            if (paymentType != "cod") {
                              setPaymentType("cod");
                              inputRef.current.focus();
                            }
                          }}
                        >
                          <div
                            className={`flex justify-around border px-3 py-1 ${
                              paymentType == "cod"
                                ? "bg-blue-300 !border-blue-700 rounded-t-lg"
                                : ""
                            }`}
                          >
                            <FormControlLabel
                              className="!w-full text-sm"
                              value="cod"
                              checked={paymentType == "cod" ? true : false}
                              // onClick={() => setPaymentType("cod")}
                              control={
                                <Radio
                                  size="lg"
                                  color="info"
                                  sx={{ fontSize: 20 }}
                                />
                              }
                              label="Cash On Delivery"
                            />
                            {/* <img
                          src="/images/cash-on-delivery-tm.webp"
                          width={"5%"}
                          alt="cod"
                        /> */}
                          </div>
                        </Typography>
                      </RadioGroup>
                    </div>
                  </div>
                  {paymentType != "cod" && (
                    <div className="text-start">
                      <h3 className="!font-bold text-lg text-start">
                        Payment{" "}
                        <CurrencyRupeeIcon className="" fontSize="small" />
                      </h3>
                      <small className="">
                        All transactions are secure and encrypted.
                      </small>
                      <Accordion expanded>
                        <AccordionSummary
                          aria-controls="panel1d-content"
                          id="panel1d-header"
                          className="border w-full text-start bg-blue-300 !border-blue-700 !rounded-t-lg chk_accordion_expanded !min-h-[40px]"
                        >
                          <Typography>Online Payments</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div className="card-body !px-1 !py-1">
                              <div className=" flex justify-between items-center ">
                                <p className="font-semibold text-black">
                                  Online Secure Payment
                                </p>
                                <img
                                  src="/images/vma.webp"
                                  alt="cards"
                                  width={"35%"}
                                />
                              </div>
                              <small>
                                After clicking “Pay now”, you will be redirected
                                to Secured Payment gateways to complete your
                                purchase securely.
                              </small>
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  )}
                  <div className="text-start my-4 ">
                    <h3 className="!font-bold text-lg">
                      Billing Address
                      <ArticleIcon className="ml-1" fontSize="small" />
                    </h3>
                    {/* accordions */}
                    <RadioGroup
                      // defaultValue={paymentType}
                      aria-labelledby="payment_methods"
                      name="payment_methods"
                      className="mb-3 "
                    >
                      <Typography sx={{ width: "100%", flexShrink: 0 }}>
                        <div
                          className={`flex justify-around border px-3 py-1 ${
                            billingType == "sameAsShippingAddress"
                              ? "bg-blue-300 !border-blue-700 rounded-t-lg"
                              : ""
                          }`}
                          onClick={() => {
                            setBillingType("sameAsShippingAddress");
                            clearFields();
                            setScountryErr("");
                            setBillingSameAsShipping(1);
                          }}
                        >
                          <FormControlLabel
                            className="!w-full text-sm"
                            value="Same as shipping address"
                            checked={
                              billingType == "sameAsShippingAddress"
                                ? true
                                : false
                            }
                            control={
                              <Radio
                                size="lg"
                                color="info"
                                sx={{ fontSize: 20 }}
                              />
                            }
                            label="Same as shipping address"
                          />
                          {/* <img
                          src="/images/vma.webp"
                          style={{ objectFit: "contain", width: "25%" }}
                        /> */}
                        </div>
                      </Typography>

                      <Accordion
                        expanded={billingType == "differentBillingAddress"}
                        onChange={() => {
                          setBillingType("differentBillingAddress");
                          setBillingSameAsShipping(0);
                        }}
                      >
                        <AccordionSummary
                          // expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel4bh-content"
                          id="panel4bh-header"
                          className={`flex justify-around border  ${
                            billingType == "differentBillingAddress"
                              ? "bg-blue-300 !border-blue-700 !rounded-t-lg"
                              : ""
                          } chk_accordion_expanded !min-h-[40px]`}
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            <div
                              onClick={() => {
                                setBillingType("differentBillingAddress");
                                setBillingSameAsShipping(0);
                              }}
                            >
                              <FormControlLabel
                                className="!w-full text-sm"
                                value="Use a different billing address"
                                checked={
                                  billingType == "differentBillingAddress"
                                    ? true
                                    : false
                                }
                                control={
                                  <Radio
                                    size="lg"
                                    color="info"
                                    sx={{ fontSize: 20 }}
                                  />
                                }
                                label="Use a different billing address"
                              />
                              {/* <img
                          src="/images/cash-on-delivery-tm.webp"
                          width={"5%"}
                          alt="cod"
                        /> */}
                            </div>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails className=" ">
                          <>
                            <div className="row ">
                              <div className="col-12 mb-4">
                                <input
                                  type="text"
                                  name="country"
                                  className="form-control  customise-checkout-input "
                                  placeholder="Country"
                                  disabled
                                  value={sCountry}
                                  // onChange={(e) => {
                                  //   // handleFormChange(
                                  //   //   "countryInput",
                                  //   //   e?.target?.value
                                  //   // );
                                  //   setSCountry(e?.target?.value);
                                  //   handleFormChange("sCountry", e?.target?.value);
                                  //   if (e?.target?.value != "") {
                                  //     setScountrySelected(true);
                                  //   } else {
                                  //     setScountrySelected(false);
                                  //   }
                                  // }}
                                ></input>
                                {sCountryErr != "" && (
                                  <p className="text-red-600 text-start text-xs pt-0   pl-4">
                                    {sCountryErr}
                                  </p>
                                )}

                                {/* {sCountries?.length > 0 && sCountrySelected && (
                              <div className="shadow-lg px-2 py-2 overflow-auto max-h-[20vh]">
                                {sCountries?.map((country, ind) => (
                                  <div
                                    key={ind}
                                    className="cursor-pointer hover-bg-slate-100  hover:shadow-xl"
                                  >
                                    <p
                                      className=" hover:!text-blue-600 py-1 text-xs text-start"
                                      onClick={() => {
                                        setSCountry(country);
                                        handleFormChange("sCountry", country);
                                        setScountrySelected(false);
                                      }}
                                    >
                                      {country}{" "}
                                    </p>
                                    <Divider />
                                  </div>
                                ))}
                              </div>
                            )} */}
                              </div>
                              <div className="col-md-4">
                                <input
                                  className="form-control  customise-checkout-input "
                                  placeholder="Pincode"
                                  value={sZip}
                                  maxLength={6}
                                  onChange={(e) => {
                                    handleFormChange("sZip", e?.target?.value);
                                  }}
                                  onBlur={(e) => {
                                    handleFormValidation(
                                      "sZip",
                                      e?.target?.value
                                    );
                                  }}
                                ></input>
                                {errors[12] != "" && (
                                  <p className="text-red-600 text-start text-xs pt-0   pl-4">
                                    {errors[12]}
                                  </p>
                                )}
                              </div>
                              <div className="col-md-4 mb-4">
                                <input
                                  className="form-control  customise-checkout-input "
                                  placeholder="City"
                                  value={sCity}
                                  maxLength={51}
                                  onChange={(e) => {
                                    handleFormChange("sCity", e?.target?.value);
                                  }}
                                  onBlur={(e) => {
                                    handleFormValidation(
                                      "sCity",
                                      e?.target?.value
                                    );
                                  }}
                                ></input>
                                {errors[9] != "" && (
                                  <p className="text-red-600 text-start text-xs pt-0   pl-4">
                                    {errors[9]}
                                  </p>
                                )}
                              </div>
                              <div className="col-md-4 mb-4">
                                <input
                                  className="form-control  customise-checkout-input "
                                  placeholder="State"
                                  maxLength={51}
                                  value={sState}
                                  onChange={(e) => {
                                    handleFormChange(
                                      "sState",
                                      e?.target?.value
                                    );
                                  }}
                                  onBlur={(e) => {
                                    handleFormValidation(
                                      "sState",
                                      e?.target?.value
                                    );
                                  }}
                                ></input>
                                {errors[10] != "" && (
                                  <p className="text-red-600 text-start text-xs pt-0   pl-4">
                                    {errors[10]}
                                  </p>
                                )}
                              </div>

                              <div className="col-md-12">
                                <Divider className="mb-4 " />
                              </div>
                              <div className="col-md-6  mb-4">
                                <input
                                  className="form-control  customise-checkout-input "
                                  placeholder="First Name"
                                  value={sFirstName}
                                  maxLength={51}
                                  onChange={(e) => {
                                    handleFormChange(
                                      "sFirstName",
                                      e?.target?.value
                                    );
                                  }}
                                  onBlur={(e) => {
                                    handleFormValidation(
                                      "sFirstName",
                                      e?.target?.value
                                    );
                                  }}
                                ></input>
                                {errors[16] != "" && (
                                  <p className="text-red-600 text-start text-xs pt-0   pl-4">
                                    {errors[16]}
                                  </p>
                                )}
                              </div>
                              <div className="col-md-6 mb-4">
                                <input
                                  className="form-control  customise-checkout-input "
                                  placeholder="Last Name"
                                  maxLength={51}
                                  value={sLastName}
                                  onChange={(e) => {
                                    handleFormChange(
                                      "sLastName",
                                      e?.target?.value
                                    );
                                  }}
                                  onBlur={(e) => {
                                    handleFormValidation(
                                      "sLastName",
                                      e?.target?.value
                                    );
                                  }}
                                ></input>
                                {errors[17] != "" && (
                                  <p className="text-red-600 text-start text-xs pt-0   pl-4">
                                    {errors[17]}
                                  </p>
                                )}
                              </div>
                              <div className="col-md-12 mb-4">
                                <input
                                  className="form-control  customise-checkout-input "
                                  placeholder="Address"
                                  value={sAddOne}
                                  maxLength={101}
                                  onChange={(e) => {
                                    handleFormChange(
                                      "sAddOne",
                                      e?.target?.value
                                    );
                                  }}
                                  onBlur={(e) => {
                                    handleFormValidation(
                                      "sAddOne",
                                      e?.target?.value
                                    );
                                  }}
                                ></input>
                                {errors[13] != "" && (
                                  <p className="text-red-600 text-start text-xs pt-0   pl-4">
                                    {errors[13]}
                                  </p>
                                )}
                              </div>

                              <div className="col-md-12 mb-4">
                                <input
                                  className="form-control  customise-checkout-input "
                                  placeholder="Phone Number"
                                  value={sMobile}
                                  maxLength={16}
                                  onChange={(e) => {
                                    handleFormChange(
                                      "sMobile",
                                      e?.target?.value
                                    );
                                  }}
                                  onBlur={(e) => {
                                    handleFormValidation(
                                      "sMobile",
                                      e?.target?.value
                                    );
                                  }}
                                ></input>
                                {errors[15] != "" && (
                                  <p className="text-red-600 text-start text-xs pt-0   pl-4">
                                    {errors[15]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        </AccordionDetails>
                      </Accordion>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>
            {emailVerificationStatus == "" && (
              <div className="col-lg-5 float-left bg-[#f7fbff] ">
                <div className="md:px-16">
                  <div className="mt-4 mb-4 container">
                    <div className="flex justify-between items-center flex-wrap gap-2  drop-shadow-lg">
                      <div className="w-[25%]">
                        <Badge badgeContent={qty} color="primary">
                          <img src={cartData?.img_1} />
                        </Badge>
                      </div>
                      <p className="max-w-[40%] text-sm text-start text-black font-semibold">
                        {cartData?.name}
                      </p>
                      <p className="text-black ">₹{cartData?.prices[0]?.INR}</p>
                    </div>
                  </div>
                  <div className="container">
                    <div
                      className={`capitalize ${
                        promocodeApplied ? "grid grid-cols-1 gap-2" : ""
                      }`}
                    >
                      {promocodeApplied && (
                        <p className="text-success font-semibold flex items-center text-sm gap-1 drop-shadow-sm">
                          Promocode applied <BsCheck2Circle />
                        </p>
                      )}
                      <>
                        <div className="d-flex w-full shadow-sm">
                          <input
                            type="text"
                            className="form-control rounded-0 py-0 px-2"
                            placeholder="Promocode"
                            name=""
                            value={promocode}
                            disabled={
                              disablePromocodeButton || promocodeApplied
                            }
                            onChange={(e) => setPromocode(e?.target?.value)}
                          />
                          <button
                            type="button"
                            className={`btn  rounded-0 px-3 py-1 fs-14 ${
                              promocodeApplied
                                ? "bg-red-600 btn-danger"
                                : "bg-[rgba(34,197,94,1)] btn-success"
                            } `}
                            name="button"
                            onClick={applyPromoCode}
                            disabled={disablePromocodeButton}
                          >
                            {promocodeApplied ? "Clear" : "Apply"}
                          </button>
                        </div>
                        <div>
                          {promocodeErr && (
                            <p className="text-red-600 text-xs text-start normal-case">
                              {promocodeErr}
                            </p>
                          )}
                        </div>
                      </>
                    </div>
                    <Divider className="mt-2" />
                    <div className=" capitalize flex justify-between items-center leading-9">
                      <p className="text-sm">subtotal</p>
                      <p className="text-black font-semibold">
                        ₹{parseInt(cartData?.prices[0]?.INR) * parseInt(qty)}
                      </p>
                    </div>
                    <div className=" capitalize flex justify-between items-center leading-9">
                      <p className="text-sm">Discount</p>
                      <p className="text-success">
                        ₹{parseInt(discount)} ({discountPercentage}%)
                      </p>
                    </div>
                    {paymentType != "cod" && (
                      <div className=" capitalize flex justify-between items-center leading-9">
                        <p className="text-sm">shipping</p>
                        <p className="text-black font-semibold">Free</p>
                      </div>
                    )}
                    <div
                      className={` capitalize flex ${"!font-bold text-black"} justify-between items-center leading-9`}
                    >
                      <p>Total</p>
                      <p>
                        ₹
                        {parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                          parseInt(discount)}
                        {/* {parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                          parseInt(
                            cartData?.prices[0]?.INR * parseInt(qty) * 0.1
                          )} */}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Payment Type if online */}
                <small className="!my-0 !text-start block w-full container mx-6 text-xs !text-gray-400">
                  *Shipping charges apply
                </small>
                <Divider
                  className={`${paymentType == "cod" ? "mb-4 mt-1" : "my-4"}`}
                />
                <div className="md:px-6">
                  {paymentType != "cod" && (
                    <h4 className="!font-bold text-start">Payment Gateway</h4>
                  )}
                  {/* comment if no cod payment */}
                  {paymentType != "cod" && (
                    <RadioGroup
                      // defaultValue={paymentType}
                      aria-labelledby="payment_type"
                      name="payment_type"
                    >
                      {paymentMethods?.length > 0 &&
                        paymentMethods?.map((payment, ind) => (
                          <Accordion
                            key={ind}
                            expanded={
                              activePaymentMethodAccordion == payment?.name
                            }
                            onChange={() => {
                              setActivePaymentMethodAccordion(payment?.name),
                                setActivePAymentType(payment?.name);
                              setActivePaymentMethod(payment?.name);
                            }}
                          >
                            <AccordionSummary
                              aria-controls="panel4bh-content"
                              id="panel4bh-header"
                              className={`${
                                activePaymentMethodAccordion == payment?.name
                                  ? "bg-gray-600 drop-shadow-lg"
                                  : ""
                              } chk_accordion_expanded`}
                            >
                              <Typography sx={{ width: "100%", flexShrink: 0 }}>
                                <div
                                  className={`flex "justify-around
                              `}
                                >
                                  <FormControlLabel
                                    className="!w-full text-sm"
                                    value={payment?.name}
                                    checked={
                                      activePaymentMethodAccordion ==
                                      payment?.name
                                      //   : false
                                    }
                                    control={
                                      <Radio
                                        size="lg"
                                        color="info"
                                        sx={{ fontSize: 20 }}
                                      />
                                    }
                                    label={
                                      <img
                                        src={
                                          payment?.name == "Stripe"
                                            ? `/images/stripe.webp`
                                            : payment?.image
                                        }
                                        className="ml-2"
                                        width={
                                          payment?.name == "Subpaisa"
                                            ? "30%"
                                            : payment?.name == "Phonepe"
                                            ? "22%"
                                            : "18%"
                                        }
                                        alt={`${paymentType?.name}`}
                                      />
                                    }
                                  />
                                </div>
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography className="!text-xs">
                                After clicking “Pay now”, you will be redirected
                                to {payment?.name} Secure to complete your
                                purchase securely.
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      {/* // ))} */}
                    </RadioGroup>
                  )}

                  <div className="my-4">
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center p-2"
                      variant="contained"
                      onSubmit={() => {
                        setRunLoadingMessages(Math.random());
                        if (paymentType != "cod") {
                          if (activePaymentMethodAccordion == "Stripe") {
                            handlePlaceOrder();
                          } else if (
                            activePaymentMethodAccordion == "Phonepe"
                          ) {
                            handlePhonepePlaceOrder();
                          }
                        } else {
                          handleCODPlaceOrder();
                        }
                      }}
                    >
                      {paymentType != "cod"
                        ? `Pay Now  INR    
                      ${
                        parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                        parseInt(discount)
                      }`
                        : "Place Order"}
                    </Button>
                    {paymentType == "cod" && successMsg && (
                      <p className="text-success text-sm test-start">
                        {successMsg}
                      </p>
                    )}

                    {paymentType == "cod" && (
                      <div>
                        <div className="my-2  shadow-lg border-0 !border-r-0">
                          {zip && errors[6] == "" ? (
                            <p className="text-sm p-1 flex items-center justify-center text !text-green-600">
                              {zipVerifyLoader && (
                                <CircularProgress
                                  className="ml-2 text-sm"
                                  size={15}
                                />
                              )}
                              {!zipVerifyLoader &&
                                city != "" &&
                                state != "" && (
                                  <>
                                    <BsCheck2Circle className="mr-1" />
                                    <span>Delivery available</span>
                                  </>
                                )}
                            </p>
                          ) : (
                            <p className="text-sm p-1 flex items-center justify-center text-red-600">
                              {zipVerifyLoader && (
                                <CircularProgress
                                  className="ml-2 text-sm"
                                  size={15}
                                />
                              )}
                              {!zipVerifyLoader && zip == "" && (
                                <>
                                  <MdOutlineDoNotDisturbOn className="mr-1" />
                                  <span>Enter your delivery pincode</span>
                                </>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form>
        <>
          <form action={subpaisaSubmitUrl} method="post">
            <input type="hidden" name="encData" value={encData} id="frm1" />
            <input
              type="hidden"
              name="clientCode"
              value={clientCode}
              id="frm2"
            />
            <input
              className="hidden"
              type="submit"
              id="submitButton"
              name="submit"
            />
          </form>
        </>
      </section>
    </>
  );
}
