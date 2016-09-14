import React, { Component, PropTypes } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

export default options => Block => {
  const { ratio, relative } = options;
  return class ResizeableDecorator extends Component {
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
    onResizeStop = (event, { size }) => {
      const { setData } = this.props;
      setData({ width: size.width, height: size.height });
      this.setState({ resize: false, width: null, height: null });
    }
    onResize = (event, { size }) => {
      this.setState(this.getSize(size));
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
      const inner = resize
        ? <div style={{ backgroundColor: 'black', ...style }} />
        : <Block {...this.props} style={style} />;

      if (editor.readOnly) return inner;
      return (
        <Resizable
          width={width}
          height={height}
          handleSize={[20, 20]}
          minConstraints={[100, 100]}
          onResize={this.onResize}
          onResizeStart={this.onResizeStart}
          onResizeStop={this.onResizeStop}
          draggableOpts={{ enableUserSelectHack: false }}
        >
          {inner}
        </Resizable>
      );
    }
  };
};
