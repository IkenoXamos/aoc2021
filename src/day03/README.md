# 🎄 Advent of Code 2021 - day 3 🎄

## Info

Task description: [link](https://adventofcode.com/2021/day/3)

## Notes

The process used was to leverage `number >> position & 1`. This operation extracts out the bit value at the provided bit position.

So `10101 >> 4 & 1` will extract out the 4th (or left-most) bit, resulting in `1`.

We simply iterate through all of the numbers at a given position, computing their bit values.
We count how many 1s were discovered in the bit position, and check if that was at least half.