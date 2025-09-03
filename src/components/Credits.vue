<template>
  <div class="_madeBy">
    <div>Version {{ version }}</div>

    <div>
      {{ $t('message.created_by') }}
      <a href="https://louiseveillard.com/" target="_blank">Louis Eveillard</a>
      {{ $t('message.in_Nantes') }}
    </div>
    <div>
      {{ $t('message.report_errors_and_bugs') }}
      <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator" target="_blank">{{
        $t('message.on_Github')
      }}</a>
      {{ $t('message.or') }}
      <a href="mailto:hello@louiseveillard.com" target="_blank">{{ $t('message.via_email') }}</a
      >.
    </div>
    <div>{{ $t('message.no_tracking_cookies_no_ads_and_fully_rgpd_compliant') }}</div>
    <hr />
    <div>
      {{ $t('message.specific_measures_taken_from') }}
      <a
        href="https://docs.google.com/spreadsheets/d/1vPCfYStt8fXQQtYDFfNS70kR8B2V2dDwAs_r0VlUlWw/"
        target="_blank"
      >
        {{ $t('message.this_document') }} </a
      >.
    </div>
    <div>
      {{ $t('message.source_code') }}
      <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator" target="_blank">
        {{ $t('message.available_on_Github') }} </a
      >.
    </div>
    <div>
      {{ $t('message.code_design_foss') }}
      <button type="button" class="noStyle" @click="show_license = !show_license">AGPLv3</button>,
      {{ $t('message.bike_images_from_the_manufacturer_s_website') }}
    </div>

    <div>
      <button type="button" data-color="black" @click="$emit('showAddBikeModal')">
        ＋
        {{ $t('message.add_a_bike') }}
      </button>
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
</template>
<script>
import { version } from '../../package.json'

export default {
  props: {},
  components: {},
  data() {
    return {
      show_license: false,
      version: version
    }
  },
  created() {},
  mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
._madeBy {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);

  > *:not(hr) {
    margin-bottom: 0.25rem;
  }
}
</style>
