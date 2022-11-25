import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IExportChemRegType } from '../../../types/chemicalWarehouseType';

const ExportChemRegTable: FC<{ exportChemReg: IExportChemRegType[] }> = ({ exportChemReg }) => {
  const [tableData, setTableData] = useState<IExportChemRegType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  useEffect(() => {
    setTableData(exportChemReg);
  }, [exportChemReg])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IExportChemRegType>,
    ): MRT_ColumnDef<IExportChemRegType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IExportChemRegType>[]>(
    () => [
      {
        accessorKey: 'Instructor',
        header: 'Người đăng ký',
        size: 50,
      },
      {
        accessorKey: 'Semester',
        header: 'Học kỳ',
        size: 50,
      },
      {
        accessorKey: 'Schoolyear',
        header: 'Năm học',
        size: 50,
      },
      {
        accessorKey: 'Amount',
        header: 'SL xuất',
        size: 50,
      },
      {
        accessorKey: 'ThesisName',
        header: 'Tên đề tài',
        size: 50,
      },
    ],
    [getCommonEditTextFieldProps],
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'Các hành động',
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          'mrt-row-numbers': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          }
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        enableRowNumbers
        enablePinning
        initialState={{
          density: 'compact',
          columnOrder: [
            'mrt-row-numbers',
            ...columns.map(item => item.accessorKey || ''),
          ]
        }}
        renderTopToolbarCustomActions={() => (
          <h3 style={{ "margin": "0px" }}>
            <b><KeyboardArrowRightIcon
              style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin xuất hóa chất cho nghiên cứu</span>
          </h3>
        )}
      />
    </>
  );
};

export default React.memo(ExportChemRegTable);
