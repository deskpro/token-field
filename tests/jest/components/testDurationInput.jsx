import React from 'react';
import renderer from 'react-test-renderer';
import { DurationInput } from 'Components/index';
import noop from 'deskpro-components/lib/utils/noop';

it('+++capturing Snapshot of DurationInput', () => {
  const token = {
    type:  'user-waiting',
    value: {
      inputType: 'relative',
      time:      {
        minutes: 15,
        hours:   1,
      },
      op: '=',
    }
  };
  const renderedValue = renderer.create(
    <DurationInput
      token={token}
      className="test-class"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
it('+++capturing Snapshot of DurationInput', () => {
  const token = {
    type:  'user-waiting',
    value: {},
  };
  const renderedValue = renderer.create(
    <DurationInput
      token={token}
      className="test-class"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
it('+++capturing Snapshot of DurationInput', () => {
  const token = {
    type:  'date',
    value: {
      inputType: 'relative',
      time:      {
        minutes: 60,
      },
      timeEnd: {
        days: 2,
      },
      op: 'range',
    }
  };

  const renderedValue = renderer.create(
    <DurationInput
      token={token}
      className="test-class"
      locale="fr"
      translations={{ to: 'à' }}
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
