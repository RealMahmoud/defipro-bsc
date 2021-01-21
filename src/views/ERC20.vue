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
           modal-classes="modal-dialog-centered modal-sm">
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
                        v-model="form.trackNew.symbol"
                        placeholder="Symbol"
                        addon-left-icon="ni ni-tag">
            </base-input>
            <base-input alternative
                        class="mb-3"
                        v-model="form.trackNew.name"
                        placeholder="Name"
                        addon-left-icon="ni ni-tag">
            </base-input>
            <base-input alternative
                        class="mb-3"
                        v-model="form.trackNew.address"
                        placeholder="Address"
                        addon-left-icon="ni ni-atom">
            </base-input>
            <base-input alternative
                        class="mb-3"
                        v-model="form.trackNew.supply"
                        placeholder="Supply"
                        addon-left-icon="ni ni-money-coins">
            </base-input>
            <div class="text-center">
              <base-button @click="trackNewToken">Track</base-button>
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
          name: '',
          address: '',
          symbol: '',
          supply: '',
        }
      }
    }
  },
  methods: {
    async trackNewToken() {
      console.log(this.data.erc20Store)
      registerERC20(
          this.data.erc20Store,
          this.form.trackNew.symbol,
          this.form.trackNew.name,
          this.form.trackNew.supply,
          this.form.trackNew.address
      )
      this.data.erc20Store = reloadStore()
      this.form.trackNew = {
        name: '',
        address: '',
        symbol: '',
        supply: '',
      }
      this.modals.modalTrackNew = false
      await this.initData()
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
