import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input } from 'deskpro-components/lib/Components/Forms';
import styles from '../../styles/input.css';
import ClickOutsideInput from './ClickOutsideInput';

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
      editMode: false,
      from,
      to,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getValue = this.getValue.bind(this);
    this.clickOutside = this.clickOutside.bind(this);
    this.enableEditMode = this.enableEditMode.bind(this);
    this.disableEditMode = this.disableEditMode.bind(this);
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

  handleChange(value, name) {
    this.setState({
      [name]: this.props.convertToValue(value)
    });
  }

  handleKeyDown(e) {
    switch (e.which) {
      case 27:
        this.setState({
          value: this.props.token.value
        });
        this.disableEditMode();
        return;
      case 13:
        if (e.target.name === 'from') {
          this.inputTo.focus();
        } else {
          this.disableEditMode();
        }
        return;
      case 9:
        if (e.target.name === 'to') {
          this.disableEditMode();
        }
        break;
      default:
        // Do nothing
        break;
    }
  }

  clickOutside() {
    this.disableEditMode();
  }

  enableEditMode() {
    this.setState({
      editMode: true
    });
    setTimeout(() => {
      this.inputFrom.focus();
    }, 10);
  }

  disableEditMode() {
    this.setState({
      editMode: false
    });
  }

  render() {
    const { token, className, unitPhrase } = this.props;
    const { from, to, editMode } = this.state;
    return (
      <div className={classNames(styles.token, className)}>
        <div className={classNames(styles.label, 'dp-code')}>
          {token.type}:
        </div>
        { editMode ?
          <ClickOutsideInput
            onClickOutside={this.clickOutside}
          >
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
          </ClickOutsideInput>
          : <span className={styles.value} onClick={this.enableEditMode}>{this.getValue()}</span>
        }
      </div>
    );
  }
}
