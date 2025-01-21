<template>
  <div class="_item" :data-active="isEnabled" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <label :for="bike.id" class="_itemTop">
      <input
        v-show="!isEnabled"
        type="checkbox"
        :checked="isEnabled"
        :id="bike.id"
        :disabled="!bike.bike_length_cm"
        @change="$emit('toggle')"
      />
      <select v-if="isEnabled" :value="position" @change="onChangePosition">
        <option v-for="i in total_enabled_bikes" :value="i - 1" :key="i">
          {{ i }}
        </option>
      </select>

      <div class="_names">
        <BikeName :bike="bike" />
      </div>

      <div v-if="bike.id" class="_img">
        <div
          v-if="isEnabled && canvas_image_style_outline"
          class="_color"
          :style="{ '--outline-color': `#${bike.color}` }"
        />
        <img v-if="thumbImage" :src="thumbImage" />
      </div>
    </label>

    <BikeDetails
      v-if="isEnabled"
      :bike="bike"
      :bikes_adjustments="bikes_adjustments"
      @update:bikes_adjustments="$emit('update:bikes_adjustments', $event)"
    />
  </div>
</template>

<script>
import BikeDetails from './BikeDetails.vue'

export default {
  components: { BikeDetails },
  props: {
    bike: Object,
    position: Number,
    total_enabled_bikes: Number,
    isEnabled: Boolean,
    canvas_image_style_outline: Boolean,
    bikes_adjustments: Object,
    thumbImage: String
  },
  emits: ['toggle', 'update:bikes_adjustments', 'update:position'],
  methods: {
    onChangePosition(e) {
      this.$emit('positionInEnabledBikes', this.position, e.target.value)
    },
    onMouseEnter() {
      // not very effective, triggers an hover on next bike when enabling a bike
      this.$preview_bike.id = this.bike.id
    },
    onMouseLeave() {
      setTimeout(() => {
        if (this.$preview_bike.id === this.bike.id) {
          this.$preview_bike.id = null
        }
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
._item {
  line-height: 1.2;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;

  &[data-active='true'] ._itemTop {
    top: 0;
    background-color: var(--color-accent);

    img {
      filter: grayscale(100%);
      mix-blend-mode: multiply;
    }
  }
}

._itemTop {
  padding: 0;
  font-weight: inherit;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  justify-content: space-between;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  overflow: hidden;

  &:not(:has(input[disabled])) {
    cursor: pointer;
  }
  &:has(input[disabled]) {
    cursor: not-allowed;
  }

  input,
  select {
    cursor: pointer;
    margin: 1rem;
    flex: 0 0 auto;
  }

  select {
    font-size: 0.8rem;
    margin: 0.5rem;
    padding: 0.25rem 0.25rem;
    background-color: rgba(255, 255, 255, 0.95);
    background-color: var(--color-accent);
    font-weight: bold;
    // border: 1px solid var(--color-text);
    // border: 1px solid white;
    background-color: white;
    background-color: rgba(255, 255, 255, 0.8);
  }

  ._names {
    flex: 1 1 auto;
    padding: 0.25rem 0;
    align-self: center;
  }

  ._img {
    position: relative;
    flex: 0 0 auto;
    width: 44px;
    height: 44px;

    ._color {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      opacity: 0.8;
      background-color: #fff;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: var(--outline-color);
      }
    }

    img {
      position: relative;
      height: 100%;
      width: 100%;
      padding: 0 0.25rem 0 0;
      object-fit: scale-down;
      object-position: center;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      &:not(:has(input[disabled])) {
        background-color: var(--color-accent);
      }
    }
  }
}
</style>
