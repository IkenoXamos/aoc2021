import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const timers = rawInput.split(',').map(str => Number(str.trim()));

  const fish = Array<number>(7).fill(0);

  for (let i = 0; i < timers.length; i++) {
    fish[timers[i]]++;
  }

  return fish;
};

function computePopulation(fish: number[], days: number): number {
  const queue: number[] = [];
  let indexToSplit = 0;

  for (let day = 0; day < days; day++) {
    queue.push(fish[indexToSplit]);

    if (queue.length >= 3) {
      const fishWithTimer6 = queue.shift() as number;

      fish[indexToSplit] += fishWithTimer6;
    }

    indexToSplit++;
    if (indexToSplit > 6) {
      indexToSplit = 0;
    }
  }

  return fish.reduce((acc, value) => acc + value) + queue.reduce((acc, value) => acc + value);
}

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput);
  const days = 80;


  return computePopulation(input, days);
};

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);
  const days = 256;


  return computePopulation(input, days);
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
  trimTestInputs: true
});
