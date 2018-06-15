import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { DurationInput } from 'Components/index';
import { noop } from '@deskpro/react-components/dist/utils';

Enzyme.configure({ adapter: new Adapter() });

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
it('+++capturing Snapshot of DurationInput with empty value', () => {
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
it('+++capturing Snapshot of DurationInput with no value', () => {
  const token = {
    type: 'user-waiting'
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
it('+++capturing Snapshot of DurationInput with range value', () => {
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
describe('testDurationInput', () => {
  let wrapper;
  const selectNextToken = jest.fn();
  const selectPreviousToken = jest.fn();
  const onChange = jest.fn();

  const token = {
    type:  'user-waiting',
    value: {
      inputType: 'relative',
      time:      {
        hours: 1,
      },
      op: '=',
    }
  };

  beforeEach(() => {
    wrapper = mount(
      <DurationInput
        token={token}
        className="test"
        selectPreviousToken={selectPreviousToken}
        selectNextToken={selectNextToken}
        onChange={onChange}
        removeToken={noop}
      />
    );
  });

  // it('should display an input when clicked', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   expect(wrapper.find('List').exists()).toEqual(true);
  // });

  // it('should select an element on click', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   wrapper.find('ListElement').first().simulate('click');
  //
  //   expect(onChange.mock.calls.length).toEqual(1);
  //   expect(onChange.mock.calls[0]).toEqual([
  //     {
  //       inputType: 'relative',
  //       op:        '=',
  //       time:      {
  //         hours: 1
  //       }
  //     }
  //   ]);
  // });

  // Disabled for now
  // it('should display custom duration when click on custom', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   wrapper.find('.custom').simulate('click');
  //
  //   expect(wrapper.find('.custom-list').exists()).toEqual(true);
  // });
  //
  // it('should revert to list when click on back', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   wrapper.find('.custom').simulate('click');
  //   wrapper.find('.back').simulate('click');
  //
  //   expect(wrapper.find('.custom-list').exists()).toEqual(false);
  // });

  afterEach(() => {
    selectNextToken.mockReset();
    selectPreviousToken.mockReset();
  });
});
