<template>
  <div>
    <base-header-custom-color custom="#ECB52E" class="pb-6 pb-8 pt-5 pt-md-8">
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
    </base-header-custom-color>

    <!--Charts-->
    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-8 mb-5 mb-xl-0">
          <card type="default" header-classes="bg-transparent">
            <div slot="header" class="row align-items-center">
              <div class="col">
                <h6 class="text-light text-uppercase ls-1 mb-1">Trading Overview</h6>
                <h5 class="h3 text-white mb-0">Buy/Sell values</h5>
              </div>
            </div>
            <line-chart
                :height="350"
                ref="bigChart"
                :chart-data="buyAmountChart.chartData"
                :extra-options="buyAmountChart.extraOptions"
            >
            </line-chart>

          </card>
        </div>
        <div class="col-xl-4">
          <card header-classes="bg-transparent">
            <div slot="header" class="row align-items-center">
              <div class="col">
                <h6 class="text-uppercase text-muted ls-1 mb-1">Trading trends</h6>
                <h5 class="h3 mb-0">TOP PAIRS</h5>
              </div>
            </div>

            <bar-chart
                :height="350"
                ref="barChart"
                :chart-data="topTradingPairChart.chartData"
            >
            </bar-chart>
          </card>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import {reloadAnalyticsStore, topNTradingPairs} from "@/analytics-store"
import {mapState} from "vuex";
import LineChart from '@/components/Charts/LineChart';
import BarChart from '@/components/Charts/BarChart';

import * as chartConfigs from "@/components/Charts/config";
import BaseHeaderCustomColor from "@/components/BaseHeaderCustomColor";


export default {
  components: {
    BaseHeaderCustomColor,
    LineChart,
    BarChart,
  },
  data() {
    return {
      analyticsStore: reloadAnalyticsStore(),
      topPairs: null,
      buyAmountChart: {
        chartData: {
          datasets: [],
          labels: [],
        },
        extraOptions: chartConfigs.buyAmountChartOptions,
      },
      topTradingPairChart: {
        chartData: {
          labels: [],
          datasets: []
        }
      }
    }
  },
  methods: {
    initBuyAmountChart() {
      const labels = []
      // eslint-disable-next-line no-unused-vars
      this.analyticsStore.otcTrading.buyAmounts.forEach(t => {
        labels.push('')
      })
      const chartData = {
        datasets: [
          {
            label: 'Buy',
            data: this.analyticsStore.otcTrading.buyAmounts,
            borderColor: '#2e7d32',
          },
          {
            label: 'Sell',
            data: this.analyticsStore.otcTrading.sellAmounts,
            borderColor: '#ff6f00',
          },
        ],
        labels: labels,
      };
      this.buyAmountChart.chartData = chartData
    },
    initTopTradingPairsChart(){
      const labels = []
      const values = []
      // eslint-disable-next-line no-unused-vars
      this.topPairs.forEach(t => {
        labels.push(t.name)
        values.push(t.value)
      })

      const chartData = {
        datasets: [
          {
            label: 'Trades',
            data: values,
            backgroundColor: '#0d47a1',
          },
        ],
        labels: labels,
      };
      this.topTradingPairChart.chartData = chartData
    }
  },
  mounted() {
    this.initBuyAmountChart()
    this.topPairs = topNTradingPairs(null, 5)
    this.initTopTradingPairsChart()
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
