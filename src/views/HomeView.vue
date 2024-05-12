<template>
  <div class="_homeView">
    <div class="_sidebar">
      <h1>Cargo Bikes<br />Size Comparator</h1>
      <div class="_infos">
        <small v-if="enabled_bikes.length <= 1">
          Click on bikes in this list to compare their size :
        </small>
        <small v-else>
          <button class="_reset" @click="resetBikes">Reset</button>
        </small>
      </div>

      <transition-group tag="div" class="_bikeList" name="list">
        <div
          class="_item"
          v-for="item in bikes"
          :key="item.id"
          :data-active="enabled_bikes.includes(item.id)"
        >
          <label :for="item.id" class="_itemTop">
            <input
              type="checkbox"
              :checked="enabled_bikes.includes(item.id)"
              :id="item.id"
              @change="toggleBike(item.id)"
            />

            <div class="_names">
              <strong>{{ item.model }}</strong>
              <template v-if="item.manufacturer">
                <small> – {{ item.manufacturer }}</small>
              </template>
              <br />
              <small>{{ item.bike_length_cm }} cm</small>
            </div>

            <div v-if="item.id">
              <img :src="'.' + item.src" />
            </div>
          </label>

          <div class="_itemBottom" v-if="enabled_bikes.includes(item.id)">
            <div class="_measurements" v-if="item._measurements">
              <small v-html="getMeasurements(item)" />
              <br />
            </div>
            <a :href="item.url" target="_blank"> <span>&#8594;</span>website</a>
          </div>
        </div>
      </transition-group>

      <details>
        <summary>Advanced options</summary>
        <div class="_advanced">
          <label>Grid step (cm)</label>
          <input type="range" step="1" min="1" max="100" v-model.number="grid_step" />
        </div>
        <div class="_advanced">
          <label>Padding (%)</label>
          <input type="range" step="1" min="0" max="30" v-model.number="default_padding_percent" />
        </div>
        <div class="_advanced">
          <label>Layer blending</label>
          <select v-model="canvas_composite_operation">
            <option
              v-for="operation in globalCompositeOperations"
              :key="operation"
              :value="operation"
            >
              {{ operation }}
            </option>
          </select>
          <button @click="prevGlobalCompositeOperation">-</button>
          <button @click="nextGlobalCompositeOperation">+</button>
        </div>
        <div class="_advanced">
          <label>Image style</label>
          <select v-model="canvas_image_style">
            <option value="photo">Photo</option>
            <option value="line">Outline</option>
          </select>
        </div>
      </details>

      <div class="_madeBy">
        <div>
          <a href="mailto:hello@louiseveillard.com" target="_blank">Questions/feedbacks</a>
        </div>
        <hr />
        <div>
          Made by <a href="https://louiseveillard.com/" target="_blank">Louis Eveillard</a> in
          Nantes (FR)
        </div>
        <div>
          Specific measures taken from
          <a
            href="https://docs.google.com/spreadsheets/d/1vPCfYStt8fXQQtYDFfNS70kR8B2V2dDwAs_r0VlUlWw/"
            target="_blank"
          >
            this document
          </a>
        </div>
        <div>
          Source code
          <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator" target="_blank">
            available on Github
          </a>
        </div>
        <div>
          Code/design
          <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" target="_blank"
            >free, open-source under AGPL v3</a
          >
        </div>
      </div>
    </div>
    <div class="_canvasWrapper">
      <div class="_noBikes" v-if="enabled_bikes.length === 0">
        <small>Click on two bikes or more in the sidebar to compare their size</small>
      </div>
      <canvas ref="bikes" width="1920" height="1920" />
      <canvas ref="processor" width="1920" height="1920" style="display: none" />
    </div>
  </div>
</template>
<script>
import { edge_detect, colorize } from '../helpers.js'
export default {
  props: {
    bikes: Array
  },
  components: {},
  data() {
    return {
      ro: null,

      default_padding_percent: 5,
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
      ],

      canvas_image_style: 'photo'
    }
  },
  created() {},
  mounted() {
    this.showBikes()
    this.ro = new ResizeObserver(this.showBikes)
    this.ro.observe(this.$el)
  },
  beforeUnmount() {
    this.ro.unobserve(this.$el)
  },
  watch: {
    enabled_bikes: {
      handler() {
        this.showBikes()
      },
      deep: true
    },
    canvas_composite_operation: {
      handler() {
        this.showBikes()
      }
    },
    canvas_image_style: {
      handler() {
        // could add these defaults in if desired
        // if (this.canvas_image_style === 'line') {
        //   this.canvas_composite_operation = 'multiply'
        // } else {
        //   this.canvas_composite_operation = 'source-over'
        // }
        this.showBikes()
      }
    },
    default_padding_percent: {
      handler() {
        this.showBikes()
      }
    },
    grid_step: {
      handler() {
        this.showBikes()
      }
    }
  },
  computed: {
    enabled_bikes() {
      if (this.$route.query.bikes) {
        try {
          return JSON.parse(this.$route.query.bikes)
        } catch (e) {
          return []
        }
      }
      return []
    }
  },
  methods: {
    findMatchingBike(id) {
      return this.bikes.find((i) => i.id === id)
    },
    resetBikes() {
      this.$router.push({
        query: {}
      })
    },
    toggleBike(id) {
      let enabled_bikes = this.enabled_bikes
      if (enabled_bikes.includes(id)) {
        enabled_bikes = enabled_bikes.filter((i) => i !== id)
      } else {
        enabled_bikes.push(id)
      }
      this.$router.push({
        query: {
          bikes: JSON.stringify(enabled_bikes)
        }
      })
    },
    async showBikes() {
      const canvas = this.$refs.bikes
      if (!canvas) return

      canvas.width = Math.min(
        canvas.parentNode.clientWidth * window.devicePixelRatio,
        canvas.parentNode.clientHeight * window.devicePixelRatio * 1.5
      )
      canvas.height = Math.min(
        canvas.parentNode.clientHeight * window.devicePixelRatio,
        canvas.width
      )

      const ctx = canvas.getContext('2d')
      ctx.globalCompositeOperation = 'source-over'

      // bg
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-background'
      )
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = '#ccc'
      ctx.strokeWidth = 1
      ctx.strokeRect(1, 1, canvas.width - 1, canvas.height - 1)

      // get largest bike image
      let largest_bike
      this.enabled_bikes.map((b) => {
        const bike = this.findMatchingBike(b)
        if (!largest_bike || largest_bike.bike_length_cm < bike.bike_length_cm) largest_bike = bike
      })

      if (!largest_bike) return

      const padding = canvas.width / (100 / this.default_padding_percent)
      const each_px_measures_in_cm = (canvas.width - padding * 2) / largest_bike.bike_length_cm

      ctx.strokeStyle = '#ccc'
      ctx.fillStyle = '#999'

      let cm_count = 0
      const step = this.grid_step

      for (let x = padding; x <= canvas.width; x += each_px_measures_in_cm * step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()

        const font_size = (canvas.parentNode.clientHeight / 80) * window.devicePixelRatio * 1
        ctx.font = `${font_size}px Inter`

        ctx.fillText(cm_count, x + 4, canvas.height - 4)
        cm_count += step
      }

      cm_count = 0
      for (let y = canvas.height - padding; y >= 0; y -= each_px_measures_in_cm * step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()

        ctx.fillText(cm_count, 0 + 4, y - 4)

        cm_count += step
      }

      ctx.globalCompositeOperation = this.canvas_composite_operation

      const sorted_enabled_bikes = this.enabled_bikes.sort((a, b) => {
        return this.findMatchingBike(b).bike_length_cm - this.findMatchingBike(a).bike_length_cm
      })

      for await (const id of sorted_enabled_bikes) {
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

        if (this.canvas_image_style === 'line') {
          // Offscreen canvas for edge detection on the image
          const processorCanvas = this.$refs.processor
          if (!processorCanvas) return

          processorCanvas.width = Math.min(
            processorCanvas.parentNode.clientWidth * window.devicePixelRatio,
            processorCanvas.parentNode.clientHeight * window.devicePixelRatio * 1.5
          )
          processorCanvas.height = Math.min(
            processorCanvas.parentNode.clientHeight * window.devicePixelRatio,
            processorCanvas.width
          )

          const processorCtx = processorCanvas.getContext('2d')
          processorCtx.globalCompositeOperation = 'source-over'

          // white BG for a clean edge detect result
          processorCtx.fillStyle = 'white'
          processorCtx.fillRect(0, 0, canvas.width, canvas.height)
          processorCtx.drawImage(img, draw_x, draw_y, draw_w, draw_h)

          // detect edges
          edge_detect(processorCanvas)

          // colorize
          const color_options = ['11bb11', '3333ff', 'bbbb00', 'ff0000', 'ff00ff', '00bbbbb']
          // find the index of the current bike
          const index = this.enabled_bikes.indexOf(bike.id)
          const color = color_options[index % color_options.length]
          colorize(processorCanvas, color)

          ctx.drawImage(processorCanvas, 0, 0, processorCanvas.width, processorCanvas.height)
        } else {
          ctx.drawImage(img, draw_x, draw_y, draw_w, draw_h)
        }
      }

      // repère
    },
    getMeasurements(bike) {
      return Object.entries(bike._measurements)
        .reduce((acc, [k, v]) => {
          if (k && k !== '\r' && v && v !== '\r') acc.push(`${k}: ${v}`)
          return acc
        }, [])
        .join('<br>')
    },
    prevGlobalCompositeOperation() {
      const index = this.globalCompositeOperations.indexOf(this.canvas_composite_operation)
      this.canvas_composite_operation = this.globalCompositeOperations[index - 1]
    },
    nextGlobalCompositeOperation() {
      const index = this.globalCompositeOperations.indexOf(this.canvas_composite_operation)
      this.canvas_composite_operation = this.globalCompositeOperations[index + 1]
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
  max-width: 100%;
  height: auto;
}

h1 {
  font-weight: 800;
}

._sidebar {
  flex: 0 0 auto;
  width: 320px;
  padding: 1rem;
  background-color: var(--color-background);

  overflow-y: auto;
}

._canvasWrapper {
  flex: 1 1 auto;
  overflow: hidden;
  min-width: 420px;
  margin: 1rem;
  margin-left: 0;
  // border: 1px solid #ccc;
}
._noBikes {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;

  // font-weight: 400;
  text-transform: lowercase;
  color: #999;
}

._bikeList {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

._item {
  line-height: 1.2;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;

  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);

  &[data-active='true'] ._itemTop {
    background-color: var(--color-accent);
  }

  &:hover,
  &:focus-visible {
    // box-shadow: 0 0.05rem 0.2rem 0rem var(--color-accent);
  }
}

._itemTop {
  padding: 0.25rem 1rem;
  cursor: pointer;
  border-radius: 0.5rem;

  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  input {
    cursor: pointer;
  }

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

  &:hover,
  &:focus-visible {
    background-color: var(--color-accent);
  }
}

._advanced {
  display: flex;
  flex-direction: row nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  margin-bottom: 0.25rem;
}

._itemBottom {
  padding: 0.5rem 1rem 1rem;
}
._measurements {
  margin-bottom: 0.5rem;
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

._madeBy {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #999;

  hr {
    margin: 1rem 0;

    border: none;
    border-top: 1px solid #ccc;
  }
}

._reset {
  padding: 0 0.25rem;

  cursor: pointer;
}
</style>
