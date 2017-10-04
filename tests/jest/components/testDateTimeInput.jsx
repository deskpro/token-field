import React from 'react';
import renderer from 'react-test-renderer';
import DateTimeInput from 'Components/Input/DateTimeInput';
import noop from 'deskpro-components/lib/utils/noop';

it('+++capturing Snapshot of DateTimeInput', () => {
  const token = {
    type:  'user-message',
    value: {
      inputType: 'preset',
      preset:    'yesterday',
    }
  };
  const renderedValue = renderer.create(
    <DateTimeInput
      token={token}
      className="test-class"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
