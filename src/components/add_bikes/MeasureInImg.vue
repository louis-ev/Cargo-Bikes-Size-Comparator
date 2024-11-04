<template>
  <div class="_measureInImg">
    <!-- <div class="_addBikeModalInput">
      <label for="imageUrl">URL to image</label>
      <input
        type="url"
        placeholder="https://"
        :value="imageUrl"
        @change="$emit('update:imageUrl', $event.target.value)"
        required
        id="imageUrl"
      />
      <small>
        It must be a profile image of the bike, with the front to the right, ideally on a white or
        transparent background. Higher resolution is better (at least 1000px in each dimension).
      </small>
    </div> -->

    <div class="inputField">
      <label>{{ $t('add_bike.image_source') }}</label>
      <div class="_radioGroup">
        <label
          v-for="source in [
            { key: 'URL', label: $t('add_bike.add_by_url') },
            { key: 'File', label: $t('add_bike.add_by_file') },
            { key: 'none', label: $t('add_bike.couldnt_find_the_image_you_want') }
          ]"
          :key="source.key"
          class="_radio"
        >
          <input type="radio" v-model="imageSource" :value="source.key" />
          {{ source.label }}
        </label>
      </div>
    </div>

    <div v-if="imageSource === 'URL'">
      <div class="inputField">
        <label for="imageUrl">{{ $t('add_bike.url') }}</label>

        <div class="_inputWithButton">
          <input
            type="url"
            placeholder="https://"
            :value="imageUrl"
            @change="$emit('update:imageUrl', $event.target.value)"
            id="imageUrl"
          />
          <button type="button" data-color="important" class="_button" @click="drawCanvas">
            {{ $t('add_bike.load_image') }}
          </button>
        </div>
        <small>
          {{ $t('add_bike.bike_image_explanation') }}
        </small>
      </div>
    </div>
    <div v-else-if="imageSource === 'File'">
      <div class="inputField">
        <label for="imageUrl">{{ $t('add_bike.bike_image') }}</label>
        <input type="file" accept="image/*" @change="onFileChange" />
        <small>
          {{ $t('add_bike.bike_image_explanation') }}
        </small>
      </div>
    </div>

    <hr />

    <!-- <div v-if="status === 'loading'">
      <p>{{ $t('add_bike.loading') }}</p>
    </div>
    <div class="_failed_to_load_image" v-else-if="status === 'failed_to_load_image'">
      <p v-html="$t('add_bike.failed_to_load_image')" />
      <p v-html="$t('add_bike.this_may_be_because')" />
      <p v-html="$t('add_bike.you_can_click_back')" />

      <input type="file" accept="image/*" @change="onFileChange" />
    </div> -->
    <div v-show="status === 'loaded' && imageSource !== 'none'">
      <p v-html="$t('add_bike.use_these_controls')" />
      <div class="_topSliders">
        <div class="_slider" :style="{ accentColor: left_color }">
          <label v-text="$t('message.left')" />
          <SliderNumber v-model:value="left" />
          <small v-html="$t('add_bike.align_with_the_left_edge')" />
        </div>
        <div class="_slider" :style="{ accentColor: right_color }">
          <label v-text="$t('message.right')" />
          <SliderNumber v-model:value="right" :direction="'rtl'" />
          <small v-html="$t('add_bike.align_with_the_right_edge')" />
        </div>
        <div class="_slider" :style="{ accentColor: bottom_color }">
          <label v-text="$t('message.bottom')" />
          <SliderNumber v-model:value="bottom" />
          <small v-html="$t('add_bike.align_with_the_ground')" />
        </div>
      </div>
      <canvas ref="canvas" />
    </div>
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
      imageSource: '',

      left: this.img_left,
      right: this.img_right,
      bottom: this.img_bottom,
      left_color: '#3333FF',
      right_color: '#ff0000',
      bottom_color: '#11bb11',
      status: 'loading',

      local_bike_image: null
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
    },
    imageSource() {
      this.status = 'loading'
    }
  },
  computed: {},
  methods: {
    async drawCanvas() {
      const img = new Image()
      // actually works less than anonymous
      // img.crossOrigin = 'anonymous'
      img.onerror = (err) => {
        console.error(err)
        this.status = 'failed_to_load_image'
      }

      if (this.imageSource === 'File') {
        img.src = URL.createObjectURL(this.local_bike_image)
      } else {
        img.src = this.imageUrl
      }

      // try {
      await img.decode()
      // } catch (e) {
      //   console.error(e)
      //   this.status = 'failed_to_load_image'

      //   return
      // }

      this.status = 'loaded'

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

      const { width: visible_width, height: visible_height } = canvas.getBoundingClientRect()
      const stroke_width = canvas.width / visible_width
      const stroke_height = canvas.height / visible_height
      const line_thickness = 1

      ctx.lineWidth = stroke_width * line_thickness
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

      ctx.lineWidth = stroke_height * line_thickness
      ctx.strokeStyle = this.bottom_color
      ctx.beginPath()
      ctx.moveTo(0, bottom)
      ctx.lineTo(canvas_width, bottom)
      ctx.stroke()
    },
    onFileChange(e) {
      console.log(e)
      this.local_bike_image = e.target?.files?.[0]
      this.drawCanvas()
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
  max-width: 100%;
  // max-height: 80vh;
  object-fit: scale-down;
}
._radio {
  font-weight: normal;
}

._radioGroup {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // gap: 1rem;
  // margin: 0.5rem;

  label {
    font-size: inherit;
  }
}

._inputWithButton {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  width: 100%;

  > input {
    flex: 1;
  }
}
</style>
