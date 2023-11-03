/* eslint-disable react/prop-types */
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { useState } from "react";
import { Alert } from "@mui/material";
import axios from "axios";

export default function HelpfullDialog({ type, open, handleClose, ReviewId }) {
  const [report, setReport] = useState("");
  const [reportErr, setReportErr] = useState("");
  const [apiError, setApiError] = useState([]);
  const [apiSuccess, setApiSuccess] = useState("");
  const dispatch = useDispatch();

    React.useEffect(()=>{

        async function reviewHelpfulReport() {
            setApiError([]);
            setApiSuccess("");
            console.log("hello")
            if (report !== "" && reportErr === "") {
              try {
                dispatch(showLoader());
        
                const response = await axios.post(
                  "https://admin.tradingmaterials.com/api/lead/product/review-report",
                  {
                    review_id: ReviewId,
                    type: "helpfull",
                  },
                  {
                    headers: {
                      "access-token": localStorage.getItem("client_token"),
                      Accept: "application/json",
                    },
                  }
                );
                if (response?.data?.status) {
                  setApiSuccess(response?.data?.message);
                  setTimeout(() => {
                    handleClose();
                  }, 5000);
                }
              } catch (err) {
                console.log(err);
                if (err?.response?.data?.errors) {
                  setReportErr(err?.response?.data?.errors["description"]);
                } else {
                  setApiError([err?.response?.data?.message]);
                  setTimeout(() => {
                    setApiError([]);
                  }, 5000);
                }
              } finally {
                dispatch(hideLoader());
              }
            } else {
              setReportErr("Reason for reporting is required");
            }
          }
          reviewHelpfulReport()
    },[])



  function handleReportUpdate(e) {
    e.target.value = e.target.value.trimStart();
    console.log(e?.target?.value);
    if (e?.target?.value === "") {
      setReportErr("report is required");
    } else if (e?.target?.value !== "") {
      setReport(e?.target?.value);
      setReportErr("");
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {type === "report" ? "Submit a Report" : "Feedback"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {type === "report"
              ? "Please mention your reason for reporting this review."
              : "Thank you for your Feedback."}
          </DialogContentText>
          {type === "report" && (
            <>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Reason for report"
                type="textarea"
                fullWidth
                variant="standard"
                onChange={handleReportUpdate}
                value={report}
              />
              <p className="nk-message-error text-xs">{reportErr}</p>

              {apiSuccess && (
                <Alert variant="outlined" severity="success" className="mt-2">
                  <p className="text-green-900 font-semibold">{apiSuccess}</p>
                </Alert>
              )}

              {apiError?.length > 0 &&
                apiError?.map((err, ind) => {
                  return (
                    <Alert key={ind*5} variant="outlined" severity="error" className="mt-2">
                      <p key={ind} className="nk-message-error text-xs">
                        {err}
                      </p>
                    </Alert>
                  );
                })}
            </>
          )}
           {apiSuccess && (
                <Alert variant="outlined" severity="success" className="mt-2">
                  <p className="text-green-900 font-semibold">{apiSuccess}</p>
                </Alert>
              )}

              {apiError?.length > 0 &&
                apiError?.map((err, ind) => {
                  return (
                    <Alert key={ind} variant="outlined" severity="error" className="mt-2">
                      <p key={ind} className="nk-message-error text-xs">
                        {err}
                      </p>
                    </Alert>
                  );
                })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {type === "report" ? "Cancel" : "Close"}
          </Button>
          
          {type === "report" &&
          // eslint-disable-next-line no-undef
           <Button onClick={handleSubmit}>Report</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
