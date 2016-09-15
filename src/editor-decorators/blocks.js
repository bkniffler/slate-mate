import React, { Component, PropTypes } from 'react';

export default (options = {}) => {
  let { marks, nodes, blockTypes } = options;
  if (!blockTypes) blockTypes = {};
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
      blockTypes: {},
    }
    onBeforeChange = (state) => {
      const { document } = state;
      const newBlockTypes = { ...blockTypes, ...this.props.blockTypes };
      const blocks = document.getBlocks();
      const last = blocks.last();
      if (Object.keys(newBlockTypes).indexOf(last.type) === -1) return undefined;

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
      const { sidebarTypes } = this.props;
      const plugins = [...this.props.plugins, this];
      const newNodes = {
        ...(nodes || {}),
        ...(this.props.nodes || {}),
        ...this.props.blockTypes,
        ...blockTypes,
      };
      const newMarks = {
        ...(marks || {}),
        ...(this.props.marks || {}),
      };
      const newSidebarTypes = [
        ...(sidebarTypes || []),
        ...Object.keys(blockTypes).map(key => ({ type: key, icon: blockTypes[key].icon, atomic: true })),
        ...Object.keys(this.props.blockTypes).map(key => ({ type: key, icon: this.props.blockTypes[key].icon, atomic: true })),
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
