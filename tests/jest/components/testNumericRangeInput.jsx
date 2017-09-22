import React from 'react';
import { shallow } from 'enzyme';
import ReactDOM from 'react-dom';
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
  wrapper = shallow(
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
  const div = document.createElement('div');
  ReactDOM.render(<NumericRangeInput token={token} />, div);
});

it('should render the input label', () => {
  expect(wrapper.contains(token.type)).toEqual(true);
});

it('should render the input value', () => {
  expect(wrapper.contains('12 MB to 20 MB')).toEqual(true);
});

it('should have the class passed', () => {
  expect(wrapper.first().hasClass('test')).toEqual(true);
});
