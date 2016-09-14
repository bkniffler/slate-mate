import React from 'react';

export default Block => props => {
  const { node, editor, state } = props;
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
  // Empty children!!
  return <Block {...props} children={null} isFocused={isFocused} getData={getData} setData={setData} />;
};
