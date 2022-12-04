import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IChemicalWarehouseType } from '../../types/chemicalWarehouseType';
import ChemicalDetailTable from './ChemicalDetailTable';
import ExportChemicalTable from './ExportChemicalTable';
import ExportChemRegTable from './ExportChemRegTable';

const ChemicalWarehouseTable: FC<{ role: number }> = ({ role }) => {
  const chemicalWarehouseData: IChemicalWarehouseType[] = useAppSelector((state: RootState) => state.chemicalWarehouse.listOfChemicalWarehouse);

  const [tableData, setTableData] = useState<IChemicalWarehouseType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  useEffect(() => {
    setTableData(chemicalWarehouseData);
  }, [chemicalWarehouseData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IChemicalWarehouseType>,
    ): MRT_ColumnDef<IChemicalWarehouseType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IChemicalWarehouseType>[]>(
    () => role === 1 ? [
      {
        accessorKey: 'ChemicalId',
        header: 'Mã HC',
        size: 50,
      },
      {
        accessorKey: 'ChemicalName',
        header: 'Tên HC',
        size: 100,
      },
      {
        accessorKey: 'AmountOriginal',
        header: 'SL nhập',
        size: 50,
      },
      {
        accessorKey: 'AmountExport',
        header: 'SL xuất',
        size: 50,
      },
      {
        accessorKey: 'AmountRemain',
        header: 'SL tồn',
        size: 50,
      },
      {
        accessorKey: 'Specifications',
        header: 'Thông số',
        size: 50,
      },
      {
        accessorKey: 'Origin',
        header: 'Nguồn gốc',
        size: 100,
      },
      {
        accessorKey: 'Unit',
        header: 'Đơn vị',
        size: 50,
      },
    ] : [
      {
        accessorKey: 'ChemicalId',
        header: 'Mã HC',
        size: 50,
      },
      {
        accessorKey: 'ChemDeptId',
        header: 'Mã HC nhập',
        size: 50,
      },
      {
        accessorKey: 'ChemicalName',
        header: 'Tên HC',
        size: 100,
      },
      {
        accessorKey: 'AmountOriginal',
        header: 'SL nhập',
        size: 50,
      },
      {
        accessorKey: 'AmountExport',
        header: 'SL xuất',
        size: 50,
      },
      {
        accessorKey: 'AmountRemain',
        header: 'SL tồn',
        size: 50,
      },
      {
        accessorKey: 'Specifications',
        header: 'Thông số',
        size: 50,
      },
      {
        accessorKey: 'Origin',
        header: 'Nguồn gốc',
        size: 100,
      },
      {
        accessorKey: 'Unit',
        header: 'Đơn vị',
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
            'mrt-row-expand',
            'mrt-row-numbers',
            ...columns.map(item => item.accessorKey || '')
          ]
        }}
        renderDetailPanel={({ row }) => (
          role == 1 ? <ChemicalDetailTable chemicalDetail={row.original.listChemicalDetail} /> :
            <>
              {row.original.listExportChemical && row.original.listExportChemical.length > 0 &&
                <ExportChemicalTable exportChemical={row.original.listExportChemical} />}
              {row.original.listExportChemReg && row.original.listExportChemReg.length > 0 &&
                <ExportChemRegTable exportChemReg={row.original.listExportChemReg} />}
            </>
        )}
        renderTopToolbarCustomActions={() => (
          <h3 style={{ "margin": "0px" }}>
            <b><KeyboardArrowRightIcon
              style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin hoá chất</span>
          </h3>
        )}
      />
    </>
  );
};

export default React.memo(ChemicalWarehouseTable);
