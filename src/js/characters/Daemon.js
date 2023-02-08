import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(1, 'daemon');
    this.attack = 10;
    this.defence = 40;
    this.levelUp(level);
  }
}
