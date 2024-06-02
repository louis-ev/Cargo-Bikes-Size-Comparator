<template>
  <div>
    <input type="number" v-model="local_value" />
    <input type="range" v-model="local_value" />
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
  methods: {
    onChange(e) {
      this.$emit('update:value', e.target.value)
    }
  }
}
</script>
<style lang="scss" scoped></style>
