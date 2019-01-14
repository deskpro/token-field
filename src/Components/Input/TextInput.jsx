import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@deskpro/react-components';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';


export default class TextInput extends TokenInput {
  renderInput = () => {
    const { value } = this.state;
    return (
      <Input
        value={value}
        className={styles.input}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        ref={(c) => { this.input = c; }}
        onFocus={this.moveCaretAtEnd}
        placeholder="________"
      />
    );
  };

  renderValue = () => {
    if (this.state.value) {
      return this.state.value;
    }
    return '________';
  };

  onFocus = () => {
    this.props.onFocus(this.props.tokenKey);
    if (this.input) {
      this.input.focus();
    }
  };

  handleChange = (value) => {
    this.setState({
      value
    });
  };

  onBlur = () => {
    this.props.onBlur();
    this.props.onChange(this.state.value);
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        this.setState({
          value: this.props.token.value
        }, () => {
          this.disableEditMode();
        });
        break;
      case 'Tab':
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.props.selectNextToken();
        }
        this.disableEditMode();
        break;
      case 'Enter':
        this.props.selectNextToken();
        this.disableEditMode();
        break;
      default:
        return true;
    }
    e.preventDefault();
    return true;
  };

  moveCaretAtEnd = () => {
    const input = this.input.input;
    if (this.state.value) {
      const length = this.state.value.length;
      input.setSelectionRange(length, length);
    }
  };
}

TextInput.propTypes = {
  ...TokenInput.propTypes,
  token: PropTypes.shape({
    type:  PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};
