<template>
  <transition-group tag="div" class="_bikeList" name="list">
    <div class="_item" v-for="bike in bikes" :key="bike.id" :data-active="bikeIsEnabled(bike.id)">
      <label :for="bike.id" class="_itemTop">
        <input
          type="checkbox"
          :checked="bikeIsEnabled(bike.id)"
          :id="bike.id"
          :disabled="!bike.bike_length_cm"
          @change="toggleBike(bike.id)"
        />

        <div class="_names">
          <strong>{{ bike.model || bike.manufacturer }}</strong>
          <span class="_flag" v-if="bike.frame_made_in">
            {{ unicodeFlag(bike.frame_made_in) }}
          </span>
          <template v-if="bike.manufacturer && bike.model">
            <small> – {{ bike.manufacturer }} </small>
          </template>
          <br />
          <small>
            <template v-if="bike.bike_length_cm">
              {{ bike.bike_length_cm }}cm
              <template v-if="$i18n.locale === 'en'">
                –
                {{ getLengthInInches(bike.bike_length_cm) }} inches
              </template>
            </template>
            <template v-else>{{ $t('message.missing_length_information') }}</template>
          </small>
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

      <div class="_itemBottom" v-if="bikeIsEnabled(bike.id)">
        <div class="_madeIn" v-if="bike.frame_made_in">
          {{
            $t('message.bike_mostly_manufactured_and_assembled') +
            ' ' +
            $t('message.in_' + bike.frame_made_in)
          }}
        </div>

        <div class="_adjust">
          <small>
            <div class="_adjustInput">
              <label>Position</label>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.1"
                :list="'steplist-' + bike.id"
                :value="bikes_position_adjustments[bike.id]"
                @input="updateBikePosition(bike.id, $event.target.value)"
              />
              <!-- // disabled because snapping prevents fine tuning -->
              <!-- <datalist :id="'steplist-' + item.id">
              <option>0</option>
            </datalist> -->

              <div class="_resetPosition" v-if="bikes_position_adjustments.hasOwnProperty(bike.id)">
                <button type="button" class="noStyle" @click="resetBikePosition(bike.id)">
                  Reset
                </button>
              </div>
            </div>
          </small>
        </div>

        <div class="_measurements" v-if="bike._measurements">
          <small v-html="getMeasurements(bike)" />
          <br />
        </div>
        <div class="_source">
          <a :href="bike.url" target="_blank"> <span>&#8594;</span> {{ $t('message.website') }}</a>
        </div>
      </div>
    </div>
  </transition-group>
</template>
<script>
const bike_images_thumbs_paths = import.meta.glob('@/assets/bikes/*.png', {
  query: { format: 'webp', w: 80 }
})

export default {
  props: {
    bikes: Array,
    enabled_bikes: Array,
    canvas_image_style_outline: Boolean,
    bikes_position_adjustments: Object
  },
  components: {},
  data() {
    return {
      bike_images_thumbs_urls: []
    }
  },
  async created() {},
  async mounted() {
    this.bike_images_thumbs_urls = await this.loadAllThumbs()
  },
  beforeUnmount() {},
  watch: {},
  computed: {},
  methods: {
    async loadAllThumbs() {
      const urls = []
      for (let [source, thumb] of Object.entries(bike_images_thumbs_paths)) {
        const import_statment = thumb()
        const url = (await import_statment).default
        const original_filename = source.split('/').pop()
        urls.push({
          url,
          original_filename
        })
      }
      return urls
    },
    toggleBike(id) {
      let enabled_bikes_ids = this.enabled_bikes.map((b) => b.id)
      if (enabled_bikes_ids.includes(id)) {
        enabled_bikes_ids = enabled_bikes_ids.filter((i) => i !== id)
      } else {
        enabled_bikes_ids.push(id)
      }
      let query = JSON.parse(JSON.stringify(this.$route.query)) || {}
      query.bikes = JSON.stringify(enabled_bikes_ids)

      this.$router.push({
        query
      })
    },
    bikeIsEnabled(id) {
      return this.enabled_bikes.some((i) => i.id === id)
    },
    getBikeThumbImage(bike) {
      const thumb = this.bike_images_thumbs_urls.find((i) => i.original_filename === bike.src)
      if (!thumb) return
      return thumb.url
    },
    getMeasurements(bike) {
      return Object.entries(bike._measurements)
        .reduce((acc, [k, v]) => {
          if (k && k !== '\r' && v && v !== '\r') acc.push(`${k}: ${v}`)
          return acc
        }, [])
        .join('<br>')
    },
    resetBikePosition(id) {
      const bikes_position_adjustments = JSON.parse(JSON.stringify(this.bikes_position_adjustments))
      delete bikes_position_adjustments[id]
      this.$emit('update:bikes_position_adjustments', bikes_position_adjustments)
    },
    updateBikePosition(id, value) {
      const bikes_position_adjustments = JSON.parse(JSON.stringify(this.bikes_position_adjustments))
      bikes_position_adjustments[id] = +value
      this.$emit('update:bikes_position_adjustments', bikes_position_adjustments)
    },
    unicodeFlag(country) {
      if (country === 'usa') return '🇺🇸'
      if (country === 'germany') return '🇩🇪'
      if (country === 'france') return '🇫🇷'
      return
    },
    getLengthInInches(length_cm) {
      return (length_cm / 2.54).toFixed(1)
    }
  }
}
</script>
<style lang="scss" scoped>
._bikeList {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
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
    width: 52px;
    padding: 0.25rem;

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
      object-fit: scale-down;
      object-position: center;
      border: none;
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

._itemBottom {
  padding: 0.5rem 1rem 1rem;
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
}
._measurements {
  margin-bottom: 0.5rem;
}

._reset {
  padding: 0 0.25rem;

  cursor: pointer;
}
._flag {
  font-size: 0.6rem;
  margin-left: 0.15rem;
}
._adjustInput {
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  gap: 0.5rem;

  label {
    flex: 0 0 auto;
  }
}

._resetPosition {
  text-align: center;
}
</style>
