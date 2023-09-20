/* eslint-disable react/prop-types */
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../features/loader/loaderSlice";
import { useState } from "react";
import axios from "axios";

export default function ReviewDialog({ type, open, handleClose, reviewId }) {
  const [report, setReport] = useState("");
  const [reportErr, setReportErr] = useState("");
  const [apiError, setApiError] = useState([]);
  const [apiSuccess, setApiSuccess] = useState("");
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.user?.value);
  async function handleSubmit() {
    setApiError([]);
    setApiSuccess("");
    if (report !== "" && reportErr === "") {
      try {
        dispatch(showLoader());
        if (type === "report") {
          console.log(reviewId);
          const response = await axios.post(
            "https://admin.tradingmaterials.com/api/client/product/review-report",
            {
              review_id: reviewId,
              description: report,
              type: type,
              client_id: userData?.client?.id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("client_token")}`,
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
        } else {
          const response = await axios.post(
            "https://admin.tradingmaterials.com/api/client/product/review-report",
            {
              review_id: reviewId,
              type: "helpfull",
              client_id: userData?.client?.id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("client_token")}`,
                Accept: "application/json",
              },
            }
          );
          if (response?.data?.status) {
            setApiSuccess(response?.data?.message);
            setTimeout(() => {
              handleClose();
            }, 2000);
          }
        }
      } catch (err) {
        console.log(err);
        if (err?.response?.data?.errors) {
          setReportErr(err?.response?.data?.errors["description"]);
          setReportErr(err?.response?.data?.errors["review_id"]);
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

  function handleReportUpdate(e) {
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
          {type === "report" ? "Submit a Report" : "Helpful"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {type === "report"
              ? "Please mention your reason for reporting this review."
              : "Thank you fro your Feedback."}
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
              <p className="text-red-700">{reportErr}</p>

              {apiSuccess && (
                <p className="text-green-900 font-semibold">{apiSuccess}</p>
              )}

              {apiError?.length > 0 &&
                apiError?.map((err, ind) => {
                  return (
                    <p key={ind} className="text-red-600 font-semibold">
                      {err}
                    </p>
                  );
                })}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {type === "report" ? "Cancel" : "Close"}
          </Button>
          {type === "report" && <Button onClick={handleSubmit}>Report</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
