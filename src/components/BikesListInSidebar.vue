<template>
  <transition-group tag="div" class="_bikeList" name="list">
    <div
      class="_item"
      v-for="bike in bikes"
      :key="bike.id"
      :data-active="bikeIsEnabled(bike.id)"
      @mouseenter="showBikePreview(bike.id)"
      @mouseleave="hideBikePreview"
    >
      <label :for="bike.id" class="_itemTop">
        <input
          type="checkbox"
          :checked="bikeIsEnabled(bike.id)"
          :id="bike.id"
          :disabled="!bike.bike_length_cm"
          @change="toggleBike(bike.id)"
        />

        <div class="_names">
          <BikeName :bike="bike" />
        </div>

        <div v-if="bike.id" class="_img">
          <div
            v-if="bikeIsEnabled(bike.id) && canvas_image_style_outline"
            class="_color"
            :style="{ '--outline-color': `#${bike.color}` }"
          />
          <img v-if="getBikeThumbImage(bike)" :src="getBikeThumbImage(bike)" />
        </div>
      </label>

      <BikeDetails
        v-if="bikeIsEnabled(bike.id)"
        :bike="bike"
        :bikes_adjustments="bikes_adjustments"
        @update:bikes_adjustments="$emit('update:bikes_adjustments', $event)"
      />
    </div>
  </transition-group>
</template>
<script>
import BikeDetails from '@/components/BikeDetails.vue'

const bike_images_thumbs_paths = import.meta.glob('@/assets/bikes/*.png', {
  eager: true,
  import: 'default',
  query: { format: 'webp', w: 80 }
})

export default {
  props: {
    bikes: Array,
    enabled_bikes: Array,
    canvas_image_style_outline: Boolean,
    bikes_adjustments: Object
  },
  components: {
    BikeDetails
  },
  data() {
    return {
      bike_images_thumbs_urls: [],
      bike_preview_id: null,
      hideBikePreviewTimeout: null
    }
  },
  async created() {},
  async mounted() {
    this.bike_images_thumbs_urls = await this.$loadBikeImages2(bike_images_thumbs_paths)
  },
  beforeUnmount() {},
  watch: {},
  computed: {},
  methods: {
    toggleBike(id) {
      let enabled_bikes_ids = this.enabled_bikes.map((b) => b.id)
      if (enabled_bikes_ids.includes(id)) {
        enabled_bikes_ids = enabled_bikes_ids.filter((i) => i !== id)
      } else {
        enabled_bikes_ids.push(id)
      }
      this.$root.updateBikesQuery(enabled_bikes_ids)
    },
    showBikePreview(id) {
      this.$preview_bike.id = id
      clearTimeout(this.hideBikePreviewTimeout)
    },
    hideBikePreview() {
      this.hideBikePreviewTimeout = setTimeout(() => {
        this.$preview_bike.id = null
      }, 100)
    },
    bikeIsEnabled(id) {
      return this.enabled_bikes.some((i) => i.id === id)
    },
    getBikeThumbImage(bike) {
      const thumb = this.bike_images_thumbs_urls.find((i) => i.original_filename === bike.src)
      if (!thumb) return
      return thumb.url
    }
  }
}
</script>
<style lang="scss" scoped>
._bikeList {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.25rem;
  padding: 0.25rem 0;
}

._item {
  line-height: 1.2;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;

  // transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);

  &[data-active='true'] ._itemTop {
    background-color: var(--color-accent);

    img {
      filter: grayscale(100%);
      mix-blend-mode: multiply;
    }
  }

  &:hover,
  &:focus-visible {
    // box-shadow: 0 0.05rem 0.2rem 0rem var(--color-accent);
  }
}

._itemTop {
  padding: 0;
  font-weight: inherit;

  border-radius: 0.5rem;

  display: flex;
  flex-direction: row nowrap;
  align-items: stretch;
  justify-content: space-between;

  &:not(:has(input[disabled])) {
    cursor: pointer;
  }
  &:has(input[disabled]) {
    cursor: not-allowed;
  }

  overflow: hidden;

  input {
    cursor: pointer;
    margin: 1rem;
  }

  ._names {
    flex: 1 1 auto;
    padding: 0.25rem 0;
    align-self: center;
  }

  input {
    flex: 0 0 auto;
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
