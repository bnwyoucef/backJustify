/**
 * Justifies text to a specified line width
 * @param text - The input text to justify
 * @param maxWidth - Maximum line width (default: 80)
 * @returns Justified text with each line padded to maxWidth characters
 */
export function justifyText(text: string, maxWidth: number = 80): string {
  if (!text || text.trim().length === 0) {
    return '';
  }

  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const lines: string[] = [];
  let currentLine: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    const wordLength = word.length;
    const spaceNeeded = currentLine.length > 0 ? 1 : 0;

    if (currentLength + spaceNeeded + wordLength <= maxWidth) {
      currentLine.push(word);
      currentLength += spaceNeeded + wordLength;
    } else {
      if (currentLine.length > 0) {
        lines.push(justifyLine(currentLine, maxWidth));
      }
      currentLine = [word];
      currentLength = wordLength;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }

  return lines.join('\n');
}

/**
 * Justifies a single line by distributing spaces evenly between words
 * @param words - Array of words in the line
 * @param maxWidth - Target line width
 * @returns Justified line with distributed spaces
 */
function justifyLine(words: string[], maxWidth: number): string {
  if (words.length === 1) {
    return words[0].padEnd(maxWidth, ' ');
  }

  const totalChars = words.reduce((sum, word) => sum + word.length, 0);
  const totalSpaces = maxWidth - totalChars;
  const gaps = words.length - 1;
  const spacesPerGap = Math.floor(totalSpaces / gaps);
  const extraSpaces = totalSpaces % gaps;

  let result = '';
  for (let i = 0; i < words.length; i++) {
    result += words[i];
    if (i < words.length - 1) {
      const spaces = spacesPerGap + (i < extraSpaces ? 1 : 0);
      result += ' '.repeat(spaces);
    }
  }

  return result;
}

/**
 * Counts the number of words in a text
 * @param text - Input text
 * @returns Number of words
 */
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}
