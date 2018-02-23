import React from 'react';
import renderer from 'react-test-renderer';
import DateTimeInput from 'Components/Input/DateTimeInput';
import { noop } from '@deskpro/react-components/dist/utils';

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
it('+++capturing Snapshot of DateTimeInput with time preset', () => {
  const token = {
    type:  'user-message',
    value: {
      inputType: 'preset',
      preset:    '2h',
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
it('+++capturing Snapshot of DateTimeInput with empty preset', () => {
  const token = {
    type:  'user-message',
    value: {
      inputType: 'preset',
      preset:    null,
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
it('+++capturing Snapshot of DateTimeInput with empty value', () => {
  const token = {
    type:  'user-message',
    value: {}
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
it('+++capturing Snapshot of DateTimeInput with null value', () => {
  const token = {
    type:  'user-message',
    value: null
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
it('+++capturing Snapshot of DateTimeInput with absolute value', () => {
  const token = {
    type:  'date',
    value: {
      inputType: 'absolute',
      date:      '2017-09-25T11:30:52+01:00',
      op:        '<',
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
it('+++capturing Snapshot of DateTimeInput with absolute and empty value', () => {
  const token = {
    type:  'user-message',
    value: {
      inputType: 'absolute',
      date:      null,
      op:        '>',
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
it('+++capturing Snapshot of DateTimeInput with range', () => {
  const token = {
    type:  'user-message',
    value: {
      inputType: 'absolute',
      date:      '2017-09-25T11:30:52+01:00',
      dateEnd:   '2017-10-05T11:30:52+01:00',
      op:        'range',
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
it('+++capturing Snapshot of DateTimeInput with range and empty value', () => {
  const token = {
    type:  'user-message',
    value: {
      inputType: 'absolute',
      date:      null,
      dateEnd:   null,
      op:        'range',
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
