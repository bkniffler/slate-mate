import React, { Component, PropTypes } from 'react';

const getStyle = align => {
  if (align === 'left') {
    return {
      float: 'left',
      marginRight: '10px',
    };
  } else if (align === 'right') {
    return {
      float: 'right',
      marginLeft: '10px',
    };
  } return {
    display: 'block',
    height: 'auto',
    margin: '0px auto',
  };
};

export default (options = {}) => Block => {
  const { ratio, relative, actions } = options;
  return class AlignmentDecorator extends Component {
    static slate = Block.slate;
    static propTypes = {
      getData: PropTypes.func,
      setData: PropTypes.func,
      editor: PropTypes.object,
      style: PropTypes.object,
    }
    setAlignment = (align) => {
      const { setData } = this.props;
      if (align === 'left') setData({ align });
      else if (align === 'right') setData({ align });
      else setData({ align: null });
    }
    render() {
      const { getData } = this.props;
      const alignment = getData('align');
      const style = {
        ...this.props.style,
        ...getStyle(alignment),
      };

      const alignActions = actions === false ? [] : [
        { type: 'align.left', icon: 'align-left', toggle: () => this.setAlignment('left'), active: alignment === 'left' },
        { type: 'align.center', icon: 'align-center', toggle: () => this.setAlignment(), active: !alignment },
        { type: 'align.right', icon: 'align-right', toggle: () => this.setAlignment('right'), active: alignment === 'right' },
      ];

      return (
        <Block {...this.props} actions={alignActions} style={style} alignment={alignment} setAlignment={this.setAlignment} />
      );
    }
  };
};
