// Thanks to fearofawhackplanet https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time

export function timeDifference(current: number, previous: number) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    const secs = Math.round(elapsed / 1000);
    return secs > 1 ? `${secs} seconds ago` : "a momemt back";
  } else if (elapsed < msPerHour) {
    const mins = Math.round(elapsed / msPerMinute);
    return mins > 1 ? `${mins} minutes ago` : `a minute back`;
  } else if (elapsed < msPerDay) {
    const hours = Math.round(elapsed / msPerHour);
    return hours > 1 ? `${hours} hours ago` : `an hour back`;
  } else if (elapsed < msPerMonth) {
    const days = Math.round(elapsed / msPerDay);
    return days > 1 ? `${days} days ago` : `1 day ago`;
  } else if (elapsed < msPerYear) {
    const months = Math.round(elapsed / msPerMonth);
    return months > 1 ? `${months} months ago` : `1 month ago`;
  } else {
    const years = Math.round(elapsed / msPerYear);
    return years > 1 ? `${years} years ago` : `1 year ago`;
  }
}
