export const ZH_LOCALE = {
  command: {
    dev: {
      describe: '本地开发命令',
      config: '制定配置文件路径',
      entry: '按入口编译',
      apiOnly: '仅启动 API 接口服务',
    },
    build: {
      describe: '构建应用命令',
      analyze: '分析构建产物体积，查看各个模块打包后的大小',
    },
    start: { describe: '应用启动命令' },
    deploy: { describe: '部署应用命令' },
    new: {
      describe: 'MWA 项目中中执行生成器',
      debug: '开启 Debug 模式，打印调试日志信息',
      config: '生成器运行默认配置(JSON 字符串)',
      distTag: '生成器使用特殊的 npm Tag 版本',
      registry: '生成器运行过程中定制 npm Registry',
    },
  },
};
