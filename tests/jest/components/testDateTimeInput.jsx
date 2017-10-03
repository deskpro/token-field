import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import DateTimeInput from 'Components/Input/DateTimeInput';
import noop from 'deskpro-components/lib/utils/noop';

let wrapper;
let token;

it('+++capturing Snapshot of DateTimeInput', () => {
  const renderedValue = renderer.create(
    <DateTimeInput
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
    value: {
      inputType: 'preset',
      preset:    'yesterday',
    }
  };
  wrapper = mount(
    <DateTimeInput
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />);
});

it('should render the input label', () => {
  expect(wrapper.contains(<div className="dp-code label">{token.type}:</div>)).toEqual(true);
});

it('should render the preset value', () => {
  const span = wrapper.find('span');
  expect(span.text()).toEqual('Yesterday');
});
//
// it('should have the class passed', () => {
//   expect(wrapper.first().hasClass('test')).to.equal(true);
// });
