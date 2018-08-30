const colors = [
  '#F44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#607d8b',
  '#3f51b5',
  '#2196F3',
  '#00bcd4',
  '#009688',
  '#2196F3',
  '#32c787',
  '#00BCD4',
  '#ff5652',
  '#ffc107',
  '#ff85af',
  '#FF9800',
  '#39bbb0',
  '#4CAF50',
  '#ffeb3b',
  '#ffc107'
];

export function getAvatarColor(name) {
  name = name.substr(0, 6);

  var hash = 0;
  for (var i = 0; i < name.length; i++) {
    hash = 31 * hash + name.charCodeAt(i);
  }
  var index = Math.abs(hash % colors.length);
  return colors[index];
}

export function formatDate(dateString) {
  const date = new Date(dateString);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + year;
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return (
    date.getDate() +
    ' ' +
    monthNames[monthIndex] +
    ' ' +
    year +
    ' - ' +
    date.getHours() +
    ':' +
    date.getMinutes()
  );
}

export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}
