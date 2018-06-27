import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import BooleanInput from 'Components/Input/BooleanInput';
import { noop } from '@deskpro/react-components/dist/utils';

Enzyme.configure({ adapter: new Adapter() });

it('+++capturing Snapshot of BooleanInput with true set', () => {
  const token = {
    type:  'user-message',
    value: true
  };
  const renderedValue = renderer.create(
    <BooleanInput
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
it('+++capturing Snapshot of BooleanInput with false set', () => {
  const token = {
    type:  'user-message',
    value: false
  };
  const renderedValue = renderer.create(
    <BooleanInput
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
it('+++capturing Snapshot of BooleanInput with empty value', () => {
  const token = {
    type:  'user-message',
    value: null
  };
  const renderedValue = renderer.create(
    <BooleanInput
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
