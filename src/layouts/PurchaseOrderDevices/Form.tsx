import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  SxProps,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useState } from "react";
import { getDataFile } from "../../services/PurchaseOrderDevices";
import {
  formsControlDeviceServiceInfo,
  IDeviceServiceInfo,
} from "../../types/IDeviceServiceInfo";
import DetailPannel from "./DetailPanel";

interface IProps {
  dataInit: IDeviceServiceInfo;
  handleSubmit?: (dataForm: IDeviceServiceInfo) => void;
  enableUpload?: boolean;
}

export default function FormCmp({
  dataInit,
  handleSubmit,
  enableUpload,
}: IProps) {
  const [data, setData] = useState<IDeviceServiceInfo>(dataInit);
  const [loading, setLoading] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.currentTarget);
    let formObject = Object.fromEntries(
      dataForm.entries()
    ) as unknown as IDeviceServiceInfo;
    if (handleSubmit)
      handleSubmit({
        ...formObject,
        DateCreate: data.DateCreate,
        listDeviceInfo: data.listDeviceInfo,
        listAccept: [],
      });
  };

  const handleGetFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setLoading(true);
      getDataFile(file).then(({ data }) => {
        setData({
          ...data,
          DateCreate: moment().unix().toString(),
        });
        setLoading(false);
      });
    }

    e.target.value = "";
  };

  return (
    <Box
      component="form"
      sx={{
        border: "1px solid  rgba(0,0,0,0.2)",
        m: 2,
        padding: 1,
      }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
    >
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box sx={{ ...style }}>
        {formsControlDeviceServiceInfo.map((x) => {
          const { sourceKey, label } = x;
          const value = data[sourceKey] ?? "";
          if (sourceKey === "listDeviceInfo" || sourceKey === "listAccept")
            return <></>;
          if (x.type === "Date")
            return (
              <LocalizationProvider key={sourceKey} dateAdapter={AdapterMoment}>
                <DatePicker
                  label={label}
                  value={new Date(Number(value) * 1000)}
                  onChange={(val: any) => {
                    setData({
                      ...data,
                      [sourceKey]: moment(Date.parse(val)).unix(),
                    });
                  }}
                  renderInput={(params: any) => (
                    <TextField key={sourceKey} {...params} />
                  )}
                  inputFormat="DD/MM/YYYY"
                />
              </LocalizationProvider>
            );

          return (
            <TextField
              value={value}
              key={sourceKey}
              label={label}
              variant="outlined"
              name={sourceKey}
              onChange={(e) => {
                setData({ ...data, [sourceKey]: e.target.value });
              }}
            />
          );
        })}
      </Box>

      <DetailPannel data={data} />
      <Box sx={{ my: 2, gap: 2, display: "flex", justifyContent: "end" }}>
        {enableUpload && (
          <Button variant="contained" component="label">
            Upload File
            <input type="file" hidden onChange={handleGetFile} />
          </Button>
        )}
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Box>
  );
}

const style: SxProps = {
  display: "flex",
  padding: "1rem",
  flexWrap: "wrap",
  borderRadius: "5px",
  justifyContent: "center",
  "& .MuiFormControl-root ": { m: 1, minWidth: "300px" },
};
