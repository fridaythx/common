import { modelActions } from './action';

import { store } from './store';

export default context => {
  const modelAccess = {};

  Object.keys(modelActions).forEach(k => {
    modelAccess[k] = (...params) => {
      const setPayload = {
        ...params,
        onSuccess: context.onSuccess ? context.onSuccess : null,

        onError: context.onError ? context.onError : null
      };

      store.dispatch(modelActions[k](setPayload));
    };
  });

  return modelAccess;
};