import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import NumericRangeInput from 'Components/Input/NumericRangeInput';
import noop from 'deskpro-components/lib/utils/noop';

let wrapper;
let token;


const convertFromValue = value => Math.round(value / 1024 / 1024);
const convertToValue = value => value * 1024 * 1024;

it('+++capturing Snapshot of NumericRangeInput', () => {
  const renderedValue = renderer.create(
    <NumericRangeInput
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
    type:  'user-message',
    value: [12582912, 20971520]
  };
  wrapper = mount(
    <NumericRangeInput
      token={token}
      unitPhrase="MB"
      className="test"
      convertToValue={convertToValue}
      convertFromValue={convertFromValue}
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
  const span = wrapper.find('span');
  expect(span.text()).toEqual('12 MB to 20 MB');
});

it('should render empty value', () => {
  const emptyToken = {
    type:  'user-message',
    value: []
  };
  const emptyWrapper = mount(
    <NumericRangeInput
      token={emptyToken}
      unitPhrase="MB"
      className="test"
      convertToValue={convertToValue}
      convertFromValue={convertFromValue}
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  );
  const span = emptyWrapper.find('span');
  expect(span.text()).toEqual('__ MB to __ MB');
});

it('should have the class passed', () => {
  expect(wrapper.first().hasClass('test')).toEqual(true);
});
