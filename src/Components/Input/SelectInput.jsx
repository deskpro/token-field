import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Checkbox, Input, Icon, List, ListElement, Scrollbar } from '@deskpro/react-components';
import styles from 'styles/style.css';
import TokenInput from './TokenInput';

export default class SelectInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
      meta:  PropTypes.array,
    }).isRequired,
    label:      PropTypes.string.isRequired,
    dataSource: PropTypes.shape({
      getOptions:  PropTypes.oneOfType([PropTypes.func, PropTypes.array]).isRequired,
      findOptions: PropTypes.func,
    }).isRequired,
    isMultiple:          PropTypes.bool,
    className:           PropTypes.string,
    onChange:            PropTypes.func,
    selectPreviousToken: PropTypes.func.isRequired,
    selectNextToken:     PropTypes.func.isRequired,
    renderHeader:        PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    renderItem:   PropTypes.func,
    renderFooter: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    showSearch:            PropTypes.bool,
    selectionsTranslation: PropTypes.string,
    removeToken:           PropTypes.func.isRequired,
    zIndex:                PropTypes.number,
  };

  static defaultProps = {
    className:             '',
    onChange() {},
    isMultiple:            false,
    renderHeader:          null,
    renderItem:            null,
    renderFooter:          null,
    showSearch:            true,
    selectionsTranslation: 'selections',
    zIndex:                100
  };

  constructor(props) {
    super(props);

    this.optionsLoaded = false;

    let loading = true;
    let options = [];
    if (props.token.meta) {
      options = props.token.meta;
      loading = false;
    }

    this.state = {
      value:          props.token.value,
      selectedOption: null,
      options,
      loading,
      filter:         '',
    };

    if (!props.token.meta) {
      this.loadOptions();
    }

    this.cx = classNames.bind(styles);
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  }

  onFocus = () => {
    if (this.props.showSearch && this.searchInput) {
      this.searchInput.focus();
    }
    window.document.addEventListener('keydown', this.handleKeyDown);
  };

  onBlur = () => {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  };

  getOptions = (filter = '') => {
    const { dataSource } = this.props;
    if (this.props.dataSource.getOptions instanceof Function) {
      return Promise.resolve(dataSource.getOptions(filter));
    }
    return new Promise(((resolve) => {
      resolve(dataSource.getOptions);
    }));
  };

  static getLabel(option) {
    if (option.label) {
      return option.label;
    }
    if (option.title) {
      return option.title;
    }
    if (option.name) {
      return option.name;
    }
    if (option.id) {
      return option.id;
    }
    return option.value;
  }

  static getIcon(option) {
    if (typeof option.icon === 'string') {
      return [<Icon key="icon" name={option.icon} />, <span key="space">&nbsp;</span>];
    }
    return null;
  }

  loadOptions = () => {
    if (this.optionsLoaded) {
      return false;
    }
    this.optionsLoaded = true;
    this.setState({
      loading: true
    });
    this.getOptions().then((result) => {
      this.setState({
        options: result,
        loading: false,
      });
    });
    return true;
  };

  focus = () => {
    this.tokenInput.focus();
  };

  handleChange = (option) => {
    const value = option.id || option.value;
    this.setState({
      value,
      filter: ''
    });
    this.props.onChange(value);
    this.tokenInput.disableEditMode();
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        const { options } = this.state;
        const index = options.findIndex(option => option === this.state.selectedOption);
        if (e.key === 'ArrowDown' && index < options.length - 1) {
          this.setState({
            selectedOption: options[index + 1]
          });
        }
        if (e.key === 'ArrowUp' && index > 0) {
          this.setState({
            selectedOption: options[index - 1]
          });
        }
        break;
      }
      case 'Escape':
        this.setState({
          value: this.props.token.value
        });
        this.tokenInput.disableEditMode();
        break;
      case 'Tab':
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.handleChange(this.state.selectedOption);
          this.props.selectNextToken();
        }
        this.tokenInput.disableEditMode();
        break;
      case ' ':
      case 'Enter':
        this.handleChange(this.state.selectedOption);
        this.props.selectNextToken();
        break;
      default:
        return true;
    }
    e.stopPropagation();
    e.preventDefault();
    return true;
  };

  handleChangeMultiple = (checked, value) => {
    const values = this.state.value;
    if (checked) {
      values.push(value);
    } else {
      const index = values.indexOf(value);
      values.splice(index, 1);
    }
    this.setState({
      value: values
    });
  };

  handleFilter = (filter) => {
    let { selectedOption } = this.state;
    this.setState({
      filter,
      loading: true
    });
    this.getOptions(filter).then((result) => {
      const options = result.filter(option => filter === ''
        || SelectInput.getLabel(option).toLowerCase().indexOf(filter.toLowerCase()) !== -1);
      if (options.length) {
        if (!selectedOption || options.indexOf(selectedOption) === -1) {
          selectedOption = options[0];
        }
      } else {
        selectedOption = null;
      }
      this.setState({
        options,
        selectedOption,
        loading: false,
      });
    });
  };

  renderInput = () => {
    const { isMultiple, showSearch } = this.props;
    return (
      <div className="dp-select">
        <div className="dp-select__content">
          <Scrollbar>
            <List className="dp-selectable-list">
              { showSearch ?
                <Input
                  name="search"
                  icon="search"
                  value={this.state.filter}
                  ref={(c) => { this.searchInput = c; }}
                  onChange={this.handleFilter}
                />
                : null }
              {this.renderHeader()}
              {isMultiple ? this.renderMultipleOptions() : this.renderOptions()}
              {this.renderFooter()}
            </List>
          </Scrollbar>
        </div>
      </div>
    );
  };

  renderValue = () => {
    let value;
    if (this.props.isMultiple) {
      if (this.state.value.length > 1) {
        return `${this.state.value.length} ${this.props.selectionsTranslation}`;
      }
      value = this.state.value[0];
    } else {
      value = this.state.value;
    }
    const { options } = this.state;
    const valueOption = options.find((option) => {
      if (option.id) {
        return option.id === value;
      }
      return option.value === value;
    });
    if (!valueOption) {
      return '________';
    }
    return this.renderItem(valueOption);
  };

  renderHeader = () => {
    const { renderHeader } = this.props;
    if (typeof renderHeader === 'function') {
      return renderHeader();
    }
    return renderHeader;
  };

  renderLoading = () => <ListElement className={styles.loading}><Icon name="spinner" size="large" spin /></ListElement>;


  renderOptions = () => {
    const { value, selectedOption, options, loading } = this.state;
    if (loading) {
      return this.renderLoading();
    }
    return (
      options.map((option) => {
        const key = option.id || option.value;
        const currentValue = key === value ? styles['current-value'] : '';
        const selected = option === selectedOption ? styles.selected : '';
        return (
          <ListElement
            key={key}
            className={this.cx(currentValue, selected, 'option')}
            onClick={() => this.handleChange(option)}
          >
            {this.renderItem(option)}
          </ListElement>
        );
      }));
  };

  renderItem = (option) => {
    if (this.props.renderItem) {
      return this.props.renderItem(option);
    }
    return (
      <span>
        {SelectInput.getIcon(option)}
        {SelectInput.getLabel(option)}
      </span>
    );
  };

  renderMultipleOptions() {
    const { filter, value, loading } = this.state;
    let options;
    if (loading) {
      return this.renderLoading();
    }
    if (this.props.dataSource.getOptions instanceof Function) {
      options = this.props.dataSource.getOptions(filter);
    } else {
      options = this.props.dataSource.getOptions
        .filter(option => filter === ''
          || SelectInput.getLabel(option).toLowerCase().indexOf(filter.toLowerCase()) !== -1);
    }
    return (options
      .map((option) => {
        const key = option.id || option.value;
        const checked = value.indexOf(key) !== -1;
        return (
          <ListElement
            key={key}
            className={styles.option}
          >
            <Checkbox checked={checked} value={key} onChange={this.handleChangeMultiple}>
              {this.renderItem(option)}
            </Checkbox>
          </ListElement>
        );
      }));
  }

  renderFooter = () => {
    const { renderFooter } = this.props;
    if (typeof renderFooter === 'function') {
      return renderFooter();
    }
    return renderFooter;
  };

  render() {
    const { token, label, className, removeToken, zIndex } = this.props;
    return (
      <TokenInput
        ref={(c) => { this.tokenInput = c; }}
        className={className}
        type={token.type}
        label={label}
        renderInput={this.renderInput}
        renderValue={this.renderValue}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        loadData={this.loadOptions}
        removeToken={removeToken}
        zIndex={zIndex}
        detached
      />
    );
  }
}
