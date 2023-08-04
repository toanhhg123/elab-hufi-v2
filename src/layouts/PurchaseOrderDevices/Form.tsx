import {
  Alert,
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
  IDeviceInfor,
  IDeviceServiceInfo,
} from "../../types/IDeviceServiceInfo";
import DetailPannel from "./DetailPanel";
import { useAppSelector } from "../../hooks";
import AlertDialog from "../../components/AlertDialog";
import { DeviceEditing, matchAccept } from "./utils";
import { GroupNames } from "../../types/userManagerType";

interface IProps {
  dataInit: IDeviceServiceInfo;
  handleSubmit?: (dataForm: IDeviceServiceInfo) => void;
  enableUpload?: boolean;
  handleOnClickAccept: (dataForm: IDeviceServiceInfo) => void;
  enableAcceptButton?: boolean;
  handleOnclickNoAccept?: (
    dataForm: IDeviceServiceInfo,
    message: string
  ) => void;
  handleReUpdate: (dataForm: IDeviceServiceInfo) => void;
  onDeleteOnclick: (dataForm: IDeviceServiceInfo) => void;
}

export default function FormCmp({
  dataInit,
  handleSubmit,
  enableUpload,
  handleOnClickAccept,
  enableAcceptButton,
  handleOnclickNoAccept,
  handleReUpdate,
  onDeleteOnclick,
}: IProps) {
  const {
    owner: { GroupName },
  } = useAppSelector((state) => state.userManager);
  const [data, setData] = useState<IDeviceServiceInfo>(dataInit);
  const [loading, setLoading] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [showBoxDelete, setShowBoxDelete] = useState(false);

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

  const handleTableDeviceInfoChange = (tableChange: IDeviceInfor[]) => {
    setData({ ...data, listDeviceInfo: tableChange });
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
          if (
            sourceKey === "listDeviceInfo" ||
            sourceKey === "listAccept" ||
            sourceKey === "Status"
          )
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
      <DetailPannel
        data={data}
        onTableDeviceInfoChange={handleTableDeviceInfoChange}
      />
      <Box sx={{ my: 2, gap: 2, display: "flex", justifyContent: "end" }}>
        {GroupName === GroupNames["Chuyên viên phòng QTTB"] &&
          data.Status === DeviceEditing && (
            <Button
              onClick={() => setShowBoxDelete(true)}
              variant="contained"
              color="error"
            >
              xoá
            </Button>
          )}
        {enableUpload && (
          <Button variant="contained" component="label">
            Upload File
            <input type="file" hidden onChange={handleGetFile} />
          </Button>
        )}

        <AlertDialog
          head="Form xác nhận"
          message="nhập nội dung đính kèm"
          isOpen={showBox}
          handleClose={() => setShowBox(false)}
          handleOk={(text) => {
            if (handleOnclickNoAccept) handleOnclickNoAccept(data, text || "");
          }}
          showBoxInput
          boxInputProps={{
            label: "nội dung",
          }}
        />

        <AlertDialog
          head="Form xác nhận"
          message="Bạn thực sự muốn xoá ??"
          isOpen={showBoxDelete}
          handleClose={() => setShowBoxDelete(false)}
          handleOk={() => {
            onDeleteOnclick(data);
          }}
        />

        {enableAcceptButton && matchAccept(GroupName, data.Status || "") && (
          <Button
            variant="contained"
            onClick={() => setShowBox(true)}
            color="warning"
          >
            Không xác nhận
          </Button>
        )}

        {GroupName === GroupNames["Chuyên viên phòng QTTB"] &&
        data.Status === DeviceEditing ? (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleReUpdate(data);
            }}
          >
            Lưu những chỉnh sửa
          </Button>
        ) : (
          <></>
        )}

        {enableAcceptButton && matchAccept(GroupName, data.Status || "") && (
          <Button
            onClick={() => handleOnClickAccept(data)}
            variant="contained"
            color="success"
          >
            xác nhận
          </Button>
        )}

        <Button type="submit" variant="contained">
          Lưu lại
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
