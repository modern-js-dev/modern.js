import { STATUS } from '../shared';
import { initPlugins } from './initPlugins';
import type { Context, PluginStore, WebpackConfig } from '../types';

async function modifyBuilderConfig(context: Context) {
  context.status = STATUS.BEFORE_MODIFY_BUILDER_CONFIG;
  const [modified] = await context.hooks.modifyBuilderConfigHook.call(
    context.config,
  );
  context.config = modified;
  context.status = STATUS.AFTER_MODIFY_BUILDER_CONFIG;
}

async function modifyWebpackChain(context: Context) {
  context.status = STATUS.BEFORE_MODIFY_WEBPACK_CHAIN;

  const WebpackChain = (await import('@modern-js/utils/webpack-chain')).default;
  const chain = new WebpackChain();
  const [modified] = await context.hooks.modifyWebpackChainHook.call(chain);

  context.status = STATUS.AFTER_MODIFY_WEBPACK_CHAIN;

  return modified;
}

async function modifyWebpackConfig(
  context: Context,
  webpackConfig: WebpackConfig,
) {
  context.status = STATUS.BEFORE_MODIFY_WEBPACK_CONFIG;

  const [modified] = await context.hooks.modifyWebpackConfigHook.call(
    webpackConfig,
  );

  context.status = STATUS.AFTER_MODIFY_WEBPACK_CONFIG;

  return modified;
}

export async function initConfigs({
  context,
  pluginStore,
}: {
  context: Context;
  pluginStore: PluginStore;
}) {
  await initPlugins({
    context,
    pluginStore,
  });

  await modifyBuilderConfig(context);
  const chain = await modifyWebpackChain(context);
  const webpackConfig = await modifyWebpackConfig(context, chain.toConfig());

  return {
    // TODO support SSR config
    webpackConfigs: [webpackConfig],
  };
}
