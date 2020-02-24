const formatItem = (item) => {
  const { key, value, state } = item;

  return `  ${state} ${key}: ${value}`;
};

const format = (items) => {
  if (items.length === 0) {
    return '';
  }

  const result = items.map(formatItem).join('\n');

  return `{\n${result}\n}`;
};

export default format;
