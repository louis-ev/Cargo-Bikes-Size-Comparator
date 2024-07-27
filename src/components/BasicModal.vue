<template>
  <Teleport to="body">
    <dialog open class="_basicModal" @click.self="$emit('close')">
      <div class="_basicModal--content" :data-size="size">
        <div class="_header">
          <slot name="header"></slot>
        </div>
        <div class="_content">
          <slot name="content"></slot>
        </div>
      </div>
      <button
        type="button"
        class="_close"
        @click="$emit('close')"
        :aria-label="$t('message.close')"
      >
        ✕
      </button>
      <div v-if="has_nav" class="_nav">
        <button
          type="button"
          class="_prevBtn"
          @click="$emit('prev')"
          :aria-label="$t('message.prev')"
        >
          ←
        </button>
        <button
          type="button"
          class="_nextBtn"
          @click="$emit('next')"
          :aria-label="$t('message.next')"
        >
          →
        </button>
      </div>
    </dialog>
  </Teleport>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    has_nav: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
._basicModal {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10000;
  top: 0;
  left: 0;
  padding: 2rem;
  // background-color: rgba(0, 0, 0, 0.9);
  background-color: rgba(210, 210, 210, 0.9);
  backdrop-filter: blur(10px);

  border: none;
}
._basicModal--content {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 0.5rem;
  background: var(--color-background);
  overflow-y: auto;

  display: flex;
  flex-flow: column nowrap;

  // gap: 2rem;

  transition: all 0.5s ease-in-out;

  &[data-size='large'] {
    max-width: 900px;
  }
  &[data-size='full'] {
    max-width: 100%;
    max-height: 100%;
  }
}

._header {
  flex: 0 0 auto;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: 800;
  background-color: var(--color-text);
  color: var(--color-background);
  padding: 0.5rem 1rem;
  // margin: -1rem;
  // margin-bottom: -1.5rem;
  z-index: 10;
  // border-radius: 0.5rem;
}

._content {
  flex: 1 1 0;
  overflow: auto;
}

._close {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.125rem;
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
  line-height: 0;
  // background-color: var(--color-text);
  // color: var(--color-background);
  border: none;
  cursor: pointer;
}

._nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > * {
    pointer-events: auto;
    width: 2rem;
    height: 2rem;
  }
}
</style>
