import React from 'react';
import renderer from 'react-test-renderer';
import NumericRangeInput from 'Components/Input/NumericRangeInput';
import { noop } from '@deskpro/react-components/dist/utils';

const convertFromValue = value => Math.round(value / 1024 / 1024);
const convertToValue = value => value * 1024 * 1024;

it('+++capturing Snapshot of NumericRangeInput', () => {
  const token = {
    type:  'user-message',
    value: {
      range: [12582912, 20971520]
    },
  };
  const renderedValue = renderer.create(
    <NumericRangeInput
      token={token}
      unitPhrase="MB"
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
it('+++capturing Snapshot of NumericRangeInput with custom convert', () => {
  const token = {
    type:  'user-message',
    value: {
      range: [12582912, 20971520]
    },
  };
  const renderedValue = renderer.create(
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
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
it('+++capturing Snapshot of NumericRangeInput with empty value', () => {
  const token = {
    type:  'user-message',
    value: []
  };
  const renderedValue = renderer.create(
    <NumericRangeInput
      token={token}
      unitPhrase="MB"
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
