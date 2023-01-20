import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { FC, useRef, useState } from 'react';
import DepartmentTabItem from './Tabs/DepartmentTabItem';
import LaboratoryTabItem from './Tabs/LaboratoryTabItem';
import RegisterGeneralTabItem from './Tabs/RegisterGeneralTabItem';
import StudySessionTabItem from './Tabs/StudySessionTabItem';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const WarehouseTable: FC = () => {
	const [value, setValue] = useState(0);

	const tabData = useRef([
		{
			header: 'Khoa',
			comp: DepartmentTabItem,
		},
		{
			header: 'Phòng thí nghiệm',
			comp: LaboratoryTabItem,
		},
		{
			header: 'Đăng ký chung',
			comp: RegisterGeneralTabItem,
		},
		{
			header: 'Buổi học',
			comp: StudySessionTabItem,
		},
	]);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					{tabData.current.map((x, index) => (
						<Tab key={index} label={x.header} {...a11yProps(index)} />
					))}
				</Tabs>
			</Box>
			{tabData.current.map((x, index) => {
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
