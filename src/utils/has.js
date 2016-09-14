export const hasMark = (editorState, type) => {
  return editorState.marks.some(mark => mark.type === type);
};
export const hasBlock = (editorState, type) => {
  return editorState.blocks.some(node => node.type === type || node.type.indexOf(`${type}-`) === 0);
};
