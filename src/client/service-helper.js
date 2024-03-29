import { call, put } from 'redux-saga/effects';

import { setLoadingState } from './action';

function* callService(service, args, actionTypes, opts = {}) {
  const { onSuccess = () => {}, onError = () => {}, loadingKey } = opts;

  let resData = null;

  if (loadingKey) {
    yield put(setLoadingState({ loading: true, key: loadingKey }));
  }

  try {
    resData = yield call(service, args);

    yield* onSuccess(resData);

    yield put({
      type: actionTypes.SUCCESS,
      payload: resData
    });
  } catch (e) {
    yield put({
      type: actionTypes.FAILURE,
      payload: { e, res: resData }
    });

    yield* onError(e, resData);
  } finally {
    if (loadingKey) {
      yield put(setLoadingState({ loading: false, key: loadingKey }));
    }
  }
}

export default callService;
