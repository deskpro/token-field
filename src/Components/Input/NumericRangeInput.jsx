import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input } from 'deskpro-components/lib/Components/Forms';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';

export default class NumericRangeInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.array.isRequired,
    }).isRequired,
    className:        PropTypes.string,
    unitPhrase:       PropTypes.string,
    convertToValue:   PropTypes.func,
    convertFromValue: PropTypes.func,
  };
  static defaultProps = {
    className:  '',
    unitPhrase: '',
    convertToValue(v) { return v; },
    convertFromValue(v) { return v; },
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
    if (this.props.token.value.length) {
      from = this.props.token.value[0];
    }
    if (this.props.token.value.length > 1) {
      to = this.props.token.value[1];
    }
    this.state = {
      from,
      to,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getInput = this.getInput.bind(this);
    this.getValue = this.getValue.bind(this);
    this.focus = this.focus.bind(this);
  }

  getInput() {
    const { unitPhrase } = this.props;
    const { from, to } = this.state;
    return (
      <span>
        <Input
          value={this.props.convertFromValue(from)}
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
          value={this.props.convertFromValue(to)}
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
  }

  getValue() {
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
  }

  focus() {
    this.tokenInput.focus();
  }

  handleChange(value, name) {
    this.setState({
      [name]: this.props.convertToValue(value)
    });
  }

  handleKeyDown(e) {
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
            this.tokenInput.disableEditMode();
          }
        } else if (e.target.name === 'to') {
          this.inputFrom.focus();
        } else {
          this.tokenInput.disableEditMode();
        }
        break;
      default:
        // Do nothing
        return;
    }
    e.preventDefault();
  }

  render() {
    const { token, className } = this.props;
    return (
      <TokenInput
        ref={(c) => { this.tokenInput = c; }}
        className={className}
        type={token.type}
        getInput={this.getInput}
        getValue={this.getValue}
      />
    );
  }
}
