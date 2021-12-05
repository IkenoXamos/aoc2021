import run from "aocrunner";

type Position = [x: number, y: number];
type Instruction = {
  src: Position,
  dest: Position
}

function max_dimensions(instructions: Instruction[]): { x: number, y: number } {
  const dimensions = { x: 0, y: 0 }

  for (const instruction of instructions) {
    if (instruction.src[0] > dimensions.x) {
      dimensions.x = instruction.src[0];
    }

    if (instruction.dest[0] > dimensions.x) {
      dimensions.x = instruction.dest[0];
    }

    if (instruction.src[1] > dimensions.y) {
      dimensions.y = instruction.src[1];
    }

    if (instruction.dest[1] > dimensions.y) {
      dimensions.y = instruction.dest[1];
    }
  }

  return dimensions;
}

function draw_lines(grid: number[][], instructions: Instruction[]) {
  for (const instruction of instructions) {
    let { src, dest } = instruction;

    if (src[0] === dest[0]) { // Vertical line

      // If dest is larger than src, swap directions
      if (src[1] > dest[1]) {
        [src, dest] = [dest, src];
      }

      for (let y = src[1]; y <= dest[1]; y++) {
        grid[src[0]][y]++;
      }
    } else if (src[1] === dest[1]) { // Horizontal line

      if (src[0] > dest[0]) {
        [src, dest] = [dest, src];
      }

      for (let x = src[0]; x <= dest[0]; x++) {
        grid[x][src[1]]++;
      }
    } else { // Diagonal line

      // Invert direction from north-west to south-east
      // Eases iteration
      if (src[0] > dest[0] && src[1] > dest[1]) {
        [src, dest] = [dest, src];
      }

      if (src[0] < dest[0] && src[1] > dest[1]) { // north-east

        let x = src[0], y = src[1];
        while (x <= dest[0] && y >= dest[1]) {
          grid[x++][y--]++;
        }
      } else if (src[0] < dest[0] && src[1] < dest[1]) { // south-east

        let x = src[0], y = src[1];
        while (x <= dest[0] && y <= dest[1]) {
          grid[x++][y++]++;
        }
      } else { // south-west

        let x = src[0], y = src[1];
        while (x >= dest[0] && y <= dest[1]) {
          grid[x--][y++]++;
        }
      }
    }
  }
}

const parseInput = (rawInput: string): Instruction[] => {
  const lines = rawInput.split('\n');

  const instructions: Instruction[] = [];
  for (const line of lines) {
    const [src, _, dest] = line.split(' ');

    const [src_x, src_y] = src.trim().split(',').map(value => Number(value));
    const [dest_x, dest_y] = dest.trim().split(',').map(value => Number(value));

    instructions.push({
      src: [
        src_x,
        src_y
      ],
      dest: [
        dest_x,
        dest_y
      ]
    });
  }

  return instructions;
}

function print_grid(grid: number[][]) {
  // console.table(grid);

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      process.stdout.write(`${grid[y][x] == 0 ? '.' : grid[y][x]}`);
    }

    process.stdout.write('\n');
  }
}

const part1 = (rawInput: string) => {

  // Only keep straight lines
  const input = parseInput(rawInput).filter((instruction) => {
    const { src: [src_x, src_y], dest: [dest_x, dest_y] } = instruction;

    return src_x === dest_x || src_y === dest_y;
  });

  const dimensions = max_dimensions(input);

  const grid: number[][] = [];
  for (let i = 0; i <= dimensions.x; i++) {
    grid.push([]);
    for (let j = 0; j <= dimensions.y; j++) {
      grid[i].push(0);
    }
  }

  draw_lines(grid, input);

  const overlap = grid.reduce((acc, row) => {
    return acc + row.reduce((acc, value) => acc + (value > 1 ? 1 : 0), 0);
  }, 0);

  return overlap;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const dimensions = max_dimensions(input);

  const grid: number[][] = [];
  for (let i = 0; i <= dimensions.x; i++) {
    grid.push([]);
    for (let j = 0; j <= dimensions.y; j++) {
      grid[i].push(0);
    }
  }

  draw_lines(grid, input);

  const overlap = grid.reduce((acc, row) => {
    return acc + row.reduce((acc, value) => acc + (value > 1 ? 1 : 0), 0);
  }, 0);

  return overlap;
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`, expected: 5
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`, expected: 12
      },
      {
        input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
8,6 -> 4,2`, expected: 13
      },
      {
        input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
8,6 -> 4,2
1,7 -> 3,5`, expected: 16
      },
      {
        input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
8,6 -> 4,2
7,5 -> 6,6`, expected: 15
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
