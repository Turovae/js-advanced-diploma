/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  if (index === 0) {
    return 'top-left';
  }
  if (index === boardSize - 1) {
    return 'top-right';
  }
  if (index === boardSize ** 2 - boardSize) {
    return 'bottom-left';
  }
  if (index === boardSize ** 2 - 1) {
    return 'bottom-right';
  }
  if (index > 0 && index < boardSize) {
    return 'top';
  }
  if ((index > boardSize ** 2 - boardSize) && (index < boardSize ** 2)) {
    return 'bottom';
  }
  if (index % boardSize === 0) {
    return 'left';
  }
  if (index % boardSize === boardSize - 1) {
    return 'right';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

function getDistanceActionLimits(index, distance, dimention) {
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

export function getMoveCells(index, distance, dimention = 8) {
  const {
    maxLeft, maxRight, maxTop, maxBottom,
  } = getDistanceActionLimits(index, distance, dimention);

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

export function getAttackCells(index, distance, dimention = 8) {
  const {
    maxLeft, maxRight, maxTop, maxBottom,
  } = getDistanceActionLimits(index, distance, dimention);

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
