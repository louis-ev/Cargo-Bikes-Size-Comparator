<template>
  <div class="_search">
    <input type="text" v-model="searchValue" :placeholder="$t('message.search_placeholder')" />
    <button type="button" v-if="searchValue.length > 0" @click="clearSearch">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 18L18 6M6 6L18 18"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchField',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  computed: {
    searchValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    clearSearch() {
      this.$emit('update:modelValue', '')
    }
  }
}
</script>

<style lang="scss" scoped>
._search {
  position: relative;
  // margin-bottom: 1rem;

  input {
    width: 100%;
    padding-right: 1.7em;
  }

  button {
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
    line-height: 0;
    width: 1.5em;
    height: 1.5em;
    padding: 0;
    background-color: var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>
