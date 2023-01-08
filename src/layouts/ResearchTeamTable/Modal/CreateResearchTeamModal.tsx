import React, { FC } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextareaAutosize,
    TextField,
} from '@mui/material';
import AddNewMemberTable from '../AddNewMemberTable';
import { IListMemberType, IResearchTeamType } from '../../../types/researchTeamType';
import { setCurrentResearchTeam } from '../researchTeamSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';

const CreateResearchTeamModal: FC<{
    isOpen: boolean;
    columns: MRT_ColumnDef<IResearchTeamType>[];
    onClose: any;
    handleSubmit: any;
    handleOpenDeleteMemberTeamModal: any;
    handleOpenEditMemberTeamModal: any;
    handleOpenCreateMemberTeamModal: any;
    listMemberColumns: MRT_ColumnDef<IListMemberType>[];
}> = ({
    isOpen,
    columns,
    onClose,
    handleSubmit,
    handleOpenDeleteMemberTeamModal,
    handleOpenEditMemberTeamModal,
    handleOpenCreateMemberTeamModal,
    listMemberColumns
}) => {
        const { currentResearchTeam } = useAppSelector((state: RootState) => state.researchTeam);
        const dispatch = useAppDispatch();

        return (
            <Dialog
                open={isOpen}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "800px",  // Set your width here
                        },
                    },
                }}
            >
                <DialogTitle textAlign="center"><b>Tạo thông tin nhóm nghiên cứu</b></DialogTitle>
                <DialogContent>
                    <form onSubmit={(e) => e.preventDefault()} style={{ "marginTop": "10px" }}>
                        <Stack
                            sx={{
                                width: '100%',
                                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                                gap: '1.5rem',
                            }}
                        >
                            {columns.slice(1,).map((column) => {
                                if (column.accessorKey === "Note") {
                                    return <TextareaAutosize
                                        key={"CreateNote"}
                                        aria-label="minimum height"
                                        minRows={3}
                                        placeholder="Nhập ghi chú..."
                                        defaultValue={currentResearchTeam["Note"]}
                                        onChange={(e) =>
                                            dispatch(setCurrentResearchTeam(({ ...currentResearchTeam, "Note": e.target.value })))
                                        } />
                                }
                                else {
                                    return <TextField
                                        key={column.accessorKey}
                                        label={column.header}
                                        name={column.accessorKey}
                                        defaultValue={column.accessorKey && currentResearchTeam[column.accessorKey]}
                                        onChange={(e) =>
                                            dispatch(setCurrentResearchTeam(({ ...currentResearchTeam, [e.target.name]: e.target.value })))
                                        }
                                    />
                                }
                            }
                            )}
                            <AddNewMemberTable
                                handleOpenDeleteMemberTeamModal={handleOpenDeleteMemberTeamModal}
                                handleOpenEditMemberTeamModal={handleOpenEditMemberTeamModal}
                                handleOpenCreateMemberTeamModal={handleOpenCreateMemberTeamModal}
                                listMemberColumns={listMemberColumns}
                            />
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button color="primary" onClick={handleSubmit} variant="contained">
                        Tạo
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

export default React.memo(CreateResearchTeamModal);
