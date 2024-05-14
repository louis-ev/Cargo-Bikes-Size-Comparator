<template>
  <div class="_homeView">
    <SideBar
      :bikes="bikes"
      :enabled_bikes="enabled_bikes"
      v-model:default_padding_percent="default_padding_percent"
      v-model:grid_step="grid_step"
      :canvas_image_style_outline="canvas_image_style_outline"
    />
    <CanvasView
      :enabled_bikes="enabled_bikes"
      :default_padding_percent="default_padding_percent"
      :grid_step="grid_step"
      v-model:canvas_image_style_outline="canvas_image_style_outline"
    />
  </div>
</template>
<script>
import SideBar from '@/components/SideBar.vue'
import CanvasView from '@/components/CanvasView.vue'

export default {
  props: {
    bikes: Array
  },
  components: {
    SideBar,
    CanvasView
  },
  data() {
    return {
      ro: null,

      default_padding_percent: 5,
      canvas_image_style_outline: false,
      grid_step: 20,

      bike_outline_colors: ['3333ff', 'ff0000', '11bb11', 'bbbb00', 'ff00ff', '00bbbb']
    }
  },
  created() {},
  async mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {
    enabled_bikes_ids() {
      if (this.$route.query.bikes) {
        try {
          return JSON.parse(this.$route.query.bikes)
        } catch (e) {
          return []
        }
      }
      return []
    },
    enabled_bikes() {
      return this.enabled_bikes_ids.reduce((acc, id, index) => {
        const bike = this.findMatchingBike(id)
        if (bike) {
          const color_options = this.bike_outline_colors
          bike.color = color_options[index % color_options.length]
          acc.push(bike)
        }
        return acc
      }, [])
    }
  },
  methods: {
    findMatchingBike(id) {
      return this.bikes.find((i) => i.id === id)
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
</style>
