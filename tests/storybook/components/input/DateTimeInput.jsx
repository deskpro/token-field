import React from 'react';
import { storiesOf } from '@storybook/react';
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
      <DateTimeInput token={dateTimeToken} />
      <DateTimeInput token={dateTimeTokenEmpty} locale="it" />
      <DateTimeInput token={dateTimeTokenAbsolute} />
      <DateTimeInput token={dateTimeTokenRange} />
    </div>
  ))
;
