/* eslint-disable react/prop-types */
// AddressForm.js
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateaddressStatus } from "../../../features/address/addressSlice";

const AddressSchema = Yup.object().shape({
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  add_1: Yup.string().required("Street Address 1 is required"),
  add_2: Yup.string(),
  zip: Yup.string().required("Zipcode is required"),
});

// eslint-disable-next-line react/prop-types
const AddressForm = ({ type, data, closeModal }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const userData = useSelector((state) => state?.user?.value);
  const dispatch = useDispatch();
  console.log(type, data);

  function generateRandomTwoDigitNumber() {
    return Math.floor(Math.random() * 90) + 10; // Generates a random number between 10 and 99 (inclusive)
  }

  const handleSubmit = async (values) => {
    // setIsSuccess(false);
    //   setIsFailure(false);
    try {
      setIsFailure(false);
      setIsSuccess(false);
      const token = localStorage.getItem("client_token");
      const formData =
        type === "add"
          ? {
              city: values?.city,
              state: values?.state,
              country: values?.country,
              add_1: values?.add_1,
              add_2: values?.add_2 !== null ? values?.add_2 : "",
              zip: values?.zip,
              client_id: userData?.client?.id,
            }
          : {
              id: data?.id,
              city: values?.city,
              state: values?.state,
              country: values?.country,
              add_1: values?.add_1,
              add_2: values?.add_2 !== null ? values?.add_2 : "",
              zip: values?.zip,
              client_id: userData?.client?.id,
            };
      const url =
        type === "add"
          ? "https://admin.tradingmaterials.com/api/client/add-new/address"
          : "https://admin.tradingmaterials.com/api/client/update/address";
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data?.status) {
        setIsSuccess(true);
        dispatch(updateaddressStatus(`true-${generateRandomTwoDigitNumber()}`));
        closeModal();
      }
    } catch (err) {
      setIsFailure(true);
      console.log(err, "error");
    }

    setTimeout(() => {
      setIsSuccess(false);
      setIsFailure(false);
    }, 6000);
  };

  return (
    <>
      {isSuccess && (
        <div
          className=" top-0 left-1/2 transform-translate-x-1/9 bg-green-500 text-white px-4 py-2 rounded shadow-lg absolute  "
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
      )}

      {/* Failure Alert */}
      {isFailure && (
        <div
          className="top-0 left-1/2 transform-translate-x-1/9 bg-red-500 text-white px-4 py-2 rounded shadow-lg absolute "
          style={{
            animation: "slide-down 2s ease-in-out",
            animationFillMode: "forwards",
          }}
        >
          Address submission failed!
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
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="form-group mt-3 ">
              <label className="font-semibold" htmlFor="add_1">
                Street Address 1
              </label>
              {type==="view" ? <Field
                type="text"
                name="add_1"
                className="form-control"
                placeholder="House number and street name"
                disabled
              /> : <Field
              type="text"
              name="add_1"
              className="form-control"
              placeholder="House number and street name"
            />}
              <ErrorMessage
                name="add_1"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="form-group mt-3 ">
              <label className="font-semibold" htmlFor="add_2">
                Street Address 2
              </label>
              { type==="view" ? <Field
                type="text"
                name="add_2"
                className="form-control"
                placeholder="Apartment, suite, unit...."
                disabled
              /> : <Field
              type="text"
              name="add_2"
              className="form-control"
              placeholder="Apartment, suite, unit...."
            />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group mt-3 ">
                <label className="font-semibold" htmlFor="city">
                  City
                </label>
                {type==="view" ? <Field
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="City"
                  disabled
                /> : <Field
                type="text"
                name="city"
                className="form-control"
                placeholder="City"
              />}
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="form-group mt-3 ">
                <label className="font-semibold" htmlFor="state">
                  State
                </label>
               {type==="view" ?  <Field
                  type="text"
                  name="state"
                  className="form-control"
                  placeholder="State"
                  disabled
                />: <Field
                type="text"
                name="state"
                className="form-control"
                placeholder="State"
              />}
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group mt-3 ">
                <label className="font-semibold" htmlFor="country">
                  Country
                </label>
                {type=== "view" ? <Field
                  type="text"
                  name="country"
                  className="form-control"
                  placeholder="United States (US)"
                  disabled 
                  

                /> : <Field
                type="text"
                name="country"
                className="form-control"
                placeholder="United States (US)"
              />}
                <ErrorMessage
                  name="country"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="form-group mt-3 ">
                <label className="font-semibold" htmlFor="zip">
                  Postcode Zip
                </label>
                {type==="view" ? <Field
                  type="text"
                  name="zip"
                  className="form-control"
                  placeholder="postal zip"
                  disabled
                /> :  <Field
                type="text"
                name="zip"
                className="form-control"
                placeholder="postal zip"
              />}
                <ErrorMessage
                  name="zip"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
            {type!== "view" && <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>}
          </div>
        </Form>
        )}
      </Formik>
    </>
  );
};

export default AddressForm;
