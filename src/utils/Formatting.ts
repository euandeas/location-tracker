export const distanceFormat = (d: number) => {
  const km = d / 1000;
  return km.toFixed(2) + ' km';
};

export const speedFormat = (s: number) => {
  if (s === 0) {
    return '0:00 /km';
  }
  const totalMinutes = 16.6667 / s;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
};

export const durationFormat = (d: number) => {
  const hours = Math.floor(d / 3600000);
  const minutes = Math.floor((d % 3600000) / 60000);
  const seconds = Math.floor((d % 60000) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
