import { Delete, Edit } from '@mui/icons-material';
import {
	dummyListMemberData,
	dummyResearchTeamData,
	IListMemberType,
	IResearchTeamType,
} from '../../types/researchTeamType';
import {
	deleteResearchTeam,
	getResearchTeams,
	postResearchTeam,
	updateResearchTeam,
} from '../../services/researchTeamServices';
import { RootState } from '../../store';
import { setCurrentMemberTeam, setCurrentResearchTeam, setListOfResearchTeams } from './researchTeamSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextareaAutosize,
	TextField,
	Tooltip,
} from '@mui/material';
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSnackbarMessage } from '../../pages/appSlice';
import { ColumnType } from './Utils';
import ResearchTeamChemicalTable from './TeamMemberTable';
import EditResearchTeamModal from './Modal/EditResearchTeamModal';
import DeleteResearchTeamModal from './Modal/DeleteResearchTeamModal';
import CreateResearchTeamModal from './Modal/CreateResearchTeamModal';
import DeleteMemberTeamModal from './Modal/DeleteMemberTeamModal';
import EditMemberTeamModal from './Modal/EditMemberTeamModal';
import CreateMemberTeamModal from './Modal/CreateMemberTeamModal';

const ResearchTeamTable: FC = () => {
	const researchTeamsData = useAppSelector((state: RootState) => state.researchTeam.listOfResearchTeams);
	const { currentResearchTeam, currentMemberTeam } = useAppSelector((state: RootState) => state.researchTeam);
	const dispatch = useAppDispatch();

	const [isCreateModal, setIsCreateModal] = useState(false);
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
	const [isDeleteMemberTeamModal, setIsDeleteMemberTeamModal] = useState<boolean>(false);
	const [isEditMemberTeamModal, setIsEditMemberTeamModal] = useState<boolean>(false);
	const [isCreateMemberTeamModal, setIsCreateMemberTeamModal] = useState<boolean>(false);

	const [tableData, setTableData] = useState<IResearchTeamType[]>([]);
	const [validationErrors, setValidationErrors] = useState<{
		[cellId: string]: string;
	}>({});

	const [previousModal, setPreviousModal] = useState<string>('create');

	useEffect(() => {
		if (researchTeamsData.length > 0) {
			setTableData(researchTeamsData);
		}
	}, [researchTeamsData]);

	const getCommonEditTextFieldProps = useCallback(
		(cell: MRT_Cell<IResearchTeamType>): MRT_ColumnDef<IResearchTeamType>['muiTableBodyCellEditTextFieldProps'] => {
			return {
				error: !!validationErrors[cell.id],
				helperText: validationErrors[cell.id],
			};
		},
		[validationErrors],
	);

	const columns = useMemo<MRT_ColumnDef<IResearchTeamType>[]>(
		() => [
			{
				accessorKey: 'TeamId',
				header: 'Mã nhóm nghiên cứu',
			},
			{
				accessorKey: 'TeamName',
				header: 'Tên nhóm nghiên cứu',
			},
			{
				accessorKey: 'Note',
				header: 'Ghi chú',
			},
		],
		[getCommonEditTextFieldProps],
	);

	const TeamMemberTableColumns = useRef<ColumnType[]>([
		{
			id: 'Title',
			header: 'Chức vụ',
		},
		{
			id: 'ResearcherId',
			header: 'Mã nghiên cứu viên',
		},
		{
			id: 'Fullname',
			header: 'Họ và tên',
		},
		{
			id: 'Birthday',
			header: 'Ngày sinh',
			type: 'date',
		},
		{
			id: 'Gender',
			header: 'Giới tính',
		},
		{
			id: 'Address',
			header: 'Địa chỉ',
		},
		{
			id: 'Email',
			header: 'Email',
		},
		{
			id: 'PhoneNumber',
			header: 'SĐT',
		},
		{
			id: 'Organization',
			header: 'Tổ chức',
		},
	]);

	const listMemberColumns = useMemo<MRT_ColumnDef<IListMemberType>[]>(
		() => [
			{
				accessorKey: 'Title',
				header: 'Chức vụ',
			},
			{
				accessorKey: 'ResearcherId',
				header: 'Mã nghiên cứu viên',
			},
			{
				accessorKey: 'Fullname',
				header: 'Họ và tên',
			},
			{
				accessorKey: 'formatedBirthday',
				header: 'Ngày sinh',
				type: 'date',
			},
			{
				accessorKey: 'Gender',
				header: 'Giới tính',
			},
			{
				accessorKey: 'Address',
				header: 'Địa chỉ',
			},
			{
				accessorKey: 'Email',
				header: 'Email',
			},
			{
				accessorKey: 'PhoneNumber',
				header: 'SĐT',
			},
			{
				accessorKey: 'Organization',
				header: 'Tổ chức',
			},
		],
		[getCommonEditTextFieldProps],
	);

	const handleOpenEditModal = (row: any) => {
		dispatch(setCurrentResearchTeam(row.original));
		setIsEditModal(true);
	};

	const onCloseEditModal = () => {
		dispatch(setCurrentResearchTeam(dummyResearchTeamData));
		setIsEditModal(false);
	};

	const handleSubmitEditModal = async () => {
		const isUpdatedSuccess = await updateResearchTeam(currentResearchTeam);
		if (isUpdatedSuccess) {
			dispatch(setSnackbarMessage('Cập nhật thông tin nhóm nghiên cứu thành công'));
			let updatedIdx = researchTeamsData.findIndex(x => x.TeamId === currentResearchTeam.TeamId);
			let newListOfResearchTeams = [
				...researchTeamsData.slice(0, updatedIdx),
				currentResearchTeam,
				...researchTeamsData.slice(updatedIdx + 1),
			];
			dispatch(setListOfResearchTeams(newListOfResearchTeams));
		}

		onCloseEditModal();
	};

	const handleOpenDeleteModal = (row: any) => {
		dispatch(setCurrentResearchTeam(row.original));
		setIsDeleteModal(true);
	};

	const onCloseDeleteModal = () => {
		dispatch(setCurrentResearchTeam(dummyResearchTeamData));
		setIsDeleteModal(false);
	};

	const handleSubmitDeleteModal = async () => {
		if (currentResearchTeam.TeamId) {
			await deleteResearchTeam(currentResearchTeam.TeamId.toString());
			dispatch(setSnackbarMessage('Xóa thông tin nhóm nghiên cứu thành công'));
			let deletedIdx = researchTeamsData.findIndex(
				(x: IResearchTeamType) => x.TeamId === currentResearchTeam.TeamId,
			);
			let newListOfResearchTeams = [
				...researchTeamsData.slice(0, deletedIdx),
				...researchTeamsData.slice(deletedIdx + 1),
			];
			dispatch(setListOfResearchTeams(newListOfResearchTeams));
		}

		onCloseDeleteModal();
	};

	const handleOpenCreateModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateModal = () => {
		dispatch(setCurrentResearchTeam(dummyResearchTeamData));
		setIsCreateModal(false);
	};

	const handleSubmitCreateModal = async () => {
		let currentResearchTeamClone = Object.assign({}, currentResearchTeam);
		delete currentResearchTeamClone.TeamId;

		const createdResearchTeam = await postResearchTeam(currentResearchTeamClone);
		if (createdResearchTeam.TeamId) {
			const newListOfResearchTeams: IResearchTeamType[] = await getResearchTeams();
			if (newListOfResearchTeams) {
				dispatch(setSnackbarMessage('Tạo thông tin nhóm nghiên cứu mới thành công'));
				dispatch(setListOfResearchTeams(newListOfResearchTeams));
			}
		}
		onCloseCreateModal();
	};

	const handleOpenDeleteMemberTeamModal = (row: any) => {
		dispatch(setCurrentMemberTeam(row.original));
		setIsDeleteMemberTeamModal(true);
		if (isEditModal) {
			setIsEditModal(false);
			setPreviousModal('edit');
		} else {
			setIsCreateModal(false);
			setPreviousModal('create');
		}
	};

	const onCloseDeleteMemberTeamModal = () => {
		dispatch(setCurrentMemberTeam(dummyListMemberData));
		setIsDeleteMemberTeamModal(false);
		if (previousModal === 'create') {
			setIsCreateModal(true);
		} else {
			setIsEditModal(true);
		}
	};

	const handleSubmitDeleteMemberTeamModal = () => {
		let deletedIdx = currentResearchTeam.listMember.findIndex(
			(item: IListMemberType) => item.ResearcherId === currentMemberTeam.ResearcherId,
		);
		if (deletedIdx > -1) {
			dispatch(
				setCurrentResearchTeam({
					...currentResearchTeam,
					listMember: [
						...currentResearchTeam.listMember.slice(0, deletedIdx),
						...currentResearchTeam.listMember.slice(deletedIdx + 1),
					],
				}),
			);
		}

		onCloseDeleteMemberTeamModal();
	};

	const handleOpenEditMemberTeamModal = (row: any) => {
		dispatch(setCurrentMemberTeam(row.original));
		setIsEditMemberTeamModal(true);
		if (isEditModal) {
			setIsEditModal(false);
			setPreviousModal('edit');
		} else {
			setIsCreateModal(false);
			setPreviousModal('create');
		}
	};

	const onCloseEditMemberTeamModal = () => {
		dispatch(setCurrentMemberTeam(dummyListMemberData));
		setIsEditMemberTeamModal(false);
		if (previousModal === 'create') {
			setIsCreateModal(true);
		} else {
			setIsEditModal(true);
		}
	};

	const handleSubmitEditMemberTeamModal = () => {
		let updatedIdx = currentResearchTeam.listMember.findIndex(
			(item: IListMemberType) => item.ResearcherId === currentMemberTeam.ResearcherId,
		);
		let currentMemberTeamClone = Object.assign({}, currentMemberTeam);
		delete currentMemberTeamClone.formatedBirthday;

		dispatch(
			setCurrentResearchTeam({
				...currentResearchTeam,
				listMember: [
					...currentResearchTeam.listMember.slice(0, updatedIdx),
					currentMemberTeamClone,
					...currentResearchTeam.listMember.slice(updatedIdx + 1),
				],
			}),
		);

		onCloseEditMemberTeamModal();
	};

	const handleOpenCreateMemberTeamModal = (row: any) => {
		setIsCreateMemberTeamModal(true);
		if (isEditModal) {
			setIsEditModal(false);
			setPreviousModal('edit');
		} else {
			setIsCreateModal(false);
			setPreviousModal('create');
		}
	};

	const onCloseCreateMemberTeamModal = () => {
		dispatch(setCurrentMemberTeam(dummyListMemberData));
		setIsCreateMemberTeamModal(false);
		if (previousModal === 'create') {
			setIsCreateModal(true);
		} else {
			setIsEditModal(true);
		}
	};

	const handleSubmitCreateMemberTeamModal = async () => {
		let currentMemberTeamClone = Object.assign({}, currentMemberTeam);
		delete currentMemberTeamClone.formatedBirthday;

		dispatch(
			setCurrentResearchTeam({
				...currentResearchTeam,
				listMember: [...currentResearchTeam.listMember, currentMemberTeamClone],
			}),
		);

		onCloseCreateMemberTeamModal();
	};

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
					},
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
						...columns.map(x => x.accessorKey || ''),
						'mrt-row-actions',
					],
				}}
				renderDetailPanel={({ row }) => (
					<>
						{row.original.listMember.length > 0 && (
							<ResearchTeamChemicalTable
								chemicalData={row.original.listMember}
								columns={TeamMemberTableColumns.current}
							/>
						)}
					</>
				)}
				renderRowActions={({ row, table }) => (
					<>
						<Tooltip arrow placement="left" title="Sửa thông tin nhóm nghiên cứu">
							<IconButton onClick={() => handleOpenEditModal(row)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="right" title="Xoá thông tin nhóm nghiên cứu">
							<IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</>
				)}
				renderTopToolbarCustomActions={() => (
					<h3 style={{ margin: '0px' }}>
						<b>
							<KeyboardArrowRightIcon
								style={{ margin: '0px', fontSize: '30px', paddingTop: '15px' }}
							></KeyboardArrowRightIcon>
						</b>
						<span>Thông tin nhóm nghiên cứu</span>
					</h3>
				)}
				renderBottomToolbarCustomActions={() => (
					<Tooltip title="Tạo nhóm nghiên cứu mới" placement="right-start">
						<Button
							color="primary"
							onClick={handleOpenCreateModal}
							variant="contained"
							style={{ margin: '10px' }}
						>
							<AddIcon fontSize="small" />
						</Button>
					</Tooltip>
				)}
			/>

			<EditResearchTeamModal
				isOpen={isEditModal}
				columns={columns}
				onClose={onCloseEditModal}
				handleSubmit={handleSubmitEditModal}
				handleOpenDeleteMemberTeamModal={handleOpenDeleteMemberTeamModal}
				handleOpenEditMemberTeamModal={handleOpenEditMemberTeamModal}
				handleOpenCreateMemberTeamModal={handleOpenCreateMemberTeamModal}
				listMemberColumns={listMemberColumns}
			/>

			<DeleteResearchTeamModal
				isOpen={isDeleteModal}
				onClose={onCloseDeleteModal}
				handleSubmit={handleSubmitDeleteModal}
			/>

			<CreateResearchTeamModal
				isOpen={isCreateModal}
				columns={columns}
				onClose={onCloseCreateModal}
				handleSubmit={handleSubmitCreateModal}
				handleOpenDeleteMemberTeamModal={handleOpenDeleteMemberTeamModal}
				handleOpenEditMemberTeamModal={handleOpenEditMemberTeamModal}
				handleOpenCreateMemberTeamModal={handleOpenCreateMemberTeamModal}
				listMemberColumns={listMemberColumns}
			/>

			<DeleteMemberTeamModal
				isOpen={isDeleteMemberTeamModal}
				onClose={onCloseDeleteMemberTeamModal}
				handleSubmit={handleSubmitDeleteMemberTeamModal}
			/>

			<EditMemberTeamModal
				isOpen={isEditMemberTeamModal}
				columns={listMemberColumns}
				onClose={onCloseEditMemberTeamModal}
				handleSubmit={handleSubmitEditMemberTeamModal}
			/>

			<CreateMemberTeamModal
				isOpen={isCreateMemberTeamModal}
				columns={listMemberColumns}
				onClose={onCloseCreateMemberTeamModal}
				handleSubmit={handleSubmitCreateMemberTeamModal}
			/>
		</>
	);
};

export default React.memo(ResearchTeamTable);
