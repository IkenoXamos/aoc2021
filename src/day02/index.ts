import run from "aocrunner";

type Direction = "forward" | "up" | "down";
type RawInstruction = `${Direction} ${number}`
type Instruction = [dir: Direction, distance: number];

const parseInput = (rawInput: string) => {

  return rawInput.split('\n').map(instruction => {
    const result = instruction.split(' ');
    const [dir, distance] = result;

    return [dir, Number(distance)];
  }) as Instruction[];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [distance, depth] = input.reduce<[distance: number, depth: number]>((acc, value) => {

    const [dir, distance] = value;

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

  const [distance, depth] = input.reduce<[distance: number, depth: number, aim: number]>((acc, value) => {
    const [dir, distance] = value;

    switch (dir) {
      case "forward":
        return [acc[0] + distance, acc[1] + acc[2] * distance, acc[2]];
      case "up":
        return [acc[0], acc[1], acc[2] - distance];
      case "down":
        return [acc[0], acc[1], acc[2] + distance];
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
