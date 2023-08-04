import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import {
  IDeviceInfor,
  IDeviceServiceInfo,
} from "../../types/IDeviceServiceInfo";
import TableListAccept from "./TableListAccepts";
import TableListDeviceInfo from "./TableListDeviceInfor";

interface IProps {
  data: IDeviceServiceInfo;
  onTableDeviceInfoChange: (data: IDeviceInfor[]) => any;
}

const DetailPannel = (props: IProps) => {
  const [value, setValue] = useState("listDeviceInfo");

  const { listAccept, listDeviceInfo } = props.data;

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange}>
        <Tab value={"listDeviceInfo"} label={"Danh sách thông tin thiết bị"} />;
        <Tab value={"listAccept"} label={"Lịch sử xác nhận"} />;
      </Tabs>

      <Box sx={{ m: "2rem" }}>
        {value === "listAccept" && (
          <TableListAccept dataSource={listAccept ?? []} />
        )}

        {value === "listDeviceInfo" && (
          <TableListDeviceInfo
            alowExportCsv
            dataSource={listDeviceInfo ?? []}
            onTableChange={props.onTableDeviceInfoChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default DetailPannel;
