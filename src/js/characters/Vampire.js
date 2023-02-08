import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(1, 'vampire');
    this.attack = 25;
    this.defence = 25;
    this.levelUp(level);
  }
}
