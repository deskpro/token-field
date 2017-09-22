import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input } from 'deskpro-components/lib/Components/Forms';
import styles from '../../styles/input.css';
import ClickOutsideInput from './ClickOutsideInput';


export default class TextInput extends React.Component {
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: ''
  };

  static moveCaretAtEnd(e) {
    const tempValue = e.target.value;
    e.target.value = '';
    e.target.value = tempValue;
  }

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      value:    props.token.value,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getValue = this.getValue.bind(this);
    this.clickOutside = this.clickOutside.bind(this);
    this.enableEditMode = this.enableEditMode.bind(this);
    this.disableEditMode = this.disableEditMode.bind(this);
  }

  getValue() {
    if (this.state.value) {
      return this.state.value;
    }
    return '________';
  }

  handleChange(value) {
    this.setState({
      value
    });
  }

  handleKeyDown(e) {
    switch (e.which) {
      case 27:
        this.setState({
          value: this.props.token.value
        });
        this.disableEditMode();
        break;
      case 13:
        this.disableEditMode();
        break;
      default:
    }
  }

  clickOutside() {
    this.disableEditMode();
  }

  enableEditMode() {
    this.setState({
      editMode: true
    });
    setTimeout(() => {
      this.input.focus();
    }, 10);
  }

  disableEditMode() {
    this.setState({
      editMode: false
    });
  }

  render() {
    const { token, className } = this.props;
    const { value, editMode } = this.state;
    return (
      <div className={classNames(styles.token, className)}>
        <div className={classNames(styles.label, 'dp-code')}>
          {token.type}:
        </div>
        { editMode ?
          <ClickOutsideInput
            onClickOutside={this.clickOutside}
          >
            <Input
              value={value}
              className={styles.input}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              ref={(c) => { this.input = c; }}
              onFocus={TextInput.moveCaretAtEnd}
              placeholder="________"
            />
          </ClickOutsideInput>
          : <span className={styles.value} onClick={this.enableEditMode}>{this.getValue()}</span>
        }
      </div>
    );
  }
}
