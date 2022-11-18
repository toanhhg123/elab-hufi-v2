import { FC, useRef, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LaboratoryTabItem from './Tabs/LaboratoryTabItem';
import StudySessionTabItem from './Tabs/StudySessionTabItem';
import RegisterGeneralTabItem from './Tabs/RegisterGeneralTabItem';
import DepartmentTabItem from './Tabs/DepartmentTabItem';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 0 }}>{children}</Box>}
		</div>
	);
}

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
					<>
						<TabPanel key={index} value={value} index={index}>
							<Comp />
						</TabPanel>
					</>
				);
			})}
		</Box>
	);
};

export default WarehouseTable;
