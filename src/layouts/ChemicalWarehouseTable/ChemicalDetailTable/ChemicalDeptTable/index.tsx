import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IChemDeptType } from '../../../../types/chemicalWarehouseType';

const ChemicalDeptTable: FC<{ chemicalDept: IChemDeptType[] }> = ({ chemicalDept }) => {
  const [tableData, setTableData] = useState<IChemDeptType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  useEffect(() => {
    setTableData(chemicalDept);
  }, [chemicalDept])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IChemDeptType>,
    ): MRT_ColumnDef<IChemDeptType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IChemDeptType>[]>(
    () => [
      {
        accessorKey: 'ChemDeptId',
        header: 'Mã xuất',
        size: 50,
      },
      {
        accessorKey: 'DepartmentName',
        header: 'Khoa',
        size: 50,
      },
      {
        accessorKey: 'AmountExport',
        header: 'SL xuất',
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
            <span>Thông tin xuất hóa chất</span>
          </h3>
        )}
      />
    </>
  );
};

export default React.memo(ChemicalDeptTable);
