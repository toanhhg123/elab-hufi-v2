import moment from 'moment';
import { appointments } from './appointments';

const currentDate = moment();
let date = currentDate.date();

const makeTodayAppointment = (startDate: any, endDate: any) => {
  const days = moment(startDate).diff(endDate, 'days');
  const nextStartDate = moment(startDate)
    .year(currentDate.year())
    .month(currentDate.month())
    .date(date);
  const nextEndDate = moment(endDate)
    .year(currentDate.year())
    .month(currentDate.month())
    .date(date + days);

  return {
    startDate: nextStartDate.toDate(),
    endDate: nextEndDate.toDate(),
  };
};

export default appointments.map((x:any) => {
  const result = {
    ...x,
    ...makeTodayAppointment(x.startDate, x.endDate),
  };
  date += 1;
  if (date > 31) date = 1;
  return result;
});
