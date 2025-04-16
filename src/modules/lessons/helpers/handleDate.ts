import { Op } from 'sequelize';

export function handleDate(date: string) {
  const dates = date.split(',');

  if (dates.length === 1) {

    return { date: dates[0] };
  }

  if (dates.length === 2) {
    const [startDate, endDate] = dates;

    return { date: { [Op.between]: [startDate, endDate] } };
  }

  throw new Error('Invalid date format');
}