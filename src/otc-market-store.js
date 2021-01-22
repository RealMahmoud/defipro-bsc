import {STORAGE_KEYS} from "@/storage-keys";
import {getFromStorageOrDefault, writeToStorage} from "@/storage";

const otcMarketStore = getFromStorageOrDefault(STORAGE_KEYS.otcMarkets, {markets: []})


function reloadOtcMarketStore() {
    return getFromStorageOrDefault(STORAGE_KEYS.otcMarkets, {markets: []})
}

function registerOtcMarket(store, closeTime) {
    store.markets.push({
        name: name,
        symbol: closeTime,
    })
    writeToStorage(STORAGE_KEYS.otcMarkets, store)
}

function unRegisterOtcMarket(store, name) {
    const arr = []
    store.markets.forEach(market => {
        if(market.name !== name){
            arr.push(market)
        }
    })
    store.markets = arr
    writeToStorage(STORAGE_KEYS.otcMarkets, store)
}

export {
    otcMarketStore,
    registerOtcMarket,
    unRegisterOtcMarket,
    reloadOtcMarketStore
}
