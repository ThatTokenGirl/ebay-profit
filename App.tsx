import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Provider as PaperProvider } from "react-native-paper";
import { HomeView } from "./pages";
import Constants from "expo-constants";
import theme from "./theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },

  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Appbar>
          <Appbar.Content title="Ebay Profit" />
        </Appbar>

        <View style={styles.scrollContainer}>
          <HomeView></HomeView>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}
