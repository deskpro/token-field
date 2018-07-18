import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AutosizeInput from 'react-input-autosize';
import Highlighter from 'react-highlight-words';
import { Icon, List, ListElement, Scrollbar } from '@deskpro/react-components';
import Tether from 'react-tether';
import styles from 'styles/style.css';

export default class TokenFieldInput extends React.Component {
  static propTypes = {
    tokenTypes:          PropTypes.arrayOf(PropTypes.object).isRequired,
    tokenKey:            PropTypes.number.isRequired,
    onChange:            PropTypes.func,
    onFocus:             PropTypes.func,
    onBlur:              PropTypes.func,
    addToken:            PropTypes.func.isRequired,
    selectPreviousToken: PropTypes.func.isRequired,
    selectNextToken:     PropTypes.func.isRequired,
    removeToken:         PropTypes.func.isRequired,
    value:               PropTypes.string.isRequired,
    showTokensOnFocus:   PropTypes.bool,
    zIndex:              PropTypes.number,
  };

  static defaultProps = {
    onChange() {},
    onFocus() {},
    onBlur() {},
    zIndex:            100,
    showTokensOnFocus: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value:          props.value,
      tokenKey:       props.tokenKey,
      tokens:         [],
      categories:     [],
      selectables:    [],
      subSelectables: [],
      keyword:        '',
      selectedToken:  '',
      subSelected:    '',
      popupOpen:      false,
      tokensExtended: false,
      selectLevel:    0,
    };
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.closePopper();
  }

  selectToken(token) {
    let value = '';
    const { tokenKey } = this.state;
    const match = this.state.value.match(/(.*) [-a-z:]{2,}$/i);
    if (match) {
      value = match[1];
    }
    if (value) {
      this.setState({
        value,
        tokenKey,
        tokens: [],
      }, () => {
        this.props.addToken(token.id, tokenKey + 1);
        this.input.blur();
      });
    } else {
      this.props.removeToken(tokenKey);
      this.props.addToken(token.id, tokenKey);
    }
    this.closePopper();
  }

  openPopper = () => {
    this.setState({
      popupOpen: true
    });
  };

  closePopper = () => {
    this.setState({
      popupOpen: false
    });
    this.setState({
      tokens:         [],
      tokensExtended: false,
      categories:     [],
    });
  };

  handleBlur = () => {
    if (!this.state.popupOpen) {
      if (this.state.value !== '') {
        this.props.onChange(this.state.tokenKey, this.state.value);
        this.closePopper();
      } else {
        this.props.removeToken(this.state.tokenKey);
      }
    }
    this.props.onBlur();
  };

  handleFocus = () => {
    if (this.props.showTokensOnFocus && this.state.value === '') {
      const tokens = this.props.tokenTypes
        .filter(token => token.showOnFocus)
        .sort((a, b) => {
          const aLabel = a.label ? a.label : a.id;
          const bLabel = b.label ? b.label : b.id;
          return aLabel > bLabel;
        });
      let selectedToken = null;
      const selectables = tokens.map(token => token.id);
      selectables.push('extend');
      if (tokens.length) {
        if (!selectedToken || selectables.indexOf(selectedToken) === -1) {
          selectedToken = selectables[0];
        }
        this.openPopper();
      }
      this.setState({
        selectedToken,
        tokens,
        tokensExtended: false,
        categories:     [],
        selectables,
      });
    }
    this.props.onFocus();
  };

  handleChange = (event) => {
    let { selectedToken } = this.state;
    const value = event.currentTarget.value;
    const match = value.match(/ ?([-a-z:]{1,})$/i);
    let tokens = [];
    const keyword = '';
    if (match) {
      const regexp = new RegExp(match[1], 'i');
      tokens = this.props.tokenTypes.filter((token) => {
        if (token.label) {
          return token.label.match(regexp);
        }
        return token.id.match(regexp);
      }
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
      selectables: tokens.map(t => t.id),
      keyword,
      selectedToken,
    });
  };

  handleAllTokens = () => {
    let { tokens } = this.state;
    tokens = tokens.concat(this.props.tokenTypes
      .filter(token => !token.showOnFocus && !token.category)
      .sort((a, b) => {
        const aLabel = a.label ? a.label : a.id;
        const bLabel = b.label ? b.label : b.id;
        return aLabel > bLabel;
      }
      ));
    let selectables = tokens.map(token => token.id);
    const categories = [];
    this.props.tokenTypes
      .filter(token => token.category)
      .forEach((token) => {
        if (!categories[token.category]) {
          categories[token.category] = { label: token.category, children: [] };
        }
        categories[token.category].children.push(token);
      });
    selectables = selectables.concat(Object.keys(categories).map(category => category));
    this.setState({
      categories,
      selectables,
      tokens,
      tokensExtended: true,
    });
  };

  handleKeyDown = (e) => {
    const {
      categories,
      selectables,
      selectedToken,
      selectLevel,
      subSelectables,
      subSelected,
      tokens,
    } = this.state;
    if (this.state.tokens.length > 0) {
      let index = 0;
      if (['ArrowDown', 'ArrowUp'].indexOf(e.key) !== -1) {
        if (selectLevel === 0) {
          index = selectables.findIndex(id => id === selectedToken);
        } else {
          index = subSelectables.findIndex(id => id === subSelected);
        }
      }
      switch (e.key) {
        case 'ArrowDown':
          if (index < selectables.length - 1) {
            if (selectLevel === 0) {
              this.setState({
                selectedToken: selectables[index + 1]
              });
            } else {
              this.setState({
                subSelected: subSelectables[index + 1]
              });
            }
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        case 'ArrowUp':
          if (index > 0) {
            if (selectLevel === 0) {
              this.setState({
                selectedToken: selectables[index - 1]
              });
            } else {
              this.setState({
                subSelected: subSelectables[index - 1]
              });
            }
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        case 'ArrowRight':
          if (this.state.selectLevel === 0 && categories[selectedToken]) {
            this.selectCategory(categories[selectedToken]);
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          break;
        case 'ArrowLeft':
          if (this.state.selectLevel === 1) {
            this.setState({
              selectLevel: 0
            });
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          break;
        case 'Tab':
          if (e.shiftKey) {
            this.props.selectPreviousToken();
          } else if (selectLevel === 1 && categories[selectedToken]) {
            const token = categories[selectedToken].children.find(t => t.id === subSelected);
            if (token) {
              this.selectToken(token);
            }
          } else {
            const token = tokens.find(t => t.id === selectedToken);
            if (token) {
              this.selectToken(token);
            }
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        case 'Enter':
          e.preventDefault();
          e.stopPropagation();
          if (selectedToken === 'extend') {
            this.handleAllTokens();
          } else if (selectLevel === 0 && categories[selectedToken]) {
            this.selectCategory(categories[selectedToken]);
          } else if (selectLevel === 1 && categories[selectedToken]) {
            const token = categories[selectedToken].children.find(t => t.id === subSelected);
            if (token) {
              this.selectToken(token);
            }
          } else {
            const token = tokens.find(t => t.id === selectedToken);
            if (token) {
              this.selectToken(token);
            }
          }
          return false;
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
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        case 'Escape': {
          this.closePopper();
          return false;
        }
        case 'Backspace':
        case 'Delete':
          break;
        default:
          // Do nothing
          return true;
      }
    }
    switch (e.key) {
      case 'Backspace':
        if (this.state.tokenKey > 0 && (this.state.value === '' || e.target.selectionStart === 0)) {
          e.preventDefault();
          this.props.removeToken(this.state.tokenKey - 1, this.state.tokenKey - 1);
          return true;
        }
        return true;
      case 'Delete':
        if (e.target.selectionStart === this.state.value.length) {
          e.preventDefault();
          this.props.removeToken(this.state.tokenKey + 1, this.state.tokenKey);
          return true;
        }
        return true;
      case 'ArrowRight':
        if (e.target.selectionStart === this.state.value.length) {
          e.preventDefault();
          this.props.selectNextToken();
        } else {
          return true;
        }
        break;
      case 'ArrowLeft':
        if (e.target.selectionStart === 0) {
          e.preventDefault();
          this.props.selectPreviousToken();
        } else {
          return true;
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.props.selectNextToken();
        }
        break;
      case 'Enter':
        e.preventDefault();
        this.props.selectNextToken();
        break;
      default:
        return true;
    }
    this.input.blur();
    return true;
  };

  selectCategory(category) {
    const subSelectables = category.children.map(child => child.id);
    const subSelected = subSelectables[0];
    this.setState({
      selectLevel: 1,
      subSelectables,
      subSelected,
    });
  }

  renderTokens() {
    if (this.props.showTokensOnFocus && this.state.value === '') {
      return this.renderAllTokens();
    }
    const { keyword, selectedToken } = this.state;
    return (
      <div className="dp-select">
        <div className="dp-select__content">
          <Scrollbar>
            <List className="dp-selectable-list">
              {this.state.tokens.map((token) => {
                const selected = (token.id === selectedToken) ? styles.selected : '';
                const label = token.label ? token.label : token.id;
                return (
                  <ListElement
                    key={token.id}
                    onClick={() => this.selectToken(token)}
                    className={classNames(styles['token-suggestion'], selected)}
                  >
                    <Highlighter
                      highlightClassName={styles.highlight}
                      searchWords={[keyword]}
                      textToHighlight={label}
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

  renderAllTokens() {
    const { selectedToken } = this.state;
    return (
      <div className={classNames(styles['dp-select__all-tokens'], 'dp-select')}>
        <div className="dp-select__content">
          <List className="dp-selectable-list">
            {this.state.tokens.map((token) => {
              const selected = (token.id === selectedToken) ? styles.selected : '';
              const label = token.label ? token.label : token.id;
              return (
                <ListElement
                  key={token.id}
                  onClick={() => this.selectToken(token)}
                  className={classNames(styles['token-suggestion'], selected)}
                >
                  {label}:&nbsp;
                  <span className={styles.description}>{token.description}</span>
                </ListElement>
              );
            })}
            {!this.state.tokensExtended ?
              <ListElement
                onClick={this.handleAllTokens}
                className={classNames(styles['extend-tokens'], { selected: selectedToken === 'extend' })}
              >
                <Icon name="caret-down" />
              </ListElement>
              : this.renderCategories()
            }
          </List>
        </div>
      </div>
    );
  }

  renderCategories() {
    const { categories, selectedToken, subSelected, selectLevel } = this.state;
    const elements = Object.keys(categories).map((label) => {
      const selected = (selectedToken === label) ? styles.selected : '';
      return (
        <ListElement
          key={label}
          className={classNames(styles['token-suggestion'], styles.category, selected)}
        >
          {label} <Icon name="caret-right" />
          <List className={classNames(styles['token-subcategory'], 'dp-selectable-list')}>
            {categories[label].children.map((token) => {
              const childLabel = token.label ? token.label : token.id;
              const childSelect = (selectLevel === 1 && subSelected === token.id) ? styles.selected : '';
              return (
                <ListElement
                  key={token.id}
                  onClick={() => this.selectToken(token)}
                  className={classNames(styles['token-suggestion'], childSelect)}
                >
                  {childLabel}:&nbsp;
                  <span className={styles.description}>{token.description}</span>
                </ListElement>
              );
            })}
          </List>
        </ListElement>
      );
    });
    elements.unshift(<ListElement key="separator" className="separator" />);
    return elements;
  }

  render() {
    const { value, popupOpen } = this.state;
    return (
      <Tether
        style={{ display: 'inline-block', zIndex: this.props.zIndex }}
        attachment="top left"
      >
        <AutosizeInput
          ref={(c) => { this.input = c; }}
          inputClassName={styles['raw-text']}
          value={value}
          style={{ fontSize: 14 }}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        {
          popupOpen ?
            <div className="token-field__popup">
              {this.renderTokens()}
            </div> : null
        }
      </Tether>
    );
  }
}
