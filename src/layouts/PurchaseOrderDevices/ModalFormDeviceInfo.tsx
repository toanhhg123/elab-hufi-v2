import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { IDeviceInfor } from "../../types/IDeviceServiceInfo";

interface IProps {
  columns: MRT_ColumnDef<IDeviceInfor>[];
  onClose: () => void;
  onSubmit: (values: IDeviceInfor) => void;
  open: boolean;
  dataForm: IDeviceInfor;
}

export const ModalFormDeviceInfo = ({
  open,
  columns,
  onClose,
  onSubmit,
  dataForm,
}: IProps) => {
  const [values, setValues] = useState<IDeviceInfor>(dataForm);

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  useEffect(() => {
    setValues(dataForm);
  }, [dataForm]);

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Form</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map(({ accessorKey, header }, i) => {
              if (!accessorKey)
                return <React.Fragment key={i}></React.Fragment>;

              const value = values[accessorKey];

              if (
                accessorKey === "DateImport" ||
                accessorKey === "StartGuarantee" ||
                accessorKey === "EndGuarantee"
              )
                return (
                  <LocalizationProvider key={i} dateAdapter={AdapterMoment}>
                    <DatePicker
                      label={header}
                      value={new Date(Number(value) * 1000)}
                      onChange={(val: any) => {
                        setValues({
                          ...values,
                          [accessorKey]: moment(Date.parse(val)).unix(),
                        });
                      }}
                      renderInput={(params: any) => (
                        <TextField key={accessorKey} {...params} />
                      )}
                      inputFormat="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                );

              return (
                <TextField
                  value={values[accessorKey] || ""}
                  key={i}
                  label={header}
                  name={accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
