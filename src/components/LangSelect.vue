<template>
  <div class="locale-changer">
    <select v-model="locale">
      <option v-for="lang in langs" :key="lang.value" :value="lang.value">
        {{ lang.label }}
      </option>
    </select>

    <div class="unit-toggle">
      <span>{{ $t('message.unit') }}:</span>
      <div class="unit-radio-group">
        <label class="unit-radio-label">
          <input type="radio" name="unit" value="cm" v-model="unit" @change="toggleUnit" />
          <span> {{ $t('message.centimeters') }} </span>
        </label>
        <label class="unit-radio-label">
          <input type="radio" name="unit" value="in" v-model="unit" @change="toggleUnit" />
          <span> {{ $t('message.inches') }} </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'locale-changer',
  data() {
    return {
      locale: this.$i18n.locale,
      langs: [
        { label: 'english', value: 'en' },
        { label: 'français', value: 'fr' }
      ],
      unit: this.$root.useInches ? 'in' : 'cm'
    }
  },
  watch: {
    locale(new_locale) {
      this.$i18n.locale = new_locale
      document.documentElement.lang = new_locale
      localStorage.setItem('i18n.locale', new_locale)
    }
  },
  methods: {
    toggleUnit() {
      const useInches = this.unit === 'in'
      this.$root.useInches = useInches
    }
  }
}
</script>
<style lang="scss" scoped>
.locale-changer {
  // display: flex;
  // flex-flow: row wrap;
  // justify-content: center;
  // text-align: right;
  // position: absolute;
  // right: 10px;
  // top: 10px;
}

.unit-toggle {
  display: flex;
  // justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0 0;
}

.unit-radio-group {
  display: flex;
  gap: 0.5rem;
  // justify-content: center;
}

.unit-radio-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;

  input[type='radio'] {
    margin: 0;
  }

  span {
    user-select: none;
  }
}
</style>
