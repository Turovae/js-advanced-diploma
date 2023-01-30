import Character from '../Character';
import Bowman from '../characters/Bowman';

test('test throw error from new Character(level)', () => {
  expect(() => {
    // eslint-disable-next-line no-new
    new Character(1);
  }).toThrow('Запрещено создавать экземпляр класса Character!');
});

test('test creating character from a descedant class', () => {
  expect(() => {
    // eslint-disable-next-line no-new
    new Bowman(1);
  }).not.toThrow('Запрещено создавать экземпляр класса Character!');
});
