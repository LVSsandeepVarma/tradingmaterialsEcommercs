/* eslint-disable no-unused-vars */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Form } from "react-bootstrap";
import { MdOutlineAccountCircle } from "react-icons/md";
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

export default function CheckoutLead() {
  const [summaryExpanded, setsummaryExpanded] = useState(false);
  const [countryArray, setCountryArray] = useState([]);
  const [countryInput, setcountryInput] = useState(); //19
  const [countries, setCountries] = useState([]);
  const [countrySelected, setCountrySelected] = useState(false);
  const [sCountries, setScountries] = useState([]);
  const [sCountrySelected, setScountrySelected] = useState(false);

  const [activeAccordion, setActiveAccordion] = useState("online");
  const [paymentType, setPaymentType] = useState("online");
  const [billingType, setBillingType] = useState("sameAsShippingAddress");
    const [orderId, setOrderId] = useState("");
    const [cartData, setCartData] = useState();
  const [activePaymentMethod, setActivePaymentMethod] = useState("Stripe");
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
  const [sCity, setSCity] = useState(""); //9
  const [sState, setSState] = useState(""); //10
  const [sCountry, setSCountry] = useState(""); //11
  const [sZip, setSZip] = useState(""); //12
  const [sAddOne, setSAddOne] = useState(""); //13
  const [sAddTwo, setSAddTwo] = useState(""); //14
  const [sMobile, setSMobile] = useState(""); //15
  const [sFirstName, setSFirstName] = useState(""); //16
  const [sLastName, setSLastName] = useState(""); //17
  const [note, setNote] = useState(""); //18
  const [countryErr, setCountryErr] = useState("")
  const [sCountryErr, setScountryErr] = useState("")
  const [activePaymentType, setActivePAymentType] = useState("");
  const [activePaymentMethodAccordion, setActivePaymentMethodAccordion] =
    useState("");
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

  const dispatch = useDispatch();
    const loaderState = useSelector((state) => state?.loader?.value);
    
      useEffect(() => {
        setCartData(JSON.parse(localStorage.getItem("productData")));
        console.log();
      }, []);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
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
    console.log("country", countryFilteredArr, countryInput, countryArray);
  }, [countryInput, countryArray, sCountry]);

  function validateFields() {
    const emailRegex = /^[a-zA-Z0-9_%+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;
    const err = [...errors];
    if (email === "") {
      err[0] = "Email is required";
    } else if (!emailRegex.test(email)) {
      err[0] = "Invalid email format";
    } else {
      err[0] = "";
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
    } else if (lastName?.length < 3) {
      err[2] = "Min 3 characters are required";
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
      setCountryErr("Invalid country, please choose from the list  1");
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
        console.log(billingType, "bbbbbbbb")
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
      const sCountryIsThere = sCountries?.findIndex((element) => element === sCountry);
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
    } else if (name?.length < 3) {
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
    if(country != ""){
      const countriesRegex = new RegExp(`^(?:${countryArray.join("|")})$`);
      console.log(countriesRegex.test())
      if (!countriesRegex.test(country)) {

      setCountryErr("Invalid country, please choose from the list");
    } else {

      setCountryErr("");
    }
  }else{
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
    const zipRegex = /^\s*[0-9 ]{6,10}\s*$/;
    const err = [...errors];
    if (zip == "") {
      err[6] = "Zipcode is required";
      setErrors([...err]);
    } else if (!zipRegex.test(zip)) {
      err[6] = "Invalid zipcode";
      setErrors([...err]);
    } else {
      err[6] = "";
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
    if(country != ""){
      const countriesRegex = new RegExp(`^(?:${countryArray.join("|")})$`);
      console.log(countriesRegex.test())
      if (!countriesRegex.test(country)) {

      setScountryErr("Invalid country, please choose from the list");
    } else {

      setScountryErr("");
    }
  }else{
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
    } else if (name?.length < 3) {
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
      countryValidation(value);
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
      sZipValidation(value);
      setSZip(value);
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

  const handlePlaceOrder = async () => {
    const exceptions = [11, 16, 17, 13, 9, 10, 12, 15];
    if (
      errors?.every(
        (element, index) => exceptions[index] == index || element === ""
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
        exceptions.every((element) => errors[element] == "")) || (exceptions.every((element) => errors[element] == "" ) && billingType != "differentBillingAddress")
      ) {
        try {
          dispatch(showLoader());
          const data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: mobile,
            city: city,
            state: state,
            country: countryInput,
            zip: zip,
            add_1: addOne,
            add_2: addTwo,
            shipping_address: billingType == "differentBillingAddress" ? 1 : 0,
            product_id: 17,
            qty: 2,
            s_city: sCity,
            s_state: sState,
            s_country: sCountry,
            s_zip: sZip,
            s_add_1: sAddOne,
            s_add_2: sAddTwo,
            s_first_name: sFirstName,
            s_phone: sMobile,
            s_last_name: sLastName,
            note: note,
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
                .replace(/\+/g, "-")
                localStorage.setItem("id", CryptoJS?.AES?.encrypt(
                  `${response?.data?.data?.order_id}`,
                  "trading_materials_order"
                )
                  ?.toString()
                  .replace(/\//g, "_")
                  .replace(/\+/g, "-"))
              getUserInfo()
              
          }
        } catch (err) {
          const errs = [...errors];
          if (err?.response?.data?.errors) {
            errs[0] = err?.response?.data?.errors["email"];
            errs[1] = err?.response?.data?.errors["first_name"];
            errs[2] = err?.response?.data?.errors["last_name"];
            errs[3] = err?.response?.data?.errors["phone"];
            errs[4] = err?.response?.data?.errors["city"];
            errs[5] = err?.response?.data?.errors["state"];
            errs[6] = err?.response?.data?.errors["zip"];
            errs[19] = err?.response?.data?.errors["country"];
            errs[7] = err?.response?.data?.errors["add_1"];
            setErrors([...errs]);
          }
          setApiErr(err?.response?.data?.message);
          dispatch(hideLoader())
        }finally{
          localStorage.removeItem("productData")
        }
      } else {
          validateFields();
          console.log("hrrr");
          console.log(
            firstName,
            lastName,
            email,
            addOne,
            city,
            state,
            countryInput,
            zip,
            billingType
          );
        handleSubmit();
      }
    } else {
        console.log("hr");
        console.log(firstName, lastName, email, addOne, city,state,countryInput, zip, billingType)
      validateFields();

      handleSubmit();
    }
  };

  //create order for stripe
  async function createOrderWithStripe(
      orderId

  ) {
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
          total:
            parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
            parseInt(cartData?.prices[0]?.INR * 0.1),
          amount:
            parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
            parseInt(cartData?.prices[0]?.INR * 0.1),
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
          call_back_url: `http://localhost:3000/payment-status/`,
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
          console.log(response, "response");
          // localStorage.setItem("orderID", orderId);
          // localStorage.setItem("orderID",)
          // console.log(response?.data);
        //   localStorage.setItem("id", encryptedrderId);
          window.location.href = response?.data?.redirect_url;
          // handleStripePayment(response?.data?.data);
        }
      } catch (err) {
        console.log(err);
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
      const url =
        "https://admin.tradingmaterials.com/api/lead/get-user-info";
      const headerData =
         {
              headers: {
                "access-token": localStorage.getItem("client_token"),
                Accept: "application/json",
              },
            };

      const response = await axios.get(url, headerData);
      if (response?.data?.status) {
        console.log(response?.data, "prest");
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        dispatch(updateCartCount(response?.data?.data?.client?.cart_count));
        dispatch(
          updateWishListCount(response?.data?.data?.client?.wishlist_count)
        );
        createOrderWithStripe()
      } else {
        console.log(response?.data);

        // dispatch(logoutUser());
        localStorage.removeItem("client_token");
        sessionStorage.removeItem("offerPhone");
        sessionStorage.removeItem("expiry");
        dispatch(hideLoader())
      }
    } catch (err) {
      console.log(err);
      dispatch(hideLoader())
    }
  };

  // *********** card related functions ***********
  const handleCvvChange = (e) => {
    e.target.value = e.target.value.trim();
    const addCvv = e.target.value.replace(/[^0-9]/g, "");

    setCVV(addCvv);
    console.log(addCvv.match(/^[0-9]+$/), addCvv);
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
      setApiErr([]);
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
    // Implement your expiry date validation logic here
    // For example, you can check if the expiry date is in the future and in the valid format
    // Return true if the expiry date is valid, otherwise false

    if (!value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      return false;
    } else {
      const year = value.split("/")[1];
      const month = value.split("/")[0];
      const currentYear = moment().year().toString();
      const currentMonth = new Date().getMonth();
      console.log(
        parseInt(currentYear.slice(2, 4)) >= parseInt(year),
        parseInt(currentYear.slice(2, 4)),
        parseInt(year),
        "yeeeer"
      );
      console.log(
        parseInt(currentMonth) + 1 >= parseInt(month),
        parseInt(currentMonth) + 1,
        parseInt(month),
        "curMon",
        parseInt(currentYear.slice(2, 4)) == parseInt(year)
      );
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
    // Implement your card number validation logic here
    // For example, you can use a library like 'card-validator'
    // Return true if the card number is valid, otherwise false
    return value?.length >= 17 && value?.length <= 19;
  };

  const validateCVV = (value) => {
    // Implement your CVV validation logic here
    // For example, you can check if the CVV is a 3 or 4 digit number
    // Return true if the CVV is valid, otherwise false
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
    console.log(value.match(/^[a-zA-Z ]+$/), value);

    return value.match(/^[a-zA-Z ]+$/);
  };

  const handleSubmit = async () => {
    // event.preventDefault();
    const isNameValid = validateName(nameOnCard);
    const isCardNumberValid = validateCardNumber(cardNumber);
    const isExpiryValid = validateExpiry(expiry);
    const isCVVValid = validateCVV(cvv);
    console.log(nameErr, cardNumberError, cvvError, expiryError);
    if (
      nameErr === "" &&
      cardNumberError === "" &&
      expiryError === "" &&
      cvvError === ""
    ) {
      console.log(isCVVValid, isCardNumberValid, isExpiryValid, isNameValid);
      if (
        isNameValid !== null &&
        isCardNumberValid !== false &&
        isExpiryValid !== null &&
        isCVVValid !== false
      ) {
        console.log("all fields are validated and are valid");
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
  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px] ">
          <div className="loader"></div>
        </div>
      )}
      <section>
        <div className="container">
          <div className="flex justify-between items-center">
            <img
              src="/images/tm-logo-1.webp"
              className="cursor-pointer"
              onClick={() => {
                window.location.href = "/";
              }}
            />
          </div>
        </div>
        <Divider className="mb-4" />
      </section>
      <section className="container ">
        {/* <div className="bg-gray-500">
                  <Accordion expanded={!summaryExpanded} onChange={()=>setsummaryExpanded(!summaryExpanded)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div> */}
        <div className="row container">
          <div className="col-lg-6 float-right">
            <div className="container">
              {/* contact */}
              <div className="mb-2">
                <div className="flex justify-between items-center ">
                  <h3 className="!font-bold text-lg">Contact</h3>
                  <span className="text-sm">
                    Have an account?{" "}
                    <a
                      className="!text-blue-600 underline text-sm"
                      href="/?login"
                    >
                      Log in
                    </a>
                  </span>
                </div>
                <input
                  className="form-control "
                  placeholder="Email"
                  value={email}
                  onChange={(e) => handleFormChange("email", e?.target?.value)}
                ></input>
                {errors[0] != "" && (
                  <p className="text-red-600 text-start text-xs pt-0">
                    {errors[0]}
                  </p>
                )}
              </div>
              {/* Shipping address */}
              <div className="row">
                <h3 className="!font-bold text-start text-lg">Delivery</h3>
                <div className="col-12 mb-4">
                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    placeholder="Country"
                    value={countryInput}
                    onChange={(e) => {
                      // setcountryInput(e.target.value);
                      handleFormChange("countryInput", e?.target?.value)
                      if (e?.target?.value != "") {
                        setCountrySelected(true);
                      } else {
                        setCountrySelected(false);
                      }
                    }}
                  ></input>
                  {countryErr != "" && (
                    <p className="text-red-600 text-start text-xs pt-0">
                      {countryErr}
                    </p>
                  )}

                  {countries?.length > 0 && countrySelected && (
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
                              handleFormChange("countryInput", country)
                              // countryValidation(country)
                              setCountrySelected(false);
                            }}
                          >
                            {country}{" "}
                          </p>
                          <Divider />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-md-6  mb-4">
                  <input
                    className="form-control"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => {
                      handleFormChange("firstName", e?.target?.value);
                    }}
                  ></input>
                  {errors[1] != "" && (
                    <p className="text-red-600 text-start text-xs pt-0">
                      {errors[1]}
                    </p>
                  )}
                </div>
                <div className="col-md-6 mb-4">
                  <input
                    className="form-control"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => {
                      handleFormChange("lastName", e?.target?.value);
                    }}
                  ></input>
                  {errors[2] != "" && (
                    <p className="text-red-600 text-start text-xs pt-0">
                      {errors[2]}
                    </p>
                  )}
                </div>
                <div className="col-md-12 mb-4">
                  <input
                    className="form-control"
                    placeholder="Address"
                    value={addOne}
                    onChange={(e) => {
                      handleFormChange("addOne", e?.target?.value);
                    }}
                  ></input>
                  {errors[7] != "" && (
                    <p className="text-red-600 text-start text-xs pt-0">
                      {errors[7]}
                    </p>
                  )}
                </div>
                <div className="col-md-4 mb-4">
                  <input
                    className="form-control"
                    placeholder="City"
                    value={city}
                    onChange={(e) => {
                      handleFormChange("city", e?.target?.value);
                    }}
                  ></input>
                  {errors[4] != "" && (
                    <p className="text-red-600 text-start text-xs pt-0">
                      {errors[4]}
                    </p>
                  )}
                </div>
                <div className="col-md-4 mb-4">
                  <input
                    className="form-control"
                    placeholder="State"
                    value={state}
                    onChange={(e) => {
                      handleFormChange("state", e?.target?.value);
                    }}
                  ></input>
                  {errors[5] != "" && (
                    <p className="text-red-600 text-start text-xs pt-0">
                      {errors[5]}
                    </p>
                  )}
                </div>
                <div className="col-md-4 mb-4">
                  <input
                    className="form-control"
                    placeholder="Pincode"
                    value={zip}
                    onChange={(e) => {
                      handleFormChange("zip", e?.target?.value);
                    }}
                  ></input>
                  {errors[6] != "" && (
                    <p className="text-red-600 text-start text-xs pt-0">
                      {errors[6]}
                    </p>
                  )}
                </div>
                <div className="col-md-12 mb-4">
                  <input
                    className="form-control"
                    placeholder="Phone Number"
                    value={mobile}
                    onChange={(e) => {
                      handleFormChange("mobile", e?.target?.value);
                    }}
                  ></input>
                  {errors[3] != "" && (
                    <p className="text-red-600 text-start text-xs pt-0">
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
              <div className="col-md-12 text-start">
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Text me with news and offers"
                />
              </div>
            </div>
            <div>
              <h3 className="!font-bold text-lg text-start">
                Shippping Method
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
                      className={`flex justify-around border p-3 ${
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
                          <Radio size="lg" color="info" sx={{ fontSize: 20 }} />
                        }
                        label="Online Secure Payment [Cards]"
                      />
                      {/* <img
                          src="/images/vma.webp"
                          style={{ objectFit: "contain", width: "25%" }}
                        /> */}
                    </div>
                  </Typography>

                  <Typography sx={{ width: "100%", flexShrink: 0 }}>
                    <div
                      className={`flex justify-around border p-3 ${
                        paymentType == "cod"
                          ? "bg-blue-300 !border-blue-700 rounded-t-lg"
                          : ""
                      }`}
                      onClick={() => setPaymentType("cod")}
                    >
                      <FormControlLabel
                        className="!w-full text-sm"
                        value="cod"
                        checked={paymentType == "cod" ? true : false}
                        control={
                          <Radio size="lg" color="info" sx={{ fontSize: 20 }} />
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
            <div className="text-start">
              <h3 className="!font-bold text-lg text-start">Payment</h3>
              <small className="">
                All transactions are secure and encrypted.
              </small>
              <Accordion expanded>
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                  className="border w-full text-start bg-blue-300 !border-blue-700 !rounded-t-lg"
                >
                  <Typography>Stripe (Secure Online Payment)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <div className="card-body !px-1 !py-1">
                      <div className=" flex justify-between items-center ">
                        <p className="font-semibold text-black">
                          Online Secure Payment [Cards]
                        </p>
                        <img src="/images/vma.webp" alt="cards" width={"35%"} />
                      </div>
                      <small>
                        After clicking “Pay now”, you will be redirected to
                        Razorpay Secure (UPI, Cards, Wallets, NetBanking) to
                        complete your purchase securely.
                      </small>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
            <div className="text-start my-4 ">
              <h3 className="!font-bold text-lg">Billing Address</h3>
              {/* accordions */}
              <RadioGroup
                // defaultValue={paymentType}
                aria-labelledby="payment_methods"
                name="payment_methods"
                className="mb-3 "
              >
                <Typography sx={{ width: "100%", flexShrink: 0 }}>
                  <div
                    className={`flex justify-around border p-3 ${
                      billingType == "sameAsShippingAddress"
                        ? "bg-blue-300 !border-blue-700 rounded-t-lg"
                        : ""
                    }`}
                    onClick={() => {
                      setBillingType("sameAsShippingAddress");
                      setBillingSameAsShipping(1);
                    }}
                  >
                    <FormControlLabel
                      className="!w-full text-sm"
                      value="Same as shipping address"
                      checked={
                        billingType == "sameAsShippingAddress" ? true : false
                      }
                      control={
                        <Radio size="lg" color="info" sx={{ fontSize: 20 }} />
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
                    className={`flex justify-around border ${
                      billingType == "differentBillingAddress"
                        ? "bg-blue-300 !border-blue-700 !rounded-t-lg"
                        : ""
                    }`}
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
                  <AccordionDetails className="bg-gray-300 ">
                    <>
                      <div className="row ">
                        <div className="col-12 mb-4">
                          <input
                            type="text"
                            name="country"
                            className="form-control"
                            placeholder="Country"
                            value={sCountry}
                            onChange={(e) => {
                              // handleFormChange(
                              //   "countryInput",
                              //   e?.target?.value
                              // );
                              setSCountry(e?.target?.value)
                              handleFormChange("sCountry", e?.target?.value)
                              if (e?.target?.value != "") {
                                setScountrySelected(true);
                              } else {
                                setScountrySelected(false);
                              }
                            }}
                          ></input>
                          {sCountryErr != "" && (
                            <p className="text-red-600 text-start text-xs pt-0">
                              {sCountryErr}
                            </p>
                          )}

                          {sCountries?.length > 0 && sCountrySelected && (
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
                          )}
                        </div>
                        <div className="col-md-6  mb-4">
                          <input
                            className="form-control"
                            placeholder="First Name"
                            value={sFirstName}
                            onChange={(e) => {
                              handleFormChange("sFirstName", e?.target?.value);
                            }}
                          ></input>
                          {errors[16] != "" && (
                            <p className="text-red-600 text-start text-xs pt-0">
                              {errors[16]}
                            </p>
                          )}
                        </div>
                        <div className="col-md-6 mb-4">
                          <input
                            className="form-control"
                            placeholder="Last Name"
                            value={sLastName}
                            onChange={(e) => {
                              handleFormChange("sLastName", e?.target?.value);
                            }}
                          ></input>
                          {errors[17] != "" && (
                            <p className="text-red-600 text-start text-xs pt-0">
                              {errors[17]}
                            </p>
                          )}
                        </div>
                        <div className="col-md-12 mb-4">
                          <input
                            className="form-control"
                            placeholder="Address"
                            value={sAddOne}
                            onChange={(e) => {
                              handleFormChange("sAddOne", e?.target?.value);
                            }}
                          ></input>
                          {errors[13] != "" && (
                            <p className="text-red-600 text-start text-xs pt-0">
                              {errors[13]}
                            </p>
                          )}
                        </div>
                        <div className="col-md-4 mb-4">
                          <input
                            className="form-control"
                            placeholder="City"
                            value={sCity}
                            onChange={(e) => {
                              handleFormChange("sCity", e?.target?.value);
                            }}
                          ></input>
                          {errors[9] != "" && (
                            <p className="text-red-600 text-start text-xs pt-0">
                              {errors[9]}
                            </p>
                          )}
                        </div>
                        <div className="col-md-4 mb-4">
                          <input
                            className="form-control"
                            placeholder="State"
                            value={sState}
                            onChange={(e) => {
                              handleFormChange("sState", e?.target?.value);
                            }}
                          ></input>
                          {errors[10] != "" && (
                            <p className="text-red-600 text-start text-xs pt-0">
                              {errors[10]}
                            </p>
                          )}
                        </div>
                        <div className="col-md-4">
                          <input
                            className="form-control"
                            placeholder="Pincode"
                            value={sZip}
                            onChange={(e) => {
                              handleFormChange("sZip", e?.target?.value);
                            }}
                          ></input>
                          {errors[12] != "" && (
                            <p className="text-red-600 text-start text-xs pt-0">
                              {errors[12]}
                            </p>
                          )}
                        </div>
                        <div className="col-md-12 mb-4">
                          <input
                            className="form-control"
                            placeholder="Phone Number"
                            value={sMobile}
                            onChange={(e) => {
                              handleFormChange("sMobile", e?.target?.value);
                            }}
                          ></input>
                          {errors[15] != "" && (
                            <p className="text-red-600 text-start text-xs pt-0">
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
          <div className="col-lg-5 float-left bg-gray-300">
            <div className="mt-4 mb-4 container">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className=" max-w-[30%]">
                  <img src={cartData?.img_1} />
                </div>
                <p className="max-w-[40%] text-sm text-start text-black font-semibold">
                  {cartData?.name}
                </p>
                <p className="text-black ">₹{cartData?.prices[0]?.INR}</p>
              </div>
            </div>
            <div className="container">
              <div className=" capitalize flex justify-between items-center leading-9">
                <p>subtotal</p>
                <p className="text-black font-semibold">
                  ₹{parseInt(cartData?.prices[0]?.INR) * parseInt(qty)}
                </p>
              </div>
              <div className=" capitalize flex justify-between items-center leading-9">
                <p>Discount</p>
                <p className="text-success">
                  ₹{parseInt(cartData?.prices[0]?.INR * 0.1)} (10%)
                </p>
              </div>
              <div className=" capitalize flex justify-between items-center leading-9">
                <p>shipping</p>
                <p>Free</p>
              </div>
              <div className=" capitalize flex !font-bold text-black justify-between items-center leading-9">
                <p>Total</p>
                <p>
                  <small>INR</small> ₹
                  {parseInt(cartData?.prices[0]?.INR) * parseInt(qty) -
                    parseInt(cartData?.prices[0]?.INR * 0.1)}
                </p>
              </div>
              <p className="text-start text-xs">
                Promocode applied - <b className="text-success">TMZGPO5TVSA</b>
              </p>
              {/* Payment Type if online */}
              <Divider className="my-4" />
              <h4 className="!font-bold text-start">Payment Gateway</h4>
              <RadioGroup
                // defaultValue={paymentType}
                aria-labelledby="payment_type"
                name="payment_type"
              >
                {/* {userData?.client?.payment_types?.map((payment, ind) => ( */}
                <Accordion
                  // key={ind}
                  expanded={true}
                  onChange={() => {
                    // if payment type is online only
                    // if(paymentType == "online"){
                    setActivePaymentMethodAccordion("Stripe"),
                      setActivePAymentType("Stripe");
                    setActivePaymentMethod("Stripe");
                    // }
                  }}
                >
                  <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                    className={`${
                      activePaymentMethodAccordion == "Stripe"
                        ? "bg-gray-600 drop-shadow-lg"
                        : ""
                    }`}
                  >
                    <Typography sx={{ width: "100%", flexShrink: 0 }}>
                      <div
                        className={`flex "justify-around
                              `}
                      >
                        <FormControlLabel
                          className="!w-full text-sm"
                          value={"Stripe"}
                          checked={
                            true
                            //   : false
                          }
                          control={
                            <Radio
                              size="lg"
                              color="info"
                              sx={{ fontSize: 20 }}
                            />
                          }
                          label={"Stripe"}
                        />

                        <img
                          src={`/images/stripe.webp`}
                          className="ml-2"
                          width={"12%"}
                          alt={`${paymentType?.name}`}
                        />
                      </div>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {activePaymentMethod == "Stripe" ? (
                      <>
                        <Divider className="mt-2" />
                        {
                          <Form
                          // onSubmit={handleSubmit}
                          >
                            <Form.Group>
                              <label className="font-bold !text-sm mt-3 m-0 !text-start w-full">
                                Card Number
                                <sup className="text-red-600 !font-bold">*</sup>
                              </label>
                              <div className="relative m-0 !text-start w-full">
                                <input
                                  maxLength={19}
                                  type="text"
                                  className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                  placeholder="Enter card number"
                                  value={cardNumber}
                                  onChange={handleCardNumberChange}
                                  required
                                  // onInvalid={
                                  //   !validateCardNumber(cardNumber)
                                  // }
                                />
                                <div className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400">
                                  <FaCreditCard size={15} color="gray" />
                                </div>
                              </div>
                              {cardNumberError ? (
                                <p className="nk-message-error !text-xs !m-0 !p-0 !text-left">
                                  {cardNumberError}
                                </p>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                            <Form.Group>
                              <label className="font-bold !text-sm mt-3 m-0 !text-start w-full">
                                Expiry date
                                <sup className="text-red-600 !font-bold">*</sup>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                  placeholder="MM/YY"
                                  value={expiry}
                                  onChange={handleExpiryChange}
                                  required
                                  maxLength={5}
                                  // onInvalid={!validateExpiry(expiry)}
                                />
                                <div className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400">
                                  <FaCalendarAlt size={15} color="gray" />
                                </div>
                              </div>
                              {expiryError ? (
                                <p className="nk-message-error !text-left !text-xs !m-0 !p-0">
                                  {expiryError}
                                </p>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                            <Form.Group>
                              <label className="font-bold !text-sm mt-3 m-0 !text-start w-full">
                                CVV
                                <sup className="text-red-600 !font-bold">*</sup>
                              </label>
                              <div className="relative">
                                <input
                                  type="password"
                                  className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                  placeholder="Enter CVV"
                                  value={cvv}
                                  onChange={handleCvvChange}
                                  required
                                  maxLength={cardNumber?.length == 18 ? 4 : 3}
                                  // onInvalid={!validateCVV(cvv)}
                                />
                                <div className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400">
                                  <FaLock size={15} color="gray" />
                                </div>
                              </div>
                              {cvvError ? (
                                <p className="nk-message-error !text-xs !text-left !m-0 !p-0">
                                  {cvvError}
                                </p>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                            <Form.Group>
                              <label className="font-bold !text-sm mt-3 m-0 !text-start w-full">
                                Name on the card
                                <sup className="text-red-600 !font-bold">*</sup>
                              </label>
                              <div className="relative">
                                <input
                                  className="p-1 !text-sm !rounded-none !bg-[#f3f3f3] w-full"
                                  type="text"
                                  placeholder="Enter account holder name"
                                  value={nameOnCard}
                                  onChange={handleNameChage}
                                  // isInvalid={nameOnCard && !validateName(name)}
                                />
                                <div
                                  className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400"
                                  style={{
                                    background: "#f3f3f3",
                                    right: "7px",
                                    paddingTop: "2px",
                                    paddingRight: "2px",
                                    top: "15px",
                                  }}
                                >
                                  <MdOutlineAccountCircle
                                    size={20}
                                    color="gray"
                                  />
                                </div>
                              </div>
                              {nameErr ? (
                                <p className="nk-message-error !text-xs !text-left !m-0 !p-0">
                                  {nameErr}
                                </p>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </Form>
                        }
                      </>
                    ) : (
                      <Typography className="!text-xs">
                        After clicking “Pay now”, you will be redirected to
                        Razorpay Secure (UPI, Cards, Wallets, NetBanking) to
                        complete your purchase securely.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
                {/* // ))} */}
              </RadioGroup>

              <div className="my-4">
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center p-2"
                  variant="contained"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
