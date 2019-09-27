import { createStore } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/es/storage";

const persistConfig = {
  key: "root",
  storage
};

const createSubstituteReducer = (defaultState, actionCase = "") => (
  state = defaultState,
  action
) => {
  if (action.type === actionCase) {
    return action.payload || state;
  }

  return state;
};

const proxy = (state = "http://work.muxi-tech.xyz", action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const reducer = persistCombineReducers(persistConfig, {
  proxy,
  username: createSubstituteReducer("", "substituteUsername"),
  token: createSubstituteReducer("", "substituteToken"),
  avatar: createSubstituteReducer("", "substituteAvatar"),
  email: createSubstituteReducer("", "substituteEmail"),
  role: createSubstituteReducer(1, "substituteRole"),
  id: createSubstituteReducer(0, "substituteId"),
  loginSuccess: createSubstituteReducer(0, "substituteLoginSuccess"),
  wrongInfo: createSubstituteReducer("", "substituteWrongInfo")
});

const Store = createStore(reducer);
const persistor = persistStore(Store);

export { persistor, Store };
