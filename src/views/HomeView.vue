<template>
  <div class="_homeView">
    <div class="_leftPane">
      <button class="_toggleSidebar" :data-rotate="show_sidebar" @click="toggleSidebar">
        <!-- &#x2190; -->
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 18L20 18" stroke="#000000" stroke-width="2" stroke-linecap="round" />
          <path d="M4 12L20 12" stroke="#000000" stroke-width="2" stroke-linecap="round" />
          <path d="M4 6L20 6" stroke="#000000" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <transition name="slide" mode="out-in">
        <SideBar
          v-if="show_sidebar"
          :bikes="bikes"
          :enabled_bikes="enabled_bikes"
          :grid_step="grid_step"
          v-model:default_padding_percent="default_padding_percent"
          v-model:grid_step="grid_step"
          v-model:bikes_position_adjustments="bikes_position_adjustments"
          :canvas_image_style_outline="canvas_image_style_outline"
          @showAddBikeModal="add_bike_modal = true"
        />
      </transition>
    </div>
    <div class="_rightPane">
      <transition name="fade" mode="out-in">
        <ListOfBikes v-if="enabled_bikes.length === 0" :bikes="bikes" />
        <CanvasView
          v-else
          :enabled_bikes="enabled_bikes"
          :default_padding_percent="default_padding_percent"
          :grid_step="grid_step"
          :bikes_position_adjustments="bikes_position_adjustments"
          :canvas_image_style_outline="canvas_image_style_outline"
        />
      </transition>
    </div>
    <transition name="fade" mode="out-in">
      <AddBikeModal v-if="add_bike_modal" :bikes="bikes" @close="add_bike_modal = false" />
    </transition>
  </div>
</template>
<script>
import SideBar from '@/components/SideBar.vue'
import CanvasView from '@/components/CanvasView.vue'
import AddBikeModal from '@/components/AddBikeModal.vue'
import ListOfBikes from '@/components/ListOfBikes.vue'

export default {
  props: {
    bikes: Array
  },
  components: {
    SideBar,
    CanvasView,
    AddBikeModal,
    ListOfBikes
  },
  data() {
    return {
      ro: null,

      add_bike_modal: false,
      show_sidebar: true,

      default_padding_percent: 5,
      grid_step: 20,

      bikes_position_adjustments: {},

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
    canvas_image_style_outline() {
      return this.$route.query.outline && this.$route.query.outline === '1'
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
    },
    toggleSidebar() {
      this.show_sidebar = !this.show_sidebar
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
._leftPane {
  position: relative;
  z-index: 2;
  flex: 0 0 auto;
  height: 100%;
  box-shadow: 0 0 10px 0 var(--color-gray-light);
  // border-right: 1px solid var(--color-gray-light);
  // overflow: auto;
}
._rightPane {
  flex: 1 1 auto;
  height: 100%;
  overflow: auto;
}
._toggleSidebar {
  position: absolute;
  top: 0.5rem;
  left: calc(100% + 0.5rem);
  z-index: 100;
  padding: 0rem;
  // background-color: var(--color-text);
  // color: white;
  background-color: white;
  color: var(--color-text);
  width: 2rem;
  height: 2rem;
  line-height: 0;

  border-radius: 1rem;

  &[data-rotate='false'] {
    transform: rotate(180deg);
  }
}
</style>
