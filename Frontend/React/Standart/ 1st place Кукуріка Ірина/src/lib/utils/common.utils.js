export function sortArrayOfObjectByField (arr, fieldName) {
  arr.sort((a, b) => {
    if (a[fieldName] > b[fieldName]) {
      return -1;
    }
    if (a[fieldName] < b[fieldName]) {
      return 1;
    }
    return 0;
  })
  return arr;
}
