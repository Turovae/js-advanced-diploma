import allowedDistances from '../allowedDistances';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import GameController from '../GameController';
import PositionedCharacter from '../PositionedCharacter';
import { getAttackCells, getMoveCells } from '../utils';

test.each([
  [new Bowman(1), '\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50'],
  [new Daemon(1), '\u{1F396}1 \u{2694}10 \u{1F6E1}40 \u{2764}50'],
  [new Magician(1), '\u{1F396}1 \u{2694}10 \u{1F6E1}40 \u{2764}50'],
  [new Swordsman(1), '\u{1F396}1 \u{2694}40 \u{1F6E1}10 \u{2764}50'],
  [new Undead(1), '\u{1F396}1 \u{2694}40 \u{1F6E1}10 \u{2764}50'],
  [new Vampire(1), '\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50'],
  [new Bowman(2), '\u{1F396}2 \u{2694}33 \u{1F6E1}33 \u{2764}100'],
  [new Daemon(2), '\u{1F396}2 \u{2694}13 \u{1F6E1}52 \u{2764}100'],
  [new Magician(2), '\u{1F396}2 \u{2694}13 \u{1F6E1}52 \u{2764}100'],
  [new Swordsman(2), '\u{1F396}2 \u{2694}52 \u{1F6E1}13 \u{2764}100'],
  [new Undead(2), '\u{1F396}2 \u{2694}52 \u{1F6E1}13 \u{2764}100'],
  [new Vampire(2), '\u{1F396}2 \u{2694}33 \u{1F6E1}33 \u{2764}100'],
])(
  'test GameController.characterInfo',
  (character, expected) => {
    expect(GameController.characterInfo(character)).toBe(expected);
  },
);

test('test getAllowedIndexes', () => {
  const positionedSwordsman = new PositionedCharacter(new Swordsman(1), 35);
  const distancesForSwordsman = allowedDistances[positionedSwordsman.character.type];

  expect(distancesForSwordsman).toEqual({
    steps: 4,
    attack: 1,
  });

  const allowedIndexesToMove = getMoveCells(
    positionedSwordsman.position,
    distancesForSwordsman.steps,
  );
  expect(allowedIndexesToMove.length).toBe(27);
  const allowedToAttack = getAttackCells(
    positionedSwordsman.position,
    distancesForSwordsman.attack,
  );

  expect(allowedToAttack).toEqual([26, 27, 28, 34, 36, 42, 43, 44]);
});

describe('test Bowman', () => {
  const positioned = new PositionedCharacter(new Bowman(1), 35);
  const distances = allowedDistances[positioned.character.type];

  test('distances', () => {
    expect(distances).toEqual({
      steps: 2,
      attack: 2,
    });
  });

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 26, positioned, true],
    ['selected', 8, positioned, false],
    ['selected', 17, positioned, true],
    ['selected', 11, positioned, false],
    ['selected', 19, positioned, true],
  ])(
    'test isAllowActionTo with %s and %d positon and move',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'move')).toBe(expected);
    },
  );

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 8, positioned, false],
    ['selected', 11, positioned, false],
    ['selected', 14, positioned, false],
    ['selected', 17, positioned, true],
    ['selected', 18, positioned, true],
    ['selected', 20, positioned, true],
    ['selected', 21, positioned, true],
    ['selected', 24, positioned, false],
    ['selected', 25, positioned, true],
    ['selected', 29, positioned, true],
    ['selected', 30, positioned, false],
    ['selected', 40, positioned, false],
    ['selected', 41, positioned, true],
    ['selected', 45, positioned, true],
    ['selected', 46, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and attack',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'attack')).toBe(expected);
    },
  );
});

describe('test Daemon', () => {
  const positioned = new PositionedCharacter(new Daemon(1), 7);
  const distances = allowedDistances[positioned.character.type];

  test('distances', () => {
    expect(distances).toEqual({
      steps: 1,
      attack: 4,
    });
  });

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 6, positioned, true],
    ['selected', 14, positioned, true],
    ['selected', 15, positioned, true],
    ['selected', 5, positioned, false],
    ['selected', 21, positioned, false],
    ['selected', 23, positioned, false],
    ['selected', 0, positioned, false],
    ['selected', 56, positioned, false],
    ['selected', 63, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and move',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'move')).toBe(expected);
    },
  );

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 3, positioned, true],
    ['selected', 19, positioned, true],
    ['selected', 35, positioned, true],
    ['selected', 37, positioned, true],
    ['selected', 39, positioned, true],
    ['selected', 2, positioned, false],
    ['selected', 18, positioned, false],
    ['selected', 42, positioned, false],
    ['selected', 45, positioned, false],
    ['selected', 47, positioned, false],
    ['selected', 0, positioned, false],
    ['selected', 56, positioned, false],
    ['selected', 63, positioned, false],
    ['selected', 24, positioned, false],
    ['selected', 60, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and attack',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'attack')).toBe(expected);
    },
  );
});

describe('test Magician', () => {
  const positioned = new PositionedCharacter(new Magician(1), 49);
  const distances = allowedDistances[positioned.character.type];

  test('distances', () => {
    expect(distances).toEqual({
      steps: 1,
      attack: 4,
    });
  });

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 40, positioned, true],
    ['selected', 42, positioned, true],
    ['selected', 1, positioned, false],
    ['selected', 28, positioned, false],
    ['selected', 43, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and move',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'move')).toBe(expected);
    },
  );

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 16, positioned, true],
    ['selected', 18, positioned, true],
    ['selected', 21, positioned, true],
    ['selected', 37, positioned, true],
    ['selected', 61, positioned, true],
    ['selected', 8, positioned, false],
    ['selected', 11, positioned, false],
    ['selected', 14, positioned, false],
    ['selected', 38, positioned, false],
    ['selected', 62, positioned, false],
    ['selected', 0, positioned, false],
    ['selected', 4, positioned, false],
    ['selected', 7, positioned, false],
    ['selected', 39, positioned, false],
    ['selected', 63, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and attack',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'attack')).toBe(expected);
    },
  );
});

describe('test Swordsman', () => {
  const positioned = new PositionedCharacter(new Swordsman(1), 39);
  const distances = allowedDistances[positioned.character.type];

  test('distances', () => {
    expect(distances).toEqual({
      steps: 4,
      attack: 1,
    });
  });

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 32, positioned, false],
    ['selected', 35, positioned, true],
    ['selected', 3, positioned, true],
    ['selected', 6, positioned, false],
    ['selected', 7, positioned, true],
    ['selected', 20, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and move',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'move')).toBe(expected);
    },
  );

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 30, positioned, true],
    ['selected', 31, positioned, true],
    ['selected', 38, positioned, true],
    ['selected', 46, positioned, true],
    ['selected', 47, positioned, true],
    ['selected', 21, positioned, false],
    ['selected', 23, positioned, false],
    ['selected', 37, positioned, false],
    ['selected', 53, positioned, false],
    ['selected', 55, positioned, false],
    ['selected', 16, positioned, false],
    ['selected', 24, positioned, false],
    ['selected', 32, positioned, false],
    ['selected', 40, positioned, false],
    ['selected', 48, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and attack',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'attack')).toBe(expected);
    },
  );
});

describe('test Undead', () => {
  const positioned = new PositionedCharacter(new Undead(1), 35);
  const distances = allowedDistances[positioned.character.type];

  test('distances', () => {
    expect(distances).toEqual({
      steps: 4,
      attack: 1,
    });
  });

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 26, positioned, true],
    ['selected', 34, positioned, true],
    ['selected', 17, positioned, true],
    ['selected', 11, positioned, true],
    ['selected', 19, positioned, true],
    ['selected', 20, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and move',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'move')).toBe(expected);
    },
  );
  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 26, positioned, true],
    ['selected', 27, positioned, true],
    ['selected', 28, positioned, true],
    ['selected', 34, positioned, true],
    ['selected', 36, positioned, true],
    ['selected', 42, positioned, true],
    ['selected', 43, positioned, true],
    ['selected', 44, positioned, true],
    ['selected', 17, positioned, false],
    ['selected', 19, positioned, false],
    ['selected', 21, positioned, false],
    ['selected', 33, positioned, false],
    ['selected', 37, positioned, false],
    ['selected', 50, positioned, false],
    ['selected', 52, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and attack',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'attack')).toBe(expected);
    },
  );
});

describe('test Vampire', () => {
  const positioned = new PositionedCharacter(new Vampire(1), 35);
  const distances = allowedDistances[positioned.character.type];

  test('distances', () => {
    expect(distances).toEqual({
      steps: 2,
      attack: 2,
    });
  });

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 26, positioned, true],
    ['selected', 34, positioned, true],
    ['selected', 17, positioned, true],
    ['selected', 11, positioned, false],
    ['selected', 19, positioned, true],
    ['selected', 20, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and move',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'move')).toBe(expected);
    },
  );

  test.each([
    ['not selected', 26, undefined, false],
    ['selected', 8, positioned, false],
    ['selected', 11, positioned, false],
    ['selected', 14, positioned, false],
    ['selected', 17, positioned, true],
    ['selected', 18, positioned, true],
    ['selected', 20, positioned, true],
    ['selected', 21, positioned, true],
    ['selected', 24, positioned, false],
    ['selected', 25, positioned, true],
    ['selected', 29, positioned, true],
    ['selected', 30, positioned, false],
    ['selected', 40, positioned, false],
    ['selected', 41, positioned, true],
    ['selected', 45, positioned, true],
    ['selected', 46, positioned, false],
  ])(
    'test isAllowActionTo with %s and %d positon and attack',
    (_, cell, selected, expected) => {
      expect(GameController.isAllowActionTo(selected, cell, 'attack')).toBe(expected);
    },
  );
});
