import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { connect, useStore } from "react-redux";
import { RootState } from "../../store";

type LoadingIndicatorProps = { show: boolean };

const mapState = ({ loading }: RootState) => ({
  show: loading,
});

const connector = connect(mapState);

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,.4)",
  },

  indicator: {
    flex: 1,
  },

  background: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});

const LoadingIndicator = ({ show }: LoadingIndicatorProps) => {
  return (
    <Modal visible={show} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.container}>
        <ActivityIndicator
          style={styles.indicator}
          animating
          size="large"
        ></ActivityIndicator>
      </View>
    </Modal>
  );
};

export default connector(LoadingIndicator);
