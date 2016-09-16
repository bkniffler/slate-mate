import React, { Component } from 'react';

export default (options = {}) => Block => {
  const { isVoid, isAtomic, sidebar, label, category, icon } = options;

  return class BaseDecorator extends Component {
    static slate = { isVoid: isVoid !== false, isAtomic: isAtomic !== false, sidebar, label, category, icon };
    render() {
      const { node, editor, state } = this.props;
      const isFocused = state.selection.hasEdgeIn(node);
      const setData = data => {
        const transform = editor
          .getState()
          .transform()
          .setNodeByKey(node.key, { data: { ...node.data.toJS(), ...data } })
          .apply();
        editor.onChange(transform);
      };
      const getData = (name, defaultValue) => {
        return node.data.get(name) || defaultValue;
      };
      const children = isVoid === false ? this.props.children : null;
      // Empty children!!
      return <Block {...this.props} children={children} isFocused={isFocused} getData={getData} setData={setData} />;
    }
  };
}
