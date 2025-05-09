export function formatDate(date: string) {
  if (!date) return null;
  const dateObject = new Date(date);
  const extractedDate = padWithLeadingZeros(dateObject.getDate(), 2);
  const extractedMonth = padWithLeadingZeros(dateObject.getMonth() + 1, 2);
  const extractedYear = padWithLeadingZeros(dateObject.getFullYear(), 4);
  return [extractedYear, extractedMonth, extractedDate].join("-");
}

export function toddMMyyyy(date: string, splitter: string = "/") {
  if (!date) return null;
  const dateObject = new Date(date);
  const extractedDate = padWithLeadingZeros(dateObject.getDate(), 2);
  const extractedMonth = padWithLeadingZeros(dateObject.getMonth() + 1, 2);
  const extractedYear = padWithLeadingZeros(dateObject.getFullYear(), 4);
  return [extractedDate, extractedMonth, extractedYear].join(splitter);
}

export function toyyyyMMdd(date: string, splitter: string = "/") {
  if (!date) return null;
  const dateObject = new Date(date);
  const extractedDate = padWithLeadingZeros(dateObject.getDate(), 2);
  const extractedMonth = padWithLeadingZeros(dateObject.getMonth() + 1, 2);
  const extractedYear = padWithLeadingZeros(dateObject.getFullYear(), 4);
  return [extractedYear, extractedMonth, extractedDate].join(splitter);
}

function padWithLeadingZeros(num: number, totalLength: number) {
  return String(num).padStart(totalLength, "0");
}

export function toFullTimestamp(date: string, splitter: string = "/") {
  if (!date) return null;
  const dateObject = new Date(date);

  const extractedTime = formatTo12HourTime(dateObject);

  const extractedDate = padWithLeadingZeros(dateObject.getDate(), 2);
  const extractedMonth = padWithLeadingZeros(dateObject.getMonth() + 1, 2);
  const extractedYear = padWithLeadingZeros(dateObject.getFullYear(), 4);
  return (
    extractedTime +
    " - " +
    [extractedDate, extractedMonth, extractedYear].join(splitter)
  );
}

function formatTo12HourTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();
  return `${hours}:${minutesStr} ${ampm}`;
}
