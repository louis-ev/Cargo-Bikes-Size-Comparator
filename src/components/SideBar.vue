<template>
  <div class="_sidebar">
    <div class="_sidebar--content">
      <div class="_banner">
        <h1 v-html="$t('message.title')" />
        <LangSelect class="_lang_select" />
      </div>

      <button class="_closeSidebar" @click="$emit('closeSidebar')">&#x2190;</button>

      <BikesListInSidebar
        :bikes="bikes"
        :enabled_bikes="enabled_bikes"
        :canvas_image_style_outline="canvas_image_style_outline"
        :bikes_adjustments="bikes_adjustments"
        @update:bikes_adjustments="$emit('update:bikes_adjustments', $event)"
      />

      <hr />
      <details>
        <summary>{{ $t('message.advanced_options') }}</summary>
        <div class="_advanced">
          <label>{{ $t('message.grid_step') }}: {{ grid_step }}cm</label>
          <input
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
            type="range"
            step="1"
            min="0"
            max="30"
            :value="default_padding_percent"
            @input="$emit('update:default_padding_percent', +$event.target.value)"
          />
        </div>
      </details>

      <Credits />
    </div>

    <div class="_addMissingBike">
      <button type="button" data-color="black" @click="$emit('showAddBikeModal')">
        ＋
        {{ $t('message.add_a_bike') }}
      </button>
    </div>
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
    return {}
  },
  created() {},
  async mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
._sidebar {
  position: relative;
  width: 320px;
  height: 100%;
  background-color: var(--color-background);

  display: flex;
  flex-flow: column nowrap;
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

  border: none;
  width: 2rem;
  height: 2rem;
  line-height: 1;
  border-radius: 50%;
  padding: 0.5rem;
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

._banner {
  text-align: center;
  aspect-ratio: 3/1;
  // background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  gap: 0.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

._lang_select {
  // float: right;
}

h1 {
  font-weight: 800;
  margin-bottom: 0;
}

._advanced {
  display: flex;
  flex-direction: row nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  margin-bottom: 0.25rem;
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
