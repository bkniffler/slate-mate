import injector from 'react-frame-aware-selection-plugin';
injector();

export { useBlockBase, useBlockResize, useBlockAlign, useBlockToolbar } from './block-decorators';
export { withState, withSidebar, withToolbar, withAutoMarkdown, useBlocks } from './editor-decorators';
export { Block, Editor } from 'slate';
export SlateMate from './editor';
