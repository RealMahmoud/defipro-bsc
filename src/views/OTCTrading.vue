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
      form: {}
    }
  },
  methods: {
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
