<template>
  <div class="_listOfBikes">
    <div class="_banner">
      <div class="_title">
        <h1 v-html="$t('message.title')" />
        <LangSelect class="_lang_select" />
      </div>
      <div class="_credits">
        <Credits />
      </div>
    </div>
    <div class="_topBar">
      <div class="_search">
        <SearchField v-model="search_str" />
      </div>

      <div class="_bikeTypeFilter">
        <span v-html="$t('bike_types.by_category')" />
        <button
          v-for="[bike_type, count] in all_bike_types"
          :key="bike_type"
          type="button"
          :class="{ 'is--active': bike_type_filter === bike_type }"
          :style="bikeStyleColor(bike_type)"
          @click="onBikeTypeFilterClick(bike_type)"
        >
          {{ $t(`bike_types.${bike_type}`) }}
          ({{ count }})
        </button>
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
        <div
          class="_bikeType"
          :style="bikeStyleColor(bike.bike_type)"
          :title="bike.bike_type"
        ></div>
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
      bike_type_filter: null
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
      const bike_types = this.bikes.reduce((acc, bike) => {
        if (!acc[bike.bike_type]) {
          acc[bike.bike_type] = 1
        } else {
          acc[bike.bike_type]++
        }
        return acc
      }, {})
      return Object.entries(bike_types).sort((a, b) => b[1] - a[1])
    },
    filtered_bikes() {
      return this.filtered_bikes_with_search.filter(
        (bike) => !this.bike_type_filter || bike.bike_type === this.bike_type_filter
      )
    },
    filtered_bikes_with_search() {
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
          bikes: JSON.stringify(this.selected_bikes)
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
    flex: 1 1 0;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    max-width: 17ch;
    // margin: 0 1rem;
  }

  ._credits {
  }

  :deep {
    ._madeBy {
      hr {
        max-width: 2ch;
      }
    }
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
  align-items: center;
  padding: 1rem 0;
}

._bikeTypeFilter {
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
  padding: 1rem 0;

  button {
    position: relative;
    padding: 0.25rem 0.5rem;
    color: black;
    font-weight: normal;
    font-size: 0.8rem;

    &:hover,
    &:focus-visible {
      transform: rotate(-5deg) scale(1.2);
      z-index: 10;
      // background-color: white !important;
    }

    &.is--active {
      z-index: 10;
      font-weight: bold;
      transform: rotate(-10deg) scale(1.4);
    }
  }
}
._bikesPreview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
  width: 100%;
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

  ._bikeType {
    position: absolute;
    top: 0;
    right: 0;
    width: 0.75rem;
    height: 0.75rem;
    // padding: 0.25rem 0.5rem;
    margin: 1rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    background-color: rgba(0, 0, 0, 0.8);
  }

  ._bikeLabel {
    position: absolute;
    --margin: 0.25rem;
    bottom: var(--margin);
    left: var(--margin);
    right: var(--margin);
    padding: 0.25rem 1rem;
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
