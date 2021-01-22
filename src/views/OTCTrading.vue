<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">

      <p class="lead">
        On-Chain OTC market for ERC20-compatible tokens
      </p>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="card shadow">
        <div class="card-header border-0">
          <div class="row align-items-center">
            <div class="col">
              <h3 class="mb-0">
                OTC Trading
              </h3>
            </div>
          </div>
          <div class="col text-right">
            <base-button type="primary" size="sm" icon="ni ni-settings"></base-button>
          </div>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-md-2">
                Market
            </div>
            <div class="col-md-8">
              <b-form-select v-model="selectedMarket" :options="trackedMarkets"></b-form-select>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-md-2">
              I want to sell
            </div>
            <div class="col-md-4">
              <base-input v-model="payAmount"></base-input>
            </div>
            <div class="col-md-4">
              <b-form-select v-model="selectedPayToken" :options="trackedTokens"></b-form-select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-2">
              I want to buy
            </div>
            <div class="col-md-4">
              <base-input v-model="buyAmount"></base-input>
            </div>
            <div class="col-md-4">
              <b-form-select v-model="selectedBuyToken" :options="trackedTokens"></b-form-select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-2">
              <base-button block @click="makeOffer" type="primary" icon="ni ni-send">Make Offer</base-button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex";

export default {
  components: {},
  data() {
    return {
      modals: {},
      trackedTokens: [],
      trackedMarkets: [],
      selectedMarket: null,
      selectedPayToken: null,
      payAmount: 0,
      selectedBuyToken: null,
      buyAmount: 0,
      form: {}
    }
  },
  methods: {
    async makeOffer(){
      try{
        console.log('Pay Token: ', this.selectedPayToken)
        console.log('Pay Amount: ', this.payAmount)
        console.log('Buy Token: ', this.selectedBuyToken)
        console.log('Buy Amount: ', this.buyAmount)
      }catch (e) {
        this.$notifyMessage('danger', 'Trade failed')
        console.error(e)
      }
    },
    async initData() {
      this.trackedTokens = []
      for (const token of this.data.erc20Store.erc20TrackedTokens) {
        this.trackedTokens.push({
          name: token.name,
          symbol: token.symbol,
          address: token.address,
          supply: token.supply,
          value: token.address,
          text: token.name,
        })
      }
      this.trackedMarkets = []
      for (const market of this.data.otcMarketStore.markets) {
        this.trackedMarkets.push({
          name: market.name,
          address: market.address,
          closeTime: market.closeTime,
          value: market.address,
          text: market.name,
        })
      }
    },
  },
  computed: {
    ...mapState([
      'data',
      'smartContractManager'
    ])
  },
  async mounted() {
    this.matchingMarketArtifacts = this.smartContractManager.getMatchingMarketArtifacts()
    this.matchingMarketContract = this.smartContractManager.newMatchingMarketContract()
    await this.initData()
  }
};
</script>
<style></style>
