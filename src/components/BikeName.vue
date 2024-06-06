<template>
  <div v-if="bike">
    <strong>{{ bike.model || bike.manufacturer }}</strong>
    <span class="_flag" v-if="bike.frame_made_in">
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
      if (country === 'usa') return '🇺🇸'
      if (country === 'germany') return '🇩🇪'
      if (country === 'france') return '🇫🇷'
      return
    },
    getLengthInInches(length_cm) {
      return (length_cm / 2.54).toFixed(1)
    }
  }
}
</script>
<style lang="scss" scoped>
._flag {
  font-size: 0.8rem;
  margin-left: 0.25rem;
}
</style>
