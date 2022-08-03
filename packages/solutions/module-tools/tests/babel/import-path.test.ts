import * as path from 'path';
import * as babel from '@babel/core';
import importPath, {
  getImportFileDistPath,
  getReplacePath,
  isNotJsLikeFile,
  isShouldSkip,
  isStyleFile,
} from '../../src/babel/built-in/import-path';

describe('getImportFileDistPath', () => {
  const currentFileName = path.join(
    __dirname,
    './fixtures/import-path/source/index.ts',
  );
  test(`import style file with default options`, () => {
    const importName = './index.css';
    const ret = getImportFileDistPath(importName, currentFileName, {});
    expect(ret).toBe('./index.css');
  });

  test(`import style file with styleDir = './style'`, () => {
    const importName = './index.css';
    const ret = getImportFileDistPath(importName, currentFileName, {
      styleDir: './style',
    });
    expect(ret).toBe('./style/index.css');
  });

  test(`import style file with styleDir = 'style'`, () => {
    const importName = './index.css';
    const ret = getImportFileDistPath(importName, currentFileName, {
      styleDir: 'style',
    });
    expect(ret).toBe('./style/index.css');
  });

  test(`import style file with styleDir = '../style'`, () => {
    const importName = './index.css';
    const ret = getImportFileDistPath(importName, currentFileName, {
      styleDir: '../style',
    });
    expect(ret).toBe('../style/index.css');
  });

  test(`import static file with default options`, () => {
    const importName = './bar.json';
    const ret = getImportFileDistPath(importName, currentFileName, {});
    expect(ret).toBe('./bar.json');
  });

  test(`import static file with staticDir = './static'`, () => {
    const importName = './bar.json';
    const ret = getImportFileDistPath(importName, currentFileName, {
      staticDir: './static',
    });
    expect(ret).toBe('./static/bar.json');
  });

  test(`import static file with staticDir = 'static'`, () => {
    const importName = './bar.json';
    const ret = getImportFileDistPath(importName, currentFileName, {
      staticDir: 'static',
    });
    expect(ret).toBe('./static/bar.json');
  });

  test(`import static file with staticDir = '../static'`, () => {
    const importName = './bar.json';
    const ret = getImportFileDistPath(importName, currentFileName, {
      staticDir: '../static',
    });
    expect(ret).toBe('../static/bar.json');
  });
});

describe('isNotJsLikeFile', () => {
  const compileFile = path.join(
    __dirname,
    './fixtures/import-path/source/bar.ts',
  );
  test(`import './a.(js|jsx|ts|tsx), return false'`, () => {
    expect(isNotJsLikeFile('./a.js', compileFile)).toBe(false);
    expect(isNotJsLikeFile('./a.jsx', compileFile)).toBe(false);
    expect(isNotJsLikeFile('./a.ts', compileFile)).toBe(false);
    expect(isNotJsLikeFile('./a.tsx', compileFile)).toBe(false);
  });

  test(`import './index', return false'`, () => {
    expect(isNotJsLikeFile('./bar', compileFile)).toBe(false);
  });

  test(`import './bar', return false'`, () => {
    expect(isNotJsLikeFile('./bar', compileFile)).toBe(false);
  });

  test(`import './foo', return true'`, () => {
    expect(isNotJsLikeFile('./foo', compileFile)).toBe(true);
  });
});

describe('isStyleFile', () => {
  test(`'index.css' is style file`, () => {
    expect(isStyleFile('index.css')).toBe(true);
  });

  test(`'index.less' is style file`, () => {
    expect(isStyleFile('index.css')).toBe(true);
  });

  test(`'index.sass' is style file`, () => {
    expect(isStyleFile('index.sass')).toBe(true);
  });

  test(`'index.scss' is style file`, () => {
    expect(isStyleFile('index.scss')).toBe(true);
  });

  test(`'index.js' is not style file`, () => {
    expect(isStyleFile('index.js')).toBe(false);
  });
});

describe('isShouldSkip', () => {
  const compileFile = path.join(
    __dirname,
    './fixtures/import-path/source/bar.ts',
  );

  test(`import React from 'react'`, () => {
    expect(isShouldSkip('react', compileFile)).toBe(true);
  });

  test(`import './bar'`, () => {
    expect(isShouldSkip('./bar', compileFile)).toBe(true);
  });

  test(`import './foo'`, () => {
    expect(isShouldSkip('./foo', compileFile)).toBe(false);
  });
});

describe('getReplacePath', () => {
  const compileFile = path.join(
    __dirname,
    './fixtures/import-path/source/index.ts',
  );
  test('importName or currentFilename is undefined', () => {
    expect(getReplacePath({})).toBe('');
  });

  test(`import .js(x), .ts(x), npm pkg`, () => {
    expect(getReplacePath({}, './index.js', compileFile)).toBe('');
    expect(getReplacePath({}, './index.jsx', compileFile)).toBe('');
    expect(getReplacePath({}, './index.ts', compileFile)).toBe('');
    expect(getReplacePath({}, './index.tsx', compileFile)).toBe('');
    expect(getReplacePath({}, 'react', compileFile)).toBe('');
  });

  test(`import a.less, b.scss, c.css, d.sass, and 'importStyle' is default value 'source-code'`, () => {
    expect(getReplacePath({}, './a.less', compileFile)).toBe('./a.less');
    expect(getReplacePath({}, './b.scss', compileFile)).toBe('./b.scss');
    expect(getReplacePath({}, './c.css', compileFile)).toBe('./c.css');
    expect(getReplacePath({}, './d.sass', compileFile)).toBe('./d.sass');

    expect(
      getReplacePath({ styleDir: './style' }, './a.less', compileFile),
    ).toBe('./style/a.less');
    expect(
      getReplacePath({ styleDir: './style' }, './b.scss', compileFile),
    ).toBe('./style/b.scss');
    expect(
      getReplacePath({ styleDir: './style' }, './c.css', compileFile),
    ).toBe('./style/c.css');
    expect(
      getReplacePath({ styleDir: './style' }, './d.sass', compileFile),
    ).toBe('./style/d.sass');
  });

  test(`import a.less, b.scss, c.css, d.sass and 'importStyle' is 'compiled-code'`, () => {
    expect(
      getReplacePath({ importStyle: 'compiled-code' }, './a.less', compileFile),
    ).toBe('./a.css');
    expect(
      getReplacePath({ importStyle: 'compiled-code' }, './b.scss', compileFile),
    ).toBe('./b.css');
    expect(
      getReplacePath({ importStyle: 'compiled-code' }, './c.css', compileFile),
    ).toBe('./c.css');
    expect(
      getReplacePath({ importStyle: 'compiled-code' }, './d.sass', compileFile),
    ).toBe('./d.css');

    expect(
      getReplacePath(
        { styleDir: './style', importStyle: 'compiled-code' },
        './a.less',
        compileFile,
      ),
    ).toBe('./style/a.css');
    expect(
      getReplacePath(
        { styleDir: './style', importStyle: 'compiled-code' },
        './b.scss',
        compileFile,
      ),
    ).toBe('./style/b.css');
    expect(
      getReplacePath(
        { styleDir: './style', importStyle: 'compiled-code' },
        './c.css',
        compileFile,
      ),
    ).toBe('./style/c.css');
    expect(
      getReplacePath(
        { styleDir: './style', importStyle: 'compiled-code' },
        './d.sass',
        compileFile,
      ),
    ).toBe('./style/d.css');
  });

  test('import a.json, b.png, c.jpg, d.md', () => {
    expect(
      getReplacePath({ staticDir: './static' }, './a.json', compileFile),
    ).toBe('./static/a.json');
    expect(
      getReplacePath({ staticDir: './static' }, './b.png', compileFile),
    ).toBe('./static/b.png');
    expect(
      getReplacePath({ staticDir: './static' }, './c.jpg', compileFile),
    ).toBe('./static/c.jpg');
    expect(
      getReplacePath({ staticDir: './static' }, './d.md', compileFile),
    ).toBe('./static/d.md');
  });
});

describe('importPath babel plugin', () => {
  test(`import/require style file, options is { styleDir: './style-dir' }`, () => {
    const projectDir = path.join(__dirname, './fixtures/import-path');
    const filePath1 = path.join(projectDir, './source/index.ts');
    const babelPlugin = [importPath(), { styleDir: './style-dir' }];

    const ret1 = babel.transformFileSync(filePath1, {
      plugins: [babelPlugin],
    });
    if (ret1) {
      // TODO: window test
      expect(ret1.code).toMatchSnapshot();
    } else {
      expect(0).toBe('build fail');
    }

    const filePath2 = path.join(projectDir, './source/index.js');
    const ret2 = babel.transformFileSync(filePath2, {
      plugins: [babelPlugin],
    });
    if (ret2) {
      // TODO: window test
      expect(ret2.code).toMatchSnapshot();
    } else {
      expect(0).toBe('build fail');
    }
  });

  test(`import/require style file, options is { styleDir: './style-dir', importStyle: 'compiled-code' }`, () => {
    const projectDir = path.join(__dirname, './fixtures/import-path');
    const babelPlugin = [
      importPath(),
      { styleDir: './style-dir', importStyle: 'compiled-code' },
    ];

    const filePath = path.join(projectDir, './source/index.ts');
    const ret = babel.transformFileSync(filePath, {
      plugins: [babelPlugin],
    });
    if (ret) {
      // TODO: window test
      expect(ret.code).toMatchSnapshot();
    } else {
      expect(0).toBe('build fail');
    }

    const filePath1 = path.join(projectDir, './source/index.js');
    const ret1 = babel.transformFileSync(filePath1, {
      plugins: [babelPlugin],
    });
    if (ret1) {
      // TODO: window test
      expect(ret1.code).toMatchSnapshot();
    } else {
      expect(0).toBe('build fail');
    }
  });

  test(`import/require static file, options is { staticDir: './static-dir'}`, () => {
    const projectDir = path.join(__dirname, './fixtures/import-path');
    const babelPlugin = [importPath(), { staticDir: './staitc-dir' }];

    const filePath = path.join(projectDir, './source/far.ts');
    const ret = babel.transformFileSync(filePath, {
      plugins: [babelPlugin],
    });
    if (ret) {
      // TODO: window test
      expect(ret.code).toMatchSnapshot();
    } else {
      expect(0).toBe('build fail');
    }

    const filePath1 = path.join(projectDir, './source/far.js');
    const ret1 = babel.transformFileSync(filePath1, {
      plugins: [babelPlugin],
    });
    if (ret1) {
      // TODO: window test
      expect(ret1.code).toMatchSnapshot();
    } else {
      expect(0).toBe('build fail');
    }
  });
});
