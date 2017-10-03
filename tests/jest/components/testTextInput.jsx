import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import TextInput from 'Components/Input/TextInput';
import noop from 'deskpro-components/lib/utils/noop';

let wrapper;
let token;

beforeEach(() => {
  token = {
    type:  'user-message',
    value: 'help upgrading'
  };
  wrapper = mount(
    <TextInput
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  );
});

it('+++capturing Snapshot of TextInput', () => {
  const renderedValue = renderer.create(
    <TextInput
      token={token}
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

it('should render the input label', () => {
  expect(wrapper.contains(<div className="dp-code label">{token.type}:</div>)).toEqual(true);
});

it('should render the input value', () => {
  const span = wrapper.find('span');
  expect(span.text()).toEqual(token.value);
});

it('should have the class passed', () => {
  expect(wrapper.first().hasClass('test')).toEqual(true);
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
