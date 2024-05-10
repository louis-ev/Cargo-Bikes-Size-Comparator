<template>
  <div class="">
    <!-- <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav> -->
    <RouterView :bikes="sorted_bikes" />
  </div>
</template>
<script>
import { RouterLink, RouterView } from 'vue-router'
import bikes from '@/assets/bike_images.json'

export default {
  props: {},
  components: {
    RouterLink,
    RouterView
  },
  data() {
    return {
      bikes: bikes,
      measurements: []
    }
  },
  created() {
    this.loadCargo()
  },
  mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {
    supercharged_bikes() {
      return this.bikes.map((item) => {
        const found = this.measurements.find(
          (i) => (i.Manufacturer || '') + '/' + (i.Model || '') === item.id_in_csv
        )
        if (found) item._measurements = found
        return item
      })
    },
    sorted_bikes() {
      if (!this.supercharged_bikes) return []
      return this.supercharged_bikes.slice().sort((a, b) => {
        return a.bike_length_cm - b.bike_length_cm
      })
    }
  },
  methods: {
    loadCargo() {
      fetch('./Cargo bike measurements - Bakfiets.csv')
        .then((response) => response.text())
        .then((csv) => {
          const data = this.csvJSON(csv)
          this.measurements = data
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
    }
  }
}
</script>
<style lang="scss" scoped></style>
