<template>
  <div>
    <base-header-custom-color custom="#ECB52E" class="pb-6 pb-8 pt-5 pt-md-8">
      <p class="lead text-white">
        Deploy and manage ERC-20 tokens
      </p>
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
          <base-button block @click="deploy" type="primary" icon="ni ni-send"
            >Deploy</base-button
          >
        </div>
      </div>
    </base-header-custom-color>

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
            <base-button
              type="primary"
              size="sm"
              @click="modals.modalTrackNew = true"
              >Track New Token</base-button
            >
          </div>
        </div>

        <div class="card-body">
          <div class="row">
            <div
              class="col-md-6 mt-2"
              v-for="token in trackedTokens"
              :key="token.symbol"
            >
              <card class="card-stats" :show-footer-line="true">
                <div class="row">
                  <div class="col">
                    <slot>
                      <h5 class="card-title text-uppercase text-muted mb-0">
                        {{ token.symbol }}
                      </h5>
                      <span class="h2 font-weight-bold mb-0">{{
                        token.name
                      }}</span>
                    </slot>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape">
                      <a @click="prepareUnRegister(token)"
                        ><span class="text-danger mr-2"
                          ><i class="fa fa-trash"></i> </span
                      ></a>
                    </div>
                    <div class="icon icon-shape">
                      <a @click="interact(token)"
                        ><span class="text-success mr-2"
                          ><i class="fa fa-sign-in-alt"></i> </span
                      ></a>
                    </div>
                  </div>
                </div>

                <p class="mt-3 mb-0 text-sm">
                  <span class="text-success mr-2"
                    ><i class="fa fa-coins"></i> {{ token.supply }}</span
                  >
                </p>
              </card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modals.modalTrackNew"
      body-classes="p-0"
      modal-classes="modal-dialog-centered modal-xl"
    >
      <card
        type="secondary"
        shadow
        header-classes="bg-white pb-5"
        body-classes="px-lg-5 py-lg-5"
        class="border-0"
      >
        <template>
          <div class="text-center text-muted mb-4">
            <small>Register ERC-20 token</small>
          </div>
          <form role="form">
            <base-input
              alternative
              class="mb-3"
              v-model="form.trackNew.address"
              placeholder="Address"
              addon-left-icon="ni ni-atom"
            >
            </base-input>
            <div class="col-md-12 mt-2 mb-2" v-if="form.trackNew.name !== null">
              <stats-card
                :title="form.trackNew.symbol"
                type="gradient-blue"
                :sub-title="form.trackNew.name"
                icon="ni ni-money-coins"
                class="mb-4 mb-xl-0"
              >
                <template slot="footer">
                  <span class="text-success mr-2"
                    ><i class="fa fa-coins"></i>
                    {{ form.trackNew.supply }}</span
                  >
                </template>
              </stats-card>
            </div>
            <div class="text-center mt-2">
              <base-button @click="loadErc20Info" type="info" class="mr-2"
                >Load</base-button
              >
              <base-button @click="trackNewToken" type="primary"
                >Track</base-button
              >
            </div>
          </form>
        </template>
      </card>
    </modal>

    <modal
      :show.sync="modals.modalUnRegister"
      gradient="warning"
      modal-classes="modal-warning modal-dialog-centered"
    >
      <h6 slot="header" class="modal-title" id="modal-title-notification">
        Your attention is required
      </h6>

      <div class="py-3 text-center">
        <i class="ni ni-bell-55 ni-3x"></i>
        <h4 class="heading mt-4">Information</h4>
        <p>
          This action will not affect the ERC-20 contract. It will only remove
          it form your personal list of tracked tokens.
        </p>
      </div>

      <template slot="footer">
        <base-button type="white" @click="confirmUnRegister"
          >Ok, remove it</base-button
        >
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="cancelUnRegister"
        >
          Cancel
        </base-button>
      </template>
    </modal>
    <modal :show.sync="loading" gradient="light">
      <template slot="header">
        <h5 class="modal-title">Please wait...</h5>
      </template>
      <div>
        <div class="text-center">
          <FacebookLoader :loading="loading" :color="'#283593'" :size="200" />
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { registerERC20, reloadStore, unRegisterERC20 } from "@/erc20-store";
import { toTokens } from "@/services/eth-utils";
import BaseHeaderCustomColor from "@/components/BaseHeaderCustomColor";

export default {
  components: {
    BaseHeaderCustomColor
  },
  data() {
    return {
      loading: false,
      modals: {
        modalTrackNew: false,
        modalUnRegister: false
      },
      trackedTokens: [],
      form: {
        deploy: {
          name: "",
          symbol: "",
          supply: 0
        },
        trackNew: {
          name: null,
          address: "",
          symbol: "",
          supply: 0
        }
      },
      tokenToUnRegister: null
    };
  },
  methods: {
    interact(token) {
      this.$router.push({
        name: "erc20-interact",
        params: { address: token.address }
      });
    },
    async trackNewToken() {
      registerERC20(
        this.data.erc20Store,
        this.form.trackNew.symbol,
        this.form.trackNew.name,
        this.form.trackNew.supply,
        this.form.trackNew.address
      );
      this.data.erc20Store = reloadStore();
      this.form.trackNew = {
        name: null,
        address: "",
        symbol: "",
        supply: 0
      };
      this.modals.modalTrackNew = false;
      await this.initData();
    },
    async loadErc20Info() {
      const erc20Instance = this.smartContractManager.getErcInstanceFromAddress(
        window.ethereum.selectedAddress,
        this.form.trackNew.address
      );
      const erc20Info = await this.smartContractManager.getErc20Info(
        erc20Instance
      );
      console.log(erc20Info);
      this.form.trackNew = {
        name: erc20Info.name,
        address: this.form.trackNew.address,
        symbol: erc20Info.symbol,
        supply: erc20Info.totalSupply
      };
    },
    deploy(evt) {
      try {
        this.loading = true;
        evt.preventDefault();
        const symbol = this.form.deploy.symbol;
        const name = this.form.deploy.name;
        const supply = toTokens(this.form.deploy.supply);
        console.log("supply: ", supply);
        const erc20Contract = this.data.erc20Contract;
        const sender = window.ethereum.selectedAddress;
        this.smartContractManager.deployContract(
          erc20Contract.contract,
          sender,
          erc20Contract.code,
          [name, symbol, supply],
          this.deploySendTransactionCallback,
          this.deployReceiptCallback,
          this.onDeployed
        );
      } catch (e) {
        this.$notifyMessage("danger", "Deployment failed");
        console.error(e);
        this.loading = false;
      }
    },
    deploySendTransactionCallback(err, transactionHash) {
      if (err) {
        console.error(err);
        this.$notifyMessage("danger", "Deployment failed");
      } else {
        console.log("transaction hash: ", transactionHash);
      }
    },
    async deployReceiptCallback(receipt) {
      console.log("contract deployed at: ", receipt.contractAddress);
      registerERC20(
        this.data.erc20Store,
        this.form.deploy.symbol,
        this.form.deploy.name,
        this.form.deploy.supply,
        receipt.contractAddress
      );
      this.loading = false;
      await this.initData();
    },
    onDeployed(instance) {
      console.log(instance);
      this.loading = false;
    },
    async initData() {
      this.trackedTokens = [];
      for (const token of this.data.erc20Store.erc20TrackedTokens) {
        this.trackedTokens.push(token);
      }
    },
    async unTrackToken(token) {
      unRegisterERC20(this.data.erc20Store, token.symbol);
      await this.initData();
    },
    async prepareUnRegister(token) {
      this.tokenToUnRegister = token;
      this.modals.modalUnRegister = true;
    },
    async confirmUnRegister() {
      if (this.tokenToUnRegister !== null) {
        await this.unTrackToken(this.tokenToUnRegister);
        this.tokenToUnRegister = null;
        this.modals.modalUnRegister = false;
      }
    },
    async cancelUnRegister() {
      this.tokenToUnRegister = null;
      this.modals.modalUnRegister = false;
    }
  },
  computed: {
    ...mapState(["data", "smartContractManager"])
  },
  async mounted() {
    await this.initData();
  }
};
</script>
<style></style>
