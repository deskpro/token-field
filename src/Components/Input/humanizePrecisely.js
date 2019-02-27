import moment from 'moment';

moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('ss', 0); // must be after 's', disables "few seconds"
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24);
moment.relativeTimeThreshold('d', 31);
moment.relativeTimeThreshold('M', 12);
moment.duration.fn.humanizePrecisely = function humanizePrecisely(options = {}) {
  // Split the duration into parts to be able to filter out unwanted ones
  const allParts = [
    { value: this.years(), unit: 'years' },
    { value: this.months(), unit: 'months' },
    { value: this.days(), unit: 'days' },
    { value: this.hours(), unit: 'hours' },
    { value: this.minutes(), unit: 'minutes' },
    { value: this.seconds(), unit: 'seconds' },
  ];

  return allParts
  // only use the first parts until the most precise unit wanted
    .slice(0, allParts.findIndex(o => o.unit === (options.mostPreciseUnit || 'seconds')) + 1)
    // skip other zeroes in the middle (moment.humanize() can't format them)
    .filter(part => part.value !== 0)
    // use only the significant parts requested
    .slice(0, options.numberOfSignificantParts || allParts.length)
    // format each part
    .map(part => moment.duration(part.value, part.unit).humanize())
    .join(' ');
};
