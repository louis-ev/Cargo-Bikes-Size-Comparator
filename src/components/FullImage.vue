<template>
  <BasicModal :size="'full'">
    <template v-slot:header>{{ $t('message.picture_from') }} {{ from }} </template>
    <template v-slot:content>
      <img class="_img" :src="src" />
    </template>
  </BasicModal>
</template>
<script>
import BasicModal from '@/components/BasicModal.vue'

export default {
  props: {
    from: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },
  components: { BasicModal },
  data() {
    return {}
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
._img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #555;
}
</style>
