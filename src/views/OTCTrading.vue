<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">

      <p class="lead text-white">
        Trade using On-Chain OTC market matching engine
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
              <base-button block @click="increaseMarketAllowance" type="primary">Allow Trade</base-button>
            </div>
            <div class="col-md-2">
              <base-button block @click="prepareMakeOffer" type="primary" icon="ni ni-send">Make Offer</base-button>
            </div>
            <div class="col-md-2">
              <base-button block @click="getOfferCount" type="primary">Trading Pair Info</base-button>
            </div>
          </div>

        </div>

      </div>
    </div>
    <modal :show.sync="modals.makeOffer"
           gradient="warning"
           modal-classes="modal-warning modal-dialog-centered">
      <h6 slot="header" class="modal-title" id="modal-title-notification">Your attention is required</h6>

      <div class="py-3 text-center" v-if="selectedPayToken !== null && selectedBuyToken !== null">
        <i class="ni ni-bell-55 ni-3x"></i>
        <h4 class="heading mt-4">Trading Warning</h4>
        <p class="lead">This action may result in financial loss.</p>
        <p>
          You are about to trade
        </p>
        <p>
          <span class="text-lg font-weight-bold">{{ payAmount }} {{ tokenMap.get(selectedPayToken).symbol }} </span>
        </p>
        <p>
          for
        </p>
        <p>
          <span class="text-lg font-weight-bold">{{ buyAmount }} {{ tokenMap.get(selectedBuyToken).symbol }} </span>
        </p>
      </div>

      <template slot="footer">
        <base-button type="white" @click="makeOffer">I am aware of the risk and I want to proceed.</base-button>
        <base-button type="link"
                     text-color="white"
                     class="ml-auto"
                     @click="cancelMakeOffer">
          Cancel
        </base-button>
      </template>
    </modal>
    <modal :show.sync="loading" gradient="light">
      <template slot="header">
        <h5 class="modal-title">Please wait...</h5>
      </template>
      <div>
        <div class="text-center">
          <FacebookLoader :loading="loading" :color="'#283593'" :size="200"/>
        </div>
      </div>
    </modal>
    <modal :show.sync="modals.modalTradingPairInfo" gradient="info">
      <template slot="header">
        <h5 class="modal-title">OTC Market trading pair information</h5>
      </template>
      <div class="py-3 text-center" v-if="selectedPayToken !== null && selectedBuyToken !== null">
        <i class="ni ni-bell-55 ni-3x"></i>
        <h4 class="heading mt-4">{{ tokenMap.get(selectedBuyToken).symbol }} / {{ tokenMap.get(selectedPayToken).symbol }}</h4>
        <p>
          <span class="text-lg font-weight-bold">{{ currentTradingPairOfferCount }} </span>
        </p>
      </div>
      <template slot="footer">
        <base-button type="link"
                     text-color="white"
                     class="ml-auto"
                     @click="modals.modalTradingPairInfo = false">
          Got it.
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import {mapState} from "vuex";
import {toTokens} from "@/services/eth-utils";
import FacebookLoader from '@bit/joshk.vue-spinners-css.facebook-loader';

export default {
  components: {
    FacebookLoader,
  },
  data() {
    return {
      loading: false,
      modals: {
        makeOffer: false,
        modalTradingPairInfo: false,
      },
      currentTradingPairOfferCount: 0,
      tokenMap: new Map,
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
    async getOfferCount() {
      const matchingMarket = this.smartContractManager.newMatchingMarketContract(this.selectedMarket)
      this.currentTradingPairOfferCount = await matchingMarket.methods
          .getOfferCount(this.selectedPayToken, this.selectedBuyToken)
          .call()
      this.modals.modalTradingPairInfo = true
    },
    cancelMakeOffer() {
      this.modals.makeOffer = false
    },
    prepareMakeOffer() {
      if (this.selectedBuyToken === null || this.selectedPayToken === null ||
          this.selectedBuyToken === this.selectedPayToken) {
        this.$notifyMessage('danger', 'You must select valid trading pair.')
      } else {
        this.modals.makeOffer = true
      }
    },
    async increaseMarketAllowance() {
      this.loading = true
      const sender = window.ethereum.selectedAddress
      const payErc20Token = this.smartContractManager.getErcInstanceFromAddress(sender, this.selectedPayToken)
      payErc20Token.methods.increaseAllowance(
          this.selectedMarket,
          toTokens(this.payAmount),
      ).send({from: sender})
          .on('receipt', this.genericReceiptCallback)
          .on('error', this.genericErrorCallback);
    },
    async makeOffer() {
      try {
        console.log('Pay Token: ', this.selectedPayToken)
        console.log('Pay Amount: ', this.payAmount)
        console.log('Buy Token: ', this.selectedBuyToken)
        console.log('Buy Amount: ', this.buyAmount)
        const matchingMarket = this.smartContractManager.newMatchingMarketContract(this.selectedMarket)
        const sender = window.ethereum.selectedAddress
        matchingMarket.methods.make(
            this.selectedPayToken,
            this.selectedBuyToken,
            toTokens(this.payAmount),
            toTokens(this.buyAmount),
        )
            .send({from: sender})
            .on('receipt', this.makeOfferReceiptCallback)
            .on('error', this.makeOfferErrorCallback);
      } catch (e) {
        this.$notifyMessage('danger', 'Trade failed')
        console.error(e)
      }
      this.modals.makeOffer = false
    },
    makeOfferReceiptCallback(receipt) {
      this.$notifyMessage('success', 'Offer submitted to the matching engine.')
      console.log(receipt)
      this.modals.makeOffer = false
    },
    makeOfferErrorCallback(error) {
      this.$notifyMessage('danger', 'Trade failed')
      console.error(error)
      this.modals.makeOffer = false
    },
    async initData() {
      this.trackedTokens = []
      for (const token of this.data.erc20Store.erc20TrackedTokens) {
        const tokenData = {
          name: token.name,
          symbol: token.symbol,
          address: token.address,
          supply: token.supply,
          value: token.address,
          text: token.name,
        }
        this.tokenMap.set(token.address, tokenData)
        this.trackedTokens.push(tokenData)
        if (this.selectedPayToken === null) {
          this.selectedPayToken = token.address
        }
        if (this.selectedBuyToken === null) {
          this.selectedBuyToken = token.address
        }
      }
      this.trackedMarkets = []
      for (const market of this.data.otcMarketStore.markets) {
        if (this.selectedMarket === null) {
          this.selectedMarket = market.address
        }
        this.trackedMarkets.push({
          name: market.name,
          address: market.address,
          closeTime: market.closeTime,
          value: market.address,
          text: market.name,
        })
      }
    },
    genericReceiptCallback(receipt) {
      this.$notifyMessage('success', 'Transaction executed.')
      console.log(receipt)
      this.loading = false
    },
    genericErrorCallback(error) {
      this.$notifyMessage('danger', 'Trade failed.')
      console.error(error)
      this.loading = false
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
