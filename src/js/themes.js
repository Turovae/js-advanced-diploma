const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain',
  * [Symbol.iterator]() {
    const props = Object.values(this);
    let i = 0;
    while (true) {
      yield props[i];
      i = (i + 1) % props.length;
    }
  },
};

export default themes;
