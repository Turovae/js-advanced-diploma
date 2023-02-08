import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(1, 'swordsman');
    this.attack = 40;
    this.defence = 10;
    this.levelUp(level);
  }
}
