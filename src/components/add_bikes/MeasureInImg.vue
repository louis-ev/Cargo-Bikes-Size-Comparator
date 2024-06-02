<template>
  <div class="_measureInImg">
    <div class="_topSliders">
      <SliderNumber :label="$t('left')" v-model:value="left" />
      <SliderNumber :label="$t('right')" v-model:value="right" :direction="'rtl'" />
      <SliderNumber :label="$t('bottom')" v-model:value="bottom" />
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
      bottom: this.img_bottom
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

      ctx.strokeStyle = 'red'
      ctx.beginPath()
      ctx.moveTo(left, 0)
      ctx.lineTo(left, canvas_height)
      ctx.stroke()

      ctx.strokeStyle = 'blue'
      ctx.beginPath()
      ctx.moveTo(right, 0)
      ctx.lineTo(right, canvas_height)
      ctx.stroke()

      ctx.strokeStyle = 'green'
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
  display: flex;
  flex-direction: row nowrap;
  gap: 0.5rem;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-text-secondary);
}
</style>
