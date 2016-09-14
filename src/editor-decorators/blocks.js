import React, { Component, PropTypes } from 'react';

export default (options = {}) => {
  const { marks, nodes } = options;
  return Editor => class SlateBlocksDecorator extends Component {
    static propTypes = {
      sidebarTypes: PropTypes.array,
      blockTypes: PropTypes.object,
      marks: PropTypes.object,
      onChange: PropTypes.func,
      nodes: PropTypes.object,
      plugins: PropTypes.array,
    }
    static defaultProps = {
      plugins: [],
    }
    onBeforeChange = (state) => {
      const { document } = state;
      const { blockTypes } = this.props;
      if (!blockTypes) return undefined;
      const blocks = document.getBlocks();
      const last = blocks.last();
      if (Object.keys(blockTypes).indexOf(last.type) === -1) return undefined;

      const normalized = state
        .transform()
        .collapseToEndOf(last)
        .splitBlock()
        .setBlock({
          type: 'paragraph',
          isVoid: false,
          data: { },
        })
        .collapseToStartOf(last)
        .apply({ snapshot: false });

      return normalized;
    }
    render() {
      const { blockTypes, sidebarTypes } = this.props;
      const plugins = [...this.props.plugins, this];
      const newNodes = {
        ...(nodes || {}),
        ...(this.props.nodes || {}),
        ...(blockTypes || {}),
      };
      const newMarks = {
        ...(marks || {}),
        ...(this.props.marks || {}),
      };
      const newSidebarTypes = [
        ...(sidebarTypes || []),
        ...Object.keys(blockTypes || {}).map(key => ({ type: key, icon: blockTypes[key].icon, atomic: true })),
      ];
      return (
        <Editor
          {...this.props}
          plugins={plugins}
          nodes={newNodes}
          marks={newMarks}
          sidebarTypes={newSidebarTypes}
        />
      );
    }
  };
};
