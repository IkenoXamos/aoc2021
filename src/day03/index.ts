import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(value => parseInt(value, 2));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const length = rawInput.split('\n')[0].length;

  let gamma = 0, epsilon = 0;

  // iterate through bit positions (left to right)
  for (let position = length - 1; position >= 0; position--) {

    // iterate through the provided binary numbers, counting as we go
    let count = 0;
    for (let i = 0; i < input.length; i++) {
      const bitValue = input[i] >> position & 1; // compute the bit value

      // only count the numbers that had a 1 in the provided bit position
      if (bitValue === 1) count++;
    }

    // if at least half of the numbers had a 1, our result has a 1. Otherwise it stays as 0 (which it already was from initialization)
    if (count >= input.length / 2) {
      // Set the bit to 1 at the given position
      gamma |= 1 << position;
    } else {
      // We do the opposite for the least common
      epsilon |= 1 << position;
    }
  }

  // Multiply the results
  return gamma * epsilon;
};

// This process is pretty much the same as part 1, except that we steadily filter down our choices
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const length = rawInput.split('\n')[0].length;

  // We make copies of the inputs so we can filter them separately
  let oxygen = [...input], co2 = [...input];

  // Iterate through the bit positions, but stopping when we only have 1 left in our list of choices
  for (let position = length - 1; (oxygen.length > 1) && (position >= 0); position--) {

    // same as part 1, we count the 1s
    let count = 0;
    for (let i = 0; i < oxygen.length; i++) {
      const bitValue = oxygen[i] >> position & 1;

      if (bitValue === 1) count++;
    }

    // But our process here is slightly different, since instead of computing a value, we simply filter our remaining results
    // We compute a mask that represents what value should be in the provided bit position
    const mask = (count >= oxygen.length / 2) ? (1 << position) : 0;

    // Only keep the values that have the same bit value as the mask
    oxygen = oxygen.filter(value => (value >> position & 1) === (mask >> position & 1));
  }

  // Same as above, but for least common
  for (let position = length - 1; (co2.length > 1) && (position >= 0); position--) {

    let count = 0;
    for (let i = 0; i < co2.length; i++) {
      const bitValue = co2[i] >> position & 1;

      if (bitValue > 0) count++;
    }

    // Our mask is swapped compared to the mask for oxygen above
    // This tracks our least common bits
    const mask = (count >= co2.length / 2) ? 0 : (1 << position);

    co2 = co2.filter(value => (value >> position & 1) === (mask >> position & 1));
  }

  // Multiply the results
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
