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

export default options => Block => {
  const { ratio, relative } = options;
  return class AlignmentDecorator extends Component {
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
      const align = getData('align');
      const style = {
        ...this.props.style,
        ...getStyle(align),
      };

      const actions = [
        { type: 'align.left', icon: 'align-left', toggle: () => this.setAlignment('left'), active: align === 'left' },
        { type: 'align.center', icon: 'align-center', toggle: () => this.setAlignment(), active: !align },
        { type: 'align.right', icon: 'align-right', toggle: () => this.setAlignment('right'), active: align === 'right' },
      ];

      return (
        <Block {...this.props} actions={actions} style={style} align={align} setAlignment={this.setAlignment} />
      );
    }
  };
};
