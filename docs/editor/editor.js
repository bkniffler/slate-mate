import { Editor, Mark } from 'slate';
import React, { Component, PropTypes } from 'react';
import { withState, withSidebar, withToolbar, withAutoMarkdown, useBlocks } from 'slate-mate';
import options from './default-options';

@withState()
@useBlocks(options)
@withAutoMarkdown(options)
@withToolbar(options)
@withSidebar(options)
export default class SlateEditor extends Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    children: PropTypes.node,
    value: PropTypes.object,
    onChange: PropTypes.func,
    marks: PropTypes.object,
    nodes: PropTypes.object,
    autoMarkDownKeyDown: PropTypes.func,
    plugins: PropTypes.array,
  }
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
