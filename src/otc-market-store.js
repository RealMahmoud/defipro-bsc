import { STORAGE_KEYS } from "@/storage-keys";
import { getFromStorageOrDefault, writeToStorage } from "@/storage";
import { increaseOtcMarketCreatedCount } from "@/analytics-store";

const defaultMarkets = {"markets":[{"name":"BSC OTC Market","closeTime":1644411120000,"address":"0x41f9dCbd03039B3776f6654fB26C92e9CED6dea9"}]}

const otcMarketStore = getFromStorageOrDefault(STORAGE_KEYS.otcMarkets, {
  defaultMarkets,
});

function reloadOtcMarketStore() {
  return getFromStorageOrDefault(STORAGE_KEYS.otcMarkets, defaultMarkets);
}

function registerOtcMarket(store, name, closeTime, address) {
  store.markets.push({
    name: name,
    closeTime: closeTime,
    address: address
  });
  writeToStorage(STORAGE_KEYS.otcMarkets, store);
  increaseOtcMarketCreatedCount();
}

function unRegisterOtcMarket(store, name) {
  const arr = [];
  store.markets.forEach(market => {
    if (market.name !== name) {
      arr.push(market);
    }
  });
  store.markets = arr;
  writeToStorage(STORAGE_KEYS.otcMarkets, store);
}

export {
  otcMarketStore,
  registerOtcMarket,
  unRegisterOtcMarket,
  reloadOtcMarketStore
};
