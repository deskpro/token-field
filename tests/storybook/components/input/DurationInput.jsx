import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DurationInput from 'Components/Input/DurationInput';

const durationToken = {
  type:  'user-waiting',
  value: {
    inputType: 'relative',
    time:      {
      hours: 1,
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
      <DurationInput
        token={durationToken}
        label="user-waiting"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        onChange={action('onChange')}
      />
      <DurationInput
        token={durationTokenEmpty}
        label="user-waiting"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        locale="it"
        onChange={action('onChange')}
      />
      <DurationInput
        token={durationTokenRange}
        label="date"
        locale="fr"
        translations={{ to: 'à' }}
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        onChange={action('onChange')}
      />
    </div>
  ))
;
