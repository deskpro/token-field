import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import TextInput from 'Components/Input/TextInput';

let wrapper;
let token;

beforeEach(() => {
  token = {
    type:  'user-message',
    value: 'help upgrading'
  };
  wrapper = mount(<TextInput token={token} className="test" />);
});

it('renders without crashing', () => {
  const textInput = shallow(<TextInput token={token} />);
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
  expect(span.text()).to.equal(token.value);
});

it('should have the class passed', () => {
  expect(wrapper.first().hasClass('test')).to.equal(true);
});
// it('should display an input when clicked', () => {
//   const value = wrapper.find('span').first();
//
//   console.log(wrapper.debug());
//
//   value.simulate('click');
//
//   const input = wrapper.find('Input');
//
//   expect(input.length).to.equal(1);
//
//   input.simulate('keyDown', { key: 'Escape' });
//
//   const label = wrapper.find('.label');
//
//   label.simulate('click');
//   console.log(wrapper.debug());
//   console.log(label.debug());
//   console.log(input.debug());
//
//   expect(wrapper.find('Input').length).to.equal(0);
// });
