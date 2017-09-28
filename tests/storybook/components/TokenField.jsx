import React from 'react';
import { storiesOf, action } from '@storybook/react';
import { TokenField, Token } from 'Components/TokenField';

const tokenTypes = [
  new Token(
    'date',
    'DateTimeInput',
    {},
    'Date the ticket was submitted'
  ),
  new Token(
    'date-ticket-created',
    'DateTimeInput',
    {},
    'When the ticket was created'
  ),
  new Token(
    'user-message',
    'TextInput',
    {},
    'Message entered initially by the user'
  )
];

const value = [
  {
    type:  'date',
    value: {
      inputType: 'preset',
      preset:    'yesterday',
    }
  },
  {
    type:  'TEXT',
    value: 'pricing',
  },
  {
    type:  'user-message',
    value: 'help upgrading'
  }
];

storiesOf('TokenField', module)
  .add('TokenField', () => (
    <div>
      <TokenField
        tokenTypes={tokenTypes}
        value={value}
        onChange={action('onChange')}
      />
    </div>
  ))
;
