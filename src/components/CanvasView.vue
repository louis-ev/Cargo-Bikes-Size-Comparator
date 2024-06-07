<template>
  <div class="_canvasWrapper">
    <div class="_noBikes" v-if="enabled_bikes.length === 0">
      <span>{{ $t('message.click_on_bikes_in_this_list_to_compare_their_size') }}</span>
    </div>
    <div class="_canvas">
      <div class="_canvasOptions">
        <label
          class="u-button _setImageStyle"
          :data-active="canvas_image_style_outline"
          for="canvas_image_style_outline"
        >
          <input
            type="checkbox"
            name="canvas_image_style_outline"
            id="canvas_image_style_outline"
            :checked="canvas_image_style_outline"
            @change="toggleOutlineView"
          />
          &nbsp;{{ $t('message.outline_view') }}
        </label>

        <!-- <div class="_activeBikes"> -->
        <button
          type="button"
          class="_activeBike"
          v-for="bike in sorted_enabled_bikes"
          :key="bike.id"
          :style="{ '--bike-color': `#${bike.color}` }"
        >
          <!-- <img class="_activeBikeImage" :src="getBikeFullImage(bike)" /> -->
          <BikeName :bike="bike" :show_length="false" />
        </button>
        <!-- </div> -->
      </div>
    </div>
    <canvas ref="bikes" width="1920" height="1920" />
    <canvas ref="offscreen_canvas" width="1920" height="1920" style="display: none" />
    <canvas ref="processor" width="1920" height="1920" style="display: none" />
  </div>
</template>
<script>
import { edge_detect, colorize } from '../helpers.js'
const bike_images_full_paths = import.meta.glob('@/assets/bikes/*.png', {
  query: { format: 'webp', w: 1600 }
})

export default {
  props: {
    enabled_bikes: Array,
    default_padding_percent: Number,
    grid_step: Number,
    bikes_position_adjustments: Object,
    canvas_image_style_outline: Boolean
  },
  components: {},
  data() {
    return {
      bike_images_full_paths: []
    }
  },
  created() {},
  async mounted() {
    this.bike_images_full_paths = await this.$loadBikeImages(bike_images_full_paths)

    this.showBikes()
    this.ro = new ResizeObserver(this.showBikes)
    if (this.$el) {
      this.ro.observe(this.$el)
    }
  },
  beforeUnmount() {
    this.ro.unobserve(this.$el)
  },
  watch: {
    canvas_image_style_outline() {
      setTimeout(() => {
        this.showBikes()
      }, 30)
    },
    bikes_position_adjustments: {
      handler() {
        this.showBikes()
      },
      deep: true
    },
    default_padding_percent() {
      this.showBikes()
    },
    grid_step() {
      this.showBikes()
    },
    enabled_bikes: {
      handler() {
        this.showBikes()
      },
      deep: true
    }
  },
  computed: {
    sorted_enabled_bikes() {
      return this.enabled_bikes
        .reduce((acc, bike) => {
          if (!bike?.src || !bike.bike_length_cm) return
          acc.push(bike)
          return acc
        }, [])
        .sort((a, b) => {
          return b?.bike_length_cm - a?.bike_length_cm
        })
    }
  },
  methods: {
    getBikeFullImage(bike) {
      if (bike.src?.startsWith('https')) return bike.src
      const full_path = this.bike_images_full_paths.find((i) => i.original_filename === bike.src)
      if (!full_path) return
      return full_path.url
    },
    async showBikes() {
      const canvas = this.$refs.offscreen_canvas
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
      this.enabled_bikes.map((bike) => {
        if (!largest_bike || largest_bike.bike_length_cm < bike.bike_length_cm) largest_bike = bike
      })
      // if (!largest_bike) return

      const padding = canvas.width / (100 / this.default_padding_percent)
      const each_px_measures_in_cm =
        (canvas.width - padding * 2) / (largest_bike?.bike_length_cm || 200)

      const line_0_color = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-text-secondary'
      )
      const line_color = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-gray-light'
      )

      const text_0_fill_color = line_0_color
      const text_fill_color = line_0_color

      let cm_count = 0
      const step = this.grid_step

      for (let x = padding; x <= canvas.width; x += each_px_measures_in_cm * step) {
        if (cm_count === 0) ctx.strokeStyle = line_0_color
        else ctx.strokeStyle = line_color

        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()

        const font_size = (canvas.parentNode.clientHeight / 80) * window.devicePixelRatio * 1
        ctx.font = `${font_size}px Inter`

        if (cm_count === 0) ctx.fillStyle = text_0_fill_color
        else ctx.fillStyle = text_fill_color

        ctx.fillText(cm_count, x + 4, canvas.height - 4)
        cm_count += step
      }

      cm_count = 0
      for (let y = canvas.height - padding; y >= 0; y -= each_px_measures_in_cm * step) {
        if (cm_count === 0) ctx.strokeStyle = line_0_color
        else ctx.strokeStyle = line_color

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()

        if (cm_count === 0) ctx.fillStyle = text_0_fill_color
        else ctx.fillStyle = text_fill_color

        ctx.fillText(cm_count, 0 + 4, y - 4)

        cm_count += step
      }

      if (this.canvas_image_style_outline) {
        ctx.globalCompositeOperation = 'multiply'
      } else {
        ctx.globalCompositeOperation = 'source-over'
      }

      for (const bike of this.sorted_enabled_bikes) {
        console.log('drawing bike', bike.id)
        const img = new Image()

        img.src = this.getBikeFullImage(bike)
        await img.decode()

        const img_ratio = img.width / img.height
        const draw_w = (bike.bike_length_cm / bike.bike_length_percent) * each_px_measures_in_cm
        const draw_h = draw_w / img_ratio

        let user_horizontal_adjustment = this.bikes_position_adjustments[bike.id] / 100 || 0
        const draw_x = -(bike.left_margin_percent - user_horizontal_adjustment) * draw_w + padding
        const draw_y = canvas.height - padding - draw_h + bike.bottom_margin_percent * draw_h

        if (this.canvas_image_style_outline) {
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
          let color = bike.color
          colorize(processorCanvas, color)

          ctx.drawImage(processorCanvas, 0, 0, processorCanvas.width, processorCanvas.height)
        } else {
          ctx.drawImage(img, draw_x, draw_y, draw_w, draw_h)
        }
      }

      const visible_canvas = this.$refs.bikes
      visible_canvas.width = canvas.width
      visible_canvas.height = canvas.height
      visible_canvas.getContext('2d').drawImage(canvas, 0, 0, canvas.width, canvas.height)
    },
    toggleOutlineView($event) {
      let query = JSON.parse(JSON.stringify(this.$route.query)) || {}

      if (!$event.target.checked) delete query.outline
      else query.outline = '1'

      this.$router.push({
        query
      })
    }
  }
}
</script>
<style lang="scss" scoped>
canvas {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  object-position: left center;
}
._canvasWrapper {
  position: relative;
  overflow: hidden;
  min-width: 420px;
  height: 100%;

  padding: 1rem;
  // margin-left: 0;
  // border: 1px solid #ccc;
}
._canvas {
  // margin: 2rem;
}
._noBikes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;

  span {
    background-color: #fff;
    padding: 0.5rem;
    border-radius: 0.5rem;
  }
}

._canvasOptions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  padding: 0.5rem 0;
  padding-left: 3rem;

  overflow-x: auto;

  display: flex;
  flex-direction: row nowrap;
  justify-content: flex-start;

  gap: 0.5rem;

  > * {
    pointer-events: auto;
  }
}
// ._activeBikes {
//   top: auto;
//   bottom: 0;
//   // background-color: red;
//   padding: 0.5rem;
//   border-radius: 0.5rem;

//   display: flex;
//   flex-direction: row wrap;
//   justify-content: center;
//   gap: 0.5rem;
// }

._activeBike {
  flex: 0 0 25ch;
  height: auto;
  border-radius: 0.5rem;

  padding: 0.12rem 0.5rem 0.25rem;
  // background-color: var(--color-accent);
  background-color: white;
  border-bottom: 2px solid var(--bike-color);
  // backdrop-filter: blur(5px);
  // text-align: center;

  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

._setImageStyle {
  // display: flex;
  // flex-direction: row nowrap;
  // align-items: center;
  // justify-content: center;
  white-space: nowrap;
  gap: 0.5rem;
  pointer-events: auto;
  background-color: var(--color-text);
  // background-color: #fff;
  // color: var(--color-text);
  color: white;
  // border: 2px solid var(--color-text);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;

  &:hover,
  &:focus-visible,
  &[data-active='true'] {
    background-color: var(--color-accent);
    color: black;
  }
}
</style>
