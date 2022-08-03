import {
  standardSlash,
  urlJoin,
  getLocation,
} from '../../src/router/runtime/utils';

describe('test runtime router utils', () => {
  it('should get location correctly', () => {
    const loc = getLocation({
      request: {
        pathname: '/a',
        url: '/a/b',
      },
    });
    expect(loc).toBe('/a/b');

    const loc1 = getLocation({
      request: {
        pathname: '/b',
        url: '/a/b',
      },
    });
    expect(loc1).toBe('/b');

    const loc2 = getLocation({
      request: {
        pathname: '/c',
        url: '/a/b',
      },
    });
    expect(loc2).toBe('/c');
  });

  it('should standard url slash', () => {
    expect(standardSlash('/a')).toBe('/a');
    expect(standardSlash('/a/')).toBe('/a');
    expect(standardSlash('//')).toBe('/');
    expect(standardSlash('/')).toBe('/');
    expect(standardSlash('./')).toBe('/');
    expect(standardSlash('a')).toBe('/a');
    expect(standardSlash(1 as any)).toBe(1);
  });

  it('should join url correctly', () => {
    expect(urlJoin('', '')).toBe('/');
    expect(urlJoin('/', '')).toBe('/');
    expect(urlJoin('/', '/')).toBe('/');
    expect(urlJoin('/', null as any)).toBe('/');
    expect(urlJoin('/', undefined as any)).toBe('/');
    expect(urlJoin('/a', '')).toBe('/a');
    expect(urlJoin('/a', '/')).toBe('/a');
    expect(urlJoin('/a', '/b')).toBe('/a/b');
    expect(urlJoin('/a', '/b/')).toBe('/a/b');
    expect(urlJoin('', '/b')).toBe('/b');
    expect(urlJoin('a', '/b')).toBe('/a/b');
  });
});
