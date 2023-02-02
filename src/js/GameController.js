import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
// import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';
import GamePlay from './GamePlay';
import cursors from './cursors';
import allowedDistances from './allowedDistances';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.positionedCharacters = [];
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.lastClickedCell = null;

    this.enemyTypes = [Daemon, Undead, Vampire];

    this.selectedCharacter = null;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    // Отладка. Снять комментарии при удалении
    // const playerOffset = 0;
    // const enemyOffset = 8 - 2;

    // const maxLevel = 3;
    // const charactersCount = Math.ceil(Math.random() * 5) + 1; *
    // const charactersCount = 1;
    // const playerTeam = generateTeam(this.playerTypes, maxLevel, charactersCount);
    // const enemyTeam = generateTeam(this.enemyTypes, maxLevel, charactersCount);
    // this.placeTeam(playerTeam, playerOffset);
    // this.placeTeam(enemyTeam, enemyOffset);
    // 5 строки добавлено для отладки
    this.positionedCharacters = [
      new PositionedCharacter(new Bowman(1), 36),
      new PositionedCharacter(new Swordsman(1), 27),
      new PositionedCharacter(new Daemon(1), 9),
    ];
    // this.positionedCharacters[0].position = 36;
    // this.positionedCharacters[1].position = 26;

    this.gamePlay.redrawPositions(this.positionedCharacters);

    this.registerEvents();
  }

  registerEvents() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onCellClick(index) {
    // TODO: react to click
    // if (this.lastClickedCell) {
    //   this.gamePlay.deselectCell(this.lastClickedCell);
    //   this.lastClickedCell = null;
    // }

    if (this.selectedCharacter) {
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.selectedCharacter = null;
    }

    const characterClicked = this.positionedCharacters
      .find((character) => character.position === index) || null;

    if (this.isPlayer(characterClicked)) {
      this.selectedCharacter = characterClicked;
      this.gamePlay.selectCell(index);
    }

    // this.selectedCharacter = this.positionedCharacters
    //   .find((character) => character.position === index) || null;
    // if (!this.selectedCharacter) {
    //   return;
    // }

    if (this.isEnemy(characterClicked)) {
      GamePlay.showError('This is enemy character');
    }
  }

  isPlayer(testedCharacter) {
    return !!testedCharacter && this.playerTypes
      .some((acceptable) => testedCharacter.character instanceof acceptable);
  }

  isEnemy(testedCharacter) {
    return !!testedCharacter && this.enemyTypes
      .some((acceptable) => testedCharacter.character instanceof acceptable);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const hoveredCharacter = this.positionedCharacters
      .find((character) => character.position === index);
    if (hoveredCharacter) {
      this.gamePlay
        .showCellTooltip(GameController.characterInfo(hoveredCharacter.character), index);
    }

    // Если собираемся выбрать другого персонажа
    if (
      this.isPlayer(hoveredCharacter)
      && hoveredCharacter !== this.selectedCharacter
    ) {
      this.gamePlay.setCursor(cursors.pointer);
    }

    // Если собираемся перейти на другую клетку
    if (
      this.selectedCharacter
      && GameController.isAllowActionTo(this.selectedCharacter, index, 'move')
      && !hoveredCharacter
    ) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }

    // Если собираемся атаковать противника
    if (
      this.selectedCharacter
      && this.isEnemy(hoveredCharacter)
      && GameController.isAllowActionTo(this.selectedCharacter, index, 'attack')
    ) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    }

    // Если действие не допустимо
    const isHoverNotAllowAttack = this.isEnemy(hoveredCharacter) && !GameController.isAllowActionTo(this.selectedCharacter, index, 'attack');
    const isHoverNotAllowMoveTo = !(hoveredCharacter || GameController.isAllowActionTo(this.selectedCharacter, index, 'move'));
    if (this.selectedCharacter && (isHoverNotAllowAttack || isHoverNotAllowMoveTo)) {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    // Возваращаем курсор в auto
    // Переработать для дистанции атаки и движения
    this.gamePlay.setCursor(cursors.auto);
    if (this.selectedCharacter && this.selectedCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    }
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

  static characterInfo(character) {
    return `\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`;
  }

  static getAttackCells(index, distance, dimention = 8) {
    const {
      maxLeft, maxRight, maxTop, maxBottom,
    } = GameController
      .getDistanceActionLimits(index, distance, dimention);

    const indexes = [];
    for (let y = maxTop; y <= maxBottom; y += 1) {
      for (let x = maxLeft; x <= maxRight; x += 1) {
        const allowIndex = index + y * dimention + x;
        if (allowIndex !== index) {
          indexes.push(allowIndex);
        }
      }
    }
    return indexes.sort((a, b) => a - b);
  }

  static getMoveCells(index, distance, dimention = 8) {
    const {
      maxLeft, maxRight, maxTop, maxBottom,
    } = GameController
      .getDistanceActionLimits(index, distance, dimention);

    const indexes = [];
    for (let s = 1; s <= distance; s += 1) {
      for (let y = -1; y <= 1; y += 1) {
        const yStep = s * y;
        if (maxTop <= yStep && yStep <= maxBottom) {
          for (let x = -1; x <= 1; x += 1) {
            const xStep = s * x;
            if (xStep >= maxLeft && xStep <= maxRight) {
              const allowIndex = index + yStep * dimention + xStep;
              if (allowIndex !== index) {
                indexes.push(allowIndex);
              }
            }
          }
        }
      }
    }
    return indexes.sort((a, b) => a - b);
  }

  static getDistanceActionLimits(index, distance, dimention) {
    const maxLeft = -Math.min(index - Math.floor(index / dimention) * dimention, distance);
    const maxRight = Math.min(
      Math.ceil((index + 1) / dimention) * dimention - 1 - index,
      distance,
    );
    const maxTop = -Math.min(Math.floor(index / dimention), distance);
    const maxBottom = Math.min(dimention - Math.ceil(index / dimention), distance);

    return {
      maxLeft,
      maxRight,
      maxTop,
      maxBottom,
    };
  }

  static isAllowActionTo(selected, index, type) {
    if (!selected) {
      return false;
    }
    const { position, character } = selected;
    let maxDistance;
    switch (type) {
      case 'move':
        maxDistance = allowedDistances[character.type].steps;
        return GameController.getMoveCells(position, maxDistance).includes(index);
      case 'attack':
        maxDistance = allowedDistances[character.type].attack;
        return GameController.getAttackCells(position, maxDistance).includes(index);
      default:
        return null;
    }
  }
}
