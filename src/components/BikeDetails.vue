<template>
  <div class="_itemBottom">
    <div class="_madeIn" v-if="bike.frame_made_in || bike.assembled_in">
      <template v-if="bike.frame_made_in">
        {{
          $t('message.bike_frame_made_in') +
          ' ' +
          $t('message.in_' + bike.frame_made_in.toLowerCase())
        }}.
      </template>
      <br v-if="bike.frame_made_in && bike.assembled_in" />
      <template v-if="bike.assembled_in">
        {{
          $t('message.bike_assembled_in') +
          ' ' +
          $t('message.in_' + bike.assembled_in.toLowerCase())
        }}.
      </template>
    </div>

    <div v-if="bike.comment_en" v-html="bike.comment_en" />

    <div v-if="bike.request_test_url" class="_source">
      <a :href="bike.request_test_url" target="_blank">
        {{ $t('message.request_test_url') }} &#x2197;
      </a>
    </div>

    <div class="_source">
      <a :href="bike.url" target="_blank"> {{ $t('message.open_product_page') }} &#x2197; </a>
    </div>

    <details class="_measurements" v-if="bike._measurements">
      <summary>{{ $t('message.technical_infos') }}</summary>
      <small v-html="getMeasurements(bike)" />
      <br />
    </details>

    <div v-if="bike.additional_links" class="_additionalLinks">
      <a
        v-for="(link, index) in bike.additional_links"
        :href="link.url"
        target="_blank"
        :key="index"
      >
        <span>&#8594;</span> {{ link.text }}
      </a>
    </div>

    <div class="_inSitu" v-if="bike.insitu">
      <label>{{ $t('message.in_situ') }}</label>
      <div class="_inSituImages">
        <button v-for="(img, index) in bike.insitu" :key="img.src" @click="showFullImage(index)">
          <img :src="getImgThumbUrl(img.src)" />
        </button>
      </div>
    </div>

    <details class="_adjust">
      <summary>{{ $t('message.adjust') }}</summary>

      <RangeInput
        :label="$t('message.position') + ' ↔'"
        :model-value="bikes_adjustments[bike.id]?.position_h || 0"
        :min="-50"
        :max="50"
        :is-reset-disabled="!bikes_adjustments[bike.id]?.position_h"
        @update:model-value="(value) => updateBikeAdjustment(bike.id, 'position_h', value)"
        @reset="() => resetBikeAdjustment(bike.id, 'position_h')"
      />

      <RangeInput
        :label="$t('message.position') + ' ↕'"
        :model-value="bikes_adjustments[bike.id]?.position_v || 0"
        :min="-50"
        :max="50"
        :is-reset-disabled="!bikes_adjustments[bike.id]?.position_v"
        @update:model-value="(value) => updateBikeAdjustment(bike.id, 'position_v', value)"
        @reset="() => resetBikeAdjustment(bike.id, 'position_v')"
      />

      <RangeInput
        :label="$t('message.opacity')"
        :model-value="bikes_adjustments[bike.id]?.opacity || 100"
        :min="0"
        :max="100"
        :is-reset-disabled="
          !bikes_adjustments[bike.id]?.opacity || bikes_adjustments[bike.id]?.opacity === 100
        "
        @update:model-value="(value) => updateBikeAdjustment(bike.id, 'opacity', value)"
        @reset="() => resetBikeAdjustment(bike.id, 'opacity')"
      />

      <RangeInput
        :label="$t('message.rotation')"
        :model-value="bikes_adjustments[bike.id]?.rotation || 0"
        :min="-90"
        :max="90"
        :is-reset-disabled="!bikes_adjustments[bike.id]?.rotation"
        @update:model-value="(value) => updateBikeAdjustment(bike.id, 'rotation', value)"
        @reset="() => resetBikeAdjustment(bike.id, 'rotation')"
      />

      <div v-if="hasAdjustments" class="_adjustments-recap">
        <h4>{{ $t('message.current_adjustments') }}</h4>
        <ul>
          <li v-if="bikes_adjustments[bike.id]?.position_h">
            {{ $t('message.position') }} ↔: {{ bikes_adjustments[bike.id].position_h }}
          </li>
          <li v-if="bikes_adjustments[bike.id]?.position_v">
            {{ $t('message.position') }} ↕: {{ bikes_adjustments[bike.id].position_v }}
          </li>
          <li
            v-if="
              bikes_adjustments[bike.id]?.opacity !== undefined &&
              bikes_adjustments[bike.id]?.opacity !== 100
            "
          >
            {{ $t('message.opacity') }}: {{ bikes_adjustments[bike.id].opacity }}%
          </li>
          <li v-if="bikes_adjustments[bike.id]?.rotation">
            {{ $t('message.rotation') }}: {{ bikes_adjustments[bike.id].rotation }}°
          </li>
        </ul>
      </div>
    </details>

    <InsituImageSlide
      v-if="show_full_image_index !== null"
      :insitu="bike.insitu"
      :index="show_full_image_index"
      @close="hideFullImage"
      @prevImage="prevImage"
      @nextImage="nextImage"
    />

    <button type="button" aria-label="Unselect bike" @click="$emit('unselect')">
      × {{ $t('message.unselect') }}
    </button>
  </div>
</template>
<script>
import InsituImageSlide from '@/components/InsituImageSlide.vue'
import RangeInput from '@/components/RangeInput.vue'

const insitu_images_thumbs_paths = import.meta.glob('@/assets/insitu/*', {
  eager: true,
  import: 'default',
  query: { format: 'webp', w: 100 }
})

export default {
  props: {
    bike: {
      type: Object,
      required: true
    },
    bikes_adjustments: {
      type: Object,
      required: true
    }
  },
  components: {
    InsituImageSlide,
    RangeInput
  },
  data() {
    return {
      bike_images_thumbs_urls: [],
      show_full_image_index: null
    }
  },
  async created() {
    this.bike_images_thumbs_urls = await this.$loadBikeImages2(insitu_images_thumbs_paths)
  },
  mounted() {},
  beforeUnmount() {},
  watch: {
    bike: {
      handler(newVal) {
        console.log('bike', newVal)
      },
      deep: true
    }
  },
  computed: {
    hasAdjustments() {
      const adjustments = this.bikes_adjustments[this.bike.id] || {}
      return Object.keys(adjustments).length > 0
    },
    useInches() {
      return this.$root.useInches
    }
  },
  methods: {
    getImgThumbUrl(src) {
      return this.bike_images_thumbs_urls.find((img) => img.original_filename === src)?.url
    },
    showFullImage(index) {
      this.show_full_image_index = index
    },
    prevImage() {
      this.show_full_image_index =
        (this.show_full_image_index - 1 + this.bike.insitu.length) % this.bike.insitu.length
    },
    nextImage() {
      this.show_full_image_index = (this.show_full_image_index + 1) % this.bike.insitu.length
    },
    hideFullImage() {
      this.show_full_image_index = null
    },
    getMeasurements(bike) {
      return Object.entries(bike._measurements)
        .reduce((acc, [k, v]) => {
          if (k && k !== '\r' && v && v !== '\r') {
            // Check if this measurement is likely in cm and should be converted
            const isLengthMeasurement =
              k.toLowerCase().includes('length') ||
              k.toLowerCase().includes('width') ||
              k.toLowerCase().includes('height') ||
              k.toLowerCase().includes('wheelbase') ||
              k.toLowerCase().includes('reach') ||
              k.toLowerCase().includes('stack')

            if (isLengthMeasurement && this.useInches && !isNaN(parseFloat(v))) {
              const valueInCm = parseFloat(v)
              const valueInInches = (valueInCm / 2.54).toFixed(1)
              acc.push(`${k}: ${valueInInches} in`)
            } else {
              acc.push(`${k}: ${v}`)
            }
          }
          return acc
        }, [])
        .join('<br>')
    },
    updateBikeAdjustment(id, type, value) {
      const bikes_adjustments = JSON.parse(JSON.stringify(this.bikes_adjustments))
      if (!bikes_adjustments[id]) bikes_adjustments[id] = {}
      bikes_adjustments[id][type] = +value
      this.$emit('update:bikes_adjustments', bikes_adjustments)
    },
    resetBikeAdjustment(id, type, defaultValue = 0) {
      const bikes_adjustments = JSON.parse(JSON.stringify(this.bikes_adjustments))
      if (!bikes_adjustments[id]) bikes_adjustments[id] = {}
      bikes_adjustments[id][type] = defaultValue
      this.$emit('update:bikes_adjustments', bikes_adjustments)
    }
  }
}
</script>
<style lang="scss" scoped>
._inSituImages {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  > * {
    display: block;
    padding: 0;
    margin: 0;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    transition: scale 0.2s cubic-bezier(0.19, 1, 0.22, 1);

    &:hover,
    &:focus-visible {
      scale: 1.05;
      outline: 2px solid var(--color-accent);
    }

    img {
      width: 100%;
      height: 100%;
      background-color: var(--color-text);
      object-fit: scale-down;
    }
  }
}

hr {
  margin: 0.25rem 0;
}

._source {
  // text-align: center;
  // text-transform: lowercase;
}

._itemBottom {
  padding: 0.5rem 1rem 0.5rem;
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  font-size: 0.8rem;
}
._measurements {
  // margin-bottom: 0.5rem;
}

._adjustments-recap {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);

  h4 {
    margin: 0 0 0rem 0;
    font-size: 0.85rem;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      font-size: 0.8rem;
      margin-top: 0;
      margin-bottom: 0.1rem;
      line-height: 1.2;
    }
  }
}
</style>
