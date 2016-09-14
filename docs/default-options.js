import YoutubeBlock from './youtube-block';

export default {
  defaultNode: 'paragraph',
  blockTypes: {
    'youtube-block': YoutubeBlock,
  },
  toolbarMarks: [
    { type: 'bold', icon: 'bold' },
    { type: 'italic', icon: 'italic' },
    { type: 'underlined', icon: 'underline' },
    { type: 'code', icon: 'code' },
  ],
  toolbarTypes: [
    { type: 'heading-one', icon: 'header' },
    { type: 'heading-two', icon: 'header' },
    { type: 'block-quote', icon: 'quote-left' },
    { type: 'numbered-list', icon: 'list-ol' },
    { type: 'bulleted-list', icon: 'list-ul' },
  ],
  sidebarTypes: [],
  nodes: {
    'block-quote': ({ children }) => <blockquote>{children}</blockquote>,
    'bulleted-list': ({ children }) => <ul>{children}</ul>,
    'numbered-list': ({ children, attributes }) => <ol {...attributes}>{children}</ol>,
    'heading-one': ({ children }) => <h1>{children}</h1>,
    'heading-two': ({ children }) => <h2>{children}</h2>,
    'heading-three': ({ children }) => <h3>{children}</h3>,
    'heading-four': ({ children }) => <h4>{children}</h4>,
    'heading-five': ({ children }) => <h5>{children}</h5>,
    'heading-six': ({ children }) => <h6>{children}</h6>,
    'bulleted-list-item': ({ children }) => <li>{children}</li>,
    'numbered-list-item': ({ children }) => <li>{children}</li>,
  },
  marks: {
    bold: ({ children }) => <strong>{children}</strong>,
    code: ({ children }) => <code>{children}</code>,
    italic: ({ children }) => <em>{children}</em>,
    underlined: ({ children }) => <u>{children}</u>,
  },
  getMarkdownType: (chars) => {
    switch (chars) {
      case '*':
      case '-':
      case '+': return 'bulleted-list-item';
      case '>': return 'block-quote';
      case '#': return 'heading-one';
      case '##': return 'heading-two';
      case '###': return 'heading-three';
      case '####': return 'heading-four';
      case '#####': return 'heading-five';
      case '######': return 'heading-six';
      case '1.': return 'numbered-list-item';
      default: return null;
    }
  },
};
