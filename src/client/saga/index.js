/* eslint-disable no-param-reassign */
import { takeLatest, all, put } from 'redux-saga/effects';

import { push, replace } from 'connected-react-router';

import { scrollTop } from '../utils';

import * as action from '../action';

function* navTo({ payload: { path, useReplace, option } }) {
  if (useReplace) {
    yield put(replace(path, option));
  } else {
    yield put(push(path, option));
  }

  scrollTop(0);
}

export default function*() {
  yield all([takeLatest(action.NAV_TO, navTo)]);
}
