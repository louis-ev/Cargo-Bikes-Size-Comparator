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
        }}
      </template>
    </div>

    <div v-if="bike.comment_en" v-html="bike.comment_en" />

    <div class="_adjust">
      <small>
        <div class="_adjustInput">
          <label>{{ $t('message.position') }}</label>
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

          <div class="_resetPosition">
            <button
              type="button"
              class="noStyle"
              @click="resetBikePosition(bike.id)"
              :aria-label="$t('message.reset')"
              :disabled="!bikes_position_adjustments.hasOwnProperty(bike.id)"
            >
              &#8630;
            </button>
          </div>
        </div>
      </small>
    </div>

    <div class="_measurements" v-if="bike._measurements">
      <small v-html="getMeasurements(bike)" />
      <br />
    </div>

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

    <hr />

    <div class="_source">
      <a :href="bike.url" target="_blank">
        <span>&#8594;</span> {{ $t('message.open_product_page') }}</a
      >
    </div>

    <InsituImageSlide
      v-if="show_full_image_index !== null"
      :insitu="bike.insitu"
      :index="show_full_image_index"
      @close="hideFullImage"
      @prevImage="prevImage"
      @nextImage="nextImage"
    />
  </div>
</template>
<script>
import InsituImageSlide from '@/components/InsituImageSlide.vue'

const insitu_images_thumbs_paths = import.meta.glob('@/assets/insitu/*', {
  query: { format: 'webp', w: 100 }
})

export default {
  props: {
    bike: {
      type: Object,
      required: true
    },
    bikes_position_adjustments: {
      type: Object,
      required: true
    }
  },
  components: {
    InsituImageSlide
  },
  data() {
    return {
      bike_images_thumbs_urls: [],
      show_full_image_index: null
    }
  },
  async created() {
    this.bike_images_thumbs_urls = await this.loadAllInsituThumbs()
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
  computed: {},
  methods: {
    async loadAllInsituThumbs() {
      const urls = []
      for (let [source, thumb] of Object.entries(insitu_images_thumbs_paths)) {
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
  text-align: center;
  text-transform: lowercase;
}

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
._itemBottom {
  padding: 0.5rem 1rem 1rem;
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
}
._measurements {
  margin-bottom: 0.5rem;
}
</style>
