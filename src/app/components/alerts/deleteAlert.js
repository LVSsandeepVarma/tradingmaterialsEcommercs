import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// eslint-disable-next-line react/prop-types, no-unused-vars
export default function DeleteAlert({open, close}) {




  return (
    <div>
      
      <Dialog
        open={true}
        onClose={close("disagree")}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete the product from cart ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           You are about to delete this product from your cart, you can add it later anytime.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{close("disagree")}}>Delete</Button>
          <Button onClick={()=>{close("agree")}} autoFocus>
            Keep it
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
