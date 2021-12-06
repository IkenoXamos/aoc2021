import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(',').map(str => Number(str.trim()));

class Node<T = number> {
  constructor(public value: T, public next?: Node<T> | undefined) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList<T = number> {
  constructor(public head?: Node<T> | undefined, public tail?: Node<T> | undefined) {
    this.head = head;
    this.tail = tail;
  }

  public get( predicate: (value: T) => boolean): Node<T> | undefined {
    let runner = this.head;

    while(runner !== undefined) {
      if(predicate(runner.value)) {
        return runner;
      }

      runner = runner.next;
    }

    return undefined;
  }

  public add(value: T): Node<T> {
    if(!this.head || !this.tail) {
      this.head = new Node<T>(value);
      this.tail = this.head;
      return this.head;
    }

    this.tail.next = new Node<T>(value);
    this.tail = this.tail.next;
    return this.tail;
  }

  public remove(node: Node<T>): Node<T> | undefined {
    if(this.head === undefined || this.tail === undefined) {
      return undefined;
    }

    if(this.head === node && this.tail === node) {
      this.head = undefined;
      this.tail = undefined;
      return node;
    }

    if(this.head === node && this.tail !== node) {
      this.head = this.head.next;
      return node;
    }

    if(this.head !== node && this.tail === node) {
      let runner = this.head;
      while(runner.next !== this.tail) {
        runner = runner.next as Node<T>;
      }

      this.tail = runner;
      return node;
    }

    let runner = this.head;
    while(runner.next != undefined) {
      if(runner.next === node) {
        runner.next = node.next;
        return node;
      }
      runner = runner.next as Node<T>;
    }

    return undefined;
  }

  public removeByValue(value: T): Node<T> | undefined {
    if(this.head === undefined || this.tail === undefined) {
      return undefined;
    }

    if(this.head.value === value && this.tail.value === value) {
      const node = this.head;
      this.head = undefined;
      this.tail = undefined;
      return node;
    }

    if(this.head.value === value && this.tail.value !== value) {
      const node = this.head;
      this.head = this.head.next;
      return node;
    }

    if(this.head.value !== value && this.tail.value === value) {
      let runner = this.head;
      while(runner.next !== this.tail) {
        runner = runner.next as Node<T>;
      }

      this.tail = runner;
      return runner;
    }

    let runner = this.head;
    while(runner.next != undefined) {
      if(runner.next.value === value) {
        const node = runner.next;
        runner.next = node.next;
        return node;
      }
      runner = runner.next as Node<T>;
    }

    return undefined;
  }

  public print() {
    for(let runner = this.head; runner !== undefined; runner = runner.next) {
      console.log(runner);
    }
  }

  public get length(): number {
    let length = 0;

    for(let runner = this.head; runner !== undefined; runner = runner.next) {
      length++;
    }

    return length;
  }
}

interface FishData {
  timer: number;
  count: number;
}

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput);
  const DAYS = 80;

  const primary = new LinkedList<FishData>();
  for(let i = 0; i < 7; i++) {
    primary.add({timer: i, count: 0});
  }

  const secondary = new LinkedList<FishData>();

  for(let timer of input) {
    for(let runner = primary.head; runner !== undefined; runner = runner.next) {
      if(timer === runner.value.timer) {
        runner.value.count++;
        break;
      }
    }
  }

  for(let i = 0; i < DAYS; i++) {
    for(let runner = primary.head; runner !== undefined; runner = runner.next) {
      if(runner.value.timer === 0) {
        runner.value.timer = 6;

        secondary.add({timer: 9, count: runner.value.count});
      } else {
        runner.value.timer--;
      }
    }

    for(let runner = secondary.head; runner !== undefined; runner = runner.next) {
      if(runner.value.timer === 7) {
        secondary.remove(runner);
        const node = primary.get( (value) => value.timer === 6) as Node<FishData>;

        node.value.count += runner.value.count;
      } else {
        runner.value.timer--;
      }
    }
  }

  let count = 0;
  for(let runner = primary.head; runner !== undefined; runner = runner.next) {
    count += runner.value.count;
  }
  for(let runner = secondary.head; runner !== undefined; runner = runner.next) {
    count += runner.value.count;
  }

  return count;
};


const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const DAYS = 256;

  const primary = new LinkedList<FishData>();
  for(let i = 0; i < 7; i++) {
    primary.add({timer: i, count: 0});
  }

  const secondary = new LinkedList<FishData>();

  for(let timer of input) {
    for(let runner = primary.head; runner !== undefined; runner = runner.next) {
      if(timer === runner.value.timer) {
        runner.value.count++;
        break;
      }
    }
  }

  for(let i = 0; i < DAYS; i++) {
    for(let runner = primary.head; runner !== undefined; runner = runner.next) {
      if(runner.value.timer === 0) {
        runner.value.timer = 6;

        secondary.add({timer: 9, count: runner.value.count});
      } else {
        runner.value.timer--;
      }
    }

    for(let runner = secondary.head; runner !== undefined; runner = runner.next) {
      if(runner.value.timer === 7) {
        secondary.remove(runner);
        const node = primary.get( (value) => value.timer === 6) as Node<FishData>;

        node.value.count += runner.value.count;
      } else {
        runner.value.timer--;
      }
    }
  }

  let count = 0;
  for(let runner = primary.head; runner !== undefined; runner = runner.next) {
    count += runner.value.count;
  }
  for(let runner = secondary.head; runner !== undefined; runner = runner.next) {
    count += runner.value.count;
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
  trimTestInputs: true
});
