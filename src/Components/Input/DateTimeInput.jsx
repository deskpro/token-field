import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { Datepicker, Tabs, TabLink, Section, List, ListElement } from '@deskpro/react-components';
import styles from 'styles/style.css';
import TokenInput from './TokenInput';


export default class DateTimeInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.object,
    }).isRequired,
    label:               PropTypes.string.isRequired,
    locale:              PropTypes.string,
    showSwitcher:        PropTypes.bool,
    defaultInput:        PropTypes.oneOf(['date', 'time']),
    className:           PropTypes.string,
    translations:        PropTypes.object,
    onChange:            PropTypes.func,
    selectPreviousToken: PropTypes.func.isRequired,
    selectNextToken:     PropTypes.func.isRequired,
    removeToken:         PropTypes.func.isRequired,
  };
  static defaultProps = {
    showSwitcher: true,
    defaultInput: 'date',
    className:    '',
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
    },
    onChange() {},
  };

  constructor(props) {
    super(props);
    const presets = (props.defaultInput === 'date') ? this.getDatePresets() : this.getTimePresets();
    this.state = {
      value:          props.token.value,
      active:         props.defaultInput,
      selectedPreset: presets[0],
      op:             null,
    };
  }

  componentDidUpdate() {
    if (this.openDatePicker) {
      this.openDatePicker = false;
      this.datePicker.focus();
    }
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  }

  onFocus = () => {
    window.document.addEventListener('keydown', this.handleKeyDown);
  };

  onBlur = () => {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  };

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

  getDatePicker = () => {
    moment.locale(this.props.locale);
    let date = moment();
    if (this.state.value && this.state.value.date) {
      date = moment(this.state.value.date);
    }
    return (
      <Datepicker
        ref={(c) => { this.datePicker = c; }}
        date={date.toDate()}
        value={date.format('L')}
        onSelect={d => this.handleChange('absolute', d)}
        days={moment.weekdaysShort()}
        months={moment.months()}
      />
    );
  };

  focus = () => {
    this.tokenInput.focus();
  };

  handleChange = (inputType, value) => {
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
      default:
        newValue = {};
    }
    this.setState({
      value: newValue,
      op:    null,
    });
    this.props.onChange(newValue);
    this.tokenInput.disableEditMode();
  };

  handleOp = (op) => {
    this.openDatePicker = true;
    this.setState({
      op
    });
  };

  handleTabChange = (active) => {
    this.setState({
      active,
      op: null,
    });
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        const presets = this.state.active === 'time' ? this.getTimePresets() : this.getDatePresets();
        const index = presets.findIndex(preset => preset.key === this.state.selectedPreset.key);
        if (e.key === 'ArrowDown' && index < presets.length - 1) {
          this.setState({
            selectedPreset: presets[index + 1]
          });
        }
        if (e.key === 'ArrowUp' && index > 0) {
          this.setState({
            selectedPreset: presets[index - 1]
          });
        }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (this.props.showSwitcher && this.state.active === 'date') {
          const timePresets = this.getTimePresets();
          this.setState({
            active:         'time',
            selectedPreset: timePresets[0]
          });
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        if (this.props.showSwitcher && this.state.active === 'time') {
          const datePresets = this.getDatePresets();
          this.setState({
            active:         'date',
            selectedPreset: datePresets[0]
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
          this.handleChange('preset', this.state.selectedPreset.key);
        }
        this.tokenInput.disableEditMode();
        break;
      case 'Enter':
        e.preventDefault();
        this.props.selectNextToken();
        this.handleChange('preset', this.state.selectedPreset.key);
        break;
      default:
        return true;
    }
    return true;
  };

  renderPresets = (presets) => {
    const { value, selectedPreset } = this.state;
    const valuePreset = (value) ? value.preset : null;
    return presets.map((preset) => {
      const currentValue = JSON.stringify(preset.key) === valuePreset ? styles['current-value'] : '';
      const selected = (preset.key === selectedPreset.key) ? styles.selected : '';
      return (
        <ListElement
          key={preset.key}
          className={classNames(currentValue, selected)}
          onClick={() => this.handleChange('preset', preset.key)}
        >
          {preset.label}
        </ListElement>
      );
    });
  };

  renderInput = () => {
    const { active, op } = this.state;
    const { translations, showSwitcher } = this.props;

    if (op) {
      return this.getDatePicker();
    }
    return (
      <div className={classNames('dp-select', styles['dp-select'])}>
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
          </Section>
          <Section hidden={active !== 'time'}>
            <List className="dp-selectable-list">
              {this.renderPresets(this.getTimePresets())}
              <hr />
              <ListElement>
                {translations.custom}
              </ListElement>
            </List>
          </Section>
        </div>
      </div>
    );
  };

  renderValue = () => {
    const { translations } = this.props;
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

  render() {
    const { token, label, className, removeToken } = this.props;
    return (
      <TokenInput
        ref={(c) => { this.tokenInput = c; }}
        className={className}
        type={token.type}
        label={label}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        renderInput={this.renderInput}
        renderValue={this.renderValue}
        removeToken={removeToken}
        detached
      />
    );
  }
}
