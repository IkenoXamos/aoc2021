import run from "aocrunner";

type Direction = "forward" | "up" | "down";
type Instruction = [dir: Direction, value: number];
type Part1Output = [distance: number, depth: number];
type Part2Output = [distance: number, depth: number, aim: number];

const parseInput = (rawInput: string) => {

  return rawInput.split('\n').map(instruction => {
    const result = instruction.split(' ');
    const [dir, value] = result;

    return [dir, Number(value)] as Instruction;
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [distance, depth] = input.reduce<Part1Output>((acc, instruction) => {

    const [dir, distance] = instruction;

    switch (dir) {
      case "forward":
        return [acc[0] + distance, acc[1]];
      case "up":
        return [acc[0], acc[1] - distance];
      case "down":
        return [acc[0], acc[1] + distance];
    }
  }, [0, 0]);

  return distance * depth;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [distance, depth] = input.reduce<Part2Output>((acc, instruction) => {
    const [dir, value] = instruction;

    switch (dir) {
      case "forward":
        return [acc[0] + value, acc[1] + acc[2] * value, acc[2]];
      case "up":
        return [acc[0], acc[1], acc[2] - value];
      case "down":
        return [acc[0], acc[1], acc[2] + value];
    }
  }, [0, 0, 0]);

  return distance * depth;
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `forward 5
down 5
forward 8
up 3
down 8
forward 2`, expected: 150
      },
      {
        input: `forward 5
down 5`, expected: 25
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `forward 5
down 5
forward 8
up 3
down 8
forward 2`, expected: 900
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
