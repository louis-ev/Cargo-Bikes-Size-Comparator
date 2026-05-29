<template>
  <div>
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
  </div>
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
    return {
      previous_body_overflow: ''
    }
  },
  created() {},
  mounted() {
    this.previous_body_overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  },
  beforeUnmount() {
    document.body.style.overflow = this.previous_body_overflow
  },
  watch: {},
  computed: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
._basicModal {
  position: fixed;
  inset: 0;
  z-index: 10000;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  height: 100%;
  max-height: 100dvh;
  margin: 0;
  padding: 2rem;
  overflow: hidden;
  background-color: rgba(210, 210, 210, 0.9);
  backdrop-filter: blur(10px);
  border: none;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
._basicModal--content {
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 0.5rem;
  background: var(--color-background);
  overflow: hidden;

  display: flex;
  flex-flow: column nowrap;
  flex: 1 1 auto;
  min-height: 0;

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
  z-index: 10;
}

._content {
  flex: 1 1 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
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
