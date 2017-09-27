import React from 'react';
import { storiesOf } from '@storybook/react';
import DurationInput from 'Components/Input/DurationInput';

const durationToken = {
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
const durationTokenEmpty = {
  type:  'user-waiting',
  value: {},
};
const durationTokenRange = {
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

storiesOf('Inputs', module)
  .add('DurationInput', () => (
    <div>
      <DurationInput token={durationToken} />
      <DurationInput token={durationTokenEmpty} locale="it" />
      <DurationInput token={durationTokenRange} locale="fr" translations={{ to: 'à' }} />
    </div>
  ))
;
