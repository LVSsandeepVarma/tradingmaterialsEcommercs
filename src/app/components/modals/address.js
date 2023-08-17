// ShippingAddressModal.js
import React from "react";
import { Modal } from "react-bootstrap";
import AddressForm from "../forms/addressform";

const ShippingAddressModal = ({ show, onHide, data, type }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton={true}>
        <Modal.Title className="!font-bold">Add Shipping Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddressForm type={type} data={data} closeModal={onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default ShippingAddressModal;
