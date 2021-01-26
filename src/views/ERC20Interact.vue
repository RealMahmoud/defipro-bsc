<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <p class="lead text-white">
        Interact with ERC-20 tokens
      </p>
      <div v-if="erc20Token.address !== null">
        <div class="row">
          <div class="col-md-12 mt-2">
            <card class="card-stats" :show-footer-line="true">
              <div class="row">
                <div class="col">
                  <slot>
                    <h5 class="card-title text-uppercase text-muted mb-0">{{ erc20Token.symbol }}</h5>
                    <span class="h2 font-weight-bold mb-0">{{ erc20Token.name }}</span>
                  </slot>
                </div>

                <div class="col-auto">
                  <h5>{{ erc20Token.address }}</h5>
                </div>
                <div class="col-auto">
                  <base-button @click="erc20Token.address = null" type="primary" icon="fa fa-exchange-alt">Change
                  </base-button>
                </div>
              </div>
              <p class="mt-3 mb-0 text-sm">
                <span class="text-success mr-2"><i class="fa fa-coins"></i> {{ selectedTokenSupply }}</span>
              </p>
            </card>
          </div>
        </div>

      </div>
      <div v-else>
        <p class="lead text-white">
          Select ERC20 token from favorites or custom address
        </p>
        <div class="row">
          <div class="col-md-5">
            <b-form-select v-model="tmpSelectedErc20Address" :options="trackedTokens"
                           v-on:change="onERC20AddressSelectChanged"></b-form-select>
          </div>
          <div class="col-md-5">
            <base-input v-model="tmpSelectedErc20Address"></base-input>
          </div>
          <div class="col-md-2">
            <base-button @click="loadERC20FromAddress(tmpSelectedErc20Address)" type="primary" icon="ni ni-send">Load
            </base-button>
          </div>
        </div>

      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <!--div class="card shadow">

        <div class="card-body">
        </div>

      </div-->
    </div>

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
  </div>
</template>
<script>
import {mapState} from "vuex";
import {fromTokens} from "@/services/eth-utils"

export default {
  components: {},
  data() {
    return {
      tmpSelectedErc20Address: null,
      loading: false,
      erc20Token: {
        contract: null,
        address: null,
        symbol: '',
        name: '',
        supply: '0',
      },
      modals: {},
      trackedTokens: [],
      form: {},
    }
  },
  methods: {
    async onERC20AddressSelectChanged(address) {
      await this.loadERC20FromAddress(address)
    },
    async loadERC20FromAddress(address) {
      if (address !== null) {
        console.log(address)
        this.erc20Token.contract = this.smartContractManager.getErcInstanceFromAddress(window.ethereum.selectedAddress, address)
        const erc20Info = await this.smartContractManager.getErc20Info(this.erc20Token.contract)
        console.log(erc20Info)
        this.erc20Token = {
          name: erc20Info.name,
          address: address,
          symbol: erc20Info.symbol,
          supply: erc20Info.totalSupply,
        }
      }
    },
    async initData() {
      if (this.erc20Token.address !== null) {
        await this.loadERC20FromAddress(this.erc20Token.address)
      }
      this.trackedTokens = []
      for (const token of this.data.erc20Store.erc20TrackedTokens) {
        this.trackedTokens.push(
            {
              name: token.name,
              symbol: token.symbol,
              address: token.address,
              supply: token.supply,
              value: token.address,
              text: token.name,
            }
        )
      }
    },
  },
  computed: {
    selectedTokenSupply() {
      return fromTokens(this.erc20Token.supply)
    },
    ...mapState([
      'data',
      'smartContractManager'
    ])
  },
  async mounted() {
    const addressParam = this.$route.params['address']
    if (addressParam !== null && addressParam !== 'null') {
      this.erc20Token.address = addressParam
    }
    await this.initData()
  }
};
</script>
<style></style>
