import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IExportChemicalType } from '../../../types/chemicalWarehouseType';

const ExportChemicalTable: FC<{ exportChemical: IExportChemicalType[] }> = ({ exportChemical }) => {
  const [tableData, setTableData] = useState<IExportChemicalType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  useEffect(() => {
    setTableData(exportChemical);
  }, [exportChemical])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IExportChemicalType>,
    ): MRT_ColumnDef<IExportChemicalType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IExportChemicalType>[]>(
    () => [
      {
        accessorKey: 'SubjectName',
        header: 'Tên môn học',
        size: 100,
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
        accessorKey: 'ExpSubjectId',
        header: 'Phiếu xuất',
        size: 50,
      },
      {
        accessorKey: 'EmployeeCreate',
        header: 'Người tạo đơn',
        size: 100,
      },
      {
        accessorKey: 'EmployeeInCharge',
        header: 'Người phụ trách',
        size: 100,
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
            <span>Thông tin xuất hóa chất cho môn học</span>
          </h3>
        )}
      />
    </>
  );
};

export default React.memo(ExportChemicalTable);
