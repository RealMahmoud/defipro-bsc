import {STORAGE_KEYS} from "@/storage-keys";
import {getFromStorageOrDefault, writeToStorage} from "@/storage";

const erc20Store = getFromStorageOrDefault(STORAGE_KEYS.erc20Instances, {erc20TrackedTokens: []})


function reloadStore() {
    return getFromStorageOrDefault(STORAGE_KEYS.erc20Instances, {erc20TrackedTokens: []})
}

/**
 *
 * @param store Map
 * @param name string
 * @param address string
 */
function registerERC20(store, symbol, name, supply, address) {
    store.erc20TrackedTokens.push({
        name: name,
        symbol: symbol,
        address: address,
        supply: supply,
    })
    writeToStorage(STORAGE_KEYS.erc20Instances, store)
}

export {
    erc20Store,
    registerERC20,
    reloadStore
}
