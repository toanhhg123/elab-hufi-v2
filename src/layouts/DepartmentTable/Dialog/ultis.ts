import styled from '@emotion/styled';
import { TableCell, tableCellClasses } from '@mui/material';
import moment from 'moment';

export const isObject = (val: any) => {
	if (val === null) {
		return false;
	}

	return typeof val === 'object';
};

export const nestedObject = (obj: any, string: String) => {
	for (const key in obj) {
		if (isObject(obj[key])) {
			string += `${nestedObject(obj[key], string)}`;
		} else {
			switch (key) {
				case 'DateInput':
				case 'DateTransfer':
				case 'DateCreate':
					string += `${moment.unix(Number(obj[key])).format('DD/MM/YYYY')} `;
					break;
				default:
					string += `${obj[key]} `;
					break;
			}
		}
	}
	return string;
};

export const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));
