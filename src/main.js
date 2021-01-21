/*!

=========================================================
* Vue Argon Dashboard - v1.1.1
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-argon-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/vue-argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import './plugins/font-awesome'
import Web3 from "web3"
import {erc20Store} from "@/erc20-store";
import SmartContractManager from "@/services/SmartContractManager";
Vue.config.productionTip = false
Vue.use(ArgonDashboard)
Vue.use(Vuex)

// create store
const store = new Vuex.Store({
  state: {
    web3: null,
    settings: {
    },
    data: {
      erc20Contract: initERC20(),
      erc20Store: erc20Store,
    },
    smartContractManager: null,
  },
  mutations: {}
});

initWeb3Environment(store.state)

new Vue({
  router,
  render: h => h(App),
  store,
}).$mount('#app')

function initWeb3Environment(state) {
  console.log('initializing web3 environment')
  const ethEnabled = () => {
    if (window.ethereum) {
      state.web3 = new Web3(window.ethereum)
      state.smartContractManager = new SmartContractManager(state.web3)
      window.ethereum.enable();
      return true;
    }
    return false;
  };
  if (!ethEnabled()) {
    alert("Please install an Ethereum compatible browser or extension like MetaMask to use this dApp!");
  } else {
    console.log('web3 environment successfully loaded');
    loadERCContracts(state);
  }
}

function initERC20() {
  const erc20 = require('../contracts/ERC20');
  return  {
      abi: erc20.abi,
      code: erc20.bytecode,
      contract: null,
  }
}

function loadERCContracts(state) {
  state.data.erc20Contract.contract = new state.web3.eth.Contract(state.data.erc20Contract.abi);
}
