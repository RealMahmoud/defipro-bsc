<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
        <div class="col-md-6">
          <base-input label="Name" v-model="form.deploy.name"></base-input>
        </div>
        <div class="col-md-6">
          <base-input label="Close Time" v-model="form.deploy.closeTime"></base-input>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <base-button block @click="deploy" type="primary" icon="ni ni-send">Deploy</base-button>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="card shadow">
        <div class="card-header border-0">
          <div class="row align-items-center">
            <div class="col">
              <h3 class="mb-0">
                Tracked OTC Markets
              </h3>
            </div>
          </div>
          <div class="col text-right">
            <base-button type="primary" size="sm" @click="modals.modalTrackNew = true">Track New Token</base-button>
            <base-button type="primary" size="sm">Buy</base-button>
            <base-button type="primary" size="sm">Sell</base-button>
          </div>
        </div>

        <div class="card-body">
        </div>

      </div>
    </div>
    <modal :show.sync="modals.modalTrackNew"
           body-classes="p-0"
           modal-classes="modal-dialog-centered modal-xl">
      <card type="secondary" shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0">
        <template>
          <div class="text-center text-muted mb-4">
            <small>Register OTC Market</small>
          </div>
          <form role="form">
            <base-input alternative
                        class="mb-3"
                        v-model="form.trackNew.name"
                        placeholder="Name"
                        addon-left-icon="ni ni-tag">
            </base-input>
            <base-input alternative
                        class="mb-3"
                        v-model="form.trackNew.closeTime"
                        placeholder="Close time"
                        addon-left-icon="ni ni-tag">
            </base-input>
            <div class="text-center mt-2">
              <base-button @click="trackNewOtc" type="primary">Track</base-button>
            </div>
          </form>
        </template>
      </card>
    </modal>

  </div>
</template>
<script>
import {mapState} from "vuex";
import {registerOtcMarket, reloadOtcMarketStore} from "@/otc-market-store";

export default {
  components: {},
  data() {
    return {
      matchingMarketContract: null,
      matchingMarketArtifacts: null,
      modals: {
        modalTrackNew: false,
      },
      trackedTokens: [],
      trackedMarkets: [],
      form: {
        deploy: {
          name: '',
          closeTime: 0,
        },
        trackNew: {
          name: null,
          closeTime: 0,
        }
      }
    }
  },
  methods: {
    async initData() {
      this.trackedTokens = []
      for (const token of this.data.erc20Store.erc20TrackedTokens) {
        this.trackedTokens.push(token)
      }
      this.trackedMarkets = []
      for (const market of this.data.otcMarketStore.otcMarkets) {
        this.trackedMarkets.push(market)
      }
    },
    async trackNewOtc() {
      registerOtcMarket(
          this.data.otcMarketStore,
          this.form.trackNew.name,
          this.form.trackNew.closeTime,
      )
      this.data.otcMarketStore = reloadOtcMarketStore()
      this.form.trackNew = {
        name: null,
        closeTime: 0,
      }
      this.modals.modalTrackNew = false
      await this.initData()
    },
    deploy(evt) {
      try {
        evt.preventDefault();
        const name = this.form.deploy.name
        const closeTime = this.form.deploy.closeTime
        const sender = window.ethereum.selectedAddress
        this.smartContractManager.deployContract(
            this.matchingMarketContract, sender, this.matchingMarketArtifacts.code,
            [name, closeTime],
            this.deploySendTransactionCallback,
            this.deployReceiptCallback,
            this.onDeployed
        )
      } catch (e) {
        this.$notifyMessage('danger', 'Deployment failed')
        console.error(e)
      }
    },
    deploySendTransactionCallback(err, transactionHash) {
      if (err) {
        console.error(err);
        this.$notifyMessage('danger', 'Deployment failed')
      } else {
        console.log('transaction hash: ', transactionHash);
      }
    },
    async deployReceiptCallback(receipt) {
      console.log('contract deployed at: ', receipt.contractAddress);
      registerOtcMarket(
          this.data.otcMarketStore,
          this.form.deploy.name,
          this.form.deploy.closeTime,
      )
      await this.initData()
    },
    onDeployed(instance) {
      console.log(instance)
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
