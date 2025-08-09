<template>
  <div class="">
    <RouterView :bikes="sorted_bikes" />
  </div>
</template>
<script>
import { RouterView } from 'vue-router'
import bikes from '@/assets/bike_images.json'

export default {
  props: {},
  components: {
    RouterView
  },
  data() {
    return {
      bikes: bikes,
      local_bikes: [],
      bakfiets_measures: [],
      longtails_measures: [],

      draw_rect_in_canvas: {
        active: false,
        l: 0,
        b: 0,
        w: 20,
        h: 20,
        r: 0
      },
      accessories_in_canvas: {
        active: false,
        type: 'bakkie',
        l: 0, // left position in cm
        b: 0 // bottom position in cm
      }
    }
  },
  created() {
    this.loadBakfiets()
    this.loadLongtails()
    if (localStorage.getItem('draw_rect_in_canvas')) {
      try {
        this.draw_rect_in_canvas = JSON.parse(
          localStorage.getItem('draw_rect_in_canvas', JSON.stringify())
        )
      } catch (e) {}
    }
    if (localStorage.getItem('accessories_in_canvas')) {
      try {
        this.accessories_in_canvas = JSON.parse(
          localStorage.getItem('accessories_in_canvas', JSON.stringify())
        )
      } catch (e) {}
    }
  },
  mounted() {},
  beforeUnmount() {},
  watch: {
    draw_rect_in_canvas: {
      handler() {
        localStorage.setItem('draw_rect_in_canvas', JSON.stringify(this.draw_rect_in_canvas))
      },
      deep: true
    },
    accessories_in_canvas: {
      handler() {
        localStorage.setItem('accessories_in_canvas', JSON.stringify(this.accessories_in_canvas))
      },
      deep: true
    }
  },
  computed: {
    supercharged_bikes() {
      return this.bikes
        .filter((item) => item.disabled !== true)
        .map((item) => {
          if (item.id.includes(','))
            alert('id includes comma (forbidden because of URL sharing) for ' + item.id)
          if (typeof item.bike_length_cm !== 'number')
            alert('bike_length_cm is not cm for ' + item.id)

          if (this.all_measures.length > 0) {
            const found = this.all_measures.find(
              (i) => (i.Manufacturer || '') + '/' + (i.Model || '') === item.id_in_csv
            )
            if (found) item._measurements = found
          }
          return item
        })
        .concat(this.local_bikes)
    },
    sorted_bikes() {
      if (!this.supercharged_bikes) return []
      return this.supercharged_bikes
        .slice()
        .sort((a, b) => {
          return a.model.localeCompare(b.model)
        })
        .sort((a, b) => {
          if (a.bike_length_cm && b.bike_length_cm) return a.bike_length_cm - b.bike_length_cm
          else if (a.bike_length_cm && !b.bike_length_cm) return -1
          else if (!a.bike_length_cm && b.bike_length_cm) return 1

          return 0
        })
    },
    all_measures() {
      return this.bakfiets_measures.concat(this.longtails_measures)
    },

    enabled_bikes_ids() {
      if (this.$route.query.bikes) {
        try {
          const bikes = this.$route.query.bikes
          if (bikes.includes('[')) return JSON.parse(bikes)
          else return bikes.split(',')
        } catch (e) {
          return []
        }
      }
      return []
    }
  },
  methods: {
    loadBakfiets() {
      fetch('./Cargo bike measurements - Bakfiets.csv')
        .then((response) => response.text())
        .then((csv) => {
          const data = this.csvJSON(csv)
          this.bakfiets_measures = data
        })
        .catch((error) => console.error('Erreur lors du chargement du fichier CSV:', error))
    },
    loadLongtails() {
      fetch('./Cargo bike measurements - Longtail_midtail.csv')
        .then((response) => response.text())
        .then((csv) => {
          const data = this.csvJSON(csv)
          this.longtails_measures = data
        })
        .catch((error) => console.error('Erreur lors du chargement du fichier CSV:', error))
    },
    csvJSON(csv) {
      var lines = csv.split('\n')
      var result = []
      var headers = lines[0].split(',')

      for (var i = 1; i < lines.length; i++) {
        var obj = {}
        var currentline = lines[i].split(',')

        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j]
        }

        result.push(obj)
      }
      return result
    },
    updateBikesQuery(enabled_bikes_ids) {
      let query = JSON.parse(JSON.stringify(this.$route.query)) || {}
      query.bikes = enabled_bikes_ids.join(',')
      this.$router.push({
        query
      })
    },
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
<style lang="scss">
input {
  font-size: inherit;
}

._search {
  position: relative;
  // margin-bottom: 1rem;

  input {
    width: 100%;
    padding-right: 1.7em;
  }

  button {
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
    line-height: 0;
    width: 1.5em;
    height: 1.5em;
    padding: 0;

    background-color: var(--color-accent);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade_fast-enter-active,
.fade_fast-leave-active {
  transition: opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1);
}
.fade_fast-enter-from,
.fade_fast-leave-to {
  opacity: 0;
}

.scale {
  &-enter-active,
  &-leave-active {
    transition: transform 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  }
  &-enter-from,
  &-leave-to {
    transform: scale(0);
  }
}
.loader {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.25s 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
.comparebtn {
  &-enter-active,
  &-leave-active {
    // position: absolute;
    transition: opacity 0.25s 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  }
  &-enter-from,
  &-leave-to {
    // position: absolute;
    transform: translateY(100%);
    opacity: 0;
  }
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  position: relative;
  transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}

.list-enter-from,
.list-leave-to {
  position: absolute;
  opacity: 0;
  transform: scale(0.2);
}

.list-leave-active {
  position: absolute;
  z-index: -1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.slideup-enter-active,
.slideup-leave-active {
  transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
}
.slideup-enter-from,
.slideup-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.showPreview-enter-active,
.showPreview-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.showPreview-enter-from,
.showPreview-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.listComplete {
  &-move {
    position: relative;
    transition:
      transform 0.6s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1) !important;
  }

  &-leave-active {
    position: absolute !important;
    z-index: 0 !important;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
