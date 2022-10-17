import { FC, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LaboratoryTabItem from './Tabs/LaboratoryTabItem';
import StudySessionTabItem from './Tabs/StudySessionTabItem';
import RegisterGeneralTabItem from './Tabs/RegisterGeneralTabItem';

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

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab label="Phòng thí nghiệm" {...a11yProps(0)} />
					<Tab label="Đăng ký chung" {...a11yProps(1)} />
					<Tab label="Buổi học" {...a11yProps(2)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<LaboratoryTabItem />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<RegisterGeneralTabItem />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<StudySessionTabItem />
			</TabPanel>
		</Box>
	);
};

export default WarehouseTable;
