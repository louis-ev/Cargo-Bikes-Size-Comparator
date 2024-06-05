<template>
  <div class="locale-changer">
    <select v-model="locale">
      <option v-for="lang in langs" :key="lang.value" :value="lang.value">
        {{ lang.label }}
      </option>
    </select>
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
      ]
    }
  },
  watch: {
    locale(new_locale) {
      this.$i18n.locale = new_locale
      document.documentElement.lang = new_locale
      localStorage.setItem('i18n.locale', new_locale)
    }
  }
}
</script>
<style lang="scss" scoped>
.locale-changer {
  // text-align: right;
  // position: absolute;
  // right: 10px;
  // top: 10px;
}
</style>
