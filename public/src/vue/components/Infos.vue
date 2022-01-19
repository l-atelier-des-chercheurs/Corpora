<template>
  <div class="m_infos">
    <div class v-if="$root.can_admin_corpora">
      <router-link
        :to="{
          name: 'Corpora',
        }"
        v-html="$t('back')"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.m_infos {
}
</style>
