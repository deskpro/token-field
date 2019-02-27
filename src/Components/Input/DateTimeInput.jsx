import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { Datepicker, Tabs, TabLink, Section, List, ListElement, Label, Input } from '@deskpro/react-components';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';
import './humanizePrecisely';

export default class DateTimeInput extends TokenInput {
  constructor(props) {
    super(props);
    this.detached = true;
    const presets = (props.defaultInput === 'date') ? this.getDatePresets() : this.getTimePresets();
    const selectables = presets.map(p => p.key);
    this.state = {
      ...this.state,
      active:   props.defaultInput,
      selected: selectables[0],
      mode:     'home',
      selectables,
      op:       null,
    };
  }

  componentDidUpdate() {
    if (this.openDatePicker) {
      this.openDatePicker = false;
      if (this.datePicker) {
        this.datePicker.focus();
      }
    }
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  }

  onEnable() {
    const { value } = this.state;
    if (value && value.op) {
      this.setState({
        mode: 'op',
        op:   this.state.value.op
      });
    }
    if (value && value.time) {
      this.setState({
        mode: 'custom'
      });
    }
  }

  onFocus = () => {
    this.props.onFocus(this.props.tokenKey);
    window.document.addEventListener('keydown', this.handleKeyDown);
  };

  onBlur = () => {
    this.props.onBlur();
    window.document.removeEventListener('keydown', this.handleKeyDown);
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

  getTimePresets = () => {
    moment.locale(this.props.locale);
    return [
      {
        key:        '1h',
        label:      moment.duration(-1, 'hours').humanize(true),
        timeObject: {
          hours: 1
        }
      },
      {
        key:        '2h',
        label:      moment.duration(-2, 'hours').humanize(true),
        timeObject: {
          hours: 2
        }
      },
      {
        key:        '6h',
        label:      moment.duration(-6, 'hours').humanize(true),
        timeObject: {
          hours: 6
        }
      },
      {
        key:        '12h',
        label:      moment.duration(-12, 'hours').humanize(true),
        timeObject: {
          hours: 12
        }
      }
    ];
  };

  getDatePresets = () => {
    const presets = [
      'today',
      'yesterday',
      'thisWeek',
      'lastWeek',
      'thisMonth',
      'lastMonth',
      'thisYear',
      'lastYear',
    ];
    return presets.map(preset => ({
      key:   preset,
      label: this.props.translations[preset],
    })
    );
  };

  getTranslations() {
    return Object.assign(DateTimeInput.defaultProps.translations, this.props.translations);
  }

  getDisplayFromTimeObject(timeObject) {
    if (!timeObject) {
      return '________';
    }
    moment.locale(this.props.locale);
    const duration = moment.duration(timeObject);
    return duration.humanizePrecisely();
  }

  handleChange = (inputType, value, field = 'date', disableEdit = true) => {
    let newValue;
    switch (inputType) {
      case 'preset':
        newValue = {
          inputType,
          preset: value
        };
        break;
      case 'absolute':
        newValue = {
          inputType,
          date: value,
          op:   this.state.op,
        };
        break;
      case 'relative':
        break;
      case 'range':
        newValue = this.state.value || {};
        newValue.inputType = 'absolute';
        newValue.op = 'range';
        newValue[field] = value;
        break;
      default:
        newValue = {};
    }
    this.props.onChange(newValue);
    if (disableEdit) {
      this.setState({
        value: newValue,
        op:    null,
      });
      this.disableEditMode();
    } else {
      this.setState({
        value: newValue,
      });
    }
  };

  handleCustomChange = (inputValue, name) => {
    let { value } = this.state;

    if (!value) {
      value = {};
    }
    if (!value.time) {
      value.time = {};
    }
    delete value.preset;
    value.time[name] = inputValue;
    value.inputType = 'relative';
    value.op = '=';
    this.setState({
      value
    });
    this.props.onChange(value);
  };

  handleOp = (op) => {
    this.setState({
      mode: 'op',
      op
    });
  };

  handleMode = (mode) => {
    this.setState({
      mode
    });
  };

  handleTabChange = (active) => {
    this.setState({
      mode: 'home',
      op:   null,
      active,
    });
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        const { selectables, selected } = this.state;
        const index = selectables.findIndex(s => s === selected);
        if (e.key === 'ArrowDown' && index < selectables.length - 1) {
          this.setState({
            selected: selectables[index + 1]
          });
        }
        if (e.key === 'ArrowUp' && index > 0) {
          this.setState({
            selected: selectables[index - 1]
          });
        }
        break;
      }
      case 'ArrowRight': {
        if (this.props.showSwitcher && this.state.active === 'date') {
          const selectables = this.getTimePresets().map(p => p.key);
          this.setState({
            active:   'time',
            selected: selectables[0],
            selectables,
          });
        }
        break;
      }
      case 'ArrowLeft': {
        if (this.props.showSwitcher && this.state.active === 'time') {
          const selectables = this.getDatePresets().map(p => p.key);
          this.setState({
            active:   'date',
            selected: selectables[0],
            selectables,
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
        if (this.state.mode === 'custom') {
          return true;
        }
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.props.selectNextToken();
          this.handleChange('preset', this.state.selected);
        }
        this.disableEditMode();
        break;
      case 'Enter':
        if (this.state.mode === 'custom') {
          this.props.selectNextToken();
          this.disableEditMode();
          return true;
        }
        this.props.selectNextToken();
        this.handleChange('preset', this.state.selected);
        break;
      default:
        return true;
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  renderPresets = (presets) => {
    const { value, selected } = this.state;
    const valuePreset = (value) ? value.preset : null;
    return presets.map((preset) => {
      const currentValue = JSON.stringify(preset.key) === valuePreset ? styles['current-value'] : '';
      const selectedClass = (preset.key === selected) ? styles.selected : '';
      return (
        <ListElement
          key={preset.key}
          className={classNames(currentValue, selectedClass)}
          onClick={() => this.handleChange('preset', preset.key)}
        >
          {preset.label}
        </ListElement>
      );
    });
  };

  renderDateTab = () => {
    const translations = this.getTranslations();
    const { mode, op } = this.state;

    if (mode === 'op') {
      if (op === 'range') {
        return (
          <div>
            {translations.from} <br />
            {this.renderDatePicker('date', 'range', false)}
            <br />
            {translations.to} <br />
            {this.renderDatePicker('dateEnd', 'range', false)}
          </div>
        );
      }
      let display = '';
      if (op !== '=') {
        display = `${translations.date} ${op}`;
      }
      return (
        <div>{display}{this.renderDatePicker()}</div>
      );
    }
    return (
      <List className="dp-selectable-list">
        {this.renderPresets(this.getDatePresets())}
        <hr />
        <ListElement onClick={() => this.handleOp('=')}>
          {translations.is}
        </ListElement>
        <ListElement onClick={() => this.handleOp('>')}>
          {translations.after}
        </ListElement>
        <ListElement onClick={() => this.handleOp('<')}>
          {translations.before}
        </ListElement>
        <ListElement onClick={() => this.handleOp('range')}>
          {translations.range}
        </ListElement>
      </List>
    );
  };

  renderDatePicker = (field = 'date', inputType = 'absolute', disableEdit = true) => {
    moment.locale(this.props.locale);
    let date = moment();
    if (this.state.value && this.state.value[field]) {
      date = moment(this.state.value[field]);
    }
    return (
      <Datepicker
        ref={(c) => { this.datePicker = c; }}
        className={styles['datetime-picker']}
        date={date.toDate()}
        value={date.format('L')}
        onSelect={d => this.handleChange(inputType, d, field, disableEdit)}
        days={moment.weekdaysShort()}
        months={moment.months()}
      />
    );
  };

  renderTimeTab = () => {
    const translations = this.getTranslations();
    const { value } = this.state;
    const time = value ? value.time : {};
    const timeObject = Object.assign(DateTimeInput.getEmptyTimeObject(), time);
    const { mode } = this.state;

    if (mode === 'custom') {
      return (
        <List>
          {['minutes', 'hours', 'days', 'weeks', 'months', 'years']
            .map(field => (
              <ListElement key={field}>
                <Label>{translations[field]}</Label>
                <Input
                  name={field}
                  value={timeObject[field]}
                  onChange={this.handleCustomChange}
                  autocomplete="off"
                />
              </ListElement>
            ))
          }
          <hr />
          <ListElement className="back" onClick={() => this.handleMode('home')}>
            {translations.back}
          </ListElement>
        </List>
      );
    }
    return (
      <List className="dp-selectable-list">
        {this.renderPresets(this.getTimePresets())}
        <hr />
        <ListElement onClick={() => this.handleMode('custom')}>
          {translations.custom}
        </ListElement>
      </List>
    );
  };

  renderInput = () => {
    const { active } = this.state;
    const translations = this.getTranslations();
    const { showSwitcher } = this.props;

    return (
      <div className={classNames('dp-select')}>
        <div className="dp-select__content">
          {
            showSwitcher ?
              <Tabs active={active} onChange={this.handleTabChange}>
                <TabLink name="date">
                  {translations.byDate}
                </TabLink>
                <TabLink name="time">
                  {translations.byTime}
                </TabLink>
              </Tabs>
              : null
          }
          <Section hidden={active !== 'date'}>
            {this.renderDateTab()}
          </Section>
          <Section hidden={active !== 'time'}>
            {this.renderTimeTab()}
          </Section>
        </div>
      </div>
    );
  };

  renderValue = () => {
    const translations = this.getTranslations();
    const { value } = this.state;
    if (!value) {
      return '________';
    }
    switch (value.inputType) {
      case 'preset': {
        if (translations[value.preset]) {
          return translations[value.preset];
        }
        const timePreset = this.getTimePresets().find(preset => preset.key === value.preset);
        if (timePreset) {
          return timePreset.label;
        }
        return '________';
      }
      case 'relative':
        return this.getDisplayFromTimeObject(this.state.value.time);
      case 'absolute':
        moment.locale(this.props.locale);
        switch (value.op) {
          case '=':
          case '<':
          case '>': {
            let display = '';
            if (value.op !== '=') {
              display = `${value.op} `;
            }
            if (value.date) {
              display += moment(value.date).format('L');
            } else {
              display += '______';
            }
            return display;
          }
          case 'range':
          default: {
            let display = '';
            if (value.date) {
              display += moment(value.date).format('L');
            } else {
              display += '______';
            }
            display += ' - ';
            if (value.dateEnd) {
              display += moment(value.dateEnd).format('L');
            } else {
              display += '______';
            }
            return display;
          }
        }
      default:
        return '________';
    }
  };
}

DateTimeInput.propTypes = {
  ...TokenInput.propTypes,
  locale:       PropTypes.string,
  showSwitcher: PropTypes.bool,
  defaultInput: PropTypes.oneOf(['date', 'time']),
  translations: PropTypes.object,
};
DateTimeInput.defaultProps = {
  ...TokenInput.defaultProps,
  showSwitcher: true,
  defaultInput: 'date',
  locale:       'en-gb',
  translations: {
    byDate:    'By date',
    byTime:    'By time',
    today:     'Today',
    yesterday: 'Yesterday',
    thisWeek:  'This week',
    lastWeek:  'Last week',
    thisMonth: 'This month',
    lastMonth: 'Last month',
    thisYear:  'This year',
    lastYear:  'Last year',
    is:        'is',
    after:     '> after',
    before:    '< before',
    range:     'range',
    custom:    'custom',
    from:      'From',
    to:        'To',
    date:      'Date',
    minutes:   'Minutes',
    hours:     'Hours',
    days:      'Days',
    weeks:     'Weeks',
    months:    'Months',
    years:     'Years',
    back:      'Back',
  },
};
