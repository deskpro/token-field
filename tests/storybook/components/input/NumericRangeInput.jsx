import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from 'Components/Input/TextInput';
import NumericRangeInput from 'Components/Input/NumericRangeInput';

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
