<template>
  <div class="_homeView">
    <div class="_leftPane">
      <transition name="slide" mode="out-in">
        <SideBar
          v-if="show_sidebar && enabled_bikes.length > 0"
          :bikes="bikes"
          :enabled_bikes="enabled_bikes"
          :grid_step="grid_step"
          v-model:default_padding_percent="default_padding_percent"
          v-model:grid_step="grid_step"
          v-model:bikes_adjustments="bikes_adjustments"
          :canvas_image_style_outline="canvas_image_style_outline"
          @showAddBikeModal="add_bike_modal = true"
          @closeSidebar="show_sidebar = false"
        />
      </transition>
    </div>
    <div class="_rightPane">
      <transition name="fade" mode="out-in">
        <ListOfBikes
          v-if="enabled_bikes.length === 0"
          :bikes="bikes"
          @showAddBikeModal="add_bike_modal = true"
        />
        <CanvasView
          v-else
          :enabled_bikes="enabled_bikes"
          :bikes="bikes"
          :default_padding_percent="default_padding_percent"
          :grid_step="grid_step"
          :bikes_adjustments="bikes_adjustments"
          :canvas_image_style_outline="canvas_image_style_outline"
          :show_sidebar="show_sidebar"
          :use_inches="$root.useInches"
          @toggleSidebar="toggleSidebar"
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
      grid_step: 10,

      bikes_adjustments: {},

      bike_outline_colors: ['3333ff', 'ff0000', '11bb11', 'bbbb00', 'ff00ff', '00bbbb']
    }
  },
  created() {},
  async mounted() {
    // check if URL has a ?addbike=true query to open the add bike modal right away on loading
    if (Object.prototype.hasOwnProperty.call(this.$route.query, 'addbike')) {
      this.add_bike_modal = true
    }
  },
  beforeUnmount() {},
  watch: {},
  computed: {
    canvas_image_style_outline() {
      return this.$route.query.outline && this.$route.query.outline === '1'
    },
    enabled_bikes() {
      return this.$root.enabled_bikes_ids.reduce((acc, rawId, index) => {
        const { baseId, isFolded } = this.normalizeBikeId(rawId)
        const bike = this.findMatchingBike(baseId)
        if (!bike) return acc

        const color_options = this.bike_outline_colors
        const displayBike = {
          ...bike,
          id: rawId,
          base_id: baseId,
          is_folded: isFolded,
          color: color_options[index % color_options.length]
        }

        if (isFolded && bike.folded_view) {
          const view = bike.folded_view
          displayBike.src = view.src || bike.src
          displayBike.bike_length_cm = view.bike_length_cm ?? bike.bike_length_cm
          displayBike.weight = view.weight ?? bike.weight
          displayBike.bike_length_percent = view.bike_length_percent ?? bike.bike_length_percent
          displayBike.left_margin_percent = view.left_margin_percent ?? bike.left_margin_percent
          displayBike.bottom_margin_percent =
            view.bottom_margin_percent ?? bike.bottom_margin_percent
          displayBike.model = `${bike.model} (folded)`
        }

        acc.push(displayBike)
        return acc
      }, [])
    }
  },
  methods: {
    normalizeBikeId(id) {
      if (!id) return { baseId: id, isFolded: false }
      const isFolded = id.endsWith('_folded')
      return {
        baseId: isFolded ? id.replace(/_folded$/, '') : id,
        isFolded
      }
    },
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
</style>
