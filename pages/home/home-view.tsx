import { BarCodeEvent } from "expo-barcode-scanner";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Vibration } from "react-native";
import {
  Button,
  Card,
  DataTable,
  Headline,
  Paragraph,
  Text,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import { Ebay, SORT } from "../../backend";
import { BarcodeScanner } from "../../components";
import { logger } from "../../logging.config";
import { endLoading, startLoading } from "../../store";
import { CategoryFeeSelect, MoneyInput } from "./components";
import { CategoryFee } from "./components/category-fee-select";

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
  ebayCategory?: CategoryFee;
  itemPrice: number;

  ebayData?: {
    itemFound: boolean;
    medianPrice: number;
  };
};

export default function HomeView() {
  const dispatch = useDispatch();

  const [data, setData] = useState<HomeViewState>({
    packaging: 0,
    shipping: 0,
    itemPrice: 0,
  });
  const [scanning, setScanning] = useState(false);

  const merge = (partial: Partial<HomeViewState>) => {
    setData({ ...data, ...partial });
  };

  const handleScan = ({ data }: BarCodeEvent) => {
    Vibration.vibrate();
    setScanning(false);
    dispatch(startLoading());

    Ebay.buy.browse
      .search({
        gtin: data,
        limit: 50,
        sort: SORT.LISTING_DATE,
        filters: [Ebay.buy.filters.BUYING_OPTION.FIXED],
      })
      .then((res) => {
        logger.log("debug", "Home view response");
        logger.log("debug", `Total: ${res.total}`);
        logger.log("debug", `Items in list: ${res.itemSummaries.length}`);
        const found = res.total > 0;
        const ebayData: HomeViewState["ebayData"] = {
          itemFound: found,
          medianPrice:
            (found &&
              findMedian(
                res.itemSummaries.map((x) => parseFloat(x.price?.value ?? "0"))
              )) ||
            0,
        };

        merge({ ebayData });
      })
      .catch((ex) => logger.log("error", ex))
      .finally(() => dispatch(endLoading()));
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
          label="Item price"
          style={styles.row}
          onChange={({ nativeEvent }) =>
            merge({ itemPrice: parseFloat(nativeEvent.text) })
          }
        />
        <CategoryFeeSelect
          label="Ebay category"
          style={styles.row}
          onChange={(ebayFees) => merge({ ebayCategory: ebayFees })}
        />
        {data.ebayData && (
          <Card style={styles.row}>
            {data.ebayData.itemFound ? (
              <Card.Content>
                <DataTable>
                  <DataTable.Row>
                    <DataTable.Cell>Median price</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {data.ebayData.medianPrice}
                    </DataTable.Cell>
                  </DataTable.Row>
                </DataTable>
              </Card.Content>
            ) : (
              <Card.Content>
                <Headline>No items are listed</Headline>
              </Card.Content>
            )}
          </Card>
        )}
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

function findMedian(items: number[]) {
  return items.length % 2 === 1
    ? findMedian_Selector(items, Math.floor(items.length / 2))
    : 0.5 *
        (findMedian_Selector(items, items.length / 2 - 1) +
          findMedian_Selector(items, items.length / 2));
}

function findMedian_Selector(items: number[], lookFor: number): number {
  if (items.length <= 1) return items[0];

  const pivot = items[Math.floor(Math.random() * items.length)];
  const [lesser, pivots, greater] = items.reduce(
    (list, value) => {
      if (value < pivot) list[0].push(value);
      else if (value === pivot) list[1].push(value);
      else list[2].push(value);

      return list;
    },
    [[], [], []] as [number[], number[], number[]]
  );

  if (lookFor < lesser.length) return findMedian_Selector(lesser, lookFor);
  else if (lookFor < lesser.length + pivots.length) return pivots[0];
  else
    return findMedian_Selector(
      greater,
      lookFor - lesser.length - pivots.length
    );
}
