import {STORAGE_KEYS} from "@/storage-keys";
import {getFromStorageOrDefault, writeToStorage} from "@/storage";

const erc20Store = getFromStorageOrDefault(STORAGE_KEYS.erc20Instances, new Map)

/**
 *
 * @param store Map
 * @param name string
 * @param address string
 */
function registerERC20(store, name, address) {
    store.set(name, {
        name: name,
        address: address,
    })
    writeToStorage(STORAGE_KEYS.erc20Instances, store)
}

export {
    erc20Store,
    registerERC20
}
