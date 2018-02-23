import React from 'react';
import { storiesOf } from '@storybook/react';
import { TokenField } from 'Components/TokenField';
import { Button } from '@deskpro/react-components';
import styles from '../style.css';

const countries = [
  { label: 'Austria', value: 'AT' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
  { label: 'Greece', value: 'GR' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Italy', value: 'IT' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Malta', value: 'MT' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Romania', value: 'RO' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sweden', value: 'SE' },
  { label: 'United Kingdom', value: 'GB' }
];

const tokenTypes = [
  {
    id:          'date',
    widget:      'DateTimeInput',
    props:       {},
    description: 'Date the ticket was submitted'
  },
  {
    id:          'date-ticket-created',
    widget:      'DateTimeInput',
    props:       {},
    description: 'When the ticket was created'
  },
  {
    id:          'date-ticket-resolved',
    widget:      'DateTimeInput',
    props:       {},
    description: 'When the ticket was resolved'
  },
  {
    id:          'user-message',
    widget:      'TextInput',
    props:       {},
    description: 'Message entered initially by the user'
  },
  {
    id:     'attach-size',
    widget: 'NumericRangeInput',
    props:  {
      unitPhrase:       'MB',
      convertFromValue: value => Math.round(value / 1024 / 1024),
      convertToValue:   value => value * 1024 * 1024,
    }
  },
  {
    id:     'country',
    widget: 'SelectInput',
    props:  {
      dataSource: {
        getOptions: countries,
      },
      renderHeader: <h3>Countries</h3>,
      showSearch:   false
    },
  },
  {
    id:          'user-waiting',
    widget:      'DurationInput',
    props:       {},
    description: 'Time waited by user'
  }
];

const defaultValue = [
  {
    type:  'user-message',
    value: 'help upgrading'
  },
  {
    type:  'TEXT',
    value: 'pricing',
  },
  {
    type: 'user-waiting'
  }
];

class TokenFieldStory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: defaultValue,
    };
  }

  handleChange = (value) => {
    this.setState({
      value
    });
  };

  addCountryToken = () => {
    this.tokenField.addTokenAndFocus('country', null, 'FR');
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        <TokenField
          ref={(c) => { this.tokenField = c; }}
          tokenTypes={tokenTypes}
          value={value}
          onChange={this.handleChange}
        />
        <br />
        <Button onClick={this.addCountryToken}>Add country token</Button>
        <h4 className={styles.title}>Available types</h4>
        <ul className={styles.title}>
          <li>attach-size (<i>NumericRangeInput</i>)</li>
          <li>country (<i>SelectInput</i>)</li>
          <li>date (<i>DateTimeInput</i>)</li>
          <li>date-ticket-created (<i>DateTimeInput</i>)</li>
          <li>date-ticket-resolved (<i>DateTimeInput</i>)</li>
          <li>user-message (<i>TextInput</i>)</li>
          <li>user-waiting (<i>DurationInput</i>)</li>
        </ul>
        <h3 className={styles.title}>Value</h3>
        <pre className={styles.code}>
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  }
}

storiesOf('TokenField', module)
  .add('TokenField', () => (
    <TokenFieldStory />
  ));

