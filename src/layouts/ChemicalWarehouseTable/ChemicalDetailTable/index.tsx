import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import moment from 'moment';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IChemicalDetailType } from '../../../types/chemicalWarehouseType';

const ChemicalDetailTable: FC<{ chemicalDetail: IChemicalDetailType[] }> = ({ chemicalDetail }) => {
  const [tableData, setTableData] = useState<IChemicalDetailType[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  useEffect(() => {
    let formatedchemicalDetailData = chemicalDetail.map((x: IChemicalDetailType) => {
      return {
        ...x,
        "formatedOrderDate": moment.unix(Number(x.OrderDate)).format('DD/MM/YYYY'),
        "formatedExpiryDate": moment.unix(Number(x.ExpiryDate)).format('DD/MM/YYYY')
      }
    })
    setTableData(formatedchemicalDetailData);
  }, [chemicalDetail])

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IChemicalDetailType>,
    ): MRT_ColumnDef<IChemicalDetailType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IChemicalDetailType>[]>(
    () => [
      {
        accessorKey: 'ChemDetailId',
        header: 'Id hoá chất',
        size: 100,
      },
      {
        accessorKey: 'AmountOriginal',
        header: 'Lượng ban đầu',
        size: 100,
      },
      {
        accessorKey: 'AmountExport',
        header: 'Lượng xuất',
        size: 100,
      },
      {
        accessorKey: 'AmountRemain',
        header: 'Lượng còn lại',
        size: 100,
      },
      {
        accessorKey: 'formatedOrderDate',
        header: 'Ngày nhập',
        size: 100,
      },
      {
        accessorKey: 'OrderId',
        header: 'Id phiếu nhập',
        size: 100,
      },
      {
        accessorKey: 'ManufacturerName',
        header: 'Nhà sản xuất',
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
            'mrt-row-actions'
          ]
        }}
        renderTopToolbarCustomActions={() => (
          <h3 style={{ "margin": "0px" }}>
            <b><KeyboardArrowRightIcon
              style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin chi tiết</span>
          </h3>
        )}
      />
    </>
  );
};

export default React.memo(ChemicalDetailTable);
