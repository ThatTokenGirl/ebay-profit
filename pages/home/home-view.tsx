import { BarCodeEvent } from "expo-barcode-scanner";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Vibration } from "react-native";
import { Button, Card, DataTable, Headline } from "react-native-paper";
import { useDispatch } from "react-redux";
import { Ebay, SORT } from "../../backend";
import { BarcodeScanner, Select, Option } from "../../components";
import { logger } from "../../logging.config";
import { endLoading, startLoading } from "../../store";
import { MoneyInput } from "./components";
import categories, { EbayCategory } from "../../assets/categories";
import { determineFee } from "../../assets/fees";

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
  itemPrice: number;
  selectedCategories: EbayCategory[];
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
    selectedCategories: [],
  });
  const [scanning, setScanning] = useState(false);

  const merge = (partial: Partial<HomeViewState>) => {
    setData({ ...data, ...partial });
  };

  const categoryDisplay = (e: EbayCategory) =>
    `${e.name}${!!e.children ? " >" : ""}`;

  const selectCategory = (e: EbayCategory, index: number) => {
    const selectedCategories = data.selectedCategories.filter(
      (_, i) => i < index
    );
    selectedCategories.push(e);
    merge({ selectedCategories });
  };

  const ebayFeePercent = useMemo(() => {
    const categories = data.selectedCategories.map((x) => x.name);
    const sellingPrice = data.ebayData?.medianPrice ?? 0;

    return determineFee({ sellingPrice }, categories);
  }, [data.selectedCategories, data.ebayData]);

  const ebayFee = useMemo(() => {
    return (ebayFeePercent * (data.ebayData?.medianPrice ?? 0)) / 100;
  }, [ebayFeePercent, data.ebayData]);

  const paypalFee = useMemo(() => {
    return (data.ebayData?.medianPrice ?? 0) * 0.029 + 0.3;
  }, [data.ebayData]);

  const potentialProfit = useMemo(() => {
    return (
      (data.ebayData?.medianPrice ?? 0) -
      data.itemPrice -
      data.packaging -
      data.shipping -
      ebayFee -
      paypalFee
    );
  }, [ebayFee, data, data.ebayData]);

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
      .catch((ex) => {
        logger.log("error", ex);
        alert("Ebay search failed, please try again");
      })
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
          label="Item cost"
          style={styles.row}
          onChange={({ nativeEvent }) =>
            merge({ itemPrice: parseFloat(nativeEvent.text) })
          }
        />

        <Select
          label="Ebay category"
          mode="outlined"
          display={categoryDisplay}
          onSelect={(e) => selectCategory(e, 0)}
          style={styles.row}
        >
          {categories.map((c) => (
            <Option key={c.id} value={c} />
          ))}
        </Select>

        {data.selectedCategories
          .filter((c) => !!c.children)
          .map((c, index) => (
            <Select
              key={c.id}
              mode="outlined"
              label={categoryDisplay(c)}
              display={categoryDisplay}
              onSelect={(e) => selectCategory(e, index + 1)}
              style={styles.row}
            >
              {c.children!.map((c) => (
                <Option key={c.id} value={c} />
              ))}
            </Select>
          ))}

        {data.ebayData && (
          <Card style={styles.row}>
            {data.ebayData.itemFound ? (
              <Card.Content>
                <DataTable>
                  <DataTable.Row>
                    <DataTable.Cell>Median price</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {displayPrice(data.ebayData.medianPrice)}
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>Package cost</DataTable.Cell>
                    <DataTable.Cell numeric>
                      -{displayPrice(data.packaging)}
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>Shipping cost</DataTable.Cell>
                    <DataTable.Cell numeric>
                      -{displayPrice(data.shipping)}
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>Item cost</DataTable.Cell>
                    <DataTable.Cell numeric>
                      -{displayPrice(data.itemPrice)}
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>
                      Ebay Fee ({ebayFeePercent}%)
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      -{displayPrice(ebayFee)}
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>Paypal Fee</DataTable.Cell>
                    <DataTable.Cell numeric>
                      -{displayPrice(paypalFee)}
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>Potential Profit</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {displayPrice(potentialProfit)}
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

function displayPrice(value: number) {
  return `$${value.toFixed(2)}`;
}
