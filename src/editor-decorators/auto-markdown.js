import React, { Component, PropTypes } from 'react';

const defaultEmptyFunc = () => null;
export default (options = {}) => {
  const { getMarkdownType } = options;
  return Editor => class SlateAutoMarkdownDecorator extends Component {
    static propTypes = {
      plugins: PropTypes.array,
      getMarkdownType: PropTypes.func,
    }
    static defaultProps = {
      plugins: [],
    }
    onSpace = (e, state) => {
      if (state.isExpanded) return undefined;
      const { startBlock, startOffset } = state;
      const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '');
      const getType = getMarkdownType || this.props.getMarkdownType || defaultEmptyFunc;
      const type = getType(chars);

      if (!type) return undefined;
      if (type === 'bulleted-list-item' && startBlock.type === 'bulleted-list-item') return undefined;
      if (type === 'numbered-list-item' && startBlock.type === 'numbered-list-item') return undefined;
      e.preventDefault();

      let transform = state
        .transform()
        .setBlock(type);

      if (type === 'bulleted-list-item') transform = transform.wrapBlock('bulleted-list');
      if (type === 'numbered-list-item') transform = transform.wrapBlock('numbered-list');

      return transform
        .extendToStartOf(startBlock)
        .delete()
        .apply();
    }
    onEnter = (e, state) => {
      if (state.isExpanded) return undefined;
      const { startBlock, startOffset, endOffset } = state;
      if (startOffset === 0 && startBlock.length === 0) {
        return this.onBackspace(e, state);
      }
      if (endOffset !== startBlock.length) {
        return undefined;
      }

      if (
        startBlock.type !== 'heading-one' &&
        startBlock.type !== 'heading-two' &&
        startBlock.type !== 'heading-three' &&
        startBlock.type !== 'heading-four' &&
        startBlock.type !== 'heading-five' &&
        startBlock.type !== 'heading-six' &&
        startBlock.type !== 'block-quote'
      ) {
        return undefined;
      }

      e.preventDefault();
      return state
        .transform()
        .splitBlock()
        .setBlock('paragraph')
        .apply();
    }
    onBackspace = (e, state) => {
      if (state.isExpanded) return undefined;
      if (state.startOffset !== 0) return undefined;
      const { startBlock } = state;

      if (startBlock.type === 'paragraph') return undefined;
      e.preventDefault();

      let transform = state
        .transform()
        .setBlock('paragraph');

      if (startBlock.type === 'bulleted-list-item') {
        transform = transform.unwrapBlock('bulleted-list');
      } else if (startBlock.type === 'numbered-list-item') {
        transform = transform.unwrapBlock('numbered-list');
      }

      return transform.apply();
    }
    onBackspace = (e, state) => {
      if (state.isExpanded) return undefined;
      if (state.startOffset !== 0) return undefined;
      const { startBlock } = state;

      if (startBlock.type === 'paragraph') return undefined;
      e.preventDefault();

      let transform = state
        .transform()
        .setBlock('paragraph');

      if (startBlock.type === 'bulleted-list-item') {
        transform = transform.unwrapBlock('bulleted-list');
      } else if (startBlock.type === 'numbered-list-item') {
        transform = transform.unwrapBlock('numbered-list');
      }

      return transform.apply();
    }
    onKeyDown = (e, data, state) => {
      switch (data.key) {
        case 'space': return this.onSpace(e, state);
        case 'backspace': return this.onBackspace(e, state);
        case 'enter': return this.onEnter(e, state);
        default: return undefined;
      }
    }
    render() {
      const plugins = [...this.props.plugins, this];
      return (
        <Editor {...this.props} plugins={plugins} />
      );
    }
  };
};
