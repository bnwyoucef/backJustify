import { justifyText, countWords } from './textJustifier';

describe('textJustifier', () => {
  describe('justifyText', () => {
    it('should justify a simple text to 80 characters per line', () => {
      const input = 'This is a simple test text that needs to be justified to eighty characters.';
      const result = justifyText(input, 80);
      const lines = result.split('\n');

      lines.forEach((line, index) => {
        if (index < lines.length - 1) {
          expect(line.length).toBe(80);
        }
      });
    });

    it('should handle text with multiple words', () => {
      const input =
        "Longtemps je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n'avais pas le temps de me dire: Je m'endors.";
      const result = justifyText(input, 80);
      const lines = result.split('\n');

      lines.forEach((line, index) => {
        if (index < lines.length - 1) {
          expect(line.length).toBe(80);
        }
      });
    });

    it('should handle single word that fits in one line', () => {
      const input = 'Hello';
      const result = justifyText(input, 80);
      expect(result).toBe('Hello');
    });

    it('should handle empty text', () => {
      const result = justifyText('', 80);
      expect(result).toBe('');
    });

    it('should handle text with only spaces', () => {
      const result = justifyText('    ', 80);
      expect(result).toBe('');
    });

    it('should handle text with multiple spaces between words', () => {
      const input = 'This    has    multiple    spaces';
      const result = justifyText(input, 80);
      const lines = result.split('\n');
      expect(lines.length).toBeGreaterThan(0);
    });

    it('should distribute spaces evenly in justified lines', () => {
      const input = 'This is an example of text justification with even spacing.';
      const result = justifyText(input, 80);
      const lines = result.split('\n');

      lines.forEach((line, index) => {
        if (index < lines.length - 1) {
          expect(line.length).toBe(80);
          expect(line.trim().length).toBeGreaterThan(0);
        }
      });
    });

    it('should handle text with line breaks', () => {
      const input = 'Line one\nLine two\nLine three';
      const result = justifyText(input, 80);
      expect(result).toBeTruthy();
    });

    it('should work with different max widths', () => {
      const input = 'This is a test';
      const result = justifyText(input, 20);
      const lines = result.split('\n');

      lines.forEach((line, index) => {
        if (index < lines.length - 1) {
          expect(line.length).toBeLessThanOrEqual(20);
        }
      });
    });

    it('should handle long words that exceed max width', () => {
      const input =
        'This is a supercalifragilisticexpialidocious word that is very very long indeed.';
      const result = justifyText(input, 20);
      expect(result).toBeTruthy();
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(countWords('This is a test')).toBe(4);
      expect(countWords('One')).toBe(1);
      expect(countWords('One Two Three Four Five')).toBe(5);
    });

    it('should handle empty text', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });

    it('should handle text with multiple spaces', () => {
      expect(countWords('This    has    multiple    spaces')).toBe(4);
    });

    it('should handle text with line breaks', () => {
      expect(countWords('Line one\nLine two\nLine three')).toBe(6);
    });

    it('should handle text with tabs', () => {
      expect(countWords('Word1\tWord2\tWord3')).toBe(3);
    });
  });
});
