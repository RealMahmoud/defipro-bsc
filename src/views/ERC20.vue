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

    </div>

  </div>
</template>
<script>
import {mapState} from "vuex";

export default {
  components: {},
  data() {
    return {
      form: {
        deploy: {
          name: '',
          symbol: '',
          supply: '',
        }
      }
    }
  },
  methods: {
    deploy(evt) {
      try {
        evt.preventDefault();
        const symbol = this.form.deploy.symbol
        const name = this.form.deploy.name
        const supply = this.form.deploy.supply
        const erc20Contract = this.$store.state.erc20Contract
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
    deploySendTransactionCallback(err, transactionHash){
      if (err) {
        console.error(err);
        this.$notifyMessage('danger', 'Deployment failed')
      } else {
        console.log('transaction hash: ', transactionHash);
      }
    },
    deployReceiptCallback(receipt){
      console.log('contract deployed at: ', receipt.contractAddress);
    },
    onDeployed(instance){
      console.log(instance)
    }
  },
  computed: {
    ...mapState([
      'erc20Store',
      'smartContractManager'
    ])
  },
  mounted() {
    console.log('erc20 store: ', this.erc20Store)
  }
};
</script>
<style></style>
