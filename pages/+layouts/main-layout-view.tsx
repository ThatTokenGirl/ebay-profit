import Constants from "expo-constants";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import { LoadingIndicator } from "../+components";
import { HomeView } from "../home";

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

export default function MainLayoutView() {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar>
        <Appbar.Content title="Ebay Profit" />
      </Appbar>

      <View style={styles.scrollContainer}>
        <HomeView></HomeView>
      </View>
      <LoadingIndicator />
    </SafeAreaView>
  );
}
