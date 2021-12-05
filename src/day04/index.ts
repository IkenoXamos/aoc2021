import run from "aocrunner";

type Cell = [number, boolean];
type BoardRow = [Cell, Cell, Cell, Cell, Cell];
type Board = [BoardRow, BoardRow, BoardRow, BoardRow, BoardRow];
type Day4Input = [number[], Board[]];

function newBoard(): Board {
  const cell: Cell = [-1, false];
  const row: BoardRow = [cell, cell, cell, cell, cell];
  const board: Board = [row, row, row, row, row];

  return board;
}

function printData(draws: number[], boards: Board[]) {
  console.log(draws);
  boards.forEach(board => {
    board.forEach(row => console.log(row.map(row => row[0])));

    console.log();
  })
}

function getWinner(boards: Board[]): Board | undefined {
  for (const board of boards) {
    if (hasWinner(board)) {
      return board;
    }
  }

  return undefined;
}

function getLoser(boards: Board[]): Board | undefined {
  let hasLoser = false;
  let loserIndex = 0;

  for (let index = 0; index < boards.length; index++) {
    if (!hasWinner(boards[index]) && !hasLoser) {
      hasLoser = true;
      loserIndex = index;
    } else if (!hasWinner(boards[index]) && hasLoser) {
      return undefined;
    }
  }

  return boards[loserIndex];
}

function hasWinner(board: Board): boolean {

  for (let row = 0; row < board.length; row++) {
    let flag = false;
    for (let col = 0; col < board[row].length; col++) {
      const [_, selected] = board[row][col];

      if (!selected) {
        break;
      }

      if (col === 4) {
        flag = true;
      }
    }

    if (flag) {
      return true;
    }
  }

  for (let col = 0; col < board[0].length; col++) {
    let flag = false;
    for (let row = 0; row < board.length; row++) {
      const [_, selected] = board[row][col];

      if (!selected) {
        break;
      }

      if (row === 4) {
        flag = true;
      }
    }

    if (flag) {
      return true;
    }
  }

  return false;
}

function draw(boards: Board[], ...values: number[]): void {
  boards.forEach(board => {
    board.forEach(row => {
      row.forEach(cell => {
        if (values.includes(cell[0])) {
          cell[1] = true;
        }
      })
    })
  })
}

const parseInput = (rawInput: string): Day4Input => {

  const [first, _, ...lines] = rawInput.split('\n');

  const draws = first.split(',').map(str => Number(str));
  const boards: Board[] = [newBoard()];

  const processedLines = lines.map(line => line.split(' ').map(element => element.trim()).filter(element => element !== ''));

  let index = 0;
  let rowIndex = 0;
  for (const line of processedLines) {
    if (line.length === 0) {
      boards.push(newBoard());
      index++;
      rowIndex = 0;

      continue;
    }

    const row = line.map(str => [Number(str), false]) as BoardRow;

    boards[index][rowIndex] = row;
    rowIndex++;
  }

  return [draws, boards];
}

const part1 = (rawInput: string) => {
  const [draws, boards] = parseInput(rawInput);

  draw(boards, ...draws.slice(0, 5));

  let index = 5, winner: Board | undefined;
  for (winner = undefined; winner === undefined; winner = getWinner(boards)) {
    draw(boards, draws[index++]);
  }

  const unmarkedSum = winner.reduce<number>((acc, row) => {
    return acc + row.reduce<number>((acc, cell) => !cell[1] ? acc + cell[0] : acc, 0);
  }, 0);

  return unmarkedSum * draws[index - 1];
};

const part2 = (rawInput: string) => {
  const [draws, boards] = parseInput(rawInput);

  draw(boards, ...draws.slice(0, 5));

  let index = 5, loser: Board | undefined;
  for (loser = undefined; loser === undefined; loser = getLoser(boards)) {
    draw(boards, draws[index++]);
  }

  while (!hasWinner(loser)) {
    draw(boards, draws[index++]);
  }

  const unmarkedSum = loser.reduce<number>((acc, row) => {
    return acc + row.reduce<number>((acc, cell) => !cell[1] ? acc + cell[0] : acc, 0);
  }, 0);

  return unmarkedSum * draws[index - 1];
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`, expected: 4512
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`, expected: 1924
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
