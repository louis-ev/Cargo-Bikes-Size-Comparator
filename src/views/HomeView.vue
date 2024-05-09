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
          v-for="item in sorted_bikes"
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

          <div>
            <div>
              <strong>{{ item.model }}</strong>
            </div>
            <div>
              <small>{{ item.manufacturer }}</small>
            </div>
          </div>

          <div v-if="item.id">
            <img :src="'.' + item.src" />
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
export default {
  props: {
    bikes: Array
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
    sorted_bikes() {
      if (!this.bikes) return []
      return this.bikes
        .slice()
        .sort((a, b) => {
          if (this.enabled_bikes.includes(a.id)) return -1
          if (this.enabled_bikes.includes(b.id)) return 1
          return a
        })
        .sort((a, b) => {
          return a.bike_length_cm - b.bike_length_cm
        })
    }
  },
  methods: {
    findMatchingBike(id) {
      return this.bikes.find((i) => i.id === id)
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

      const padding = canvas.width / 10

      // factor to scale the image
      const factor = (canvas.width - padding * 2) / largest_bike.bike_length_cm

      const bottomLeft = {
        x: 70,
        y: canvas.height - 120
      }
      ctx.moveTo(bottomLeft.x, bottomLeft.y)

      for await (const id of this.enabled_bikes) {
        const bike = this.findMatchingBike(id)
        if (!bike?.src) continue

        const img = new Image()
        img.src = '.' + bike.src
        await img.decode()

        const img_ratio = img.width / img.height
        const draw_w = (bike.bike_length_cm / bike.bike_length_percent) * factor
        const draw_h = draw_w / img_ratio

        const draw_x = -bike.left_margin_percent * draw_w + padding

        const draw_y = canvas.height - padding / 2 - draw_h + bike.bottom_margin_percent * draw_h

        ctx.drawImage(img, draw_x, draw_y, draw_w, draw_h)
      }

      // repère
      // const radius = 5
      // ctx.beginPath()
      // ctx.arc(bottomLeft.x, bottomLeft.y, radius, 0, 2 * Math.PI)
      // ctx.fillStyle = 'red'
      // ctx.fill()
      // ctx.beginPath()
      // ctx.moveTo(bottomLeft.x, bottomLeft.y)
      // ctx.lineTo(bottomLeft.x, 0)
      // ctx.moveTo(bottomLeft.x, bottomLeft.y)
      // ctx.lineTo(canvas.width, bottomLeft.y)
      // ctx.strokeStyle = 'red'
      // ctx.stroke()
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
  background-color: var(--color-background);

  overflow-y: auto;
}

._canvasWrapper {
  overflow: hidden;
}

._bikeList {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.25rem;
  padding: 0.25rem 0;
}

._item {
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem;
  line-height: 1.2;
  background-color: white;

  cursor: pointer;

  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);

  &[data-disabled='true'] {
    border-style: dashed;
    color: #999;
  }

  &:hover:not([data-disabled='true']) {
    box-shadow: 0 0 0.15rem 0.15rem var(--color-accent);
  }

  &[data-active='true'] {
    // background-color: var(--color-accent);
    border-color: var(--color-accent);
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
