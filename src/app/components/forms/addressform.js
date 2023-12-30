/* eslint-disable react/prop-types */
// AddressForm.js
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateaddressStatus } from "../../../features/address/addressSlice";
import { useNavigate } from "react-router-dom";
import SessionExpired from "../modals/sessionExpired";
import { Divider } from "@mui/material";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";

// eslint-disable-next-line react/prop-types
const AddressForm = ({ type, data, closeModal }) => {
  const loaderState = useSelector((state) => state?.loader?.value);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [apiErr, setApiErr] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSessionExppiry, setShowSessionExpiry] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [countryInput, setCountryInput] = useState("");
  const [countryArray, setCountryArray] = useState([]);
  const [countrySelected, setCountrySelected] = useState(false);

  function generateRandomTwoDigitNumber() {
    return Math.floor(Math.random() * 90) + 10; // Generates a random number between 10 and 99 (inclusive)
  }

  const AddressSchema = Yup.object().shape({
    city: Yup.string()
      .matches(
        /^\s*[A-Za-z& ]{3,50}\s*$/,
        "City must be within 3-50 characters"
      )

      .required("City is required"),
    state: Yup.string()
      .matches(
        /^\s*[A-Za-z& ]{3,50}\s*$/,
        "State must be within 3-50 characters"
      )

      .required("State is required"),
    country: Yup.string()
      .matches(
        /^\s*[A-Za-z ]{3,50}\s*$/,
        "Country must be within 3-50 characters"
      )

      .oneOf(countries, "Invalid country, please choose from the list")
      .required("Country is required"),
    add_1: Yup.string()
      .matches(/^\s*.{10,200}\s*$/, "Address must be within 10-200 characters")

      .required("Street Address 1 is required"),
    add_2: Yup.string().matches(
      /^\s*.{0,200}\s*$/,
      "Address must be within 10-200 characters"
    ),
    zip: Yup.string()
      .matches(
        /^\s*[0-9 ]{6,10}\s*$/,
        "Postal code must be within 6-10 characters"
      )

      .required("Postal Code is required"),
  });

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
    if (type != "add") {
      console.log("country", data?.country);
      setCountryInput(data?.country);
    }
  }, []);

  useEffect(() => {
    let countryFilteredArr = countryArray?.filter((country) =>
      country?.toLowerCase()?.startsWith(countryInput?.toLowerCase())
    );
    setCountries(countryFilteredArr);
    console.log("country", countryFilteredArr, countryInput, countryArray);
  }, [countryInput, countryArray]);

  const fetchStateAndCountry = async (setFieldValue, value) => {
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
        console.log(response?.data, "zipdata");
        setFieldValue("state", response?.data?.data?.info?.state);
        setFieldValue("city", response?.data?.data?.info?.district);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (values, { setFieldError }) => {
    // setIsSuccess(false);
    //   setIsFailure(false);
    try {
      dispatch(showLoader());
      setIsFailure(false);
      setIsSuccess(false);
      setApiErr("");
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
      }, 2000);
      const token = localStorage.getItem("client_token");
      const formData =
        type === "add"
          ? {
              city: values?.city,
              state: values?.state,
              country: values?.country,
              add_1: values?.add_1,
              add_2: values?.add_2,
              zip: values?.zip,
            }
          : {
              // eslint-disable-next-line react/prop-types
              id: data?.id,
              city: values?.city,
              state: values?.state,
              country: values?.country,
              add_1: values?.add_1,
              add_2: values?.add_2,
              zip: values?.zip,
            };
      const url =
        type === "add"
          ? "https://admin.tradingmaterials.com/api/lead/add-new/address"
          : "https://admin.tradingmaterials.com/api/lead/update/address";
      const response = await axios.post(url, formData, {
        headers: {
          "access-token": token,
        },
      });
      if (response?.data?.status) {
        setIsSuccess(true);
        dispatch(updateaddressStatus(`true-${generateRandomTwoDigitNumber()}`));
        setTimeout(() => {
          closeModal();
        }, 1000);
      }
    } catch (err) {
      if (err?.response?.data?.errors) {
        const responseErrors = err.response.data.errors;

        if (responseErrors.city) {
          setFieldError("city", responseErrors.city);
        }
        if (responseErrors.state) {
          setFieldError("state", responseErrors.state);
        }
        if (responseErrors.country) {
          setFieldError("country", responseErrors.country);
        }
        if (responseErrors.add_1) {
          setFieldError("add_1", responseErrors.add_1);
        }
        if (responseErrors.add_2) {
          setFieldError("add_2", responseErrors.add_2);
        }
        if (responseErrors.zip) {
          setFieldError("zip", responseErrors.zip);
        }
      } else {
        console.log(err?.response);
        if (err?.response?.data?.message?.includes("Token")) {
          // closeModal();
          setShowSessionExpiry(true);
        } else {
          setIsFailure(true);
          setApiErr([err?.response?.data?.message]);
        }
      }
    } finally {
      dispatch(hideLoader());
    }

    setTimeout(() => {
      setIsSuccess(false);
      setIsFailure(false);
    }, 6000);
  };

  function handleSessionExpiryClose() {
    setShowSessionExpiry(false);
    navigate("/?login");
  }

  function cleanAndSetFieldValue(fieldName, value, setFieldValue) {
    // Use regex to replace non-letter characters with an empty string

    const cleanedValue = value.replace(/[^A-Za-z ]/g, "");
    setFieldValue(fieldName, cleanedValue.trimStart());
  }

  function cleanAndSetPostalcodeValue(fieldName, value, setFieldValue) {
    // Use regex to replace non-letter characters with an empty string
    const cleanedValue = value.replace(/[^0-9]/g, "");
    fetchStateAndCountry(setFieldValue, cleanedValue);
    setFieldValue(fieldName, cleanedValue);
  }

  return (
    <>
      {loaderState && (
        <div className="preloader !backdrop-blur-[1px] ">
          <div className="loader"></div>
        </div>
      )}
      <SessionExpired
        open={showSessionExppiry}
        handleClose={handleSessionExpiryClose}
      />
      {isSuccess && (
        <div className="w-full flex justify-center items-center">
          <div
            className=" top-0 flex justify-center items-center !w-fit transform-translate-x-1/9 bg-green-500 text-white px-4 py-2 rounded shadow-lg   "
            style={{
              zIndex: 100000,
              animation: "slide-down 2s ease-in-out",
              animationFillMode: "forwards",
            }}
          >
            {type === "add"
              ? "Address added successfully!"
              : "Address updated successfully"}
          </div>
        </div>
      )}

      {/* Failure Alert */}
      {isFailure && (
        <div className="w-full flex justify-center items-center">
          <div
            className="top-0 flex justify-center items-center !w-fit transform-translate-x-1/9 bg-red-500 text-white px-4 py-2 rounded shadow-lg  "
            style={{
              animation: "slide-down 2s ease-in-out",
              animationFillMode: "forwards",
            }}
          >
            {apiErr}
          </div>
        </div>
      )}
      <Formik
        initialValues={
          type === "add"
            ? {
                city: "",
                state: "",
                country: "",
                add_1: "",
                add_2: "",
                zip: "",
              }
            : {
                city: data?.city,
                state: data?.state,
                country: data?.country,
                add_1: data?.add_1,
                add_2: data?.add_2 === null ? "" : data?.add_2,
                zip: data?.zip,
              }
        }
        validationSchema={AddressSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid !px-5 pb-5 overflow-auto">
              <div className="form-group mt-3 ">
                <label className="font-semibold" htmlFor="add_1">
                  Street Address 1
                  <sup className="text-red-600 !font-bold">*</sup>
                </label>
                {type === "view" ? (
                  <Field
                    type="text"
                    name="add_1"
                    className="form-control addressInput"
                    placeholder="House number and street name"
                    disabled
                  />
                ) : (
                  <Field
                    type="text"
                    name="add_1"
                    className="form-control addressInput"
                    placeholder="House number and street name"
                  />
                )}
                <ErrorMessage
                  name="add_1"
                  component="div"
                  className="nk-message-error text-xs"
                />
              </div>
              <div className="form-group mt-3 ">
                <label className="font-semibold" htmlFor="add_2">
                  Street Address 2
                </label>
                {type === "view" ? (
                  <Field
                    type="text"
                    name="add_2"
                    className="form-control addressInput"
                    placeholder="Apartment, suite, unit...."
                    disabled
                  />
                ) : (
                  <Field
                    type="text"
                    name="add_2"
                    className="form-control addressInput"
                    placeholder="Apartment, suite, unit...."
                  />
                )}
                <ErrorMessage
                  name="add_2"
                  component="div"
                  className="nk-message-error text-xs"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 ">
                <div className="form-group mt-3 ">
                  <label className="font-semibold" htmlFor="zip">
                    Postal code<sup className="text-red-600 !font-bold">*</sup>
                  </label>
                  {type === "view" ? (
                    <Field
                      type="text"
                      name="zip"
                      className="form-control addressInput"
                      placeholder="Postal code"
                      disabled
                    />
                  ) : (
                    <Field
                      type="text"
                      name="zip"
                      // pattern = "/^[0-9]{5,10}$|^[0-9]{3}\s[0-9]{3}$/"
                      className="form-control addressInput"
                      placeholder="Postal code"
                      onChange={(e) =>
                        cleanAndSetPostalcodeValue(
                          "zip",
                          e.target.value,
                          setFieldValue
                        )
                      }
                    />
                  )}
                  <ErrorMessage
                    name="zip"
                    component="div"
                    className="nk-message-error text-xs"
                  />
                </div>
                <div className="form-group mt-3 ">
                  <label className="font-semibold" htmlFor="city">
                    City<sup className="text-red-600 !font-bold">*</sup>
                  </label>
                  {type === "view" ? (
                    <Field
                      type="text"
                      name="city"
                      className="form-control addressInput"
                      placeholder="City"
                      disabled
                    />
                  ) : (
                    <Field
                      type="text"
                      name="city"
                      className="form-control addressInput"
                      placeholder="City"
                      onChange={(e) =>
                        cleanAndSetFieldValue(
                          "city",
                          e.target.value,
                          setFieldValue
                        )
                      }
                    />
                  )}
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="nk-message-error text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="form-group mt-3 ">
                  <label className="font-semibold" htmlFor="state">
                    State<sup className="text-red-600 !font-bold">*</sup>
                  </label>
                  {type === "view" ? (
                    <Field
                      type="text"
                      name="state"
                      className="form-control addressInput"
                      placeholder="State"
                      disabled
                    />
                  ) : (
                    <Field
                      type="text"
                      name="state"
                      className="form-control addressInput"
                      placeholder="State"
                      onChange={(e) =>
                        cleanAndSetFieldValue(
                          "state",
                          e.target.value,
                          setFieldValue
                        )
                      }
                    />
                  )}
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="nk-message-error text-xs"
                  />
                </div>
                <div className="form-group mt-3 ">
                  <label className="font-semibold" htmlFor="country">
                    Country<sup className="text-red-600 !font-bold">*</sup>
                  </label>
                  {type === "view" ? (
                    <Field
                      type="text"
                      name="country"
                      className="form-control addressInput"
                      placeholder="Country"
                      disabled
                    />
                  ) : (
                    <Field
                      type="text"
                      name="country"
                      className="form-control addressInput"
                      placeholder="Country"
                      onChange={(e) => {
                        cleanAndSetFieldValue(
                          "country",
                          e.target.value,
                          setFieldValue
                        );
                        setCountryInput(e.target.value);
                        setCountrySelected(true);
                      }}
                    ></Field>
                  )}
                  {countries?.length > 0 && countrySelected && (
                    <div className="shadow-lg px-2 py-2 overflow-auto max-h-[20vh]">
                      {countries?.map((country, ind) => (
                        <div
                          key={ind}
                          className="cursor-pointer hover-bg-slate-100  hover:shadow-xl"
                        >
                          <p
                            className=" hover:!text-blue-600 py-1 text-xs"
                            onClick={() => {
                              cleanAndSetFieldValue(
                                "country",
                                country,
                                setFieldValue
                              );
                              setCountryInput(country);
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
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="nk-message-error text-xs"
                  />
                </div>
              </div>
              {type !== "view" && (
                <button
                  disabled={formSubmitted}
                  type="submit"
                  className="btn btn-primary mt-3"
                >
                  Submit
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddressForm;
