import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    ignores: ['dist/**', 'dist-ssr/**', 'coverage/**']
  },
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  {
    files: ['src/components/Credits.vue'],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
]
