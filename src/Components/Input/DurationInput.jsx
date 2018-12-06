import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { Label, Input, List, ListElement } from '@deskpro/react-components';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';

export default class DurationInput extends TokenInput {
  constructor(props) {
    super(props);
    this.detached = true;
    const value = props.token.value ? props.token.value : { time: null };
    const presets = this.getTimePresets();
    this.state = {
      ...this.state,
      value,
      selectedOption: presets[0],
      custom:         false,
    };
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  }

  onFocus = () => {
    this.props.onFocus();
    window.document.addEventListener('keydown', this.handleKeyDown);
  };

  onBlur = () => {
    this.props.onBlur();
    window.document.removeEventListener('keydown', this.handleKeyDown);
    this.props.onChange(this.state.value);
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
      <div className={classNames('dp-select')}>
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
      this.disableEditMode();
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
        const value = this.props.token.value ? this.props.token.value : { time: null };
        this.setState({
          value,
        });
        this.disableEditMode();
        break;
      }
      case 'Tab':
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.props.selectNextToken();
          this.handleChange(this.state.selectedOption.timeObject);
        }
        this.disableEditMode();
        break;
      case ' ':
      case 'Enter':
        this.props.selectNextToken();
        this.handleChange(this.state.selectedOption.timeObject);
        break;
      default:
        return true;
    }
    e.preventDefault();
    e.stopPropagation();
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
      <div className={classNames('dp-select')}>
        <div className={classNames(styles.select_content, 'dp-select__content')}>
          <List className={classNames(styles.selectable_list, 'dp-selectable-list')}>
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
}

DurationInput.propTypes = {
  ...TokenInput.propTypes,
  locale:       PropTypes.string,
  translations: PropTypes.object,
};
DurationInput.defaultProps = {
  ...TokenInput.defaultProps,
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
