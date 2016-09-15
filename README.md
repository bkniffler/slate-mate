# slate-mate
Demo: [https://bkniffler.github.io/slate-mate/](https://bkniffler.github.io/slate-mate/)

[Slate](https://github.com/ianstormtaylor/slate) medium-like editor with exposed decorators and plugins.
Large parts of the code is based on @ianstormtaylor's excellent examples, so props to him.
Also, it's been a breeze to work with slate, since the API is extremely well thought through. Give it a try!

The purpose of this library is to provide a ready-to-use editor, as well as easy to use decorators for slate and atomic blocks, to help you get started as quickly as possible!
**Documentation not quite ready yet, everything still under construction!**

## Editor decorators
Most decorators will get options through decorator initialization arguments AND through the props.
- [state](https://github.com/bkniffler/slate-mate/blob/master/src/editor-decorators/state.js) (accept a raw json value, manages state, calls onChange)
- [block](https://github.com/bkniffler/slate-mate/blob/master/src/editor-decorators/blocks.js) (adds empty lines after blocks, accept 'blockTypes'-object through props and use it to construct schema nodes and sidebar items)
- [toolbar](https://github.com/bkniffler/slate-mate/blob/master/src/editor-decorators/toolbar.js) (medium like inline toolbar)
- [sidebar](https://github.com/bkniffler/slate-mate/blob/master/src/editor-decorators/sidebar.js) (+ on the side of empty lines to add atomic blocks)
- [auto-markdown](https://github.com/bkniffler/slate-mate/blob/master/src/editor-decorators/auto-markdown.js) (initialize lists with '-' or titles with '#')

## Block decorators
- [base](https://github.com/bkniffler/slate-mate/blob/master/src/block-decorators/base.js) (exposes `setData` and `getData` props for easy block data and `isFocused` prop)
- [toolbar](https://github.com/bkniffler/slate-mate/blob/master/src/block-decorators/toolbar.js) (render a block toolbar from actions, either automatically or manually via `manual: true` option and `setToolbarPosition`)
- [align](https://github.com/bkniffler/slate-mate/blob/master/src/block-decorators/align.js) (set alignment toolbar-actions, provide alignment styles, expose `setAlignment` and `alignment` prop)
- [resize](https://github.com/bkniffler/slate-mate/blob/master/src/block-decorators/resize.js) (make a block resizable, either with aspect ratio via `ratio` option or freely)

## Structure
- `/app` contains the example project with example blocks. That's what your app might look like!
- `/src` contains the sourcecode for decorators and the ready-to-use editor, as well as .less styles

## POIs
- [Usage example](https://github.com/bkniffler/slate-mate/blob/master/app/app.js)
- [Usage example](https://github.com/bkniffler/slate-mate/blob/master/app/app.js)
- [youtube-block](https://github.com/bkniffler/slate-mate/blob/master/docs/youtube-block.js)

## Example custom editor
[editor](https://github.com/bkniffler/slate-mate/blob/master/src/editor/index.js)
```jsx
import { Editor, Mark } from 'slate';
import React, { Component, PropTypes } from 'react';
import { withState, withSidebar, withToolbar, withAutoMarkdown, useBlocks } from 'slate';

@withState()
@useBlocks()
@withAutoMarkdown()
@withToolbar()
@withSidebar()
export default class SlateEditor extends Component {
  render = () => {
    const { children, value, onChange, readOnly, marks, nodes, plugins } = this.props;
    return (
      <div className="editor">
        {children}
        <Editor
          readOnly={readOnly}
          plugins={plugins}
          schema={{ marks, nodes }}
          state={value}
          onChange={onChange}
        />
      </div>
    );
  }
}
```

## Example Youtube block
[youtube-block](https://github.com/bkniffler/slate-mate/blob/master/app/blocks/youtube-block.js)

```jsx
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
```
