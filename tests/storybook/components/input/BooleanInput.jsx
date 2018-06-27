import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import BooleanInput from 'Components/Input/BooleanInput';

const textToken = {
  type:  'user-message',
  value: true
};
const textTokenEmpty = {
  type:  'person-email',
  value: null
};

storiesOf('Inputs', module)
  .add('BooleanInput', () => (
    <div>
      <BooleanInput
        token={textToken}
        label="user-message"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        className="test"
      />
      <BooleanInput
        token={textTokenEmpty}
        label="person-email"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        className="test"
      />
    </div>
  ))
;
