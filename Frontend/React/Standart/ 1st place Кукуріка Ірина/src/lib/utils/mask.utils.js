const DEFAULT_FORMAT = '+............';

export function getOnlyNumbers (value) {
  return value.replace(/[^0-9]/g, '');
}

export function applyMask (value, format) {
  const onlyNumbers = getOnlyNumbers(value);
  format = format || DEFAULT_FORMAT;
  let handledValueIndex = 0;
  return format.replace(/./g, (char) => {
    if (handledValueIndex >= onlyNumbers.length) {
      return '';
    }
    if (char === '.') {
      const numberToReplace = onlyNumbers[handledValueIndex];
      handledValueIndex++;
      return numberToReplace;
    }
    return char;
  })
}
