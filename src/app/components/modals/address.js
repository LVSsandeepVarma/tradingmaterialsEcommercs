/* eslint-disable react/prop-types */
// ShippingAddressModal.js
import React from "react";
import { Modal } from "react-bootstrap";
import AddressForm from "../forms/addressform";

const ShippingAddressModal = ({ show, onHide, data, addressType, type }) => {
  console.log(data)
  return (
    <Modal show={show} onHide={onHide} scrollable centered size="lg">
      <Modal.Header closeButton={true}>
        <Modal.Title className="!font-bold">{type?.charAt(0)?.toUpperCase() + type?.slice(1)} {addressType?.charAt(0)?.toUpperCase()+ addressType?.slice(1)} Address</Modal.Title>
      </Modal.Header>
      <Modal.Body className="!pt-0">
        <AddressForm type={type} data={data} closeModal={onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default ShippingAddressModal;
