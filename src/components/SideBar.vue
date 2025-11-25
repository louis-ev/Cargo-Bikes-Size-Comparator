<template>
  <div class="_sidebar">
    <button
      type="button"
      class="_closeSidebar"
      aria-label="Close sidebar"
      @click="$emit('closeSidebar')"
    >
      <span>×</span>
    </button>
    <div class="_sidebar--content">
      <div class="_banner">
        <router-link to="/" @click="goHome" class="clickable-title">
          <h1 v-html="$t('message.title')" />
        </router-link>
        <LangSelect class="_lang_select" />
      </div>

      <BikesListInSidebar
        :bikes="bikes"
        :enabled_bikes="enabled_bikes"
        :canvas_image_style_outline="canvas_image_style_outline"
        :bikes_adjustments="bikes_adjustments"
        @update:bikes_adjustments="$emit('update:bikes_adjustments', $event)"
        @showAddBikeModal="$emit('showAddBikeModal')"
      />

      <hr />
      <details class="_advancedOptions">
        <summary>{{ $t('message.advanced_options') }}</summary>
        <div class="_advanced">
          <label>{{ $t('message.grid_step') }}</label>
          <input
            class="_rangeSlider"
            type="range"
            step="1"
            min="1"
            max="100"
            list="grid_step_datalist"
            :value="grid_step"
            @input="$emit('update:grid_step', +$event.target.value)"
          />
          <datalist id="grid_step_datalist">
            <option value="1" label="1" />
            <option value="5" label="5" />
            <option value="10" label="10" />
            <option value="20" label="20" />
            <option value="50" label="50" />
            <!-- <option value="75" label="75" /> -->
            <option value="100" label="100" />
          </datalist>
        </div>
        <div class="_advanced">
          <label>{{ $t('message.zoom') }}</label>
          <input
            class="_rangeSlider"
            type="range"
            step="1"
            min="0"
            max="30"
            :value="default_padding_percent"
            @input="$emit('update:default_padding_percent', +$event.target.value)"
          />
        </div>
        <div class="">
          <div class="_advanced">
            <label for="draw_rect_in_canvas"
              >{{ $t('message.measure') }}
              <input
                type="checkbox"
                name="draw_rect_in_canvas"
                id="draw_rect_in_canvas"
                v-model="$root.draw_rect_in_canvas.active"
              />
            </label>
          </div>
          <template v-if="$root.draw_rect_in_canvas.active">
            <div class="_advanced" v-for="slider in draw_rect_sliders" :key="slider.key">
              <label :title="$root.draw_rect_in_canvas[slider.key]">{{ slider.label }}</label>
              <input
                type="number"
                class="_numberInputs"
                v-model.number="$root.draw_rect_in_canvas[slider.key]"
              />
              <input
                class="_rangeSlider"
                type="range"
                step="1"
                min="-0"
                max="300"
                v-model.number="$root.draw_rect_in_canvas[slider.key]"
              />
            </div>
          </template>
        </div>
        <!-- Accessories Toggle and Controls -->
        <div class="_advanced">
          <label for="accessories_in_canvas">
            Accessories
            <input
              type="checkbox"
              name="accessories_in_canvas"
              id="accessories_in_canvas"
              v-model="$root.accessories_in_canvas.active"
            />
          </label>
        </div>
        <template v-if="$root.accessories_in_canvas.active">
          <div class="_advanced">
            <label for="accessory_type">Type</label>
            <select id="accessory_type" v-model="$root.accessories_in_canvas.type">
              <option value="bakkie">Bakkie</option>
            </select>
          </div>
          <div class="_advanced">
            <label :title="$root.accessories_in_canvas.l">Left (cm)</label>
            <input
              type="number"
              class="_numberInputs"
              v-model.number="$root.accessories_in_canvas.l"
            />
            <input
              class="_rangeSlider"
              type="range"
              step="1"
              min="0"
              max="300"
              v-model.number="$root.accessories_in_canvas.l"
            />
          </div>
          <div class="_advanced">
            <label :title="$root.accessories_in_canvas.b">Bottom (cm)</label>
            <input
              type="number"
              class="_numberInputs"
              v-model.number="$root.accessories_in_canvas.b"
            />
            <input
              class="_rangeSlider"
              type="range"
              step="1"
              min="0"
              max="300"
              v-model.number="$root.accessories_in_canvas.b"
            />
          </div>
        </template>
      </details>

      <Credits />
    </div>

    <!-- <div class="_addMissingBike">
      <button type="button" data-color="black" data-size="big" @click="$emit('showAddBikeModal')">
        ＋
        {{ $t('message.add_a_bike') }}
      </button>
    </div> -->
  </div>
</template>
<script>
import LangSelect from './LangSelect.vue'
import BikesListInSidebar from './BikesListInSidebar.vue'
import Credits from './Credits.vue'

export default {
  props: {
    bikes: Array,
    enabled_bikes: Array,
    canvas_image_style_outline: Boolean,
    bikes_adjustments: Object,
    grid_step: Number,
    default_padding_percent: Number
  },
  components: {
    LangSelect,
    BikesListInSidebar,
    Credits
  },
  data() {
    return {
      draw_rect_sliders: [
        {
          key: 'l',
          label: this.$t('message.left')
        },
        {
          key: 'b',
          label: this.$t('message.bottom')
        },
        {
          key: 'w',
          label: this.$t('message.width')
        },
        {
          key: 'h',
          label: this.$t('message.height')
        },
        {
          key: 'r',
          label: this.$t('message.rotation')
        }
      ]
    }
  },
  created() {},
  async mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {},
  methods: {
    goHome() {
      // Reset the application state by clearing bikes query parameter
      this.$root.resetBikes()
      // Navigate to home route
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
._sidebar {
  position: relative;
  width: 340px;
  height: 100%;
  background-color: var(--color-background);

  display: flex;
  flex-flow: column nowrap;
}

._banner {
  // text-align: center;
  aspect-ratio: 3/1;
  // background-color: white;
  border-radius: 0.5rem;
  // padding: 0.5rem;
  // padding-right: 1rem;
  gap: 0.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  margin-bottom: 1rem;
}

._closeSidebar {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.5rem;
  background-color: var(--color-text);
  z-index: 1000;
  // background-color: var(--color-text-secondary);
  color: white;

  font-size: 2rem;
  font-weight: 400;

  display: flex;
  justify-content: center;
  align-items: center;

  border: none;
  width: 2rem;
  height: 2rem;
  line-height: 0;
  // border-radius: 50%;
  padding: 0rem;

  span {
    display: block;
    margin-top: -0.25rem;
  }
}

._sidebar--content {
  overflow-y: auto;
  padding: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  flex: 1 1 auto;
}
._addMissingBike {
  flex: 0 0 auto;
}

.clickable-title {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-text-secondary);
    background-color: transparent;
  }

  h1 {
    margin-bottom: 0;
  }
}

._advancedOptions {
  font-size: 0.8rem;
}

._advanced {
  display: flex;
  flex-direction: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;

  // margin-bottom: 0.25rem;

  label {
    font-weight: normal;
  }

  > * {
    flex: 0 0 auto;
  }

  ._numberInputs {
    width: 7ch;
  }
  ._rangeSlider {
    flex: 1 1 auto;
  }
}

._infos {
  display: flex;
  flex-direction: row wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  button {
    display: inline-block;
  }
}

._addMissingBike {
  // background-color: var(--color-accent);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  // background-color: var(--color-accent);
  // background-color: white
  box-shadow: 0 0 10px 0 var(--color-gray-light);
  // border-top: 1px solid var(--color-text-secondary);

  button {
    // background-color: var(--color-accent);
    // padding: 2rem;
  }
}
</style>
