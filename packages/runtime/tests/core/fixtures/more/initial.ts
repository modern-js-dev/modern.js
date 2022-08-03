import { initialRuntime } from '../../../utils';

const plugins = [] as any[];

export const { render, wrap } = initialRuntime(plugins);
