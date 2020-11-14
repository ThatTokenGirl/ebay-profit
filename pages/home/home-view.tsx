import { BarCodeEvent } from "expo-barcode-scanner";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Vibration, View } from "react-native";
import { Button } from "react-native-paper";
import { BarcodeScanner } from "../../components";
import { MoneyInput } from "./components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
});

type HomeViewState = {
  packaging: number;
  shipping: number;
  ebayFees: number;
  itemPrice: number;
};

export default function HomeView() {
  const [data, setData] = useState<HomeViewState>({
    packaging: 0,
    shipping: 0,
    ebayFees: 0,
    itemPrice: 0,
  });
  const [scanning, setScanning] = useState(false);

  const merge = (partial: Partial<HomeViewState>) => {
    setData({ ...data, ...partial });
  };

  const handleScan = ({ data }: BarCodeEvent) => {
    Vibration.vibrate();
    setScanning(false);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <MoneyInput
          label="Package cost"
          style={styles.row}
          onChange={({ nativeEvent }) =>
            merge({ packaging: parseFloat(nativeEvent.text) })
          }
        />
        <MoneyInput
          label="Shipping cost"
          style={styles.row}
          onChange={({ nativeEvent }) =>
            merge({ shipping: parseFloat(nativeEvent.text) })
          }
        />
        <MoneyInput
          label="Ebay fees"
          style={styles.row}
          onChange={({ nativeEvent }) =>
            merge({ ebayFees: parseFloat(nativeEvent.text) })
          }
        />
        <MoneyInput
          label="Item price"
          style={styles.row}
          onChange={({ nativeEvent }) =>
            merge({ itemPrice: parseFloat(nativeEvent.text) })
          }
        />
        {!scanning && (
          <Button
            style={styles.row}
            mode="contained"
            onPress={() => setScanning(true)}
          >
            Scan item
          </Button>
        )}
      </ScrollView>
      {scanning && <BarcodeScanner onScanned={handleScan} />}
    </>
  );
}
