<template>
  <div>
    <transition-group tag="div" class="_bikeList" name="list">
      <template v-if="enabled_bikes.length > 0">
        <div class="_itemTitle" :key="'enabled_bikes'">
          <span>{{ $t('message.bikes_selected', { count: enabled_bikes.length }) }}</span>
          <button type="button" @click="$root.resetBikes">
            {{ $t('message.reset') }}
          </button>
        </div>
        <BikeEntry
          v-for="bike in enabled_bikes"
          :key="bike.id"
          :position="enabled_bikes.indexOf(bike)"
          :total_enabled_bikes="enabled_bikes.length"
          :bike="bike"
          :is-enabled="bikeIsEnabled(bike.id)"
          :canvas_image_style_outline="canvas_image_style_outline"
          :bikes_adjustments="bikes_adjustments"
          :thumb-image="getBikeThumbImage(bike)"
          @toggle="toggleBike(bike.id)"
          @positionInEnabledBikes="positionInEnabledBikes"
          @update:bikes_adjustments="$emit('update:bikes_adjustments', $event)"
        />

        <hr />
      </template>

      <SearchField v-model="search_str" />
      <div
        class="_itemTitle"
        :key="'not_enabled_bikes'"
        v-if="filtered_not_enabled_bikes.length > 0"
      >
        {{
          $t('message.or_click_on_bikes', {
            count: filtered_not_enabled_bikes.length
          })
        }}
      </div>

      <div v-if="filtered_bikes.length === 0" class="_noMatch">
        {{ $t('message.no_bikes_matched_your_search') }}<br />
        <div class="_addMissingBike">
          <button
            type="button"
            data-color="black"
            data-size="big"
            @click="$emit('showAddBikeModal')"
          >
            ＋
            {{ $t('message.add_a_bike') }}
          </button>
        </div>

        <!-- {{ $t('message.to_contribute_a_bike') }}
        <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator/issues/9" target="_blank">
          {{ $t('message.read_the_guide') }}
        </a>
        {{ $t('message.or_ask_me') }}
        <a href="mailto:hello@louiseveillard.com" target="_blank">{{ $t('message.via_email') }}.</a>. -->
      </div>

      <BikeEntry
        v-for="bike in filtered_not_enabled_bikes"
        :key="bike.id"
        :bike="bike"
        :is-enabled="bikeIsEnabled(bike.id)"
        :canvas_image_style_outline="canvas_image_style_outline"
        :bikes_adjustments="bikes_adjustments"
        :thumb-image="getBikeThumbImage(bike)"
        @toggle="toggleBike(bike.id)"
        @update:bikes_adjustments="$emit('update:bikes_adjustments', $event)"
      />
    </transition-group>
  </div>
</template>
<script>
import BikeEntry from './BikeEntry.vue'
import SearchField from './SearchField.vue'

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
    BikeEntry,
    SearchField
  },
  data() {
    return {
      search_str: '',
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
  computed: {
    filtered_bikes() {
      return this.bikes.filter((bike) => {
        if (!this.search_str) return true
        return (
          this.$normalizeStringForSearch(bike.model).includes(
            this.$normalizeStringForSearch(this.search_str)
          ) ||
          this.$normalizeStringForSearch(bike.manufacturer).includes(
            this.$normalizeStringForSearch(this.search_str)
          )
        )
      })
    },
    filtered_not_enabled_bikes() {
      return this.filtered_bikes.slice().filter((i) => !this.enabled_bikes.includes(i))
    }
  },
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
    bikeIsEnabled(id) {
      return this.enabled_bikes.some((i) => i.id === id)
    },
    getBikeThumbImage(bike) {
      const thumb = this.bike_images_thumbs_urls.find((i) => i.original_filename === bike.src)
      if (!thumb) return
      return thumb.url
    },
    positionInEnabledBikes(old_position, new_position) {
      const bike = this.enabled_bikes.splice(old_position, 1)[0]
      this.enabled_bikes.splice(new_position, 0, bike)
      this.$root.updateBikesQuery(this.enabled_bikes.map((b) => b.id))
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
    top: 0;
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

  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);

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
._itemTitle {
  display: flex;
  flex-direction: row wrap;
  justify-content: space-between;
  align-items: center;
}
</style>
