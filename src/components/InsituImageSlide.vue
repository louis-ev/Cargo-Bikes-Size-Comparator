<template>
  <BasicModal
    :size="'full'"
    :has_nav="true"
    @prev="$emit('prevImage')"
    @next="$emit('nextImage')"
    @close="$emit('close')"
  >
    <template v-slot:header>
      <div class="_header">
        <div>{{ $t('message.picture_from') }} {{ from }}</div>
        <div>{{ index + 1 }}/{{ bike_images_full_urls.length }}</div>
      </div>
    </template>
    <template v-slot:content>
      <div class="_img">
        <transition name="fade" mode="out-in">
          <img v-if="current_img" :key="current_img.url" class="" :src="current_img.url" />
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
    bike: {
      type: Object,
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
    this.bike_images_full_urls = await this.loadAllInsituFull()
  },
  mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {
    current_img() {
      return this.bike_images_full_urls[this.index] || false
    },
    from() {
      return this.bike.insitu[this.index].from || this.$t('message.unknown')
    }
  },
  methods: {
    async loadAllInsituFull() {
      const urls = []
      for (let [source, thumb] of Object.entries(insitu_images_full_paths)) {
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
