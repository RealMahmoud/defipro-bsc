<template>
  <div class="header" :style="'background-color: ' + custom">
    <div class="container-fluid">
      <div class="header-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "base-header-custom-color",
  props: {
    custom: {
      type: String,
      default: "#ffffff",
      description: "Header background color"
    }
  }
};
</script>
<style></style>
