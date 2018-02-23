import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@deskpro/react-components';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';


export default class TextInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    className:           PropTypes.string,
    onChange:            PropTypes.func,
    selectPreviousToken: PropTypes.func.isRequired,
    selectNextToken:     PropTypes.func.isRequired,
    removeToken:         PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: '',
    onChange() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.token.value,
    };
  }

  getInput = () => {
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

  getValue = () => {
    if (this.state.value) {
      return this.state.value;
    }
    return '________';
  };

  focus = () => {
    this.tokenInput.focus();
  };

  focusInput = () => {
    this.input.focus();
  };

  handleChange = (value) => {
    this.setState({
      value
    });
  };

  handleBlur = () => {
    this.props.onChange(this.state.value);
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        this.setState({
          value: this.props.token.value
        }, () => {
          this.tokenInput.disableEditMode();
        });
        break;
      case 'Tab':
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.props.selectNextToken();
        }
        this.tokenInput.disableEditMode();
        break;
      case 'Enter':
        this.props.selectNextToken();
        this.tokenInput.disableEditMode();
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

  render() {
    const { token, className, removeToken } = this.props;
    return (
      <TokenInput
        ref={(c) => { this.tokenInput = c; }}
        className={className}
        type={token.type}
        renderInput={this.getInput}
        renderValue={this.getValue}
        onFocus={this.focusInput}
        onBlur={this.handleBlur}
        removeToken={removeToken}
      />
    );
  }
}
