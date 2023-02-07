import allowedDistances from './allowedDistances';
import { getMoveCells, getAttackCells } from './utils';

export default class Ai {
  constructor() {
    this.playerTeam = null;
    this.computerTeam = null;

    this.selectedCharacter = null;
  }

  async run(player, computer, gamePlay) {
    this.setCommands(player, computer);

    const attackVariants = Ai.getAttackVariants(this.playerTeam, this.computerTeam);
    if (attackVariants.length > 0) {
      const selectedVariant = attackVariants[Math.floor(Math.random() * attackVariants.length)];
      const [attacker, target] = selectedVariant;
      const attackValue = attacker.character.attack;
      const defenceValue = target.character.defence;
      const damage = Math.max(attackValue - defenceValue, attackValue * 0.1);
      target.character.health -= damage;

      try {
        gamePlay.selectCell(attacker.position);
        gamePlay.selectCell(target.position, 'red');
        await gamePlay.showDamage(selectedVariant[1].position, damage);
      } finally {
        gamePlay.deselectCell(attacker.position);
        gamePlay.deselectCell(target.position);
        if (selectedVariant[1].character.health <= 0) {
          this.playerTeam.delete(selectedVariant[1]);
        }
        gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
      }
    } else {
      this.selectedCharacter = Ai.getRandomCharacter(this.computerTeam);
      const moveCells = getMoveCells(
        this.selectedCharacter.position,
        allowedDistances[this.selectedCharacter.character.type].steps,
      );
      const nextCell = Ai.getCellMoveTo(moveCells, this.playerTeam, this.computerTeam);
      this.selectedCharacter.position = nextCell;
      gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
    }
  }

  setCommands(player, computer) {
    this.playerTeam = player;
    this.computerTeam = computer;
  }

  static getRandomCharacter(characters) {
    const { size } = characters;
    return [...characters][Math.floor(Math.random() * size)];
  }

  static getCellMoveTo(moveCells, players, enemyes) {
    const occupiedCells = [...players, ...enemyes].map((char) => char.position);
    const unoccupiedCells = moveCells.filter((cell) => !occupiedCells.includes(cell));

    if (unoccupiedCells.length > 0) {
      return unoccupiedCells[Math.floor(Math.random() * unoccupiedCells.length)];
    }
    return null;
  }

  static getAttackVariants(playerTeam, computerTeam) {
    const variants = [];
    [...computerTeam].forEach((computerCharacter) => {
      const attackAllowCells = getAttackCells(
        computerCharacter.position,
        allowedDistances[computerCharacter.character.type].attack,
      );
      [...playerTeam].forEach((playerCharacter) => {
        if (attackAllowCells.includes(playerCharacter.position)) {
          variants.push([computerCharacter, playerCharacter]);
        }
      });
    });
    return variants;
  }
}
