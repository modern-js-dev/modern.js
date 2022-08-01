declare module 'less-plugin-npm-import' {
  class NpmImportPlugin {
    install: (less: LessStatic, pluginManager: PluginManager) => void;
    constructor(params: { prefix: string });
  }

  export default NpmImportPlugin;
}
