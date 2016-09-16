import React, { Component, PropTypes } from 'react';
import Portal from 'react-portal';
import ReactDOM from 'react-dom';

export default (options = {}) => Block => {
  let { actions, manual, showRemove } = options;
  if (!actions) actions = () => [];
  const removeAction = showRemove ? ({ editor, state, node }) => ([{
    type: 'block.remove',
    icon: 'trash-o',
    toggle: () => {
      let newState = state.transform().unsetSelection();
      editor.onChange(
        newState.removeNodeByKey(node.key).apply()
      );
    }
  }]) : () => ([]);
  return class BlockToolbarDecorator extends Component {
    static slate = Block.slate;
    static propTypes = {
      isFocused: PropTypes.bool,
      children: PropTypes.node,
      actions: PropTypes.array,
    }
    static defaultProps = {
      actions: [],
    }
    state = { menu: null };
    componentDidMount() {
      if (manual) return;
      const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
      this.setToolbarPosition(rect);
    }
    componentDidUpdate() {
      this.componentDidMount();
    }
    setToolbarPosition = (rect) => {
      const { menu } = this.state;
      if (!menu) return;
      if (!rect) return;
      const top = (rect.top + window.scrollY) - menu.offsetHeight;
      const left = rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2; // eslint-disable-line
      menu.style.opacity = 1;
      menu.style.top = `${top - 3}px`;
      menu.style.left = `${left}px`;
    }
    onOpen = ({ firstChild: menu }) => {
      this.setState({ menu });
    }
    onClick = action => e => {
      e.preventDefault();
      action();
    }
    renderToolbar = () => {
      const allActions = [...this.props.actions, ...actions(this.props), ...removeAction(this.props)];
      return (
        <Portal onOpen={this.onOpen} isOpened={!!allActions.length} key="toolbar-0">
          <div className="slate-toolbar">
            {allActions.map(({ toggle, type, active, icon }) => (
              <span key={type} className="slate-toolbar-item" onMouseDown={this.onClick(toggle)} data-active={active}>
                <i className={`fa fa-${icon}`} />
              </span>
            ))}
          </div>
        </Portal>
      );
    }
    render() {
      const { isFocused } = this.props;
      const children = isFocused
        ? [this.props.children, this.renderToolbar()]
        : this.props.children;

      return (
        <Block
          {...this.props}
          children={children}
          setToolbarPosition={this.setToolbarPosition}
        />
      );
    }
  };
};
