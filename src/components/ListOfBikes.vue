<template>
  <div class="_listOfBikes">
    <span>{{ $t('message.click_on_bikes_in_this_list_to_compare_their_size') }}</span>
    <div class="_bikesPreview">
      <button
        type="button"
        class="_bikePreview"
        v-for="bike in bikes"
        :key="bike.id"
        @click="onBikePreviewClick(bike.id)"
      >
        <img
          loading="lazy"
          :src="getBikePreviewImage(bike)"
          :style="{
            '--scale-factor': 1 / bike.bike_length_percent + ''
          }"
        />
        <span class="_bikeName">{{ bike.manufacturer }} {{ bike.model }}</span>
      </button>
    </div>
  </div>
</template>
<script>
const bike_images_preview_urls = import.meta.glob('@/assets/bikes/*.png', {
  query: { format: 'webp', w: 800 }
})

export default {
  props: {
    bikes: Array
  },
  components: {},
  data() {
    return {
      bike_images_preview_urls: []
    }
  },
  created() {},
  async mounted() {
    this.bike_images_preview_urls = await this.$loadBikeImages(bike_images_preview_urls)
  },
  beforeUnmount() {},
  watch: {},
  computed: {},
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
._bikesPreview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  padding: 1rem;
  width: 100%;
}
._bikePreview {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 3/2;
  aspect-ratio: 1;
  height: 100%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  // background-color: white;
  border: 1px solid var(--color-border);

  padding: 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    transform: scale(var(--scale-factor));
  }

  ._bikeName {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem 1rem;
    background-color: rgba(255, 255, 255, 0.5);

    text-transform: initial;
  }
}
</style>
