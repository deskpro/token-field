import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '../../styles/style.css';
import ClickOutsideInput from './ClickOutsideInput';

export default class TokenInput extends React.Component {
  static propTypes = {
    type:       PropTypes.string.isRequired,
    getInput:   PropTypes.func.isRequired,
    getValue:   PropTypes.func.isRequired,
    className:  PropTypes.string,
    focusInput: PropTypes.func,
    onBlur:     PropTypes.func,
  };
  static defaultProps = {
    className: '',
    focusInput() {},
    onBlur() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
    };
    this.clickOutside = this.clickOutside.bind(this);
    this.enableEditMode = this.enableEditMode.bind(this);
    this.focus = this.focus.bind(this);
    this.disableEditMode = this.disableEditMode.bind(this);
  }

  clickOutside() {
    this.disableEditMode();
  }

  focus() {
    this.enableEditMode();
  }

  enableEditMode() {
    this.setState({
      editMode: true
    });
    setTimeout(() => {
      this.props.focusInput();
    }, 10);
  }

  disableEditMode() {
    this.props.onBlur();
    this.setState({
      editMode: false
    });
  }

  render() {
    const { type, getValue, getInput, className } = this.props;
    const { editMode } = this.state;
    return (
      <div className={classNames(styles.token, className)}>
        <div className={classNames(styles.label, 'dp-code', 'label')}>
          {type}:
        </div>
        { editMode ?
          <ClickOutsideInput onClickOutside={this.clickOutside}>
            {getInput()}
          </ClickOutsideInput>
          : <span className={classNames(styles.value, 'value')} onClick={this.enableEditMode}>
            {getValue()}
          </span>
        }
      </div>
    );
  }
}