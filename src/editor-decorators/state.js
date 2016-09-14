import React, { Component } from 'react';
import { Raw, Plain } from 'slate';
import { batch } from '../utils/batch';

const parseValue = (value, initialState) => {
  try { return Raw.deserialize(value, { terse: true }); }
  catch (err) { return initialState ? Raw.deserialize(initialState, { terse: true }) : Plain.deserialize(''); }
};
const defaultGetValue = ({ value }) => value;
const defaultChangeValue = ({ onChange }, value) => onChange ? onChange(value) : null;

export default (getValue = defaultGetValue, changeValue = defaultChangeValue, opt = {}) => {
  return Editor => class SlateStateDecorator extends Component {
    static propTypes = { }
    batch = batch(300);
    rawValue = null;

    constructor(props) {
      super();
      this.rawValue = getValue(props);
      this.value = parseValue(this.rawValue, opt.initialState);
    }

    shouldComponentUpdate(props) {
      const newValue = getValue(props);
      const oldValue = getValue(this.props);
      if (newValue !== oldValue && this.rawValue !== newValue) {
        this.value = parseValue(newValue);
        return true;
      } return false;
    }

    changeValue = value => {
      this.value = value;
      this.forceUpdate();
      if (changeValue) {
        const rawValue = Raw.serialize(value, { terse: true });
        if (JSON.stringify(this.rawValue) !== JSON.stringify(rawValue)) {
          this.rawValue = rawValue;
          this.batch(() => changeValue(this.props, rawValue));
        }
      }
    }

    render() {
      return (
        <Editor {...this.props} value={this.value} onChange={this.changeValue} />
      );
    }
  };
};
