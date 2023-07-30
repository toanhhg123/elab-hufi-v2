import { Alert, Snackbar } from "@mui/material";

interface IProps {
  errorMessage: string;
}

const ErrorComponent = ({ errorMessage }: IProps) => {
  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={6000}
    >
      <Alert severity="error" sx={{ width: "100%" }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};

export default ErrorComponent;
