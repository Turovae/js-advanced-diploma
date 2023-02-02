class Distances {
  constructor(steps, attack) {
    this.steps = steps;
    this.attack = attack;
  }
}

const allowedDistances = {
  swordsman: new Distances(4, 1),
  undead: new Distances(4, 1),
  bowman: new Distances(2, 2),
  vampire: new Distances(2, 2),
  magician: new Distances(1, 4),
  daemon: new Distances(1, 4),
};

export default allowedDistances;
