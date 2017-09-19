import React from 'react';
import PropTypes from 'prop-types';

class TextInput extends React.Component {
    static propTypes = {
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    };

    render() {
      return (
        <div>{this.props.value}</div>
      );
    }
}
export default TextInput;
