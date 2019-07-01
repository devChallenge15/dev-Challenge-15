import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {BaseSuggestionRenderer} from './baseSuggestionRenderer';
import {Autocompleter} from '../Autocompleter';
import {Input} from '../Input';
import countryService from '../../services/countries.service';
import style from './style.module.scss';
import {getBaseInputValueFromItem, getInitialStateBasedOnItemsList} from './helper';
import {applyMask, getOnlyNumbers} from '../../utils/mask.utils';
import {noop} from '../../utils/noop.utils';

export class Suggester extends Component {
  constructor (props) {
    super(props);
    const {items} = this.props;
    this.state = {
      ...getInitialStateBasedOnItemsList(items)
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.items && nextProps.items !== this.props.items) {
      const nextStateData = getInitialStateBasedOnItemsList(nextProps.items);
      this.setState({
        ...nextStateData,
      });
    }
  }

  handleValueChange = (nextValue) => {
    const {dialCodesStash, selectedItem} = this.state;
    const onlyNumbers = getOnlyNumbers(nextValue);
    const possibleSelectedItem = (dialCodesStash[onlyNumbers] || [])[0];
    const nextSelectedItem = possibleSelectedItem ? possibleSelectedItem : selectedItem;
    const maskedValue = applyMask(nextValue, selectedItem.format);
    this.setState({
      inputValue: maskedValue,
    });
    this.handleItemSelect(nextSelectedItem);
  };

  handleItemSelect = (nextItem) => {
    const {selectedItem} = this.state;
    if (selectedItem === nextItem) {
      return;
    }
    this.props.onChange(nextItem);
    this.setState({
      selectedItem: nextItem,
      inputValue: getBaseInputValueFromItem(nextItem)
    });
  };

  render () {
    const {inputValue, selectedItem} = this.state;
    const {
      suggestionRenderer,
      items,
      wrapperClassName,
      buttonClassName,
      dropBoxClassName,
      inputClassName,
    } = this.props;
    const customisedWrapperClass = cs(style.wrapper, wrapperClassName);
    return (
      <div className={customisedWrapperClass}>
        <div className={style.autocompleter}>
          <Autocompleter
            list={items}
            suggestionRenderer={suggestionRenderer}
            selectedItem={selectedItem}
            buttonClassName={buttonClassName}
            dropBoxClassName={dropBoxClassName}
            onSelect={this.handleItemSelect}
          />
        </div>
        <div className={style.input}>
          <Input
            inputClassName={inputClassName}
            value={inputValue}
            onChange={this.handleValueChange}
          />
        </div>
      </div>
    );
  }
}

Suggester.defaultProps = {
  suggestionRenderer: BaseSuggestionRenderer,
  items: countryService.allCountries,
  onChange: noop,
};

Suggester.propTypes = {
  /**
   * emit when country value has changed
   */
  onChange: PropTypes.func,
  /**
   * ClassName to apply to autocompleter button
   */
  buttonClassName: PropTypes.string,
  /**
   * ClassName to apply to input
   */
  inputClassName: PropTypes.string,
  /**
   * ClassName to apply to autocomplete dropbox
   */
  dropBoxClassName: PropTypes.string,
  /**
   * ClassName to apply to main component wrapper
   */
  wrapperClassName: PropTypes.string,
  /**
   * You own renderer for each suggestion in autocompleter for customisation
   * Should apply next props {iso2, name, dialCode, isActive} and return JSX
   */
  suggestionRenderer: PropTypes.func,
  /**
   * If you want inject your own items list
   */
  items: PropTypes.arrayOf(PropTypes.shape({
    /**
     * Country name
     */
    name: PropTypes.string.isRequired,
    /**
     * dial code to show in autocompleter
     */
    dialCode: PropTypes.string.isRequired,
    /**
     * TLD-like country shortcut
     */
    iso2: PropTypes.string.isRequired,
    /**
     * weight of item in case if dialCode is intersected with other item
     */
    priority: PropTypes.number.isRequired,
    /**
     * Format to mask input, default value '+............', but you can pass
     * something like '+.. (...) .. ... ...' here
     */
    format: PropTypes.string,
  })),
};
