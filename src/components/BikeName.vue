<template>
  <div v-if="bike" class="_bikeName">
    <strong>{{ bike.model || bike.manufacturer }}</strong>
    <!-- <span class="_bikeType" :style="bikeStyleColor(bike.bike_type)" /> -->
    <span
      class="_flag"
      :title="bike.frame_made_in"
      v-if="shouldShowFrameMadeIn && bike.show_frame_origin !== false"
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
          <template v-if="useInches">
            {{ getLengthInInches(bike.bike_length_cm) }} inches
          </template>
          <template v-else> {{ getLengthInCm(bike.bike_length_cm) }}cm </template>
        </template>
        <template v-else>{{ $t('message.missing_length_information') }}</template>
      </small>
    </template>
  </div>
</template>
<script>
import { shouldShowFrameMadeIn as shouldShowFrameMadeInHelper, unicodeFlag } from '@/helpers.js'

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
  computed: {
    useInches() {
      return this.$root.useInches
    },
    shouldShowFrameMadeIn() {
      return shouldShowFrameMadeInHelper(this.bike.frame_made_in)
    }
  },
  methods: {
    unicodeFlag,
    getLengthInCm(length_cm) {
      return Math.round(length_cm)
    },
    getLengthInInches(length_cm) {
      return Number((length_cm / 2.54).toFixed(1))
    },
    bikeStyleColor(bike_type) {
      // Handle bike_type with slash-separated values
      const types = bike_type ? bike_type.split('/') : []
      const firstType = types[0]
      return {
        backgroundColor: this.$root.$bikeTypesColors[firstType]
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
