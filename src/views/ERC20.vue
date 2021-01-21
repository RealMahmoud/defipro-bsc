<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
        <div class="col-md-4">
          <base-input label="Symbol" v-model="form.deploy.symbol"></base-input>
        </div>
        <div class="col-md-4">
          <base-input label="Name" v-model="form.deploy.name"></base-input>
        </div>
        <div class="col-md-4">
          <base-input label="Supply" v-model="form.deploy.supply"></base-input>
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
                Tracked ERC-20 Tokens
              </h3>
            </div>
          </div>
          <div class="col text-right">
            <base-button type="primary" size="sm" @click="modals.modalTrackNew = true">Track New Token</base-button>
          </div>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-md-6 mt-2" v-for="token in trackedTokens" :key="token.symbol">
                <stats-card :title="token.symbol"
                            type="gradient-blue"
                            :sub-title="token.name"
                            icon="ni ni-money-coins"
                            class="mb-4 mb-xl-0"
                >
                  <template slot="footer">
                    <span class="text-success mr-2"><i class="fa fa-coins"></i> {{ token.supply }}</span>
                  </template>
                </stats-card>
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
            <small>Register ERC-20 token</small>
          </div>
          <form role="form">
            <base-input alternative
                        class="mb-3"
                        v-model="form.trackNew.address"
                        placeholder="Address"
                        addon-left-icon="ni ni-atom">
            </base-input>
            <div class="col-md-12 mt-2 mb-2" v-if="form.trackNew.name !== null">
              <stats-card :title="form.trackNew.symbol"
                          type="gradient-blue"
                          :sub-title="form.trackNew.name"
                          icon="ni ni-money-coins"
                          class="mb-4 mb-xl-0"
              >
                <template slot="footer">
                  <span class="text-success mr-2"><i class="fa fa-coins"></i> {{ form.trackNew.supply }}</span>
                </template>
              </stats-card>
            </div>
            <div class="text-center mt-2">
              <base-button @click="loadErc20Info" type="info" class="mr-2">Load</base-button>
              <base-button @click="trackNewToken" type="primary">Track</base-button>
            </div>
          </form>
        </template>
      </card>
    </modal>
  </div>
</template>
<script>
import {mapState} from "vuex";
import {registerERC20, reloadStore} from "@/erc20-store";

export default {
  components: {},
  data() {
    return {
      modals: {
        modalTrackNew: false,
      },
      trackedTokens: [],
      form: {
        deploy: {
          name: '',
          symbol: '',
          supply: '',
        },
        trackNew: {
          name: null,
          address: '',
          symbol: '',
          supply: '',
        }
      }
    }
  },
  methods: {
    async trackNewToken() {
      registerERC20(
          this.data.erc20Store,
          this.form.trackNew.symbol,
          this.form.trackNew.name,
          this.form.trackNew.supply,
          this.form.trackNew.address
      )
      this.data.erc20Store = reloadStore()
      this.form.trackNew = {
        name:  null,
        address: '',
        symbol: '',
        supply: '',
      }
      this.modals.modalTrackNew = false
      await this.initData()
    },
    async loadErc20Info(){
      const erc20Instance = this.smartContractManager.getErcInstanceFromAddress(window.ethereum.selectedAddress, this.form.trackNew.address)
      const erc20Info = await this.smartContractManager.getErc20Info(erc20Instance)
      console.log(erc20Info)
      this.form.trackNew = {
        name: erc20Info.name,
        address: this.form.trackNew.address,
        symbol: erc20Info.symbol,
        supply: erc20Info.totalSupply,
      }
    },
    deploy(evt) {
      try {
        evt.preventDefault();
        const symbol = this.form.deploy.symbol
        const name = this.form.deploy.name
        const supply = this.form.deploy.supply
        const erc20Contract = this.data.erc20Contract
        const sender = window.ethereum.selectedAddress
        this.smartContractManager.deployContract(
            erc20Contract.contract, sender, erc20Contract.code,
            [name, symbol, supply],
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
      registerERC20(
          this.data.erc20Store,
          this.form.deploy.symbol,
          this.form.deploy.name,
          this.form.deploy.supply,
          receipt.contractAddress
      )
      await this.initData()
    },
    onDeployed(instance) {
      console.log(instance)

    },
    async initData(){
      this.trackedTokens = []
      for (const token of this.data.erc20Store.erc20TrackedTokens) {
        this.trackedTokens.push(token)
      }
    }
  },
  computed: {
    ...mapState([
      'data',
      'smartContractManager'
    ])
  },
  async mounted() {
   await this.initData()
  }
};
</script>
<style></style>
