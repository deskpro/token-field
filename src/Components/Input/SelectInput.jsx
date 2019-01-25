import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Checkbox, Input, Icon, List, ListElement, Scrollbar } from '@deskpro/react-components';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';

export default class SelectInput extends TokenInput {
  constructor(props) {
    super(props);
    this.detached = true;

    this.optionsLoaded = false;

    let loading = true;
    let options = [];
    if (props.token.meta) {
      options = props.token.meta;
      loading = false;
    }

    this.state = {
      ...this.state,
      selectedOption: null,
      options,
      loading,
      filter:         '',
    };

    if (!props.token.meta) {
      this.loadData();
    }

    this.cx = classNames.bind(styles);
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  }

  onFocus = () => {
    this.props.onFocus(this.props.tokenKey);
    if (this.props.showSearch && this.searchInput) {
      this.searchInput.focus();
    }
    window.document.addEventListener('keydown', this.handleKeyDown);
  };

  onBlur = () => {
    this.props.onBlur();
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

  static getContent(option) {
    if (option.content) {
      return option.content;
    }
    return SelectInput.getLabel(option);
  }

  static getIcon(option) {
    if (typeof option.icon === 'string') {
      return [<Icon key="icon" name={option.icon} />, <span key="space">&nbsp;</span>];
    }
    return null;
  }

  loadData = () => {
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

  handleChange = (option) => {
    let value;
    if (option) {
      value = option.id || option.value;
    } else {
      value = null;
    }
    this.setState({
      value,
      filter: ''
    });
    this.props.onChange(value);
    this.disableEditMode();
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
        this.checkScroll(e.key);
        break;
      }
      case 'Escape':
        this.setState({
          value: this.props.token.value
        });
        this.disableEditMode();
        break;
      case 'Tab':
        if (this.props.isMultiple) {
          this.props.onChange(this.state.value);
        } else {
          this.handleChange(this.state.selectedOption);
        }
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.props.selectNextToken();
        }
        this.disableEditMode();
        break;
      case ' ':
      case 'Enter':
        if (this.props.isMultiple) {
          const { selectedOption, value } = this.state;
          const key = selectedOption.id || selectedOption.value;
          let checked = false;
          if (value) {
            checked = value.indexOf(key) !== -1;
          }
          if (!checked || e.key === ' ') {
            this.handleChangeMultiple(!checked, key);
          }
          if (e.key === 'Enter') {
            if (this.props.isMultiple) {
              this.props.onChange(this.state.value);
            } else {
              this.handleChange(this.state.selectedOption);
            }
            this.disableEditMode();
            this.props.selectNextToken();
          }
        } else {
          this.handleChange(this.state.selectedOption);
          this.props.selectNextToken();
        }
        break;
      default:
        return true;
    }
    e.stopPropagation();
    e.preventDefault();
    return true;
  };

  handleChangeMultiple = (checked, value) => {
    let values = this.state.value;
    if (!values) {
      values = [];
    }
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
        || SelectInput.getContent(option).toLowerCase().indexOf(filter.toLowerCase()) !== -1);
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

  checkScroll = (key) => {
    if (this.selected) {
      const scrollZone = this.list.parentElement.getBoundingClientRect();
      const selected = this.selected.getBoundingClientRect();
      if (key === 'ArrowUp' && this.selected.offsetTop < this.list.parentElement.scrollTop) {
        this.list.parentElement.scrollTop = this.selected.offsetTop - selected.height;
      }
      if (key === 'ArrowDown'
        && (this.selected.offsetTop > (this.list.parentElement.scrollTop + scrollZone.height - selected.height))
      ) {
        this.list.parentElement.scrollTop = this.selected.offsetTop - scrollZone.height + selected.height;
      }
    }
  };

  renderInput = () => {
    const { isMultiple, showSearch } = this.props;
    return (
      <div className={classNames(styles.select, 'dp-select')}>
        <div className="dp-select__content">
          <Scrollbar autoHide>
            <List className="dp-selectable-list" ref={(c) => { this.list = c; }}>
              { showSearch ?
                <Input
                  name="search"
                  icon={faSearch}
                  className={classNames(styles['select-input'])}
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
    if (this.props.isMultiple && this.state.value) {
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

  renderLoading = () => (
    <ListElement className={styles.loading}>
      <Icon name={faSpinner} size="large" spin />
    </ListElement>
  );

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
            ref={(c) => { if (selected) { this.selected = c; } }}
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
    const { value, loading, options, selectedOption } = this.state;
    if (loading) {
      return this.renderLoading();
    }
    return (
      options.map((option) => {
        const key = option.id || option.value;
        const selected = option === selectedOption ? styles.selected : '';
        let checked = false;
        if (value) {
          checked = value.indexOf(key) !== -1;
        }
        return (
          <ListElement
            key={key}
            className={this.cx(styles.option, selected, 'option')}
            ref={(c) => { if (selected) { this.selected = c; } }}
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
}

SelectInput.propTypes = {
  ...TokenInput.propTypes,
  token: PropTypes.shape({
    type:  PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    meta:  PropTypes.array,
  }).isRequired,
  dataSource: PropTypes.shape({
    getOptions:  PropTypes.oneOfType([PropTypes.func, PropTypes.array]).isRequired,
    findOptions: PropTypes.func,
  }).isRequired,
  isMultiple:   PropTypes.bool,
  renderHeader: PropTypes.oneOfType([
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
};

SelectInput.defaultProps = {
  ...TokenInput.defaultProps,
  isMultiple:            false,
  renderHeader:          null,
  renderItem:            null,
  renderFooter:          null,
  showSearch:            true,
  selectionsTranslation: 'selections',
};
