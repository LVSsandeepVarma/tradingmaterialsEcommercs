/* eslint-disable react/prop-types */
// AddressForm.js
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateaddressStatus } from "../../../features/address/addressSlice";
import { useNavigate } from "react-router-dom";
import SessionExpired from "../modals/sessionExpired";

const AddressSchema = Yup.object().shape({
  city: Yup.string()
    .matches(/^[A-Za-z& ]{3,50}$/, "City must be within 3-50 characters")
    .required("City is required"),
  state: Yup.string()
    .matches(/^[A-Za-z& ]{3,50}$/, "State must be within 3-50 characters")
    .required("State is required"),
  country: Yup.string()
    .matches(/^[A-Za-z ]{3,50}$/, "Country must be within 3-50 characters")
    .required("Country is required"),
  add_1: Yup.string()
    .matches(/^.{10,200}$/, "Address must be within 10-200 characters")
    .required("Street Address 1 is required"),
  add_2: Yup.string().matches(
    /^.{0,200}$/,
    "Address must be within 10-200 characters"
  ),
  zip: Yup.string()
    .matches(/^[0-9 ]{6,10}$/, "Postal code must be within 6-10 characters")
    .required("Postal Code is required"),
});

// eslint-disable-next-line react/prop-types
const AddressForm = ({ type, data, closeModal }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [apiErr, setApiErr] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showSessionExppiry, setShowSessionExpiry] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function generateRandomTwoDigitNumber() {
    return Math.floor(Math.random() * 90) + 10; // Generates a random number between 10 and 99 (inclusive)
  }

  const handleSubmit = async (values,{ setFieldError }) => {
    // setIsSuccess(false);
    //   setIsFailure(false);
    try {
      setIsFailure(false);
      setIsSuccess(false);
      setApiErr("");
      setFormSubmitted(true)
      setTimeout(()=>{
        setFormSubmitted(false)
      },2000)
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
          setFieldError('city', responseErrors.city);
        }
        if (responseErrors.state) {
          setFieldError('state', responseErrors.state);
        }
        if (responseErrors.country) {
          setFieldError('country', responseErrors.country);
        }
        if (responseErrors.add_1) {
          setFieldError('add_1', responseErrors.add_1);
        }
        if (responseErrors.add_2) {
          setFieldError('add_2', responseErrors.add_2);
        }
        if (responseErrors.zip) {
          setFieldError('zip', responseErrors.zip);
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
    const cleanedValue = value.replace(/[^A-Za-z ]/g, '');
    setFieldValue(fieldName, cleanedValue);
  }

  function cleanAndSetPostalcodeValue(fieldName, value, setFieldValue) {
    // Use regex to replace non-letter characters with an empty string
    const cleanedValue = value.replace(/[^0-9]/g, '');
    setFieldValue(fieldName, cleanedValue);
  }

  return (
    <>
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
        {({ handleSubmit,setFieldValue  }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid !px-5 pb-5">
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
                      onChange={(e) => cleanAndSetFieldValue("city", e.target.value, setFieldValue)}
                    />
                  )}
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="nk-message-error text-xs"
                  />
                </div>
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
                      onChange={(e) => cleanAndSetFieldValue("state", e.target.value, setFieldValue)}
                    />
                  )}
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="nk-message-error text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
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
                      onChange={(e) => cleanAndSetFieldValue("country", e.target.value, setFieldValue)}

                    />
                  )}
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="nk-message-error text-xs"
                  />
                </div>
                <div className="form-group mt-3 ">
                  <label className="font-semibold" htmlFor="zip">
                    Postalcode<sup className="text-red-600 !font-bold">*</sup>
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
                      onChange={(e) => cleanAndSetPostalcodeValue("zip", e.target.value, setFieldValue)}
                    />
                  )}
                  <ErrorMessage
                    name="zip"
                    component="div"
                    className="nk-message-error text-xs"
                  />
                </div>
              </div>
              {type !== "view"  && (
                <button disabled={formSubmitted} type="submit" className="btn btn-primary mt-3">
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
