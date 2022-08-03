import { GeneralizedProps, MetaKeyMap, MetaKeyMatch } from './type';

const REQUEST_META = ['header', 'query'];

export const getInnermostProperty = function getInnermostProperty(
  propsList: GeneralizedProps[],
  propName: string,
) {
  for (let i = propsList.length - 1; i >= 0; i--) {
    const props = propsList[i];

    if (props.hasOwnProperty(propName)) {
      return props[propName];
    }
  }

  return null;
};

export const getOutermostProperty = function getOutermostProperty(
  propsList: GeneralizedProps[],
  propName: string,
) {
  for (const props of propsList) {
    if (props.hasOwnProperty(propName)) {
      return props[propName];
    }
  }

  return null;
};

export const aggKeysFromPropsList = function aggKeysFromPropsList(
  propsList: GeneralizedProps[],
  propName: string,
) {
  const initResult: MetaKeyMap = REQUEST_META.reduce(
    (result: MetaKeyMap, next: string) => {
      const key = next as keyof MetaKeyMap;
      result[key] = [];
      return result;
    },
    {},
  );

  const res = propsList
    .filter(props => usefulObject(props[propName]))
    .reduce((result: any, next: GeneralizedProps) => {
      REQUEST_META.forEach(key => {
        const prop = next[propName];
        if (prop?.hasOwnProperty(key) && usefulArray(prop[key])) {
          result[key] = unique(result[key].concat(prop[key]));
        }
      });
      return result;
    }, initResult);

  return REQUEST_META.reduce((result: MetaKeyMap, next: string) => {
    const key = next as keyof MetaKeyMap;
    if (result[key] && result[key]?.length === 0) {
      delete result[key];
    }
    return result;
  }, res);
};

export const aggMatchesFromPropsList = function aggMatchesFromPropsList(
  propsList: GeneralizedProps[],
  propName: string,
) {
  const initResult: MetaKeyMatch = REQUEST_META.reduce(
    (result: MetaKeyMatch, next: string) => {
      const key = next as keyof MetaKeyMap;
      result[key] = {};
      return result;
    },
    {},
  );
  const res = propsList
    .filter(props => usefulObject(props[propName]))
    .reduce((result: any, next: GeneralizedProps) => {
      REQUEST_META.forEach(key => {
        const prop = next[propName];
        // 这边目前是浅拷贝，越后渲染优先级越高
        if (prop?.hasOwnProperty(key) && usefulObject(prop[key])) {
          result[key] = Object.assign(result[key], prop[key]);
        }
      });
      return result;
    }, initResult);

  return REQUEST_META.reduce((result: MetaKeyMatch, next: string) => {
    const key = next as keyof MetaKeyMatch;
    if (result[key] && Object.keys(result[key]!).length === 0) {
      delete result[key];
    }
    return result;
  }, res);
};

function unique(arr: any[]) {
  return Array.from(new Set(arr));
}

function usefulObject(target: any) {
  if (!exist(target)) {
    return false;
  }
  return target.constructor === Object && Object.keys(target).length > 0;
}

function usefulArray(target: any) {
  if (!exist(target)) {
    return false;
  }
  return Array.isArray(target) && target.length > 0;
}

export function exist(target: any) {
  return target != null;
}
