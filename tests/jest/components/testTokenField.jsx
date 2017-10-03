import React from 'react';
import renderer from 'react-test-renderer';
import { TokenField, Token } from 'Components/TokenField';
import noop from 'deskpro-components/lib/utils/noop';

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
    },
  ),
];

const value = [
  {
    type:  'date',
    value: {
      inputType: 'preset',
      preset:    'yesterday',
    }
  },
  {
    type:  'TEXT',
    value: 'pricing',
  },
  {
    type:  'user-message',
    value: 'help upgrading'
  }
];

it('+++capturing Snapshot of TokenField', () => {
  const renderedValue = renderer.create(
    <div>
      <TokenField
        tokenTypes={tokenTypes}
        value={value}
        onChange={noop}
      />
    </div>
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
