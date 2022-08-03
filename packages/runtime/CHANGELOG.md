# @modern-js/runtime

## 1.4.1

### Patch Changes

- 132812542: fix: plugin runtime dependencies

  fix: 修复 runtime 插件依赖

## 1.4.0

### Minor Changes

- 4fc801f: chore(runtime): merge `@modern-js/plugin-state` to `@modern-js/runtime`

  chore(runtime): 合并 `@modern-js/plugin-state` 到 `@modern-js/runtime`

- 4fc801f: chore(runtime): merge `@modern-js/plugin-router` to `@modern-js/runtime`

  chore(runtime): 合并 `@modern-js/plugin-router` 到 `@modern-js/runtime`

- 4fc801f: chore(runtime): merge `@modern-js/plugin-ssr` to `@modern-js/runtime`

  chore(runtime): 合并 `@modern-js/plugin-ssr` 到 `@modern-js/runtime`

- 4fc801f: chore(runtime): remove `@modern-js/create-request` from `@modern-js/runtime`

  chore(runtime): `@modern-js/runtime` 中移除 `@modern-js/create-request` 依赖

- 16eaebd: fix: package exports field

  fix: 修复包导出字段

- 8f046e8: chore(bff): remove `@modern-js/bff-runtime` from `@modern-js/runtime` dependence

  chore(bff): `@modern-js/runtime` 中移除 `@modern-js/bff-runtime` 依赖

### Patch Changes

- 1421965: fix: ssg build error when multi entries
  fix: 修复多入口下 SSG 构建错误
- b8ea9cd: fix runtime ssr exports
- c8614b8: fix: using typeof window to determine the browser environment is not accurate
  fix: 使用 typeof windows 判断浏览器环境不够准确
- Updated dependencies [1421965]
- Updated dependencies [02647d2]
- Updated dependencies [4fc801f]
- Updated dependencies [9d60891]
- Updated dependencies [e4b73b2]
- Updated dependencies [c8614b8]
- Updated dependencies [df73691]
  - @modern-js/webpack@1.12.2
  - @modern-js/utils@1.8.0
  - @modern-js/runtime-core@1.5.4

## 1.3.5

### Patch Changes

- 8d0f1b9: feat: rumtime config types
  feat: 补充 runtime 配置类型
- Updated dependencies [33cebd2]
  - @modern-js/plugin-ssr@1.5.0
  - @modern-js/plugin-router@1.2.16
  - @modern-js/plugin-state@1.2.10
  - @modern-js/runtime-core@1.5.3
  - @modern-js/utils@1.7.12

## 1.3.4

### Patch Changes

- 3050acc: add styled-components alias
- Updated dependencies [77a8e9e]
- Updated dependencies [43b2224]
- Updated dependencies [dc37349]
- Updated dependencies [77a8e9e]
- Updated dependencies [f29e9ba]
- Updated dependencies [2dacc89]
- Updated dependencies [a90bc96]
  - @modern-js/bff-runtime@1.3.0
  - @modern-js/plugin-ssr@1.4.6
  - @modern-js/runtime-core@1.5.2
  - @modern-js/plugin-router@1.2.16
  - @modern-js/create-request@1.3.0
  - @modern-js/utils@1.7.9
  - @modern-js/plugin-state@1.2.10

## 1.3.3

### Patch Changes

- 8d0eb81f5: add styled-components alias

## 1.3.2

### Patch Changes

- a1198d509: feat: bump babel 7.18.0
- Updated dependencies [a1198d509]
  - @modern-js/plugin-router@1.2.15
  - @modern-js/plugin-ssr@1.4.5
  - @modern-js/plugin-state@1.2.10
  - @modern-js/runtime-core@1.4.9
  - @modern-js/bff-runtime@1.2.4
  - @modern-js/create-request@1.2.11

## 1.3.1

### Patch Changes

- 37250cb8f: feat: supply `AppConfig` types
- Updated dependencies [6c8ab42dd]
- Updated dependencies [808baede3]
- Updated dependencies [37250cb8f]
- Updated dependencies [fc43fef39]
- Updated dependencies [a204922e8]
  - @modern-js/plugin-ssr@1.4.4
  - @modern-js/runtime-core@1.4.8
  - @modern-js/plugin-state@1.2.9
  - @modern-js/plugin-router@1.2.14

## 1.3.0

### Minor Changes

- a9f5d170c: fix: @modern-js/runtime/model effects type error

### Patch Changes

- d32f35134: chore: add modern/jest/eslint/ts config files to .npmignore
- Updated dependencies [d32f35134]
- Updated dependencies [6ae4a34ae]
- Updated dependencies [97086dde8]
- Updated dependencies [97086dde8]
- Updated dependencies [b80229c79]
- Updated dependencies [5bfb57321]
- Updated dependencies [948cc4436]
  - @modern-js/plugin-router@1.2.14
  - @modern-js/plugin-state@1.2.7
  - @modern-js/runtime-core@1.4.6
  - @modern-js/bff-runtime@1.2.3
  - @modern-js/create-request@1.2.8
  - @modern-js/utils@1.7.3
  - @modern-js/plugin-ssr@1.3.2

## 1.2.9

### Patch Changes

- 69a728375: fix: remove exports.jsnext:source after publish
- Updated dependencies [cd7346b0d]
- Updated dependencies [0e0537005]
- Updated dependencies [69a728375]
- Updated dependencies [0f86e133b]
- Updated dependencies [b5943b029]
  - @modern-js/runtime-core@1.4.5
  - @modern-js/utils@1.7.2
  - @modern-js/plugin-ssr@1.3.1
  - @modern-js/plugin-router@1.2.13
  - @modern-js/create-request@1.2.7
  - @modern-js/plugin-state@1.2.6

## 1.2.7

### Patch Changes

- 6c1438d2: fix: missing peer deps warnings
- 123e432d: uglify ssr bundle for treeshaking
- Updated dependencies [2d155c4c]
- Updated dependencies [a0475f1a]
- Updated dependencies [123e432d]
- Updated dependencies [6c1438d2]
- Updated dependencies [e5a9b26d]
- Updated dependencies [0b26b93b]
- Updated dependencies [123e432d]
- Updated dependencies [f9f66ef9]
- Updated dependencies [592edabc]
- Updated dependencies [895fa0ff]
- Updated dependencies [3578913e]
- Updated dependencies [0fccff68]
- Updated dependencies [1c3beab3]
  - @modern-js/utils@1.6.0
  - @modern-js/plugin-ssr@1.2.8
  - @modern-js/plugin-state@1.2.5
  - @modern-js/plugin-router@1.2.11
  - @modern-js/runtime-core@1.4.3
  - @modern-js/create-request@1.2.5

## 1.2.6

### Patch Changes

- 6cffe99d: chore:
  remove react eslint rules for `modern-js` rule set.
  add .eslintrc for each package to speed up linting
- 04ae5262: chore: bump @modern-js/utils to v1.4.1 in dependencies
- 60f7d8bf: feat: add tests dir to npmignore
- Updated dependencies [b8599d09]
- Updated dependencies [6cffe99d]
- Updated dependencies [04ae5262]
- Updated dependencies [60f7d8bf]
- Updated dependencies [e4cec1ce]
- Updated dependencies [3bf4f8b0]
  - @modern-js/utils@1.5.0
  - @modern-js/plugin-router@1.2.10
  - @modern-js/plugin-state@1.2.4
  - @modern-js/runtime-core@1.4.2
  - @modern-js/bff-runtime@1.2.2
  - @modern-js/create-request@1.2.4
  - @modern-js/plugin-ssr@1.2.7

## 1.2.5

### Patch Changes

- bebb39b6: chore: improve devDependencies and peerDependencies
- ff73a5cc: fix style-component bugs
- Updated dependencies [bebb39b6]
- Updated dependencies [132f7b53]
- Updated dependencies [c4a7e4a3]
- Updated dependencies [ff73a5cc]
- Updated dependencies [9d4a005b]
  - @modern-js/plugin-router@1.2.8
  - @modern-js/plugin-ssr@1.2.5
  - @modern-js/plugin-state@1.2.3
  - @modern-js/utils@1.3.7

## 1.2.4

### Patch Changes

- 94d02b35: feat(plugin-runtime): convert to new plugin
- 808cec13: fix(plugin-runtime): fix usePlugins error
- 681a1ff9: feat: remove unnecessary peerDependencies
- Updated dependencies [c2046f37]
- Updated dependencies [a2261fed]
- Updated dependencies [cee0efcc]
- Updated dependencies [94d02b35]
- Updated dependencies [57e8ce98]
- Updated dependencies [e31ce644]
- Updated dependencies [681a1ff9]
- Updated dependencies [e8bbc315]
  - @modern-js/utils@1.3.6
  - @modern-js/runtime-core@1.4.0
  - @modern-js/plugin-router@1.2.6
  - @modern-js/plugin-state@1.2.2
  - @modern-js/plugin-ssr@1.2.4

## 1.2.3

### Patch Changes

- 6891e4c2: add theme token some config logic
- 0cd8b592: fix: runtime head and loadable type not found
- Updated dependencies [b376c8d6]
- Updated dependencies [735b2a81]
- Updated dependencies [e62c4efd]
- Updated dependencies [5ed05e65]
- Updated dependencies [735b2a81]
- Updated dependencies [e2a8233f]
  - @modern-js/core@1.4.2
  - @modern-js/plugin-ssr@1.2.2
  - @modern-js/runtime-core@1.2.3

## 1.2.2

### Patch Changes

- d099e5c5: fix error when modify modern.config.js
- 24f616ca: feat: support custom meta info
- Updated dependencies [816fd721]
- Updated dependencies [d9cc5ea9]
- Updated dependencies [bfbea9a7]
- Updated dependencies [bd819a8d]
- Updated dependencies [ec4dbffb]
- Updated dependencies [d099e5c5]
- Updated dependencies [bada2879]
- Updated dependencies [24f616ca]
- Updated dependencies [bd819a8d]
- Updated dependencies [272cab15]
  - @modern-js/plugin-ssr@1.2.1
  - @modern-js/core@1.4.0
  - @modern-js/plugin-router@1.2.2
  - @modern-js/runtime-core@1.2.2
  - @modern-js/utils@1.3.0

## 1.2.1

### Patch Changes

- 83166714: change .npmignore
- Updated dependencies [83166714]
- Updated dependencies [c3de9882]
- Updated dependencies [33ff48af]
- Updated dependencies [c74597bd]
  - @modern-js/core@1.3.2
  - @modern-js/plugin-router@1.2.1
  - @modern-js/plugin-state@1.2.1
  - @modern-js/runtime-core@1.2.1
  - @modern-js/bff-runtime@1.2.1
  - @modern-js/create-request@1.2.1
  - @modern-js/utils@1.2.2

## 1.2.0

### Minor Changes

- cfe11628: Make Modern.js self bootstraping

### Patch Changes

- 146dcd85: modify server framework plugin hook types and hook context
- 146dcd85: modify server framework plugin hook types
- 146dcd85: fix test case in babel compiler
- Updated dependencies [2da09c69]
- Updated dependencies [5597289b]
- Updated dependencies [fc71e36f]
- Updated dependencies [146dcd85]
- Updated dependencies [a2cb9abc]
- Updated dependencies [c3d46ee4]
- Updated dependencies [cfe11628]
- Updated dependencies [146dcd85]
- Updated dependencies [146dcd85]
  - @modern-js/utils@1.2.0
  - @modern-js/plugin-ssr@1.2.0
  - @modern-js/create-request@1.2.0
  - @modern-js/core@1.3.0
  - @modern-js/bff-runtime@1.2.0
  - @modern-js/runtime-core@1.2.0
  - @modern-js/plugin-router@1.2.0
  - @modern-js/plugin-state@1.2.0

## 1.1.3

### Patch Changes

- b8deff8b: feat: add isBrowser in runtime context
- Updated dependencies [e63591cc]
  - @modern-js/plugin-router@1.1.3
  - @modern-js/runtime-core@1.1.4

## 1.1.2

### Patch Changes

- e51b1db3: feat: support custom sdk, interceptor, headers for bff request
- Updated dependencies [e51b1db3]
- Updated dependencies [4a281912]
- Updated dependencies [4a281912]
- Updated dependencies [b7fb82ec]
- Updated dependencies [eb026119]
  - @modern-js/plugin-ssr@1.1.3
  - @modern-js/create-request@1.1.2
  - @modern-js/runtime-core@1.1.3
  - @modern-js/plugin-router@1.1.2
  - @modern-js/plugin-state@1.1.4
  - @modern-js/utils@1.1.6

## 1.1.1

### Patch Changes

- 0fa83663: support more .env files
- Updated dependencies [6f7fe574]
- Updated dependencies [0fa83663]
- Updated dependencies [f594fbc8]
  - @modern-js/core@1.1.2
  - @modern-js/plugin-state@1.1.2
  - @modern-js/runtime-core@1.1.1
  - @modern-js/bff-runtime@1.1.1
  - @modern-js/utils@1.1.2
  - @modern-js/plugin-router@1.1.1
  - @modern-js/plugin-ssr@1.1.1

## 1.1.0

### Minor Changes

- 96119db2: Relese v1.1.0

### Patch Changes

- Updated dependencies [96119db2]
  - @modern-js/core@1.1.0
  - @modern-js/plugin-router@1.1.0
  - @modern-js/plugin-ssr@1.1.0
  - @modern-js/plugin-state@1.1.0
  - @modern-js/runtime-core@1.1.0
  - @modern-js/bff-runtime@1.1.0
  - @modern-js/utils@1.1.0

## 1.0.0

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 0fd196e: feat: fix bugs
- 204c626: feat: initial
- 63be0a5: fix: #118 #104
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [0fd196e]
- Updated dependencies [204c626]
- Updated dependencies [63be0a5]
  - @modern-js/core@1.0.0
  - @modern-js/plugin-router@1.0.0
  - @modern-js/plugin-ssr@1.0.0
  - @modern-js/plugin-state@1.0.0
  - @modern-js/runtime-core@1.0.0
  - @modern-js/bff-runtime@1.0.0
  - @modern-js/utils@1.0.0

## 1.0.0-rc.23

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 0fd196e: feat: fix bugs
- 204c626: feat: initial
- 63be0a5: fix: #118 #104
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [0fd196e]
- Updated dependencies [204c626]
- Updated dependencies [63be0a5]
  - @modern-js/core@1.0.0-rc.23
  - @modern-js/plugin-router@1.0.0-rc.23
  - @modern-js/plugin-ssr@1.0.0-rc.23
  - @modern-js/plugin-state@1.0.0-rc.23
  - @modern-js/runtime-core@1.0.0-rc.23
  - @modern-js/bff-runtime@1.0.0-rc.23
  - @modern-js/utils@1.0.0-rc.23

## 1.0.0-rc.22

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 0fd196e: feat: fix bugs
- 204c626: feat: initial
- 63be0a5: fix: #118 #104
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [0fd196e]
- Updated dependencies [204c626]
- Updated dependencies [63be0a5]
  - @modern-js/core@1.0.0-rc.22
  - @modern-js/plugin-router@1.0.0-rc.22
  - @modern-js/plugin-ssr@1.0.0-rc.22
  - @modern-js/plugin-state@1.0.0-rc.22
  - @modern-js/runtime-core@1.0.0-rc.22
  - @modern-js/bff-runtime@1.0.0-rc.22
  - @modern-js/utils@1.0.0-rc.22

## 1.0.0-rc.21

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 0fd196e: feat: fix bugs
- 204c626: feat: initial
- 63be0a5: fix: #118 #104
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [0fd196e]
- Updated dependencies [204c626]
- Updated dependencies [63be0a5]
  - @modern-js/core@1.0.0-rc.21
  - @modern-js/plugin-router@1.0.0-rc.21
  - @modern-js/plugin-ssr@1.0.0-rc.21
  - @modern-js/plugin-state@1.0.0-rc.21
  - @modern-js/runtime-core@1.0.0-rc.21
  - @modern-js/bff-runtime@1.0.0-rc.21
  - @modern-js/utils@1.0.0-rc.21

## 1.0.0-rc.20

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- feat: fix bugs
- 204c626: feat: initial
- 63be0a5: fix: #118 #104
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [undefined]
- Updated dependencies [204c626]
- Updated dependencies [63be0a5]
  - @modern-js/core@1.0.0-rc.20
  - @modern-js/plugin-router@1.0.0-rc.20
  - @modern-js/plugin-ssr@1.0.0-rc.20
  - @modern-js/plugin-state@1.0.0-rc.20
  - @modern-js/runtime-core@1.0.0-rc.20
  - @modern-js/bff-runtime@1.0.0-rc.20
  - @modern-js/utils@1.0.0-rc.20

## 1.0.0-rc.19

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 204c626: feat: initial
- 63be0a5: fix: #118 #104
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [204c626]
- Updated dependencies [63be0a5]
  - @modern-js/core@1.0.0-rc.19
  - @modern-js/plugin-router@1.0.0-rc.19
  - @modern-js/plugin-ssr@1.0.0-rc.19
  - @modern-js/plugin-state@1.0.0-rc.19
  - @modern-js/runtime-core@1.0.0-rc.19
  - @modern-js/bff-runtime@1.0.0-rc.19
  - @modern-js/utils@1.0.0-rc.19

## 1.0.0-rc.18

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 204c626: feat: initial
- 63be0a5: fix: #118 #104
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [204c626]
- Updated dependencies [63be0a5]
  - @modern-js/core@1.0.0-rc.18
  - @modern-js/plugin-router@1.0.0-rc.18
  - @modern-js/plugin-ssr@1.0.0-rc.18
  - @modern-js/plugin-state@1.0.0-rc.18
  - @modern-js/runtime-core@1.0.0-rc.18
  - @modern-js/bff-runtime@1.0.0-rc.18
  - @modern-js/utils@1.0.0-rc.18

## 1.0.0-rc.17

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 204c626: feat: initial
- fix: #118 #104
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [204c626]
- Updated dependencies [undefined]
  - @modern-js/core@1.0.0-rc.17
  - @modern-js/plugin-router@1.0.0-rc.17
  - @modern-js/plugin-ssr@1.0.0-rc.17
  - @modern-js/plugin-state@1.0.0-rc.17
  - @modern-js/runtime-core@1.0.0-rc.17
  - @modern-js/bff-runtime@1.0.0-rc.17
  - @modern-js/utils@1.0.0-rc.17

## 1.0.0-rc.16

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.16
  - @modern-js/plugin-router@1.0.0-rc.16
  - @modern-js/plugin-ssr@1.0.0-rc.16
  - @modern-js/plugin-state@1.0.0-rc.16
  - @modern-js/runtime-core@1.0.0-rc.16
  - @modern-js/bff-runtime@1.0.0-rc.16
  - @modern-js/utils@1.0.0-rc.16

## 1.0.0-rc.15

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.15
  - @modern-js/plugin-router@1.0.0-rc.15
  - @modern-js/plugin-ssr@1.0.0-rc.15
  - @modern-js/plugin-state@1.0.0-rc.15
  - @modern-js/runtime-core@1.0.0-rc.15
  - @modern-js/bff-runtime@1.0.0-rc.15
  - @modern-js/utils@1.0.0-rc.15

## 1.0.0-rc.14

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.14
  - @modern-js/plugin-router@1.0.0-rc.14
  - @modern-js/plugin-ssr@1.0.0-rc.14
  - @modern-js/plugin-state@1.0.0-rc.14
  - @modern-js/runtime-core@1.0.0-rc.14
  - @modern-js/bff-runtime@1.0.0-rc.14
  - @modern-js/utils@1.0.0-rc.14

## 1.0.0-rc.13

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.13
  - @modern-js/plugin-router@1.0.0-rc.13
  - @modern-js/plugin-ssr@1.0.0-rc.13
  - @modern-js/plugin-state@1.0.0-rc.13
  - @modern-js/runtime-core@1.0.0-rc.13
  - @modern-js/bff-runtime@1.0.0-rc.13
  - @modern-js/utils@1.0.0-rc.13

## 1.0.0-rc.12

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.12
  - @modern-js/plugin-router@1.0.0-rc.12
  - @modern-js/plugin-ssr@1.0.0-rc.12
  - @modern-js/plugin-state@1.0.0-rc.12
  - @modern-js/runtime-core@1.0.0-rc.12
  - @modern-js/bff-runtime@1.0.0-rc.12
  - @modern-js/utils@1.0.0-rc.12

## 1.0.0-rc.11

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.11
  - @modern-js/plugin-router@1.0.0-rc.11
  - @modern-js/plugin-ssr@1.0.0-rc.11
  - @modern-js/plugin-state@1.0.0-rc.11
  - @modern-js/runtime-core@1.0.0-rc.11
  - @modern-js/bff-runtime@1.0.0-rc.11
  - @modern-js/utils@1.0.0-rc.11

## 1.0.0-rc.10

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.10
  - @modern-js/plugin-router@1.0.0-rc.10
  - @modern-js/plugin-ssr@1.0.0-rc.10
  - @modern-js/plugin-state@1.0.0-rc.10
  - @modern-js/runtime-core@1.0.0-rc.10
  - @modern-js/bff-runtime@1.0.0-rc.10
  - @modern-js/utils@1.0.0-rc.10

## 1.0.0-rc.9

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.9
  - @modern-js/plugin-router@1.0.0-rc.9
  - @modern-js/plugin-ssr@1.0.0-rc.9
  - @modern-js/plugin-state@1.0.0-rc.9
  - @modern-js/runtime-core@1.0.0-rc.9
  - @modern-js/bff-runtime@1.0.0-rc.9
  - @modern-js/utils@1.0.0-rc.9

## 1.0.0-rc.8

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.8
  - @modern-js/plugin-router@1.0.0-rc.8
  - @modern-js/plugin-ssr@1.0.0-rc.8
  - @modern-js/plugin-state@1.0.0-rc.8
  - @modern-js/runtime-core@1.0.0-rc.8
  - @modern-js/bff-runtime@1.0.0-rc.8
  - @modern-js/utils@1.0.0-rc.8

## 1.0.0-rc.7

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.7
  - @modern-js/plugin-router@1.0.0-rc.7
  - @modern-js/plugin-ssr@1.0.0-rc.7
  - @modern-js/plugin-state@1.0.0-rc.7
  - @modern-js/runtime-core@1.0.0-rc.7
  - @modern-js/bff-runtime@1.0.0-rc.7
  - @modern-js/utils@1.0.0-rc.7

## 1.0.0-rc.6

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.6
  - @modern-js/plugin-router@1.0.0-rc.6
  - @modern-js/plugin-ssr@1.0.0-rc.6
  - @modern-js/plugin-state@1.0.0-rc.6
  - @modern-js/runtime-core@1.0.0-rc.6
  - @modern-js/bff-runtime@1.0.0-rc.6
  - @modern-js/utils@1.0.0-rc.6

## 1.0.0-rc.5

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.5
  - @modern-js/plugin-router@1.0.0-rc.5
  - @modern-js/plugin-ssr@1.0.0-rc.5
  - @modern-js/plugin-state@1.0.0-rc.5
  - @modern-js/runtime-core@1.0.0-rc.5
  - @modern-js/bff-runtime@1.0.0-rc.5
  - @modern-js/utils@1.0.0-rc.5

## 1.0.0-rc.4

### Patch Changes

- fix server route match
- 204c626: feat: initial
- Updated dependencies [undefined]
- Updated dependencies [204c626]
  - @modern-js/core@1.0.0-rc.4
  - @modern-js/plugin-router@1.0.0-rc.4
  - @modern-js/plugin-ssr@1.0.0-rc.4
  - @modern-js/plugin-state@1.0.0-rc.4
  - @modern-js/runtime-core@1.0.0-rc.4
  - @modern-js/bff-runtime@1.0.0-rc.4
  - @modern-js/utils@1.0.0-rc.4

## 1.0.0-rc.3

### Patch Changes

- feat: initial
- Updated dependencies [undefined]
  - @modern-js/core@1.0.0-rc.3
  - @modern-js/plugin-router@1.0.0-rc.3
  - @modern-js/plugin-ssr@1.0.0-rc.3
  - @modern-js/plugin-state@1.0.0-rc.3
  - @modern-js/bff-runtime@1.0.0-rc.3
  - @modern-js/utils@1.0.0-rc.3
  - @modern-js/runtime-core@1.0.0-rc.3
