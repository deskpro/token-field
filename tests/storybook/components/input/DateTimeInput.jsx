import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DateTimeInput from 'Components/Input/DateTimeInput';

const dateTimeToken = {
  type:  'date',
  value: {
    inputType: 'preset',
    preset:    'yesterday',
  }
};
const dateTimeTokenEmpty = {
  type:  'user-waiting',
  value: {},
};
const dateTimeTokenAbsolute = {
  type:  'date',
  value: {
    inputType: 'absolute',
    date:      '2017-09-25T11:30:52+01:00',
    op:        '<',
  }
};
const dateTimeTokenRange = {
  type:  'date',
  value: {
    inputType: 'absolute',
    date:      '2017-09-25T11:30:52+01:00',
    dateEnd:   '2017-10-05T11:30:52+01:00',
    op:        'range',
  }
};

storiesOf('Inputs', module)
  .add('DateTimeInput', () => (
    <div>
      <DateTimeInput
        token={dateTimeToken}
        label="date"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
      <DateTimeInput
        token={dateTimeTokenEmpty}
        label="user-waiting"
        locale="it"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
      <DateTimeInput
        token={dateTimeTokenAbsolute}
        label="date"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
      <DateTimeInput
        token={dateTimeTokenRange}
        label="date"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
    </div>
  ))
;
