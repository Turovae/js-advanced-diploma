import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(1, 'magician');
    this.attack = 10;
    this.defence = 40;
    this.levelUp(level);
  }
}
