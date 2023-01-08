import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, {
    MRT_Cell,
    MRT_ColumnDef,
} from 'material-react-table';
import {
    Button,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IListMemberType } from '../../../types/researchTeamType';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';

const AddNewMemberTable: FC<{
    listMemberColumns: MRT_ColumnDef<IListMemberType>[];
    handleOpenDeleteMemberTeamModal: any;
    handleOpenEditMemberTeamModal: any;
    handleOpenCreateMemberTeamModal: any;
}> = ({
    listMemberColumns,
    handleOpenDeleteMemberTeamModal,
    handleOpenEditMemberTeamModal,
    handleOpenCreateMemberTeamModal
}) => {
        const { currentResearchTeam } = useAppSelector((state: RootState) => state.researchTeam);

        const [tableData, setTableData] = useState<IListMemberType[]>([]);

        useEffect(() => {
            if (currentResearchTeam.listMember.length > 0) {
                setTableData(currentResearchTeam.listMember);
            }
        }, [currentResearchTeam])

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
                    columns={listMemberColumns}
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
                            ...listMemberColumns.map(x => x.accessorKey || ''),
                            'mrt-row-actions'
                        ]
                    }}
                    renderRowActions={({ row, table }) => (
                        <>
                            <Tooltip arrow placement="left" title="Sửa thông tin thành viên">
                                <IconButton onClick={() => handleOpenEditMemberTeamModal(row)}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Xoá thông tin thành viên">
                                <IconButton color="error" onClick={() => handleOpenDeleteMemberTeamModal(row)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <h3 style={{ "margin": "0px" }}>
                            <b><KeyboardArrowRightIcon
                                style={{ "margin": "0px", "fontSize": "30px", "paddingTop": "15px" }}
                            ></KeyboardArrowRightIcon></b>
                            <span>Thông tin thành viên</span>
                        </h3>
                    )}
                    renderBottomToolbarCustomActions={() => (
                        <Tooltip title="Thêm thành viên mới" placement="right-start">
                            <Button
                                color="primary"
                                onClick={handleOpenCreateMemberTeamModal}
                                variant="contained"
                                style={{ "margin": "10px" }}
                            >
                                <AddIcon fontSize="small" />
                            </Button>
                        </Tooltip>
                    )}
                />
            </>
        );
    };

export default React.memo(AddNewMemberTable);
