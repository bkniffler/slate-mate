import { Editor, Mark } from 'slate';
import React, { Component, PropTypes } from 'react';
import { withState, withSidebar, withToolbar, withAutoMarkdown, useBlocks } from '../editor-decorators';

@withState()
@useBlocks()
@withAutoMarkdown()
@withToolbar()
@withSidebar()
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
    className: PropTypes.string,
  }
  render = () => {
    const { children, value, onChange, readOnly, marks, nodes, plugins, className } = this.props;
    return (
      <div className={className}>
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
