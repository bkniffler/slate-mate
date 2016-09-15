import React, { Component, Children, PropTypes } from 'react';
import Portal from 'react-portal';
import { getCollapsedClientRect } from '../utils/range';
import addBlock from '../utils/add-block';
import { hasBlock } from '../utils/has';

export default (options = {}) => {
  let { sidebarTypes, defaultNode } = options;
  if (!defaultNode) defaultNode = 'paragraph';
  if (!sidebarTypes) sidebarTypes = [];

  return Editor => class SlateSidebarDecorator extends Component {
    static propTypes = {
      sidebarTypes: PropTypes.array,
      children: PropTypes.node,
      value: PropTypes.object,
      onChange: PropTypes.func,
    }
    static defaultProps = {
      sidebarTypes: [],
      children: [],
    }
    state = { menu: null };
    componentDidMount() {
      const { sideBarMenu } = this.state;
      const { value } = this.props;
      if (!sideBarMenu) return;

      if (value.isBlurred || !value.isCollapsed) {
        sideBarMenu.removeAttribute('style');
        return;
      }

      const rect = getCollapsedClientRect();
      if (!rect) {
        sideBarMenu.style.opacity = 0;
        sideBarMenu.style.top = '-10000px';
        sideBarMenu.style.left = '-10000px';
        return;
      }
      sideBarMenu.style.opacity = 1;
      const top = rect.top + window.scrollY - sideBarMenu.offsetHeight / 2 + rect.height / 2; // eslint-disable-line
      const left = (rect.left + window.scrollX) - sideBarMenu.offsetWidth;
      sideBarMenu.style.top = `${top}px`;
      sideBarMenu.style.left = `${left}px`;
    }
    componentDidUpdate() {
      this.componentDidMount();
    }
    onClickBlock = (e, type, atomic) => {
      const { value, onChange } = this.props;
      e.preventDefault();
      onChange(addBlock(value, type, defaultNode, atomic));
    }
    renderButton = ({ type, atomic }) => {
      const { value } = this.props;
      const isActive = hasBlock(value, type);
      const onMouseDown = e => this.onClickBlock(e, type, atomic);
      return (
        <div onMouseDown={onMouseDown} data-active={isActive} key={type} className="slate-sidebar-item">
          {type}
        </div>
      );
    }
    onOpenSidebar = ({ firstChild: sideBarMenu }) => {
      this.setState({ sideBarMenu });
    }
    renderSidebar = () => {
      const theSidebarTypes = [...sidebarTypes, ...this.props.sidebarTypes];
      return (
        <Portal isOpened onOpen={this.onOpenSidebar} key="sidebar-0">
          <div className="slate-sidebar">
            <i className="fa fa-plus slate-sidebar-icon" />
            <div className="slate-sidebar-menu">
              {theSidebarTypes.map(this.renderButton)}
            </div>
          </div>
        </Portal>
      );
    }
    render() {
      const children = [
        ...Children.toArray(this.props.children),
        this.renderSidebar(),
      ];
      return (
        <Editor {...this.props} children={children} />
      );
    }
  };
};
