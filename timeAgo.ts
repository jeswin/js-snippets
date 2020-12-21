// Thanks to fearofawhackplanet https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time

const defaultUnits = {
  second: "second",
  seconds: "seconds",
  hour: "hour",
  hours: "hours",
  minute: "min",
  minutes: "mins",
  day: "day",
  days: "days",
  month: "month",
  months: "months",
  year: "year",
  years: "years",
};

export default function timeDifference(
  customUnits: Partial<typeof defaultUnits>,
  smallestUnit?: {
    ms: number;
    text: string;
  }
): (current: number, previous: number) => string {
  const units = { ...defaultUnits, ...customUnits };

  return function (current: number, previous: number) {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (smallestUnit && elapsed < smallestUnit.ms) {
      return smallestUnit.text;
    } else if (elapsed < msPerMinute) {
      const secs = Math.round(elapsed / 1000);
      return secs > 1
        ? `${secs} ${units.seconds} ago`
        : `a ${units.second} ago`;
    } else if (elapsed < msPerHour) {
      const mins = Math.round(elapsed / msPerMinute);
      return mins > 1
        ? `${mins} ${units.minutes} ago`
        : `a ${units.minute} ago`;
    } else if (elapsed < msPerDay) {
      const hours = Math.round(elapsed / msPerHour);
      return hours > 1 ? `${hours} ${units.hours} ago` : `an ${units.hour} ago`;
    } else if (elapsed < msPerMonth) {
      const days = Math.round(elapsed / msPerDay);
      return days > 1 ? `${days} ${units.days} ago` : `a ${units.day} ago`;
    } else if (elapsed < msPerYear) {
      const months = Math.round(elapsed / msPerMonth);
      return months > 1
        ? `${months} ${units.months} ago`
        : `a ${units.month} ago`;
    } else {
      const years = Math.round(elapsed / msPerYear);
      return years > 1 ? `${years} ${units.years} ago` : `a ${units.year} ago`;
    }
  };
}
