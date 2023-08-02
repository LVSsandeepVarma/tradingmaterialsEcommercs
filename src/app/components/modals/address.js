// ShippingAddressModal.js
import React from 'react';
import { Modal } from 'react-bootstrap';
import AddressForm from '../forms/addressform';

const ShippingAddressModal = ({ show, onHide,  }) => {
  return (
    <Modal  show={show} onHide={onHide} centered size='lg'>
      <Modal.Header  closeButton= {true}>
        <Modal.Title>Add Shipping Address</Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <AddressForm  />
      </Modal.Body>
    </Modal>
  );
};

export default ShippingAddressModal;
