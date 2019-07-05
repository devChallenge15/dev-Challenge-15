import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

export class CountriesSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDropdown: false,
      currentCountry: null,
      highlightedItem: null,
      isMobileDevice: false,
    };
  }

  componentDidMount() {
    const { inputValue } = this.props;
    if (inputValue && inputValue.length > 1)
      this.detectCountry();

    if (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1
    )
      this.setIsMobileDevice(true);
  }

  componentDidUpdate(prevProps) {
    const { inputValue } = this.props;
    if (prevProps.inputValue !== inputValue) this.detectCountry();
  }

  testInputValue = value =>
    !!(
      /^[+](\d+)?(\d\W)?(\d\W)?(\d+)?$/.test(value)
    );

  manageInputChange = value => {
    const { handleInputChange } = this.props;
    if (this.testInputValue(value)) handleInputChange(value);
  };

  detectCountry = () => {
    const { countriesData, inputValue } = this.props;
    if (inputValue === '+') this.setState({ currentCountry: null });
    else {
      const foundCountry = countriesData.allCountries.find(country => {
        const countryCode = `+${country.dialCode}`;
        const inputCode = inputValue.slice(0, countryCode.length);
        return countryCode.indexOf(inputCode) !== -1
      });
      this.setState({ currentCountry: foundCountry });
    }
  };

  handleButtonClick = () => {
    const { currentCountry } = this.state;
    const { countriesData } = this.props;
    this.setState({ activeDropdown: true }, () => {
      document.addEventListener('click', this.closeDropdown);
      this.dropdown.focus();
      if (currentCountry)
        this.setHighlightedItem(currentCountry);
      else
        this.setHighlightedItem(countriesData.allCountries[0]);
    });
  };

  closeDropdown = event => {
    if (this.dropdown)
      if (!this.dropdown.contains(event.target))
        this.removeDropdownListener();
  };

  removeDropdownListener = () => {
    if (this.dropdown)
      this.setState({ activeDropdown: false }, () => {
        document.removeEventListener('click', this.closeDropdown);
      });
  };

  handleChooseCountry = code => {
    const { inputValue, handleInputChange } = this.props;
    const { currentCountry } = this.state;
    let value;
    if (currentCountry) {
      const inputCode = inputValue.slice(currentCountry.dialCode.length + 1);
      value = `+${code}${inputCode}`;
    } else {
      value = `+${code}`;
    }
    handleInputChange(value);
    this.removeDropdownListener();
    if (this.countyInput) this.countyInput.focus();
  };

  setHighlightedItem = (item, keyCode) => {
    this.setState(
      { highlightedItem: item }, () => {
        if (keyCode) this.scrollToActiveItem(keyCode);
      }
    );
  };

  scrollToActiveItem = keyCode => {
    switch (keyCode) {
      case 38:
        this.activeItem.scrollIntoView(true);
        break;
      case 40:
        this.activeItem.scrollIntoView(false);
        break;
      default:
        return false;
    }
  };

  onKeyDown = event => {
    const keyCode = event.keyCode;
    const { highlightedItem } = this.state;
    const { countriesData } = this.props;

    const foundIndex = countriesData.allCountries.findIndex(
      country => country.dialCode === highlightedItem.dialCode,
    );

    let newItem;
    if (keyCode === 40)
      newItem = countriesData.allCountries[foundIndex + 1];
    else if (keyCode === 38)
      newItem = countriesData.allCountries[foundIndex - 1];

    switch (keyCode) {
      case 40:
      case 38:
        if (newItem)
          this.setHighlightedItem(newItem, keyCode);
      break;
      case 13:
        this.handleChooseCountry(highlightedItem.dialCode);
      break;
      default:
        return false;
    }
  };

  setIsMobileDevice = param => {
    this.setState({ isMobileDevice: param });
  };

  renderDropdown = () => {
    const { activeDropdown, highlightedItem, isMobileDevice } = this.state;
    const { countriesData } = this.props;
    return (
      activeDropdown &&
      (!isMobileDevice ? (
        <ul
          className="countriesList"
          ref={element => {
            this.dropdown = element;
          }}
          onKeyDown={this.onKeyDown}
          tabIndex="0"
        >
          {countriesData.allCountries.map(country => (
            <li
              key={`${country.dialCode}${country.name}`}
              onClick={() => this.handleChooseCountry(country.dialCode)}
              className={`countyItem ${
                highlightedItem && highlightedItem.dialCode === country.dialCode
                  ? 'active'
                  : ''
                }`}
              ref={
                highlightedItem && highlightedItem.dialCode === country.dialCode
                  ? element => {
                    this.activeItem = element
                  }
                  : null
              }
            >
              <span className={`flag ${country.iso2}`} />
              {country.name}
              <span className="countryItemCode">+{country.dialCode}</span>
            </li>
          ))}
        </ul>
      ) : (
        <select
          className="countriesList"
          ref={element => {
            this.dropdown = element;
          }}
          onKeyDown={this.onKeyDown}
          tabIndex="0"
          onChange={e => this.handleChooseCountry(e.target.value)}
        >
          {countriesData.allCountries.map(country => (
            <option
              key={`${country.dialCode}${country.name}`}
              value={country.dialCode}
              className={`countyItem ${
                highlightedItem && highlightedItem.dialCode === country.dialCode
                  ? 'active'
                  : ''
                }`}
              ref={
                highlightedItem && highlightedItem.dialCode === country.dialCode
                  ? element => {
                    this.activeItem = element
                  }
                  : null
              }
            >
              {country.name} +{country.dialCode}
            </option>
          ))}
        </select>
      ))
    );
  };

  render() {
    const { currentCountry } = this.state;
    const { inputValue } = this.props;
    return (
      <div className="selectionWrapper">
        <p className="selectionTitle">All countries</p>
        <div className="selectionInputWrap">
          <button
            className="countryButton"
            onClick={this.handleButtonClick}
            title="choose country"
          >
            <span className={`flag ${
              currentCountry && currentCountry.iso2
            }`} />
            &#x25BC;
          </button>
          <input
            type="tel"
            value={inputValue}
            onChange={e => this.manageInputChange(e.target.value)}
            className="selectionInput"
            ref={element => {
              this.countyInput = element;
            }}
          />
        </div>
        {this.renderDropdown()}
      </div>
    );
  }
}

CountriesSelection.propTypes = {
  countriesData: PropTypes.object,
  inputValue: PropTypes.string,
  handleInputChange: PropTypes.func,
};

export default CountriesSelection;
