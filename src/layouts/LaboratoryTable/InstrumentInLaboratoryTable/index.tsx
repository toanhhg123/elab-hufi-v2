import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
} from 'material-react-table';
import moment from 'moment';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IListInstrumentBeloingToLaboratoryType } from '../../../types/laboratoryType';

const InstrumentInLaboratoryTable: FC<{ instrumentData: IListInstrumentBeloingToLaboratoryType[] }> = ({ instrumentData }) => {
  const [tableData, setTableData] = useState<IListInstrumentBeloingToLaboratoryType[]>(instrumentData);

  useEffect(() => {
    let formatedInstrumentData = instrumentData.map((x: any) => {
      return {
        ...x,
        ExportDate: moment.unix(x.ExportDate).format('DD/MM/YYYY')
      }
    })
    setTableData(formatedInstrumentData);
  }, [instrumentData])

  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<IListInstrumentBeloingToLaboratoryType>,
    ): MRT_ColumnDef<IListInstrumentBeloingToLaboratoryType>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IListInstrumentBeloingToLaboratoryType>[]>(
    () => [
      {
        accessorKey: 'ExpDeviceDeptId',
        header: 'Ngày hết hạn',
        size: 100,
      },
      {
        accessorKey: 'DeviceName',
        header: 'Tên dụng cụ',
        size: 100,
      },
      {
        accessorKey: 'Quantity',
        header: 'Số lượng',
        size: 100,
      },
      {
        accessorKey: 'Unit',
        header: 'Đơn vị',
        size: 100,
      },
      {
        accessorKey: 'ExportDate',
        header: 'Ngày xuất',
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
        // editingMode="modal" //default
        enableColumnOrdering
        // enableEditing
        enableRowNumbers
        enablePinning
        initialState={{
          density: 'compact',
          columnOrder: [
            'mrt-row-numbers',
            ...columns.map(x => x.accessorKey || ''),
            // 'mrt-row-actions'
          ]
        }}

        renderTopToolbarCustomActions={() => (
          <h3 style={{ "margin": "0px" }}>
            <b><KeyboardArrowRightIcon
              style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
            ></KeyboardArrowRightIcon></b>
            <span>Thông tin dụng cụ</span>
          </h3>
        )}
      />
    </>
  );
}

export default React.memo(InstrumentInLaboratoryTable); 