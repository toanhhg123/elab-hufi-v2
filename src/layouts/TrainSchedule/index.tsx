import React, { CSSProperties } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { FC, useRef, useState } from 'react';
import ManagerTrainSchedule from './ManagerTrainSchedule';
import RegisterTrainSchedule from './RegisterTrainSchedule';
import { useAppSelector } from '../../hooks';

const TrainSchedule: FC = () => {
	const token = useAppSelector(state => state.userManager.token)

	return (
		<Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
			{(token.type === 'student' || token.type === 'researcher') && <RegisterTrainSchedule />}
			{(token.type === 'employee') && <ManagerTrainSchedule />}
		</Box>
	);
};

export default TrainSchedule;
