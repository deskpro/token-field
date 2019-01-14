import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { List, ListElement, Scrollbar } from '@deskpro/react-components';
import styles from '../../styles/style.css';
import TokenInput from './TokenInput';

export default class BooleanInput extends TokenInput {
  constructor(props) {
    super(props);
    this.detached = true;

    this.state = {
      ...this.state,
      selectedOption: null,
    };

    this.cx = classNames.bind(styles);
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  }

  onFocus = () => {
    this.props.onFocus(this.props.tokenKey);
    window.document.addEventListener('keydown', this.handleKeyDown);
  };

  onBlur = () => {
    window.document.removeEventListener('keydown', this.handleKeyDown);
  };

  handleChange = (option) => {
    let value;
    if (option) {
      value = option.id === 1;
    } else {
      value = null;
    }
    this.setState({
      value,
    });
    this.props.onChange(value);
    this.disableEditMode();
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        const index = this.options.findIndex((option) => {
          if (this.state.selectedOption) {
            return option.id === this.state.selectedOption.id;
          }
          return false;
        });
        if (e.key === 'ArrowDown' && index < this.options.length - 1) {
          this.setState({
            selectedOption: this.options[index + 1]
          });
        }
        if (e.key === 'ArrowUp' && index > 0) {
          this.setState({
            selectedOption: this.options[index - 1]
          });
        }
        break;
      }
      case 'Escape':
        this.setState({
          value: this.props.token.value
        });
        this.disableEditMode();
        break;
      case 'Tab':
        if (e.shiftKey) {
          this.props.selectPreviousToken();
        } else {
          this.handleChange(this.state.selectedOption);
          this.props.selectNextToken();
        }
        this.disableEditMode();
        break;
      case ' ':
      case 'Enter':
        this.handleChange(this.state.selectedOption);
        this.props.selectNextToken();
        break;
      default:
        return true;
    }
    e.stopPropagation();
    e.preventDefault();
    return true;
  };

  renderInput = () => (
    <div className="dp-select">
      <div className="dp-select__content">
        <Scrollbar>
          <List className="dp-selectable-list">
            {this.renderOptions()}
          </List>
        </Scrollbar>
      </div>
    </div>
  );

  renderOptions = () => {
    const { value, selectedOption } = this.state;
    const { translations } = this.props;
    this.options = [
      {
        id:    1,
        label: translations.true,
      },
      {
        id:    0,
        label: translations.false,
      }
    ];
    return (
      this.options.map((option) => {
        const key = option.id;
        const currentValue = key === parseInt(value, 10) ? styles['current-value'] : '';
        const selected = (selectedOption && option.id === selectedOption.id) ? styles.selected : '';
        return (
          <ListElement
            key={key}
            className={this.cx(currentValue, selected, 'option')}
            onClick={() => this.handleChange(option)}
          >
            {option.label}
          </ListElement>
        );
      }));
  };

  renderValue = () => {
    if (this.state.value === true) {
      return this.props.translations.true;
    } else if (this.state.value === false) {
      return this.props.translations.false;
    }
    return '________';
  };
}

BooleanInput.propTypes = {
  ...TokenInput.propTypes,
  token: PropTypes.shape({
    type:  PropTypes.string,
    value: PropTypes.bool,
  }).isRequired,
  translations: PropTypes.shape({
    true:  PropTypes.string,
    false: PropTypes.string
  })
};

BooleanInput.defaultProps = {
  ...TokenInput.defaultProps,
  translations: {
    true:  'Yes',
    false: 'No',
  }
};
