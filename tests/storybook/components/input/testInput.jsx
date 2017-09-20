import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from 'Components/Input/TextInput';

const token = {
  type:  'user-message',
  value: 'help upgrading'
};

storiesOf('TextInput', module)
  .add('TextInput', () => (
    <div style={{ width: 200 }}>
      <TextInput token={token} className="test" />
    </div>
  ))
;
