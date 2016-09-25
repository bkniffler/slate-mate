import React, { Component, PropTypes } from 'react';
import Portal from 'react-portal';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export default (options = {}) => Block => {
  let { actions, manual, remove, move } = options;
  if (!actions) actions = () => [];
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
      // Get actions from props and from decorator arguments
      const allActions = [...this.props.actions, ...actions(this.props)];
      // Add remove action if (remove = true)
      if (remove) allActions.push(removeAction(this.props));
      // Add move up/down actions if (move = true)
      if (move) moveActions(this.props).forEach(action => allActions.push(action));
      return (
        <Portal onOpen={this.onOpen} isOpened={!!allActions.length} key="toolbar-0">
          <div className="slate-toolbar">
            {allActions.map(({ toggle, type, active, icon, separated }) => (
              <span key={type} className={classNames('slate-toolbar-item', { separated })} onMouseDown={this.onClick(toggle)} data-active={active}>
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
        ? [...this.props.children, this.renderToolbar()]
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

// Toolbar action to remove a block
const removeAction = ({ editor, state, node }) => ({
  type: 'block.remove',
  icon: 'trash-o',
  separated: true,
  toggle: () => {
    let newState = state.transform().unsetSelection();
    editor.onChange(
      newState.removeNodeByKey(node.key).apply()
    );
  },
});

// Toolbar actions to move a block up/down
const moveActions = ({ editor, state, node }) => ([{
  type: 'block.moveUp',
  icon: 'arrow-up',
  separated: true,
  toggle: () => {
    const { document } = state;
    const parent = document.getParent(node);
    const index = parent.nodes.indexOf(node) - 1;
    let newState = state
      .transform()
      .moveNodeByKey(node, parent, index === -1 ? 0 : index)
      .apply();
    editor.onChange(newState);
  },
}, {
  type: 'block.moveDown',
  icon: 'arrow-down',
  toggle: () => {
    const { document } = state;
    const parent = document.getParent(node);
    const index = parent.nodes.indexOf(node) + 1;
    let newState = state
      .transform()
      .moveNodeByKey(node, parent, index > parent.nodes.count() ? parent.nodes.count() : index)
      .apply();
    editor.onChange(newState);
  },
}]);
