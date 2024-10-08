<template>
  <div class="_sidebar">
    <div class="_sidebar--content">
      <div class="_banner">
        <h1 v-html="$t('message.title')" />
        <LangSelect class="_lang_select" />
      </div>

      <button class="_closeSidebar" @click="$emit('closeSidebar')">&#x2190;</button>

      <div class="_search">
        <input type="text" v-model="search_str" :placeholder="$t('message.search_placeholder')" />
        <button type="button" v-if="search_str.length > 0" @click="search_str = ''">×</button>
      </div>

      <div v-if="filtered_bikes.length === 0" class="_noMatch">
        {{ $t('message.no_bikes_matched_your_search') }}<br />
        {{ $t('message.to_contribute_a_bike') }}
        <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator/issues/9" target="_blank">
          {{ $t('message.read_the_guide') }}
        </a>
        {{ $t('message.or_ask_me') }}
        <a href="mailto:hello@louiseveillard.com" target="_blank">{{ $t('message.via_email') }}</a
        >.
      </div>

      <template v-else>
        <small class="_infos">
          <template v-if="enabled_bikes.length === 0">
            {{
              $t('message.click_on_bikes_in_this_list_to_compare_their_size', {
                count: bikes.length
              })
            }}
          </template>
          <template v-else>
            <span>
              <template v-if="enabled_bikes.length === 1">
                {{ enabled_bikes.length }} {{ $t('message.bike_selected') }}
              </template>
              <template v-else>
                {{ enabled_bikes.length }} {{ $t('message.bikes_selected') }}
              </template>
            </span>
            <button class="_reset" type="button" @click="resetBikes">
              {{ $t('message.reset') }}
            </button>
          </template>
        </small>
      </template>

      <BikesListInSidebar
        :bikes="filtered_bikes"
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
          this.$normalizeStringForSearch(bike.model).includes(
            this.$normalizeStringForSearch(this.search_str)
          ) ||
          this.$normalizeStringForSearch(bike.manufacturer).includes(
            this.$normalizeStringForSearch(this.search_str)
          )
        )
      })
    }
  },
  methods: {
    resetBikes() {
      let query = JSON.parse(JSON.stringify(this.$route.query)) || {}
      delete query.bikes
      this.$router.push({
        query
      })
    }
  }
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

._search {
  position: relative;
  margin-bottom: 1rem;

  input {
    width: 100%;
    padding-right: 1.7em;
  }

  button {
    position: absolute;
    position: absolute;
    right: 0;
    top: 0;
    line-height: 0;
    width: 1.7em;
    height: 1.7em;
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

._reset {
  padding: 0 0.25rem;

  cursor: pointer;
}
</style>
