import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TextInput from 'Components/Input/TextInput';

const textToken = {
  type:  'user-message',
  value: 'help upgrading'
};
const textTokenEmpty = {
  type:  'person-email',
  value: ''
};

storiesOf('Inputs', module)
  .add('TextInput', () => (
    <div>
      <TextInput
        token={textToken}
        label="user-message"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
        className="test"
      />
      <TextInput
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
