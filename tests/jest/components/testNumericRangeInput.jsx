import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import NumericRangeInput from 'Components/Input/NumericRangeInput';

let wrapper;
let token;


const convertFromValue = value => Math.round(value / 1024 / 1024);
const convertToValue = value => value * 1024 * 1024;

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
    />
  );
});

it('renders without crashing', () => {
  const textInput = shallow(<NumericRangeInput token={token} />);
  if (!expect(textInput).exist) {
    return false;
  }
  return undefined;
});

it('should render the input label', () => {
  expect(wrapper.contains(<div className="dp-code label">{token.type}:</div>)).to.equal(true);
});

it('should render the input value', () => {
  const span = wrapper.find('span');
  expect(span.text()).to.equal('12 MB to 20 MB');
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
    />
  );
  const span = emptyWrapper.find('span');
  expect(span.text()).to.equal('__ MB to __ MB');
});

it('should have the class passed', () => {
  expect(wrapper.first().hasClass('test')).to.equal(true);
});
