import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from 'Components/Input/TextInput';
import NumericRangeInput from 'Components/Input/NumericRangeInput';

const textToken = {
  type:  'user-message',
  value: 'help upgrading'
};
const textTokenEmpty = {
  type:  'person-email',
  value: ''
};
const numericRangeToken = {
  type:  'attach-size',
  value: [12582912, 20971520]
};
const numericRangeTokenEmpty = {
  type:  'attach-size',
  value: [12582912]
};
const convertFromValue = value => Math.round(value / 1024 / 1024);
const convertToValue = value => value * 1024 * 1024;

storiesOf('Inputs', module)
  .add('TextInput', () => (
    <div>
      <TextInput token={textToken} className="test" />
      <TextInput token={textTokenEmpty} className="test" />
    </div>
  ))
  .add('NumericRangeInput', () => (
    <div>
      <NumericRangeInput
        token={numericRangeToken}
        unitPhrase="MB"
        className="test"
        convertToValue={convertToValue}
        convertFromValue={convertFromValue}
      />
      <NumericRangeInput
        token={numericRangeTokenEmpty}
        unitPhrase="MB"
        className="test"
        convertToValue={convertToValue}
        convertFromValue={convertFromValue}
      />
    </div>
  ))
;
