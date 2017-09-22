import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { objectKeyFilter } from 'deskpro-components/lib/utils/objects';
import noop from 'deskpro-components/lib/utils/noop';

class InputContent extends React.Component {
  static propTypes = {
    /**
     * Children to render.
     */
    children:                PropTypes.node.isRequired,
    /**
     * Called when the user clicks outside of the button.
     */
    onClickOutside:          PropTypes.func,
    /**
     * Disables outside click listening by explicitly removing the event listening bindings.
     */
    disableOnClickOutside:   PropTypes.func,
    /**
     * Enables outside click listening by setting up the event listening bindings.
     */
    enableOnClickOutside:    PropTypes.func,
    /**
     * Whether the event should be propagated
     */
    stopPropagation:         PropTypes.bool,
    /**
     * Whether the event should prevent default behaviour
     */
    preventDefault:          PropTypes.bool,
    /**
     * Property passed by OnClickOutside HOC
     */
    eventTypes:              PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    /**
     * Property passed by OnClickOutside HOC
     */
    outsideClickIgnoreClass: PropTypes.string,
  };

  static defaultProps = {
    onClickOutside:          noop,
    disableOnClickOutside:   noop,
    enableOnClickOutside:    noop,
    stopPropagation:         false,
    preventDefault:          false,
    eventTypes:              ['mousedown', 'touchstart'],
    outsideClickIgnoreClass: '',
  };

  handleClickOutside(event) {
    this.props.onClickOutside(event);
  }

  render() {
    const { children, ...props } = this.props;
    const style = {
      display: 'inline-block'
    };
    return (
      <div {...objectKeyFilter(props, InputContent.propTypes)} style={style}>{children}</div>
    );
  }
}

export default onClickOutside(InputContent);
