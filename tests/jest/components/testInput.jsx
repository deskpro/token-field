import React from 'react';
import { shallow } from 'enzyme';
import ReactDOM from 'react-dom';
import TextInput from 'Components/Input/TextInput';

let wrapper;
let token;

beforeEach(() => {
  token = {
    type:  'user-message',
    value: 'help upgrading'
  };
  wrapper = shallow(<TextInput token={token} className="test" />);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextInput token={token} />, div);
});

it('should render the input label', () => {
  expect(wrapper.contains(token.type)).toEqual(true);
});

it('should render the input value', () => {
  expect(wrapper.contains(token.value)).toEqual(true);
});

it('should have the class passed', () => {
  expect(wrapper.first().hasClass('test')).toEqual(true);
});
