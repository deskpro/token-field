import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import SelectInput from 'Components/Input/SelectInput';
import noop from 'deskpro-components/lib/utils/noop';

let wrapper;
let token;

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

it('+++capturing Snapshot of SelectInput', () => {
  const renderedValue = renderer.create(
    <SelectInput
      dataSource={{ getOptions: options }}
      token={token}
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

beforeEach(() => {
  token = {
    type:  'country',
    value: 'GB'
  };
  wrapper = mount(
    <SelectInput
      dataSource={{ getOptions: options }}
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  );
});

it('should render the input label', () => {
  expect(wrapper.contains(<div className="dp-code label">{token.type}:</div>)).toEqual(true);
});

it('should render the input value', () => {
  const span = wrapper.find('span.value');
  expect(span.text()).toEqual('United Kingdom');
});

it('should have the class passed', () => {
  expect(wrapper.first().hasClass('test')).toEqual(true);
});
