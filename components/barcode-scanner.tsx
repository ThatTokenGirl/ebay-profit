import React from "react";
import {
  BarCodeScannedCallback,
  BarCodeScanner,
  BarCodeScanner as NativeBarcodeScanner,
} from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { StyleSheet } from "react-native";

type BarcodeScannerProps = {
  onScanned?: BarCodeScannedCallback;
};

export default function BarcodeScanner({ onScanned }: BarcodeScannerProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === "granted");
    };

    requestPermission();
  }, []);

  return hasCameraPermission === null ? (
    <Text>Requesting camera permission</Text>
  ) : hasCameraPermission === false ? (
    <Text>Camera permission denied</Text>
  ) : (
    <NativeBarcodeScanner
      style={StyleSheet.absoluteFillObject}
      onBarCodeScanned={onScanned ?? (() => {})}
    ></NativeBarcodeScanner>
  );
}
