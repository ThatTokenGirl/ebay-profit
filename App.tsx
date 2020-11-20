import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { addMiddleware, loggingMiddleware, setConfig } from "./backend";
import { backendLogger } from "./logging.config";
import MainLayoutView from "./pages/+layouts/main-layout-view";
import store from "./store";
import theme from "./theme";

setConfig({
  logger: backendLogger,
});

addMiddleware(loggingMiddleware);

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <MainLayoutView />
      </PaperProvider>
    </StoreProvider>
  );
}
