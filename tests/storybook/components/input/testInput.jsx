import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from 'Components/Input/TextInput';

storiesOf('TextInput', module)
  .add('TextInput', () => (
    <div style={{ width: 200 }}>
      <TextInput value={1} />
    </div>
  ))
;
