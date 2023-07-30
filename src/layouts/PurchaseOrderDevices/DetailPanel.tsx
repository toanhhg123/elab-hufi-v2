import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { IDeviceServiceInfo } from "../../types/IDeviceServiceInfo";
import TableListAccept from "./TableListAccepts";
import TableListDeviceInfo from "./TableListDeviceInfor";

const DetailPannel = (props: { data: IDeviceServiceInfo }) => {
  const [value, setValue] = useState("listAccept");

  const { listAccept, listDeviceInfo } = props.data;

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange}>
        <Tab value={"listAccept"} label={"Danh sách xác nhận"} />;
        <Tab value={"listDeviceInfo"} label={"Danh sách thông tin thiết bị"} />;
      </Tabs>

      <Box sx={{ m: "2rem" }}>
        {value === "listAccept" && (
          <TableListAccept dataSource={listAccept ?? []} />
        )}

        {value === "listDeviceInfo" && (
          <TableListDeviceInfo
            alowExportCsv
            dataSource={listDeviceInfo ?? []}
          />
        )}
      </Box>
    </Box>
  );
};

export default DetailPannel;
