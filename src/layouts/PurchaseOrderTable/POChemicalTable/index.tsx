import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import moment from 'moment';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IOrderChemicalType } from '../../../types/orderChemicalType';

const PurchaseOrderChemicalTable: FC<{ chemicalData: IOrderChemicalType[] }> = ({ chemicalData }) => {
  const manufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);

  const [tableData, setTableData] = useState<IOrderChemicalType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  useEffect(() => {
    let formatedDeviceData = chemicalData.map((x: IOrderChemicalType) => {
      let manufacturerInfoIdx = manufacturersData.findIndex(y => y.ManufacturerId === x.ManufacturerId);
      return {
        ...x,
        "formatedManufacturingDate": moment.unix(x.ManufacturingDate).format('DD/MM/YYYY'),
        "formatedExpiryDate": moment.unix(x.ExpiryDate).format('DD/MM/YYYY'),
        "ManufacturerName": manufacturerInfoIdx > -1 ? manufacturersData[manufacturerInfoIdx].Name : ""
      }
    })
    setTableData(formatedDeviceData);
  }, [chemicalData])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IOrderChemicalType>,
    ): MRT_ColumnDef<IOrderChemicalType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IOrderChemicalType>[]>(
    () => [
      {
        accessorKey: 'ChemDetailId',
        header: 'Id hoá chất',
        size: 100,
      },
      {
        accessorKey: 'ChemicalName',
        header: 'Tên hoá chất',
        size: 100,
      },
      {
        accessorKey: 'AmountOriginal',
        header: 'Lượng',
        size: 100,
      },
      {
        accessorKey: 'Unit',
        header: 'Đơn vị',
        size: 100,
      },
      {
        accessorKey: 'formatedManufacturingDate',
        header: 'Ngày sản xuất',
        size: 100,
      },
      {
        accessorKey: 'formatedExpiryDate',
        header: 'Ngày hết hạn',
        size: 100,
      },
      {
        accessorKey: 'LotNumber',
        header: 'Số lô',
        size: 100,
      },
      {
        accessorKey: 'Price',
        header: 'Giá',
        size: 100,
      },
      {
        accessorKey: 'ChemicalId',
        header: 'Id gốc',
        size: 100,
      },
      {
        accessorKey: 'ManufacturerName',
        header: 'Nhà sản xuất',
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
            ...columns.map(x => x.accessorKey || ''),
          ]
        }}
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

export default PurchaseOrderChemicalTable;