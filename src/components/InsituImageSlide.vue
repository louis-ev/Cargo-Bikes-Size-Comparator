<template>
  <BasicModal
    :size="'full'"
    :has_nav="insitu.length > 1"
    @prev="$emit('prevImage')"
    @next="$emit('nextImage')"
    @close="$emit('close')"
  >
    <template v-slot:header>
      <div class="_header">
        <div>
          <template v-if="current_insitu.url">
            {{ $t('message.picture_from') }}
            <a :href="current_insitu.url" target="_blank">{{ current_insitu.from }}</a>
          </template>
          <template v-else> {{ $t('message.picture_from') }} {{ current_insitu.from }} </template>
        </div>
        <div>{{ index + 1 }}/{{ insitu.length }}</div>
      </div>
    </template>
    <template v-slot:content>
      <div class="_img">
        <transition name="fade" mode="out-in">
          <img
            v-if="current_insitu.src"
            :key="current_insitu.src"
            class=""
            :src="current_insitu.src"
          />
        </transition>
      </div>
    </template>
  </BasicModal>
</template>
<script>
import BasicModal from '@/components/BasicModal.vue'

const insitu_images_full_paths = import.meta.glob('@/assets/insitu/*', {
  query: { format: 'webp', w: 1920 }
})

export default {
  props: {
    insitu: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  components: { BasicModal },
  data() {
    return {
      bike_images_full_urls: []
    }
  },
  async created() {
    this.bike_images_full_urls = await this.$loadBikeImages(insitu_images_full_paths)
  },
  mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {
    current_insitu() {
      const _insitu = this.insitu[this.index]
      return {
        src: this.getImgFullUrl(_insitu.src),
        from: _insitu.from || this.$t('message.unknown'),
        url: _insitu.url
      }
    }
  },
  methods: {
    getImgFullUrl(src) {
      return this.bike_images_full_urls.find((img) => img.original_filename === src)?.url
    }
  }
}
</script>
<style lang="scss" scoped>
._img {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #111;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

._header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
