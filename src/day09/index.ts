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

  const low_points = getLowPoints(input);
  const basins = low_points.map( low_point => {
    const visited: [number, number][] = [];

    const neighbors = getNeighbors(input, low_point).filter((pos) => input[pos[0]][pos[1]] < 9);
    // console.log(`Starting neighbors size: ${neighbors.length}`);
    while(neighbors.length > 0) {
      
      // console.log('Neighbors:', Array.from(neighbors.values()));
      // console.log('visited:', Array.from(visited.values()));
      const neighbor = neighbors.shift() as [number, number];
      visited.push(neighbor);
      // console.log(`Visiting [${neighbor}]`);

      getNeighbors(input, neighbor).filter( (pos) => input[pos[0]][pos[1]] < 9).forEach( pos => {
        const has_visited = visited.some(visited_pos => visited_pos[0] === pos[0] && visited_pos[1] === pos[1]);
        const has_neighbor = neighbors.some(neighbor_pos => neighbor_pos[0] === pos[0] && neighbor_pos[1] === pos[1]);
        if(!has_visited && !has_neighbor) {
          // console.log(`Adding [${pos}]`)
          neighbors.push(pos);
        }
      });
    }
    return visited;
  });

  // if(basins.length < 20) console.log(basins);
  console.log(basins.length);
  const top3 = basins.reduce<number[]>( (acc, basin) => {
    const count = basin.length;
    if(acc.length < 3) {
      acc.push(count);
      return acc;
    }

    const smaller = acc.findIndex( value => value < count);

    if(smaller !== -1) {
      acc[smaller] = count;
    }

    return acc;
  }, []);

  console.log(top3);

  return top3.reduce<number>( (acc, value) => acc * value, 1);
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
      },
      {
        input: `2199943210
3987894921
9856789892
8767896789
9898965678`, expected: 1215
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
