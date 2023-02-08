/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('Запрещено создавать экземпляр класса Character!');
    }
  }

  levelUp(level) {
    while (this.level < level) {
      this.attack = Math.max(
        this.attack,
        Math.round(this.attack * ((80 + this.health) / 100)),
      );
      this.defence = Math.max(
        this.defence,
        Math.round(this.defence * ((80 + this.health) / 100)),
      );
      const health = this.health + 80;
      this.health = health < 100 ? health : 100;
      this.level += 1;
    }
  }
}
