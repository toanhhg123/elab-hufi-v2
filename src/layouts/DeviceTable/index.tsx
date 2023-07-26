import { FC } from 'react'
import { useAppSelector } from '../../hooks'
import { DeviceTable as DeviceTableWrap } from './context/DeviceOfDepartmentTableContext'
import DeviceOfDepartmentTable from './DeviceOfDepartmentTable'
const ALLOWED = [
	'Admin',
	'Ban giám hiệu',
	'Trưởng phòng QTTB',
	'Chuyên viên phòng QTTB',
	'Trưởng phòng TT TNTH',
	'Chuyên viên TT TNTH',
	'Trưởng đơn vị sử dụng',
	'Chuyên viên đơn vị sử dụng',
]
const DeviceTable: FC = () => {
	const owner = useAppSelector(state => state.userManager.owner)

	return (
		<div
			style={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
		>
			{ALLOWED.includes(owner.GroupName) && (
				<DeviceTableWrap id={owner.DepartmentId}>
					<DeviceOfDepartmentTable />
				</DeviceTableWrap>
			)}
		</div>
	)
}

export default DeviceTable
