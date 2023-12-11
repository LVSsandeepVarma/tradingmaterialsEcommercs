/* eslint-disable no-unused-vars */
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";
  import React from "react";
  import { useDispatch } from "react-redux";
  import { usersignupinModal } from "../../../features/signupinModals/signupinSlice";
  import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
  // import { useNavigate } from 'react-router-dom'
  
  // eslint-disable-next-line react/prop-types
  export default function SessionExpired({ open, handleClose }) {
    const dispatch = useDispatch();
    // const navigate = useNavigate()
  
    return (
      <>
        <Dialog open={open}>
          <DialogTitle className="text-danger">Session Expired !</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div className="">
                <p>
                  <QueryBuilderIcon fontSize="medium" />
                  Your session has been expired. Please Login again
                </p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  