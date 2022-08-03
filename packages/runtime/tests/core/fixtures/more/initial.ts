import { initialRuntime } from '../../..';

const plugins = [] as any[];

export const { render, wrap } = initialRuntime(plugins);
