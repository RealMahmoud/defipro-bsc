import {STORAGE_KEYS} from "@/storage-keys";
import {getFromStorageOrDefault, writeToStorage} from "@/storage";

const defaultAnalytics = {
    otcMarkets: {
        createdCount: 0,
    },
    erc20: {
        createdCount: 0,
    },
    otcTrading: {
        offersMadeSuccess: 0,
        offersMadeError: 0,
    }
}
const analyticsStore = getFromStorageOrDefault(STORAGE_KEYS.analytics, defaultAnalytics)


function reloadAnalyticsStore() {
    return getFromStorageOrDefault(STORAGE_KEYS.analytics, defaultAnalytics)
}

function increaseOtcMarketCreatedCount(store = null) {
    if(store === null){
        store = reloadAnalyticsStore()
    }
    store.otcMarkets.createdCount = store.otcMarkets.createdCount + 1
    writeToStorage(STORAGE_KEYS.analytics, store)
}

function increaseERC20CreatedCount(store = null) {
    if(store === null){
        store = reloadAnalyticsStore()
    }
    store.erc20.createdCount = store.erc20.createdCount + 1
    writeToStorage(STORAGE_KEYS.analytics, store)
}

function increaseOtcTradingOffersMadeSuccess(store = null) {
    if(store === null){
        store = reloadAnalyticsStore()
    }
    store.otcTrading.offersMadeSuccess = store.otcTrading.offersMadeSuccess + 1
    writeToStorage(STORAGE_KEYS.analytics, store)
}

function increaseOtcTradingOffersMadeError(store = null) {
    if(store === null){
        store = reloadAnalyticsStore()
    }
    store.otcTrading.offersMadeError = store.otcTrading.offersMadeError + 1
    writeToStorage(STORAGE_KEYS.analytics, store)
}

export {
    analyticsStore,
    reloadAnalyticsStore,
    increaseOtcMarketCreatedCount,
    increaseERC20CreatedCount,
    increaseOtcTradingOffersMadeSuccess,
    increaseOtcTradingOffersMadeError
}
