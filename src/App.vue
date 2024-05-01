<template>
  <div class="">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <RouterView :cargo_data="cargo_data" />
  </div>
</template>
<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  props: {},
  components: {
    RouterLink,
    RouterView
  },
  data() {
    return {
      cargo_data: undefined
    }
  },
  created() {
    this.loadCargo()
  },
  mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {},
  methods: {
    loadCargo() {
      fetch('/Cargo bike measurements - Bakfiets.csv')
        .then((response) => response.text())
        .then((csv) => {
          const data = this.csvJSON(csv)

          this.cargo_data = data.map((item) => {
            item.Model = item.Model ? item.Model.replaceAll('/', '_').trim() : 'NOT_AVAILABLE'
            item.Manufacturer = item.Manufacturer
              ? item.Manufacturer.replaceAll('/', '_')
              : 'NOT_AVAILABLE'
            item.id = item.Model + '/' + item.Manufacturer
            return item
          })
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
