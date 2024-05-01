<template>
  <div class="_homeView">
    <canvas ref="bikes" width="1280" height="720" />

    {{ enabled_bikes }}

    <label
      class="_item"
      v-for="item in cargo_data"
      :key="item.id"
      :for="item.id"
      :data-active="enabled_bikes.includes(item.id)"
    >
      <input
        type="checkbox"
        :checked="enabled_bikes.includes(item.id)"
        :id="item.id"
        @change="toggleBike(item.id)"
      />

      <strong>{{ item.Manufacturer }}</strong> / {{ item.Model }}
      {{ item['Overall length (cm)'] }}
      <div v-if="findMatchingBike(item.id)">
        <img :src="findMatchingBike(item.id).src" />
      </div>
    </label>
  </div>
</template>
<script>
import bikes from '@/assets/bike_images.json'

export default {
  props: {
    cargo_data: Array
  },
  components: {},
  data() {
    return {
      enabled_bikes: ['Cargo/Chike', 'Muli/Muli Cycles']
    }
  },
  created() {},
  mounted() {
    this.showBikes()
  },
  beforeUnmount() {},
  watch: {
    enabled_bikes: {
      handler() {
        this.showBikes()
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    findMatchingBike(id) {
      return bikes.find((i) => i.id === id)
    },
    toggleBike(id) {
      if (this.enabled_bikes.includes(id)) {
        this.enabled_bikes = this.enabled_bikes.filter((i) => i !== id)
      } else {
        this.enabled_bikes.push(id)
      }
    },
    async showBikes() {
      const canvas = this.$refs.bikes
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'beige'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // get largest bike image
      const max_bike_length = Math.max(
        ...this.enabled_bikes.map((b) => {
          const bike = this.findMatchingBike(b)
          return bike?.bike_length_cm || 0
        })
      )

      // factor to scale the image
      const factor = canvas.width / max_bike_length

      for await (const id of this.enabled_bikes) {
        const bike_image = this.findMatchingBike(id)
        if (!bike_image?.src) return
        const img = new Image()
        img.src = bike_image.src
        await img.decode()

        const img_ratio = img.width / img.height
        const draw_w = bike_image.bike_length_cm * factor
        const draw_h = draw_w / img_ratio

        const left_margin = bike_image.left_margin_percent * draw_w
        const top_margin = bike_image.bottom_margin_percent * draw_h

        ctx.drawImage(img, -left_margin, 0, draw_w, draw_h)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
._homeView {
  canvas {
    width: 100%;
    height: auto;
  }
}
._item {
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  gap: 0.5rem;

  &[data-active='true'] {
    background-color: red;
  }

  img {
    width: 100px;
  }
}
</style>
