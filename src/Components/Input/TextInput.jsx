import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'deskpro-components/lib/Components/Forms';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';


export default class TextInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: ''
  };

  static moveCaretAtEnd(e) {
    const tempValue = e.target.value;
    e.target.value = '';
    e.target.value = tempValue;
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.token.value,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getInput = this.getInput.bind(this);
    this.getValue = this.getValue.bind(this);
    this.focusInput = this.focusInput.bind(this);
  }

  getInput() {
    const { value } = this.state;
    return (
      <Input
        value={value}
        className={styles.input}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        ref={(c) => { this.input = c; }}
        onFocus={TextInput.moveCaretAtEnd}
        placeholder="________"
      />
    );
  }

  getValue() {
    if (this.state.value) {
      return this.state.value;
    }
    return '________';
  }

  focusInput() {
    this.input.focus();
  }

  handleChange(value) {
    this.setState({
      value
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
      case 'Enter':
        this.tokenInput.disableEditMode();
        break;
      default:
    }
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
        focusInput={this.focusInput}
      />
    );
  }
}
