<template>
  <div class="_homeView">
    <div class="_canvasWrapper">
      <canvas ref="bikes" width="1920" height="1920" />
      <select v-model="canvas_composite_operation">
        <option v-for="operation in globalCompositeOperations" :key="operation" :value="operation">
          {{ operation }}
        </option>
      </select>
    </div>

    <transition-group tag="div" class="_bikeList" name="list">
      <label
        class="_item"
        v-for="item in sorted_cargo_data"
        :key="item.id"
        :for="item.id"
        :data-disabled="!findMatchingBike(item.id)"
        :data-active="enabled_bikes.includes(item.id)"
      >
        <input
          type="checkbox"
          :checked="enabled_bikes.includes(item.id)"
          :id="item.id"
          :disabled="!findMatchingBike(item.id)"
          @change="toggleBike(item.id)"
        />

        <div>
          {{ item.Model }}
          <small>{{ item.Manufacturer }}</small>
        </div>

        <div v-if="findMatchingBike(item.id)">
          <img :src="findMatchingBike(item.id).src" />
        </div>
      </label>
    </transition-group>
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
      ],

      canvas_composite_operation: 'darken',
      globalCompositeOperations: [
        'source-over',
        'source-in',
        'source-out',
        'source-atop',
        'destination-over',
        'destination-in',
        'destination-out',
        'destination-atop',
        'lighter',
        'copy',
        'xor',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity'
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
    },
    canvas_composite_operation: {
      handler(val) {
        this.showBikes()
      }
    }
  },
  computed: {
    sorted_cargo_data() {
      if (!this.cargo_data) return []
      return this.cargo_data.slice().sort((a, b) => {
        if (this.enabled_bikes.includes(a.id)) return -1
        if (this.enabled_bikes.includes(b.id)) return 1
        return a
      })
    }
  },
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
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = this.canvas_composite_operation

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

._canvasWrapper {
}

._bikeList {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.25rem;
  padding: 0 0.25rem;
}

._item {
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid currentColor;
  border-radius: 0.25rem;
  background-color: #fff;

  transition: background-color 0.5s ease;

  &[data-disabled='true'] {
    border-style: dashed;
    color: #999;
  }

  &:hover:not([data-disabled='true']) {
    border-color: #00ccc0;
  }

  &[data-active='true'] {
    background-color: #00ccc0;
    border-color: #00ccc0;
  }

  img {
    width: 50px;
  }
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
