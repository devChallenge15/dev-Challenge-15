import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import style from './style.module.scss';

export const Flag = ({name}) => (
  <div
    className={cs(style.flag, style[name])}
  />
);

Flag.propTypes = {
  name: PropTypes.string.isRequired
};
