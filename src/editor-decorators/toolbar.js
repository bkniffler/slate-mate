import React, { Component, Children, PropTypes } from 'react';
import Portal from 'react-portal';
import { getVisibleSelectionRect } from '../utils/range';
import { hasBlock, hasMark } from '../utils/has';
import addBlock from '../utils/add-block';

export default (options = {}) => {
  let { defaultNode, toolbarTypes, toolbarMarks } = options;
  if (!defaultNode) defaultNode = 'paragraph';
  if (!toolbarTypes) toolbarTypes = [];
  if (!toolbarMarks) toolbarMarks = [];

  return Editor => class SlateToolbarDecorator extends Component {
    static propTypes = {
      toolbarMarks: PropTypes.array,
      toolbarTypes: PropTypes.array,
      children: PropTypes.node,
      value: PropTypes.object,
      onChange: PropTypes.func,
    }
    static defaultProps = {
      toolbarMarks: [],
      toolbarTypes: [],
      children: [],
    }
    state = { menu: null };
    componentDidMount() {
      const { menu } = this.state;
      const { value } = this.props;
      if (!menu) return;

      if (value.isBlurred || value.isCollapsed) {
        menu.removeAttribute('style');
        return;
      }

      const rect = getVisibleSelectionRect();
      if (!rect) return;
      const top = (rect.top + window.scrollY) - menu.offsetHeight;
      const left = rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2; // eslint-disable-line
      menu.style.opacity = 1;
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
    }
    componentDidUpdate() {
      this.componentDidMount();
    }
    onClickBlock = (e, props) => {
      const { value, onChange } = this.props;
      e.preventDefault();
      onChange(addBlock(value, props, defaultNode));
    }
    renderBlockButton = (props) => {
      const { value } = this.props;
      const isActive = hasBlock(value, props.type);
      const onMouseDown = e => this.onClickBlock(e, props);

      return (
        <span key={props.type} className="slate-toolbar-item" onMouseDown={onMouseDown} data-active={isActive}>
          <i className={`fa fa-${props.icon}`} />
        </span>
      );
    }
    onClickMark = (e, type) => {
      e.stopPropagation();
      e.preventDefault();
      let { value } = this.props;

      value = value
        .transform()
        .toggleMark(type)
        .apply();

      this.props.onChange(value);
    }
    renderMarkButton = (props) => {
      const { value } = this.props;
      const isActive = hasMark(value, props.type);
      const onMouseDown = e => this.onClickMark(e, props);

      return (
        <span key={props.type} className="slate-toolbar-item" onMouseDown={onMouseDown} data-active={isActive}>
          <i className={`fa fa-${props.icon}`} />
        </span>
      );
    }
    onOpen = ({ firstChild: menu }) => {
      this.setState({ menu });
    }
    renderMenu = () => {
      const theToolbarMarks = [...toolbarMarks, ...this.props.toolbarMarks];
      const theToolbarTypes = [...toolbarTypes, ...this.props.toolbarTypes];
      // const isOpen = editorState.isExpanded && editorState.isFocused;
      return (
        <Portal isOpened onOpen={this.onOpen} key="toolbar-0">
          <div className="slate-toolbar slate-text-toolbar">
            {theToolbarMarks.map(this.renderMarkButton)}
            {theToolbarTypes.map(this.renderBlockButton)}
          </div>
        </Portal>
      );
    }
    render() {
      const children = [
        ...Children.toArray(this.props.children),
        this.renderMenu(),
      ];
      return (
        <Editor {...this.props} children={children} />
      );
    }
  };
};
