import React from 'react';
import { storiesOf } from '@storybook/react';
import { TokenField, Token } from 'Components/TokenField';
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
  new Token(
    'date',
    'DateTimeInput',
    {},
    'Date the ticket was submitted'
  ),
  new Token(
    'date-ticket-created',
    'DateTimeInput',
    {},
    'When the ticket was created'
  ),
  new Token(
    'date-ticket-resolved',
    'DateTimeInput',
    {},
    'When the ticket was resolved'
  ),
  new Token(
    'user-message',
    'TextInput',
    {},
    'Message entered initially by the user'
  ),
  new Token(
    'attach-size',
    'NumericRangeInput',
    {
      unitPhrase:       'MB',
      convertFromValue: value => Math.round(value / 1024 / 1024),
      convertToValue:   value => value * 1024 * 1024,
    }
  ),
  new Token(
    'country',
    'SelectInput',
    {
      dataSource: {
        getOptions: countries,
      },
      renderHeader: <h3>Countries</h3>,
      showSearch:   false
    },
  ),
  new Token(
    'user-waiting',
    'DurationInput',
    {},
    'Time waited by user'
  )
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

  render() {
    const { value } = this.state;
    return (
      <div>
        <TokenField
          tokenTypes={tokenTypes}
          value={value}
          onChange={this.handleChange}
        />
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

