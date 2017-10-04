import React from 'react';
import { shallow } from 'enzyme';
import TokenInput from "Components/Input/TokenInput";
import noop from 'deskpro-components/lib/utils/noop';

let wrapper;
let childFocus;
let removeToken;

beforeEach(() => {
  childFocus = jest.fn();
  removeToken = jest.fn();

  wrapper = shallow(
    <TokenInput
      type="test-token"
      renderInput={noop}
      renderValue={noop}
      removeToken={removeToken}
      onFocus={childFocus}
    />
  );
});

afterEach(() => {
  childFocus.mockReset();
  removeToken.mockReset();
});

it('should click on cross should remove', () => {
  const remove = wrapper.find('.remove');

  remove.simulate('click');
  expect(removeToken.mock.calls.length).toEqual(1);
});
it('should class child focus on focus', () => {
  const value = wrapper.find('.value');
  value.simulate('click');

  setTimeout(() => expect(childFocus.mock.calls.length).toEqual(1), 250);
});
