import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
  message: string;
  handleOk: (input?: string) => void;
  head?: string;
  showBoxInput?: boolean;
  boxInputProps?: {
    label?: string;
    type?: string;
  };
}

export default function AlertDialog({
  isOpen,
  handleClose,
  message,
  handleOk,
  head,
  showBoxInput,
  boxInputProps,
}: IProps) {
  const [input, setInput] = useState("");

  function handleOkClick(): void {
    handleOk(input);
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ minWidth: 400 }} id="alert-dialog-title">
          {head ? head : "Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
          {showBoxInput && (
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={boxInputProps?.label || "text"}
              type={boxInputProps?.type || "text"}
              fullWidth
              variant="standard"
              onChange={(e) => setInput(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ bỏ</Button>
          <Button onClick={handleOkClick} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
