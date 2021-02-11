import { STORAGE_KEYS } from "@/storage-keys";
import { getFromStorageOrDefault, writeToStorage } from "@/storage";
import { increaseERC20CreatedCount } from "@/analytics-store";

const defaultErc20Tokens = {"erc20TrackedTokens":[{"name":"Fake PancakeSwap","symbol":"FAKE CAKE","address":"0x27D90300ABABaD8ffe349e2b8669Fcd662880787","supply":"10000000"},{"name":"Fake BakeryToken","symbol":"FAKE BAKE","address":"0x0271940724589D7d0858E4f866D5542390cE95A2","supply":"10000000"},{"name":"Fake Binance USD","symbol":"FAKE BUSD","address":"0x79fEE5009A12fca5dD11e3d0f4D21ff9eddFdA9D","supply":"10000000"},{"name":"Fake BNB","symbol":"FAKE BNB","address":"0xc43434565BB22C8e2A6a45d9B86dE0757A8b65aF","supply":"10000000"}]}

const erc20Store = getFromStorageOrDefault(STORAGE_KEYS.erc20Instances, defaultErc20Tokens);

function reloadStore() {
  return getFromStorageOrDefault(STORAGE_KEYS.erc20Instances, defaultErc20Tokens);
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
    supply: supply
  });
  writeToStorage(STORAGE_KEYS.erc20Instances, store);
  increaseERC20CreatedCount();
}

function unRegisterERC20(store, symbol) {
  const arr = [];
  store.erc20TrackedTokens.forEach(token => {
    if (token.symbol !== symbol) {
      arr.push(token);
    }
  });
  store.erc20TrackedTokens = arr;
  writeToStorage(STORAGE_KEYS.erc20Instances, store);
}

export { erc20Store, registerERC20, unRegisterERC20, reloadStore };
