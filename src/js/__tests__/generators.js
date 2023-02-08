import { characterGenerator, generateTeam } from '../generators';

import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Character from '../Character';

test('test characterGenerator(1)', () => {
  const playerGeneratorLevel1 = characterGenerator([Bowman, Swordsman, Magician], 1);

  expect(playerGeneratorLevel1.next().value).toBeInstanceOf(Character);
  expect(playerGeneratorLevel1.next().value.level).toBe(1);
  expect(playerGeneratorLevel1.next().value.level).toBe(1);
  expect(playerGeneratorLevel1.next().value.level).toBe(1);
  expect(playerGeneratorLevel1.next().value.level).toBe(1);
  expect(playerGeneratorLevel1.next().value.level).toBe(1);
  expect(playerGeneratorLevel1.next().value.level).toBe(1);
  expect(playerGeneratorLevel1.next().value.level).toBe(1);
  expect(playerGeneratorLevel1.next().value.level).toBe(1);
  expect(playerGeneratorLevel1.next().value.level).toBe(1);
});

describe('test generateTeam', () => {
  const playerTypes = [Bowman, Swordsman, Magician];
  const team = generateTeam(playerTypes, 3, 4);

  test('characters count', () => {
    expect(team.characters.length).toBe(4);
  });

  test.each(team.characters)(
    'test characters level',
    ('', (character) => {
      expect(character.level).toBeLessThanOrEqual(3);
      expect(character.level).toBeGreaterThanOrEqual(1);
    }),
  );
});
