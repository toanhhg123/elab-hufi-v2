import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { FC, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../hooks';
import DepartmentTabItem from './Tabs/DepartmentTabItem';
import LaboratoryTabItem from './Tabs/LaboratoryTabItem';
import RegisterGeneralTabItem from './Tabs/RegisterGeneralTabItem';
import StudySessionTabItem from './Tabs/StudySessionTabItem';

type TabItem = {
	id: string;
	header: string;
	comp: React.ComponentType<any>;
};

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const WarehouseTable: FC = () => {
	const [value, setValue] = useState(0);
	const owner = useAppSelector(state => state.userManager.owner);
	const [tabData, setTabData] = useState<TabItem[]>([]);

	useEffect(() => {
		if (owner.DepartmentId === 1) {
			setTabData([
				{
					id: 'department',
					header: 'Xuất đến Khoa',
					comp: DepartmentTabItem,
				},
			]);
		} else {
			setTabData([
				{
					id: 'laboratory',
					header: 'Xuất đến Phòng thí nghiệm',
					comp: LaboratoryTabItem,
				},
				{
					id: 'registerGeneral',
					header: 'Xuất cho Đăng ký chung',
					comp: RegisterGeneralTabItem,
				},
				{
					id: 'studySessionData',
					header: 'Buổi học',
					comp: StudySessionTabItem,
				},
			]);
		}
	}, [owner]);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					{tabData.map((x, index) => {
						return <Tab key={index} label={x.header} {...a11yProps(index)} />;
					})}
				</Tabs>
			</Box>
			{tabData.map((x, index) => {
				const Comp = x.comp;
				return (
					<Box
						role="tabpanel"
						hidden={value !== index}
						id={`tabpanel-${index}`}
						aria-labelledby={`tab-${index}`}
						key={`content_${index}`}
					>
						{value === index && <Comp />}
					</Box>
				);
			})}
		</Box>
	);
};

export default WarehouseTable;
