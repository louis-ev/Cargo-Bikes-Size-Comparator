<template>
  <div class="_sliderNumber">
    <label :for="label">{{ label }}</label>
    <input type="number" v-model="local_value" />
    <input type="range" :dir="direction" step="0.1" min="0" max="100" v-model="local_value" />
  </div>
</template>
<script>
export default {
  props: {
    value: Number,
    label: String,
    direction: String
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
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
}
input[type='number'] {
  flex: 0 0 10ch;
  width: 10ch;
}
input[type='range'] {
  flex: 1;
}
</style>
