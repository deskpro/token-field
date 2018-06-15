import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
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
        label="attach-size"
        unitPhrase="MB"
        className="test"
        convertToValue={convertToValue}
        convertFromValue={convertFromValue}
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
      <NumericRangeInput
        token={numericRangeTokenEmpty}
        label="attach-size"
        unitPhrase="MB"
        className="test"
        convertToValue={convertToValue}
        convertFromValue={convertFromValue}
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
    </div>
  ))
;
