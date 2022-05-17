import fs from 'fs';
import { isPnpmWorkspaces } from '../src/monorepo';

describe('isPnpmWorkspaces', () => {
  test('should return correct result', () => {
    const mockExistsSync = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(input => input === '/foo/pnpm-workspace.yaml');

    expect(isPnpmWorkspaces('/foo')).toBeTruthy();

    mockExistsSync.mockRestore();
  });
});
