import { combineReducers } from "redux";
import appReducer from "./slices/app";
import storage from "redux-persist/lib/storage";

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  // whiteList: [],
  // blackList: []
};

const rootReducer = combineReducers({
  app: appReducer,
});

export { rootPersistConfig, rootReducer };
