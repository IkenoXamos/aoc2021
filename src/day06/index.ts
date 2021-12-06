import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(',').map(str => Number(str.trim()));

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput);

  const days = 80;

  for (let day = 0; day < days; day++) {
    let count = 0;
    input = input.map((timer) => {
      if (timer === 0) {
        count++;
        return 6;
      }

      return timer - 1;
    });

    for (let i = 0; i < count; i++) {
      input.push(8);
    }
  }

  return input.length;
};

// The ending amount of fish can be computed
// We start with n fish
// For each fish, there is a starting timer t_1 ... t_n
// Each fish will spawn their first child at t_k + 1
// Then every 7 days afterwards
// Every new fish starts with a timer of 8 (which takes 9 days)
// Then produces a new fish every 7 days, as normal

// n + [floor]sum(k = 1 ... n)(days - t_k - 1) / 9 ...
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = input.length; // The starting fish

  for (let timer of input) {
    const days = 256 - timer - 1;
    count++; // The first child is spawned

    const generations = Math.floor(days / 7); // The number of generations of new fish that result from t_k
    // We will iteratively step down from this to compute the number of standard generations spawned via the remaining days
    count += generations;
    const remaining = days % 7;

    for (let i = 0; i < generations; i++) {
      const child_days = i === 0 ? days + remaining : days;
      const child_generations = Math.floor((child_days - i * 9) / 7);
      count += 2 ** child_generations;
    }
  }

  return count;
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
      { input: `3,4,3,1,2`, expected: 5934 }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
      { input: `3,4,3,1,2`, expected: 26984457539 }
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
