import React from 'react';
import PropTypes from 'prop-types';
import Tether from 'react-tether';
import classNames from 'classnames/bind';
import styles from '../../styles/style.css';
import ClickOutsideInput from './ClickOutsideInput';

export default class TokenInput extends React.Component {
  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    token: PropTypes.shape({
      type:  PropTypes.string,
      value: PropTypes.object,
    }).isRequired,
    onChange:            PropTypes.func,
    onFocus:             PropTypes.func,
    onBlur:              PropTypes.func,
    selectPreviousToken: PropTypes.func.isRequired,
    selectNextToken:     PropTypes.func.isRequired,
    label:               PropTypes.string.isRequired,
    className:           PropTypes.string,
    removeToken:         PropTypes.func.isRequired,
    zIndex:              PropTypes.number,
    tokenKey:            PropTypes.number,
  };
  /* eslint-enable react/no-unused-prop-types */

  static defaultProps = {
    className: '',
    onChange() {},
    onFocus() {},
    onBlur() {},
    zIndex:    100,
    tokenKey:  null,
  };

  constructor(props) {
    super(props);
    this.detached = false;
    this.state = {
      editMode: false,
      value:    props.token.value,
    };
    this.hasToFocus = false;
    this.cx = classNames.bind(styles);
  }

  componentDidUpdate() {
    if (this.hasToFocus) {
      this.hasToFocus = false;
      this.onFocus(this.fromEnd);
    }
  }

  onFocus = () => {};

  onBlur = () => {};

  clickOutside = () => {
    this.disableEditMode();
  };

  focus = (end) => {
    this.enableEditMode(end);
  };

  loadData = () => {};

  enableEditMode = (end) => {
    this.hasToFocus = true;
    this.fromEnd = !!end;
    this.loadData();
    this.setState({
      editMode: true
    });
    this.onFocus(this.fromEnd);
  };

  disableEditMode = (passValue = true) => {
    this.onBlur(passValue);
    this.setState({
      editMode: false
    });
  };

  handleRemove = () => {
    if (this.state.value) {
      this.setState({
        value: null
      });
    } else {
      this.props.removeToken();
    }
  };

  renderDetached = () => {
    const { label } = this.props;
    const { editMode } = this.state;
    return (
      <div>
        { editMode ?
          <Tether
            style={{ zIndex: this.props.zIndex }}
            attachment="top left"
            targetAttachment="top right"
            className="token-field-input-tether"
          >
            <div className={classNames(styles.label, 'dp-code', 'label', 'edit')}>
              {label}:
            </div>
            <ClickOutsideInput onClickOutside={this.clickOutside}>
              {this.renderInput()}
            </ClickOutsideInput>
          </Tether>
          :
          <div className={classNames(styles.label, 'dp-code', 'label')}>
            {label}:
          </div>
        }
        <span className={classNames(styles.value, 'value')} onClick={this.enableEditMode}>
          {this.renderValue()}
        </span>
      </div>
    );
  };

  renderRegular = () => {
    const { label } = this.props;
    const { editMode } = this.state;
    return (
      <div>
        <div className={classNames(styles.label, 'dp-code', 'label')}>
          {label}:
        </div>
        { editMode ?
          <ClickOutsideInput onClickOutside={this.clickOutside}>
            {this.renderInput()}
          </ClickOutsideInput>
          : <span className={classNames(styles.value, 'value')} onClick={this.enableEditMode}>
            {this.renderValue()}
          </span>
        }
      </div>
    );
  };

  render() {
    const { className } = this.props;
    const { editMode } = this.state;
    return (
      <div className={this.cx('token', { active: editMode }, className)}>
        {
          this.detached ? this.renderDetached() : this.renderRegular()
        }
        <div className={this.cx('token-remove', 'remove')} onClick={this.handleRemove}>X</div>
      </div>
    );
  }
}
