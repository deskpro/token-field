import React from 'react';
import renderer from 'react-test-renderer';
import SelectInput from 'Components/Input/SelectInput';
import noop from 'deskpro-components/lib/utils/noop';

const token = {
  type:  'country',
  value: 'GB'
};

const options = [
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

const optionsWithIcon = [
  { value: 1, title: 'Cold', icon: 'thermometer-empty' },
  { value: 2, title: 'Cool', icon: 'thermometer-quarter' },
  { value: 3, title: 'Medium', icon: 'thermometer-half' },
  { value: 4, title: 'Warm', icon: 'thermometer-three-quarters' },
  { value: 5, title: 'Hot', icon: 'thermometer-full' },
];

it('+++capturing Snapshot of SelectInput', () => {
  const renderedValue = renderer.create(
    <SelectInput
      dataSource={{ getOptions: options }}
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

it('+++capturing Snapshot of SelectInput', () => {
  const selectTokenIcon = {
    type:  'temperature',
    value: 4,
  };
  const renderedValue = renderer.create(
    <SelectInput
      dataSource={{ getOptions: optionsWithIcon }}
      token={selectTokenIcon}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
