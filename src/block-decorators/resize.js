import React, { Component, PropTypes } from 'react';
import { DraggableCore } from 'react-draggable';

const Cover = ({ children, style }) => (
  <div style={{ backgroundColor: 'black', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }}>{children}</div>
);

export default (options = {}) => Block => {
  const { ratio, relative, coverOnResize } = options;
  return class ResizeableDecorator extends Component {
    static slate = Block.slate;
    static propTypes = {
      getData: PropTypes.func,
      setData: PropTypes.func,
      editor: PropTypes.object,
      style: PropTypes.object,
    }
    state = {
      resize: false,
      width: null,
      height: null,
    };
    getSize = (args = {}) => {
      const { getData } = this.props;
      const width = args.width || this.state.width || getData('width', 200);
      const height = args.height || this.state.height || getData('height', 200);
      return {
        width,
        height: ratio ? (width / ratio) : height,
      };
    }
    onResizeStart = () => {
      this.setState({ resize: true, ...this.getSize() });
    }
    onResizeStop = (event, { deltaX, deltaY }) => {
      const { setData } = this.props;
      const width = this.state.width + deltaX;
      const height = this.state.height + deltaY;
      setData({ width, height });
      this.setState({ resize: false, width: null, height: null });
    }
    onResize = (event, { deltaX, deltaY }) => {
      const width = this.state.width + deltaX;
      const height = this.state.height + deltaY;
      this.setState(this.getSize({ width, height }));
    }
    render() {
      const { editor } = this.props;
      const { resize } = this.state;
      const { width, height } = this.getSize();
      const style = {
        ...this.props.style,
        height: `${height}px`,
        width: `${width}px`,
      };

      const children = editor.props.readOnly ? this.props.children : [
        ...this.props.children,
        resize && coverOnResize ? <Cover key="resizableCover" style={style} children={children} /> : null,
        <DraggableCore
          key="resizableHandle"
          onStop={this.onResizeStop}
          onStart={this.onResizeStart}
          onDrag={this.onResize}
        >
          <span className="react-resizable-handle" />
        </DraggableCore>
      ];

      return <Block {...this.props} style={style} children={children} />;
    }
  };
};
