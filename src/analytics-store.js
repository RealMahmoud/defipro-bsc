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
        sellAmounts: [],
        buyAmounts: [],
        tradingPairs: {},
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

function pushSellAmount(store = null, amount){
    if(store === null){
        store = reloadAnalyticsStore()
    }
    store.otcTrading.sellAmounts.push(amount)
    writeToStorage(STORAGE_KEYS.analytics, store)
}

function pushBuyAmount(store = null, amount){
    if(store === null){
        store = reloadAnalyticsStore()
    }
    store.otcTrading.buyAmounts.push(amount)
    writeToStorage(STORAGE_KEYS.analytics, store)
}

function incrementTradingPairCount(store = null, tradingPairName){
    if(store === null){
        store = reloadAnalyticsStore()
    }
    // eslint-disable-next-line no-prototype-builtins
    if(!store.otcTrading.tradingPairs.hasOwnProperty(tradingPairName)){
        store.otcTrading.tradingPairs[tradingPairName] = {
            count: 0,
        }
    }else{
        store.otcTrading.tradingPairs[tradingPairName].count  =  store.otcTrading.tradingPairs[tradingPairName].count + 1
    }
    writeToStorage(STORAGE_KEYS.analytics, store)
}

function tradingPairName(buyToken, sellToken){
    return buyToken + '/' + sellToken
}

function topNTradingPairs(store = null, n){
    if(store === null){
        store = reloadAnalyticsStore()
    }
    console.log(n)
    const tradingPairsStore = store.otcTrading.tradingPairs
    const pairs = []
    for (const property in tradingPairsStore) {
        pairs.push({
            name: property,
            value: tradingPairsStore[property].count,
            })
    }
    pairs.sort((a, b) => {
        if(a.value > b.value){
            return -1
        }
        if(a.value < b.value){
            return 1
        }
        return 0
    })
    const topPairs = []
    for (let i = 0; i < pairs.length && i < n; i++) {
        topPairs.push(pairs[i])
    }
    return topPairs
}

export {
    analyticsStore,
    reloadAnalyticsStore,
    increaseOtcMarketCreatedCount,
    increaseERC20CreatedCount,
    increaseOtcTradingOffersMadeSuccess,
    increaseOtcTradingOffersMadeError,
    pushBuyAmount,
    pushSellAmount,
    incrementTradingPairCount,
    tradingPairName,
    topNTradingPairs
}
