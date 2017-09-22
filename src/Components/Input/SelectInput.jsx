import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'deskpro-components/lib/Components/Forms';
import { List, ListElement, Scrollbar } from 'deskpro-components/lib/Components/Common';
import TokenInput from './TokenInput';

export default class SelectInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    dataSource: PropTypes.shape({
      getOptions:  PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
      findOptions: PropTypes.func,
    }).isRequired,
    isMultiple: PropTypes.bool,
    className:  PropTypes.string,
  };
  static defaultProps = {
    className:  '',
    isMultiple: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value:  props.token.value,
      filter: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.getInput = this.getInput.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  getInput() {
    const { getOptions } = this.props.dataSource;
    const { filter, value } = this.state;
    return (
      <div className="dp-select">
        <div className="dp-select__content">
          <Scrollbar>
            <List className="dp-selectable-list">
              <Input
                name="search"
                icon="search"
                value={this.state.filter}
                onChange={this.handleFilter}
              />
              { getOptions
                .filter(option => filter === '' || option.label.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
                .map((option) => {
                  const key = option.id || option.value;
                  const selected = key === value ? 'dp-selectable-list--selected' : '';
                  return (
                    <ListElement
                      key={key}
                      className={selected}
                      onClick={() => this.handleChange(option)}
                    >
                      {option.label}
                    </ListElement>
                  );
                })}
            </List>
          </Scrollbar>
        </div>
      </div>
    );
  }

  getValue() {
    const { getOptions, findOptions } = this.props.dataSource;
    let valueOption;
    if (findOptions) {
      valueOption = findOptions(this.state.value);
    } else {
      valueOption = getOptions.find((option) => {
        if (option.id) {
          return option.id === this.state.value;
        }
        return option.value === this.state.value;
      });
    }
    if (!valueOption) {
      return '________';
    }
    if (valueOption.label) {
      return valueOption.label;
    }
    if (valueOption.id) {
      return valueOption.id;
    }
    return valueOption.value;
  }

  handleChange(option) {
    this.setState({
      value:  option.id || option.value,
      filter: ''
    });
    this.tokenInput.disableEditMode();
  }

  handleFilter(filter) {
    this.setState({
      filter
    });
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