import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import DateTimeInput from 'Components/Input/DateTimeInput';

let wrapper;
let token;

beforeEach(() => {
  token = {
    type:  'user-message',
    value: {
      inputType: 'preset',
      preset:    'yesterday',
    }
  };
  wrapper = mount(<DateTimeInput token={token} className="test" />);
});

it('renders without crashing', () => {
  const dateTimeInput = shallow(<DateTimeInput token={token} />);
  if (!expect(dateTimeInput).exist) {
    return false;
  }
  return undefined;
});

it('should render the input label', () => {
  expect(wrapper.contains(<div className="dp-code label">{token.type}:</div>)).to.equal(true);
});

it('should render the preset value', () => {
  const span = wrapper.find('span');
  expect(span.text()).to.equal('Yesterday');
});
//
// it('should have the class passed', () => {
//   expect(wrapper.first().hasClass('test')).to.equal(true);
// });
