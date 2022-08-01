import { getRandomTwConfigFileName } from '../src/cli';

describe('getRandomTwConfigFileName', () => {
  it('should return a string', () => {
    expect(getRandomTwConfigFileName('./.modern-js/')).toBeDefined();
  });
});
