import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {noop, noopRender} from '../../utils/noop.utils';
import style from './style.module.scss';
import {Flag} from '../../elements/flag';
import {KEY_CODE_DOWN, KEY_CODE_UP} from '../../constants';
import {isRangeInRange} from '../../utils/ranges.utils';
import {getListRefChildHeight} from './helper';

export class Autocompleter extends Component {
  constructor (props) {
    super(props);
    const {isOpen, list, selectedItem} = this.props;
    this.state = {
      isOpen,
      selectedItem: selectedItem || list[0],
    };
  }

  componentDidMount () {
    if (this.state.isOpen) {
      this.updateScroll();
    }
    document.addEventListener('click', this.handleOutOfButtonClick);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.selectedItem && this.state.selectedItem !== nextProps.selectedItem) {
      this.setState({
        selectedItem: nextProps.selectedItem,
      });
    }
    if (nextState.selectedItem !== this.state.selectedItem) {
      this.keepItemInViewPort();
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.isOpen && this.state.isOpen) {
      this.updateScroll();
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleOutOfButtonClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  getSelectedItemIndex () {
    const {selectedItem} = this.state;
    const {list} = this.props;
    return list.findIndex((item) => (item === selectedItem));
  }

  setListRef = (node) => {
    this.listRef = node;
  };

  setButtonRef = (node) => {
    this.buttonRef = node;
  };

  updateScroll () {
    if (!this.listRef) {
      return;
    }
    const selectedItemIndex = this.getSelectedItemIndex();
    const nextScroll = selectedItemIndex * getListRefChildHeight(this.listRef);
    this.listRef.scrollTop = nextScroll;
  }

  keepItemInViewPort () {
    if (!this.listRef) {
      return;
    }
    const itemBlockHeight = getListRefChildHeight(this.listRef);
    const selectedItemIndex = this.getSelectedItemIndex();
    const viewPortRange = [
      this.listRef.scrollTop,
      this.listRef.scrollTop + this.listRef.clientHeight
    ];
    const selectedItemPreddictedPosition = selectedItemIndex * itemBlockHeight;
    const selectedItemBounds = [
      selectedItemPreddictedPosition,
      selectedItemPreddictedPosition + itemBlockHeight,
    ];
    const isSelectedItemInViewPort = isRangeInRange(
      selectedItemBounds,
      viewPortRange
    );
    if (!isSelectedItemInViewPort) {
      this.updateScroll();
    }
  }

  handleKeyDown = ({code}) => {
    const {isOpen} = this.state;
    if (!isOpen) {
      return;
    }
    switch (code) {
      case KEY_CODE_DOWN:
        return this.handleNextItemSelect();
      case KEY_CODE_UP:
        return this.handlePreviousItemSelect();
      default:
        return;
    }
  };

  handleNextItemSelect () {
    const {list} = this.props;
    const selectedItemIndex = this.getSelectedItemIndex();
    const possibleItemToSelect = list[selectedItemIndex + 1];
    if (possibleItemToSelect) {
        this.handleItemSelect(possibleItemToSelect);
    }
  }

  handlePreviousItemSelect () {
    const {list} = this.props;
    const selectedItemIndex = this.getSelectedItemIndex();
    const possibleItemToSelect = list[selectedItemIndex - 1];
    if (possibleItemToSelect) {
      this.handleItemSelect(possibleItemToSelect);
    }
  }

  handleOutOfButtonClick = ({target}) => {
    if (target === this.buttonRef) {
      return;
    }
    this.handleListClose();
  };

  handleListOpen = () => {
    this.setState({isOpen: true});
  };

  handleListClose = () => {
    this.setState({isOpen: false});
  };

  toggleListState = () => {
    const {isOpen} = this.state;
    isOpen
      ? this.handleListClose()
      : this.handleListOpen();
  };

  handleItemSelect = (item) => {
    this.setState({selectedItem: item});
    this.props.onSelect(item);
  };

  renderSuggestions () {
    const {list, suggestionRenderer, dropBoxClassName} = this.props;
    const {isOpen, selectedItem} = this.state;
    if (!isOpen) {
      return null;
    }
    const mappedSuggestions = list.map((item) => {
      const {name, dialCode, priority} = item;
      const uniqueKey = `${name}${dialCode}${priority}`;
      const propsToPass = {
        ...item,
        isActive: item === selectedItem,
      };
      return (
        <div
          key={uniqueKey}
          onClick={() => {this.handleItemSelect(item)}}
        >
          {suggestionRenderer(propsToPass)}
        </div>
      );
    });
    const customisedDropBoxClassName = cs(style.suggestionsWrapper, dropBoxClassName);
    return (
      <div
        className={customisedDropBoxClassName}
        ref={this.setListRef}
      >
        {mappedSuggestions}
      </div>
    )
  }

	render () {
    const {buttonClassName} = this.props;
    const {selectedItem, isOpen} = this.state;
    const {iso2} = selectedItem;
    const customisedButtonClassName = cs(
      style.button, buttonClassName, {
        [style.buttonOpenedState]: isOpen
      });
    return (
      <Fragment>
        <button
          className={customisedButtonClassName}
          ref={this.setButtonRef}
          onClick={this.toggleListState}
        >
          <Flag name={iso2}/>
        </button>
        {this.renderSuggestions()}
      </Fragment>
    );
  }
}

Autocompleter.defaultProps = {
  isOpen: true,
  list: [],
  suggestionRenderer: noopRender,
  onSelect: noop,
};

Autocompleter.propTypes = {
  isOpen: PropTypes.bool,
  list: PropTypes.array,
  suggestionRenderer: PropTypes.func,
  onSelect: PropTypes.func,
  selectedItem: PropTypes.object,
  buttonClassName: PropTypes.string,
  dropBoxClassName: PropTypes.string,
};
