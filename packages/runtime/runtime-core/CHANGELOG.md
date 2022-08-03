# @modern-js/runtime-core

## 1.5.4

### Patch Changes

- c8614b8: fix: using typeof window to determine the browser environment is not accurate
  fix: 使用 typeof windows 判断浏览器环境不够准确

## 1.5.3

### Patch Changes

- efab847: use client init data first if exist
- Updated dependencies [5b7a5a7]
  - @modern-js/plugin@1.4.2

## 1.5.2

### Patch Changes

- 43b2224: support init return value inject to SSR DATA
- f29e9ba: feat: simplify context usage, no longer depend on containers
- 2dacc89: support set header & status in render
- Updated dependencies [f29e9ba]
  - @modern-js/plugin@1.4.0

## 1.5.1

### Patch Changes

- 30b1bf701: fix(runtime-core): make sure the component returned by `createApp` could be mounted directly
- Updated dependencies [b7302f781]
- Updated dependencies [e0e708f83]
  - @modern-js/plugin@1.3.8

## 1.5.0

### Minor Changes

- 43bf23361: fix: 修复 bootstrap 函数第二个参数不支持传入 dom 节点
  feat: '@modern-js/plugin-garfish' 支持 '@modern-js/runtime/garfish' scope 导出 garfish plugin 内置函数

### Patch Changes

- d5f7060ba: fix: bootstrap arguments
- 209d0a927: release: hot fix garfish error
- Updated dependencies [1ac68424f]
  - @modern-js/plugin@1.3.7

## 1.4.9

### Patch Changes

- a1198d509: feat: bump babel 7.18.0
- Updated dependencies [a1198d509]
  - @modern-js/plugin@1.3.6

## 1.4.8

### Patch Changes

- 808baede3: feat: bootstrap support return component
- 37250cb8f: feat: supply `AppConfig` types
- a204922e8: fix: fix `useLoader` returning undefined when setting \_cache prop

## 1.4.7

### Patch Changes

- be7262e2: feat(runtime): support to disable `useLoader` cache

## 1.4.6

### Patch Changes

- d32f35134: chore: add modern/jest/eslint/ts config files to .npmignore
- 97086dde8: fix ssr data structure
- 97086dde8: passing ssrContext to App.init
- Updated dependencies [d5913bd96]
- Updated dependencies [d32f35134]
  - @modern-js/plugin@1.3.4

## 1.4.5

### Patch Changes

- cd7346b0d: fix some peer dependencies problem & change shell log
- 0f86e133b: fix react & react-dom types problem

## 1.4.4

### Patch Changes

- 6fa74d5f: add internal metrics and logger

## 1.4.3

### Patch Changes

- 895fa0ff: chore: using "workspace:\*" in devDependencies

## 1.4.2

### Patch Changes

- 6cffe99d: chore:
  remove react eslint rules for `modern-js` rule set.
  add .eslintrc for each package to speed up linting
- 60f7d8bf: feat: add tests dir to npmignore
- Updated dependencies [6cffe99d]
- Updated dependencies [60f7d8bf]
  - @modern-js/plugin@1.3.3

## 1.4.1

### Patch Changes

- 485375ae: fix: hoc hook break in conventional routes

## 1.4.0

### Minor Changes

- a2261fed: feat: support new plugin syntax

### Patch Changes

- Updated dependencies [dc88abf9]
- Updated dependencies [0462ff77]
  - @modern-js/plugin@1.3.2

## 1.2.4

### Patch Changes

- 55e18278: chore: remove unused dependencies and devDependencies

## 1.2.3

### Patch Changes

- 5ed05e65: feat: ensure bootstrap work with normal Component

## 1.2.2

### Patch Changes

- bfbea9a7: support multi base url and dynamic base url
- 272cab15: refactor server plugin manager
- Updated dependencies [ec4dbffb]
- Updated dependencies [d099e5c5]
- Updated dependencies [bada2879]
- Updated dependencies [24f616ca]
- Updated dependencies [bd819a8d]
  - @modern-js/utils@1.3.0

## 1.2.1

### Patch Changes

- 83166714: change .npmignore
- c74597bd: fix: useLoader initial data
- Updated dependencies [83166714]
  - @modern-js/plugin@1.2.1
  - @modern-js/utils@1.2.2

## 1.2.0

### Minor Changes

- cfe11628: Make Modern.js self bootstraping

### Patch Changes

- a2cb9abc: fix(runtime): useLoader fallback logic
- Updated dependencies [2da09c69]
- Updated dependencies [c3d46ee4]
- Updated dependencies [cfe11628]
  - @modern-js/utils@1.2.0
  - @modern-js/plugin@1.2.0

## 1.1.4

### Patch Changes

- e63591cc: fix page project dev error

## 1.1.3

### Patch Changes

- 4a281912: app init function support sync function && ssr data add i18n data
- 4a281912: fix: app init function not work
- eb026119: change exports config
- Updated dependencies [b7fb82ec]
  - @modern-js/utils@1.1.6

## 1.1.2

### Patch Changes

- 4406c2db: fix: avoid fetching data again when ssr succeeds
- Updated dependencies [ca7dcb32]
  - @modern-js/utils@1.1.5

## 1.1.1

### Patch Changes

- 0fa83663: support more .env files
- Updated dependencies [0fa83663]
- Updated dependencies [f594fbc8]
  - @modern-js/plugin@1.1.2
  - @modern-js/utils@1.1.2

## 1.1.0

### Minor Changes

- 96119db2: Relese v1.1.0

### Patch Changes

- Updated dependencies [96119db2]
  - @modern-js/plugin@1.1.0
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
  - @modern-js/plugin@1.0.0
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
  - @modern-js/plugin@1.0.0-rc.23
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
  - @modern-js/plugin@1.0.0-rc.22
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
  - @modern-js/plugin@1.0.0-rc.21
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
  - @modern-js/plugin@1.0.0-rc.20
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
  - @modern-js/plugin@1.0.0-rc.19
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
  - @modern-js/plugin@1.0.0-rc.18
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
  - @modern-js/plugin@1.0.0-rc.17
  - @modern-js/utils@1.0.0-rc.17

## 1.0.0-rc.16

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.16
  - @modern-js/utils@1.0.0-rc.16

## 1.0.0-rc.15

### Patch Changes

- 224f7fe: fix server route match
- 30ac27c: feat: add generator package description
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [30ac27c]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.15
  - @modern-js/utils@1.0.0-rc.15

## 1.0.0-rc.14

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.14
  - @modern-js/utils@1.0.0-rc.14

## 1.0.0-rc.13

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.13
  - @modern-js/utils@1.0.0-rc.13

## 1.0.0-rc.12

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.12
  - @modern-js/utils@1.0.0-rc.12

## 1.0.0-rc.11

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.11
  - @modern-js/utils@1.0.0-rc.11

## 1.0.0-rc.10

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.10
  - @modern-js/utils@1.0.0-rc.10

## 1.0.0-rc.9

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.9
  - @modern-js/utils@1.0.0-rc.9

## 1.0.0-rc.8

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.8
  - @modern-js/utils@1.0.0-rc.8

## 1.0.0-rc.7

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.7
  - @modern-js/utils@1.0.0-rc.7

## 1.0.0-rc.6

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.6
  - @modern-js/utils@1.0.0-rc.6

## 1.0.0-rc.5

### Patch Changes

- 224f7fe: fix server route match
- 204c626: feat: initial
- Updated dependencies [224f7fe]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.5
  - @modern-js/utils@1.0.0-rc.5

## 1.0.0-rc.4

### Patch Changes

- fix server route match
- 204c626: feat: initial
- Updated dependencies [undefined]
- Updated dependencies [204c626]
  - @modern-js/plugin@1.0.0-rc.4
  - @modern-js/utils@1.0.0-rc.4

## 1.0.0-rc.3

### Patch Changes

- feat: initial
- Updated dependencies [undefined]
  - @modern-js/plugin@1.0.0-rc.3
  - @modern-js/utils@1.0.0-rc.3
