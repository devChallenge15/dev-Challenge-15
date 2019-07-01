import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import style from './style.module.scss';

export function Input (props) {
  const {value, onChange, inputClassName} = props;
  const customisedClassName = cs(inputClassName, style.input);
  return (
    <input
      className={customisedClassName}
      type="text"
      value={value}
      onChange={({target: {value}}) => {onChange(value);}}
    />
  );
}

Input.propTypes = {
  value: PropTypes.string.isRequired,
  inputClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
