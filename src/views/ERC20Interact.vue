<template>
  <div>
    <base-header-custom-color custom="#ECB52E" class="pb-6 pb-8 pt-5 pt-md-8">
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
                    <h5 class="card-title text-uppercase text-muted mb-0">
                      {{ erc20Token.symbol }}
                    </h5>
                    <span class="h2 font-weight-bold mb-0">{{
                      erc20Token.name
                    }}</span>
                  </slot>
                </div>

                <div class="col-auto">
                  <h5>{{ erc20Token.address }}</h5>
                </div>
                <div class="col-auto">
                  <base-button
                    @click="erc20Token.address = null"
                    type="primary"
                    icon="fa fa-exchange-alt"
                    >Change
                  </base-button>
                </div>
              </div>
              <p class="mt-3 mb-0 text-sm">
                <span class="text-success mr-2"
                  ><i class="fa fa-coins"></i> {{ selectedTokenSupply }}</span
                >
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
            <b-form-select
              v-model="tmpSelectedErc20Address"
              :options="trackedTokens"
              v-on:change="onERC20AddressSelectChanged"
            ></b-form-select>
          </div>
          <div class="col-md-5">
            <base-input v-model="tmpSelectedErc20Address"></base-input>
          </div>
          <div class="col-md-2">
            <base-button
              @click="loadERC20FromAddress(tmpSelectedErc20Address)"
              type="primary"
              icon="ni ni-send"
              >Load
            </base-button>
          </div>
        </div>
      </div>
    </base-header-custom-color>

    <div class="container-fluid mt--7">
      <div class="card shadow" v-if="displayInteractForm">
        <div class="card-body">
          <div class="accordion mt-2" role="tablist">
            <b-card class="mb-1" no-body>
              <b-card-header class="p-1" header-tag="header" role="tab">
                <b-button block v-b-toggle.accordion-balance-of variant="dark"
                  >Balance Of</b-button
                >
              </b-card-header>
              <b-collapse
                accordion="my-accordion"
                id="accordion-balance-of"
                role="tabpanel"
              >
                <b-card-body>
                  <b-input-group class="mt-2" prepend="Account">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter account address"
                      v-model="balanceOf.address"
                    ></b-form-input>
                    <b-button
                      variant="dark"
                      class="mr-2"
                      @click="fillBalanceOfAddressWithSelectedEthereumAddress"
                      >Me</b-button
                    >
                    <b-button
                      disabled
                      v-if="balanceOf.balance != null"
                      variant="outline-info"
                    >
                      {{ balanceOf.balance }}
                    </b-button>
                    <b-input-group-append>
                      <b-button-group class="mx-1">
                        <b-button class="ml-2" @click="callBalanceOf"
                          >&raquo;</b-button
                        >
                      </b-button-group>
                    </b-input-group-append>
                  </b-input-group>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card class="mb-1" no-body>
              <b-card-header class="p-1" header-tag="header" role="tab">
                <b-button block v-b-toggle.accordion-transfer variant="dark"
                  >Transfer</b-button
                >
              </b-card-header>
              <b-collapse
                accordion="my-accordion"
                id="accordion-transfer"
                role="tabpanel"
              >
                <b-card-body>
                  <b-input-group class="mt-2" prepend="To">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter recipient address"
                      v-model="transfer.recipient"
                    ></b-form-input>
                  </b-input-group>
                  <b-input-group class="mt-2" prepend="Amount">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter amount"
                      v-model="transfer.amount"
                    ></b-form-input>
                    <b-input-group-append v-if="!transfer.inProgress">
                      <b-button-group class="mx-1">
                        <b-button @click="sendTransfer">&raquo;</b-button>
                      </b-button-group>
                    </b-input-group-append>
                    <b-input-group-append v-if="transfer.inProgress">
                      <b-spinner label="Spinning"></b-spinner>
                    </b-input-group-append>
                  </b-input-group>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card class="mb-1" no-body>
              <b-card-header class="p-1" header-tag="header" role="tab">
                <b-button block v-b-toggle.accordion-allowance variant="dark"
                  >Allowance</b-button
                >
              </b-card-header>
              <b-collapse
                accordion="my-accordion"
                id="accordion-allowance"
                role="tabpanel"
              >
                <b-card-body>
                  <b-input-group class="mt-2" prepend="Owner">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter owner address"
                      v-model="allowance.owner"
                    ></b-form-input>
                  </b-input-group>
                  <b-input-group class="mt-2" prepend="Spender">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter spender address"
                      v-model="allowance.spender"
                    ></b-form-input>
                    <b-button
                      disabled
                      v-if="allowance.returnValue != null"
                      variant="outline-info"
                    >
                      {{ allowance.returnValue }}
                    </b-button>
                    <b-input-group-append>
                      <b-button-group class="mx-1">
                        <b-button @click="callAllowance">&raquo;</b-button>
                      </b-button-group>
                    </b-input-group-append>
                  </b-input-group>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card class="mb-1" no-body>
              <b-card-header class="p-1" header-tag="header" role="tab">
                <b-button block v-b-toggle.accordion-approve variant="dark"
                  >Approve</b-button
                >
              </b-card-header>
              <b-collapse
                accordion="my-accordion"
                id="accordion-approve"
                role="tabpanel"
              >
                <b-card-body>
                  <b-input-group class="mt-2" prepend="Spender">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter spender address"
                      v-model="approve.spender"
                    ></b-form-input>
                  </b-input-group>
                  <b-input-group class="mt-2" prepend="Amount">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter amount"
                      v-model="approve.amount"
                    ></b-form-input>
                    <b-input-group-append v-if="!approve.inProgress">
                      <b-button-group class="mx-1">
                        <b-button @click="sendApprove">&raquo;</b-button>
                      </b-button-group>
                    </b-input-group-append>
                    <b-input-group-append v-if="approve.inProgress">
                      <b-spinner label="Spinning"></b-spinner>
                    </b-input-group-append>
                  </b-input-group>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card class="mb-1" no-body>
              <b-card-header class="p-1" header-tag="header" role="tab">
                <b-button
                  block
                  v-b-toggle.accordion-transfer-from
                  variant="dark"
                  >Transfer from</b-button
                >
              </b-card-header>
              <b-collapse
                accordion="my-accordion"
                id="accordion-transfer-from"
                role="tabpanel"
              >
                <b-card-body>
                  <b-input-group class="mt-2" prepend="Sender">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter sender address"
                      v-model="transferFrom.sender"
                    ></b-form-input>
                  </b-input-group>
                  <b-input-group class="mt-2" prepend="Recipient">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter recipient address"
                      v-model="transferFrom.recipient"
                    ></b-form-input>
                  </b-input-group>
                  <b-input-group class="mt-2" prepend="Amount">
                    <b-form-input
                      class="mr-2"
                      placeholder="Enter amount"
                      v-model="transferFrom.amount"
                    ></b-form-input>
                    <b-input-group-append v-if="!transferFrom.inProgress">
                      <b-button-group class="mx-1">
                        <b-button @click="sendTransferFrom">&raquo;</b-button>
                      </b-button-group>
                    </b-input-group-append>
                    <b-input-group-append v-if="transferFrom.inProgress">
                      <b-spinner label="Spinning"></b-spinner>
                    </b-input-group-append>
                  </b-input-group>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </div>
      </div>
    </div>

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
import { fromTokens, toTokens } from "@/services/eth-utils";
import BaseHeaderCustomColor from "@/components/BaseHeaderCustomColor";
export default {
  components: {
    BaseHeaderCustomColor
  },
  data() {
    return {
      tmpSelectedErc20Address: null,
      loading: false,
      erc20Token: {
        contract: null,
        address: null,
        symbol: "",
        name: "",
        supply: "0"
      },
      modals: {},
      trackedTokens: [],
      form: {},
      balanceOf: {
        address: "",
        balance: null
      },
      transfer: {
        recipient: "",
        amount: 0,
        receipt: null,
        inProgress: false
      },
      allowance: {
        owner: "",
        spender: "",
        returnValue: null
      },
      approve: {
        spender: "",
        amount: 0,
        receipt: null,
        inProgress: false
      },
      transferFrom: {
        sender: "",
        recipient: "",
        amount: 0,
        receipt: null,
        inProgress: false
      }
    };
  },
  methods: {
    async onERC20AddressSelectChanged(address) {
      await this.loadERC20FromAddress(address);
    },
    async loadERC20FromAddress(address) {
      if (address !== null) {
        const contractInstance = this.smartContractManager.getErcInstanceFromAddress(
          window.ethereum.selectedAddress,
          address
        );
        const erc20Info = await this.smartContractManager.getErc20Info(
          contractInstance
        );
        this.erc20Token = {
          name: erc20Info.name,
          address: address,
          symbol: erc20Info.symbol,
          supply: erc20Info.totalSupply,
          contract: contractInstance
        };
      }
    },
    async initData() {
      if (this.erc20Token.address !== null) {
        await this.loadERC20FromAddress(this.erc20Token.address);
      }
      this.trackedTokens = [];
      for (const token of this.data.erc20Store.erc20TrackedTokens) {
        this.trackedTokens.push({
          name: token.name,
          symbol: token.symbol,
          address: token.address,
          supply: token.supply,
          value: token.address,
          text: token.name
        });
      }
    },
    fillBalanceOfAddressWithSelectedEthereumAddress() {
      this.balanceOf.address = window.ethereum.selectedAddress;
    },
    async callBalanceOf() {
      this.balanceOf.balance = fromTokens(
        await this.erc20Token.contract.methods
          .balanceOf(this.balanceOf.address)
          .call()
      );
    },
    async callAllowance() {
      this.allowance.returnValue = fromTokens(
        await this.erc20Token.contract.methods
          .allowance(this.allowance.owner, this.allowance.spender)
          .call()
      );
    },
    async sendTransfer() {
      this.transfer.inProgress = true;
      const transferReturn = this.transfer;
      this.erc20Token.contract.methods
        .transfer(this.transfer.recipient, toTokens(this.transfer.amount))
        .send({ from: window.ethereum.selectedAddress })
        .then(function(receipt) {
          console.log(receipt);
          transferReturn.receipt = receipt;
          transferReturn.inProgress = false;
        });
    },
    async sendTransferFrom() {
      this.transferFrom.inProgress = true;
      const transferFromReturn = this.transferFrom;
      this.erc20Token.contract.methods
        .transferFrom(
          this.transferFrom.sender,
          this.transferFrom.recipient,
          toTokens(this.transferFrom.amount)
        )
        .send({ from: window.ethereum.selectedAddress })
        .then(function(receipt) {
          console.log(receipt);
          transferFromReturn.receipt = receipt;
          transferFromReturn.inProgress = false;
        });
    },
    async sendApprove() {
      this.approve.inProgress = true;
      const approveReturn = this.approve;
      this.erc20Token.contract.methods
        .approve(this.approve.spender, toTokens(this.approve.amount))
        .send({ from: window.ethereum.selectedAddress })
        .then(function(receipt) {
          console.log(receipt);
          approveReturn.receipt = receipt;
          approveReturn.inProgress = false;
        });
    }
  },
  computed: {
    displayInteractForm() {
      return (
        this.erc20Token.address !== null &&
        this.erc20Token.name !== null &&
        this.erc20Token.name !== ""
      );
    },
    selectedTokenSupply() {
      return fromTokens(this.erc20Token.supply);
    },
    ...mapState(["data", "smartContractManager"])
  },
  async mounted() {
    const addressParam = this.$route.params["address"];
    if (addressParam !== null && addressParam !== "null") {
      this.erc20Token.address = addressParam;
    }
    await this.initData();
  }
};
</script>
<style></style>
