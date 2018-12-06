import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TokenField from 'Components/TokenField';
import { Button } from '@deskpro/react-components';
import styles from '../style.css';

const countries = [
  { label: 'Austria', value: 'AT' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
  { label: 'Greece', value: 'GR' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Italy', value: 'IT' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Malta', value: 'MT' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Romania', value: 'RO' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sweden', value: 'SE' },
  { label: 'United Kingdom', value: 'GB' }
];

const departments = {
  1: {
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
  },
  2: {
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
  },
  5: {
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
  },
  6: {
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
  },
  7: {
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
  },
  8: {
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
  },
  9: {
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
};

const fakeAPI = (filter, delay, value) => new Promise(((resolve) => {
  setTimeout(resolve, delay, value.filter(o => o.title === filter || filter === ''));
}));

const tokenTypes = [
  {
    id:          'date',
    label:       'ticket-date',
    widget:      'DateTimeInput',
    props:       {},
    showOnFocus: true,
    description: 'Date the ticket was submitted',
    scopes:      ['ticket']
  },
  {
    id:          'date-ticket-created',
    widget:      'DateTimeInput',
    showOnFocus: true,
    props:       {},
    description: 'When the ticket was created',
    scopes:      ['ticket']
  },
  {
    id:          'date-ticket-resolved',
    widget:      'DateTimeInput',
    props:       {},
    description: 'When the ticket was resolved'
  },
  {
    id:          'user-message',
    widget:      'TextInput',
    props:       {},
    description: 'Message entered initially by the user'
  },
  {
    id:          'person-name',
    widget:      'TextInput',
    props:       {},
    description: 'Name of the person who opened the ticket',
    category:    'person'
  },
  {
    id:          'person-cc',
    widget:      'TextInput',
    props:       {},
    description: 'Name of the person cc to the ticket',
    category:    'person'
  },
  {
    id:          'organization-name',
    widget:      'TextInput',
    props:       {},
    description: 'Name of the organisation',
    category:    'organisation',
    scopes:      ['organisation']
  },
  {
    id:          'organization-domain',
    widget:      'TextInput',
    props:       {},
    description: 'Domain name of the organisation',
    category:    'organisation'
  },
  {
    id:     'attach-size',
    widget: 'NumericRangeInput',
    props:  {
      unitPhrase:       'MB',
      convertFromValue: value => Math.round(value / 1024 / 1024),
      convertToValue:   value => value * 1024 * 1024,
    }
  },
  {
    id:     'country-async',
    widget: 'SelectInput',
    props:  {
      dataSource: {
        getOptions:  () => fakeAPI('', 3000, countries), findOptions: filter => fakeAPI(filter, 3000, countries)
      },
      renderHeader: <h3>Countries</h3>,
      showSearch:   false
    },
  },
  {
    id:     'department',
    widget: 'DepartmentInput',
    props:  {
      dataSource: {
        getOptions: Immutable.fromJS(departments)
      }
    }
  },
  {
    id:     'country',
    widget: 'SelectInput',
    props:  {
      dataSource: {
        getOptions: countries
      },
      renderHeader: <h3>Countries</h3>,
      showSearch:   false,
      isMultiple:   true,
    },
    allowDuplicate: false,
    scopes:         ['ticket', 'chat']
  },
  {
    id:          'user-waiting',
    widget:      'DurationInput',
    props:       {},
    description: 'Time waited by user'
  }
];

const defaultValue = [
  {
    type:  'user-message',
    value: 'help upgrading'
  },
  {
    type:  'TEXT',
    value: 'pricing',
  },
  {
    type:  'country',
    value: ['GB'],
    meta:  [
      { label: 'United Kingdom', value: 'GB' }
    ],
  }
];

class TokenFieldStory extends React.Component {
  static propTypes = {
    defaultValue:      PropTypes.array.isRequired,
    showTokensOnFocus: PropTypes.bool,
  };

  static defaultProps = {
    showTokensOnFocus: false
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }

  handleChange = (value) => {
    this.setState({
      value
    });
  };

  addCountryToken = () => {
    this.tokenField.addTokenAndFocus('country', null, 'FR');
  };

  focus = () => {
    this.tokenField.focus();
  };

  blur = () => {
    this.tokenField.blur();
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        <TokenField
          ref={(c) => { this.tokenField = c; }}
          tokenTypes={tokenTypes}
          value={value}
          onChange={this.handleChange}
          onFocus={action('Focus')}
          onBlur={action('Blur')}
          placeholder="Search ..."
          showTokensOnFocus={this.props.showTokensOnFocus}
        />
        <br />
        <Button onClick={this.addCountryToken}>Add country token</Button>
        &nbsp;
        <Button onClick={this.focus}>Focus</Button>
        &nbsp;
        <Button onClick={this.blur}>Blur</Button>
        <h4 className={styles.title}>Available types</h4>
        <ul className={styles.title}>
          <li>attach-size (<i>NumericRangeInput</i>)</li>
          <li>country (<i>SelectInput</i>)</li>
          <li>date (<i>DateTimeInput</i>)</li>
          <li>date-ticket-created (<i>DateTimeInput</i>)</li>
          <li>date-ticket-resolved (<i>DateTimeInput</i>)</li>
          <li>user-message (<i>TextInput</i>)</li>
          <li>user-waiting (<i>DurationInput</i>)</li>
        </ul>
        <h3 className={styles.title}>Value</h3>
        <pre className={styles.code}>
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  }
}

storiesOf('TokenField', module)
  .add('TokenField', () => (
    <TokenFieldStory defaultValue={defaultValue} />
  ))
  .add('TokenField empty', () => (
    <TokenFieldStory defaultValue={[]} showTokensOnFocus />
  ))
  .add('TokenField by scope', () => (
    <TokenFieldStory defaultValue={[]} showTokensOnFocus />
  ))
;

