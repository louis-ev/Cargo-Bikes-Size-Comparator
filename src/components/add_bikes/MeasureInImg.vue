<template>
  <div class="_measureInImg">
    <div class="_topSliders">
      <div class="_slider" :style="{ accentColor: left_color }">
        <label v-text="$t('message.left')" />
        <SliderNumber v-model:value="left" />
        <small
          >Align with the left edge (back of the rear wheel or the rack), depending on what the
          <i>Total bike length</i> refers to.
        </small>
      </div>
      <div class="_slider" :style="{ accentColor: right_color }">
        <label v-text="$t('message.right')" />
        <SliderNumber v-model:value="right" :direction="'rtl'" />
        <small
          >Align with the right edge (front of the front wheel or front rack), depending on what the
          <i>Total bike length</i> refers to.
        </small>
      </div>
      <div class="_slider" :style="{ accentColor: bottom_color }">
        <label v-text="$t('message.bottom')" />
        <SliderNumber v-model:value="bottom" />
        <small
          >Align with the ground, typically the contact point between the wheels and the floor.
        </small>
      </div>
    </div>
    <canvas ref="canvas" />
  </div>
</template>
<script>
import SliderNumber from '@/components/add_bikes/SliderNumber.vue'

export default {
  props: {
    imageUrl: String,
    img_left: Number,
    img_right: Number,
    img_bottom: Number
  },
  components: {
    SliderNumber
  },
  data() {
    return {
      left: this.img_left,
      right: this.img_right,
      bottom: this.img_bottom,
      left_color: '#3333FF',
      right_color: '#ff0000',
      bottom_color: '#11bb11'
    }
  },
  created() {},
  async mounted() {
    await this.drawCanvas()
  },
  beforeUnmount() {},
  watch: {
    left() {
      this.drawCanvas()
      this.$emit('update:img_left', this.left)
    },
    right() {
      this.drawCanvas()
      this.$emit('update:img_right', this.right)
    },
    bottom() {
      this.drawCanvas()
      this.$emit('update:img_bottom', this.bottom)
    }
  },
  computed: {},
  methods: {
    async drawCanvas() {
      const img = new Image()
      img.src = this.imageUrl
      await img.decode()

      const ratio = img.width / img.height
      const canvas_width = 1800
      const canvas_height = canvas_width / ratio

      const canvas = this.$refs.canvas
      canvas.width = canvas_width
      canvas.height = canvas_height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const left = (this.left / 100) * canvas_width
      const right = canvas_width - (this.right / 100) * canvas_width
      const bottom = canvas_height - (this.bottom / 100) * canvas_height

      ctx.lineWidth = 2

      ctx.strokeStyle = this.left_color
      ctx.beginPath()
      ctx.moveTo(left, 0)
      ctx.lineTo(left, canvas_height)
      ctx.stroke()

      ctx.strokeStyle = this.right_color
      ctx.beginPath()
      ctx.moveTo(right, 0)
      ctx.lineTo(right, canvas_height)
      ctx.stroke()

      ctx.strokeStyle = this.bottom_color
      ctx.beginPath()
      ctx.moveTo(0, bottom)
      ctx.lineTo(canvas_width, bottom)
      ctx.stroke()
    }
  }
}
</script>
<style lang="scss" scoped>
._measureInImg {
  width: 100%;
  height: auto;
}

._topSliders {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  > * {
    width: 100%;
  }
}
._slider {
  // display: flex;
  // flex-direction: row nowrap;
  // gap: 0.5rem;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  border: 2px solid var(--color-text-secondary);
}
</style>
