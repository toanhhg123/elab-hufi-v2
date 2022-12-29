import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { ColumnType } from './Utils';
import moment from 'moment';

const ChemicalWarehouseTable: FC<{ role: number }> = ({ role }) => {
  const chemicalWarehouseData: IChemicalWarehouseType[] = useAppSelector((state: RootState) => state.chemicalWarehouse.listOfChemicalWarehouse);

  const [tableData, setTableData] = useState<IChemicalWarehouseType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  useEffect(() => {
    let formatedChemicalWarehouseData = (role === 1) ?
      (chemicalWarehouseData.length > 0 ? chemicalWarehouseData.map(item => Object.assign({}, {
        ...item,
        FormatedAllowRegister: item.AllowRegister ? 'Có' : 'Không',
      })) : [])
      :
      (chemicalWarehouseData.length > 0 ? chemicalWarehouseData.map(item => Object.assign({}, {
        ...item,
        ImportDate: moment.unix(Number(item.ImportDate)).format('DD/MM/YYYY'),
        ExpiryDate: moment.unix(Number(item.ExpiryDate)).format('DD/MM/YYYY'),
      })) : [])

    setTableData(formatedChemicalWarehouseData);
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
      },
      {
        accessorKey: 'ChemicalName',
        header: 'Tên HC',
      },
      {
        accessorKey: 'AmountOriginal',
        header: 'SL nhập',
      },
      {
        accessorKey: 'AmountExport',
        header: 'SL xuất',
      },
      {
        accessorKey: 'AmountRemain',
        header: 'SL tồn',
      },
      {
        accessorKey: 'AmountLiquidate',
        header: 'SL thanh lý',
      },
      {
        accessorKey: 'Specifications',
        header: 'Công thức',
      },
      {
        accessorKey: 'Unit',
        header: 'ĐVT',
      },
      {
        accessorKey: 'CASnumber',
        header: 'Mã CAS',
      },
      {
        accessorKey: 'FormatedAllowRegister',
        header: 'SV được ĐK',
      }
    ] : [
      {
        accessorKey: 'ChemicalId',
        header: 'Mã HC',
      },
      {
        accessorKey: 'ChemDeptId',
        header: 'Mã HC nhập',
      },
      {
        accessorKey: 'ChemicalName',
        header: 'Tên HC',
      },
      {
        accessorKey: 'AmountOriginal',
        header: 'SL nhập',
      },
      {
        accessorKey: 'AmountExport',
        header: 'SL xuất',
      },
      {
        accessorKey: 'AmountRemain',
        header: 'SL tồn',
      },
      {
        accessorKey: 'AmountLiquidate',
        header: 'SL thanh lý',
      },
      {
        accessorKey: 'Specifications',
        header: 'CTHH',
      },
      {
        accessorKey: 'Origin',
        header: 'Xuất xứ',
        size: 100,
      },
      {
        accessorKey: 'Unit',
        header: 'ĐVT',
      },
      {
        accessorKey: 'CASnumber',
        header: 'Mã CAS',
      },
      {
        accessorKey: 'ImportDate',
        header: 'Ngày nhập',
      },
      {
        accessorKey: 'ExpiryDate',
        header: 'Ngày hết hạn',
      },
      {
        accessorKey: 'WarningExpiry',
        header: 'Cảnh báo hết hạn',
      },
    ],
    [getCommonEditTextFieldProps],
  );

  const chemicalDetailTablecolumns = useRef<ColumnType[]>([
    {
      id: 'ChemDetailId',
      header: 'Mã lô',
    },
    {
      id: 'LotNumber',
      header: 'Số lô',
    },
    {
      id: 'AmountOriginal',
      header: 'SL nhập',
    },
    {
      id: 'AmountExport',
      header: 'SL xuất',
    },
    {
      id: 'AmountRemain',
      header: 'SL tồn',
    },
    {
      id: 'AmountLiquidate',
      header: 'SL thanh lý',
    },
    {
      id: 'OrderId',
      header: 'Phiếu nhập',
    },
    {
      id: 'ManufacturerName',
      header: 'Đơn vị cung cấp',
    },
    {
      id: 'Origin',
      header: 'Xuất xứ',
    },
    {
      id: 'Price',
      header: 'Giá',
    },
    {
      id: 'OrderDate',
      header: 'Ngày nhập',
      type: 'date'
    },
    {
      id: 'ExpiryDate',
      header: 'Ngày hết hạn',
      type: 'date'
    },
    {
      id: 'WarningExpiry',
      header: 'Cảnh báo hết hạn',
    },
  ]
  );

  const exportChemical2SubjectTableColumns = useRef<ColumnType[]>([
    {
      id: 'ExpSubjectId',
      header: 'Mã phiếu xuất',
    },
    {
      id: 'SubjectId',
      header: 'Mã môn học',
    },
    {
      id: 'SubjectName',
      header: 'Tên môn học',
    },
    {
      id: 'Semester',
      header: 'Học kỳ',
    },
    {
      id: 'Schoolyear',
      header: 'Năm học',
    },
    {
      id: 'Amount',
      header: 'SL xuất',
    },
    {
      id: 'EmployeeCreate',
      header: 'Người tạo đơn',
    },
    {
      id: 'EmployeeInCharge',
      header: 'Người phụ trách',
    },
  ]);

  const exportChemical2ActivityTableColumns = useRef<ColumnType[]>([
    {
      id: 'RegisterGeneralId',
      header: 'Mã phiếu xuất',
    },
    {
      id: 'ThesisName',
      header: 'Tên đề tài',
    },
    {
      id: 'Semester',
      header: 'Học kỳ',
    },
    {
      id: 'Schoolyear',
      header: 'Năm học',
    },
    {
      id: 'Instructor',
      header: 'Người đăng ký',
    },
    {
      id: 'Amount',
      header: 'SL xuất',
    },
  ]);

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
          role == 1 ? <ChemicalDetailTable
            chemicalDetail={row.original.listChemicalDetail}
            columns={chemicalDetailTablecolumns.current} /> :
            <>
              {row.original.listExportChemical && row.original.listExportChemical.length > 0 &&
                <ExportChemicalTable
                  exportChemical={row.original.listExportChemical}
                  columns={exportChemical2SubjectTableColumns.current}
                />}
              {row.original.listExportChemReg && row.original.listExportChemReg.length > 0 &&
                <ExportChemRegTable
                  exportChemReg={row.original.listExportChemReg}
                  columns={exportChemical2ActivityTableColumns.current}
                />}
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
