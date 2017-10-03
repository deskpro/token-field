import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Datepicker } from 'deskpro-components/lib/Components/Forms';
import { Tabs, TabLink } from 'deskpro-components/lib/Components/Tabs';
import Section from 'deskpro-components/lib/Components/Section';
import { List, ListElement } from 'deskpro-components/lib/Components/Common';
import TokenInput from './TokenInput';


export default class DateTimeInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.object,
    }).isRequired,
    locale:       PropTypes.string,
    showSwitcher: PropTypes.bool,
    defaultInput: PropTypes.oneOf(['date', 'time']),
    className:    PropTypes.string,
    translations: PropTypes.object,
    onChange:     PropTypes.func,
    removeToken:  PropTypes.func.isRequired,
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
    this.state = {
      value:  props.token.value,
      active: props.defaultInput,
      op:     null,
    };
  }

  componentDidUpdate() {
    if (this.openDatePicker) {
      this.openDatePicker = false;
      this.datePicker.focus();
    }
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

  getDatePicker = () => {
    moment.locale(this.props.locale);
    let date = moment();
    if (this.state.value.date) {
      date = moment(this.state.value.date);
    }
    console.log(date);
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

  getInput = () => {
    const { active, op } = this.state;
    const { translations, showSwitcher } = this.props;
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
    if (op) {
      return this.getDatePicker();
    }
    return (
      <div className="dp-select">
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
              {presets.map(preset =>
                (<ListElement
                  key={preset}
                  onClick={() => this.handleChange('preset', preset)}
                >
                  {translations[preset]}
                </ListElement>)
              )}
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
              {this.getTimePresets().map(preset =>
                (<ListElement
                  key={preset.key}
                  onClick={() => this.handleChange('preset', preset.key)}
                >
                  {preset.label}
                </ListElement>)
              )}
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

  getValue = () => {
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

  render() {
    const { token, className, removeToken } = this.props;
    return (
      <TokenInput
        ref={(c) => { this.tokenInput = c; }}
        className={className}
        type={token.type}
        renderInput={this.getInput}
        renderValue={this.getValue}
        removeToken={removeToken}
      />
    );
  }
}
