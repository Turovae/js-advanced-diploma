function render(team) {
  return [...team].map((elem) => ({
    constructor: elem.constructor.name,
    character: {
      constructor: elem.character.constructor.name,
      props: elem.character,
    },
    position: elem.position,
  }));
}

/* eslint-disable no-unused-vars */
export default class GameState {
  static from(object) {
    // TODO: create object
    const {
      charactersCount,
      level,
      playerTeam,
      enemyTeam,
      score,
      maxScore,
    } = object;
    return {
      charactersCount,
      level,
      playerTeam: render(playerTeam),
      enemyTeam: render(enemyTeam),
      score,
      maxScore,
    };
  }
}
