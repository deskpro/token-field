import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
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
      <DurationInput
        token={durationToken}
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
      <DurationInput
        token={durationTokenEmpty}
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        locale="it"
      />
      <DurationInput
        token={durationTokenRange}
        locale="fr"
        translations={{ to: 'à' }}
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
    </div>
  ))
;
