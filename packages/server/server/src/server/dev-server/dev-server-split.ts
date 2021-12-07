import { ModernDevServer } from './dev-server';
import { mergeExtension } from '@/utils';
import { ModernRouteInterface } from '@/libs/route';
import { ApiServerMode } from '@/constants';

export class WebModernDevServer extends ModernDevServer {
  protected prepareAPIHandler(
    _m: ApiServerMode,
    _: ReturnType<typeof mergeExtension>,
  ) {
    return null as any;
  }

  protected async prepareWebHandler(
    extension: ReturnType<typeof mergeExtension>,
  ) {
    return super.prepareWebHandler(extension);
  }

  protected filterRoutes(routes: ModernRouteInterface[]) {
    return routes.filter(route => route.entryName);
  }
}

export class APIModernDevServer extends ModernDevServer {
  protected prepareWebHandler(_: ReturnType<typeof mergeExtension>) {
    return null as any;
  }

  protected async prepareAPIHandler(
    mode: ApiServerMode,
    extension: ReturnType<typeof mergeExtension>,
  ) {
    return super.prepareAPIHandler(mode, extension);
  }

  protected filterRoutes(routes: ModernRouteInterface[]) {
    return routes.filter(route => route.isApi);
  }

  protected async preServerInit() {
    // noop
  }
}
