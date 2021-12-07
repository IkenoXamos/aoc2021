import run from "aocrunner";


const parseInput = (rawInput: string) => rawInput.split(',').map((str) => Number(str));

function calculateCostByPosition(positions: number[], target: number): number {
  return positions.reduce<number>((acc, value) => acc + Math.abs(value - target), 0);
}

function calculateCostByPosition2(positions: number[], target: number): number {
  return positions.reduce<number>((acc, value) => {
    const diff = Math.abs(value - target);
    return acc + diff * (diff + 1) / 2;
  }, 0);
}

function findLowestCostPosition(positions: number[], max: number, calculator: (positions: number[], target: number) => number): number {
  let min = Number.MAX_VALUE;

  for (let target = 0; target < max; target++) {
    const cost = calculator(positions, target);
    if (cost < min) min = cost;
  }

  return min;
}

const part1 = (rawInput: string) => {
  const positions = parseInput(rawInput);

  return findLowestCostPosition(positions, 1936, calculateCostByPosition);
};

const part2 = (rawInput: string) => {
  const positions = parseInput(rawInput);

  return findLowestCostPosition(positions, 1936, calculateCostByPosition2);
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
