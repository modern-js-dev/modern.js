export type SprProps = {
  interval: number;
  staleLimit: number | boolean;
  level: number;
  includes: MetaKeyMap | null;
  excludes: MetaKeyMap | null;
  fallback: boolean;
  matches: MetaKeyMatch | null;
};

export type GeneralizedProps = SprProps & {
  [propName: string]: any;
};

export type SprConstructor = {
  config: () => SprProps;
};

export type MetaKeyMap = {
  header?: string[];
  query?: string[];
};

type MatchMap = {
  [propName: string]: {
    [propName: string]: string;
  };
};

export type MetaKeyMatch = {
  header?: MatchMap;
  query?: MatchMap;
};
