import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from 'deskpro-components/lib/Components/Icon';
import { List, ListElement, Scrollbar, Popper } from 'deskpro-components/lib/Components/Common';
import AutosizeInput from 'react-input-autosize';
import * as inputs from './Input';
import styles from '../styles/style.css';

export class Token {
  constructor(id, widget, props, description) {
    this.id = id;
    this.widget = widget;
    this.props = props;
    this.description = description;
  }
}

class TokenFieldInput extends React.Component {
  static propTypes = {
    tokenTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    tokenKey:   PropTypes.number.isRequired,
    onChange:   PropTypes.func,
    addToken:   PropTypes.func.isRequired,
    value:      PropTypes.string.isRequired,
  };

  static defaultProps = {
    onChange() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      value:         props.value,
      tokens:        [],
      selectedToken: null,
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  focus() {
    this.input.focus();
  }

  selectToken(token) {
    let value = '';
    const { tokenKey } = this.props;
    const match = this.state.value.match(/(.*) [-a-z:]{2,}$/);
    if (match) {
      value = match[1];
    }
    this.setState({
      value
    }, () => {
      this.props.addToken((value) ? tokenKey + 1 : tokenKey, token.id);
      this.input.blur();
    });
    this.popperRef.close();
  }

  handleBlur() {
    this.props.onChange(this.props.tokenKey, this.state.value);
  }

  handleChange(event) {
    const value = event.currentTarget.value;
    const match = value.match(/ ?([-a-z:]{2,})$/);
    let tokens = [];
    if (match) {
      const lastWord = match[1];
      tokens = this.props.tokenTypes.filter(token =>
        token.id.match(lastWord)
      );
    }
    if (tokens.length) {
      if (!this.state.selectedToken) {
        this.setState({
          selectedToken: tokens[0]
        });
      }
      this.popperRef.open();
    } else {
      this.popperRef.close();
    }
    this.setState({
      value,
      tokens
    });
  }

  handleKeyDown(e) {
    const { tokens } = this.state;
    if (this.state.tokens.length > 0) {
      let index = 0;
      if (['ArrowDown', 'ArrowUp'].indexOf(e.key) !== -1) {
        index = tokens.findIndex(token => token.id === this.state.selectedToken.id);
      }
      switch (e.key) {
        case 'ArrowDown':
          if (index < tokens.length - 1) {
            this.setState({
              selectedToken: tokens[index + 1]
            });
          }
          break;
        case 'ArrowUp':
          if (index > 0) {
            this.setState({
              selectedToken: tokens[index - 1]
            });
          }
          break;
        case 'Enter':
          this.selectToken(this.state.selectedToken);
          break;
        default:
          // Do nothing
          return true;
      }
      e.preventDefault();
      return false;
    }
    return true;
  }

  renderTokens() {
    return (
      <div className="dp-select">
        <div className="dp-select__content">
          <Scrollbar>
            <List className="dp-selectable-list">
              {this.state.tokens.map((token) => {
                const selected = (token === this.state.selectedToken) ? 'dp-selectable-list--selected' : '';
                return (
                  <ListElement
                    key={token.id}
                    onClick={() => this.selectToken(token)}
                    className={classNames(styles['token-suggestion'], selected)}
                  >
                    {token.id}: <span className={styles.description}>{token.description}</span>
                  </ListElement>
                );
              }
              )}
            </List>
          </Scrollbar>
        </div>
      </div>
    );
  }

  render() {
    const { value } = this.state;
    return (
      <div
        ref={ref => (this.rootRef = ref)}
        style={{ display: 'inline-block' }}
      >
        <AutosizeInput
          ref={(c) => { this.input = c; }}
          inputClassName={styles['raw-text']}
          value={value}
          style={{ fontSize: 14 }}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <Popper
          ref={ref => (this.popperRef = ref)}
          target={this.rootRef}
          placement="bottom"
          arrow={false}
          onOpen={this.handlePopperOpen}
          onClose={this.handlePopperClose}
        >
          {this.renderTokens()}
        </Popper>
      </div>
    );
  }
}

export class TokenField extends React.Component {
  static propTypes = {
    tokenTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange:   PropTypes.func,
    value:      PropTypes.array.isRequired,
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

    this.getInputField = this.getInputField.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.addInputAndFocus = this.addInputAndFocus.bind(this);
    this.addTokenAndFocus = this.addTokenAndFocus.bind(this);
  }

  componentDidUpdate() {
    if (this.focusInput) {
      this.inputs[this.focusInput].focus();
      this.focusInput = false;
    }
  }

  getInputField(key, value) {
    return (
      <TokenFieldInput
        ref={(c) => { this.inputs[key] = c; }}
        value={value}
        key={key}
        tokenKey={key}
        tokenTypes={this.props.tokenTypes}
        addToken={this.addTokenAndFocus}
        onChange={this.handleTokenChange}
      />
    );
  }

  addInputAndFocus(key) {
    const { value } = this.state;
    const inputKey = (!key) ? value.length : key;
    if (inputKey === value.length && value[inputKey - 1].type === 'TEXT') {
      this.inputs[inputKey - 1].focus();
    } else {
      value.push({ type: 'TEXT', value: '' });
      this.focusInput = inputKey;
      this.setState({
        value
      });
      this.props.onChange(value);
    }
  }

  addTokenAndFocus(key, id) {
    const { value } = this.state;
    console.log(JSON.stringify(value));
    value.splice(key, 0, { type: id });
    this.focusInput = key;
    console.log(JSON.stringify(value));
    this.setState({
      value
    });
  }

  handleTokenChange(key, token) {
    const { value } = this.state;
    value[key].value = token;
    this.setState({
      value
    });
    this.props.onChange(value);
  }

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
