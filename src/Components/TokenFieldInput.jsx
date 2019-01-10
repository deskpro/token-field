import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AutosizeInput from 'react-input-autosize';
import Highlighter from 'react-highlight-words';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Icon, List, ListElement, Scrollbar } from '@deskpro/react-components';
import Tether from 'react-tether';
import styles from '../styles/style.css';

export default class TokenFieldInput extends React.Component {
  static propTypes = {
    tokenTypes:          PropTypes.arrayOf(PropTypes.object).isRequired,
    menuStructure:       PropTypes.array,
    tokenKey:            PropTypes.number.isRequired,
    onChange:            PropTypes.func,
    onFocus:             PropTypes.func,
    onBlur:              PropTypes.func,
    addToken:            PropTypes.func.isRequired,
    selectPreviousToken: PropTypes.func.isRequired,
    selectNextToken:     PropTypes.func.isRequired,
    removeToken:         PropTypes.func.isRequired,
    cancelBlur:          PropTypes.func.isRequired,
    value:               PropTypes.string.isRequired,
    nbCollapsed:         PropTypes.number,
    currentValue:        PropTypes.array,
    showTokensOnFocus:   PropTypes.bool,
    isOpen:              PropTypes.bool,
    zIndex:              PropTypes.number,
    scopes:              PropTypes.array,
  };

  static defaultProps = {
    onChange() {},
    onFocus() {},
    onBlur() {},
    zIndex:            100,
    currentValue:      [],
    showTokensOnFocus: true,
    isOpen:            false,
    menuStructure:     [],
    nbCollapsed:       3,
    scopes:            [],
  };

  constructor(props) {
    super(props);
    this.state = {
      value:          props.value,
      tokenKey:       props.tokenKey,
      tokens:         [],
      selectables:    [],
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

  selectToken(token, scope = undefined) {
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
        this.props.addToken(token.id, tokenKey + 1, scope);
        this.input.blur();
      });
    } else {
      this.props.removeToken(tokenKey);
      this.props.addToken(token.id, tokenKey, scope);
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
      const { scopes } = this.props;
      let tokens = this.props.menuStructure
        .filter((menu) => {
          const token = this.props.tokenTypes.find(t => t.id === menu.token);
          if (token && token.allowDuplicate !== true) {
            if (this.props.currentValue.find(e => e.type === token.id)) {
              return false;
            }
          }
          if (token && scopes && token.scopes) {
            return scopes.length === 0 || token.scopes.filter(v => scopes.indexOf(v) !== -1).length > 0;
          }
          if (menu.children) {
            if (menu.scope && scopes.length && scopes.find(v => v === menu.scope) === undefined) {
              return false;
            }
            const children = menu.children.filter((child) => {
              const childToken = this.props.tokenTypes.find(t => t.id === child.token);
              if (childToken && childToken.allowDuplicate !== true) {
                if (this.props.currentValue.find(e => e.type === childToken.id)) {
                  return false;
                }
              }
              if (childToken && scopes && childToken.scopes) {
                return scopes.length === 0 || childToken.scopes.filter(v => scopes.indexOf(v) !== -1).length > 0;
              }
              return true;
            });
            return children.length > 0;
          }
          return true;
        });
      let selectedToken = null;
      if (tokens.length > this.props.nbCollapsed) {
        tokens = tokens.slice(0, this.props.nbCollapsed);
        tokens.push('extend');
      }
      if (tokens.length) {
        if (!selectedToken || tokens.indexOf(selectedToken) === -1) {
          selectedToken = tokens[0];
        }
        this.openPopper();
      }
      this.setState({
        selectedToken,
        tokens,
        tokensExtended: false,
        categories:     [],
      });
    }
    this.props.onFocus();
  };

  handleChange = (event) => {
    let { selectedToken } = this.state;
    const { scopes } = this.props;
    const value = event.currentTarget.value;
    const match = value.match(/ ?([-a-z:]+)$/i);
    let tokens = [];
    const keyword = '';
    if (value === '') {
      this.setState({
        value
      });
      this.handleAllTokens();
      return true;
    }
    if (match) {
      const regexp = new RegExp(match[1], 'i');
      tokens = this.props.tokenTypes.filter((token) => {
        if (token.label) {
          return token.label.match(regexp);
        }
        return token.id.match(regexp);
      }
      ).filter((token) => {
        if (token && token.allowDuplicate !== true) {
          if (this.props.currentValue.find(e => e.type === token.id)) {
            return false;
          }
        }
        if (token && scopes && token.scopes) {
          return scopes.length === 0 || token.scopes.filter(v => scopes.indexOf(v) !== -1).length > 0;
        }
        return true;
      }).map(t => ({
        label: t.label || t.id,
        token: t.id,
      })).sort((a, b) => {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        return 0;
      });
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
    this.props.onChange(this.state.tokenKey, value);
    this.setState({
      value,
      tokens,
      keyword,
      selectedToken,
    });
    return true;
  };

  handleAllTokens = () => {
    this.props.cancelBlur();
    const { scopes } = this.props;
    const tokens = this.props.menuStructure
      .filter((menu) => {
        const token = this.props.tokenTypes.find(t => t.id === menu.token);
        if (token && token.allowDuplicate !== true) {
          if (this.props.currentValue.find(e => e.type === token.id)) {
            return false;
          }
        }
        if (token && scopes && token.scopes) {
          return scopes.length === 0 || token.scopes.filter(v => scopes.indexOf(v) !== -1).length > 0;
        }
        if (menu.children) {
          if (menu.scope && scopes.length && scopes.find(v => v === menu.scope) === undefined) {
            return false;
          }
          return menu.children.filter((child) => {
            const childToken = this.props.tokenTypes.find(t => t.id === child.token);
            if (childToken && childToken.allowDuplicate !== true) {
              if (this.props.currentValue.find(e => e.type === childToken.id)) {
                return false;
              }
            }
            if (childToken && scopes && childToken.scopes) {
              return scopes.length === 0 || childToken.scopes.filter(v => scopes.indexOf(v) !== -1).length > 0;
            }
            return true;
          }).length > 0;
        }
        return true;
      });
    this.setState({
      tokens,
      tokensExtended: true,
    });
  };

  handleKeyDown = (e) => {
    const {
      selectedToken,
      selectLevel,
      subSelected,
      tokens,
    } = this.state;
    if (this.state.tokens.length > 0) {
      let index = 0;
      if (['ArrowDown', 'ArrowUp'].indexOf(e.key) !== -1) {
        if (selectLevel === 0) {
          index = tokens.findIndex(token => token === selectedToken);
        } else if (selectedToken.children) {
          index = selectedToken.children.findIndex(token => token === subSelected);
        }
      }
      switch (e.key) {
        case 'ArrowDown':
          if (selectLevel === 0) {
            if (index < tokens.length - 1) {
              this.setState({
                selectedToken: tokens[index + 1]
              });
            }
          } else if (index < selectedToken.children.length - 1) {
            this.setState({
              subSelected: selectedToken.children[index + 1]
            });
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        case 'ArrowUp':
          if (index > 0) {
            if (selectLevel === 0) {
              this.setState({
                selectedToken: tokens[index - 1]
              });
            } else {
              this.setState({
                subSelected: selectedToken.children[index - 1]
              });
            }
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        case 'ArrowRight':
          if (selectLevel === 0 && selectedToken.children) {
            this.selectCategory(selectedToken.children);
            e.preventDefault();
            e.stopPropagation();
          }
          return false;
        case 'ArrowLeft':
          if (selectLevel === 1) {
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
          } else if (selectLevel === 1 && tokens[index].children) {
            const token = this.props.tokenTypes.find(t => t.id === subSelected.token);
            if (token) {
              const scope = selectedToken.scope || undefined;
              this.selectToken(token, scope);
            }
          } else {
            const token = this.props.tokenTypes.find(t => t.id === selectedToken.token);
            if (token) {
              this.selectToken(token);
            }
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        case 'Enter':
        case ' ':
          e.preventDefault();
          e.stopPropagation();
          if (selectedToken === 'extend') {
            this.handleAllTokens();
          } else if (selectLevel === 0 && selectedToken.children) {
            this.selectCategory(selectedToken.children);
          } else if (selectLevel === 1 && selectedToken.children) {
            const token = this.props.tokenTypes.find(t => t.id === subSelected.token);
            if (token) {
              const scope = selectedToken.scope || undefined;
              this.selectToken(token, scope);
            }
          } else {
            const token = this.props.tokenTypes.find(t => t.id === selectedToken.token);
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

  selectCategory(children) {
    const subSelected = children[0];
    this.setState({
      selectLevel: 1,
      subSelected,
    });
  }

  renderTokens() {
    if (this.props.showTokensOnFocus && this.state.value === '') {
      return this.renderAllTokens();
    }
    const { keyword, selectedToken } = this.state;
    if (this.state.tokens.length === 0) {
      return null;
    }
    return (
      <div className={classNames(styles['dp-select'], 'dp-select')}>
        <div className="dp-select__content">
          <Scrollbar>
            <List className="dp-selectable-list">
              {this.state.tokens.map((menu) => {
                const selected = (selectedToken === menu) ? styles.selected : '';
                const token = this.props.tokenTypes.find(t => t.id === menu.token);
                const label = token.label ? token.label : token.id;
                return (
                  <ListElement
                    key={token.id}
                    onClick={() => this.selectToken(token)}
                    className={classNames(styles['token-suggestion'], selected)}
                    title={token.description}
                  >
                    <Highlighter
                      highlightClassName={styles.highlight}
                      searchWords={[keyword]}
                      textToHighlight={label}
                    />
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
    const { selectedToken, subSelected, selectLevel } = this.state;
    const { scopes } = this.props;
    return (
      <div className={classNames(styles['dp-select__all-tokens'], 'dp-select')}>
        <div className="dp-select__content">
          <List className="dp-selectable-list">
            {this.state.tokens.reduce((result, menu) => {
              if (menu === 'extend') {
                result.push(
                  <ListElement
                    onClick={this.handleAllTokens}
                    className={classNames(styles['extend-tokens'], { selected: selectedToken === 'extend' })}
                  >
                    <Icon name={faCaretDown} />
                  </ListElement>
                );
                return result;
              }
              if (menu.children) {
                const menuScope = menu.scope || undefined;
                const selected = (selectedToken === menu) ? styles.selected : '';
                result.push(
                  <ListElement
                    key={menu.label}
                    className={classNames(styles['token-suggestion'], styles.category, selected)}
                  >
                    {menu.label} <Icon name={faCaretRight} />
                    <List className={classNames(styles['token-subcategory'], 'dp-selectable-list')}>
                      {menu.children
                        .filter((child) => {
                          const childToken = this.props.tokenTypes.find(t => t.id === child.token);
                          if (childToken && childToken.allowDuplicate !== true) {
                            if (this.props.currentValue.find(e => e.type === childToken.id)) {
                              return false;
                            }
                          }
                          if (childToken && scopes && childToken.scopes) {
                            return scopes.length === 0
                              || childToken.scopes.filter(v => scopes.indexOf(v) !== -1).length > 0;
                          }
                          return true;
                        })
                        .reduce((childResult, child) => {
                          const token = this.props.tokenTypes.find(t => t.id === child.token);
                          if (!token) {
                            return childResult;
                          }
                          const childLabel = token.label ? token.label : token.id;
                          const childSelect = (selectLevel === 1 && subSelected === child) ? styles.selected : '';
                          childResult.push(
                            <ListElement
                              key={token.id}
                              onClick={() => this.selectToken(token, menuScope)}
                              className={classNames(styles['token-suggestion'], childSelect)}
                              title={token.description}
                            >
                              {childLabel}
                            </ListElement>
                          );
                          return childResult;
                        }, [])
                      }
                    </List>
                  </ListElement>
                );
                return result;
              }
              const token = this.props.tokenTypes.find(t => t.id === menu.token);
              if (!token) {
                return result;
              }
              const selected = (menu === selectedToken) ? styles.selected : '';
              const label = token.label ? token.label : token.id;
              result.push(
                <ListElement
                  key={token.id}
                  onClick={() => this.selectToken(token)}
                  className={classNames(styles['token-suggestion'], selected)}
                  title={token.description}
                >
                  {label}
                </ListElement>
              );
              return result;
            }, [])}
          </List>
        </div>
      </div>
    );
  }

  render() {
    const { value, popupOpen } = this.state;
    const { isOpen } = this.props;
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
          popupOpen || isOpen ?
            <div className="token-field__popup">
              {this.renderTokens()}
            </div> : null
        }
      </Tether>
    );
  }
}
