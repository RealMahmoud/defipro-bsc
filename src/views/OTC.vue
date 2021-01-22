<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
        <div class="col-md-12">
          <base-input label="Name" v-model="form.deploy.name"></base-input>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <datetime format="YYYY-MM-DD H:i:s" v-model="form.deploy.closeTime"></datetime>
          <!--base-input label="Close Time" v-model="form.deploy.closeTime"></base-input-->
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 mt-4">
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
            <base-button type="primary" size="sm" @click="modals.modalTrackNew = true">Track New OTC</base-button>
            <base-button type="primary" size="sm">Buy</base-button>
            <base-button type="primary" size="sm">Sell</base-button>
          </div>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-md-6 mt-2" v-for="market in trackedMarkets" :key="market.name">
              <card class="card-stats" :show-footer-line="true">
                <div class="row">
                  <div class="col">
                    <slot>
                      <h5 class="card-title text-uppercase text-muted mb-0">{{ market.name }}</h5>
                      <span class="h2 font-weight-bold mb-0">{{ market.address }}</span>
                    </slot>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape">
                      <a @click="prepareUnRegister(market)"><span class="text-danger mr-2"><i
                          class="fa fa-trash"></i> </span></a>
                    </div>
                  </div>
                </div>
                <p class="mt-3 mb-0 text-sm">
                  <span class="text-warning mr-2"><i class="fa fa-calendar-alt"></i> </span>{{ timestampToDate(market.closeTime) }}
                </p>
              </card>
            </div>
          </div>

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
            <base-input alternative
                        class="mb-3"
                        v-model="form.trackNew.address"
                        placeholder="Address"
                        addon-left-icon="ni ni-tag">
            </base-input>
            <div class="text-center mt-2">
              <base-button @click="trackNewOtc" type="primary">Track</base-button>
            </div>
          </form>
        </template>
      </card>
    </modal>
    <modal :show.sync="modals.modalUnRegister"
           gradient="warning"
           modal-classes="modal-warning modal-dialog-centered">
      <h6 slot="header" class="modal-title" id="modal-title-notification">Your attention is required</h6>

      <div class="py-3 text-center">
        <i class="ni ni-bell-55 ni-3x"></i>
        <h4 class="heading mt-4">Information</h4>
        <p>This action will not affect the OTC Market contract. It will only remove it form your personal list of tracked markets.</p>
      </div>

      <template slot="footer">
        <base-button type="white" @click="confirmUnRegister">Ok, remove it</base-button>
        <base-button type="link"
                     text-color="white"
                     class="ml-auto"
                     @click="cancelUnRegister">
          Cancel
        </base-button>
      </template>
    </modal>

  </div>
</template>
<script>
import {mapState} from "vuex";
import {registerOtcMarket, reloadOtcMarketStore, unRegisterOtcMarket} from "@/otc-market-store";
import datetime from 'vuejs-datetimepicker';
import moment from "moment";

export default {
  components: {
    datetime,
  },
  data() {
    return {
      matchingMarketContract: null,
      matchingMarketArtifacts: null,
      modals: {
        modalTrackNew: false,
        modalUnRegister: false,
      },
      trackedTokens: [],
      trackedMarkets: [],
      marketToUnRegister: null,
      form: {
        deploy: {
          name: '',
          closeTime: moment().format('YYYY-MM-DD HH:m:s'),
        },
        trackNew: {
          name: null,
          closeTime: 0,
          address: '',
        }
      }
    }
  },
  methods: {
    timestampToDate(t){
      const dateTime = new Date(t)
      return dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString()
    },
    async initData() {
      this.trackedTokens = []
      for (const token of this.data.erc20Store.erc20TrackedTokens) {
        this.trackedTokens.push(token)
      }
      this.trackedMarkets = []
      for (const market of this.data.otcMarketStore.markets) {
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
        const closeTimeTimeStamp = moment(closeTime, 'YYYY-MM-DD HH:m:s').toDate().getTime()
        this.smartContractManager.deployContract(
            this.matchingMarketContract, sender, this.matchingMarketArtifacts.bytecode,
            [name, closeTimeTimeStamp],
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
      const closeTimeTimeStamp = moment(this.form.deploy.closeTime, 'YYYY-MM-DD HH:m:s').toDate().getTime()
      registerOtcMarket(
          this.data.otcMarketStore,
          this.form.deploy.name,
          closeTimeTimeStamp,
          receipt.contractAddress,
      )
      await this.initData()
    },
    onDeployed(instance) {
      console.log(instance)
    },
    async prepareUnRegister(market) {
      this.marketToUnRegister = market
      this.modals.modalUnRegister = true
    },
    async confirmUnRegister() {
      if (this.marketToUnRegister !== null) {
        await this.unTrackMarket(this.marketToUnRegister)
        this.marketToUnRegister = null
        this.modals.modalUnRegister = false
      }
    },
    async cancelUnRegister() {
      this.marketToUnRegister = null
      this.modals.modalUnRegister = false
    },
    async unTrackMarket(market) {
      unRegisterOtcMarket(
          this.data.otcMarketStore,
          market.name,
      )
      await this.initData()
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
