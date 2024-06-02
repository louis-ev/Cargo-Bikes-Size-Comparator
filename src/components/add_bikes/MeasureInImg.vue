<template>
  <div class="_measureInImg">
    <div class="_topSliders">
      <SliderNumber v-model="left" />
      <SliderNumber v-model="right" />
      <SliderNumber v-model="bottom" />
    </div>
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
import SliderNumber from '@/components/add_bikes/SliderNumber.vue'

export default {
  props: {
    imageUrl: String
  },
  components: {
    SliderNumber
  },
  data() {
    return {
      left: 10,
      right: 90,
      bottom: 90
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
    },
    right() {
      this.drawCanvas()
    },
    bottom() {
      this.drawCanvas()
    }
  },
  computed: {},
  methods: {
    async drawCanvas() {
      const img = new Image()
      img.src = this.imageUrl
      await img.decode()

      const canvas = this.$refs.canvas
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const left = (this.left / 100) * img.width
      const right = (this.right / 100) * img.width
      const bottom = img.height - (this.bottom / 100) * img.height

      ctx.lineWidth = 2

      ctx.strokeStyle = 'red'
      ctx.beginPath()
      ctx.moveTo(left, 0)
      ctx.lineTo(left, img.height)
      ctx.stroke()

      ctx.strokeStyle = 'blue'
      ctx.beginPath()
      ctx.moveTo(right, 0)
      ctx.lineTo(right, img.height)
      ctx.stroke()

      ctx.strokeStyle = 'green'
      ctx.beginPath()
      ctx.moveTo(0, bottom)
      ctx.lineTo(img.width, bottom)
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
  gap: 0.5rem;
  margin-bottom: 1rem;
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
}
</style>
