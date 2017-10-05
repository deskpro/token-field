import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'deskpro-components/lib/Components/Icon';
import * as inputs from './Input';
import TokenFieldInput from './TokenFieldInput';
import styles from '../styles/style.css';

export class TokenField extends React.Component {
  static propTypes = {
    tokenTypes: PropTypes.arrayOf(PropTypes.shape({
      id:     PropTypes.string.isRequired,
      widget: PropTypes.oneOf(
        ['TextInput', 'DateTimeInput', 'DurationInput', 'SelectInput', 'NumericRangeInput']
      ).isRequired,
      props:       PropTypes.object,
      description: PropTypes.string,
    })).isRequired,
    onChange: PropTypes.func,
    value:    PropTypes.array.isRequired,
  };

  static defaultProps = {
    onChange() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };

    this.inputs = [];
  }

  componentDidUpdate() {
    if (this.focusInput !== undefined) {
      this.inputs[this.focusInput].focus();
      this.focusInput = undefined;
    }
  }

  getInputField = (key, value) => (
    <TokenFieldInput
      ref={(c) => { this.inputs[key] = c; }}
      value={value}
      key={key}
      tokenKey={key}
      tokenTypes={this.props.tokenTypes}
      addToken={this.addTokenAndFocus}
      onChange={this.handleTokenChange}
      selectPreviousToken={() => this.selectPreviousToken(key)}
      selectNextToken={() => this.selectNextToken(key)}
      removeToken={this.removeToken}
    />
  );

  addInputAndFocus = (key) => {
    const { value } = this.state;
    const inputKey = (!key) ? value.length : key;
    if (this.inputs[0] === null) {
      setTimeout(() => this.addInputAndFocus(key), 10);
      return;
    }
    if (value.length && inputKey === value.length && value[inputKey - 1].type === 'TEXT') {
      this.inputs[inputKey - 1].focus();
    } else {
      value.push({ type: 'TEXT', value: '' });
      this.focusInput = inputKey;
      this.setState({
        value
      });
      this.props.onChange(value);
    }
  };

  addTokenAndFocus = (key, id) => {
    const { value } = this.state;
    value.splice(key, 0, { type: id, value: undefined });
    this.focusInput = key;
    this.setState({
      value
    });
  };

  removeToken = (key, focusKey) => {
    const { value } = this.state;
    value.splice(key, 1);
    if (focusKey !== undefined) {
      this.focusInput = focusKey;
    }
    this.setState({
      value
    });
    this.props.onChange(value);
  };

  selectPreviousToken(key) {
    if (key > 0) {
      this.inputs[key - 1].focus(true);
    }
  }

  selectNextToken(key) {
    if (this.inputs[key + 1]) {
      this.inputs[key + 1].focus();
    } else {
      this.addInputAndFocus();
    }
  }

  handleTokenChange = (key, token) => {
    const { value } = this.state;
    value[key].value = token;
    this.setState({
      value
    });
    this.props.onChange(value);
  };

  renderInputs() {
    const { tokenTypes } = this.props;
    const { value } = this.state;
    let key = 0;
    const elements = [];
    value.forEach((token) => {
      const index = key;
      if (token.type === 'TEXT') {
        elements.push(this.getInputField(index, token.value));
      } else {
        const input = tokenTypes.find(type => type.id === token.type);
        if (input) {
          const Component = inputs[input.widget];
          elements.push(
            <Component
              key={key}
              token={token}
              ref={(c) => { this.inputs[index] = c; }}
              onChange={v => this.handleTokenChange(index, v)}
              removeToken={() => this.removeToken(index)}
              selectPreviousToken={() => this.selectPreviousToken(index)}
              selectNextToken={() => this.selectNextToken(index)}
              {...input.props}
            />
          );
        }
      }
      key += 1;
    });
    return elements;
  }

  render() {
    return (
      <div className={styles['token-field']}>
        <span><Icon name="search" className={styles.search} /></span>
        <div>
          {this.renderInputs()}
        </div>
        <div onClick={() => this.addInputAndFocus()} className={styles['input-box']} />
      </div>
    );
  }
}
