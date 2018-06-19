import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SelectInput from 'Components/Input/SelectInput';

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
  { id: 1, label: 'Cold', icon: 'thermometer-empty' },
  { id: 2, label: 'Cool', icon: 'thermometer-quarter' },
  { id: 3, label: 'Medium', icon: 'thermometer-half' },
  { id: 4, label: 'Warm', icon: 'thermometer-three-quarters' },
  { id: 5, label: 'Hot', icon: 'thermometer-full' },
];

const optionsWithHierarchy = [
  { id: 1,  title: 'OS' },
  { id: 2,  title: 'Windows', parent: 1 },
  { id: 20, title: 'Win 8',   parent: 2 },
  { id: 21, title: 'Win 10',  parent: 2 },
  { id: 3,  title: 'Mac',     parent: 1 },
];

const selectToken = {
  type:  'country',
  value: 'GB'
};

const selectTokenEmpty = {
  type:  'country',
  value: ''
};

const selectTokenIcon = {
  type:  'temperature',
  value: null,
};

const selectTokenHierarchy = {
  type:  'operating-system',
  value: [20, 21],
};

const fakeAPI = (filter, delay, value) => new Promise(((resolve) => {
  setTimeout(resolve, delay, value.filter(o => o.title === filter || filter === ''));
}));

storiesOf('Inputs', module)
  .add('SelectInput', () => (
    <div>
      <SelectInput
        dataSource={{ getOptions: options }}
        token={selectToken}
        label="country"
        className="test"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        renderHeader={<h4>Countries</h4>}
      />
      <SelectInput
        dataSource={{ getOptions: options }}
        token={selectTokenEmpty}
        label="country"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        showSearch={false}
        className="test"
      />
      <SelectInput
        dataSource={{ getOptions: () => fakeAPI('', 30000, optionsWithIcon), findOptions: filter => fakeAPI(filter, 30000, optionsWithIcon) }}
        token={selectTokenIcon}
        label="temperature"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        className="test"
      />
      <SelectInput
        dataSource={{ getOptions: optionsWithHierarchy }}
        token={selectTokenHierarchy}
        label="operating-system"
        isMultiple
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        className="test"
      />
    </div>
  ))
;
