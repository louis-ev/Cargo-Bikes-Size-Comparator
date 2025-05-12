<template>
  <div class="_adjustInput">
    <label>{{ label }}</label>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="_resetPosition">
      <button
        type="button"
        class="noStyle"
        @click="$emit('reset')"
        :aria-label="$t('message.reset')"
        :disabled="isResetDisabled"
      >
        &#8630;
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RangeInput',
  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: [Number, String],
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    step: {
      type: Number,
      default: 0.1
    },
    isResetDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'reset']
}
</script>

<style lang="scss" scoped>
._adjustInput {
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  gap: 0.5rem;

  label {
    flex: 0 0 auto;
  }
  input {
    width: 100%;
  }
}
._resetPosition {
  text-align: center;
}
</style>
