<template>
  <div class="_canvasWrapper">
    <!-- <div class="_noBikes" v-if="enabled_bikes.length === 0">
      <span>{{
        $t('message.click_on_bikes_in_this_list_to_compare_their_size', {
          count: bikes.length
        })
      }}</span>
    </div> -->

    <transition name="showPreview" mode="in-out">
      <div v-if="preview_bike" :key="preview_bike" class="_previewBikeWrapper">
        <div class="_previewBikeOverlay" />
        <img :key="preview_bike" :src="preview_bike" />
      </div>
    </transition>

    <div class="_canvasOptions">
      <button
        class="_openSidebar"
        :class="{ 'is--active': show_sidebar }"
        @click="$emit('toggleSidebar')"
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 18L20 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M4 12L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M4 6L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>

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
      <label
        class="u-button _setImageStyle"
        :data-active="show_human_silhouette"
        for="show_human_silhouette"
      >
        <input
          type="checkbox"
          name="show_human_silhouette"
          id="show_human_silhouette"
          :checked="show_human_silhouette"
          @change="toggleHumanSilhouette"
        />
        &nbsp;{{ $t('message.show_human_silhouette') }}
        <fieldset v-if="show_human_silhouette" class="_humanSilhouetteHeight" @click.stop="">
          <input
            type="number"
            class=""
            ref="human_silhouette_height_input"
            v-model.number="new_human_silhouette_height"
          />
          cm
          <button
            type="button"
            class=""
            v-if="new_human_silhouette_height !== human_silhouette_height"
            @click="updateHeight"
          >
            ✓
          </button>
        </fieldset>
      </label>

      <label
        class="u-button _setImageStyle"
        :data-active="show_regular_bike_silhouette"
        for="show_regular_bike_silhouette"
      >
        <input
          type="checkbox"
          name="show_regular_bike_silhouette"
          id="show_regular_bike_silhouette"
          :checked="show_regular_bike_silhouette"
          @change="toggleRegularBikeSilhouette"
        />
        &nbsp;{{ $t('message.show_regular_bike_silhouette') }}
      </label>

      <transition-group name="fade_fast">
        <button
          type="button"
          class="_activeBike"
          v-for="bike in reversed_sorted_enabled_bikes"
          :key="bike.id"
          :data-showcolor="canvas_image_style_outline"
          :style="{ '--bike-color': `#${bike.color}` }"
          @click="unselectBike(bike.id)"
        >
          <!-- <img class="_activeBikeImage" :src="getBikeFullImage(bike)" /> -->
          <span class="_activeBike--name">
            <BikeName :bike="bike" :show_length="false" />
          </span>
          <span class="_activeBike--remove">–</span>
        </button>
      </transition-group>
    </div>
    <small class="_downloadCanvas">
      <button type="button" class="" @click="downloadCanvas">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0">
          <path
            d="m54.168 12.5c0-2.3008-1.8672-4.168-4.168-4.168s-4.168 1.8672-4.168 4.168v39.938l-13.715-13.719c-1.6289-1.6289-4.2656-1.6289-5.8945 0-1.625 1.6289-1.625 4.2656 0 5.8906l20.715 20.715c0.75781 0.82422 1.8516 1.3438 3.0625 1.3438 0.62891 0 1.2227-0.14062 1.7539-0.38672 0.43359-0.20312 0.83984-0.48047 1.1953-0.83594l20.832-20.836c1.6289-1.625 1.6289-4.2617 0-5.8906-1.625-1.6289-4.2656-1.6289-5.8906 0l-13.723 13.723zm-41.668 45.828c2.3008 0 4.168 1.8672 4.168 4.168v16.664c0 1.1055 0.4375 2.168 1.2188 2.9492s1.8398 1.2188 2.9453 1.2188h58.336c1.1055 0 2.1641-0.4375 2.9453-1.2188s1.2188-1.8438 1.2188-2.9492v-16.664c0-2.3008 1.8672-4.168 4.168-4.168s4.168 1.8672 4.168 4.168v16.664c0 3.3164-1.3164 6.4961-3.6641 8.8398-2.3438 2.3438-5.5234 3.6602-8.8359 3.6602h-58.336c-3.3125 0-6.4922-1.3164-8.8359-3.6602-2.3477-2.3438-3.6641-5.5234-3.6641-8.8398v-16.664c0-2.3008 1.8672-4.168 4.168-4.168z"
            fill-rule="evenodd"
          />
        </svg>
        {{ $t('message.download_comparison') }}
      </button>
    </small>
    <transition name="loader">
      <div class="_loader" v-if="is_loading">
        <span class="_loaderAnimation">
          <span class="loader" />
        </span>
      </div>
    </transition>
    <canvas ref="bikes" width="1920" height="1920" class="_previewCanvas" />
    <canvas ref="offscreen_canvas" width="1920" height="1920" style="display: none" />
    <canvas ref="processor" width="1920" height="1920" style="display: none" />
  </div>
</template>
<script>
import { edge_detect, colorize } from '../helpers.js'
const bike_images_full_paths = import.meta.glob('@/assets/bikes/*.png', {
  eager: true,
  import: 'default',
  query: { format: 'webp', w: 1600 }
})
import bakkieUrl from '@/assets/accessories/bakkie.png?w=800;webp&as=src'

export default {
  props: {
    enabled_bikes: Array,
    bikes: Array,
    default_padding_percent: Number,
    grid_step: Number,
    bikes_adjustments: Object,
    canvas_image_style_outline: Boolean,
    show_sidebar: Boolean
  },
  components: {},
  data() {
    return {
      is_loading: true,
      bike_images_full_paths: [],
      show_human_silhouette: false,
      human_silhouette_height: 180,
      new_human_silhouette_height: 180,

      show_regular_bike_silhouette: false
    }
  },
  created() {},
  async mounted() {
    this.bike_images_full_paths = await this.$loadBikeImages2(bike_images_full_paths)

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
    bikes_adjustments: {
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
    human_silhouette_height() {
      this.showBikes()
    },
    reversed_sorted_enabled_bikes: {
      handler() {
        this.showBikes()
      },
      deep: true
    },
    show_human_silhouette() {
      this.showBikes()
    },
    show_regular_bike_silhouette() {
      this.showBikes()
    },
    '$root.draw_rect_in_canvas': {
      handler() {
        this.showBikes()
      },
      deep: true
    },
    '$root.accessories_in_canvas': {
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
        .reverse()
      // .sort((a, b) => {
      //   if (!this.canvas_image_style_outline) {
      //     if (this.$preview_bike.id === a.id) return 1
      //     if (this.$preview_bike.id === b.id) return -1
      //   }
      //   return b?.bike_length_cm - a?.bike_length_cm
      // })
    },
    reversed_sorted_enabled_bikes() {
      return this.sorted_enabled_bikes.slice().reverse()
    },
    preview_bike() {
      if (!this.$preview_bike.id) return
      if (this.enabled_bikes.find((bike) => bike.id === this.$preview_bike.id)) return
      const previewed_bike = this.bikes.find((bike) => bike.id === this.$preview_bike.id)
      return this.getBikeFullImage(previewed_bike)
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
      this.is_loading = true

      await new Promise((resolve) => setTimeout(resolve, 100))

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

      // get largest bike image
      let largest_bike

      if (this.show_regular_bike_silhouette) largest_bike = 178

      this.enabled_bikes.map((bike) => {
        if (!largest_bike || largest_bike < bike.bike_length_cm) largest_bike = bike.bike_length_cm
      })
      // if (!largest_bike) return

      const padding = canvas.width / (100 / this.default_padding_percent)
      const each_px_measures_in_cm = (canvas.width - padding * 2) / (largest_bike || 200)

      if (this.show_human_silhouette)
        canvas.height = Math.max(
          canvas.height,
          (this.human_silhouette_height + 20) * each_px_measures_in_cm
        )

      this.drawBackground(ctx, canvas)
      this.drawGrid(ctx, canvas, padding, each_px_measures_in_cm)
      if (this.show_human_silhouette)
        await this.drawSilhouette(ctx, canvas, padding, each_px_measures_in_cm)
      if (this.show_regular_bike_silhouette)
        await this.drawRegularBike(ctx, canvas, padding, each_px_measures_in_cm)

      if (this.canvas_image_style_outline) {
        ctx.globalCompositeOperation = 'multiply'
      } else {
        ctx.globalCompositeOperation = 'source-over'
      }

      console.log('drawing bikes')
      for (const bike of this.sorted_enabled_bikes) {
        console.log('drawing bike', bike.id)
        const img = new Image()
        img.src = this.getBikeFullImage(bike)
        await img.decode()

        const img_ratio = img.width / img.height
        const draw_w = (bike.bike_length_cm / bike.bike_length_percent) * each_px_measures_in_cm
        const draw_h = draw_w / img_ratio

        let user_horizontal_adjustment = this.bikes_adjustments[bike.id]?.position_h / 100 || 0
        const draw_x = -(bike.left_margin_percent - user_horizontal_adjustment) * draw_w + padding

        let user_vertical_adjustment = this.bikes_adjustments[bike.id]?.position_v / 100 || 0
        const draw_y =
          canvas.height -
          padding -
          draw_h +
          (bike.bottom_margin_percent + user_vertical_adjustment) * draw_h

        let user_opacity_adjustment = this.bikes_adjustments[bike.id]?.opacity / 100 || 1
        let user_rotation = this.bikes_adjustments[bike.id]?.rotation || 0

        if (this.canvas_image_style_outline) {
          // Offscreen canvas for edge detection on the image
          const processorCanvas = this.$refs.processor
          if (!processorCanvas) return

          processorCanvas.width = canvas.width
          processorCanvas.height = canvas.height

          const processorCtx = processorCanvas.getContext('2d')
          processorCtx.globalCompositeOperation = 'source-over'

          // white BG for a clean edge detect result
          processorCtx.fillStyle = 'white'
          processorCtx.fillRect(0, 0, canvas.width, canvas.height)

          // Save context state
          processorCtx.save()
          // Translate to center of image
          processorCtx.translate(draw_x + draw_w / 2, draw_y + draw_h / 2)
          // Rotate
          processorCtx.rotate((user_rotation * Math.PI) / 180)
          // Draw image centered
          processorCtx.drawImage(img, -draw_w / 2, -draw_h / 2, draw_w, draw_h)
          // Restore context state
          processorCtx.restore()

          // detect edges
          edge_detect(processorCanvas)

          // colorize
          let color = bike.color
          colorize(processorCanvas, color)

          ctx.globalAlpha = user_opacity_adjustment
          ctx.drawImage(processorCanvas, 0, 0, processorCanvas.width, processorCanvas.height)
          ctx.globalAlpha = 1
        } else {
          // Save context state
          ctx.save()
          // Translate to center of image
          ctx.translate(draw_x + draw_w / 2, draw_y + draw_h / 2)
          // Rotate
          ctx.rotate((user_rotation * Math.PI) / 180)
          // Draw image centered
          ctx.globalAlpha = user_opacity_adjustment
          ctx.drawImage(img, -draw_w / 2, -draw_h / 2, draw_w, draw_h)
          // Restore context state
          ctx.restore()
          ctx.globalAlpha = 1
        }
      }

      // Draw a rectangle
      const { active, l, b, w, h, r } = this.$root.draw_rect_in_canvas
      if (active) {
        ctx.save()
        // Translate to center of rectangle
        const rect_x = padding + l * each_px_measures_in_cm
        const rect_y = canvas.height - padding - b * each_px_measures_in_cm
        const rect_w = w * each_px_measures_in_cm
        const rect_h = -h * each_px_measures_in_cm
        ctx.translate(rect_x + rect_w / 2, rect_y + rect_h / 2)
        // Rotate
        ctx.rotate((r * Math.PI) / 180)
        // Draw rectangle centered
        ctx.beginPath()
        ctx.strokeStyle = '#00ff00'
        ctx.lineWidth = 3
        ctx.rect(-rect_w / 2, -rect_h / 2, rect_w, rect_h)
        ctx.stroke()
        ctx.restore()
      }

      // Draw accessories (bakkie)
      const accessories = this.$root.accessories_in_canvas
      if (accessories && accessories.active && accessories.type === 'bakkie') {
        const bakkieImg = new Image()
        bakkieImg.src = bakkieUrl
        await new Promise((resolve) => {
          bakkieImg.onload = resolve
          bakkieImg.onerror = resolve
        })
        const bakkie_width_cm = 34.8
        const bakkie_x = padding + (accessories.l || 0) * each_px_measures_in_cm
        const bakkie_y = canvas.height - padding - (accessories.b || 0) * each_px_measures_in_cm
        const draw_w = bakkie_width_cm * each_px_measures_in_cm
        const img_ratio = bakkieImg.width / bakkieImg.height
        const draw_h = draw_w / img_ratio
        ctx.save()
        ctx.globalAlpha = 1
        ctx.drawImage(bakkieImg, bakkie_x, bakkie_y - draw_h, draw_w, draw_h)
        ctx.restore()
      }

      const visible_canvas = this.$refs.bikes
      visible_canvas.width = canvas.width
      visible_canvas.height = canvas.height
      visible_canvas.getContext('2d').drawImage(canvas, 0, 0, canvas.width, canvas.height)

      this.is_loading = false
    },
    drawBackground(ctx, canvas) {
      ctx.globalCompositeOperation = 'source-over'

      // bg
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-background'
      )
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = '#ccc'
      ctx.strokeWidth = 1
      ctx.strokeRect(1, 1, canvas.width - 1, canvas.height - 1)
    },
    drawGrid(ctx, canvas, padding, each_px_measures_in_cm) {
      const line_0_color = '#999'
      const line_color = '#cccccc'

      const text_0_fill_color = '#999'
      const text_fill_color = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-text-secondary'
      )

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
    },
    updateHeight() {
      this.human_silhouette_height = this.new_human_silhouette_height
    },
    async drawSilhouette(ctx, canvas, padding, each_px_measures_in_cm) {
      // ctx.fillStyle = 'white'

      // const silhouette_svg = new XMLSerializer().serializeToString(this.$refs.silhouette)
      // silhouette_img.src = 'data:image/svg+xml;base64,' + btoa(silhouette_svg)
      const silhouette_img = new Image()
      silhouette_img.src = './Human-Silhouette-1.svg'
      await silhouette_img.decode()

      // const silhouette_img = new Image()
      // silhouette_img.src = './Human_(silhouettes).svg'
      // await silhouette_img.decode()
      const img_ratio = silhouette_img.width / silhouette_img.height
      const silhouette_height = (this.human_silhouette_height + 7) * each_px_measures_in_cm
      const silhouette_width = silhouette_height * img_ratio

      const draw_x = padding + 5 * each_px_measures_in_cm
      let draw_y = canvas.height - padding + 3 * each_px_measures_in_cm

      // draw_y += 110

      // ctx.globalCompositeOperation = 'soft-light'
      ctx.globalAlpha = 0.2
      ctx.drawImage(silhouette_img, draw_x, draw_y, silhouette_width, -silhouette_height)
      ctx.globalAlpha = 1
      return
    },
    async drawRegularBike(ctx, canvas, padding, each_px_measures_in_cm) {
      const bike_img = new Image()
      bike_img.src = './mtb.svg'
      await bike_img.decode()

      const bike_img_w = 1280
      const bike_img_h = 740

      const img_ratio = bike_img_h / bike_img_w
      const silhouette_width = 178 * each_px_measures_in_cm
      const silhouette_height = silhouette_width * img_ratio

      const draw_x = padding
      // let draw_y = canvas.height
      let draw_y = canvas.height - padding

      ctx.globalAlpha = 1
      ctx.filter = 'invert(.5)'
      ctx.globalAlpha = 0.8
      ctx.drawImage(bike_img, draw_x, draw_y, silhouette_width, -silhouette_height)
      ctx.globalAlpha = 1
      ctx.filter = 'none'
    },
    toggleHumanSilhouette($event) {
      this.show_human_silhouette = $event.target.checked
    },
    toggleRegularBikeSilhouette($event) {
      this.show_regular_bike_silhouette = $event.target.checked
    },
    toggleOutlineView($event) {
      let query = JSON.parse(JSON.stringify(this.$route.query)) || {}

      if (!$event.target.checked) delete query.outline
      else query.outline = '1'

      this.$router.push({
        query
      })
    },
    async unselectBike(bike_id) {
      const bikes_ids = this.$root.enabled_bikes_ids
      const new_bikes_ids = bikes_ids.filter((id) => id !== bike_id)
      this.$root.updateBikesQuery(new_bikes_ids)
    },
    downloadCanvas() {
      const canvas = this.$refs.bikes
      const img = canvas.toDataURL()
      const a = document.createElement('a')
      a.href = img

      const bikes = this.sorted_enabled_bikes
      const bikes_names = bikes.map((bike) => bike.id).join('+')

      a.download = `bike-comparison-${bikes_names}.png`
      a.click()
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
  z-index: 4;
  width: 100%;
  pointer-events: none;
  padding: 0.5rem;
  // padding-left: 3rem;

  overflow-x: auto;

  display: flex;
  flex-direction: row nowrap;
  justify-content: flex-start;

  gap: 0.5rem;

  > * {
    pointer-events: auto;

    display: flex;
    align-items: center;
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
  flex: 0 0 20ch;
  height: auto;
  border-radius: 0.5rem;

  padding: 0.12rem 0.75rem 0.25rem;
  // background-color: var(--color-accent);
  background-color: white;
  // backdrop-filter: blur(5px);
  // text-align: center;

  border: 2px solid transparent;
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &[data-showcolor='true'] {
    border-color: var(--bike-color);
  }
}

._setImageStyle {
  // display: flex;
  // flex-direction: row nowrap;
  // align-items: center;
  // justify-content: center;
  white-space: nowrap;
  gap: 0.25rem;
  pointer-events: auto;
  background-color: var(--color-text);
  // background-color: #fff;
  // color: var(--color-text);
  color: white;
  // border: 2px solid var(--color-text);
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  font-weight: 500;

  &:hover,
  &:focus-visible,
  &[data-active='true'] {
    background-color: var(--color-accent);
    color: black;
  }
}

._loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  display: flex;
  flex-direction: row nowrap;
  justify-content: center;
  align-items: center;

  background-color: rgba(238, 238, 238, 0.2);

  ._loaderAnimation {
    transform: scale(0.5);
    // --color: var(--color-accent);
  }
}

._previewCanvas {
  position: relative;
  z-index: 1;
  background: var(--color-background);
}

._downloadCanvas {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  pointer-events: none;
  padding: 2rem;

  > * {
    background-color: var(--color-background);
    pointer-events: auto;
  }
}

._openSidebar {
  width: 2rem;
  height: 2rem;
  line-height: 0;
  border-radius: 0.5rem;

  background-color: var(--color-text);
  color: white;

  &.is--active {
    background-color: var(--color-accent);
    color: black;
  }
}

._previewBikeWrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;

  ._previewBikeOverlay {
    position: absolute;
    inset: 0;
    background-color: rgba(238, 238, 238, 0.35);
    // backdrop-filter: blur(2px);
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 100%;
    object-fit: scale-down;
  }
}

._activeBike--name {
  flex: 1 1 0;
  overflow: hidden;

  :deep(> *) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

._activeBike--remove {
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  padding-bottom: 0.05rem;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  border: 1px solid var(--color-text);
  // background-color: var(--color-text);
  // color: var(--color-background);
}
._humanSilhouetteHeight {
  padding: 2px;
  border: none;
  margin-left: 0.5rem;

  input {
    width: 7ch;
    padding: 1px;
    border: none;
    // height: 1.5rem;
  }
  button {
    background-color: white;
  }
}
</style>
