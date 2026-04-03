import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import resumeReducers from "../features/resume/resumeFeatures";
import userReducers from "../features/user/userFeatures";
import driveGenerationReducer from "../features/driveGeneration/driveGenerationFeatures";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["editResume", "editUser"], // driveGeneration intentionally NOT persisted
};

const rootReducer = combineReducers({
  editResume: resumeReducers,
  editUser: userReducers,
  driveGeneration: driveGenerationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const resumeStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(resumeStore);
