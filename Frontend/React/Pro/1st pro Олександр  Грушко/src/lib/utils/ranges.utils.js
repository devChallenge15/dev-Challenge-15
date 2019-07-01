export function isValueInRange (value, range) {
  return value <= range[1] && value >= range[0];
}

export function isRangeInRange (range1, range2) {
  return isValueInRange(range1[0], range2)
    && isValueInRange(range1[1], range2);
}
