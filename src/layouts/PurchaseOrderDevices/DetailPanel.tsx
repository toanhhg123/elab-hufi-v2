import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import { MRT_Row, MRT_TableInstance } from "material-react-table";
import { useState } from "react";
import { IDeviceServiceInfo } from "../../types/IDeviceServiceInfo";
import TableListAccept from "./TableListAccepts";
import TableListDeviceInfo from "./TableListDeviceInfor";

const DetailPannel = (props: {
  row: MRT_Row<IDeviceServiceInfo>;
  table: MRT_TableInstance<IDeviceServiceInfo>;
}) => {
  const [value, setValue] = useState("listAccept");

  const { row } = props;
  const { listAccept, listDeviceInfo } = row.original;

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
          <TableListDeviceInfo dataSource={listDeviceInfo ?? []} />
        )}
      </Box>
    </Box>
  );
};

export default DetailPannel;
