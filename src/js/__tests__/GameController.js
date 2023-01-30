import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import GameController from '../GameController';
// import GamePlay from '../GamePlay';
// import GameStateService from '../GameStateService';

test.each([
  [new Bowman(1), '\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50'],
  [new Daemon(1), '\u{1F396}1 \u{2694}10 \u{1F6E1}10 \u{2764}50'],
  [new Magician(1), '\u{1F396}1 \u{2694}10 \u{1F6E1}40 \u{2764}50'],
  [new Swordsman(1), '\u{1F396}1 \u{2694}40 \u{1F6E1}10 \u{2764}50'],
  [new Undead(1), '\u{1F396}1 \u{2694}40 \u{1F6E1}10 \u{2764}50'],
  [new Vampire(1), '\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50'],
  [new Bowman(2), '\u{1F396}2 \u{2694}25 \u{1F6E1}25 \u{2764}50'],
  [new Daemon(2), '\u{1F396}2 \u{2694}10 \u{1F6E1}10 \u{2764}50'],
  [new Magician(2), '\u{1F396}2 \u{2694}10 \u{1F6E1}40 \u{2764}50'],
  [new Swordsman(2), '\u{1F396}2 \u{2694}40 \u{1F6E1}10 \u{2764}50'],
  [new Undead(2), '\u{1F396}2 \u{2694}40 \u{1F6E1}10 \u{2764}50'],
  [new Vampire(2), '\u{1F396}2 \u{2694}25 \u{1F6E1}25 \u{2764}50'],
])(
  'test GameController.characterInfo',
  (character, expected) => {
    expect(GameController.characterInfo(character)).toBe(expected);
  },
);
