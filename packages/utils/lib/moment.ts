import moment from "moment";

export function convertTimestampToDate(timestamp: number) {
  const date = moment(timestamp).toDate().toUTCString();
  return date;
}

export function convertDateToTimestamp(date: string) {
  const timestamp = moment(date).format("X"); // lowercase 'x' for timestamp in milliseconds
  return Number(timestamp);
}

export function convertISOtoUTC(date: string) {
  const utcDate = new Date(date).toUTCString();
  return utcDate;
}
