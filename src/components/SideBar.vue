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
          <button class="_reset" @click="resetBikes">Reset</button>
        </template>
      </small>
    </template>

    <transition-group tag="div" class="_bikeList" name="list">
      <div
        class="_item"
        v-for="item in filtered_bikes"
        :key="item.id"
        :data-active="bikeIsEnabled(item.id)"
      >
        <label :for="item.id" class="_itemTop">
          <input
            type="checkbox"
            :checked="bikeIsEnabled(item.id)"
            :id="item.id"
            :disabled="!item.bike_length_cm"
            @change="toggleBike(item.id)"
          />

          <div class="_names">
            <strong
              >{{ item.model || item.manufacturer }}
              <span class="_flag" v-if="item.frame_made_in">
                {{ unicodeFlag(item.frame_made_in) }}
              </span>
            </strong>
            <template v-if="item.manufacturer && item.model">
              <small> – {{ item.manufacturer }} </small>
            </template>
            <br />
            <small>
              <template v-if="item.bike_length_cm">{{ item.bike_length_cm }} cm</template>
              <template v-else>Missing length information</template>
            </small>
          </div>

          <div v-if="item.id" class="_img">
            <div
              v-if="bikeIsEnabled(item.id) && canvas_image_style_outline"
              class="_color"
              :style="{ '--outline-color': `#${item.color}` }"
            />
            <img :src="getBikeThumbImage(item)" />
          </div>
        </label>

        <div class="_itemBottom" v-if="bikeIsEnabled(item.id)">
          <div class="_madeIn" v-if="item.frame_made_in">
            Bike mostly manufactured and assembled in <strong>{{ item.frame_made_in }}</strong
            >.
          </div>

          <div class="_measurements" v-if="item._measurements">
            <small v-html="getMeasurements(item)" />
            <br />
          </div>
          <div class="_source">
            <a :href="item.url" target="_blank"> <span>&#8594;</span>website</a>
          </div>
        </div>
      </div>
    </transition-group>

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

    <div class="_madeBy">
      <div>
        Created by <a href="https://louiseveillard.com/" target="_blank">Louis Eveillard</a> in
        Nantes (FR), with contributions from around the world.
      </div>
      <div>
        Report errors and bugs / send feedbacks / contribute bikes
        <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator" target="_blank"
          >on Github</a
        >
        or
        <a href="mailto:hello@louiseveillard.com" target="_blank">via email</a>
      </div>
      <div>
        No cookies, no tracking, no ads, and fully RGPD-compliant. Website hosted in France.
      </div>
      <hr />
      <div>
        Specific measures taken from
        <a
          href="https://docs.google.com/spreadsheets/d/1vPCfYStt8fXQQtYDFfNS70kR8B2V2dDwAs_r0VlUlWw/"
          target="_blank"
        >
          this document
        </a>
      </div>
      <div>
        Source code
        <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator" target="_blank">
          available on Github
        </a>
      </div>
      <div>
        Code/design
        <button type="button" class="noStyle" @click="show_license = !show_license">
          free, open-source under AGPLv3</button
        >, bike images from the manufacturer's website.
      </div>

      <template v-if="show_license">
        <div class="_license">
          <pre>
Copyright (C) 2024 Louis Eveillard

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.
              </pre
          >
        </div>
      </template>
    </div>
  </div>
</template>
<script>
const bike_images_thumbs_paths = import.meta.glob('@/assets/bikes/*.png', {
  query: { format: 'png', w: 100 }
})

export default {
  props: {
    bikes: Array,
    enabled_bikes: Array,
    canvas_image_style_outline: Boolean
  },
  components: {},
  data() {
    return {
      search_str: '',
      show_license: false,
      bike_images_thumbs_urls: []
    }
  },
  created() {},
  async mounted() {
    this.bike_images_thumbs_urls = await this.loadAllThumbs()
  },
  beforeUnmount() {},
  watch: {},
  computed: {
    filtered_bikes() {
      return this.bikes.filter((bike) => {
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
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    },
    resetBikes() {
      this.$router.push({
        query: {}
      })
    },
    unicodeFlag(country) {
      if (country === 'USA') return '🇺🇸'
      if (country === 'Germany') return '🇩🇪'
      if (country === 'France') return '🇫🇷'
      return
    },
    async loadAllThumbs() {
      const urls = []
      for (let [source, thumb] of Object.entries(bike_images_thumbs_paths)) {
        const import_statment = thumb()
        const url = (await import_statment).default
        const original_filename = source.split('/').pop()
        urls.push({
          url,
          original_filename
        })
      }
      return urls
    },
    getMeasurements(bike) {
      return Object.entries(bike._measurements)
        .reduce((acc, [k, v]) => {
          if (k && k !== '\r' && v && v !== '\r') acc.push(`${k}: ${v}`)
          return acc
        }, [])
        .join('<br>')
    },

    getBikeThumbImage(bike) {
      const thumb = this.bike_images_thumbs_urls.find((i) => i.original_filename === bike.src)
      if (!thumb) return
      return thumb.url
    },
    bikeIsEnabled(id) {
      return this.enabled_bikes.some((i) => i.id === id)
    },
    toggleBike(id) {
      let enabled_bikes_ids = this.enabled_bikes.map((b) => b.id)
      if (enabled_bikes_ids.includes(id)) {
        enabled_bikes_ids = enabled_bikes_ids.filter((i) => i !== id)
      } else {
        enabled_bikes_ids.push(id)
      }
      this.$router.push({
        query: {
          bikes: JSON.stringify(enabled_bikes_ids)
        }
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

._bikeList {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

._item {
  line-height: 1.2;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;

  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);

  &[data-active='true'] ._itemTop {
    background-color: var(--color-accent);

    img {
      filter: grayscale(100%);
      mix-blend-mode: multiply;
    }
  }

  &:hover,
  &:focus-visible {
    // box-shadow: 0 0.05rem 0.2rem 0rem var(--color-accent);
  }
}

._itemTop {
  padding: 0;

  border-radius: 0.5rem;

  display: flex;
  flex-direction: row nowrap;
  align-items: stretch;
  justify-content: space-between;

  &:not(:has(input[disabled])) {
    cursor: pointer;
  }
  &:has(input[disabled]) {
    cursor: not-allowed;
  }

  overflow: hidden;

  input {
    cursor: pointer;
    margin: 1rem;
  }

  ._names {
    flex: 1 1 auto;
    padding: 0.25rem 0;
    align-self: center;
  }

  input {
    flex: 0 0 auto;
  }
  ._img {
    position: relative;
    flex: 0 0 auto;
    width: 52px;
    padding: 0.25rem;

    ._color {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      opacity: 0.8;
      background-color: #fff;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: var(--outline-color);
      }
    }

    img {
      position: relative;
      height: 100%;
      width: 100%;
      object-fit: scale-down;
      object-position: center;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      &:not(:has(input[disabled])) {
        background-color: var(--color-accent);
      }
    }
  }
}

._advanced {
  display: flex;
  flex-direction: row nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  margin-bottom: 0.25rem;
}

._itemBottom {
  padding: 0.5rem 1rem 1rem;
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
}
._measurements {
  margin-bottom: 0.5rem;
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

._madeBy {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);

  > * {
    margin-bottom: 0.5rem;
  }
}

._reset {
  padding: 0 0.25rem;

  cursor: pointer;
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

._flag {
  font-size: 0.6rem;
  margin-left: 0.15rem;
}
</style>
