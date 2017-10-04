import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AutosizeInput from 'react-input-autosize';
import Highlighter from 'react-highlight-words';
import { List, ListElement, Scrollbar, Popper } from 'deskpro-components/lib/Components/Common';
import styles from '../styles/style.css';

export default class TokenFieldInput extends React.Component {
  static propTypes = {
    tokenTypes:          PropTypes.arrayOf(PropTypes.object).isRequired,
    tokenKey:            PropTypes.number.isRequired,
    onChange:            PropTypes.func,
    addToken:            PropTypes.func.isRequired,
    selectPreviousToken: PropTypes.func.isRequired,
    selectNextToken:     PropTypes.func.isRequired,
    removeToken:         PropTypes.func.isRequired,
    value:               PropTypes.string.isRequired,
  };

  static defaultProps = {
    onChange() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      value:         props.value,
      tokenKey:      props.tokenKey,
      tokens:        [],
      keyword:       '',
      selectedToken: null,
    };
  }

  focus() {
    this.input.focus();
  }

  selectToken(token) {
    let value = '';
    const { tokenKey } = this.state;
    const match = this.state.value.match(/(.*) [-a-z:]{2,}$/);
    if (match) {
      value = match[1];
    }
    if (value) {
      this.setState({
        value,
        tokenKey,
        tokens: [],
      }, () => {
        this.props.addToken(tokenKey + 1, token.id);
        this.input.blur();
      });
    } else {
      this.props.removeToken(tokenKey);
      this.props.addToken(tokenKey, token.id);
    }
    this.closePopper();
  }

  openPopper = () => {
    this.popperRef.open();
  };

  closePopper = () => {
    this.popperRef.close();
    this.setState({
      tokens: []
    });
  };

  handleBlur = () => {
    if (this.state.value !== '') {
      this.props.onChange(this.state.tokenKey, this.state.value);
      this.closePopper();
    } else {
      this.props.removeToken(this.state.tokenKey);
    }
  };

  handleChange = (event) => {
    let { selectedToken } = this.state;
    const value = event.currentTarget.value;
    const match = value.match(/ ?([-a-z:]{2,})$/);
    let tokens = [];
    let keyword = '';
    if (match) {
      keyword = match[1];
      tokens = this.props.tokenTypes.filter(token =>
        token.id.match(keyword)
      );
    }
    if (tokens.length) {
      if (!selectedToken || tokens.indexOf(selectedToken) === -1) {
        selectedToken = tokens[0];
      }
      this.openPopper();
    } else {
      selectedToken = null;
      this.closePopper();
    }
    this.setState({
      value,
      tokens,
      keyword,
      selectedToken,
    });
  };

  handleKeyDown = (e) => {
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
        case 'Tab':
          if (e.shiftKey) {
            this.props.selectPreviousToken();
          } else {
            this.selectToken(this.state.selectedToken);
          }
          break;
        case 'Enter':
          this.selectToken(this.state.selectedToken);
          break;
        case ':': {
          let value = '';
          const match = this.state.value.match(/ ?([-a-z:]{2,})$/);
          if (match) {
            value = match[1];
          }
          const token = tokens.find(t => t.id === value);
          if (token) {
            this.selectToken(token);
          }
          break;
        }
        default:
          // Do nothing
          return true;
      }
      e.preventDefault();
      return false;
    }
    switch (e.key) {
      case 'Backspace':
        if (this.state.tokenKey > 0 && this.state.value === '') {
          this.props.removeToken(this.state.tokenKey - 1, this.state.tokenKey - 1);
        } else {
          return true;
        }
        break;
      case 'Tab':
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.props.selectNextToken();
        }
        break;
      case 'Enter':
        this.props.selectNextToken();
        break;
      default:
        return true;
    }
    e.preventDefault();
    this.input.blur();
    return true;
  };

  renderTokens() {
    const { keyword } = this.state;
    return (
      <div className="dp-select">
        <div className="dp-select__content">
          <Scrollbar>
            <List className="dp-selectable-list">
              {this.state.tokens.map((token) => {
                const selected = (token === this.state.selectedToken) ? styles.selected : '';
                return (
                  <ListElement
                    key={token.id}
                    onClick={() => this.selectToken(token)}
                    className={classNames(styles['token-suggestion'], selected)}
                  >
                    <Highlighter
                      highlightClassName={styles.highlight}
                      searchWords={[keyword]}
                      textToHighlight={token.id}
                    />:&nbsp;
                    <span className={styles.description}>{token.description}</span>
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
