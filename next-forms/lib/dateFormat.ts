import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

export default function dateFormat(date: Date) {
  return dayjs(date).tz().format('YYYY/MM/DD HH:mm');
}