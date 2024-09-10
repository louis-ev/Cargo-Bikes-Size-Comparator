<template>
  <div v-if="bike" class="_bikeName">
    <strong>{{ bike.model || bike.manufacturer }}</strong>
    <!-- <span class="_bikeType" :style="bikeStyleColor(bike.bike_type)" /> -->
    <span
      class="_flag"
      :title="bike.frame_made_in"
      v-if="bike.frame_made_in && bike.show_frame_origin !== false"
    >
      {{ unicodeFlag(bike.frame_made_in) }}
    </span>
    <template v-if="bike.manufacturer && bike.model">
      <small> – {{ bike.manufacturer }} </small>
    </template>
    <template v-if="show_length">
      <br />
      <small>
        <template v-if="bike.bike_length_cm">
          {{ bike.bike_length_cm }}cm
          <template v-if="$i18n.locale === 'en'">
            –
            {{ getLengthInInches(bike.bike_length_cm) }} inches
          </template>
        </template>
        <template v-else>{{ $t('message.missing_length_information') }}</template>
      </small>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    bike: Object,
    show_length: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {},
  methods: {
    unicodeFlag(country) {
      country = country.toLowerCase()
      if (country === 'usa') return '🇺🇸'
      else if (country === 'taiwan') return '🇹🇼'
      else if (country === 'germany') return '🇩🇪'
      else if (country === 'hungary') return '🇭🇺'
      else if (country === 'denmark') return '🇩🇰'
      else if (country === 'portugal') return '🇵🇹'
      else if (country === 'turkey') return '🇹🇷'
      else if (country === 'france') return '🇫🇷'
      else if (country === 'belgium') return '🇧🇪'
      else if (country === 'italy') return '🇮🇹'
      else if (country === 'europe') return '🇪🇺'
      else if (country === 'china') return '🇨🇳'
      else if (country === 'netherlands') return '🇳🇱'
      else if (country === 'poland') return '🇵🇱'
      else alert('Missing unicode flag: ' + country)
      return
    },
    getLengthInInches(length_cm) {
      return Number((length_cm / 2.54).toFixed(1))
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
._bikeName {
  text-transform: initial;
  font-weight: initial;
}
._flag {
  font-size: 1rem;
  margin-left: 0.25rem;
}
._bikeType {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.25rem;
  margin-left: 0.125rem;
}
</style>
