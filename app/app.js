import React from 'react';
import { Editor } from 'slate-mate';
import { options, initialState } from './editor';
import classNames from 'classnames';

export default class Example extends React.Component {
  state = { view: null, data: initialState }
  render() {
    const { view, data } = this.state;
    return (
      <div className="flex-container">
        <div className="head">
          <div className="logo">Slate-Mate</div>
          <a className="github-button" href="https://github.com/bkniffler/slate-mate/" target="_blank">
            View on Github
          </a>
          <button className={classNames('button', { active: view === 'json' })} onClick={() => this.setState({ view: 'json' }) }>
            See JSON
          </button>
          <button className={classNames('button', { active: !view })} onClick={() => this.setState({ view: null }) }>
            See Editor
          </button>
          <button className="button" onClick={(v) => this.setState({ data: null }) }>
            Clear
          </button>
        </div>
        <div className="container-content" style={{ display: view === 'json' ? 'block' : 'none' }}>
          <pre style={{ whiteSpace: 'pre-wrap', width: '750px', margin: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <div className="container-content" style={{ display: view !== 'json' ? 'block' : 'none' }}>
          <div className="TeXEditor-root">
            <div className="TeXEditor-editor">
              <Editor
                {...options}
                onChange={data => this.setState({ data }) }
                value={data}
              />
            </div>
          </div>
        </div>
      </div >
    );
  }
}
