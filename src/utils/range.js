
export const getRangeClientRectsChrome = (range) => {
  var tempRange = range.cloneRange();
  var clientRects = [];

  for (
    var ancestor = range.endContainer;
    ancestor != null;
    ancestor = ancestor.parentNode
  ) {
    var atCommonAncestor = ancestor === range.commonAncestorContainer;
    if (atCommonAncestor) {
      tempRange.setStart(range.startContainer, range.startOffset);
    } else {
      tempRange.setStart(tempRange.endContainer, 0);
    }
    var rects = Array.from(tempRange.getClientRects());
    clientRects.push(rects);
    if (atCommonAncestor) {
      clientRects.reverse();
      return [].concat(...clientRects);
    }
    tempRange.setEndBefore(ancestor);
  }

  throw new Error('Found an unexpected detached subtree when getting range client rects.');
};

export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
export const getRangeClientRects = isChrome ? getRangeClientRectsChrome : function(range) { return Array.from(range.getClientRects()); };

export const getRangeBoundingClientRect = (range) => {
  var rects = getRangeClientRects(range);
  var top = 0;
  var right = 0;
  var bottom = 0;
  var left = 0;

  if (rects.length) {
    ({top, right, bottom, left} = rects[0]);
    for (var ii = 1; ii < rects.length; ii++) {
      var rect = rects[ii];
      if (rect.height !== 0 || rect.width !== 0) {
        top = Math.min(top, rect.top);
        right = Math.max(right, rect.right);
        bottom = Math.max(bottom, rect.bottom);
        left = Math.min(left, rect.left);
      }
    }
  }

  return {
    top,
    right,
    bottom,
    left,
    width: right - left,
    height: bottom - top,
  };
};

export const getVisibleSelectionRect = () => {
  if (typeof window === 'undefined') return null;
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const boundingRect = getRangeBoundingClientRect(range);
  const { top, right, bottom, left } = boundingRect;

  if (top === 0 && right === 0 && bottom === 0 && left === 0) {
    return null;
  }

  return boundingRect;
};

export const getCollapsedClientRect = () => {
  const selection = document.getSelection();
  if (selection.rangeCount === 0 || !selection.getRangeAt || !selection.getRangeAt(0) || !selection.getRangeAt(0).startContainer || !selection.getRangeAt(0).startContainer.getBoundingClientRect) {
    return null;
  }

  const node = selection.getRangeAt(0).startContainer;
  const rect = node.getBoundingClientRect();
  return rect;
};
