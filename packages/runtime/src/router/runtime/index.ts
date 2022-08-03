import { routerPlugin } from './plugin';
import type { SingleRouteConfig, HistoryConfig, RouterConfig } from './plugin';

export type { SingleRouteConfig, HistoryConfig, RouterConfig };

export default routerPlugin;

export * from 'react-router-dom';
export * from 'history';
