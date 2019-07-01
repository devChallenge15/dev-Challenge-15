import {sortArrayOfObjectByField} from '../../utils/common.utils';
import {applyMask} from '../../utils/mask.utils';

export function getDialCodesStash (items) {
  return items.reduce((stash, item) => {
    const {dialCode} = item;
    stash[dialCode] = stash[dialCode] || [];
    stash[dialCode].push(item);
    if (stash[dialCode].length > 1) {
      stash[dialCode] = sortArrayOfObjectByField(stash[dialCode], 'priority');
    }
    return stash;
  }, {});
}

export function getBaseInputValueFromItem (item) {
  const {dialCode, format} = item;
  return applyMask(dialCode, format);
}

export function getInitialStateBasedOnItemsList (items) {
  const selectedItem = items[0];
  return {
    selectedItem: selectedItem,
    dialCodesStash: getDialCodesStash(items),
    inputValue: getBaseInputValueFromItem(selectedItem),
  };
}
