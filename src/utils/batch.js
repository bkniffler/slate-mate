export const batch = (limit = 500) => {
  let _callback = null;
  return (callback) => {
    _callback = callback;
    setTimeout(() => {
      if (_callback === callback) {
        callback();
      }
    }, limit);
  };
};
