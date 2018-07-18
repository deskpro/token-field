import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as inputs from './Input';
import TokenFieldInput from './TokenFieldInput';
import styles from '../styles/style.css';

export default class TokenField extends React.Component {
  static propTypes = {
    tokenTypes: PropTypes.arrayOf(PropTypes.shape({
      id:     PropTypes.string.isRequired,
      widget: PropTypes.oneOf(
        [
          'BooleanInput',
          'DateTimeInput',
          'DurationInput',
          'NumericRangeInput',
          'SelectInput',
          'TextInput',
        ]
      ).isRequired,
      props:       PropTypes.object,
      description: PropTypes.string,
    })).isRequired,
    onChange:          PropTypes.func,
    onFocus:           PropTypes.func,
    onBlur:            PropTypes.func,
    value:             PropTypes.array,
    zIndex:            PropTypes.number,
    showTokensOnFocus: PropTypes.bool,
    blurTimeout:       PropTypes.number,
  };

  static defaultProps = {
    onChange() {},
    onFocus() {},
    onBlur() {},
    value:             [],
    zIndex:            100,
    blurTimeout:       300,
    showTokensOnFocus: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value:   props.value,
      focused: false,
    };

    this.inputs = [];
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  }

  componentDidUpdate() {
    if (this.focusInput !== undefined) {
      if (this.inputs[this.focusInput]) {
        this.inputs[this.focusInput].focus();
      }
      this.focusInput = undefined;
    }
  }

  onFocus = () => {
    if (!this.state.focused) {
      this.props.onFocus();
      this.setState({
        focused: true
      });
    }
    if (this.pendingBlur) {
      window.clearTimeout(this.pendingBlur);
    }
  };

  onBlur = () => {
    if (this.pendingBlur) {
      window.clearTimeout(this.pendingBlur);
    }
    this.pendingBlur = window.setTimeout(() => {
      this.setState({
        focused: false
      });
      this.props.onBlur();
    }, this.props.blurTimeout);
  };

  getInputField = (key, value) => (
    <TokenFieldInput
      ref={(c) => { this.inputs[key] = c; }}
      value={value}
      key={key}
      tokenKey={key}
      tokenTypes={this.props.tokenTypes}
      addToken={this.addTokenAndFocus}
      onChange={this.handleTokenChange}
      onFocus={this.onFocus}
      onBlur={this.onBlur}
      selectPreviousToken={() => this.selectPreviousToken(key)}
      selectNextToken={() => this.selectNextToken(key)}
      removeToken={this.removeToken}
      zIndex={this.props.zIndex}
      showTokensOnFocus={this.props.showTokensOnFocus}
    />
  );

  addInputAndFocus = (key) => {
    const { value } = this.state;
    const inputKey = (!key) ? value.length : key;
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

  focus = () => {
    this.addInputAndFocus();
  };

  blur = () => {
    this.inputs.forEach((input) => {
      if (input && input.blur) {
        input.blur();
      }
    });
  };

  addTokenAndFocus = (id, key, defaultValue) => {
    const { value } = this.state;
    const inputKey = (!key) ? value.length : key;
    value.splice(inputKey, 0, { type: id, value: defaultValue });
    this.focusInput = inputKey;
    this.setState({
      value
    });
  };

  removeToken = (key, focusKey) => {
    const { value } = this.state;
    value.splice(key, 1);
    this.inputs.splice(key, 1);
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
    const { tokenTypes, zIndex } = this.props;
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
          const label = input.label ? input.label : input.id;
          elements.push(
            <Component
              key={key}
              token={token}
              label={label}
              ref={(c) => { this.inputs[index] = c; }}
              onChange={v => this.handleTokenChange(index, v)}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              removeToken={() => this.removeToken(index)}
              selectPreviousToken={() => this.selectPreviousToken(index)}
              selectNextToken={() => this.selectNextToken(index)}
              zIndex={zIndex}
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
      <div className={classNames(styles['token-field'], 'token-field')}>
        <div>
          {this.renderInputs()}
        </div>
        <div onClick={() => this.addInputAndFocus()} className={classNames(styles['input-box'], 'input-box')} />
      </div>
    );
  }
}
