export function getListRefChildHeight (listRef) {
  if (!listRef) {
    throw new Error('List ref is not presented');
  }
  return Array.from(listRef.childNodes)[0].clientHeight;
}
