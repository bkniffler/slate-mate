import React from 'react';
import Editor from './editor/editor';

export default class Example extends React.Component {
  render() {
    const view = 'edit';
    const data = null;
    return (
      <div className="flex-container">
        <div className="head">
          <div className="logo">Slate-Mate</div>
          <a className="github-button" href="https://github.com/bkniffler/slate-mate/" target="_blank">
            View on Github
          </a>
          <button className={"button" + (view === 'json' ? ' active' : '') } onClick={() => this.setState({ view: 'json' }) }>
            See JSON
          </button>
          <button className={"button" + (view === 'edit' ? ' active' : '') } onClick={() => this.setState({ view: 'edit' }) }>
            See Editor
          </button>
          <button className="button" onClick={this.save}>
            Save to localstorage
          </button>
        <button className="button" onClick={(v) => this.setState({ data: null }) }>
          Clear
        </button>
      </div>
      <div className="container-content" style={{ display: view === 'json' ? 'block' : 'none' }}>
        <pre style={{ whiteSpace: 'pre-wrap', width: '750px', margin: 'auto' }}>
          {JSON.stringify(data, null, 3) }
        </pre>
      </div>
        <div className="container-content" style={{ display: view !== 'json' ? 'block' : 'none' }}>
          <div className="TeXEditor-root">
            <div className="TeXEditor-editor">
              <Editor
                onChange={data => console.log('CHANGED') }
                value={data}
              />
            </div>
          </div>
        </div>
      </div >
    );
  }
}
