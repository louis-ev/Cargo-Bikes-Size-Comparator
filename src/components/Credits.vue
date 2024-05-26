<template>
  <div class="_madeBy">
    <div>
      Created by <a href="https://louiseveillard.com/" target="_blank">Louis Eveillard</a> in Nantes
      (FR), with contributions from around the world.
    </div>
    <div>
      Report errors and bugs / send feedbacks / contribute bikes
      <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator" target="_blank"
        >on Github</a
      >
      or
      <a href="mailto:hello@louiseveillard.com" target="_blank">via email</a>
    </div>
    <div>No cookies, no tracking, no ads, and fully RGPD-compliant. Website hosted in France.</div>
    <hr />
    <div>
      Specific measures taken from
      <a
        href="https://docs.google.com/spreadsheets/d/1vPCfYStt8fXQQtYDFfNS70kR8B2V2dDwAs_r0VlUlWw/"
        target="_blank"
      >
        this document
      </a>
    </div>
    <div>
      Source code
      <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator" target="_blank">
        available on Github
      </a>
    </div>
    <div>
      Code/design
      <button type="button" class="noStyle" @click="show_license = !show_license">
        free, open-source under AGPLv3</button
      >, bike images from the manufacturer's website.
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
export default {
  props: {},
  components: {},
  data() {
    return {
      show_license: false
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
<style lang="scss" scoped></style>
