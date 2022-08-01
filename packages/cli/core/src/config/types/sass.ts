import type { LegacyFileOptions } from 'sass';

export interface SassLoaderOptions {
  sassOptions?: LegacyFileOptions<'sync'>;
  sourceMap?: boolean;
  implementation?: string;
  additionalData?: string | ((content: string, filename: string) => string);
}

export type SassConfig =
  | SassLoaderOptions
  | ((
      options: SassLoaderOptions,
      utils: { addExcludes: (excludes: RegExp | RegExp[]) => void },
    ) => SassLoaderOptions | void);

export type SassOption = LegacyFileOptions<'sync'>;
