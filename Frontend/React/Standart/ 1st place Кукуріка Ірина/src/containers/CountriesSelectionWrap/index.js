import React from 'react';
import './flags.css';
import CountriesData from '../../helpers/data';
import CountriesSelection from "../CountriesSelection";

export class CountriesSelectionWrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '+',
    };
  }

  handleInputChange = value => {
    this.setState({ inputValue: value });
  };

  render() {
    const { inputValue } = this.state;
    return (
      <CountriesSelection
        countriesData={CountriesData}
        inputValue={inputValue}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

export default CountriesSelectionWrap;

