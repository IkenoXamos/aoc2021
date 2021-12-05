import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(value => parseInt(value, 2));

function mostCommonBitMask(input: number[], position: number, length: number): number {
  const positionFromRight = length - 1 - position;
  const mask = 0b1 << positionFromRight;

  if (input.length === 1) {
    return input[0] & mask;
  }

  const count = input.reduce<number>((acc, value) => (value & mask) > 0 ? acc + 1 : acc, 0);

  return (count >= (input.length / 2)) ? mask : 0;
}

function leastCommonBitMask(input: number[], position: number, length: number): number {
  const positionFromRight = length - 1 - position;
  const mask = 0b1 << positionFromRight;

  if (input.length === 1) {
    return input[0] & mask;
  }

  const count = input.reduce<number>((acc, value) => (value & mask) > 0 ? acc + 1 : acc, 0);

  return (count >= (input.length / 2)) ? 0 : mask;
}

const mostCommonBit = (input: number[], length: number): [number, number] => {
  let result: [number, number] = [0b0, 0b0];

  // Iterate through the bit positions (left to right)
  for (let i = 0; i < length; i++) {
    result[0] |= mostCommonBitMask(input, i, length);
    result[1] |= leastCommonBitMask(input, i, length);
  }

  return result;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const length = rawInput.split('\n')[0].length;

  const [gamma, epsilon] = mostCommonBit(input, length);

  return gamma * epsilon;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const length = rawInput.split('\n')[0].length;

  let oxygen = [...input];
  let co2 = [...input];

  for (let i = 0; (oxygen.length > 1 || co2.length > 1) && i < length; i++) {
    const commonMask = mostCommonBitMask(oxygen, i, length);
    const leastMask = leastCommonBitMask(co2, i, length);

    oxygen = oxygen.filter(value => (value & (1 << length - 1 - i)) === commonMask);
    co2 = co2.filter(value => (value & (1 << length - 1 - i)) === leastMask);
  }

  return oxygen[0] * co2[0];
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`, expected: 198
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`, expected: 230
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
