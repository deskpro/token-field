import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Immutable from 'immutable';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Icon, List, ListElement, Select } from '@deskpro/react-components';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';

export default class SlaStatusInput extends TokenInput {
  constructor(props) {
    super(props);
    this.detached = true;

    this.optionsLoaded = false;

    let loading = true;
    let options = new Immutable.List();
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
      inputFocus:     0,
    };

    this.inputs = [];

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
    if (this.inputs[0]) {
      this.inputs[0].focus();
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
    const { translations } = this.props;
    this.optionsLoaded = true;
    this.setState({
      loading: true
    });
    this.getOptions().then((result) => {
      this.setState({
        options: result.unshift(new Immutable.Map({
          id:    'any',
          title: translations.any
        })),
        loading: false,
      });
    });
    return true;
  };

  handleChange = (value) => {
    this.props.onChange(value);
    this.disableEditMode();
  };

  handleKeyDown = (e) => {
    const { inputFocus } = this.state;
    switch (e.key) {
      case 'Escape':
        this.setState({
          value: this.props.token.value
        });
        this.disableEditMode();
        break;
      case 'Tab':
        if (e.shiftKey) {
          switch (inputFocus) {
            case 0:
            default: {
              this.props.selectPreviousToken();
              break;
            }
          }
        }
        break;
      default:
        return true;
    }
    e.stopPropagation();
    e.preventDefault();
    return true;
  };

  renderInput = () => {
    const { translations } = this.props;
    const { op = null, slaStatus = null, slaId = null } = this.state.value || {};
    return (
      <div className={classNames(styles.select, 'dp-select')}>
        <div className={classNames(styles.sla_status, 'dp-select__content')}>
          <List className="dp-selectable-list" ref={(c) => { this.list = c; }}>
            {`${translations.sla_status} `}
            <Select
              name="op"
              options={[
                { value: 'is', label: translations.is },
                { value: 'isNot', label: translations.isNot }
              ]}
              onChange={value => this.updateValue(value, 'op', 0)}
              value={op}
              ref={(c) => { this.inputs[0] = c; }}
            />
            <br />
            <Select
              name="slaStatus"
              options={[
                { value: 'ok', label: translations.ok },
                { value: 'warning', label: translations.warning },
                { value: 'fail', label: translations.fail }
              ]}
              onChange={value => this.updateValue(value, 'slaStatus', 1)}
              value={slaStatus}
              ref={(c) => { this.inputs[1] = c; }}
            />
            {` ${translations.on} `}
            <Select
              name="slaId"
              options={this.state.options.toArray().map(sla => ({
                value: sla.get('id'),
                label: sla.get('title')
              }))}
              onChange={value => this.updateValue(value, 'slaId', 2)}
              value={slaId}
              ref={(c) => { this.inputs[2] = c; }}
            />
          </List>
        </div>
      </div>
    );
  };

  renderValue = () => {
    const { options, value } = this.state;
    const { translations } = this.props;
    if (value) {
      const valueOption = options.find(option => option.get('id') === value.slaId);
      if (valueOption) {
        return `${translations[value.op]} ${translations[value.slaStatus]} ${translations.on}
         ${valueOption.get('title')}`;
      }
    }
    return '________';
  };

  updateValue = (newValue, field, index) => {
    console.log('updateValue');
    const { value = {} } = this.state;
    value[field] = newValue.value;
    this.setState({
      value,
      inputFocus: index + 1
    });
    if (index < 2 && this.inputs[index + 1]) {
      this.inputs[index + 1].focus();
    }
    if (index === 2) {
      this.handleChange(this.state.value);
      this.props.selectNextToken();
    }
  };

  renderLoading = () => (
    <ListElement className={styles.loading}>
      <Icon name={faSpinner} size="large" spin />
    </ListElement>
  );
}

SlaStatusInput.propTypes = {
  ...TokenInput.propTypes,
  token: PropTypes.shape({
    type:  PropTypes.string,
    value: PropTypes.shape({
      slaStatus: PropTypes.oneOf(['ok', 'warning', 'fail']),
      slaId:     PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      op:        PropTypes.oneOf(['is', 'isNot']),
    }),
    meta: PropTypes.array,
  }).isRequired,
  dataSource: PropTypes.shape({
    getOptions:  PropTypes.instanceOf(Immutable.List).isRequired,
    findOptions: PropTypes.func,
  }).isRequired,
  translations: PropTypes.shape({
    any:        PropTypes.string,
    is:         PropTypes.string,
    isNot:      PropTypes.string,
    ok:         PropTypes.string,
    warning:    PropTypes.string,
    fail:       PropTypes.string,
    sla_status: PropTypes.string,
  }),
};

SlaStatusInput.defaultProps = {
  ...TokenInput.defaultProps,
  translations: {
    any:        'Any SLA',
    is:         'is',
    isNot:      'is not',
    ok:         'OK',
    on:         'on',
    warning:    'Warning',
    fail:       'Fail',
    sla_status: 'Sla status'
  },
};
