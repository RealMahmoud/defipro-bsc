<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <p class="lead text-white">
        Interact with ERC-20 tokens
      </p>
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

export default {
  components: {},
  data() {
    return {
      loading: false,
      erc20TokenAddress: null,
      modals: {

      },
      trackedTokens: [],
      form: {
      },
    }
  },
  methods: {
    async initData() {
      this.trackedTokens = []
      for (const token of this.data.erc20Store.erc20TrackedTokens) {
        this.trackedTokens.push(token)
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
    const addressParam = this.$route.params['address']
    if(addressParam !== null && addressParam !== 'null'){
      this.erc20TokenAddress = addressParam
    }
    console.log(this.erc20TokenAddress)
    await this.initData()
  }
};
</script>
<style></style>
