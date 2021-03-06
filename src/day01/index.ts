import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(str => Number(str));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const increased = input.map((value, index, arr) => index > 0 ? value - arr[index - 1] : -1)
    .filter(value => value > 0).length;

  return increased;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const increased = input.map((value, index, arr) => index > 2 ? value - arr[index - 3] : -1)
    .filter(value => value > 0).length;

  return increased;
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
      {
        input: `199
      200
      208
      210
      200
      207
      240
      269
      260
      263`, expected: 5
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
