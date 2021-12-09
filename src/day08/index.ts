import run from "aocrunner";

type Display = [input: string[], output: string[]]

const parseInput = (rawInput: string): Display[] => rawInput.split('\n').map(line => line.split(' | ').map(part => part.split(' ')) as [string[], string[]]);

function hasUniqueLength(part: string): number | undefined {
  switch (part.length) {
    case 2: return 1;
    case 3: return 7;
    case 4: return 4;
    case 7: return 8;
    default: return undefined;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce<number>((acc, line) => acc +
    line[1].reduce<number>((acc, part) => acc + (hasUniqueLength(part) ? 1 : 0),
      0),
    0);
};

// A grid representing the indices of letters (a = 0 ... g = 6)
// that draw out each digit
// So digit 1 is represented by wires c and f, which are indices 2 and 5
const digit_wire_indices = [
  [0, 1, 2, 4, 5, 6],
  [2, 5],
  [0, 2, 3, 4, 6],
  [0, 2, 3, 5, 6],
  [1, 2, 3, 5],
  [0, 1, 3, 5, 6],
  [0, 1, 3, 4, 5, 6],
  [0, 2, 5],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 5, 6]
]

function deduce_invalid_mappings(connections: boolean[][], part: string, validIndexes: number[]): void {
  const letterIndexesFromPart = Array.from(part).map(letter => letter.charCodeAt(0) - 97);

  for (let i = 0; i < 7; i++) {
    if (!letterIndexesFromPart.includes(i)) {
      continue;
    }

    for (let j = 0; j < 7; j++) {
      if (validIndexes.includes(j)) {
        continue;
      }
      // console.log(` Deducing that ${String.fromCharCode(i + 97)} is not ${String.fromCharCode(j + 97)}`)
      connections[i][j] = false;
    }
  }
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const output: number[] = [];

  for (const display of input) {

    // A 7 x 7 grid that maps a - g against a - g, representing the possibility of the wire mismatch.
    // Each cell will start as true, and as certain combinations are filtered out, the cells will be set to false
    // In the end, each row should have a single true value, and the indices of those positions represent the wire connections
    const connections: boolean[][] = Array<boolean[]>(7);
    for (let letter = 0; letter < connections.length; letter++) {
      connections[letter] = Array<boolean>(7).fill(true);
    }

    const intersections: { 532: string[], 960: string[] } = { 532: [], 960: [] };

    const [first, second] = display;

    for (const part of first) {
      const identifiedDigit = hasUniqueLength(part);
      if (!identifiedDigit) {
        // We need to track 2,3,5 and 0,6,9 separately and determine the intersection of signals
        // This will provide some additional mapping information

        if (part.length === 5) intersections[532].push(part);
        if (part.length === 6) intersections[960].push(part);

        if (intersections[532].length === 3) {
          const intersection = intersections[532].reduce<string>((acc, letter) => (acc.match(new RegExp('[' + letter + ']', 'g')) || []).join(''), 'abcdefg');

          // console.log(`Analyzing ${intersection} -> ${[0, 3, 6].map(val => String.fromCharCode(97 + val)).reduce<string>((acc, letter) => acc + letter, '')}`);
          deduce_invalid_mappings(connections, intersection, [0, 3, 6]);
        }

        if (intersections[960].length === 3) {
          const intersection = intersections[960].reduce<string>((acc, letter) => (acc.match(new RegExp('[' + letter + ']', 'g')) || []).join(''), 'abcdefg');

          // console.log(`Analyzing ${intersection} -> ${[0, 1, 5, 6].map(val => String.fromCharCode(97 + val)).reduce<string>((acc, letter) => acc + letter, '')}`);
          deduce_invalid_mappings(connections, intersection, [0, 1, 5, 6]);
        }

        continue;
      }

      // Now that we have the identified digit, we must take all of the wire indexes from this part
      // which might be something like 'cgeb' and set the wire connections to false in the grid
      // where applicable
      // In this example, the identified digit would have been 4, which normally has connections 'bcdf'
      // This means that each of 'c', 'g', 'e', and 'b' can only have options of 'b', 'c', 'd', or 'f'

      // console.log(`Analyzing ${part} -> ${digit_wire_indices[identifiedDigit].map(val => String.fromCharCode(97 + val)).reduce<string>((acc, letter) => acc + letter, '')}`);
      deduce_invalid_mappings(connections, part, digit_wire_indices[identifiedDigit]);
    }

    while (connections.reduce<number>((acc, row) => acc + row.reduce((acc, value) => acc + (value ? 1 : 0), 0), 0) !== 7) {
      for (let i = 0; i < connections.length; i++) {
        const row = connections[i];
        const rowCount = row.reduce((acc, value) => acc + (value ? 1 : 0), 0);

        if (rowCount === 1) {
          const index = row.findIndex((value) => value);
          // console.log(`Determined that row ${i} contains is a singleton at column ${index}`);

          for (let j = 0; j < connections.length; j++) {
            if (j === i) continue;
            connections[j][index] = false;
          }
        }
      }
    }

    const wires = connections.reduce<number[]>((acc, row, index) => { acc[index] = row.findIndex(value => value); return acc; }, Array<number>(7).fill(0));

    let value = '';
    for (const part of second) {
      const segments = Array.from(part).map(letter => letter.charCodeAt(0) - 97);

      if (hasUniqueLength(part)) {
        value += hasUniqueLength(part);
        continue;
      }

      const validSegments = segments.map((segment) => wires[segment]).sort();

      const digit = digit_wire_indices.findIndex((sequence) => JSON.stringify(sequence) === JSON.stringify(validSegments));

      value += String(digit);
    }

    output.push(Number(value));
  }

  return output.reduce((acc, val) => acc + val);
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
      {
        input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
      edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
      fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
      fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
      aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
      fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
      dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
      bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
      egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
      gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`, expected: 26
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
      { input: `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`, expected: 5353 },
      {
        input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
      edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
      fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
      fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
      aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
      fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
      dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
      bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
      egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
      gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`, expected: 61229
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
