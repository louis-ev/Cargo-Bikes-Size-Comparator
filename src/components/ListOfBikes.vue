<template>
  <div class="_listOfBikes">
    <span>
      {{
        $t('message.click_on_bikes_in_this_list_to_compare_their_size', {
          count: bikes.length
        })
      }}</span
    >
    <div class="_bikeTypeFilter">
      <button
        v-for="[bike_type, count] in all_bike_types"
        :key="bike_type"
        type="button"
        :class="{ 'is--active': bike_type_filter === bike_type }"
        :style="bikeStyleColor(bike_type)"
        @click="onBikeTypeFilterClick(bike_type)"
      >
        {{ $t(`bike_types.${bike_type}`) }}
        ({{ count }})
      </button>
    </div>

    <transition name="fade" mode="out-in">
      <div class="_bikesPreview" :key="bike_type_filter">
        <button
          type="button"
          class="_bikePreview"
          v-for="bike in filtered_bikes"
          :key="bike.id"
          @click="onBikePreviewClick(bike.id)"
        >
          <transition name="slideup">
            <div v-if="getBikePreviewImage(bike)">
              <img
                loading="lazy"
                :src="getBikePreviewImage(bike)"
                :style="{
                  '--scale-factor': 1 / bike.bike_length_percent + '',
                  '--bottom-margin': 1 - bike.bottom_margin_percent / 1 + ''
                }"
              />
              <!-- <input
                type="checkbox"
                class="_bikeType"
                :value="bike.id"
                :style="bikeStyleColor(bike.bike_type)"
              /> -->
              <div class="_bikeType" :style="bikeStyleColor(bike.bike_type)">
                <!-- {{ bike.bike_type }} -->
              </div>
            </div>
          </transition>
          <span class="_bikeLabel">
            <BikeName :bike="bike" />
          </span>
        </button>
      </div>
    </transition>
  </div>
</template>
<script>
const bike_images_preview_urls = import.meta.glob('@/assets/bikes/*.png', {
  eager: true,
  import: 'default',
  query: { format: 'webp', w: 600 }
})

export default {
  props: {
    bikes: Array
  },
  components: {},
  data() {
    return {
      bike_images_preview_urls: [],
      bike_type_filter: null
    }
  },
  created() {},
  async mounted() {
    this.bike_images_preview_urls = await this.$loadBikeImages2(bike_images_preview_urls)
  },
  beforeUnmount() {},
  watch: {},
  computed: {
    all_bike_types() {
      const bike_types = this.bikes.reduce((acc, bike) => {
        if (!acc[bike.bike_type]) {
          acc[bike.bike_type] = 1
        } else {
          acc[bike.bike_type]++
        }
        return acc
      }, {})
      return Object.entries(bike_types).sort((a, b) => b[1] - a[1])
    },
    filtered_bikes() {
      if (!this.bike_type_filter) return this.bikes
      return this.bikes.filter((bike) => bike.bike_type === this.bike_type_filter)
    }
  },
  methods: {
    getBikePreviewImage(bike) {
      const thumb = this.bike_images_preview_urls.find((i) => i.original_filename === bike.src)
      if (!thumb) return
      return thumb.url
    },
    onBikePreviewClick(bike_id) {
      this.$router.push({
        query: {
          bikes: JSON.stringify([bike_id])
        }
      })
    },
    onBikeTypeFilterClick(bike_type) {
      if (this.bike_type_filter === bike_type) {
        this.bike_type_filter = null
      } else {
        this.bike_type_filter = bike_type
      }
    },
    bikeStyleColor(bike_type) {
      return {
        backgroundColor: this.$root.$bikeTypesColors[bike_type]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
._listOfBikes {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  // gap: 10px;
  z-index: 10;
  background-color: var(--color-background);
}
._listOfBikes {
  overflow-y: auto;
  height: 100%;
  padding: 1rem;
}
._bikeTypeFilter {
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
  padding: 1rem 0;

  button {
    position: relative;
    padding: 0.25rem 0.5rem;
    color: white;
    font-weight: normal;
    font-size: 0.8rem;

    &:hover,
    &:focus-visible {
      transform: rotate(-10deg);
      z-index: 10;
      // background-color: white !important;
    }

    &.is--active {
      z-index: 10;
      transform: rotate(-10deg) scale(1.4);
    }
  }
}
._bikesPreview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
  width: 100%;
}
._bikePreview {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 3/2;
  aspect-ratio: 1;
  height: 100%;
  // box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background-color: rgba(255, 255, 255, 0.4);

  padding: 2rem;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.8);
  }

  img {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 90%;
    object-fit: contain;
    object-position: center center;
    transform: scale(var(--scale-factor));
  }

  ._bikeType {
    position: absolute;
    top: 0;
    right: 0;
    width: 0.75rem;
    height: 0.75rem;
    // padding: 0.25rem 0.5rem;
    margin: 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    background-color: rgba(0, 0, 0, 0.8);
  }

  ._bikeLabel {
    position: absolute;
    --margin: 0.25rem;
    bottom: var(--margin);
    left: var(--margin);
    right: var(--margin);
    padding: 0.25rem 1rem;
    border-radius: 0.25rem;
    font-weight: initial;

    // background-color: rgba(255, 2555, 255, 1);

    text-transform: initial;
  }
}
</style>
