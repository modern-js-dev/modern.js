---
sidebar_label: baseUrl
sidebar_position: 3
---

# `server.baseUrl`

:::info 适用的工程方案
* MWA
:::

* 类型： `string | string[]`
* 默认值： `undefined`


统一设置服务端路由前缀（常用于共享域名的情况，区分流量)。

```javascript title="modern.config.js"
import { defineConfig } from '@modern-js/app-tools';

export default defineConfig({
  server: {
    // 所有生成的路由前面都会自动加上前缀 `/base`
    // 生成的服务端路由文件路径：dist/route.json
    baseUrl: '/base'

    // 多 baseUrl
    baseUrl: ['/base-new', '/base-old']
  }
})
```

`dev` 之后可以看到路由访问会加上对应前缀:

```bash
Compiled successfully in 6415 ms.

App running at:

  > Local:    http://localhost:8080/base/
  > Network:  http://10.79.136.172:8080/base/
```
