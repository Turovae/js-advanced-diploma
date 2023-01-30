import Bowman from '../characters/Bowman';
import PositionedCharacter from '../PositionedCharacter';

test.each([
  [
    new Bowman(1),
    0,
    {
      character: {
        level: 1,
        type: 'bowman',
        attack: 25,
        defence: 25,
        health: 50,
      },
      position: 0,
    },
  ],
  [
    new Bowman(1),
    10,
    {
      character: {
        level: 1,
        type: 'bowman',
        attack: 25,
        defence: 25,
        health: 50,
      },
      position: 10,
    },
  ],
  [
    new Bowman(1),
    25,
    {
      character: {
        level: 1,
        type: 'bowman',
        attack: 25,
        defence: 25,
        health: 50,
      },
      position: 25,
    },
  ],
  [
    new Bowman(1),
    30,
    {
      character: {
        level: 1,
        type: 'bowman',
        attack: 25,
        defence: 25,
        health: 50,
      },
      position: 30,
    },
  ],
  [
    new Bowman(1),
    35,
    {
      character: {
        level: 1,
        type: 'bowman',
        attack: 25,
        defence: 25,
        health: 50,
      },
      position: 35,
    },
  ],
  [
    new Bowman(1),
    40,
    {
      character: {
        level: 1,
        type: 'bowman',
        attack: 25,
        defence: 25,
        health: 50,
      },
      position: 40,
    },
  ],
])(
  'test PositionedCharacter with position %d',
  ('', (character, position, expected) => {
    expect(new PositionedCharacter(character, position)).toEqual(expected);
  }),
);

test.each([
  ['undefined character argument', undefined, 1, 'character must be instance of Character or its children'],
  ['string character argument', 'string', 1, 'character must be instance of Character or its children'],
  ['wrong object character argument', new Date(), 1, 'character must be instance of Character or its children'],
  ['wrong position argument', new Bowman(1), '1', 'position must be a number'],
])(
  'test create PositionCharacter',
  (
    'with %s',
    (_, character, position, expected) => {
      expect(() => {
        // eslint-disable-next-line no-new
        new PositionedCharacter(character, position);
      }).toThrow(expected);
    }
  ),
);
