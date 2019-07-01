import React from 'react';
import PropTypes from 'prop-types';
import {Flag} from '../../../elements/flag';
import cs from 'classnames';
import style from './style.module.scss';

export const BaseSuggestionRenderer = ({iso2, name, dialCode, isActive}) => (
  <div className={cs(style.wrapper, {
    [style.selectedState]: isActive
  })}>
    <Flag name={iso2}/>
    <div className={style.title}>{name}</div>
    <div className={style.code}>+{dialCode}</div>
  </div>
);

BaseSuggestionRenderer.propTypes = {
  dialCode: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  iso2: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};
