import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { Label, Input, List, ListElement } from '@deskpro/react-components';
import styles from 'styles/style.css';
import TokenInput from './TokenInput';

export default class DurationInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.object
    }).isRequired,
    locale:              PropTypes.string,
    className:           PropTypes.string,
    translations:        PropTypes.object,
    onChange:            PropTypes.func,
    selectPreviousToken: PropTypes.func.isRequired,
    selectNextToken:     PropTypes.func.isRequired,
    removeToken:         PropTypes.func.isRequired,
  };
  static defaultProps = {
    className:    '',
    onChange() {},
    locale:       'en-gb',
    translations: {
      custom:  'custom',
      to:      'to',
      minutes: 'Minutes',
      hours:   'Hours',
      days:    'Days',
      weeks:   'Weeks',
      months:  'Months',
      years:   'Years',
      back:    'Back',
    },
  };

  static getEmptyTimeObject() {
    return {
      minutes: '',
      hours:   '',
      days:    '',
      weeks:   '',
      months:  '',
      years:   '',
    };
  }

  constructor(props) {
    super(props);
    const value = props.token.value ? props.token.value : { time: null };
    const presets = this.getTimePresets();
    this.state = {
      value,
      selectedOption: presets[0],
      custom:         false,
    };
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  }

  onFocus = () => {
    window.document.addEventListener('keydown', this.handleKeyDown);
  };

  onBlur = () => {
    window.document.removeEventListener('keydown', this.handleKeyDown);
    this.props.onChange(this.state.value);
  };

  getTimePresets() {
    moment.locale(this.props.locale);
    return [
      {
        key:        '1h',
        label:      moment.duration(1, 'hours').humanize(),
        timeObject: {
          hours: 1
        }
      },
      {
        key:        '2h',
        label:      moment.duration(2, 'hours').humanize(),
        timeObject: {
          hours: 2
        }
      },
      {
        key:        '6h',
        label:      moment.duration(6, 'hours').humanize(),
        timeObject: {
          hours: 6
        }
      },
      {
        key:        '12h',
        label:      moment.duration(12, 'hours').humanize(),
        timeObject: {
          hours: 12
        }
      },
      {
        key:        '1d',
        label:      moment.duration(1, 'days').humanize(),
        timeObject: {
          days: 1
        }
      },
      {
        key:        '1w',
        label:      moment.duration(1, 'weeks').humanize(),
        timeObject: {
          weeks: 1
        }
      },
      {
        key:        '1m',
        label:      moment.duration(1, 'months').humanize(),
        timeObject: {
          months: 1
        }
      }
    ];
  }

  getTranslations() {
    return Object.assign(DurationInput.defaultProps.translations, this.props.translations);
  }

  getDisplayFromTimeObject(timeObject) {
    if (!timeObject) {
      return '________';
    }
    moment.locale(this.props.locale);
    const duration = moment.duration(timeObject);
    return duration.humanize();
  }

  getCustomInput() {
    const translations = this.getTranslations();
    const timeObject = Object.assign(DurationInput.getEmptyTimeObject(), this.state.value.time);
    return (
      <div className="dp-select">
        <div className="dp-select__content custom-list">
          <List>
            {['minutes', 'hours', 'days', 'weeks', 'months', 'years']
              .map(field => (
                <ListElement key={field}>
                  <Label>{translations[field]}</Label>
                  <Input
                    name={field}
                    value={timeObject[field]}
                    onChange={this.handleCustomChange}
                  />
                </ListElement>
              ))
            }
            <hr />
            <ListElement className="back" onClick={() => this.handleCustom(false)}>
              {translations.back}
            </ListElement>
          </List>
        </div>
      </div>
    );
  }

  focus = () => {
    this.tokenInput.focus();
  };

  handleChange(timeObject) {
    Object.assign(DurationInput.getEmptyTimeObject(), timeObject);
    const value = {
      inputType: 'relative',
      time:      timeObject,
      op:        '=',
    };
    this.setState({
      value,
    }, () => {
      this.tokenInput.disableEditMode();
    });
  }

  handleCustom(custom) {
    this.setState({
      custom
    });
  }

  handleCustomChange = (inputValue, name) => {
    const { value } = this.state;
    if (!value.time) {
      value.time = {};
    }
    value.time[name] = inputValue;
    value.inputType = 'relative';
    value.op = '=';
    this.setState({
      value
    });
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        const presets = this.getTimePresets();
        const index = presets.findIndex(preset => preset.key === this.state.selectedOption.key);
        if (e.key === 'ArrowDown' && index < presets.length - 1) {
          this.setState({
            selectedOption: presets[index + 1]
          });
        }
        if (e.key === 'ArrowUp' && index > 0) {
          this.setState({
            selectedOption: presets[index - 1]
          });
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        const value = this.props.token.value ? this.props.token.value : { time: null };
        this.setState({
          value,
        });
        this.tokenInput.disableEditMode();
        break;
      }
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.props.selectNextToken();
          this.handleChange(this.state.selectedOption.timeObject);
        }
        this.tokenInput.disableEditMode();
        break;
      case 'Enter':
        e.preventDefault();
        this.props.selectNextToken();
        this.handleChange(this.state.selectedOption.timeObject);
        break;
      default:
        return true;
    }
    return true;
  };

  renderPresets = () => {
    const { value, selectedOption } = this.state;
    const jsonTime = JSON.stringify(value.time);
    return this.getTimePresets().map((preset) => {
      const currentValue = JSON.stringify(preset.timeObject) === jsonTime ? styles['current-value'] : '';
      const selected = (preset.key === selectedOption.key) ? styles.selected : '';
      return (
        <ListElement
          key={preset.key}
          className={classNames(currentValue, selected)}
          onClick={() => this.handleChange(preset.timeObject)}
        >
          {preset.label}
        </ListElement>
      );
    });
  };

  renderInput = () => {
    const { custom } = this.state;
    if (custom) {
      return this.getCustomInput();
    }
    return (
      <div className="dp-select">
        <div className="dp-select__content">
          <List className="dp-selectable-list">
            {this.renderPresets()}
            <hr />
            <ListElement className="custom" onClick={() => this.handleCustom(true)}>
              custom
            </ListElement>
          </List>
        </div>
      </div>
    );
  };

  renderValue = () => {
    const translations = this.getTranslations();
    if (this.state.value.op === 'range') {
      const time = this.getDisplayFromTimeObject(this.state.value.time);
      const timeEnd = this.getDisplayFromTimeObject(this.state.value.timeEnd);
      return `${time} ${translations.to} ${timeEnd}`;
    }
    return this.getDisplayFromTimeObject(this.state.value.time);
  };

  render() {
    const { token, className, removeToken } = this.props;
    return (
      <TokenInput
        ref={(c) => { this.tokenInput = c; }}
        className={className}
        type={token.type}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        renderInput={this.renderInput}
        renderValue={this.renderValue}
        removeToken={removeToken}
      />
    );
  }
}
