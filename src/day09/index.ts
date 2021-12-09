import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split('').map(digit => Number(digit)));

function getNeighbors(grid: number[][], pos: [number, number]): [number, number][] {
  const neighbors: [number, number][] = [[pos[0] - 1, pos[1]], [pos[0] + 1, pos[1]], [pos[0], pos[1] - 1], [pos[0], pos[1] + 1]];
  return neighbors.filter(pos => grid[pos[0]] !== undefined && grid[pos[0]][pos[1]] !== undefined);
}

function get2dKeys<T>(grid: T[][]): [number, number][] {
  return Array.from(grid.keys())
    .flatMap((row) => Array.from(grid[row].keys())
      .map(col => [row, col] as [number, number]));
}

function getLowPoints(grid: number[][]): [number, number][] {
  return get2dKeys(grid)
    .map((pos) => ({ pos, neighbors: getNeighbors(grid, pos) }))
    .filter(({ pos, neighbors }) => neighbors.every((neighbor) => grid[pos[0]][pos[1]] < grid[neighbor[0]][neighbor[1]]))
    .map(({ pos }) => pos);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return getLowPoints(input).reduce<number>((acc, pos) => acc + input[pos[0]][pos[1]] + 1, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `2199943210
3987894921
9856789892
8767896789
9899965678`, expected: 15
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `2199943210
3987894921
9856789892
8767896789
9899965678`, expected: 1134
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
