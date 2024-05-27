<template>
  <div class="_sidebar">
    <h1>Cargo Bikes<br />Size Comparator</h1>

    <div class="_search">
      <input type="search" v-model="search_str" placeholder="Search by model or manufacturer" />
    </div>

    <div v-if="filtered_bikes.length === 0" class="_noMatch">
      No bikes matched your search.<br />
      To contribute a bike,
      <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator/issues/9" target="_blank"
        >read the guide</a
      >
      or ask me <a href="mailto:hello@louiseveillard.com" target="_blank">via email</a>.
    </div>

    <template v-else>
      <small class="_infos">
        <template v-if="enabled_bikes.length === 0">
          Click on bikes in this list to compare their size
        </template>
        <template v-else>
          <span>
            <template v-if="enabled_bikes.length === 1">
              {{ enabled_bikes.length }} bike selected
            </template>
            <template v-else> {{ enabled_bikes.length }} bikes selected </template>
          </span>
          <button class="_reset" type="button" @click="resetBikes">Reset</button>
        </template>
      </small>
    </template>

    <BikesList
      :bikes="filtered_bikes"
      :enabled_bikes="enabled_bikes"
      :bikes_position_adjustments="bikes_position_adjustments"
      @update:bikes_position_adjustments="$emit('update:bikes_position_adjustments', $event)"
    />

    <hr />
    <details>
      <summary>Advanced options</summary>
      <div class="_advanced">
        <label>Grid step (cm)</label>
        <input
          type="range"
          step="1"
          min="1"
          max="100"
          @input="$emit('update:grid_step', +$event.target.value)"
        />
      </div>
      <div class="_advanced">
        <label>Padding (%)</label>
        <input
          type="range"
          step="1"
          min="0"
          max="30"
          @input="$emit('update:default_padding_percent', +$event.target.value)"
        />
      </div>
    </details>

    <Credits />
  </div>
</template>
<script>
import BikesList from './BikesList.vue'
import Credits from './Credits.vue'

export default {
  props: {
    bikes: Array,
    enabled_bikes: Array,
    canvas_image_style_outline: Boolean,
    bikes_position_adjustments: Object
  },
  components: {
    BikesList,
    Credits
  },
  data() {
    return {
      search_str: ''
    }
  },
  created() {},
  async mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {
    filtered_bikes() {
      return this.bikes.filter((bike) => {
        if (!this.search_str) return true
        return (
          this.normalizeStringForSearch(bike.model).includes(
            this.normalizeStringForSearch(this.search_str)
          ) ||
          this.normalizeStringForSearch(bike.manufacturer).includes(
            this.normalizeStringForSearch(this.search_str)
          )
        )
      })
    }
  },
  methods: {
    normalizeStringForSearch(str) {
      if (!str) return ''
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    },
    resetBikes() {
      this.$router.push({
        query: {}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
._sidebar {
  flex: 0 0 auto;
  width: 320px;
  padding: 1rem;
  background-color: var(--color-background);

  overflow-y: auto;
}

h1 {
  font-weight: 800;
}

._advanced {
  display: flex;
  flex-direction: row nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  margin-bottom: 0.25rem;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  position: relative;
  transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(0px);
}

.list-leave-active {
  position: absolute;
  z-index: -1;
}

._search {
  margin-bottom: 1rem;

  input {
    width: 100%;
  }
}

._infos {
  display: flex;
  flex-direction: row wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
</style>
