import { retry } from "@thattokengirl-utilities/http";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { addMiddleware } from "./backend";
import { backendLoggerMiddleware } from "./logging.config";
import MainLayoutView from "./pages/+layouts/main-layout-view";
import store from "./store";
import theme from "./theme";

addMiddleware(retry(10), backendLoggerMiddleware);

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <MainLayoutView />
      </PaperProvider>
    </StoreProvider>
  );
}
