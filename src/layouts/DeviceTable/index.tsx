import { FC } from 'react';
import { useAppSelector } from '../../hooks';
import { DeviceTable as DeviceTableWrap } from '../DepartmentTable/context/DeviceOfDepartmentTableContext';
import DeviceOfDepartmentTable from '../DepartmentTable/DeviceOfDepartmentTable';
import DeviceOfExperimentCenterTable from '../DepartmentTable/DeviceOfExperimentCenterTable';

const DeviceTable: FC = () => {
	const owner = useAppSelector(state => state.userManager.owner);

	return (
		<div
			style={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
		>
			{owner.DepartmentId === 1 && (
				<>
					<DeviceOfExperimentCenterTable id={owner.DepartmentId} />
				</>
			)}
			{owner.DepartmentId !== 1 && (
				<DeviceTableWrap id={owner.DepartmentId || 0}>
					<DeviceOfDepartmentTable />
				</DeviceTableWrap>
			)}
		</div>
	);
};

export default DeviceTable;
