---
sidebar_position: 4
title: 运行时框架
---

如前面章节所说，目前 Modern.js 的 [BFF](/docs/guides/features/server-side/bff/frameworks) 支持 4 种主流的 Server 框架，可以根据自身偏好选择。

多框架支持也是【 一体化 BFF 】中重要的一环，多数情况下，开发者直接使用钩子文件来扩展 BFF 函数，无需关心通过框架启动服务、日志输出等应用级别的问题。

所有框架均支持 BFF 函数的所有能力，并且使用方式是相同的，例如：

- RESTful API
- Schema 模式
- Hooks(useContext)
- 不同的数据类型
- 动态路由
- 一体化调用

Modern.js BFF 中兼容了这些框架大部分的规范，开发者可以直接使用对应 Server 框架的约定和生态。

每一种框架都提供了两类扩展写法 BFF 函数的方式，分别是【 函数写法 】和【 框架写法 】。

## 函数写法

在上一章节中，简单的演示了 Express 扩展 BFF 函数的示例。

函数写法就是通过添加钩子文件 `_app.ts` 的方式，编写中间件逻辑来扩展 BFF 函数。

### [Express](https://expressjs.com/)

Express 的函数写法，可以通过在 `_app.[tj]s` 下添加 `express` 的中间件：

```ts
import { hook } from "@modern-js/runtime/server";

export default hook(({ addMiddleware }) => {
  addMiddleware(async (req, res, next) => {
    req.query.id = "express";
    await next();
  });
});
```

### [Nest](https://nestjs.com/)

Nest 支持添加两种类型的内容：Express 的函数中间件和 Nest 中的 [Module](https://docs.nestjs.com/modules)。

Nest 的函数中间件的添加与 Express 段中的示例相同，Module 写法如下：

```ts title=api/_app.ts
import { hook } from "@modern-js/runtime/server";
import { Module, Injectable, Controller, Get } from "@nestjs/common";

@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getHello() {
    return this.catsService.getHello();
  }
}

@Injectable()
class CatsService {
  getHello(): string {
    return "Hello world!";
  }
}

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
class CatsModule {}

export default hook(({ addMiddleware }) => {
  addMiddleware(CatsModule);
});
```

### [Koa](https://koajs.com/)

Koa 函数写法下，可以通过在 `_app.[tj]s` 下添加 koa 的中间件：

```ts
import { hook } from "@modern-js/runtime/server";

export default hook(({ addMiddleware }) => {
  addMiddleware(async (ctx, next) => {
    console.info(`access url: ${ctx.url}`);
    next();
  });
});
```

### [Egg](https://eggjs.org/)

Egg 函数写法下，可以通过在 `_app.[tj]s` 下添加 egg 的中间件：

```ts
import { hook } from "@modern-js/runtime/server";

export default hook(({ addMiddleware }) => {
  addMiddleware((options) => async (ctx, next) => {
    console.info(`access url: ${ctx.url}`);
    next();
  });
});
```

也可以添加 egg 第三方的中间件，且给第三方中间件注入参数：

```ts
import { hook } from "@modern-js/runtime/server";

export default hook(({ addMiddleware }) => {
  addMiddleware([
    "eggMiddleware", // 此处为包名
    {
      name: "modernjs",
    },
  ]);
});
```

## 框架写法

框架写法是一种使用框架分层结构来扩展 BFF 函数的方式。

和函数写法相比，框架写法虽然能够利用更多框架的结构，在复杂场景下让整个 BFF Server 更加清晰，但也相的更加复杂，需要关心更多框架层面的内容。

:::info 注
多数情况下，函数写法就能覆盖大多数 BFF 函数的定制需求。只有当你的项目服务端逻辑比较复杂，代码需要分层，或者需要使用更多框架的元素时（如 egg 插件），才需要使用框架写法。
:::

框架写法中，所有的 BFF 函数都需要写在 `api/lambda/` 目录下，并且无法使用钩子文件 `_app.[tj]s`。

### Express

Express 的框架写法支持可在 `api/app.[tj]s` 定义 API Server 的启动逻辑，执行应用的初始化工作，添加全局中间件，声明路由，甚至扩展原有框架等。

:::info 注
注意这里是 `app.[tj]s`，而不是函数写法中的钩子文件 `_app.[tj]s`。
:::

BFF 函数定义的路由会在 `app.ts` 文件定义的路由之后注册，所以在这里你也可以拦截 BFF 函数定义的路由，进行预处理或是提前响应。

```ts
import express from "express";

const app = express();

app.put("/user", function (req, res) {
  res.send("Got a PUT request at /user");
});

app.use(async (req, res, next) => {
  console.info(`access url: ${req.url}`);
  next();
});

export default app;
```

### Nest

Nest 虽然有定制的启动器，但本质与 Express、Koa 相同，所以 Modern.js 沿用了 Nest 定制启动器的默认入口：`api/main.ts`。

按照 Nest 官方生成器生成的项目结构，在 Modern.js 中使用 Nest 框架写法时，`api/` 目录结构为：

```markdown
.
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── lambda
│ └── hello.ts
└── main.ts
```

其中 `api/main.ts` 中的内容与 Nest 官方生成器生成模版有所不同，应用工程中支持了两种模式：

不包含内置 Module：

```ts title=api/main.ts
import { defineCustom } from "@modern-js/plugin-nest";
import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { AppModule } from "./app.module";

export default NestFactory.create(AppModule);
```

包含内置 Module：

```ts title=api/main.ts
import { defineCustom } from "@modern-js/plugin-nest";
import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { AppModule } from "./app.module";

export default defineCustom(async (modules) => {
  @Module({
    imports: [AppModule, ...modules],
  })
  class MainModule {}

  return NestFactory.create(MainModule);
});
```

### Koa

Koa 框架写法与 Express 类似，支持在 `app.[tj]s` 定义 API Server 的启动逻辑，执行应用的初始化工作，添加全局中间件，声明路由，扩展原有框架等。

:::info 注
注意这里是 `app.[tj]s`，而不是函数写法中的钩子文件 `_app.[tj]s`。
:::

BFF 函数定义的路由会在 `app.ts` 文件定义的路由之后注册，所以在这里你也可以拦截 BFF 函数定义的路由，进行预处理或是提前响应。

:::caution 注意
在框架写法下，当没有 `app.ts` 的时候，Modern.js 默认会添加 `koa-body`；当有 `app.ts` 时，如果开发者希望使用带有 Body 的 BFF 函数，需要确保 `koa-body` 中间件已经添加。
:::

```ts
import koa from "koa";

const app = new Koa();

app.put("/user", function (req, res) {
  res.send("Got a PUT request at /user");
});

app.use(async (ctx, next) => {
  console.info(`access url: ${ctx.url}`);
  await next();
});

export default app;
```

### Egg

#### 目录结构

Modern.js 在 egg 框架写法中添加的初始样板文件较为简单，但 Modern.js 允许开发者使用 egg 框架约定的几乎所有文件（如中间件，定时器，控制器等）。

```bash title="egg 框架写法的初始结构"
.
├── api/
│   ├── app/
│   │   └── middleware/
│   │       └── trace.ts
│   ├── config/
│   │   └──  config.default.ts
│   └── lambda/
│       └── hello.ts
├── src/
├── modern.config.js
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
```

#### Modern.js 的 一体化 BFF 函数 和 egg 中的 controller 有什么不同？

- `lambda/` 下的 BFF 函数文件拥有定义路由和处理 API 逻辑两种功能，当你写一体化 BFF 函数的时候；就无需再写 controller 和 router。
- `lambda/` 目录通过文件的目录结构定义路由，Egg 通过在 `router.ts` 文件编写代码定义路由。
- `lambda/` 下可以写 BFF 函数，去处理 BFF 的逻辑；Egg 需要定义 class 声明 `controller`，BFF 函数的样板代码更少。
- `lambda/` 下的文件可以使用 Modern.js 提供的 BFF API，如 `useContext`。
- `lambda/` 下的 BFF 函数可以和 `egg` 的 `router`，`controller` 等混合使用，但通常不建议这么做。

#### 调用 service

在 egg 的框架写法下，同 egg 框架的使用方式一致，开发者也可以通过 `ctx` 调用定义的 service。

假设有以下目录结构和文件：

```js {4-5}
.
├── api/
│   ├── app/
│   │   └── service/
│   │       └── user.ts
│   ├── config/
│   │   ├── config.default.ts
│   └── lambda/
│       └── hello.ts
```

```ts title=/app/service/user.ts
import { Service } from "egg";

class UserService extends Service {
  async find(uid) {
    const user = await this.ctx.db.query(
      "select * from user where uid = ?",
      uid
    );
    return user;
  }
}

export default UserService;
```

在 `lambda` 目录下定义的 BFF 函数中，可以使用 `useContext` API 获取 egg 请求上下文

```ts title=/api/lambda/hello.ts
import { useContext } from "@modern-js/runtime/server";

export const get = async () => {
  const ctx = useContext();
  const userId = ctx.params.id;
  const user = await ctx.service.user.find(userId);
  return user;
};
```

#### 自定义启动逻辑

在 egg 的框架写法中，同样支持启动自定义，`api/app[tj]s` 和 `agent.[tj]s` 遵循 egg 的规范。

具体可见[启动自定义](https://eggjs.org/zh-cn/basics/app-start.html)。
