import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Input } from 'deskpro-components/lib/Components/Forms';
import Icon from 'deskpro-components/lib/Components/Icon';
import { List, ListElement, Scrollbar } from 'deskpro-components/lib/Components/Common';
import TokenInput from './TokenInput';

export default class SelectInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    }).isRequired,
    dataSource: PropTypes.shape({
      getOptions:  PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
      findOptions: PropTypes.func,
    }).isRequired,
    isMultiple:   PropTypes.bool,
    className:    PropTypes.string,
    renderHeader: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
      PropTypes.string,
    ]),
    renderItem:   PropTypes.func,
    renderFooter: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
      PropTypes.string,
    ]),
    showSearch:            PropTypes.bool,
    selectionsTranslation: PropTypes.string,
  };

  static defaultProps = {
    className:             '',
    isMultiple:            false,
    renderHeader:          null,
    renderItem:            null,
    renderFooter:          null,
    showSearch:            true,
    selectionsTranslation: 'selections'
  };

  static getIcon(option) {
    if (typeof option.icon === 'string') {
      return <Icon name={option.icon} />;
    }
    return null;
  }

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

  constructor(props) {
    super(props);
    this.state = {
      value:  props.token.value,
      filter: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeMultiple = this.handleChangeMultiple.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.getInput = this.getInput.bind(this);
    this.getValue = this.getValue.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  getInput() {
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
  }

  getValue() {
    const { getOptions, findOptions } = this.props.dataSource;
    let valueOption;
    let value;
    if (this.props.isMultiple) {
      if (this.state.value.length > 1) {
        return `${this.state.value.length} ${this.props.selectionsTranslation}`;
      }
      value = this.state.value[0];
    } else {
      value = this.state.value;
    }
    if (findOptions) {
      valueOption = findOptions(value);
    } else {
      valueOption = getOptions.find((option) => {
        if (option.id) {
          return option.id === value;
        }
        return option.value === value;
      });
    }
    if (!valueOption) {
      return '________';
    }
    if (this.props.renderItem) {
      return this.props.renderItem(valueOption);
    }
    return this.renderItem(valueOption);
  }

  handleChange(option) {
    const value = option.id || option.value;
    console.log(value);
    this.setState({
      value,
      filter: ''
    });
    this.tokenInput.disableEditMode();
  }

  handleChangeMultiple(checked, value) {
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
  }

  handleFilter(filter) {
    this.setState({
      filter
    });
  }

  renderHeader() {
    const { renderHeader } = this.props;
    if (typeof renderHeader === 'function') {
      return renderHeader();
    }
    return renderHeader;
  }

  renderOptions() {
    const { getOptions } = this.props.dataSource;
    const { filter, value } = this.state;
    return (getOptions
      .filter(option => filter === ''
        || SelectInput.getLabel(option).toLowerCase().indexOf(filter.toLowerCase()) !== -1)
      .map((option) => {
        const key = option.id || option.value;
        const selected = key === value ? 'dp-selectable-list--selected' : '';
        return (
          <ListElement
            key={key}
            className={selected}
            onClick={() => this.handleChange(option)}
          >
            {this.renderItem(option)}
          </ListElement>
        );
      }));
  }

  renderItem(option) {
    if (this.props.renderItem) {
      return this.props.renderItem(option);
    }
    return (
      <span>
        {SelectInput.getIcon(option)}
        {SelectInput.getLabel(option)}
      </span>
    );
  }

  renderMultipleOptions() {
    const { getOptions } = this.props.dataSource;
    const { filter, value } = this.state;
    return (getOptions
      .filter(option => filter === ''
        || SelectInput.getLabel(option).toLowerCase().indexOf(filter.toLowerCase()) !== -1)
      .map((option) => {
        const key = option.id || option.value;
        const checked = value.indexOf(key) !== -1;
        return (
          <ListElement
            key={key}
          >
            <Checkbox checked={checked} value={key} onChange={this.handleChangeMultiple}>
              {this.renderItem(option)}
            </Checkbox>
          </ListElement>
        );
      }));
  }

  renderFooter() {
    const { renderFooter } = this.props;
    if (typeof renderFooter === 'function') {
      return renderFooter();
    }
    return renderFooter;
  }

  render() {
    const { token, className } = this.props;
    return (
      <TokenInput
        ref={(c) => { this.tokenInput = c; }}
        className={className}
        type={token.type}
        getInput={this.getInput}
        getValue={this.getValue}
        focusInput={this.focusInput}
      />
    );
  }
}
