/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
// import PropTypes from "prop-types";
// import { styled } from "@mui/material/styles";
// import Rating from "@mui/material/Rating";
// import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
// import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
// import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
// import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
// import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { Button } from "@mui/material";
import { Form } from "react-bootstrap";
import { useState } from "react";

// const StyledRating = styled(Rating)(({ theme }) => ({
//   "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
//         color: theme.palette.action.disabled,

//   },
// }));

// const customIcons = {
//   1: {
//     icon: (
//       // <SentimentVeryDissatisfiedIcon
//       //   color="error"
//       //   className="!w-12 !h-12"
//       // />
//       <img
//         src="/images/rating/terrible.png"
//         className="grayscale"
//         alt="terrible"
//       />
//     ),
//     label: "Very Dissatisfied",
//   },
//   2: {
//     icon: (
//       // <SentimentDissatisfiedIcon
//       //   color="error"
//       //   className="!w-12 !h-12 "
//       // />
//       <img src="/images/rating/bad.png" alt="bad" className="grayscale" />
//     ),
//     label: "Dissatisfied",
//   },
//   3: {
//     icon: (
//       <img src="/images/rating/okay.png" alt="okay" className="grayscale" />
//     ),
//     // <SentimentSatisfiedIcon color="warning" className="!w-12 !h-12 " />,
//     label: "Neutral",
//   },
//   4: {
//     icon: (
//       <img src="/images/rating/good.png" alt="good" className="grayscale " color="success" />
//       // <SentimentSatisfiedAltIcon color="success" className="!w-12 !h-12 " />
//     ),
//     label: "Satisfied",
//   },
//   5: {
//     icon: (
//       <img
//         src="/images/rating/excellent.png"
//         alt="excellent"
//         className="grayscale"
//       />
//       // <SentimentVerySatisfiedIcon color="success" className="!w-fit !h-12" />
//     ),
//     label: "Very Satisfied",
//   },
// };

// function IconContainer(props) {
//   const { value, ...other } = props;
//   return <span {...other}>{customIcons[value].icon}</span>;
// }

// IconContainer.propTypes = {
//   value: PropTypes.number.isRequired,
// };

export default function EmojiRating({ orderDetails }) {
  const [ratingSelected, setRatingSelected] = useState(4);
  return (
    <>
      <div className="flex justify-between items-center my-2 flex-wrap">
        <img
          src={orderDetails?.order?.product?.img_1}
          alt="im"
          className="w-auto h-20 "
        />

        <div>
          <div className="flex justify-between gap-2 items-center">
            <img
              src="/images/rating/terrible.png"
              className={`${
                ratingSelected == 1 ? "" : "grayscale hover:!grayscale-0"
              } !w-fit !h-8 !cursor-pointer`}
              alt="terrible"
              onClick={() =>
                (window.location.href =
                  "https://client.tradingmaterials.com/login")
              }
            />
            <img
              src="/images/rating/bad.png"
              alt="bad"
              className={`${
                ratingSelected == 2 ? "" : "grayscale hover:!grayscale-0"
              } !w-fit !h-8 !cursor-pointer`}
              onClick={() =>
                (window.location.href =
                  "https://client.tradingmaterials.com/login")
              }
            />
            <img
              src="/images/rating/okay.png"
              alt="okay"
              className={`${
                ratingSelected == 3 ? "" : "grayscale hover:!grayscale-0"
              } !w-fit !h-8 !cursor-pointer`}
              onClick={() =>
                (window.location.href =
                  "https://client.tradingmaterials.com/login")
              }
            />
            <img
              src="/images/rating/good.png"
              alt="good"
              className={`${
                ratingSelected == 4 ? "" : "grayscale hover:!grayscale-0"
              } !w-fit !h-8 !cursor-pointer`}
              onClick={() =>
                (window.location.href =
                  "https://client.tradingmaterials.com/login")
              }
              color="success"
            />
            <img
              src="/images/rating/excellent.png"
              alt="excellent"
              className={`${
                ratingSelected == 5 ? "" : "grayscale hover:grayscale-0"
              } !w-fit !h-8 !cursor-pointer`}
              onClick={() =>
                (window.location.href =
                  "https://client.tradingmaterials.com/login")
              }
            />
          </div>
        </div>
      </div>

      {/* <>
        <div className="text-start">
          <Form>
            <div className="form-group">
              <label className="form-label text-xs !mb-1 font-normal">
                Remarks
                <sup className="text-[#fb3048] !font-bold">*</sup>
              </label>
              <div className="form-control-wrap !min-h-0">
                <textarea
                  rows={3}
                  type="text"
                  className="form-control !py-2 !px-3 placeholder:!font-[400] placeholder:!text-[#cac7cf] !min-h-0"
                  placeholder="Enter your Remarks (Max 250 charecters"
                  maxLength={250}

                />
              </div>

              <Button variant="outlined" className="my-3 float-right">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </> */}
    </>
  );
}
