import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import TextInput from 'Components/Input/TextInput';
import noop from 'deskpro-components/lib/utils/noop';

it('+++capturing Snapshot of TextInput', () => {
  const token = {
    type:  'user-message',
    value: 'help upgrading'
  };
  const renderedValue = renderer.create(
    <TextInput
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
it('+++capturing Snapshot of TextInput with empty value', () => {
  const token = {
    type:  'user-message',
    value: null
  };
  const renderedValue = renderer.create(
    <TextInput
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
describe('testTextInput', () => {
  let wrapper;
  const selectNextToken = jest.fn();
  const selectPreviousToken = jest.fn();
  const onChange = jest.fn();

  const token = {
    type:  'user-message',
    value: 'help upgrading'
  };

  beforeEach(() => {
    wrapper = mount(
      <TextInput
        token={token}
        className="test"
        selectPreviousToken={selectPreviousToken}
        selectNextToken={selectNextToken}
        onChange={onChange}
        removeToken={noop}
      />
    );
  });

  it('should display an input when clicked', () => {

    const value = wrapper.find('span').first();


    value.simulate('click');

    const input = wrapper.find('input');

    expect(input.length).toEqual(1);

    expect(input.props().value).toEqual(token.value);
  });

  it('should select the next token on Enter', () => {

    const value = wrapper.find('span').first();

    value.simulate('click');

    const input = wrapper.find('input');

    expect(selectNextToken.mock.calls.length).toEqual(0);

    input.simulate('keyDown', { key: 'Enter' });

    expect(selectNextToken.mock.calls.length).toEqual(1);
  });

  it('should select the next token on Tab', () => {

    const value = wrapper.find('span').first();

    value.simulate('click');

    const input = wrapper.find('input');

    input.simulate('keyDown', { key: 'Tab' });

    expect(selectNextToken.mock.calls.length).toEqual(1);
  });

  it('should select the previous token on Shift + Tab', () => {

    const value = wrapper.find('span').first();

    value.simulate('click');

    const input = wrapper.find('input');

    expect(selectPreviousToken.mock.calls.length).toEqual(0);

    input.simulate('keyDown', { key: 'Tab', shiftKey: true });

    expect(selectPreviousToken.mock.calls.length).toEqual(1);
  });

  it('should blur on Escape', () => {

    const value = wrapper.find('span').first();

    value.simulate('click');

    expect(wrapper.find('span').exists()).toEqual(false);
    const input = wrapper.find('input');

    input.simulate('keyDown', { key: 'Escape' });

    expect(wrapper.find('span').exists()).toEqual(true);
  });

  it('should handle change on other inputs', () => {

    const value = wrapper.find('span').first();

    value.simulate('click');

    const input = wrapper.find('input');

    input.simulate('change', { target: { value: 'My new value' } });
    input.simulate('keyDown', { key: 'Enter' });

    expect(onChange.mock.calls.length).toBeGreaterThan(1);
  });

  afterEach(() => {
    selectNextToken.mockReset();
    selectPreviousToken.mockReset();
  });
});