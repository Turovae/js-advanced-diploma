const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain',
  * [Symbol.iterator](level) {
    const props = Object.values(this);
    let i = Number.isInteger(level) ? (level - 1) % props.length : 0;
    while (true) {
      yield props[i];
      i = (i + 1) % props.length;
    }
  },
};

export default themes;
