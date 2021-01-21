<template>
  <footer class="footer px-4">
    <div class="row align-items-center justify-content-lg-between">
      <div class="col-lg-6">
        <div class="copyright text-center text-lg-left text-muted">
          © {{year}} <a href="https://abdelhamidbakhta.github.io/" class="font-weight-bold ml-1" target="_blank">Abdelhamid Bakhta</a>
        </div>
      </div>
      <div class="col-lg-6">
        <ul class="nav nav-footer justify-content-center justify-content-lg-end">
          <li class="nav-item">
            <!--a href="https://github.com/thefutureisnow-hackathon/binance-meets-defi-dashboard" class="nav-link" target="_blank">Source Code</a-->
            <base-button type="neutral" @click="github">
              <img slot="icon" src="https://demos.creative-tim.com/argon-design-system/assets/img/icons/common/github.svg">
              Github
            </base-button>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  },
  methods: {
    github(){
      window.open('https://github.com/thefutureisnow-hackathon/binance-meets-defi-dashboard')
    },
  }
};
</script>
<style></style>
