import React, { Component, PropTypes } from 'react';
import { useBlockBase, useBlockResize, useBlockAlign, useBlockToolbar } from 'slate-mate';

const defaultVideo = 'https://www.youtube.com/embed/zalYJacOhpo';
const actions = props => [{
  type: 'youtube.src',
  icon: 'picture-o',
  toggle: () => {
    const { setData, getData } = props;
    const currentUrl = getData('src') || defaultVideo;
    const src = window.prompt('URL', currentUrl);
    if (src) setData({ src });
  },
  active: false,
}];

@useBlockBase()
@useBlockAlign()
@useBlockResize({ ratio: 7 / 4, coverOnResize: true })
@useBlockToolbar({ actions, remove: true, move: true })
export default class YoutubeBlock extends Component {
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
    const src = getData('src', defaultVideo);

    const styles = {
      backgroundColor: 'gray',
      position: 'relative',
      zIndex: 2,
      ...style,
    };

    const innerStyle = {
      display: 'block',
    };

    return (
      <div {...attributes} style={styles} className={className} data-block-active={isFocused}>
        <iframe width="100%" height="100%" src={src} frameBorder="0" allowFullScreen style={innerStyle} />
        {children}
      </div>
    );
  }
}
