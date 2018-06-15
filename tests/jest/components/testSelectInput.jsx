import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import SelectInput from 'Components/Input/SelectInput';
import { noop } from '@deskpro/react-components/dist/utils';

Enzyme.configure({ adapter: new Adapter() });

const options = [
  { label: 'Austria', value: 'AT' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
  { label: 'Greece', value: 'GR' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Italy', value: 'IT' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Malta', value: 'MT' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Romania', value: 'RO' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sweden', value: 'SE' },
  { label: 'United Kingdom', value: 'GB' }
];

const optionsWithIcon = [
  { value: 1, title: 'Cold', icon: 'thermometer-empty' },
  { value: 2, title: 'Cool', icon: 'thermometer-quarter' },
  { value: 3, title: 'Medium', icon: 'thermometer-half' },
  { value: 4, title: 'Warm', icon: 'thermometer-three-quarters' },
  { value: 5, title: 'Hot', icon: 'thermometer-full' },
];

const optionsSimple = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
];

const optionsValue = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
];

const optionsName = [
  { value: 1, name: 'small' },
  { value: 2, name: 'medium'  },
  { value: 3, name: 'large'  },
  { value: 4, name: 'extra large'  },
];

it('+++capturing Snapshot of SelectInput', () => {
  const token = {
    type:  'country',
    value: 'GB'
  };
  const renderedValue = renderer.create(
    <SelectInput
      dataSource={{ getOptions: options }}
      token={token}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

it('+++capturing Snapshot of SelectInput with icon', () => {
  const selectTokenIcon = {
    type:  'temperature',
    value: 4,
  };
  const renderedValue = renderer.create(
    <SelectInput
      dataSource={{ getOptions: optionsWithIcon }}
      token={selectTokenIcon}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

it('+++capturing Snapshot of SelectInput simple', () => {
  const selectTokenIcon = {
    type:  'level',
    value: 3,
  };
  const renderedValue = renderer.create(
    <SelectInput
      dataSource={{ getOptions: optionsSimple }}
      token={selectTokenIcon}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

it('+++capturing Snapshot of SelectInput value', () => {
  const selectTokenIcon = {
    type:  'level',
    value: 3,
  };
  const renderedValue = renderer.create(
    <SelectInput
      dataSource={{ getOptions: optionsValue }}
      token={selectTokenIcon}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

it('+++capturing Snapshot of SelectInput value', () => {
  const selectTokenIcon = {
    type:  'size',
    value: 3,
  };
  const renderedValue = renderer.create(
    <SelectInput
      dataSource={{ getOptions: optionsName }}
      token={selectTokenIcon}
      className="test"
      selectPreviousToken={noop}
      selectNextToken={noop}
      removeToken={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

describe('testSelectInput', () => {
  let wrapper;
  const map = {};
  const selectNextToken = jest.fn();
  const selectPreviousToken = jest.fn();
  const onChange = jest.fn();

  const token = {
    type:  'country',
    value: 'GB'
  };

  beforeEach(() => {
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    wrapper = mount(
      <SelectInput
        dataSource={{ getOptions: options }}
        token={token}
        className="test"
        renderHeader={() => <h4>Countries</h4>}
        renderFooter={() => <span className="footer">Footer</span>}
        renderItem={option => <span>{option.value} - {option.label}</span>}
        selectPreviousToken={selectPreviousToken}
        selectNextToken={selectNextToken}
        onChange={onChange}
        removeToken={noop}
      />
    );
  });

  // it('should show the option list when clicked', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   expect(wrapper.find('input').exists()).toEqual(true);
  // });

  // it('should select the next token on Tab', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   map.keydown({ key: 'Tab', preventDefault: noop });
  //
  //   setTimeout(() => expect(selectNextToken.mock.calls.length).toEqual(1), 250);
  // });

  // it('should select the previous token on Shift + Tab', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   map.keydown({ key: 'Tab', shiftKey: true, preventDefault: noop });
  //
  //   jest.useFakeTimers();
  //   setTimeout(() => expect(selectPreviousToken.mock.calls.length).toEqual(1), 250);
  //   jest.runAllTimers();
  // });

  // Disabled for now
  // it('should blur on Escape', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   expect(wrapper.find('span.value').exists()).toEqual(false);
  //
  //   map.keydown({ key: 'Escape', preventDefault: noop });
  //
  //   expect(wrapper.find('span.value').exists()).toEqual(true);
  // });

  // it('should select the first option on Enter', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   map.keydown({ key: 'Enter', preventDefault: noop });
  //
  //   expect(onChange.mock.calls.length).toEqual(1);
  //   expect(onChange.mock.calls[0]).toEqual(['AT']);
  // });

  // it('should select the second option on Enter', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   map.keydown({ key: 'ArrowDown', preventDefault: noop });
  //   map.keydown({ key: 'Enter', preventDefault: noop });
  //
  //   expect(onChange.mock.calls.length).toEqual(1);
  //   expect(onChange.mock.calls[0]).toEqual(['BE']);
  // });

  // it('should select the previous options on ArrowUp', () => {
  //   const value = wrapper.find('span').first();
  //
  //   value.simulate('click');
  //
  //   map.keydown({ key: 'ArrowDown', preventDefault: noop });
  //   map.keydown({ key: 'ArrowUp', preventDefault: noop });
  //   map.keydown({ key: 'Enter', preventDefault: noop });
  //
  //   expect(onChange.mock.calls.length).toEqual(1);
  //   expect(onChange.mock.calls[0]).toEqual(['AT']);
  // });

  afterEach(() => {
    selectNextToken.mockReset();
    selectPreviousToken.mockReset();
    onChange.mockReset();
  });
});

let showSearch = true;
describe('testSelectInput test render of input', () => {
  let wrapper;
  const selectNextToken = jest.fn();
  const selectPreviousToken = jest.fn();
  const onChange = jest.fn();

  const token = {
    type:  'country',
    value: 'GB'
  };


  beforeEach(() => {
    wrapper = mount(
      <SelectInput
        dataSource={{ getOptions: options }}
        token={token}
        showSearch={showSearch}
        className="test"
        selectPreviousToken={selectPreviousToken}
        selectNextToken={selectNextToken}
        removeToken={noop}
      />
    );

    const value = wrapper.find('span').first();

    value.simulate('click');
  });

  // it('should display the filter field', () => {
  //   showSearch = true;
  //
  //   const input = wrapper.find('input');
  //
  //   expect(input.length).toEqual(1);
  // });

  // it('should hide the filter field', () => {
  //   showSearch = false;
  //
  //   const input = wrapper.find('input');
  //
  //   expect(input.length).toEqual(1);
  // });

  afterEach(() => {
    selectNextToken.mockReset();
    selectPreviousToken.mockReset();
    onChange.mockReset();
  });
});
