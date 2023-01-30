import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.positionedCharacters = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    const playerOffset = 0;
    const enemyOffset = 8 - 2;

    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Daemon, Undead, Vampire];
    const maxLevel = 3;
    const charactersCount = Math.ceil(Math.random() * 5) + 1;
    const playerTeam = generateTeam(playerTypes, maxLevel, charactersCount);
    const enemyTeam = generateTeam(enemyTypes, maxLevel, charactersCount);
    console.log(playerTeam);
    this.placeTeam(playerTeam, playerOffset);
    this.placeTeam(enemyTeam, enemyOffset);

    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }

  placeTeam(team, offset) {
    const occupiedCells = [];

    team.forEach((character) => {
      let position;
      const isTrue = true;
      while (isTrue) {
        position = Math.floor(Math.random() * 2) + Math.floor(Math.random() * 8) * 8 + offset;
        if (!occupiedCells.includes(position)) {
          occupiedCells.push(position);
          this.positionedCharacters.push(new PositionedCharacter(character, position));
          break;
        }
      }
    });
  }
}
