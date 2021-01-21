<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
        <div class="col-md-4" >
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

    <!--Charts-->
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
    deploy(){
      console.log(this.form)
    }
  },
  computed: {
    ...mapState([
      'erc20Store',
    ])
  },
  mounted() {
    console.log('erc20 store: ', this.erc20Store)
  }
};
</script>
<style></style>
