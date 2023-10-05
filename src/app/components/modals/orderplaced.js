import React from "react";
import { Modal } from "react-bootstrap";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function OrderPlacedRepresentativeModal({ show, hide }) {
  const navigate = useNavigate();
  return (
    <>
      <Modal
        show={show}
        onHide={hide}
        centered
        size="md"
        // style={{ borderRadius: "0.75rem" }}
        className="offer order"
      >
        {/* <Modal.Header className="!text-center w-full !text-white !font-bold text-2xl bg-[#8fd499] !fill-white-500 p-[8px]">
          Sign Up for Special Offer
          <div className="cursor-pointer" onClick={() => dispatch(hidePopup())}>
            <CloseIcon className="!font-bold !text-4xl" />
          </div>
        </Modal.Header> */}
        <Modal.Body
          className="p-0  drop-shadow-lg min-h-[25vh]"
          style={{
            // borderRadius: "0.75rem",
            paddingLeft: "30px !important",
            paddingTop: "9px !important",
          }}
        >
          <div className="p-2">
            <div className="img_component flex drop-shadow-xl justify-center">
              <img src="/images/tm-logo-1.png" alt="log"></img>
            </div>
            <div className="flex items-center justify-around">
              <ConnectWithoutContactIcon
                className="!w-15 drop-shadow-xl  !h-15"
                style={{ width: "auto", height: "75px" }}
              />
              <div className="hover:drop-shadow-2xl">
                <p className="inline text-left">Thank you for placing order,</p>
                <p className="">Our representative will contact you shortly.</p>
              </div>
            </div>
            <div className=" mb-2 buttonss-off cursor-pointer float-right">
              <a className="cart-btn" onClick={() => navigate("/")}>
                Go to Home
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
