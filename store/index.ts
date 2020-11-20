import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loading from "./loading";

const store = configureStore({
  reducer: combineReducers({
    loading,
  }),
});

export * from "./loading";
export type RootState = ReturnType<typeof store.getState>;
export default store;
