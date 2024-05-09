<template>
  <div class="_homeView">
    <div class="_sidebar">
      <select v-model="canvas_composite_operation">
        <option v-for="operation in globalCompositeOperations" :key="operation" :value="operation">
          {{ operation }}
        </option>
      </select>
      <transition-group tag="div" class="_bikeList" name="list">
        <label
          class="_item"
          v-for="item in sorted_cargo_data"
          :key="item.id"
          :for="item.id"
          :data-disabled="!findMatchingBike(item.id)"
          :data-active="enabled_bikes.includes(item.id)"
          v-show="findMatchingBike(item.id)"
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
            <img :src="'.' + findMatchingBike(item.id).src" />
          </div>
        </label>
      </transition-group>
    </div>
    <div class="_canvasWrapper">
      <canvas ref="bikes" width="1920" height="1920" />
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
      enabled_bikes: [],

      canvas_composite_operation: 'source-over',
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
  created() {
    const enabled_bikes = localStorage.getItem('enabled_bikes')
    if (enabled_bikes) this.enabled_bikes = JSON.parse(enabled_bikes)
  },
  mounted() {
    this.showBikes()
  },
  beforeUnmount() {},
  watch: {
    enabled_bikes: {
      handler() {
        localStorage.setItem('enabled_bikes', JSON.stringify(this.enabled_bikes))
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
      if (!canvas) return

      canvas.height = canvas.parentNode.clientHeight
      canvas.width = canvas.parentNode.clientWidth

      const ctx = canvas.getContext('2d')
      ctx.globalCompositeOperation = 'source-over'

      // bg
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-background'
      )
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const gridSpacing = 20
      const gridColor = '#ffffff'

      for (let x = 1; x <= canvas.width; x += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.strokeStyle = gridColor
        ctx.stroke()
      }

      // Dessiner les lignes horizontales
      for (let y = 1; y <= canvas.height; y += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.strokeStyle = gridColor
        ctx.stroke()
      }

      ctx.globalCompositeOperation = this.canvas_composite_operation

      // get largest bike image
      let largest_bike
      this.enabled_bikes.map((b) => {
        const bike = this.findMatchingBike(b)
        if (!largest_bike || largest_bike.bike_length_cm < bike.bike_length_cm) largest_bike = bike
      })

      if (!largest_bike) return

      // factor to scale the image
      const factor = canvas.width / largest_bike.bike_length_cm
      const padding_percent = 0

      const bottomLeft = {
        x: 70,
        y: canvas.height - 120
      }
      ctx.moveTo(bottomLeft.x, bottomLeft.y)

      for await (const id of this.enabled_bikes) {
        const bike = this.findMatchingBike(id)
        if (!bike?.src) return
        const img = new Image()
        img.src = '.' + bike.src
        await img.decode()

        const img_ratio = img.width / img.height
        const draw_w = (bike.bike_length_cm / (bike.bike_length_percent + padding_percent)) * factor
        const draw_h = draw_w / img_ratio

        const left_margin = -bike.left_margin_percent * draw_w
        // const bottom_margin = -bike.bottom_margin_percent * draw_h
        // const bottom_margin = -bike.bottom_margin_percent * draw_h
        const draw_y = (canvas.height - draw_h) / 2 - 0 //bottom_margin

        ctx.drawImage(img, left_margin, draw_y, draw_w, draw_h)
      }

      // repère
      const radius = 5
      ctx.beginPath()
      ctx.arc(bottomLeft.x, bottomLeft.y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(bottomLeft.x, bottomLeft.y)
      ctx.lineTo(bottomLeft.x, 0)
      ctx.moveTo(bottomLeft.x, bottomLeft.y)
      ctx.lineTo(canvas.width, bottomLeft.y)
      ctx.strokeStyle = 'red'
      ctx.stroke()
    }
  }
}
</script>
<style lang="scss" scoped>
._homeView {
  display: flex;
  flex-flow: row nowrap;
  height: 100svh;
}
canvas {
  width: 100%;
  height: auto;
}

._sidebar {
  flex: 0 0 auto;
  width: 320px;
  padding: 1rem;
  background-color: #eee;

  overflow-y: auto;
}

._canvasWrapper {
  overflow: hidden;
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
