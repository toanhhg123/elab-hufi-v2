import React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { FC, useRef, useState } from 'react';
import ManagerTrainSchedule from './ManagerTrainSchedule';
import RegisterTrainSchedule from './RegisterTrainSchedule';

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
			style={{ flex: '1', overflow: 'hidden' }}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>{children}</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const TrainSchedule: FC = () => {
	const [value, setValue] = useState(0);

	const tabData = useRef([
		{
			header: 'Sinh viên',
			comp: RegisterTrainSchedule,
		},
		{
			header: 'Nhân viên quản lý',
			comp: ManagerTrainSchedule,
		},
	]);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
					<TabPanel key={index} value={value} index={index}>
						<Comp />
					</TabPanel>
				);
			})}
		</Box>
	);
};

export default TrainSchedule;
