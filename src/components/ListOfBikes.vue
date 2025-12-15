<template>
  <div class="_listOfBikes">
    <div class="_banner">
      <div class="_title">
        <h1 v-html="$t('message.title')" />
        <LangSelect class="_lang_select" />
      </div>
      <div class="_credits">
        <Credits @showAddBikeModal="$emit('showAddBikeModal')" />

        <hr />
        <div>
          <button type="button" data-color="black" @click="$emit('showAddBikeModal')">
            ＋
            {{ $t('message.add_a_bike') }}
          </button>
        </div>
      </div>
    </div>
    <div class="_topBar">
      <div class="_search">
        <SearchField v-model="search_str" />
      </div>

      <div class="_filters">
        <div class="_bikeTypeFilter">
          <span v-html="$t('bike_types.by_category')" />
          <button
            v-for="[bike_type, count] in all_bike_types"
            :key="bike_type"
            type="button"
            :class="{
              'is--active': bike_type_filter === bike_type,
              'is--disabled': count === 0
            }"
            :style="bikeStyleColor(bike_type)"
            :disabled="count === 0"
            @click="onBikeTypeFilterClick(bike_type)"
          >
            {{ $t(`bike_types.${bike_type}`) }}
            <span class="_count">{{ count }}</span>
          </button>
        </div>

        <div class="_wheelSizeFilter">
          <span>{{ $t('message.by_wheel_size') }}</span>
          <button
            v-for="[wheel_size, count] in all_wheel_sizes"
            :key="wheel_size"
            type="button"
            :class="{
              'is--active': wheel_size_filter === wheel_size,
              'is--disabled': count === 0
            }"
            :disabled="count === 0"
            @click="onWheelSizeFilterClick(wheel_size)"
          >
            {{ wheel_size }}{{ isInchesSize(wheel_size) ? '"' : '' }}
            <span class="_count">{{ count }}</span>
          </button>
          <button
            v-if="unknown_wheel_size_count > 0"
            type="button"
            class="_unknownWheelSize"
            :class="{
              'is--active': wheel_size_filter === 'unknown'
            }"
            @click="onWheelSizeFilterClick('unknown')"
          >
            {{ $t('message.unknown_wheel_size') }}
            <span class="_count">{{ unknown_wheel_size_count }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="filtered_bikes.length === 0" class="_noMatch">
      {{ $t('message.no_bikes_matched_your_search') }}<br /><br />
    </div>

    <div class="_itemTitle" :key="'not_enabled_bikes'" v-else>
      {{
        $t('message.click_on_bikes_in_this_list_to_compare_their_size', {
          count: filtered_bikes.length
        })
      }}
    </div>

    <transition-group name="list" tag="div" class="_bikesPreview">
      <button
        type="button"
        class="_bikePreview"
        v-for="bike in filtered_bikes"
        :key="bike.id"
        @click="onBikePreviewClick(bike.id)"
        :class="{ 'is--selected': selected_bikes.includes(bike.id) }"
      >
        <transition name="slideup">
          <div v-if="getBikePreviewImage(bike)">
            <img
              loading="lazy"
              :src="getBikePreviewImage(bike)"
              :style="{
                '--scale-factor': 1 / bike.bike_length_percent + '',
                '--bottom-margin': 1 - bike.bottom_margin_percent / 1 + ''
              }"
            />
          </div>
        </transition>
        <div class="_bikeTypes">
          <div
            v-for="bike_type in getBikeTypes(bike)"
            :key="bike_type"
            class="_bikeType"
            :style="bikeStyleColor(bike_type)"
            :title="$t(`bike_types.${bike_type}`)"
          ></div>
        </div>
        <span class="_bikeLabel">
          <BikeName :bike="bike" />
        </span>
        <Transition name="scale">
          <div class="_checkmark" v-if="selected_bikes.includes(bike.id)">✓</div>
        </Transition>
      </button>
      <div class="_addMissingBike">
        {{ $t('message.cant_find_a_bike') }}
        <button type="button" data-color="black" data-size="big" @click="$emit('showAddBikeModal')">
          ＋
          {{ $t('message.add_a_bike') }}
        </button>
      </div>
    </transition-group>

    <div class="_floatingCompareButton">
      <transition name="comparebtn" mode="out-in">
        <button
          v-if="selected_bikes.length > 0"
          :key="'compare-button'"
          data-color="important"
          data-size="big"
          @click="startComparison"
        >
          {{ compareBikesText.prefix }}
          <transition name="count" mode="out-in">
            <span :key="selected_bikes.length" class="_count">
              {{ selected_bikes.length }}
            </span>
          </transition>
          {{ compareBikesText.suffix }}
        </button>
      </transition>
    </div>
  </div>
</template>
<script>
const bike_images_preview_urls = import.meta.glob('@/assets/bikes/*.png', {
  eager: true,
  import: 'default',
  query: { format: 'webp', w: 600 }
})

import Credits from './Credits.vue'
import LangSelect from '@/components/LangSelect.vue'
import SearchField from '@/components/SearchField.vue'

export default {
  props: {
    bikes: Array
  },
  components: {
    Credits,
    LangSelect,
    SearchField
  },
  data() {
    return {
      search_str: '',
      selected_bikes: [],
      bike_images_preview_urls: [],
      bike_type_filter: null,
      wheel_size_filter: null
    }
  },
  created() {},
  async mounted() {
    this.bike_images_preview_urls = await this.$loadBikeImages2(bike_images_preview_urls)
  },
  beforeUnmount() {},
  watch: {},
  computed: {
    all_bike_types() {
      // Sizes to merge into one button (ETRTO 622mm rim standard)
      const etrto_622_sizes = ['28', '29', '700c']
      const etrto_622_label = '28/29/700c'

      // First, get all possible bike types from the entire dataset
      const all_types = {}
      this.bikes.forEach((bike) => {
        let types = bike.bike_type ? bike.bike_type.split('/') : []
        types.forEach((type) => {
          all_types[type] = 0
        })
      })

      // Filter bikes based on wheel_size_filter and search
      const bikes_to_count = this.filtered_bikes_with_search.filter((bike) => {
        // Apply wheel size filter if active
        if (this.wheel_size_filter) {
          if (this.wheel_size_filter === 'unknown') {
            // Show only bikes without wheel size information
            if (bike.wheel_size && bike.wheel_size.length > 0) return false
          } else if (this.wheel_size_filter === etrto_622_label) {
            // Show bikes with any of the merged wheel sizes
            if (!bike.wheel_size || bike.wheel_size.length === 0) return false
            if (!bike.wheel_size.some((size) => etrto_622_sizes.includes(size))) return false
          } else {
            // Show only bikes with the selected wheel size
            if (!bike.wheel_size || bike.wheel_size.length === 0) return false
            if (!bike.wheel_size.includes(this.wheel_size_filter)) return false
          }
        }
        return true
      })

      // Count bikes for each type
      bikes_to_count.forEach((bike) => {
        let types = bike.bike_type ? bike.bike_type.split('/') : []
        types.forEach((type) => {
          if (all_types[type] !== undefined) {
            all_types[type]++
          }
        })
      })

      return Object.entries(all_types).sort((a, b) => b[1] - a[1])
    },
    all_wheel_sizes() {
      // Sizes to merge into one button (ETRTO 622mm rim standard)
      const etrto_622_sizes = ['28', '29', '700c']
      const etrto_622_label = '28/29/700c'

      // First, get all possible wheel sizes from the entire dataset
      const all_sizes = {}
      this.bikes.forEach((bike) => {
        if (bike.wheel_size && bike.wheel_size.length > 0) {
          bike.wheel_size.forEach((size) => {
            // Group merged sizes together
            if (etrto_622_sizes.includes(size)) {
              all_sizes[etrto_622_label] = 0
            } else {
              all_sizes[size] = 0
            }
          })
        }
      })

      // Filter bikes based on bike_type_filter and search
      const bikes_to_count = this.filtered_bikes_with_search.filter((bike) => {
        // Apply bike type filter if active
        if (this.bike_type_filter) {
          const types = bike.bike_type ? bike.bike_type.split('/') : []
          if (!types.includes(this.bike_type_filter)) return false
        }
        return true
      })

      // Count bikes for each wheel size
      bikes_to_count.forEach((bike) => {
        if (bike.wheel_size && bike.wheel_size.length > 0) {
          bike.wheel_size.forEach((size) => {
            // Count merged sizes toward the merged label
            if (etrto_622_sizes.includes(size)) {
              if (all_sizes[etrto_622_label] !== undefined) {
                all_sizes[etrto_622_label]++
              }
            } else {
              if (all_sizes[size] !== undefined) {
                all_sizes[size]++
              }
            }
          })
        }
      })

      // Sort numerically for proper ordering
      return Object.entries(all_sizes).sort((a, b) => {
        const numA = parseFloat(a[0])
        const numB = parseFloat(b[0])
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB
        }
        return a[0].localeCompare(b[0])
      })
    },
    unknown_wheel_size_count() {
      // Filter bikes based on bike_type_filter and search
      const bikes_to_count = this.filtered_bikes_with_search.filter((bike) => {
        // Apply bike type filter if active
        if (this.bike_type_filter) {
          const types = bike.bike_type ? bike.bike_type.split('/') : []
          if (!types.includes(this.bike_type_filter)) return false
        }
        return true
      })

      // Count bikes without wheel size information
      return bikes_to_count.filter((bike) => {
        return !bike.wheel_size || bike.wheel_size.length === 0
      }).length
    },
    filtered_bikes() {
      // Sizes to merge into one button (ETRTO 622mm rim standard)
      const etrto_622_sizes = ['28', '29', '700c']
      const etrto_622_label = '28/29/700c'

      return this.filtered_bikes_with_search.filter((bike) => {
        // Bike type filter
        if (this.bike_type_filter) {
          const types = bike.bike_type ? bike.bike_type.split('/') : []
          if (!types.includes(this.bike_type_filter)) return false
        }

        // Wheel size filter
        if (this.wheel_size_filter) {
          if (this.wheel_size_filter === 'unknown') {
            // Show only bikes without wheel size information
            if (bike.wheel_size && bike.wheel_size.length > 0) return false
          } else if (this.wheel_size_filter === etrto_622_label) {
            // Show bikes with any of the merged wheel sizes
            if (!bike.wheel_size || bike.wheel_size.length === 0) return false
            if (!bike.wheel_size.some((size) => etrto_622_sizes.includes(size))) return false
          } else {
            // Show only bikes with the selected wheel size
            if (!bike.wheel_size || bike.wheel_size.length === 0) return false
            if (!bike.wheel_size.includes(this.wheel_size_filter)) return false
          }
        }

        return true
      })
    },
    filtered_bikes_with_search() {
      return this.$filterBikesBySearch(this.bikes, this.search_str)
    },
    compareBikesText() {
      const count = this.selected_bikes.length
      const fullText = this.$t('message.compare_bikes', { count })

      // The translation format is "Compare {count} bike | Compare {count} bikes"
      // We need to split around the count number
      const countStr = count.toString()

      // Try to find the count in the text
      const countIndex = fullText.indexOf(countStr)

      if (countIndex !== -1) {
        const beforeCount = fullText.substring(0, countIndex).trim()
        const afterCount = fullText.substring(countIndex + countStr.length).trim()

        return {
          prefix: beforeCount,
          suffix: afterCount
        }
      }

      // Fallback: if we can't find the exact count, try to split by common patterns
      const patterns = [
        /(\d+)\s+bike/, // number followed by "bike"
        /(\d+)\s+vélos/, // number followed by "vélos"
        /(\d+)/ // any number
      ]

      for (const pattern of patterns) {
        const match = fullText.match(pattern)
        if (match) {
          const matchedNumber = match[1]
          const parts = fullText.split(matchedNumber)
          if (parts.length === 2) {
            return {
              prefix: parts[0].trim(),
              suffix: parts[1].trim()
            }
          }
        }
      }

      // Final fallback: return the full text as prefix
      return {
        prefix: fullText,
        suffix: ''
      }
    }
  },
  methods: {
    getBikePreviewImage(bike) {
      const thumb = this.bike_images_preview_urls.find((i) => i.original_filename === bike.src)
      if (!thumb) return
      return thumb.url
    },
    onBikePreviewClick(bike_id) {
      this.selected_bikes = this.selected_bikes.includes(bike_id)
        ? this.selected_bikes.filter((id) => id !== bike_id)
        : [...this.selected_bikes, bike_id]
    },
    startComparison() {
      this.$router.push({
        query: {
          bikes: this.selected_bikes.join(',')
        }
      })
    },

    onBikeTypeFilterClick(bike_type) {
      if (this.bike_type_filter === bike_type) {
        this.bike_type_filter = null
      } else {
        this.bike_type_filter = bike_type
      }
    },
    onWheelSizeFilterClick(wheel_size) {
      if (this.wheel_size_filter === wheel_size) {
        this.wheel_size_filter = null
      } else {
        this.wheel_size_filter = wheel_size
      }
    },
    isInchesSize(wheel_size) {
      const num = parseFloat(wheel_size)
      return !isNaN(num) && num >= 16 && num <= 29
    },
    getBikeTypes(bike) {
      // Handle bike_type with slash-separated values
      return bike.bike_type ? bike.bike_type.split('/') : []
    },
    bikeStyleColor(bike_type) {
      return {
        backgroundColor: this.$root.$bikeTypesColors[bike_type]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
._listOfBikes {
  position: relative;
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // gap: 10px;
  z-index: 10;
  background-color: var(--color-background);
  overflow-y: auto;
  height: 100%;
  padding: 0 1rem;
}

._banner {
  // text-align: center;
  // aspect-ratio: 3/1;
  // background-color: white;
  border-radius: 0.5rem;
  margin: 2rem auto;
  gap: 0.5rem;
  width: 100%;

  display: flex;
  flex-flow: row wrap;
  // justify-content: center;
  // align-items: center;
  // width: 100%;

  // padding: 0.5rem;

  > * {
    flex: 1 1 30ch;
  }

  h1 {
    max-width: 16ch;
    // margin: 0 1rem;
  }

  ._credits {
  }

  :deep(._madeBy hr) {
    max-width: 2ch;
  }
}
._lang_select {
  // position: absolute;
  // top: 1rem;
  // right: 1rem;
}

._topBar {
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
}

._filters {
  display: flex;
  flex-flow: column;
  gap: 0;
  flex: 1 1 30ch;
  align-items: flex-end;
}

._bikeTypeFilter {
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
  padding: 0.5rem 0;
  justify-content: flex-end;

  button {
    position: relative;
    padding: 0.25rem 0.5rem;
    color: black;
    font-weight: normal;
    font-size: 0.8rem;

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      transform: rotate(-5deg) scale(1.2);
      z-index: 11;
      // background-color: white !important;
    }

    &.is--active {
      z-index: 10;
      font-weight: bold;
      transform: rotate(-10deg) scale(1.4) !important;
    }

    &.is--disabled {
      opacity: 0.3;
      cursor: not-allowed;
      filter: grayscale(0.8);
    }

    ._count {
      font-size: 0.6rem;
      font-weight: normal;
      border-radius: 0.5rem;
      padding: 0;
      font-weight: bold;
      // background-color: rgba(50, 50, 50, 0.2);
    }
  }
}

._wheelSizeFilter {
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
  padding: 0.5rem 0;
  align-items: center;
  justify-content: flex-end;

  > span {
    font-weight: normal;
    margin-right: 0.5rem;
  }

  button {
    position: relative;
    padding: 0.25rem 0.75rem;
    background-color: rgba(200, 200, 200, 0.4);
    color: black;
    font-weight: normal;
    font-size: 0.8rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      transform: scale(1.1);
      z-index: 10;
      // background-color: rgba(200, 200, 200, 0.7);
    }

    &.is--active {
      z-index: 10;
      background-color: var(--color-accent);
      font-weight: bold;
      transform: scale(1.15);
    }

    &.is--disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background-color: rgba(200, 200, 200, 0.2);
    }

    ._count {
      font-size: 0.6rem;
      font-weight: bold;
      margin-left: 0.25rem;
    }

    &._unknownWheelSize {
      background-color: rgba(150, 150, 150, 0.3);
      font-style: italic;

      &:hover:not(:disabled),
      &:focus-visible:not(:disabled) {
        background-color: rgba(150, 150, 150, 0.5);
      }

      &.is--active {
        // background-color: rgba(100, 100, 100, 0.7);
        color: white;
      }
    }
  }
}

._bikesPreview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
  width: 100%;

  @media (max-width: 560px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
._bikePreview {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 3/2;
  aspect-ratio: 1;
  height: 100%;
  // box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  border: 2px solid transparent;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 2rem;
  // outline: 2px solid transparent;

  transition: all 0.3s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.8);
  }

  &.is--selected {
    border-color: var(--color-accent);
    background-color: rgba(255, 255, 255, 0.8);
  }

  img {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 90%;
    object-fit: contain;
    object-position: center center;
    transform: scale(var(--scale-factor));
    pointer-events: none;
  }

  ._bikeTypes {
    position: absolute;
    top: 0;
    right: 0;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  ._bikeType {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    background-color: rgba(0, 0, 0, 0.8);
  }

  ._bikeLabel {
    position: absolute;
    --margin: 0rem;
    bottom: var(--margin);
    left: var(--margin);
    right: var(--margin);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: initial;
    text-transform: initial;
  }

  ._checkmark {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    background-color: var(--color-accent);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
    //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

._floatingCompareButton {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  padding: 3rem 1rem;
  text-align: center;

  > button {
    // position: fixed;
    // background-color: var(--color-accent);
    // position: relative;
    pointer-events: all;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);

    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    ._count {
      display: inline-block;
      font-weight: bold;
    }
  }
}

/* Count transition styles */
.count-enter-active,
.count-leave-active {
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.count-enter-from,
.count-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

.count-enter-to,
.count-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

._addMissingBike {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  text-align: center;
  min-height: 20ch;
}

._search {
  flex: 0 1 30ch;
  // min-width: 30ch;
}
</style>
