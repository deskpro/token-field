import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Label, Input } from 'deskpro-components/lib/Components/Forms';
import { List, ListElement } from 'deskpro-components/lib/Components/Common';
import TokenInput from './TokenInput';

export default class DurationInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.object.isRequired
    }).isRequired,
    locale:       PropTypes.string,
    className:    PropTypes.string,
    translations: PropTypes.object,
  };
  static defaultProps = {
    className:    '',
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

  constructor(props) {
    super(props);
    this.state = {
      value:  props.token.value,
      custom: false,
    };
    this.getInput = this.getInput.bind(this);
    this.getValue = this.getValue.bind(this);
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
    const timeObject = this.state.value.time;
    return (
      <div className="dp-select">
        <div className="dp-select__content">
          <List>
            <ListElement>
              <Label>{translations.minutes}</Label>
              <Input
                value={timeObject.minutes}
              />
            </ListElement>
            <ListElement>
              <Label>{translations.hours}</Label>
              <Input
                value={timeObject.hours}
              />
            </ListElement>
            <ListElement>
              <Label>{translations.days}</Label>
              <Input
                value={timeObject.days}
              />
            </ListElement>
            <ListElement>
              <Label>{translations.weeks}</Label>
              <Input
                value={timeObject.weeks}
              />
            </ListElement>
            <ListElement>
              <Label>{translations.months}</Label>
              <Input
                value={timeObject.months}
              />
            </ListElement>
            <ListElement>
              <Label>{translations.years}</Label>
              <Input
                value={timeObject.years}
              />
            </ListElement>
            <hr />
            <ListElement onClick={() => this.handleCustom(false)}>
              {translations.back}
            </ListElement>
          </List>
        </div>
      </div>
    );
  }

  getInput() {
    const { custom } = this.state;
    if (custom) {
      return this.getCustomInput();
    }
    return (
      <div className="dp-select">
        <div className="dp-select__content">
          <List className="dp-selectable-list">
            {this.getTimePresets().map(preset =>
              (<ListElement
                key={preset.key}
                onClick={() => this.handleChange(preset.timeObject)}
              >
                {preset.label}
              </ListElement>)
            )}
            <hr />
            <ListElement onClick={() => this.handleCustom(true)}>
              custom
            </ListElement>
          </List>
        </div>
      </div>
    );
  }

  getValue() {
    const translations = this.getTranslations();
    if (this.state.value.op === 'range') {
      const time = this.getDisplayFromTimeObject(this.state.value.time);
      const timeEnd = this.getDisplayFromTimeObject(this.state.value.timeEnd);
      return `${time} ${translations.to} ${timeEnd}`;
    }
    return this.getDisplayFromTimeObject(this.state.value.time);
  }

  handleChange(timeObject) {
    this.setState({
      value: {
        inputType: 'relative',
        time:      timeObject
      },
    });
    this.tokenInput.disableEditMode();
  }

  handleCustom(custom) {
    this.setState({
      custom
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
      />
    );
  }
}
