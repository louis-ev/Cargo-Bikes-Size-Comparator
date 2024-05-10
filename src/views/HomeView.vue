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
          v-for="item in bikes"
          :key="item.id"
          :for="item.id"
          :data-active="enabled_bikes.includes(item.id)"
        >
          <div class="_itemTop">
            <input
              type="checkbox"
              :checked="enabled_bikes.includes(item.id)"
              :id="item.id"
              @change="toggleBike(item.id)"
            />

            <div class="_names">
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
          </div>

          <div class="_itemBottom" v-if="enabled_bikes.includes(item.id) && item._measurements">
            <small>{{ getMeasurements(item) }}</small>
          </div>
        </label>
      </transition-group>

      <details>
        <summary>Advanced</summary>
        <div>
          <label>Grid step (cm)</label>
          <input type="range" step="1" min="1" max="100" v-model.number="grid_step" />
        </div>
        <div>
          <label>Padding (%)</label>
          <input type="range" step="1" min="0" max="30" v-model.number="default_padding_percent" />
        </div>
      </details>
    </div>
    <div class="_canvasWrapper">
      <template v-if="enabled_bikes.length === 0"> Select bikes to compare </template>
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

      default_padding_percent: 10,
      grid_step: 20,

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
    },
    default_padding_percent: {
      handler(val) {
        this.showBikes()
      }
    },
    grid_step: {
      handler(val) {
        this.showBikes()
      }
    }
  },
  computed: {},
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

      // get largest bike image
      let largest_bike
      this.enabled_bikes.map((b) => {
        const bike = this.findMatchingBike(b)
        if (!largest_bike || largest_bike.bike_length_cm < bike.bike_length_cm) largest_bike = bike
      })

      if (!largest_bike) return

      const padding = canvas.width / (100 / this.default_padding_percent)
      const each_px_measures_in_cm = (canvas.width - padding * 2) / largest_bike.bike_length_cm

      ctx.strokeStyle = 'gray'
      ctx.fillStyle = 'black'

      let cm_count = 0
      const step = this.grid_step

      for (let x = padding; x <= canvas.width; x += each_px_measures_in_cm * step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()

        ctx.fillText(cm_count, x + 4, canvas.height - 10)
        cm_count += step
      }

      cm_count = 0
      for (let y = canvas.height - padding; y >= 0; y -= each_px_measures_in_cm * step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()

        ctx.fillText(cm_count, 0, y - 4)

        cm_count += step
      }

      ctx.globalCompositeOperation = this.canvas_composite_operation

      for await (const id of this.enabled_bikes) {
        const bike = this.findMatchingBike(id)
        if (!bike?.src) continue

        const img = new Image()
        img.src = '.' + bike.src
        await img.decode()

        const img_ratio = img.width / img.height
        const draw_w = (bike.bike_length_cm / bike.bike_length_percent) * each_px_measures_in_cm
        const draw_h = draw_w / img_ratio

        const draw_x = -bike.left_margin_percent * draw_w + padding

        const draw_y = canvas.height - padding - draw_h + bike.bottom_margin_percent * draw_h

        ctx.drawImage(img, draw_x, draw_y, draw_w, draw_h)
      }

      // repère
    },
    getMeasurements(bike) {
      return Object.entries(bike._measurements)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
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
}

._itemTop {
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  ._names {
    flex: 1 1 auto;
  }

  input {
    flex: 0 0 auto;
  }
  img {
    flex: 0 0 auto;
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
