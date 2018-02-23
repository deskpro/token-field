import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input } from '@deskpro/react-components';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';

export default class NumericRangeInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.array,
    }).isRequired,
    className:           PropTypes.string,
    unitPhrase:          PropTypes.string,
    onChange:            PropTypes.func,
    convertToValue:      PropTypes.func,
    convertFromValue:    PropTypes.func,
    selectPreviousToken: PropTypes.func.isRequired,
    selectNextToken:     PropTypes.func.isRequired,
    removeToken:         PropTypes.func.isRequired,
  };
  static defaultProps = {
    className:  '',
    unitPhrase: '',
    convertToValue(v) { return v; },
    convertFromValue(v) { return v; },
    onChange() {},
  };

  static moveCaretAtEnd(e) {
    const tempValue = e.target.value;
    e.target.value = '';
    e.target.value = tempValue;
  }

  constructor(props) {
    super(props);
    let from = '';
    let to = '';
    if (this.props.token.value && this.props.token.value.length) {
      from = this.props.token.value[0];
    }
    if (this.props.token.value && this.props.token.value.length > 1) {
      to = this.props.token.value[1];
    }
    this.state = {
      from,
      to,
    };
  }

  getInput = () => {
    const { unitPhrase } = this.props;
    const { from, to } = this.state;
    const fromValue = (from) ? this.props.convertFromValue(from) : '';
    const toValue = (to) ? this.props.convertFromValue(to) : '';
    return (
      <span>
        <Input
          value={fromValue}
          name="from"
          className={classNames(styles.input)}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          ref={(c) => { this.inputFrom = c; }}
          onFocus={NumericRangeInput.moveCaretAtEnd}
          placeholder="__"
        />
        {unitPhrase} to
        <Input
          value={toValue}
          name="to"
          className={classNames(styles.input)}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          ref={(c) => { this.inputTo = c; }}
          onFocus={NumericRangeInput.moveCaretAtEnd}
          placeholder="__"
        />
        {unitPhrase}
      </span>
    );
  };

  getValue = () => {
    const { unitPhrase } = this.props;
    const { from, to } = this.state;
    let displayFrom;
    let displayTo;
    if (from) {
      displayFrom = this.props.convertFromValue(from);
    } else {
      displayFrom = '__';
    }
    if (to) {
      displayTo = this.props.convertFromValue(to);
    } else {
      displayTo = '__';
    }
    return `${displayFrom} ${unitPhrase} to ${displayTo} ${unitPhrase}`;
  };

  focus = (end) => {
    this.tokenInput.focus(end);
  };

  focusInput = (end) => {
    if (end) {
      this.inputTo.focus();
    } else {
      this.inputFrom.focus();
    }
  };

  handleChange = (value, name) => {
    this.setState({
      [name]: this.props.convertToValue(value)
    });
  };

  handleBlur = () => {
    this.props.onChange([this.state.from, this.state.to]);
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        this.setState({
          value: this.props.token.value
        });
        this.tokenInput.disableEditMode();
        break;
      case 'Tab':
      case 'Enter':
        if (!e.shiftKey) {
          if (e.target.name === 'from') {
            this.inputTo.focus();
          } else {
            this.props.selectNextToken();
            this.tokenInput.disableEditMode();
          }
        } else if (e.target.name === 'to') {
          this.inputFrom.focus();
        } else {
          this.props.selectPreviousToken();
          this.tokenInput.disableEditMode();
        }
        break;
      default:
        // Do nothing
        return;
    }
    e.preventDefault();
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
