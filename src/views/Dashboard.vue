<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
          <div class="row">
            <div class="col-xl-3 col-lg-6">
              <stats-card title="OTC Markets created"
                          type="gradient-success"
                          :sub-title="'' + analyticsStore.otcMarkets.createdCount"
                          icon="fa fa-store"
                          class="mb-4 mb-xl-0"
              >
              </stats-card>
            </div>
            <div class="col-xl-3 col-lg-6">
              <stats-card title="ERC20 Tokens created"
                          type="gradient-success"
                          :sub-title="'' + analyticsStore.erc20.createdCount"
                          icon="fa fa-file-code"
                          class="mb-4 mb-xl-0"
              >
              </stats-card>
            </div>
            <div class="col-xl-3 col-lg-6">
              <stats-card title="Trade Offers success"
                          type="gradient-success"
                          :sub-title="'' + analyticsStore.otcTrading.offersMadeSuccess"
                          icon="fa fa-exchange-alt"
                          class="mb-4 mb-xl-0"
              >
              </stats-card>
            </div>
            <div class="col-xl-3 col-lg-6">
              <stats-card title="Trade Offers error"
                          type="gradient-danger"
                          :sub-title="'' + analyticsStore.otcTrading.offersMadeError"
                          icon="fa fa-exchange-alt"
                          class="mb-4 mb-xl-0"
              >
              </stats-card>
            </div>
          </div>
        </base-header>

        <!--Charts-->
        <div class="container-fluid mt--7">

        </div>

    </div>
</template>
<script>
  import {reloadAnalyticsStore} from "@/analytics-store"
  import {mapState} from "vuex";

  export default {
    components: {

    },
    data() {
      return {
        analyticsStore: reloadAnalyticsStore(),
      }
    },
    methods: {

    },
    mounted() {
    },
    computed: {
      ...mapState([
        'data',
        'smartContractManager'
      ])
    },
  };
</script>
<style></style>
