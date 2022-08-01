---
'@modern-js/core': minor
'@modern-js/plugin-less': minor
'@modern-js/plugin-postcss': minor
'@modern-js/plugin-sass': minor
'@modern-js/webpack': minor
'@modern-js/module-tools': minor
---

chore(css): split css compiler to self plugin

chore(css): 拆分 css 编译函数到各自的插件中，减少 module-tools 对 less 和 sass 的依赖
