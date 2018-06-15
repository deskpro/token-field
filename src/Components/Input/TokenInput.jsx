import React from 'react';
import PropTypes from 'prop-types';
import Tether from 'react-tether';
import classNames from 'classnames/bind';
import styles from '../../styles/style.css';
import ClickOutsideInput from './ClickOutsideInput';

export default class TokenInput extends React.Component {
  static propTypes = {
    type:        PropTypes.string.isRequired,
    renderInput: PropTypes.func.isRequired,
    renderValue: PropTypes.func.isRequired,
    className:   PropTypes.string,
    onFocus:     PropTypes.func,
    onBlur:      PropTypes.func,
    removeToken: PropTypes.func.isRequired,
    detached:    PropTypes.bool,
  };
  static defaultProps = {
    className: '',
    detached: false,
    onFocus() {},
    onBlur() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
    };
    this.hasToFocus = false;
    this.cx = classNames.bind(styles);
  }

  componentDidUpdate() {
    if (this.hasToFocus) {
      this.hasToFocus = false;
      this.props.onFocus(this.fromEnd);
    }
  }

  clickOutside = () => {
    this.disableEditMode();
  };

  focus = (end) => {
    this.enableEditMode(end);
  };

  enableEditMode = (end) => {
    this.hasToFocus = true;
    this.fromEnd = !!end;
    this.setState({
      editMode: true
    });
  };

  disableEditMode = () => {
    this.props.onBlur();
    this.setState({
      editMode: false
    });
  };

  renderDetached = () => {
    const { type, renderValue, renderInput } = this.props;
    const { editMode } = this.state;
    return (
      <div>
        { editMode ?
            <Tether
              style={{ zIndex: 100 }}
              attachment="top left"
              targetAttachment="top right"
            >
              <div className={classNames(styles.label, 'dp-code', 'label', 'edit')}>
                {type}:
              </div>
              <ClickOutsideInput onClickOutside={this.clickOutside}>
                {renderInput()}
              </ClickOutsideInput>
            </Tether>
            :
            <div className={classNames(styles.label, 'dp-code', 'label')}>
              {type}:
            </div>
        }
        <span className={classNames(styles.value, 'value')} onClick={this.enableEditMode}>
            {renderValue()}
        </span>
      </div>
    )
  };

  render() {
    const { type, renderValue, renderInput, className, detached } = this.props;
    const { editMode } = this.state;
    return (
      <div className={this.cx('token', { active: editMode }, className)}>
        {
          detached ? this.renderDetached() :
          <div>
            <div className={classNames(styles.label, 'dp-code', 'label')}>
              {type}:
            </div>
            { editMode ?
              <ClickOutsideInput onClickOutside={this.clickOutside}>
                {renderInput()}
              </ClickOutsideInput>
              : <span className={classNames(styles.value, 'value')} onClick={this.enableEditMode}>
                {renderValue()}
              </span>
            }
          </div>
        }
        <div className={this.cx('token-remove', 'remove')} onClick={this.props.removeToken}>X</div>
      </div>
    );
  }
}
