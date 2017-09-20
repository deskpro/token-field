import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '../../styles/input.css';

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

    render() {
      const { token, className } = this.props;
      return (
        <div className={classNames(styles.input, className)}>
          <div className={styles.label}>
            {token.type}:
          </div> {token.value}
        </div>
      );
    }
}
