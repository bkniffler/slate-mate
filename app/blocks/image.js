import React, { Component, PropTypes } from 'react';
import { useBlockBase, useBlockResize, useBlockAlign, useBlockToolbar } from 'slate-mate';

const defaultImage = 'whoa.jpg';
const actions = props => [{
  type: 'image.src',
  icon: 'picture-o',
  toggle: () => {
    const { setData, getData } = props;
    const currentUrl = getData('src') || defaultImage;
    const url = window.prompt('URL', currentUrl);
    if (url) setData({ url });
  },
  active: false,
}];

@useBlockBase()
@useBlockAlign()
@useBlockResize({ })
@useBlockToolbar({ actions, remove: true, move: true })
export default class ImageBlock extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    className: PropTypes.string,
    isFocused: PropTypes.bool,
    attributes: PropTypes.object,
    getData: PropTypes.func,
  }
  static title = 'Youtube';
  static icon = 'youtube';
  static category = 'Media';

  render() {
    const { style, getData, className, children, isFocused, attributes } = this.props;
    const src = getData('src', defaultImage);

    const styles = {
      backgroundColor: 'gray',
      position: 'relative',
      zIndex: 2,
      ...style,
      height: 'auto',
    };

    const innerStyle = {
      display: 'block',
    };

    return (
      <div {...attributes} style={styles} className={className} data-block-active={isFocused}>
        <img width="100%" height="auto" src={src} style={innerStyle} />
        {children}
      </div>
    );
  }
}
