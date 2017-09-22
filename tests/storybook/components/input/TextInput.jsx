import React from 'react';
import { storiesOf } from '@storybook/react';
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
      <TextInput token={textToken} className="test" />
      <TextInput token={textTokenEmpty} className="test" />
    </div>
  ))
;
