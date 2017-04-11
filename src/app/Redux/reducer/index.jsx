import * as Actions from '../actions/index'

const defaultlState = { data: {}, isFetching: false };
const defaultAppState = {
  isSynchronizing: false
};


export const fetchData = (state = defaultlState, action = {}) => {
  switch (action.type) {
    case Actions.REQUEST_POSTS:
      state = Object.assign({}, state, { isFetching: true });
      return state;
    case Actions.RECEIVE_POSTS:
      return { 'data': action.json, 'isFetching': false };
    default:
      return state
  }
}

export const user = (state = defaultlState, action) => {
  var newstate = Object.assign({}, state);
  switch (action.type) {
    case Actions.LOGIN:
      state = Object.assign({}, state, { isFetching: true });
      return state;
    case Actions.LOGGEDIN:
      return { 'data': action.json, 'isFetching': false };
    default:
      return state
  }
}

export const progress = (state = { isSpinner: false }, action) => {
  switch (action.type) {
    case Actions.UPDATE_PROGRESS:
      state = Object.assign({}, state, { isProgressSpinner: false }, action.data);
      return state;
    case Actions.SHOW_PROGRESS:
      state = Object.assign({}, state, { isSpinner: true });
      return state;
    case Actions.HIDE_PROGRESS:
      state = Object.assign({}, state, { isSpinner: false });
      return state;
    default:
      return state;
  }

}

export const appStatus = (state = defaultAppState, action) => {
  switch (action.type) {
    case Actions.UPDATE_APP_STATUS:
      state = Object.assign({}, state, action.data);
      return state
    default:
      return state;
  }
}

export const appConfiguration = (state = [], action) => {
  switch (action.type) {
    case Actions.SET_CONFIG:
      state = Object.assign({}, state, action.data);
      return state
    default:
      return state;
  }
}