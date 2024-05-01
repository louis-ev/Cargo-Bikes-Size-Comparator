<template>
  <div class="_homeView">
    <canvas ref="bikes" width="1280" height="960" />

    <div class="_bike_list">
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
      enabled_bikes: [
        'Carrie/Riese und Müller',
        'Cargo/Chike',
        'Muli/Muli Cycles',
        'Load 75/Riese and Muller'
      ]
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
      ctx.globalCompositeOperation = 'darken' // AKA add / linear-dodge

      // get largest bike image
      let largest_bike
      this.enabled_bikes.map((b) => {
        const bike = this.findMatchingBike(b)
        if (!largest_bike || largest_bike.bike_length_cm < bike.bike_length_cm) largest_bike = bike
      })

      // factor to scale the image
      const factor = canvas.width / largest_bike.bike_length_cm
      const padding_percent = 0.1

      for await (const id of this.enabled_bikes) {
        const bike = this.findMatchingBike(id)
        if (!bike?.src) return
        const img = new Image()
        img.src = bike.src
        await img.decode()

        const img_ratio = img.width / img.height
        const draw_w = (bike.bike_length_cm / (bike.bike_length_percent + padding_percent)) * factor
        const draw_h = draw_w / img_ratio

        const left_margin = (-bike.left_margin_percent + padding_percent / 2) * draw_w
        const bottom_margin = bike.bottom_margin_percent * draw_h
        const draw_y = (canvas.height - draw_h) / 2 - bottom_margin

        ctx.drawImage(img, left_margin, draw_y, draw_w, draw_h)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
._homeView {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  canvas {
    flex: 1 1 auto;
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
