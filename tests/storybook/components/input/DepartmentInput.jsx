import React from 'react';
import Immutable from 'immutable';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DepartmentInput from 'Components/Input/DepartmentInput';

const options = [
  {
    user_title:         'Support',
    parent:             null,
    brands:             [1],
    is_chat_enabled:    false,
    display_order:      0,
    is_tickets_enabled: true,
    title:              'Support',
    avatar:             {
      default_url_pattern: 'http://deskpro5.local/file.php/o-avatar/default?s={{IMG_SIZE}}&size-fit=1',
      url_pattern:         null,
      base_gravatar_url:   null
    },
    id:       1,
    children: []
  }, {
    user_title:         'Sales',
    parent:             null,
    brands:             [1],
    is_chat_enabled:    false,
    display_order:      0,
    is_tickets_enabled: true,
    title:              'Sales',
    avatar:             {
      default_url_pattern: 'http://deskpro5.local/file.php/o-avatar/default?s={{IMG_SIZE}}&size-fit=1',
      url_pattern:         null,
      base_gravatar_url:   null
    },
    id:       2,
    children: []
  }, {
    user_title:         'Widgets',
    parent:             null,
    brands:             [1],
    is_chat_enabled:    false,
    display_order:      0,
    is_tickets_enabled: true,
    title:              'Widgets',
    avatar:             {
      default_url_pattern: 'http://deskpro5.local/file.php/o-avatar/default?s={{IMG_SIZE}}&size-fit=1',
      url_pattern:         null,
      base_gravatar_url:   null
    },
    id:       5,
    children: []
  }, {
    user_title:         'Regulation and Control of Magical Creatures',
    parent:             null,
    brands:             [],
    is_chat_enabled:    false,
    display_order:      1,
    is_tickets_enabled: true,
    title:              'Regulation and Control of Magical Creatures',
    avatar:             {
      default_url_pattern: 'http://deskpro5.local/file.php/o-avatar/default?s={{IMG_SIZE}}&size-fit=1',
      url_pattern:         null,
      base_gravatar_url:   null
    },
    id:       6,
    children: [7, 8]
  }, {
    user_title:         'Regulation',
    parent:             6,
    brands:             [1],
    is_chat_enabled:    false,
    display_order:      2,
    is_tickets_enabled: true,
    title:              'Regulation',
    avatar:             {
      default_url_pattern: 'http://deskpro5.local/file.php/o-avatar/default?s={{IMG_SIZE}}&size-fit=1',
      url_pattern:         null,
      base_gravatar_url:   null
    },
    id:       7,
    children: []
  }, {
    user_title:         'Control',
    parent:             6,
    brands:             [1],
    is_chat_enabled:    false,
    display_order:      3,
    is_tickets_enabled: true,
    title:              'Control',
    avatar:             {
      default_url_pattern: 'http://deskpro5.local/file.php/o-avatar/default?s={{IMG_SIZE}}&size-fit=1',
      url_pattern:         null,
      base_gravatar_url:   null
    },
    id:       8,
    children: []
  }, {
    user_title:         'Hotdogs',
    parent:             null,
    brands:             [1],
    is_chat_enabled:    false,
    display_order:      4,
    is_tickets_enabled: true,
    title:              'Hotdogs',
    avatar:             {
      default_url_pattern: 'http://deskpro5.local/file.php/o-avatar/default?s={{IMG_SIZE}}&size-fit=1',
      url_pattern:         null,
      base_gravatar_url:   null
    },
    id:       9,
    children: []
  }
];

const selectToken = {
  type:  'department',
  value: [1, 2]
};

storiesOf('Inputs', module)
  .add('DepartmentInput', () => (
    <div>
      <DepartmentInput
        dataSource={{ getOptions: Immutable.fromJS(options) }}
        token={selectToken}
        label="department"
        className="test"
        selectPreviousToken={action('SelectPreviousToken')}
        selectNextToken={action('selectNextToken')}
        removeToken={action('removeToken')}
      />
    </div>
  ))
;
