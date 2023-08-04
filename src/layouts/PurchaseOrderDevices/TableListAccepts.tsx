import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import moment from "moment";
import { IAccept } from "../../types/IDeviceServiceInfo";

interface IProps {
  dataSource: IAccept[];
}

const TableListAccept = ({ dataSource }: IProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Trạng thái xác nhận</StyledTableCell>
            <StyledTableCell align="center">Thời Gian xác nhận</StyledTableCell>
            <StyledTableCell align="center">Nội dung</StyledTableCell>
            <StyledTableCell align="center">ID nhân viên</StyledTableCell>
            <StyledTableCell align="center">Tên Nhân Viên</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSource.map((row, index) => (
            <StyledTableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {row.AcceptValue}
              </StyledTableCell>
              <StyledTableCell align="right">
                {moment.unix(Number(row.AcceptDate)).format("DD/MM/YYYY")}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.ContentAccept || "Trống"}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.EmployeeAcceptId}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.EmployeeAcceptName}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "& td, & th": {
    border: "1px solid #eee",
  },
}));

export default TableListAccept;
