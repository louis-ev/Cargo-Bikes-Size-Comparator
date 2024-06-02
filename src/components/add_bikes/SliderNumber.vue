<template>
  <div class="_sliderNumber">
    local_value = {{ local_value }}
    <input type="number" v-model="local_value" />
    <input type="range" step="0.1" min="0" max="100" v-model="local_value" />
  </div>
</template>
<script>
export default {
  props: {
    value: Number
  },
  components: {},
  data() {
    return {
      local_value: this.value
    }
  },
  created() {},
  mounted() {},
  watch: {
    local_value(newVal) {
      this.$emit('update:value', newVal)
    }
  },
  computed: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
._sliderNumber {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
