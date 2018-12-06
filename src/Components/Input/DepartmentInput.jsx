import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Immutable from 'immutable';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Checkbox, Input, Icon, List, ListElement, Scrollbar } from '@deskpro/react-components';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';

export default class DepartmentInput extends TokenInput {
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
    this.props.onFocus();
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
    return option.get('title');
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
        const departments = options.toArray();
        const index = departments.findIndex(option => option[1] === this.state.selectedOption);
        if (e.key === 'ArrowDown' && index < departments.length - 1) {
          this.setState({
            selectedOption: departments[index + 1][1]
          });
        }
        if (e.key === 'ArrowUp' && index > 0) {
          this.setState({
            selectedOption: departments[index - 1][1]
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
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.handleChange(this.state.selectedOption);
          this.props.selectNextToken();
        }
        this.disableEditMode();
        break;
      case ' ':
      case 'Enter': {
        const { selectedOption, value } = this.state;
        console.log(selectedOption);
        const key = selectedOption.get('id');
        let checked = false;
        if (value) {
          checked = value.indexOf(key) !== -1;
        }
        this.onCheckboxChange(!checked, key, selectedOption);
        if (e.key === 'Enter') {
          this.disableEditMode();
          this.props.selectNextToken();
        }
        break;
      }
      default:
        return true;
    }
    e.stopPropagation();
    e.preventDefault();
    return true;
  };

  onCheckboxChange = (checked, value, department) => {
    const selectedDepartments = new Set(this.state.value);
    if (checked) {
      selectedDepartments.add(value);
      department.get('children').forEach(child => selectedDepartments.add(child));
      if (department.get('parent')) {
        const parent = this.state.options.get(department.get('parent'));
        if (parent && parent.get('children').filter(child => !selectedDepartments.has(child)).size === 0) {
          selectedDepartments.add(parent.get('id'));
        }
      }
    } else {
      selectedDepartments.delete(value);
      department.get('children').forEach(child => selectedDepartments.delete(child));
      if (department.get('parent')) {
        selectedDepartments.delete(department.get('parent'));
      }
    }
    this.setState({
      value: Array.from(selectedDepartments)
    });
    this.forceUpdate();
  };

  handleFilter = (filter) => {
    let { selectedOption } = this.state;
    this.setState({
      filter,
      loading: true
    });
    this.getOptions(filter).then((result) => {
      const options = result.filter(option => filter === ''
        || DepartmentInput.getLabel(option).toLowerCase().indexOf(filter.toLowerCase()) !== -1);
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
    const { showSearch } = this.props;
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
              {this.renderMultipleOptions()}
              {this.renderFooter()}
            </List>
          </Scrollbar>
        </div>
      </div>
    );
  };

  renderValue = () => {
    let value;
    if (this.state.value) {
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

  renderItem = (option) => {
    if (this.props.renderItem) {
      return this.props.renderItem(option);
    }

    const rootOption = option.get('parent') === null ? styles.root_option : '';
    return (
      <span className={this.cx(rootOption)}>
        {DepartmentInput.getLabel(option)}
      </span>
    );
  };

  renderMultipleOptions() {
    const { value, loading, options, selectedOption } = this.state;
    if (loading) {
      return this.renderLoading();
    }
    return (
      options.toArray().map((dep) => {
        const option = dep[1];
        const key = option.get('id');
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
            <Checkbox checked={checked} value={key} onChange={(c, v) => this.onCheckboxChange(c, v, option)}>
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

DepartmentInput.propTypes = {
  ...TokenInput.propTypes,
  token: PropTypes.shape({
    type:  PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    meta:  PropTypes.array,
  }).isRequired,
  dataSource: PropTypes.shape({
    getOptions:  PropTypes.instanceOf(Immutable.Map).isRequired,
    findOptions: PropTypes.func,
  }).isRequired,
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

DepartmentInput.defaultProps = {
  ...TokenInput.defaultProps,
  renderHeader:          null,
  renderItem:            null,
  renderFooter:          null,
  showSearch:            true,
  selectionsTranslation: 'selections',
};
