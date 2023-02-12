import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import { generateTeam } from './generators';
import { getMoveCells, getAttackCells } from './utils';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';
import cursors from './cursors';
import allowedDistances from './allowedDistances';
import Ai from './ai';
import Team from './Team';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.ai = new Ai();
    this.charactersCount = 3;
    this.level = 1;
    this.themesGenerator = undefined;
    this.isPlayerTurn = true;
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.lastClickedCell = null;
    this.enemyTypes = [Daemon, Undead, Vampire];
    this.playerTeam = new Set();
    this.enemyTeam = new Set();

    this.selectedCharacter = null;
    this.score = 0;
    this.maxScore = 0;

    this.registerEvents();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.playerTeam.clear();
    this.enemyTeam.clear();

    this.themesGenerator = themes[Symbol.iterator](this.level);
    this.gamePlay.drawUi(this.themesGenerator.next().value);
    this.gamePlay.showLevel(this.level);

    const playerOffset = 0;
    const players = generateTeam(this.playerTypes, this.level, this.charactersCount);
    GameController.placeTeam(this.playerTeam, players, playerOffset, this.gamePlay.boardSize);

    const enemyOffset = this.gamePlay.boardSize - 2;
    const enemies = generateTeam(this.enemyTypes, this.level, this.charactersCount);
    GameController.placeTeam(this.enemyTeam, enemies, enemyOffset, this.gamePlay.boardSize);

    this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);

    this.isPlayerTurn = true;

    try {
      this.maxScore = this.stateService.load().maxScore;
    } catch (e) {
      this.maxScore = 0;
      // eslint-disable-next-line no-console
      console.log('maxScore not loaded');
    }

    this.gamePlay.showScore(this.score, this.maxScore);
  }

  static createTeamFromStorage(team) {
    const constructors = {
      [PositionedCharacter.name]: PositionedCharacter,
      [Bowman.name]: Bowman,
      [Swordsman.name]: Swordsman,
      [Magician.name]: Magician,
      [Daemon.name]: Daemon,
      [Undead.name]: Undead,
      [Vampire.name]: Vampire,
    };
    // eslint-disable-next-line no-console
    console.log(constructors);
    return new Set(team.map((elem) => {
      const char = new constructors[elem.character.constructor]();
      char.level = elem.character.props.level;
      char.health = elem.character.props.health;
      char.attack = elem.character.props.attack;
      char.defence = elem.character.props.defence;

      return new constructors[elem.constructor](
        char,
        elem.position,
      );
    }));
  }

  registerEvents() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
  }

  levelUp() {
    this.level += 1;
    this.enemyTeam.clear();
    this.gamePlay.drawUi(this.themesGenerator.next().value);
    this.gamePlay.showScore(this.score, this.maxScore);
    this.gamePlay.showLevel(this.level);
    this.isPlayerTurn = true;

    const playerOffset = 0;
    const enemyOffset = this.gamePlay.boardSize - 2;

    const players = new Team([...this.playerTeam].map((char) => {
      char.character.levelUp(this.level);
      return char.character;
    }));
    this.playerTeam.clear();
    const enemies = generateTeam(this.enemyTypes, this.level, this.charactersCount);

    GameController.placeTeam(this.playerTeam, players, playerOffset, this.gamePlay.boardSize);
    GameController.placeTeam(this.enemyTeam, enemies, enemyOffset, this.gamePlay.boardSize);

    this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);
  }

  newGame() {
    this.score = 0;
    this.level = 1;
    this.init();
  }

  saveGame() {
    this.stateService.save(GameState.from(this));
  }

  loadGame() {
    let state;
    try {
      state = this.stateService.load();
    } catch {
      this.gamePlay.showError('Data not loaded');
    }
    const {
      charactersCount,
      level,
      playerTeam,
      enemyTeam,
      score,
      maxScore,
    } = state;
    this.level = level;
    this.charactersCount = charactersCount;
    this.score = score;
    this.maxScore = maxScore;
    this.playerTeam = GameController.createTeamFromStorage(playerTeam);
    this.enemyTeam = GameController.createTeamFromStorage(enemyTeam);

    this.themesGenerator = themes[Symbol.iterator](this.level);
    this.gamePlay.drawUi(this.themesGenerator.next().value);
    this.gamePlay.showLevel(this.level);
    this.gamePlay.showScore(this.score, this.maxScore);
    this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);
  }

  onCellClick(index) {
    // TODO: react to click
    if (!this.isPlayerTurn) {
      return;
    }
    const characterClicked = [...this.playerTeam, ...this.enemyTeam]
      .find((character) => character.position === index) || null;

    // Выбор персонажа
    if (this.isAllowSelect(characterClicked)) {
      if (this.selectedCharacter) {
        this.gamePlay.deselectCell(this.selectedCharacter.position);
      }
      this.selectedCharacter = characterClicked;
      this.gamePlay.selectCell(index);
    }

    if (this.isAllowMoveTo(index, characterClicked)) {
      this.move(index, this.selectedCharacter);
      this.isPlayerTurn = false;
      this.ai.run(this.playerTeam, this.enemyTeam, this.gamePlay);
      this.isPlayerTurn = true;
    }

    if (this.isEnemy(characterClicked) && this.isAllowAttack(index, characterClicked)) {
      this.attack(index, this.selectedCharacter, characterClicked);
    }
  }

  move(index, character) {
    this.gamePlay.deselectCell(character.position);
    this.gamePlay.deselectCell(index);
    // eslint-disable-next-line no-param-reassign
    character.position = index;
    this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);
  }

  async attack(index, attacker, target) {
    const attackValue = attacker.character.attack;
    const defenceValue = target.character.defence;
    const damage = Math.min(
      Math.round(Math.max(attackValue - defenceValue, attackValue * 0.1)),
      target.character.health,
    );
    // eslint-disable-next-line no-param-reassign
    target.character.health -= damage;
    try {
      await this.gamePlay.showDamage(index, damage);
      this.score += damage;
      this.maxScore = Math.max(this.score, this.maxScore);
      this.gamePlay.showScore(this.score, this.maxScore);
    } finally {
      this.gamePlay.redrawPositions([...this.playerTeam, ...this.enemyTeam]);
      this.selectedCharacter = null;
      if (target.character.health <= 0) {
        this.enemyTeam.delete(target);
      }
      this.gamePlay.deselectCell(attacker.position);
      this.gamePlay.deselectCell(target.position);
      if (this.enemyTeam.size <= 0) {
        setTimeout(() => {
          this.levelUp();
        }, 100);
        // this.levelUp();
      } else {
        this.isPlayerTurn = false;
        await this.ai.run(this.playerTeam, this.enemyTeam, this.gamePlay);
      }
      this.isPlayerTurn = true;
    }
  }

  isPlayer(testedCharacter) {
    // console.log(testedCharacter);
    return !!testedCharacter && this.playerTypes
      .some((acceptable) => testedCharacter.character instanceof acceptable);
  }

  isEnemy(testedCharacter) {
    return !!testedCharacter && this.enemyTypes
      .some((acceptable) => testedCharacter.character instanceof acceptable);
  }

  isAllowSelect(character) {
    return this.isPlayer(character) && character !== this.selectedCharacter;
  }

  isAllowAttack(index, character) {
    return this.isEnemy(character)
      && GameController.isAllowActionTo(this.selectedCharacter, index, 'attack', this.gamePlay.boardSize);
  }

  isAllowMoveTo(index, character) {
    return !character
      && GameController.isAllowActionTo(this.selectedCharacter, index, 'move', this.gamePlay.boardSize);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const hoveredCharacter = [...this.playerTeam, ...this.enemyTeam]
      .find((character) => character.position === index) || null;
    if (hoveredCharacter) {
      this.gamePlay
        .showCellTooltip(GameController.characterInfo(hoveredCharacter.character), index);
    }

    // Если собираемся выбрать другого персонажа
    if (this.isAllowSelect(hoveredCharacter)) {
      this.gamePlay.setCursor(cursors.pointer);
    }

    // Если собираемся перейти на другую клетку
    if (this.isAllowMoveTo(index, hoveredCharacter)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }

    // Если собираемся атаковать противника
    if (this.isAllowAttack(index, hoveredCharacter)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    }

    // Если действие не допустимо
    if (
      this.selectedCharacter
      && !(
        this.isAllowMoveTo(index, hoveredCharacter)
        || this.isAllowAttack(index, hoveredCharacter)
        || this.isAllowSelect(hoveredCharacter)
        || hoveredCharacter === this.selectedCharacter
      )
    ) {
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

  static placeTeam(container, team, offset, dimention = 8) {
    const occupiedCells = [];

    team.characters.forEach((character) => {
      const isTrue = true;
      while (isTrue) {
        const position = Math.floor(Math.random() * 2)
          + Math.floor(Math.random() * dimention) * dimention + offset;
        if (!occupiedCells.includes(position)) {
          occupiedCells.push(position);
          container.add(new PositionedCharacter(character, position));
          break;
        }
      }
    });
  }

  static characterInfo(character) {
    return `\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`;
  }

  static isAllowActionTo(selected, index, type, dimention = 8) {
    if (!selected) {
      return false;
    }
    const { position, character } = selected;
    let maxDistance;
    switch (type) {
      case 'move':
        maxDistance = allowedDistances[character.type].steps;
        return getMoveCells(position, maxDistance, dimention).includes(index);
      case 'attack':
        maxDistance = allowedDistances[character.type].attack;
        return getAttackCells(position, maxDistance, dimention).includes(index);
      default:
        return null;
    }
  }
}
