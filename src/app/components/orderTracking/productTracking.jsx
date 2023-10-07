/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import { FaBoxOpen, FaBoxes, FaWindowClose } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { BsArrowLeftRight, BsFillFileEarmarkCheckFill } from "react-icons/bs";
import { MdOutlinePendingActions } from "react-icons/md";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { TbTruckReturn } from "react-icons/tb";
import { GiReturnArrow } from "react-icons/gi";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { MobileStepper } from "@mui/material";

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    // 0: <MdOutlinePendingActions className="w-fit h-[30px]" />,
    1: <FaBoxes className="w-fit h-[30px]" />,
    2: <BsFillFileEarmarkCheckFill className="w-fit h-[30px]" />,
    3: <TbTruckDelivery className="w-fit h-[30px] " />,
    4: <FaBoxOpen className="w-fit h-[30px] flex justify-end" />,
    // 8: <FaWindowClose className="w-fit h-[30px]" />,
    // 9: <GiReturnArrow className="!w-fit h-[30px]" />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = [
//    "Placed ",
  "Placed",
  "Confirmed",
  "Dispatched",
  "Delivered",
//   "Delivered",
//   "Delivered",
];

// eslint-disable-next-line react/prop-types
export default function CustomizedSteppers({ orderStatus }) {
  console.log(orderStatus);
  const [windowWidth, setWindowWidth] = useState("vertical");

  // Function to update the window width state
//   const updateWindowWidth = () => {
//     if (window.innerWidth < 780) setWindowWidth("vertical");
//     else setWindowWidth("horizontal")
//     console.log(window.innerWidth, "innerWidth")

    
//   };

//   useEffect(() => {
//     // Add an event listener to listen for window resize events
//     window.addEventListener("resize", updateWindowWidth);


//     // Clean up the event listener when the component unmounts
//     return () => {
//       window.removeEventListener("resize", updateWindowWidth);
//     };
//   },[]);

  return (
    <Stack sx={{ width: "100%" }} spacing={"12px"}>
      <Stepper alternativeLabel orientation={"horizontal"}   activeStep={parseInt(orderStatus)}  connector={<ColorlibConnector />}>
        {steps.map((label,index) => 
            (
                <Step key={index}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            )
        
            
        )}
      </Stepper>
    </Stack>
  );
}
