import _React from "react";
import Box from "@mui/material/Box";
import { FC } from "react";

const TrainSchedule: FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* {(token.type === 'student' || token.type === 'researcher') && <RegisterTrainSchedule />}
			{(token.type === 'employee') && <ManagerTrainSchedule />} */}
    </Box>
  );
};

export default TrainSchedule;
