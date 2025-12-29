import { writeFileSync } from 'fs';

// A simple word to repeat; counting is unambiguous
const WORD = 'test';

// Exact target
const TARGET_WORDS = 80_000;

// Build the text: words separated by single spaces
const text = Array(TARGET_WORDS).fill(WORD).join(' ');

// Optional: sanity check
const count = text.trim().split(/\s+/).length;
if (count !== TARGET_WORDS) {
  throw new Error(`Word count mismatch: ${count}`);
}

// Write to a file for easy testing
writeFileSync('80000-words.txt', text, { encoding: 'utf-8' });

console.log(`Generated ${count} words.`);
