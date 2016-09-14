import React, { Component, PropTypes } from 'react';
import { useBlockBase, useBlockResize, useBlockAlign, useBlockToolbar } from 'slate-mate';

const defaultVideo = 'https://www.youtube.com/embed/zalYJacOhpo';
const actions = props => [{
  type: 'youtube.url',
  icon: 'picture-o',
  toggle: () => {
    const { setData, getData } = props;
    const currentUrl = getData('url') || defaultVideo;
    const url = window.prompt('URL', currentUrl);
    if (url) setData({ url });
  },
  active: false,
}];

@useBlockBase()
@useBlockAlign()
@useBlockResize({ ratio: 7 / 4 })
@useBlockToolbar({ actions })
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
    const url = getData('url', defaultVideo);

    const styles = {
      backgroundColor: 'gray',
      width: '100%',
      height: '100%',
      position: 'relative',
      ...style,
    };

    return (
      <div {...attributes} style={styles} className={className} data-block-active={isFocused}>
        <iframe width="100%" height="100%" src={url} frameBorder="0" allowFullScreen />
        {children}
      </div>
    );
  }
}
