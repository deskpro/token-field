import React from 'react';
import Immutable from 'immutable';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SlaStatusInput from 'Components/Input/SlaStatusInput';

const slaStatusToken = {
  type:  'sla-status',
  value: {
    slaStatus: 'warning',
    slaId:     2,
    op:        'is',
  }
};

const slas = [
  {
    id:             1,
    title:          'First',
    sla_type:       'first_response',
    active_time:    'default',
    work_start:     null,
    work_end:       null,
    work_days:      [],
    work_timezone:  null,
    work_holidays:  [],
    apply_type:     'all',
    warn_time:      1,
    warn_time_unit: 'days',
    fail_time:      1,
    fail_time_unit: 'days'
  },
  {
    id:             2,
    title:          'Second',
    sla_type:       'resolution',
    active_time:    'default',
    work_start:     null,
    work_end:       null,
    work_days:      [],
    work_timezone:  null,
    work_holidays:  [],
    apply_type:     'manual',
    warn_time:      1,
    warn_time_unit: 'days',
    fail_time:      1,
    fail_time_unit: 'days'
  },
  {
    id:             3,
    title:          'Third',
    sla_type:       'waiting_time',
    active_time:    'default',
    work_start:     null,
    work_end:       null,
    work_days:      [],
    work_timezone:  null,
    work_holidays:  [],
    apply_type:     'manual',
    warn_time:      1,
    warn_time_unit: 'days',
    fail_time:      1,
    fail_time_unit: 'days'
  }
];

storiesOf('Inputs', module)
  .add('SlaStatusInput', () => (
    <div>
      <SlaStatusInput
        token={slaStatusToken}
        dataSource={{ getOptions: Immutable.fromJS(slas) }}
        label="sla-status"
        className="test"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
    </div>
  ))
;
